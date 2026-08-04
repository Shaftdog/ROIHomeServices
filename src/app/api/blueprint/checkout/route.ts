import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import {
  CatalogUnavailableError,
  resolveBlueprintProduct,
} from '@/lib/blueprint-catalog';

/**
 * POST /api/blueprint/checkout
 *
 * Creates a Stripe Checkout Session for one Billionaire Appraisal Platform SKU.
 *
 * SECURITY — the whole point of this route:
 *   The request body carries a SKU (and optionally an email). It carries NO
 *   amount, NO price, NO currency, NO discount. The charge is resolved
 *   server-side from the Salesmod catalog by SKU (see src/lib/blueprint-catalog.ts),
 *   the same guarantee documented in src/lib/products.ts. An unknown SKU is
 *   rejected with 400 rather than charged an arbitrary or zero amount.
 *   The schema is `.strict()`, so a request that tries to smuggle `amount` or
 *   `price` fails validation outright instead of being silently ignored.
 *
 *   Discounts are Stripe's job: `allow_promotion_codes: true` lets the owner's
 *   existing promotion codes apply at checkout, where Stripe validates them. We
 *   never accept a discount value from the client.
 */

// Match the Stripe apiVersion pinned across this app (create-payment-intent /
// deal-screen / stripe-webhook all pin '2024-11-20.acacia'). The installed types
// only declare the latest version literal, so cast to keep runtime identical.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia' as Stripe.LatestApiVersion,
    })
  : null;

/** Canonical site origin. Deliberately NOT taken from the request Host/Origin
 *  header, so a spoofed host cannot turn success_url into an open redirect. */
const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.roihomesvc.com').replace(
  /\/+$/,
  ''
);

const RETURN_PATH = '/billionaire-blueprint';

// NOTE: no `amount`, no `price`, no `coupon`. `.strict()` rejects unknown keys.
// `interval` only chooses between plans a subscription SKU actually offers in the
// catalog — it can never change what a one-time product costs.
const bodySchema = z
  .object({
    sku: z.string().min(1, 'A product SKU is required'),
    email: z.string().email('A valid email is required').optional(),
    interval: z.enum(['month', 'year']).optional(),
  })
  .strict();

async function handleBlueprintCheckout(req: NextRequest) {
  const requestId = req.headers.get('x-request-id') || crypto.randomUUID();
  const paymentLogger = createChildLogger({
    requestId,
    context: LOG_CONTEXTS.PAYMENT,
  });

  if (!stripe) {
    paymentLogger.error({ requestId }, 'Stripe not configured - missing STRIPE_SECRET_KEY');
    return NextResponse.json({ error: 'Payment system not configured' }, { status: 503 });
  }

  try {
    const { sku, email, interval } = bodySchema.parse(await req.json());

    // SERVER-SIDE PRICE. Nothing the caller sent can influence this amount.
    const product = await resolveBlueprintProduct(sku);
    if (!product) {
      paymentLogger.warn({ requestId, sku }, 'Unknown Blueprint SKU rejected');
      return NextResponse.json({ error: 'Unknown product' }, { status: 400 });
    }

    // The billing model comes from the catalog, never the request. `interval`
    // is only honored on SKUs the catalog marks as subscriptions.
    if (interval && product.billingInterval === null) {
      paymentLogger.warn({ requestId, sku, interval }, 'Interval sent for one-time product');
      return NextResponse.json(
        { error: 'This product is not sold as a subscription' },
        { status: 400 }
      );
    }
    const chosenInterval = product.billingInterval === null ? null : (interval ?? 'month');
    if (chosenInterval === 'year' && product.annualAmountCents === null) {
      paymentLogger.warn({ requestId, sku }, 'Annual plan requested but not offered');
      return NextResponse.json(
        { error: 'This product has no annual plan' },
        { status: 400 }
      );
    }
    const chargeAmountCents =
      chosenInterval === 'year' ? (product.annualAmountCents as number) : product.amountCents;

    logEvent(
      paymentLogger,
      'payment_attempt',
      { sku: product.sku, amountCents: chargeAmountCents, interval: chosenInterval, email },
      requestId
    );

    const session = await stripe.checkout.sessions.create({
      mode: chosenInterval ? 'subscription' : 'payment',
      // Lets the owner's existing promotion codes (e.g. NELS500, JACOBY500) be
      // entered and validated by Stripe. We never take a discount from the body.
      allow_promotion_codes: true,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: product.currency,
            unit_amount: chargeAmountCents, // server-resolved, from the catalog
            ...(chosenInterval ? { recurring: { interval: chosenInterval } } : {}),
            product_data: {
              name: product.name,
              ...(product.description ? { description: product.description } : {}),
            },
          },
        },
      ],
      ...(email ? { customer_email: email } : {}),
      success_url: `${SITE_ORIGIN}${RETURN_PATH}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_ORIGIN}${RETURN_PATH}?checkout=cancelled`,
      metadata: {
        sku: product.sku,
        productName: product.name,
        productGroup: product.group,
        billingInterval: chosenInterval ?? 'one-time',
        source: 'billionaire-blueprint',
        requestId,
      },
      // Session metadata does not propagate to the Subscription object, so
      // renewal events (invoice.paid, customer.subscription.*) would carry no
      // SKU attribution without this mirror.
      ...(chosenInterval
        ? {
            subscription_data: {
              metadata: {
                sku: product.sku,
                productName: product.name,
                billingInterval: chosenInterval,
                source: 'billionaire-blueprint',
              },
            },
          }
        : {}),
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      // Echoed for display/telemetry only — this is the server's number, and the
      // client sending it back would change nothing.
      amountCents: chargeAmountCents,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof CatalogUnavailableError) {
      // We could not read the authoritative price. Refuse rather than guess.
      paymentLogger.error({ err: error, requestId }, 'Blueprint catalog unavailable at checkout');
      return NextResponse.json({ error: 'Pricing is temporarily unavailable' }, { status: 503 });
    }

    paymentLogger.error({ err: error, requestId }, 'Failed to create Blueprint checkout session');

    if (error instanceof Stripe.errors.StripeError) {
      // A bad/expired API key is our misconfiguration, not the buyer's problem, and
      // its message echoes key fragments — log it, return something generic.
      const isOurConfigProblem =
        error instanceof Stripe.errors.StripeAuthenticationError ||
        error instanceof Stripe.errors.StripePermissionError ||
        error instanceof Stripe.errors.StripeAPIError ||
        error instanceof Stripe.errors.StripeConnectionError;

      return NextResponse.json(
        { error: isOurConfigProblem ? 'Payment system is unavailable' : error.message },
        { status: isOurConfigProblem ? 503 : 400 }
      );
    }

    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}

export const POST = withRouteLogging(handleBlueprintCheckout);
