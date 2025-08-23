
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCalendlyModal } from "@/contexts/calendly-modal-context";
import { X } from "lucide-react";
import { InlineWidget } from "react-calendly";

const CalendlyModal = () => {
  const { isOpen, closeModal, eventType } = useCalendlyModal();

  if (!eventType) return null;

  const url = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/rod-23/15min"

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[1000px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Schedule a Consultation</DialogTitle>
          <DialogDescription>
            Please choose a date and time that works for you.
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 min-h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <InlineWidget url={url} />
        </div>
        <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
