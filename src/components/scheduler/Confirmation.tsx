
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Printer, CalendarPlus } from "lucide-react";
import { format } from "date-fns";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { sendPurchaseEvent, trackAppraisalScheduled } from "@/lib/gtag";

interface ConfirmationProps {
  formData: AppraisalFormData;
  confirmationNumber: string;
}

export default function Confirmation({ formData, confirmationNumber }: ConfirmationProps) {
  const appointmentDate = formData.appointmentDate ? new Date(formData.appointmentDate) : null;

  // Send GA4 purchase event when confirmation page loads
  useEffect(() => {
    // Send the New_Order event to GA4
    sendPurchaseEvent({
      transactionId: confirmationNumber,
      value: Number(formData.quoteAmount) || 595,
      currency: 'USD',
      items: [
        {
          item_id: 'appraisal-service',
          item_name: 'Property Appraisal Service',
          category: 'Real Estate Services',
          quantity: 1,
          price: Number(formData.quoteAmount) || 595,
        },
      ],
    });

    // Also track the appraisal scheduling event
    if (formData.appointmentDate && formData.appointmentTime) {
      trackAppraisalScheduled({
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        serviceType: formData.purpose || 'Property Appraisal',
        value: Number(formData.quoteAmount) || 595,
      });
    }
  }, [confirmationNumber, formData]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleAddToCalendar = () => {
    if (!appointmentDate || !formData.appointmentTime) return;
    
    // Naive time parsing. This is not robust.
    const timeParts = formData.appointmentTime.match(/(\d+):(\d+)(AM|PM)/);
    if (!timeParts) return;

    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3];

    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    }
    if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    const startDate = new Date(appointmentDate);
    startDate.setHours(hours, minutes, 0, 0);

    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour

    const formatDateForGoogle = (date: Date) => {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    };
    
    const details = `Property Appraisal for ${formData.address}`;
    const location = formData.address;
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Property+Appraisal&dates=${formatDateForGoogle(startDate)}/${formatDateForGoogle(endDate)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="step-content text-center">
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        
        <h2 className="text-2xl font-semibold text-primary mb-3">Booking Confirmed!</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          Your property appraisal has been scheduled for{' '}
          <span className="font-semibold text-foreground">
            {appointmentDate ? format(appointmentDate, "MMMM dd, yyyy") : "N/A"} at {formData.appointmentTime}
          </span>.
        </p>
        
        <div className="bg-secondary p-6 rounded-lg max-w-md w-full mb-8">
          <h3 className="text-lg font-medium text-primary mb-4">Booking Details</h3>
          
          <div className="text-left space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium text-foreground text-right">{formData.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date & Time:</span>
              <span className="font-medium text-foreground">
                {appointmentDate ? format(appointmentDate, "MMMM dd, yyyy") : "N/A"} at {formData.appointmentTime}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Confirmation #:</span>
              <span className="font-medium text-foreground">{confirmationNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Paid:</span>
              <span className="font-medium text-foreground">${Number(formData.quoteAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">A confirmation email has been sent to your email address.</p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline" onClick={handlePrintReceipt} className="flex items-center gap-2">
            <Printer className="h-4 w-4" /> Print Receipt
          </Button>
          <Button variant="outline" onClick={handleAddToCalendar} className="flex items-center gap-2">
            <CalendarPlus className="h-4 w-4" /> Add to Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}
