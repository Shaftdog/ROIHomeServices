import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { getProduct } from '@/lib/products';

// Match the Stripe apiVersion used elsewhere in the app (create-payment-intent /
// stripe-webhook both pin '2024-11-20.acacia'). The installed `stripe` types only
// declare the latest version literal, so we cast to keep runtime behavior
// identical without introducing a new typecheck error.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    })
  : null;

/**
 * Pure, server-only price resolver. Pricing comes EXCLUSIVELY from the product
 * catalog keyed by SKU — never from caller input. Returns `null` for unknown
 * SKUs so the route can reject rather than charge an arbitrary amount.
 *
 * Kept tiny + side-effect-free so it can be reasoned about / unit-tested in
 * isolation: resolveAmountCents('DEAL_SCREEN') === 4900.
 */
export function resolveAmountCents(sku: string): number | null {
  const product = getProduct(sku);
  return product ? product.amountCents : null;
}

// NOTE: deliberately NO `amount` field. The client cannot set the price; we read
// it from the server catalog by SKU only.
const bodySchema = z.object({
  // Optional so a future second product can reuse this route; defaults to the
  // Deal Screen. Even if a caller sends a bogus sku, resolveAmountCents() rejects it.
  sku: z.string().default('DEAL_SCREEN'),
  customerEmail: z.string().email('A valid email is required'),
  customerName: z.string().optional(),
  deal: z
    .object({
      address: z.string().optional(),
      contract: z.string().optional(),
      arv: z.string().optional(),
    })
    .optional(),
});

async function handleCreatePaymentIntent(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const paymentLogger = createChildLogger({
    requestId,
    context: LOG_CONTEXTS.PAYMENT,
  });

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
    const { sku, customerEmail, customerName, deal } = bodySchema.parse(body);

    // SERVER-SIDE PRICE. Any `amount` sent by the client is ignored entirely.
    const amountCents = resolveAmountCents(sku);
    const product = getProduct(sku);
    if (amountCents === null || !product) {
      paymentLogger.warn({ requestId, sku }, 'Unknown product SKU rejected');
      return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
    }

    logEvent(paymentLogger, 'payment_attempt', {
      sku,
      amountCents,
      customerEmail,
    }, requestId);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents, // fixed, server-controlled (4900 for DEAL_SCREEN)
      currency: product.currency,
      automatic_payment_methods: { enabled: true },
      receipt_email: customerEmail,
      description: `ROI Home Services - ${product.name}`,
      metadata: {
        sku: product.sku,
        productName: product.name,
        customerEmail,
        customerName: customerName || '',
        dealAddress: deal?.address || '',
        dealContract: deal?.contract || '',
        dealArv: deal?.arv || '',
        requestId,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amountCents,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    paymentLogger.error({ err: error, requestId }, 'Failed to create Deal Screen payment intent');

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

export const POST = withRouteLogging(handleCreatePaymentIntent);
