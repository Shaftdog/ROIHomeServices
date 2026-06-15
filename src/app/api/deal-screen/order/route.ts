import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { sendDealScreenOrderNotification } from '@/lib/email';
import { triggerDealScreenJob } from '@/lib/roi-agent';

// Match the Stripe apiVersion used elsewhere in the app. Cast to keep runtime
// behavior identical to create-payment-intent / stripe-webhook without adding a
// new typecheck error (installed types only declare the latest literal).
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    })
  : null;

const orderSchema = z.object({
  paymentIntentId: z.string().min(1, 'paymentIntentId is required'),
  email: z.string().email('A valid email is required'),
  name: z.string().optional(),
  deal: z
    .object({
      address: z.string().optional(),
      contract: z.string().optional(),
      arv: z.string().optional(),
    })
    .optional(),
});

async function handleDealScreenOrder(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const orderLogger = createChildLogger({
    requestId,
    context: LOG_CONTEXTS.PAYMENT,
  });

  if (!stripe) {
    orderLogger.error({ requestId }, 'Stripe not configured - missing STRIPE_SECRET_KEY');
    return NextResponse.json(
      { error: 'Payment system not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const { paymentIntentId, email, name, deal } = orderSchema.parse(body);

    // SECURITY: verify the payment actually succeeded server-side. We never
    // trust the client's word that it was paid — re-fetch the PaymentIntent and
    // confirm status before recording the order.
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      orderLogger.warn(
        { requestId, paymentIntentId, status: paymentIntent.status },
        'Deal Screen order rejected — payment not succeeded'
      );
      return NextResponse.json(
        { error: 'Payment has not been completed' },
        { status: 402 }
      );
    }

    const amountFormatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (paymentIntent.currency || 'usd').toUpperCase(),
    }).format(paymentIntent.amount / 100);

    logEvent(orderLogger, 'payment_success', {
      paymentIntentId,
      amountCents: paymentIntent.amount,
      email,
      dealAddress: deal?.address,
    }, requestId);

    // Lead capture: notify admin so a PAID buyer is never lost, even if the
    // downstream provisioning step below is not yet built. Don't fail the order
    // if the email send fails — the payment already went through.
    try {
      await sendDealScreenOrderNotification({
        email,
        name,
        address: deal?.address,
        contract: deal?.contract,
        arv: deal?.arv,
        amountFormatted,
        paymentIntentId,
        requestId,
      });
    } catch (emailError) {
      orderLogger.error(
        { err: emailError, requestId, paymentIntentId },
        'Deal Screen admin notification failed (payment still captured)'
      );
    }

    // IMMEDIATE ROI agent trigger (SAL-20, fast path). The durable
    // payment_intent.succeeded webhook (src/app/api/deal-screen/webhook) fires
    // the SAME trigger so the order survives a dropped client-side capture POST.
    // Both use paymentIntentId as the idempotency key, so the agent dedupes and
    // never double-generates a screen. triggerDealScreenJob NEVER throws, so a
    // trigger failure can never break the payment/confirmation response.
    try {
      await triggerDealScreenJob({
        idempotencyKey: paymentIntentId,
        customer: { email },
        deal: {
          address: deal?.address,
          contract: deal?.contract,
          arv: deal?.arv,
        },
      });
    } catch (triggerError) {
      // Belt-and-suspenders: triggerDealScreenJob is designed not to throw, but
      // we still guard so the buyer always gets a clean success response.
      orderLogger.error(
        { err: triggerError, requestId, paymentIntentId },
        'ROI agent trigger threw unexpectedly (payment still captured)'
      );
    }

    return NextResponse.json({ success: true, requestId });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    orderLogger.error({ err: error, requestId }, 'Failed to capture Deal Screen order');

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to capture order' },
      { status: 500 }
    );
  }
}

export const POST = withRouteLogging(handleDealScreenOrder);
