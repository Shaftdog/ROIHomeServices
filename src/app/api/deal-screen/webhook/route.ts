import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { triggerDealScreenJob } from '@/lib/roi-agent';

/**
 * DURABLE Deal Screen fulfillment trigger (SAL-20).
 *
 * This Stripe webhook is the RELIABLE path that survives a dropped client-side
 * capture POST: even if the browser navigates away / loses connection after
 * payment, Stripe still delivers `payment_intent.succeeded` here and we kick off
 * the ROI agent. The order-capture endpoint fires the SAME trigger for the fast
 * path; both use the PaymentIntent id as the idempotency key so the agent
 * dedupes and never double-generates a screen.
 *
 * Register this endpoint in the Stripe Dashboard (or via a dedicated webhook
 * endpoint) for the `payment_intent.succeeded` event and set STRIPE_WEBHOOK_SECRET.
 */

// Match the Stripe apiVersion pinned elsewhere in the app. The installed types
// only declare the latest version literal, so we cast to keep runtime behavior
// identical without introducing a new typecheck error.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    })
  : null;

const webhookLogger = createChildLogger({ context: LOG_CONTEXTS.PAYMENT });

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    webhookLogger.warn('Deal Screen webhook called but Stripe is not configured');
    return NextResponse.json(
      { error: 'Stripe webhook not configured' },
      { status: 503 }
    );
  }

  const body = await req.text();
  // Read the signature off the request directly — NextRequest.headers is
  // synchronous and fully typed (avoids the async `headers()` Promise typing
  // wrinkle present in the legacy stripe-webhook route). Same runtime behavior.
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    webhookLogger.error({ err }, 'Deal Screen webhook signature verification failed');
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const metadata = paymentIntent.metadata || {};

      // Only act on Deal Screen purchases. Other products / unrelated payments
      // flowing through this account are acknowledged and ignored.
      if (metadata.sku === 'DEAL_SCREEN') {
        webhookLogger.info(
          {
            event: 'deal_screen_payment_succeeded',
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / 100,
          },
          'Deal Screen payment succeeded — triggering ROI agent (durable webhook path)'
        );

        // Fire-and-await the ROI agent trigger. triggerDealScreenJob NEVER throws
        // and is idempotent by paymentIntent.id, so the immediate order-capture
        // path and this webhook can both fire without double-generating.
        const result = await triggerDealScreenJob({
          idempotencyKey: paymentIntent.id,
          customer: {
            email: metadata.customerEmail || paymentIntent.receipt_email || '',
          },
          deal: {
            address: metadata.dealAddress || undefined,
            contract: metadata.dealContract || undefined,
            arv: metadata.dealArv || undefined,
          },
        });

        if (!result.ok && !('skipped' in result && result.skipped)) {
          // Already logged inside triggerDealScreenJob; we still ACK the webhook
          // (200) so Stripe does not retry-storm us. Manual follow-up handles the
          // rare exhausted-retry case.
          webhookLogger.warn(
            { paymentIntentId: paymentIntent.id },
            'ROI agent trigger did not succeed from webhook (acknowledged anyway)'
          );
        }
      }
    } else {
      webhookLogger.info(
        { event: event.type },
        'Deal Screen webhook — unhandled event type (ignored)'
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // Defensive: triggerDealScreenJob does not throw, but guard the whole block
    // so a verified Stripe event is always ACKed and never lost to a 500 retry loop.
    webhookLogger.error(
      { err, eventType: event.type },
      'Error processing Deal Screen webhook'
    );
    return NextResponse.json({ received: true });
  }
}
