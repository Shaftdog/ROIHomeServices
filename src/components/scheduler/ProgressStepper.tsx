
"use client";

import { Check } from "lucide-react";

interface ProgressStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "Contact Info" },
  { number: 2, label: "Property Details" },
  { number: 3, label: "Schedule" },
  { number: 4, label: "Payment" },
  { number: 5, label: "Confirmation" }
];

export default function ProgressStepper({ currentStep }: ProgressStepperProps) {

  return (
    <div className="flex justify-center items-start mb-12 w-full max-w-4xl mx-auto px-4 md:px-0">
      <div className="flex items-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center text-center w-24">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${currentStep > step.number ? 'bg-accent text-accent-foreground border-accent' : currentStep === step.number ? 'bg-primary text-primary-foreground border-primary scale-110' : 'bg-secondary border-border'}`}
              >
                {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
              </div>
              <p className={`text-xs mt-2 font-medium ${currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'}`}>
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-border relative">
                  <div className={`absolute top-0 left-0 h-full bg-primary transition-all duration-500 ${currentStep > step.number ? 'w-full' : 'w-0'}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

import * as React from 'react';
