"use client";

import { useState, useEffect, useRef } from "react";
import ProgressStepper from "@/components/scheduler/ProgressStepper";
import ContactForm from "@/components/scheduler/ContactForm";
import PropertyDetailsForm from "@/components/scheduler/PropertyDetailsForm";
import ScheduleForm from "@/components/scheduler/ScheduleForm";
import PaymentForm from "@/components/scheduler/PaymentForm";
import Confirmation from "@/components/scheduler/Confirmation";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { nanoid } from "nanoid";
import { trackBookingStep, getAttributionData, sendGTMEvent } from "@/lib/gtag";
import { pushEvent } from "@/lib/gtm";
import TrackOnView from "@/components/TrackOnView";
import { ErrorBoundary, BookingErrorFallback } from "@/components/shared/ErrorBoundary";

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AppraisalFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateNeeded: "",
    purpose: "",
    requester: "",
    sizeOfHome: 0,
    numberOfLivingUnits: "",
    scopeOfInspection: "",
    appointmentDate: "",
    appointmentTime: "",
    quoteAmount: 595,
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [appraisalRequestId, setAppraisalRequestId] = useState<number | null>(null);
  const { toast } = useToast();
  
  // Use ref for stable booking ID (matching the remote version's approach)
  const bookingIdRef = useRef(nanoid(10));
  const bookingId = bookingIdRef.current;

  // 🎯 Track page view when component mounts (user lands on /book page)
  useEffect(() => {
    const attributionData = getAttributionData();
    
    // Enhanced page view tracking for booking page
    sendGTMEvent('page_view', {
      page_type: 'booking_page',
      page_location: window.location.href,
      page_title: document.title,
      page_path: '/book',
      booking_id: bookingId,
      step: currentStep,
      step_name: 'booking_page_view',
      conversion_value: 25, // Landing on booking page has value
      currency: 'USD',
      ...attributionData
    });

    // Also send booking page view event specifically for Google Ads
    sendGTMEvent('booking_page_view', {
      page_type: 'booking_page',
      booking_id: bookingId,
      conversion_value: 25,
      currency: 'USD',
      traffic_source: attributionData.traffic_source,
      is_paid_traffic: attributionData.is_paid_traffic,
      ...attributionData
    });

    // Legacy event for backwards compatibility
    pushEvent('page_view', {
      page: '/book',
      page_type: 'booking'
    });

    console.log('📊 Booking page view tracked:', {
      booking_id: bookingId,
      attribution: attributionData,
      timestamp: new Date().toISOString()
    });
  }, [bookingId]); // Include bookingId in deps

  const handleContactSubmit = async (data: { name: string, email: string, phone: string }) => {
    // Get attribution data for enhanced tracking
    const attributionData = getAttributionData();
    
    // Enhanced booking start tracking with attribution
    sendGTMEvent('booking_started', {
      step: 1,
      step_name: 'contact_info',
      booking_id: bookingId,
      conversion_value: 50,
      currency: 'USD',
      appointment_type: formData.purpose || 'unknown',
      ...attributionData
    });
    
    // Fire Start_Booking event with continue_click action (legacy)
    pushEvent('Start_Booking', {
      step: 1,
      action: 'continue_click',
      page: '/book',
      appointment_type: formData.purpose || 'unknown',
      booking_id: bookingId
    });
    
    // 🚀 Send contact info to Lindy AI nurturing campaign
    try {
      const nurturingResponse = await fetch('/api/nurturing-webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          bookingId: bookingId,
          source: 'booking_form',
          step: 'contact_info',
          attributionData: attributionData,
        }),
      });

      const nurturingResult = await nurturingResponse.json();
      
      if (nurturingResponse.ok && nurturingResult.success) {
        console.log('✅ Contact sent to Lindy AI nurturing campaign successfully');
      } else {
        console.warn('⚠️ Failed to send contact to Lindy nurturing campaign:', nurturingResult.error);
        // Don't show error to user - this is background functionality
      }
    } catch (error) {
      console.error('❌ Error sending contact to Lindy nurturing campaign:', error);
      // Don't fail the booking flow if nurturing fails
    }
    
    setFormData({ ...formData, ...data });
    setCurrentStep(2);
    
    // Enhanced step completion tracking
    sendGTMEvent('booking_step_completed', {
      step: 1,
      next_step: 2,
      step_name: 'contact_info_completed',
      booking_id: bookingId,
      conversion_value: 100,
      currency: 'USD',
      ...attributionData
    });
    
    // Track booking step completion
    trackBookingStep('contact_info_completed', 1);
  };

  const handlePropertyDetailsSubmit = (data: AppraisalFormData) => {
    const attributionData = getAttributionData();
    
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
    
    // Enhanced step completion tracking
    sendGTMEvent('booking_step_completed', {
      step: 2,
      next_step: 3,
      step_name: 'property_details_completed',
      booking_id: bookingId,
      conversion_value: 200,
      currency: 'USD',
      ...attributionData
    });
    
    // Track booking step completion
    trackBookingStep('property_details_completed', 2);
  };

  const handleScheduleSubmit = (data: { appointmentDate: string, appointmentTime: string }) => {
    const attributionData = getAttributionData();
    const updatedFormData = { ...formData, ...data };
    
    setFormData(updatedFormData);
    setCurrentStep(4);
    
    // Enhanced step completion tracking
    sendGTMEvent('booking_step_completed', {
      step: 3,
      next_step: 4,
      step_name: 'appointment_scheduled',
      booking_id: bookingId,
      conversion_value: 400,
      currency: 'USD',
      appointment_date: data.appointmentDate,
      appointment_time: data.appointmentTime,
      ...attributionData
    });
    
    // Track booking step completion
    trackBookingStep('appointment_scheduled', 3);
  };

  const handlePaymentComplete = async () => {
    console.log('=== handlePaymentComplete CALLED ===');
    const attributionData = getAttributionData();
    
    try {
      // Generate confirmation details
      const confirmationNum = nanoid(8).toUpperCase();
      setConfirmationNumber(confirmationNum);
      
      // Debug: Log form data
      console.log('=== PAYMENT COMPLETE - DEBUG INFO ===');
      console.log('Form Data:', formData);
      console.log('Confirmation Number:', confirmationNum);
      console.log('Booking ID:', bookingId);
      
      // Use dedicated ZIP code field first, then extract from address as fallback
      let zip = formData.zipCode;
      if (!zip) {
        const zipMatch = formData.address?.match(/\b\d{5}(-\d{4})?\b/);
        zip = zipMatch ? zipMatch[0] : undefined;
      }
      
      // Build booking data
      const bookingData = {
        serviceType: `Property Appraisal - ${formData.purpose || 'General'}`,
        preferredDate: formData.appointmentDate || new Date().toISOString(),
        zip: zip || undefined,
        email: formData.email || '',
        phone: formData.phone || '',
        name: formData.name || '',
        address: formData.address || '',
        notes: `PAID BOOKING - Confirmation: ${confirmationNum}
Appointment Time: ${formData.appointmentTime || 'N/A'}
Property Size: ${formData.sizeOfHome || 'N/A'} sq ft
Living Units: ${formData.numberOfLivingUnits || 'N/A'}
Scope: ${formData.scopeOfInspection || 'N/A'}
Purpose: ${formData.purpose || 'N/A'}
Requester: ${formData.requester || 'N/A'}
Date Needed: ${formData.dateNeeded || 'N/A'}
Amount Paid: $${formData.quoteAmount || 0}`
      };
      
      console.log('Booking Data to Send:', bookingData);
      
      // Send booking notification email to admin
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();
      console.log('API Response:', result);
      
      if (response.ok && result.success) {
        console.log('✅ Admin notification email sent successfully');
        console.log('Booking ID:', result.bookingId);
        
        toast({
          title: "Booking Confirmed!",
          description: "Admin has been notified and will contact you shortly.",
          variant: "default"
        });
      } else {
        console.error('❌ Failed to send booking notification');
        console.error('Error:', result.error || 'Unknown error');
        
        toast({
          title: "Payment Successful",
          description: "Your payment was processed. We'll contact you within 24 hours to confirm your appointment.",
          variant: "default"
        });
      }
      
      setCurrentStep(5);
      
      // 🎯 FIRE GOOGLE ADS CONVERSION EVENTS THAT MATCH YOUR GTM TRIGGERS
      
      // 1. Fire the "Final Booking Step" event for your "Google Ads Conversion - Final Purchase" tag
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Final Booking Step',
        'booking_id': bookingId,
        'conversion_value': formData.quoteAmount || 500,
        'currency': 'USD',
        'confirmation_number': confirmationNum,
        'customer_email': formData.email,
        'customer_phone': formData.phone,
        'service_type': formData.purpose,
        'quote_amount': formData.quoteAmount,
        'appointment_date': formData.appointmentDate,
        'appointment_time': formData.appointmentTime,
        ...attributionData
      });
      
      // 2. Fire the "cflads_conversion" event for your "Central Florida CTA Click" tag
      window.dataLayer.push({
        'event': 'cflads_conversion',
        'booking_id': bookingId,
        'conversion_value': formData.quoteAmount || 500,
        'currency': 'USD',
        'conversion_type': 'booking_completed',
        'landing_page': 'central_florida',
        'confirmation_number': confirmationNum,
        'customer_email': formData.email,
        'service_type': formData.purpose,
        ...attributionData
      });
      
      // 3. Enhanced conversion tracking - this is the main conversion!
      sendGTMEvent('booking_completed', {
        step: 5,
        step_name: 'payment_completed',
        booking_id: bookingId,
        conversion_value: formData.quoteAmount || 500,
        currency: 'USD',
        confirmation_number: confirmationNum,
        quote_amount: formData.quoteAmount,
        ...attributionData
      });
      
      // 4. Generic Google Ads conversion event
      sendGTMEvent('ads_conversion', {
        conversion_id: 'booking_completed',
        conversion_value: formData.quoteAmount || 500,
        currency: 'USD',
        booking_id: bookingId,
        confirmation_number: confirmationNum,
        ...attributionData
      });
      
      // Legacy tracking
      trackBookingStep('payment_completed', 4);
      
      console.log('🎯 Google Ads conversion events fired:', {
        'Final Booking Step': true,
        'cflads_conversion': true,
        booking_id: bookingId,
        conversion_value: formData.quoteAmount || 500,
        attribution: attributionData,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ ERROR in handlePaymentComplete:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      });
      
      // Still proceed to confirmation and fire conversion events even if API fails
      const confirmationNum = nanoid(8).toUpperCase();
      setConfirmationNumber(confirmationNum);
      setCurrentStep(5);
      
      // 🎯 Still fire the Google Ads conversion events even if API fails
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'Final Booking Step',
        'booking_id': bookingId,
        'conversion_value': formData.quoteAmount || 500,
        'currency': 'USD',
        'confirmation_number': confirmationNum,
        'customer_email': formData.email,
        'customer_phone': formData.phone,
        'service_type': formData.purpose,
        'error_occurred': true,
        ...attributionData
      });
      
      window.dataLayer.push({
        'event': 'cflads_conversion',
        'booking_id': bookingId,
        'conversion_value': formData.quoteAmount || 500,
        'currency': 'USD',
        'conversion_type': 'booking_completed',
        'confirmation_number': confirmationNum,
        'error_occurred': true,
        ...attributionData
      });
      
      trackBookingStep('payment_completed', 4);
      
      console.log('🎯 Google Ads conversion events fired (with error):', {
        'Final Booking Step': true,
        'cflads_conversion': true,
        booking_id: bookingId,
        conversion_value: formData.quoteAmount || 500,
        error_occurred: true,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Payment Successful",
        description: "Your payment was processed. We'll contact you within 24 hours to confirm your appointment.",
        variant: "default"
      });
    }
  };

  return (
    <ErrorBoundary fallback={BookingErrorFallback}>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">Property Appraisal Quote & Scheduling</h1>
          <p className="text-muted-foreground">Get an instant quote and schedule your property appraisal in minutes.</p>
        </div>

        <ProgressStepper currentStep={currentStep} />

        <Card className="bg-white rounded-lg shadow-lg p-6 md:p-10">
        {currentStep === 1 && (
          <>
            <TrackOnView 
              name="Start_Booking" 
              params={{
                step: 1,
                step_name: 'ContactInfo',
                page: '/book',
                appointment_type: formData.purpose || 'unknown',
                booking_id: bookingId
              }}
            />
            <ContactForm 
              onContinue={handleContactSubmit} 
              defaultValues={formData} 
            />
          </>
        )}
        
        {currentStep === 2 && (
          <PropertyDetailsForm 
            onContinue={handlePropertyDetailsSubmit}
            onBack={() => setCurrentStep(1)} 
            defaultValues={formData} 
          />
        )}
        
        {currentStep === 3 && (
          <ScheduleForm 
            onContinue={handleScheduleSubmit}
            onBack={() => setCurrentStep(2)}
            formData={formData}
          />
        )}
        
        {currentStep === 4 && (
          <PaymentForm
            onComplete={handlePaymentComplete}
            onBack={() => setCurrentStep(3)}
            formData={formData}
          />
        )}
        
        {currentStep === 5 && (
          <Confirmation 
            formData={formData}
            confirmationNumber={confirmationNumber}
          />
        )}
        </Card>
      </div>
    </ErrorBoundary>
  );
}
