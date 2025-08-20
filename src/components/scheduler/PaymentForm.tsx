
"use client";

import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { Loader2 } from "lucide-react";

interface PaymentFormProps {
  onComplete: () => void;
  onBack: () => void;
  formData: AppraisalFormData;
}

export default function PaymentForm({ onComplete, onBack, formData }: PaymentFormProps) {
  const appointmentDate = formData.appointmentDate ? new Date(formData.appointmentDate) : null;
  
  const amount = typeof formData.quoteAmount === 'number' 
    ? formData.quoteAmount 
    : typeof formData.quoteAmount === 'string' 
      ? parseFloat(formData.quoteAmount) 
      : 0;
  
  const formattedQuoteAmount = amount.toFixed(2);

  return (
    <div className="step-content">
      <h2 className="text-2xl font-semibold text-primary mb-6">Payment Information</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="order-summary bg-secondary p-6 rounded-lg">
          <h3 className="text-lg font-medium text-primary mb-4">Order Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-muted-foreground">
              <span>Property Appraisal</span>
              <span className="text-foreground">${formattedQuoteAmount}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Address:</span>
              <span className="text-right text-foreground">{formData.address}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Appointment Date:</span>
              <span className="text-foreground">{appointmentDate ? format(appointmentDate, "MMMM dd, yyyy") : "N/A"}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Appointment Time:</span>
              <span className="text-foreground">{formData.appointmentTime}</span>
            </div>
            <div className="flex justify-between text-muted-foreground font-medium border-t border-border pt-4">
              <span className="text-foreground">Total:</span>
              <span className="text-primary font-bold">${formattedQuoteAmount}</span>
            </div>
          </div>
        </div>
        
        {/* Placeholder Payment Form */}
        <div className="payment-form flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg">
           <h3 className="text-lg font-medium text-primary mb-4">Complete Your Booking</h3>
           <p className="text-muted-foreground text-center mb-6">
            This is a demo. In a real application, a payment form (like Stripe) would be here. Click below to simulate a successful payment.
           </p>
          <Button onClick={onComplete} size="lg">
            Simulate Payment of ${formattedQuoteAmount}
          </Button>
        </div>
      </div>
       <div className="flex justify-between pt-8 mt-6 border-t border-border">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
            className="px-8 py-3"
          >
            Back
          </Button>
      </div>
    </div>
  );
}
