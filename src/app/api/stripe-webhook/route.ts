import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

// Initialize Stripe only if secret key is available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null;

const webhookLogger = createChildLogger(LOG_CONTEXTS.PAYMENT);

export async function POST(req: NextRequest) {
  // Check if Stripe is configured
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    webhookLogger.warn('Stripe webhook called but not configured');
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 503 }
    );
  }

  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    webhookLogger.error({
      err,
      signature,
    }, 'Webhook signature verification failed');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        webhookLogger.info({
          event: 'payment_succeeded',
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          customerEmail: paymentIntent.metadata.customerEmail,
          metadata: paymentIntent.metadata,
        }, 'Payment succeeded');

        // Here you could:
        // - Update database with payment confirmation
        // - Send confirmation email to customer
        // - Update booking status
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        
        webhookLogger.warn({
          event: 'payment_failed',
          paymentIntentId: failedPayment.id,
          customerEmail: failedPayment.metadata.customerEmail,
          error: failedPayment.last_payment_error?.message,
        }, 'Payment failed');
        break;

      default:
        webhookLogger.info({
          event: event.type,
        }, 'Unhandled webhook event type');
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    webhookLogger.error({
      err,
      eventType: event.type,
    }, 'Error processing webhook');
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
