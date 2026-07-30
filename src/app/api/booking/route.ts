import { NextRequest, NextResponse, after } from 'next/server';
import { z } from 'zod';
import Stripe from 'stripe';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { sendBookingNotification } from '@/lib/email';
import { forwardMarketingLead } from '@/lib/salesmod';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-11-20.acacia' })
  : null;

// Booking request schema - made ZIP code optional for better reliability
const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  zip: z.string().optional(), // Made optional to prevent validation failures
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  name: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  /** Stripe PaymentIntent id, when the caller believes this booking was paid. */
  paymentIntentId: z.string().optional(),
});

/**
 * Establish, with Stripe, whether this booking was actually paid.
 *
 * The caller's claim is not evidence. This endpoint previously accepted a
 * client-composed note reading "PAID BOOKING — Amount Paid: $X" and emailed it
 * verbatim, with no PaymentIntent id and no verification of any kind — so a
 * plain POST produced an email indistinguishable from a real sale.
 *
 * Returns the amount Stripe actually received, never an amount from the body.
 */
async function verifyPayment(
  paymentIntentId: string | undefined,
  log: ReturnType<typeof createChildLogger>
): Promise<{ paid: boolean; amountCents: number | null; note: string }> {
  if (!paymentIntentId) {
    return { paid: false, amountCents: null, note: 'UNPAID BOOKING (no payment attempted)' };
  }
  if (!stripe) {
    log.error('Cannot verify payment - STRIPE_SECRET_KEY missing');
    return { paid: false, amountCents: null, note: 'PAYMENT UNVERIFIED (Stripe not configured)' };
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== 'succeeded') {
      log.warn({ paymentIntentId, status: pi.status }, 'Booking claimed payment that did not succeed');
      return {
        paid: false,
        amountCents: null,
        note: `PAYMENT NOT COMPLETED (Stripe status: ${pi.status})`,
      };
    }
    const received = pi.amount_received ?? pi.amount;
    return {
      paid: true,
      amountCents: received,
      note: `PAID BOOKING — verified with Stripe. Amount received: $${(received / 100).toFixed(2)} (PaymentIntent ${pi.id})`,
    };
  } catch (err) {
    // An id Stripe does not recognise is a forgery attempt or a bad deploy;
    // either way it is not a paid booking.
    log.error({ err, paymentIntentId }, 'PaymentIntent lookup failed');
    return { paid: false, amountCents: null, note: 'PAYMENT UNVERIFIABLE (PaymentIntent not found)' };
  }
}

async function handleBookingRequest(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const bookingLogger = createChildLogger({
    requestId,
    context: LOG_CONTEXTS.BOOKING,
  });

  try {
    const body = await request.json();
    
    // Log booking request event
    logEvent(bookingLogger, 'booking_request', {
      serviceType: body.serviceType,
      preferredDate: body.preferredDate,
      zip: body.zip,
      // email and phone will be redacted by logger
      email: body.email,
      phone: body.phone,
    }, requestId);

    // Validate the request
    const validatedData = bookingSchema.parse(body);

    const bookingId = crypto.randomUUID();

    // Payment status is established with Stripe, not taken from the request.
    // The verdict is prepended to the notes so the notification can never
    // describe an unpaid booking as paid.
    const payment = await verifyPayment(validatedData.paymentIntentId, bookingLogger);
    const notes = [payment.note, validatedData.notes].filter(Boolean).join('\n');

    logEvent(bookingLogger, 'booking_payment_verified', {
      bookingId,
      paid: payment.paid,
      amountCents: payment.amountCents,
      paymentIntentId: validatedData.paymentIntentId ?? null,
    }, requestId);

    // Send email notification to admin
    try {
      await sendBookingNotification({
        bookingId,
        serviceType: validatedData.serviceType,
        preferredDate: validatedData.preferredDate,
        zip: validatedData.zip,
        email: validatedData.email,
        phone: validatedData.phone,
        name: validatedData.name,
        address: validatedData.address,
        notes,
        requestId,
      });
      
      bookingLogger.info({
        bookingId,
        emailSent: true,
      }, 'Admin notification email sent successfully');
      
    } catch (emailError) {
      bookingLogger.error({
        err: emailError,
        bookingId,
      }, 'Failed to send admin notification email');
      // Don't fail the booking if email fails
    }
    
    // Log successful booking
    logEvent(bookingLogger, 'booking_confirm', {
      bookingId,
      serviceType: validatedData.serviceType,
      preferredDate: validatedData.preferredDate,
      zip: validatedData.zip,
    }, requestId);
    
    // Forward to Salesmod CRM (fire-and-forget; never blocks the response)
    after(() => forwardMarketingLead({
      formSource: 'booking',
      email: validatedData.email,
      name: validatedData.name,
      phone: validatedData.phone,
      externalId: bookingId,
      attribution: body?.attribution,
      context: {
        serviceType: validatedData.serviceType,
        preferredDate: validatedData.preferredDate,
        zip: validatedData.zip,
        requestId,
      },
    }));

    bookingLogger.info({
      bookingId,
      serviceType: validatedData.serviceType,
      success: true,
    }, 'Booking created successfully');

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking request submitted successfully',
      requestId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      bookingLogger.warn({
        validationErrors: error.errors,
        requestId,
      }, 'Booking validation failed');
      
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
          requestId,
        },
        { status: 400 }
      );
    }

    bookingLogger.error({
      err: error,
      requestId,
    }, 'Booking request failed');

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        requestId,
      },
      { status: 500 }
    );
  }
}

export const POST = withRouteLogging(handleBookingRequest);
