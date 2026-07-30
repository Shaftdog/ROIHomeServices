import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { quoteAppraisalCents } from '@/lib/appraisal-pricing';
import { resolveDiscount, STRIPE_MINIMUM_CENTS } from '@/lib/stripe-promotions';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

const paymentLogger = createChildLogger(LOG_CONTEXTS.PAYMENT);

async function handlePaymentIntent(req: NextRequest, requestId: string) {
  // Check if Stripe is configured
  if (!stripe) {
    paymentLogger.error({ requestId }, 'Stripe not configured - missing STRIPE_SECRET_KEY');
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { pricing, couponCode, customerEmail, customerName, bookingDetails } = body;

    // SECURITY: the amount is derived HERE, from the pricing inputs, via the one
    // server-side fee schedule. Any `amount` on the request body is ignored.
    // This route previously charged a body-supplied amount with only a $50
    // floor, so a visitor could set their own price. Never reintroduce that.
    const quote = quoteAppraisalCents(pricing ?? {});
    if (quote.kind === 'declined') {
      return NextResponse.json({ error: quote.message }, { status: 400 });
    }
    const subtotalCents = quote.amountCents;

    // Discounts resolve against real Stripe promotion codes, server-side.
    let discountCents = 0;
    let appliedCode: string | null = null;
    if (typeof couponCode === 'string' && couponCode.trim()) {
      const result = await resolveDiscount(stripe, couponCode, subtotalCents);
      if (!result.ok) {
        return NextResponse.json({ error: result.reason }, { status: 400 });
      }
      discountCents = result.discount.discountCents;
      appliedCode = result.discount.code;
    }

    const amountCents = subtotalCents - discountCents;
    if (amountCents < STRIPE_MINIMUM_CENTS) {
      // A discount that clears the balance is a free booking, not a $0 charge;
      // it belongs on the no-payment path rather than going to Stripe.
      return NextResponse.json(
        { error: 'This total is below the minimum card charge. Please contact us to book.' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        serviceType: bookingDetails?.serviceType || '',
        appointmentDate: bookingDetails?.appointmentDate || '',
        // Server-derived figures, so a later reconciliation can see what the
        // schedule said rather than what any client claimed.
        subtotalCents: String(subtotalCents),
        discountCents: String(discountCents),
        couponCode: appliedCode ?? '',
        requestId,
      },
      receipt_email: customerEmail,
      description: `ROI Home Services - ${bookingDetails?.serviceType || 'Property Appraisal'}`,
    });

    logEvent(paymentLogger, 'payment_intent_created', {
      subtotalCents,
      discountCents,
      amountCents,
      couponCode: appliedCode,
      paymentIntentId: paymentIntent.id,
      customerEmail,
    }, requestId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    paymentLogger.error({
      err: error,
      requestId,
    }, 'Failed to create payment intent');

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

export const POST = withRouteLogging(handlePaymentIntent, 'payment');
