/**
 * Coupon preview for the booking UI.
 *
 * This endpoint is DISPLAY ONLY. It tells the form what a code is worth so the
 * user sees a discounted total before paying; it does not authorise anything.
 * The binding discount is recomputed in /api/create-payment-intent from the
 * same Stripe lookup at the moment the PaymentIntent is created — so tampering
 * with this response changes what the page shows and nothing that is charged.
 *
 * Codes are real Stripe promotion codes (the owner already manages them there —
 * e.g. NELS500, JACOBY500). The previous hardcoded map is gone: it carried a
 * live `TEST100` worth 100% off, plus guessable WELCOME10 / FRIEND25, and the
 * discount it computed was applied client-side and charged verbatim.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { quoteAppraisalCents } from '@/lib/appraisal-pricing';
import { resolveDiscount } from '@/lib/stripe-promotions';

const couponLogger = createChildLogger({ context: LOG_CONTEXTS.PAYMENT, component: 'coupon' });

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
  : null;

export async function POST(req: NextRequest) {
  try {
    if (!stripe) {
      couponLogger.error('Stripe not configured - missing STRIPE_SECRET_KEY');
      return NextResponse.json(
        { valid: false, error: 'Coupons are unavailable right now' },
        { status: 503 }
      );
    }

    const body = await req.json();
    const { code, pricing } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // The subtotal a percentage applies to is derived from the pricing inputs,
    // never from a client-supplied `originalAmount` — otherwise a caller could
    // inflate the displayed discount by lying about the base.
    const quote = quoteAppraisalCents(pricing ?? {});
    if (quote.kind === 'declined') {
      return NextResponse.json({ valid: false, error: quote.message }, { status: 400 });
    }
    const subtotalCents = quote.amountCents;

    const result = await resolveDiscount(stripe, code, subtotalCents);
    if (!result.ok) {
      couponLogger.info({ code: code.trim().toUpperCase() }, 'Coupon rejected');
      return NextResponse.json({ valid: false, error: result.reason }, { status: 200 });
    }

    const { discountCents, description } = result.discount;
    const finalCents = subtotalCents - discountCents;

    couponLogger.info(
      { code: result.discount.code, subtotalCents, discountCents, finalCents },
      'Coupon preview issued'
    );

    return NextResponse.json({
      valid: true,
      code: result.discount.code,
      description,
      // Dollars for display. The server recomputes all of this at charge time.
      originalAmount: subtotalCents / 100,
      discountAmount: discountCents / 100,
      finalAmount: finalCents / 100,
      discountPercent: subtotalCents > 0
        ? Math.round((discountCents / subtotalCents) * 100)
        : 0,
    });
  } catch (error) {
    couponLogger.error({ err: error }, 'Error validating coupon');
    return NextResponse.json(
      { valid: false, error: 'Could not validate that code' },
      { status: 500 }
    );
  }
}
