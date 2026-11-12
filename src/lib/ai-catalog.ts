/**
 * Appraisal Intelligence price list — SERVER ONLY.
 *
 * SOURCE OF TRUTH
 * The app (Salesmod, portal.roihomesvc.com) publishes ONE public list of product names, plans, packs
 * and prices at GET /api/public/catalog. This module is the marketing site's READ-ONLY view of it, and
 * like blueprint-catalog.ts it never guesses: a response that is not a 200 carrying a body that passes
 * every check below throws AiCatalogUnavailableError. There are no fallback constants, no default price
 * and no partial catalog. A caller that gets the error shows "Pricing is unavailable right now".
 *
 * SERVER ONLY by convention, the same one blueprint-catalog.ts uses (the `server-only` package is not
 * installed here). Nothing in the file is secret: the route is public, takes no key and no cookie, and
 * the one optional env var below holds a URL, not a credential.
 *
 * No page or component imports this yet (ai-catalog.test.ts checks that).
 *
 * OPTIONAL ENV (server-side only — never NEXT_PUBLIC_*):
 *   AI_CATALOG_URL   full http(s) URL of the route, with no username or password (one that has either is
 *                    refused); defaults to AI_CATALOG_DEFAULT_URL. The repo has no env var
 *                    that holds the app's origin (SALESMOD_WEBHOOK_URL is a webhook endpoint), so this
 *                    one is new, and optional: nothing has to be added to Vercel.
 *
 * WHAT THE ROUTE RETURNS
 * `launch` says which state the app is in; the site never decides it. The two states share `version`,
 * `names`, `packs`, `perDeal` and `disclosure`. They differ in two places:
 *   - a plan before launch carries `analyses`, `checks` and `blurb`; after launch a member plan carries
 *     `credits` instead of all three, and a non-member plan (the newsletter) carries `analyses`;
 *   - after launch the body may also carry `extraCredits` and `rateCard`. An ABSENT key means "not
 *     available": this module returns null for it. Before launch the result is always null for both,
 *     whatever the body holds, so a pre-launch page can never be handed a launch-only figure.
 * Prices are dollars, numbers above zero. Keys this module does not know are ignored, so the app can add
 * fields without breaking the site; a key it needs that is missing or wrong makes the whole read fail.
 *
 * TREAT EVERY STRING AS PLAIN TEXT. `name`, `description`, `blurb`, `disclosure` and the `names` values
 * are stored text. React escapes them when rendered as children; never pass one to
 * dangerouslySetInnerHTML, and a JSON-LD <script> must escape `<` (replace each `<` with the six
 * characters \u003c) before it embeds one. This module builds no JSON-LD.
 *
 * ONE SKU, TWO NAMES. The BAP-DEAL-ANALYZER row carries one name: the name as stored before launch,
 * `names.certified` after. A page that knows the viewer is outside Florida shows `names.mlsSupported`
 * for that SKU instead. The route cannot know where the viewer is, so the rule lives in the page, not
 * here, and there is deliberately no helper for it (the site sells that SKU only in Florida).
 *
 * CACHING. A price change in the app does NOT reach the site within the 5 minutes below:
 *   - the app's route answers with `s-maxage=300, stale-while-revalidate=600`, and its edge cache is in
 *     front of this fetch. Next (`next.revalidate` = 5 minutes) serves its own stale entry first and
 *     refreshes it in the background, so a change shows in about 10 minutes, about 20 at worst.
 *   - Next stores only status-200 answers. If the app starts failing after a good read, the last good body
 *     keeps being served while that entry lives: old prices, not "unavailable".
 *   - a 200 that fails validation is cached too, so that error can last up to 5 minutes after the app is fixed.
 *   - when a change must show at once, purge the site's data cache, or call `revalidateTag('ai-catalog')`
 *     (the fetch carries that tag).
 * The 5 second timeout belongs to the request that fills the cache; Next refreshes a stale entry in the
 * background without the signal.
 */

// Relative import with the .ts extension, unlike blueprint-catalog.ts's `@/lib/logger`: the tests run
// under `node --test`, which does not resolve the `@/` alias (see blueprint-chat-copy.ts for the same).
import { createChildLogger, LOG_CONTEXTS } from './logger.ts';

const catalogLogger = createChildLogger({ context: LOG_CONTEXTS.API });

export const AI_CATALOG_DEFAULT_URL = 'https://portal.roihomesvc.com/api/public/catalog';

/** Cache tag on the fetch, so a later step can call `revalidateTag(AI_CATALOG_CACHE_TAG)` to refresh at once. */
export const AI_CATALOG_CACHE_TAG = 'ai-catalog';

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 5000;
/** A value from the response is echoed into an error message (and so the log) at most this long. */
const ECHO_MAX = 80;

/** The fourteen names the route publishes. All required, and the same keys in both states. */
export const AI_CATALOG_NAME_KEYS = [
  'checker', 'check', 'checks',
  'analysis', 'analyses', 'analysisShort', 'analysesShort', 'analysisReport',
  'certified', 'certifiedPlural', 'certifiedShort',
  'mlsSupported', 'mlsSupportedPlural', 'mlsSupportedShort',
] as const;

export type AiCatalogNames = Readonly<Record<(typeof AI_CATALOG_NAME_KEYS)[number], string>>;

/** Thrown when the price list cannot be read or does not pass validation. Callers degrade rather than guess a price. */
export class AiCatalogUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiCatalogUnavailableError';
  }
}

interface AiPlanCommon {
  /** Opaque plan code (e.g. a monthly and a yearly code per tier). Not an enum: the app may add plans. */
  code: string;
  name: string;
  /** Dollars. */
  price: number;
  interval: 'month' | 'year' | null;
  newsletter: boolean;
}

/** A plan before launch: the allowances it grants and the line that describes them. */
export interface AiPlanToday extends AiPlanCommon {
  member: boolean;
  analyses: number;
  checks: number;
  blurb: string;
}

/** A plan after launch: a member plan loads credits; a non-member plan grants analyses. No blurb. */
export type AiPlanLaunch =
  | (AiPlanCommon & { member: true; credits: number })
  | (AiPlanCommon & { member: false; analyses: number });

export interface AiPack {
  code: string;
  name: string;
  /** Dollars. */
  price: number;
  analyses: number;
}

export interface AiPerDealProduct {
  sku: string;
  name: string;
  /** Dollars. */
  price: number;
  description: string;
  group: string | null;
  step: number | null;
  phase: string | null;
  flagship: boolean;
  /** 'month' when the SKU is sold as a subscription; null for one-time. */
  billingInterval: 'month' | null;
  /** Dollars; set only for a subscription SKU that offers a yearly price. */
  annualPrice: number | null;
}

export interface AiRateCard {
  version: string;
  actions: { action: string; credits: number }[];
}

interface AiCatalogCommon {
  /** Opaque change marker for the whole body. */
  version: string;
  names: AiCatalogNames;
  packs: AiPack[];
  perDeal: AiPerDealProduct[];
  disclosure: string;
}

/** Before launch. `rateCard` and `extraCredits` are always null here. */
export interface AiCatalogToday extends AiCatalogCommon {
  launch: false;
  plans: AiPlanToday[];
  extraCredits: null;
  rateCard: null;
}

/**
 * After launch. `rateCard` is null when the body omits it. `extraCredits` is null while the app
 * publishes none; its shape is not defined yet, so a non-null value is ignored (returned as null)
 * until a validator for it is added here, rather than failing the whole read on a field nothing renders.
 */
export interface AiCatalogLaunch extends AiCatalogCommon {
  launch: true;
  plans: AiPlanLaunch[];
  extraCredits: null;
  rateCard: AiRateCard | null;
}

export type AiCatalog = AiCatalogToday | AiCatalogLaunch;

type Json = Record<string, unknown>;

function fail(path: string, expected: string): never {
  throw new AiCatalogUnavailableError(`Price list rejected at ${path}: expected ${expected}`);
}

const isRecord = (v: unknown): v is Json => typeof v === 'object' && v !== null && !Array.isArray(v);

/** A response value as it may appear in an error message: cut at ECHO_MAX characters. */
const echo = (v: string): string => (v.length > ECHO_MAX ? `${v.slice(0, ECHO_MAX)}...` : v);

function record(v: unknown, path: string): Json {
  if (!isRecord(v)) fail(path, 'an object');
  return v;
}

/** A non-empty string (whitespace only does not count). */
function text(o: Json, key: string, path: string): string {
  const v = o[key];
  if (typeof v !== 'string' || v.trim() === '') fail(`${path}.${key}`, 'a non-empty string');
  return v;
}

/** Any string, including an empty one. */
function anyText(o: Json, key: string, path: string): string {
  const v = o[key];
  if (typeof v !== 'string') fail(`${path}.${key}`, 'a string');
  return v;
}

function textOrNull(o: Json, key: string, path: string): string | null {
  const v = o[key];
  if (v === null) return null;
  if (typeof v !== 'string') fail(`${path}.${key}`, 'a string or null');
  return v;
}

function bool(o: Json, key: string, path: string): boolean {
  const v = o[key];
  if (typeof v !== 'boolean') fail(`${path}.${key}`, 'true or false');
  return v;
}

/** Dollars: a finite number above zero. Zero reads as "unset", so it is not a price. */
function price(o: Json, key: string, path: string): number {
  const v = o[key];
  if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) fail(`${path}.${key}`, 'a price above zero');
  return v;
}

function priceOrNull(o: Json, key: string, path: string): number | null {
  return o[key] === null ? null : price(o, key, path);
}

function count(o: Json, key: string, path: string, min: number): number {
  const v = o[key];
  if (typeof v !== 'number' || !Number.isInteger(v) || v < min) fail(`${path}.${key}`, `a whole number of at least ${min}`);
  return v;
}

function numberOrNull(o: Json, key: string, path: string): number | null {
  const v = o[key];
  if (v === null) return null;
  if (typeof v !== 'number' || !Number.isFinite(v)) fail(`${path}.${key}`, 'a number or null');
  return v;
}

/** A non-empty array; each item is read by `read` with its own path. */
function list<T>(o: Json, key: string, read: (item: unknown, path: string) => T, unique: (item: T) => string): T[] {
  const v = o[key];
  if (!Array.isArray(v) || v.length === 0) fail(key, 'a non-empty array');
  const items = v.map((item, i) => read(item, `${key}[${i}]`));
  // Two rows with one code or SKU could carry two different prices; refuse rather than pick one.
  const seen = new Set<string>();
  for (const item of items) {
    const id = unique(item);
    if (seen.has(id)) fail(key, `unique entries (${echo(id)} appears twice)`);
    seen.add(id);
  }
  return items;
}

function readNames(body: Json): AiCatalogNames {
  const o = record(body.names, 'names');
  const names = {} as Record<(typeof AI_CATALOG_NAME_KEYS)[number], string>;
  for (const key of AI_CATALOG_NAME_KEYS) names[key] = text(o, key, 'names');
  return names;
}

function readPlanCommon(p: Json, path: string): AiPlanCommon {
  const interval = p.interval;
  if (interval !== 'month' && interval !== 'year' && interval !== null) fail(`${path}.interval`, "'month', 'year' or null");
  return {
    code: text(p, 'code', path),
    name: text(p, 'name', path),
    price: price(p, 'price', path),
    interval,
    newsletter: bool(p, 'newsletter', path),
  };
}

function readPlanToday(item: unknown, path: string): AiPlanToday {
  const p = record(item, path);
  return {
    ...readPlanCommon(p, path),
    member: bool(p, 'member', path),
    analyses: count(p, 'analyses', path, 0),
    checks: count(p, 'checks', path, 0),
    blurb: text(p, 'blurb', path),
  };
}

function readPlanLaunch(item: unknown, path: string): AiPlanLaunch {
  const p = record(item, path);
  const common = readPlanCommon(p, path);
  return bool(p, 'member', path)
    ? { ...common, member: true, credits: count(p, 'credits', path, 1) }
    : { ...common, member: false, analyses: count(p, 'analyses', path, 0) };
}

function readPack(item: unknown, path: string): AiPack {
  const p = record(item, path);
  return {
    code: text(p, 'code', path),
    name: text(p, 'name', path),
    price: price(p, 'price', path),
    analyses: count(p, 'analyses', path, 1),
  };
}

function readPerDeal(item: unknown, path: string): AiPerDealProduct {
  const p = record(item, path);
  const billingInterval = p.billingInterval;
  if (billingInterval !== 'month' && billingInterval !== null) fail(`${path}.billingInterval`, "'month' or null");
  return {
    sku: text(p, 'sku', path),
    name: text(p, 'name', path),
    price: price(p, 'price', path),
    description: anyText(p, 'description', path),
    group: textOrNull(p, 'group', path),
    step: numberOrNull(p, 'step', path),
    phase: textOrNull(p, 'phase', path),
    flagship: bool(p, 'flagship', path),
    billingInterval,
    annualPrice: priceOrNull(p, 'annualPrice', path),
  };
}

/** Absent means "not available" (null). When it is there it must be right: credits are prices. */
function readRateCard(body: Json): AiRateCard | null {
  if (body.rateCard === undefined || body.rateCard === null) return null;
  const o = record(body.rateCard, 'rateCard');
  const actions = o.actions;
  if (!Array.isArray(actions)) fail('rateCard.actions', 'an array');
  const seen = new Set<string>();
  return {
    version: text(o, 'version', 'rateCard'),
    actions: actions.map((item, i) => {
      const path = `rateCard.actions[${i}]`;
      const a = record(item, path);
      const action = text(a, 'action', path);
      if (seen.has(action)) fail('rateCard.actions', `unique entries (${echo(action)} appears twice)`);
      seen.add(action);
      return { action, credits: count(a, 'credits', path, 1) };
    }),
  };
}

/**
 * Validate a parsed response body and return it in the shape this module promises. Exported for the
 * tests; callers use fetchAiCatalog().
 *
 * @throws AiCatalogUnavailableError on the first thing that is missing, mistyped or not a usable price.
 */
export function parseAiCatalog(input: unknown): AiCatalog {
  const body = record(input, 'body');
  const launch = body.launch;
  if (typeof launch !== 'boolean') fail('launch', 'true or false');

  const common = {
    version: text(body, 'version', 'body'),
    names: readNames(body),
    packs: list(body, 'packs', readPack, (p) => p.code),
    perDeal: list(body, 'perDeal', readPerDeal, (p) => p.sku),
    disclosure: text(body, 'disclosure', 'body'),
  };

  if (!launch) {
    return {
      ...common,
      launch: false,
      plans: list(body, 'plans', readPlanToday, (p) => p.code),
      extraCredits: null,
      rateCard: null,
    };
  }
  return {
    ...common,
    launch: true,
    plans: list(body, 'plans', readPlanLaunch, (p) => p.code),
    extraCredits: null,
    rateCard: readRateCard(body),
  };
}

/**
 * The URL to read. A URL with a username or password is refused: a failed fetch is logged with its
 * error, and the route is public, so credentials in the URL could only ever leak into the log.
 * Neither message below repeats the configured value.
 */
function catalogUrl(): string {
  const configured = process.env.AI_CATALOG_URL?.trim();
  if (!configured) return AI_CATALOG_DEFAULT_URL;
  try {
    const url = new URL(configured);
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password) {
      return url.toString();
    }
  } catch {
    // falls through to the error below
  }
  catalogLogger.error('AI_CATALOG_URL is not a plain http(s) URL');
  throw new AiCatalogUnavailableError('AI_CATALOG_URL is not a valid http(s) URL without a username or password');
}

/** Give back the connection of an answer we are about to refuse. Never throws. */
async function discardBody(res: Response): Promise<void> {
  try {
    await res.body?.cancel();
  } catch {
    // nothing to do: the answer is being refused anyway
  }
}

/**
 * Fetch and validate the public price list.
 *
 * Cached for 5 minutes, so a page render does not call the app on every request.
 *
 * @throws AiCatalogUnavailableError for anything but a 200 with a JSON body that passes validation
 *         (unreachable, timed out, non-200, not JSON, a missing or mistyped key, a price that is not
 *         above zero), so callers render an honest "pricing unavailable" state instead of a guess.
 */
export async function fetchAiCatalog(): Promise<AiCatalog> {
  const url = catalogUrl();

  let res: Response;
  try {
    res = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [AI_CATALOG_CACHE_TAG] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    catalogLogger.error({ err }, 'AI price list fetch failed');
    throw new AiCatalogUnavailableError('Price list is temporarily unreachable');
  }

  if (res.status !== 200) {
    catalogLogger.error({ status: res.status }, 'AI price list read returned non-200');
    await discardBody(res);
    throw new AiCatalogUnavailableError(`Price list read failed with status ${res.status}`);
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch (err) {
    catalogLogger.error({ err }, 'AI price list response was not valid JSON');
    throw new AiCatalogUnavailableError('Price list returned a malformed response');
  }

  try {
    return parseAiCatalog(body);
  } catch (err) {
    catalogLogger.error({ err }, 'AI price list response failed validation');
    // Every exit is the named error or a full catalog: a surprise from the parser is wrapped, not leaked.
    throw err instanceof AiCatalogUnavailableError ? err : new AiCatalogUnavailableError('Price list could not be validated');
  }
}
