import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

const paymentLogger = createChildLogger(LOG_CONTEXTS.payment);

async function handlePaymentIntent(req: NextRequest, requestId: string) {
  try {
    const body = await req.json();
    const { amount, customerEmail, customerName, bookingDetails } = body;

    // Validate amount
    if (!amount || amount < 50) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        customerEmail: customerEmail || '',
        customerName: customerName || '',
        serviceType: bookingDetails?.serviceType || '',
        appointmentDate: bookingDetails?.appointmentDate || '',
        requestId,
      },
      receipt_email: customerEmail,
      description: `ROI Home Services - ${bookingDetails?.serviceType || 'Property Appraisal'}`,
    });

    logEvent(paymentLogger, 'payment_intent_created', {
      amount,
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
