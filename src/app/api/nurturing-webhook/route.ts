import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Contact data schema for nurturing webhook
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  bookingId: z.string().optional(),
  source: z.string().default('booking_form'),
  step: z.string().default('contact_info'),
  attributionData: z.record(z.any()).optional(),
});

async function handleNurturingWebhook(request: NextRequest) {
  const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

  try {
    const body = await request.json();
    
    console.log('🚀 Nurturing webhook request received:', {
      email: body.email?.slice(0, 3) + '***', // Partial redaction for privacy
      phone: body.phone?.slice(0, 3) + '***',
      source: body.source,
      step: body.step,
      requestId
    });

    // Validate the request
    const validatedData = contactSchema.parse(body);
    
    // Lindy webhook URL
    const LINDY_WEBHOOK_URL = 'https://public.lindy.ai/api/v1/webhooks/lindy/75e61f7c-7b1b-4c5b-ae0b-d4fbf69a5cc4';

    // Prepare webhook payload for Lindy
    const webhookPayload = {
      // Contact information
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone,
      
      // Booking context
      booking_id: validatedData.bookingId,
      source: validatedData.source,
      step: validatedData.step,
      timestamp: new Date().toISOString(),
      
      // Attribution data (flattened for easier processing)
      ...(validatedData.attributionData && {
        traffic_source: validatedData.attributionData.traffic_source,
        campaign: validatedData.attributionData.campaign,
        medium: validatedData.attributionData.medium,
        utm_source: validatedData.attributionData.utm_source,
        utm_medium: validatedData.attributionData.utm_medium,
        utm_campaign: validatedData.attributionData.utm_campaign,
        is_paid_traffic: validatedData.attributionData.is_paid_traffic,
      }),
      
      // Additional context
      page_url: '/book',
      lead_stage: 'contact_info_completed',
      service_interest: 'property_appraisal'
    };

    console.log('📤 Sending contact to Lindy nurturing campaign:', {
      webhookUrl: LINDY_WEBHOOK_URL,
      payloadKeys: Object.keys(webhookPayload),
      requestId
    });

    // Send to Lindy AI nurturing campaign
    const response = await fetch(LINDY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      throw new Error(`Lindy webhook failed with status: ${response.status}`);
    }

    const result = await response.text().catch(() => ''); // Lindy might not return JSON
    
    console.log('✅ Lindy nurturing webhook sent successfully:', {
      webhookUrl: LINDY_WEBHOOK_URL,
      responseStatus: response.status,
      success: true,
      requestId
    });

    return NextResponse.json({
      success: true,
      message: 'Contact sent to Lindy AI nurturing campaign',
      requestId,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('⚠️ Nurturing webhook validation failed:', {
        validationErrors: error.errors,
        requestId,
      });
      
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

    console.error('❌ Lindy nurturing webhook failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      requestId,
    });

    // Don't fail the booking flow if nurturing webhook fails
    return NextResponse.json(
      {
        success: false,
        error: 'Nurturing webhook failed',
        requestId,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return handleNurturingWebhook(request);
}
