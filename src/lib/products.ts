/**
 * Server-side product catalog (SINGLE SOURCE OF TRUTH for pricing).
 *
 * SECURITY: This map is the authoritative price list. The client must NEVER be
 * able to influence the amount we charge. API routes resolve the amount to
 * charge from THIS file using a SKU only — they must never read an amount from
 * the request body. See src/app/api/deal-screen/create-payment-intent/route.ts.
 */

export interface Product {
  /** Stable, machine-readable identifier used in API requests + Stripe metadata. */
  sku: string;
  /** Human-readable name shown on receipts / order summaries. */
  name: string;
  /** Fixed price in the smallest currency unit (cents). Server-controlled. */
  amountCents: number;
  /** ISO 4217 currency code. */
  currency: 'usd';
}

export const PRODUCTS = {
  DEAL_SCREEN: {
    sku: 'DEAL_SCREEN',
    name: 'Deal Screen — Will It Appraise?',
    amountCents: 4900, // $49.00 — fixed, server-side only.
    currency: 'usd',
  },
} as const satisfies Record<string, Product>;

/** Union of all valid SKUs, derived from the catalog. */
export type ProductSku = keyof typeof PRODUCTS;

/**
 * Resolve a product by SKU. Returns `undefined` for unknown SKUs so callers can
 * reject the request rather than charging an arbitrary/zero amount.
 */
export function getProduct(sku: string): Product | undefined {
  return (PRODUCTS as Record<string, Product>)[sku];
}
