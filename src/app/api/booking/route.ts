import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { sendBookingNotification } from '@/lib/email';

// Booking request schema
const bookingSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  preferredDate: z.string().min(1, 'Preferred date is required'),
  zip: z.string().min(5, 'ZIP code must be at least 5 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  name: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

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
        notes: validatedData.notes,
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
