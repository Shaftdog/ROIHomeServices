/**
 * Server-side discount resolution against real Stripe promotion codes.
 *
 * Why this exists: the booking flow computed discounts in the browser from a
 * hardcoded map and then POSTed the discounted total, which the API charged
 * as-is. The discount was advisory; the browser decided the price.
 *
 * Stripe applies `promotion_code` automatically only to Checkout Sessions,
 * Invoices and Subscriptions — a PaymentIntent has no such parameter. Booking
 * uses PaymentIntents, so we look the code up through the API and apply the
 * coupon's own `percent_off` / `amount_off` ourselves. Stripe stays the source
 * of truth for what a code is worth, and the arithmetic happens server-side.
 *
 * KNOWN LIMITATION: because we are not using Checkout, Stripe does not
 * increment `times_redeemed` for these redemptions. We check `max_redemptions`
 * below, but it is NOT consumed — a single-use code stays usable until the
 * owner deactivates it. Do not assume Stripe is enforcing single-use here.
 */

import Stripe from "stripe";

export interface ResolvedDiscount {
  /** The code as Stripe has it, not as the user typed it. */
  code: string;
  /** Cents removed from the subtotal. Never negative, never above subtotal. */
  discountCents: number;
  description: string;
}

export type DiscountResult =
  | { ok: true; discount: ResolvedDiscount }
  | { ok: false; reason: string };

/**
 * Look up a promotion code and compute what it removes from `subtotalCents`.
 * Returns a reason string suitable for showing the user on any rejection.
 */
export async function resolveDiscount(
  stripe: Stripe,
  rawCode: string,
  subtotalCents: number
): Promise<DiscountResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, reason: "Coupon code is required" };

  // `code` is an exact match filter; active:true excludes deactivated codes.
  const found = await stripe.promotionCodes.list({ code, active: true, limit: 1 });
  const promo = found.data[0];
  if (!promo) return { ok: false, reason: "Invalid coupon code" };

  if (promo.expires_at && promo.expires_at * 1000 < Date.now()) {
    return { ok: false, reason: "This coupon has expired" };
  }
  if (
    promo.max_redemptions != null &&
    promo.times_redeemed >= promo.max_redemptions
  ) {
    return { ok: false, reason: "This coupon has already been used" };
  }

  const coupon = promo.coupon;
  if (!coupon?.valid) return { ok: false, reason: "This coupon is no longer valid" };
  if (coupon.redeem_by && coupon.redeem_by * 1000 < Date.now()) {
    return { ok: false, reason: "This coupon has expired" };
  }

  let discountCents = 0;
  if (coupon.amount_off != null) {
    discountCents = coupon.amount_off; // already cents
  } else if (coupon.percent_off != null) {
    discountCents = Math.round((subtotalCents * coupon.percent_off) / 100);
  }

  // Clamp: a $500-off coupon on a $350 appraisal must not go negative, and a
  // discount can never exceed what is owed.
  discountCents = Math.max(0, Math.min(discountCents, subtotalCents));

  return {
    ok: true,
    discount: {
      code: promo.code,
      discountCents,
      description: coupon.name ?? `Discount ${promo.code}`,
    },
  };
}

/** Stripe will not process a charge below 50 cents. */
export const STRIPE_MINIMUM_CENTS = 50;
