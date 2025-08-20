
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import type { AppraisalFormData } from "@/types/scheduler-types";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

interface ScheduleFormProps {
  onContinue: (data: { appointmentDate: string, appointmentTime: string }) => void;
  onBack: () => void;
  formData?: AppraisalFormData;
}

const availableTimes = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
];

export default function ScheduleForm({ onContinue, onBack, formData }: ScheduleFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    formData?.appointmentDate ? new Date(formData.appointmentDate) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(formData?.appointmentTime);

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      onContinue({
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        appointmentTime: selectedTime
      });
    }
  };

  return (
    <div className="step-content">
      <h2 className="text-2xl font-semibold text-primary mb-6">Schedule Your Appraisal</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-primary mb-4">Select a Date</h3>
            <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                className="rounded-md border"
            />
        </div>

        <div className="flex flex-col items-center">
            <h3 className="text-lg font-medium text-primary mb-4">Select a Time</h3>
            <div className="w-full max-w-xs">
                <Select onValueChange={setSelectedTime} value={selectedTime} disabled={!selectedDate}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                    </SelectTrigger>
                    <SelectContent>
                        {availableTimes.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 {!selectedDate && <p className="text-sm text-muted-foreground mt-2 text-center">Please select a date first.</p>}
            </div>

            {selectedDate && selectedTime && (
                <Alert className="mt-8 bg-green-50 border-green-200 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                        Appointment set for <span className="font-semibold">{format(selectedDate, "MMMM dd, yyyy")}</span> at <span className="font-semibold">{selectedTime}</span>.
                    </AlertDescription>
                </Alert>
            )}
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
        <Button 
          type="button" 
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="px-8 py-3"
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
}
