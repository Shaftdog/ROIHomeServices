/**
 * Confirm with Stripe that a returning Checkout Session was actually paid.
 *
 * Without this, `?checkout=success` is just a URL anyone can type, and the page
 * would congratulate a visitor who paid nothing. It grants no entitlement either
 * way — fulfilment happens off the Stripe webhook — but telling someone their
 * purchase succeeded when it didn't is its own kind of lie, and it produces
 * support conversations about orders that never existed.
 *
 * Same principle as the booking flow: the client's claim is not evidence.
 */

import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
  : null;

export type CheckoutVerdict =
  /** Stripe says this session is paid. */
  | 'paid'
  /** A real session that is not paid (abandoned, async method still pending). */
  | 'unpaid'
  /** Cancelled at Stripe's page — nothing was attempted. */
  | 'cancelled'
  /** No id, unknown id, or Stripe unreachable — assert nothing. */
  | 'unknown';

export async function verifyCheckoutSession(
  status: string | undefined,
  sessionId: string | undefined
): Promise<CheckoutVerdict> {
  if (status === 'cancelled') return 'cancelled';
  if (status !== 'success') return 'unknown';
  // A success claim with no session id is unverifiable by definition.
  if (!sessionId || !stripe) return 'unknown';

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === 'paid' ? 'paid' : 'unpaid';
  } catch {
    // Unrecognised id: a typed URL or a stale link. Not a payment.
    return 'unknown';
  }
}
