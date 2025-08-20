
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import CalendlyModal from '@/components/modals/calendly-modal';

export type CalendlyEventType = 'On-site Appraisal' | 'Free Consult – 15 min' | 'Investor Consult';

interface CalendlyModalContextType {
  isOpen: boolean;
  eventType: CalendlyEventType | null;
  openModal: (type: CalendlyEventType) => void;
  closeModal: () => void;
}

const CalendlyModalContext = createContext<CalendlyModalContextType | undefined>(undefined);

export const CalendlyModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [eventType, setEventType] = useState<CalendlyEventType | null>(null);

  const openModal = useCallback((type: CalendlyEventType) => {
    setEventType(type);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Optionally reset event type after a delay to allow modal to close gracefully
    // setTimeout(() => setEventType(null), 300); 
  }, []);

  return (
    <CalendlyModalContext.Provider value={{ isOpen, eventType, openModal, closeModal }}>
      {children}
      <CalendlyModal />
    </CalendlyModalContext.Provider>
  );
};

export const useCalendlyModal = () => {
  const context = useContext(CalendlyModalContext);
  if (context === undefined) {
    throw new Error('useCalendlyModal must be used within a CalendlyModalProvider');
  }
  return context;
};
