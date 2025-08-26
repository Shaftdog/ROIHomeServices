
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Calendar, Clock } from "lucide-react";
import { pushEvent } from "@/lib/gtm";
import { InlineWidget } from "react-calendly";

interface ScheduleFormProps {
  onContinue: (data: { appointmentDate: string, appointmentTime: string }) => void;
  onBack: () => void;
  formData?: AppraisalFormData;
}

export default function ScheduleForm({ onContinue, onBack, formData }: ScheduleFormProps) {
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [appointmentDetails, setAppointmentDetails] = useState<{
    appointmentDate: string;
    appointmentTime: string;
  } | null>(null);

  // Calendly URL - using the 30min link as requested
  const calendlyUrl = "https://calendly.com/rod-23/30min";

  // Handle Calendly event scheduling
  const handleCalendlyEventScheduled = (eventData: any) => {
    console.log('Calendly event scheduled:', eventData);
    
    // Extract date and time from Calendly event
    const startTime = new Date(eventData.payload.event.start_time);
    const appointmentDate = startTime.toISOString().split('T')[0]; // YYYY-MM-DD format
    const appointmentTime = startTime.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });

    const details = {
      appointmentDate,
      appointmentTime
    };

    setAppointmentDetails(details);
    setIsScheduled(true);

    // Fire GA4 event
    pushEvent('Paid_Booking', {
      step: 3,
      step_name: 'Schedule',
      page: '/book',
      appointment_type: formData?.purpose || 'unknown',
      location: formData?.address || 'unknown',
      schedule_date: appointmentDate,
      schedule_time: appointmentTime,
    });
  };

  // Listen for Calendly events
  useEffect(() => {
    const handleCalendlyMessage = (event: MessageEvent) => {
      console.log('Received message:', event.data);
      
      // Handle different Calendly event formats
      if (event.data && event.data.event) {
        if (event.data.event === 'calendly.event_scheduled') {
          handleCalendlyEventScheduled(event.data);
        }
      }
      
      // Also check for the event type directly in the data
      if (event.data && event.data.type === 'event_scheduled') {
        handleCalendlyEventScheduled(event.data);
      }

      // Check for Calendly iframe events
      if (event.origin === 'https://calendly.com' && event.data) {
        if (event.data.event === 'calendly.event_scheduled' || event.data.type === 'event_scheduled') {
          handleCalendlyEventScheduled(event.data);
        }
      }
    };

    window.addEventListener('message', handleCalendlyMessage);
    return () => window.removeEventListener('message', handleCalendlyMessage);
  }, [formData]);

  const handleContinue = () => {
    if (appointmentDetails) {
      onContinue(appointmentDetails);
    }
  };

  const handleManualConfirmation = () => {
    // Fallback for when automatic detection doesn't work
    const now = new Date();
    const details = {
      appointmentDate: now.toISOString().split('T')[0],
      appointmentTime: 'Scheduled via Calendly'
    };

    setAppointmentDetails(details);
    setIsScheduled(true);

    // Fire GA4 event
    pushEvent('Paid_Booking', {
      step: 3,
      step_name: 'Schedule',
      page: '/book',
      appointment_type: formData?.purpose || 'unknown',
      location: formData?.address || 'unknown',
      schedule_date: details.appointmentDate,
      schedule_time: details.appointmentTime,
    });
  };

  return (
    <div className="step-content">
      <h2 className="text-2xl font-semibold text-primary mb-6">Schedule Your Appraisal</h2>
      
      {!isScheduled ? (
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Choose your preferred date</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>30-minute appointment</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border shadow-sm min-h-[600px]">
            <InlineWidget
              url={calendlyUrl}
              styles={{
                height: '600px'
              }}
              prefill={{
                name: formData?.name,
                email: formData?.email
              }}
              utm={{
                utmCampaign: 'Property Appraisal Booking',
                utmSource: 'ROI Home Services',
                utmMedium: 'website'
              }}
            />
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground mb-3">
              If you've completed your scheduling above but the page hasn't updated:
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleManualConfirmation}
              className="px-6 py-2"
            >
              I've Scheduled My Appointment
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <Alert className="bg-green-50 border-green-200 text-green-800 max-w-md mx-auto">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <p className="font-semibold">Appointment Scheduled Successfully!</p>
                <p>Date: {appointmentDetails && new Date(appointmentDetails.appointmentDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p>Time: {appointmentDetails?.appointmentTime}</p>
              </div>
            </AlertDescription>
          </Alert>
          
          <div className="text-sm text-muted-foreground">
            <p>You should receive a calendar invitation and confirmation email shortly.</p>
            <p>Please proceed to complete your payment to finalize the booking.</p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-8 mt-6 border-t border-border">
        <Button 
          type="button" 
          variant="outline"
          onClick={onBack}
          className="px-8 py-3"
        >
          Back
        </Button>
        <Button 
          type="button" 
          onClick={handleContinue}
          disabled={!isScheduled}
          className="px-8 py-3"
          data-testid="continue-to-payment"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
