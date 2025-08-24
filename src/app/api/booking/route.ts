import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

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
    
    // Simulate booking processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const bookingId = crypto.randomUUID();
    
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
