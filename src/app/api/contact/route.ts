import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRouteLogging, logEvent } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import { sendContactNotification } from '@/lib/email';

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

async function handleContactSubmission(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();
  const contactLogger = createChildLogger({
    requestId,
    context: LOG_CONTEXTS.FORM,
  });

  try {
    const body = await request.json();
    
    // Log form submission event
    logEvent(contactLogger, 'form_submit', {
      formType: 'contact',
      subject: body.subject,
      // PII fields will be redacted
      name: body.name,
      email: body.email,
      phone: body.phone,
    }, requestId);

    // Validate the request
    const validatedData = contactSchema.parse(body);
    
    // Send email notification to admin
    try {
      await sendContactNotification({
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        subject: validatedData.subject,
        message: validatedData.message,
        requestId,
      });
      
      contactLogger.info({
        formType: 'contact',
        subject: validatedData.subject,
        emailSent: true,
      }, 'Admin notification email sent successfully');
      
    } catch (emailError) {
      contactLogger.error({
        err: emailError,
        subject: validatedData.subject,
      }, 'Failed to send admin notification email');
      // Don't fail the contact submission if email fails
    }
    
    contactLogger.info({
      formType: 'contact',
      subject: validatedData.subject,
      success: true,
    }, 'Contact form submitted successfully');

    return NextResponse.json({
      success: true,
      message: 'Thank you for your message. We\'ll get back to you soon!',
      requestId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      contactLogger.warn({
        validationErrors: error.errors,
        requestId,
      }, 'Contact form validation failed');
      
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

    contactLogger.error({
      err: error,
      requestId,
    }, 'Contact form submission failed');

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

export const POST = withRouteLogging(handleContactSubmission);
