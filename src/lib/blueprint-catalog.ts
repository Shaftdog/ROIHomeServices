/**
 * Billionaire Appraisal Platform (BAP) catalog — SERVER ONLY.
 *
 * SECURITY / SOURCE OF TRUTH
 * The BAP offer architecture (products, prices, step ordering, groups) is owned
 * by the Salesmod CRM's `products` table. This module is the marketing site's
 * READ-ONLY view of it. Mirrors the guarantee in src/lib/products.ts: the client
 * can never influence what we charge — API routes resolve an amount from this
 * catalog using a SKU only and never read an amount from a request body.
 *
 * READ-ONLY: this module only ever issues GETs against PostgREST. Nothing here
 * may write to the Salesmod database (it is live production with paying clients).
 *
 * REQUIRED ENV (server-side only — never NEXT_PUBLIC_*):
 *   SALESMOD_SUPABASE_URL   e.g. https://<project>.supabase.co
 *   SALESMOD_SUPABASE_ANON_KEY
 *
 * DELIBERATELY THE ANON KEY, NOT THE SERVICE ROLE KEY. `products` RLS used to be
 * granted only TO authenticated, so anon returned [] and reading a price list
 * appeared to require the service role. That trade was badly lopsided: the
 * service key bypasses RLS across the whole Salesmod database — every tenant's
 * deals, documents, analyses and client records — and this is a public web
 * server. Salesmod migration 20260730000000_public_bap_price_list.sql instead
 * publishes exactly the rows this page renders (BAP-%, active, not deleted, ROI
 * tenant) to anon, SELECT only. Verified: the anon key sees 11 product rows and
 * zero rows from deals, deal_certified_analyses, profiles, clients and orders.
 *
 * If this file ever needs the service role again, that is a signal the data
 * being asked for is not public — solve it with a policy, not a bigger key.
 *
 * OPTIONAL:
 *   SALESMOD_CATALOG_TENANT_ID   extra tenant filter, defence in depth on top of
 *                                the policy's own tenant predicate.
 */

import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

const catalogLogger = createChildLogger({ context: LOG_CONTEXTS.DATABASE });

/** The four groups the offer architecture is organized into (`props.group`). */
export type BlueprintGroup =
  | 'billionaire-tripwire'
  | 'billionaire-ladder'
  | 'billionaire-package'
  | 'billionaire-addon';

export const BLUEPRINT_GROUP_ORDER: BlueprintGroup[] = [
  'billionaire-tripwire',
  'billionaire-ladder',
  'billionaire-package',
  'billionaire-addon',
];

/**
 * A catalog row, normalized for the wire. Deliberately narrow: internal fields
 * on `props` (production_template_id, tenant_id, org_id) are NEVER serialized.
 */
export interface BlueprintProduct {
  sku: string;
  name: string;
  description: string;
  /** Retail price in cents. Server-resolved; the authoritative charge amount. */
  amountCents: number;
  /** Discounted price offered on the webinar, when the catalog defines one. */
  webinarAmountCents: number | null;
  /** 'month' when the SKU is sold as a recurring subscription; null for one-time. */
  billingInterval: 'month' | null;
  /** Annual-plan price in cents, when a subscription SKU offers one (`props.billing.annual_price`). */
  annualAmountCents: number | null;
  group: BlueprintGroup;
  sortOrder: number;
  /** 1..5 for the ladder rungs; absent for tripwire/packages/addons. */
  step: number | null;
  /** Deal-lifecycle phase the product fires in, e.g. "Acquire", "Exit / Refi". */
  phase: string | null;
  flagship: boolean;
  currency: 'usd';
}

/** Thrown when the catalog cannot be read. Callers degrade rather than guess a price. */
export class CatalogUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CatalogUnavailableError';
  }
}

/** Shape returned by PostgREST for the columns we select. */
interface CatalogRow {
  sku: string | null;
  name: string;
  description: string | null;
  base_price: number | string;
  sort_order: number | null;
  props: Record<string, unknown> | null;
}

const SELECT_COLUMNS = 'sku,name,description,base_price,sort_order,props';

/** numeric(12,2) -> integer cents, without floating-point drift. */
function toCents(basePrice: number | string): number {
  const n = typeof basePrice === 'string' ? Number.parseFloat(basePrice) : basePrice;
  if (!Number.isFinite(n) || n < 0) {
    throw new CatalogUnavailableError(`Invalid base_price in catalog: ${String(basePrice)}`);
  }
  return Math.round(n * 100);
}

function readGroup(props: Record<string, unknown> | null): BlueprintGroup | null {
  const group = props?.group;
  return typeof group === 'string' && (BLUEPRINT_GROUP_ORDER as string[]).includes(group)
    ? (group as BlueprintGroup)
    : null;
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalize(row: CatalogRow): BlueprintProduct | null {
  const group = readGroup(row.props);
  // A BAP row with no recognized group has no home on the page; skip it rather
  // than inventing a placement.
  if (!row.sku || !group) return null;

  const webinarPrice = readNumber(row.props?.webinar_price);

  // Subscription SKUs declare `props.billing = { interval: 'month', annual_price? }`.
  // Only 'month' is recognized; anything else stays a one-time purchase.
  const billing =
    row.props?.billing && typeof row.props.billing === 'object'
      ? (row.props.billing as Record<string, unknown>)
      : null;
  const billingInterval = billing?.interval === 'month' ? ('month' as const) : null;
  const annualPrice = billingInterval ? readNumber(billing?.annual_price) : null;

  return {
    sku: row.sku,
    name: row.name,
    description: row.description ?? '',
    amountCents: toCents(row.base_price),
    webinarAmountCents: webinarPrice === null ? null : Math.round(webinarPrice * 100),
    billingInterval,
    annualAmountCents: annualPrice === null ? null : Math.round(annualPrice * 100),
    group,
    sortOrder: row.sort_order ?? 0,
    step: readNumber(row.props?.step),
    phase: typeof row.props?.phase === 'string' ? row.props.phase : null,
    flagship: row.props?.flagship === true,
    currency: 'usd',
  };
}

/**
 * Fetch the active BAP catalog, sorted by `sort_order`.
 *
 * Cached for 5 minutes so a landing-page render doesn't hit the CRM database on
 * every request; a price change in Salesmod propagates within that window.
 *
 * @throws CatalogUnavailableError when unconfigured or the read fails, so callers
 *         render an honest "pricing unavailable" state instead of a stale number.
 */
export async function fetchBlueprintCatalog(): Promise<BlueprintProduct[]> {
  const baseUrl = process.env.SALESMOD_SUPABASE_URL;
  // Anon key by design — see the module header. Never swap this for the service
  // role key; that would put a full-database credential on a public server.
  const anonKey = process.env.SALESMOD_SUPABASE_ANON_KEY;

  if (!baseUrl || !anonKey) {
    throw new CatalogUnavailableError(
      'Catalog not configured — set SALESMOD_SUPABASE_URL and SALESMOD_SUPABASE_ANON_KEY'
    );
  }

  const params = new URLSearchParams({
    select: SELECT_COLUMNS,
    sku: 'like.BAP-%',
    is_active: 'eq.true',
    deleted_at: 'is.null',
    order: 'sort_order.asc',
  });
  const tenantId = process.env.SALESMOD_CATALOG_TENANT_ID;
  if (tenantId) params.set('tenant_id', `eq.${tenantId}`);

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/rest/v1/products?${params.toString()}`, {
      method: 'GET',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    });
  } catch (err) {
    catalogLogger.error({ err }, 'BAP catalog fetch failed');
    throw new CatalogUnavailableError('Catalog is temporarily unreachable');
  }

  if (!res.ok) {
    catalogLogger.error({ status: res.status }, 'BAP catalog read returned non-OK');
    throw new CatalogUnavailableError(`Catalog read failed with status ${res.status}`);
  }

  const rows = (await res.json()) as CatalogRow[];
  const products = rows
    .map(normalize)
    .filter((p): p is BlueprintProduct => p !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (products.length === 0) {
    throw new CatalogUnavailableError('Catalog returned no active BAP products');
  }

  return products;
}

/**
 * Server-only price resolver used by the checkout route. Pricing comes
 * EXCLUSIVELY from the catalog keyed by SKU. Returns `null` for an unknown SKU so
 * the route can reject with 400 rather than charge an arbitrary amount.
 */
export async function resolveBlueprintProduct(sku: string): Promise<BlueprintProduct | null> {
  const catalog = await fetchBlueprintCatalog();
  return catalog.find((p) => p.sku === sku) ?? null;
}

/** Group the catalog, preserving `sort_order` within each group. */
export function groupCatalog(
  products: BlueprintProduct[]
): Record<BlueprintGroup, BlueprintProduct[]> {
  const grouped = {
    'billionaire-tripwire': [],
    'billionaire-ladder': [],
    'billionaire-package': [],
    'billionaire-addon': [],
  } as Record<BlueprintGroup, BlueprintProduct[]>;

  for (const product of products) grouped[product.group].push(product);
  return grouped;
}

/** Sum of prices, in cents. Used for à-la-carte reference totals. */
export function sumAmountCents(products: BlueprintProduct[]): number {
  return products.reduce((total, p) => total + p.amountCents, 0);
}

/** $750 / $1,497.50 — trailing cents only when they are non-zero. */
export function formatUsd(cents: number): string {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}
