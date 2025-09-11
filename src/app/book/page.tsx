"use client";

import { useState } from "react";
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

  const handleContactSubmit = (data: { name: string, email: string, phone: string }) => {
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
      appointment_type: formData.purpose || 'unknown'
    });
    
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
    setFormData({ ...formData, ...data });
    setCurrentStep(3);
    // Track booking step completion
    trackBookingStep('property_details_completed', 2);
  };

  const handleScheduleSubmit = (data: { appointmentDate: string, appointmentTime: string }) => {
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);
    setCurrentStep(4);
    // Track booking step completion
    trackBookingStep('appointment_scheduled', 3);
    // You might want to trigger an API call here to save the data so far
    // and create a payment intent.
  };

  const handlePaymentComplete = async () => {
    console.log('=== handlePaymentComplete CALLED ===');
    try {
      // Generate confirmation details
      const confirmationNum = nanoid(8).toUpperCase();
      setConfirmationNumber(confirmationNum);
      
      // Debug: Log form data
      console.log('=== PAYMENT COMPLETE - DEBUG INFO ===');
      console.log('Form Data:', formData);
      console.log('Confirmation Number:', confirmationNum);
      
      // Use dedicated ZIP code field first, then extract from address as fallback
      let zip = formData.zipCode;
      if (!zip) {
        const zipMatch = formData.address?.match(/\b\d{5}(-\d{4})?\b/);
        zip = zipMatch ? zipMatch[0] : undefined; // No fallback needed since ZIP is now optional
      }
      
      // Build booking data
      const bookingData = {
        serviceType: `Property Appraisal - ${formData.purpose || 'General'}`,
        preferredDate: formData.appointmentDate || new Date().toISOString(),
        zip: zip || undefined, // Send undefined if no ZIP available (API now accepts optional ZIP)
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
        
        // Show success message to user
        toast({
          title: "Booking Confirmed!",
          description: "Admin has been notified and will contact you shortly.",
          variant: "default"
        });
      } else {
        console.error('❌ Failed to send booking notification');
        console.error('Error:', result.error || 'Unknown error');
        
        // Show warning to user but don't fail the booking
        toast({
          title: "Payment Successful",
          description: "Your payment was processed. We'll contact you within 24 hours to confirm your appointment.",
          variant: "default"
        });
      }
      
      setCurrentStep(5);
      trackBookingStep('payment_completed', 4);
    } catch (error) {
      console.error('❌ ERROR in handlePaymentComplete:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        error: error
      });
      
      // Still proceed to confirmation even if email fails
      setConfirmationNumber(nanoid(8).toUpperCase());
      setCurrentStep(5);
      trackBookingStep('payment_completed', 4);
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
                appointment_type: formData.purpose || 'unknown'
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
          // This is a placeholder for payment. A real implementation would need a client secret from a server.
          // For now, we will just simulate a successful payment.
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
