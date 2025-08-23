import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

// Quote request schema
const quoteSchema = z.object({
  serviceType: z.string().min(1, 'Service type is required'),
  propertyType: z.enum(['residential', 'commercial', 'mixed-use']),
  squareFootage: z.number().min(100, 'Square footage must be at least 100'),
  zip: z.string().min(5, 'ZIP code required'),
  urgency: z.enum(['standard', 'rush', 'emergency']).optional(),
  email: z.string().email('Invalid email address').optional(),
});

async function handleQuoteRequest(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const quoteLogger = createChildLogger({
    requestId,
    context: LOG_CONTEXTS.API,
  });

  try {
    const body = await request.json();
    
    // Log quote request event
    logEvent(quoteLogger, 'quote_request', {
      serviceType: body.serviceType,
      propertyType: body.propertyType,
      squareFootage: body.squareFootage,
      zip: body.zip,
      urgency: body.urgency,
      // email will be redacted if present
      email: body.email,
    }, requestId);

    // Validate the request
    const validatedData = quoteSchema.parse(body);
    
    // Calculate quote (simplified logic)
    let basePrice = 595;
    
    if (validatedData.propertyType === 'commercial') {
      basePrice += 200;
    }
    
    if (validatedData.squareFootage > 3000) {
      basePrice += 150;
    }
    
    if (validatedData.urgency === 'rush') {
      basePrice += 100;
    } else if (validatedData.urgency === 'emergency') {
      basePrice += 250;
    }
    
    const quoteId = crypto.randomUUID();
    
    quoteLogger.info({
      quoteId,
      serviceType: validatedData.serviceType,
      propertyType: validatedData.propertyType,
      calculatedPrice: basePrice,
      success: true,
    }, 'Quote calculated successfully');

    return NextResponse.json({
      success: true,
      quoteId,
      estimatedPrice: basePrice,
      validFor: '30 days',
      requestId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      quoteLogger.warn({
        validationErrors: error.errors,
        requestId,
      }, 'Quote request validation failed');
      
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

    quoteLogger.error({
      err: error,
      requestId,
    }, 'Quote request failed');

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

export const POST = withRouteLogging(handleQuoteRequest);
