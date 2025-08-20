
"use client";

import type { ReactNode } from 'react';
import { Button, type ButtonProps } from "@/components/ui/button";
import { useCalendlyModal, type CalendlyEventType } from "@/contexts/calendly-modal-context";
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface CtaButtonProps extends ButtonProps {
  calendlyEventType: CalendlyEventType;
  children: ReactNode;
  showArrow?: boolean;
  variant?: ButtonProps['variant'] | 'highlight'; // Add highlight variant
}

export function CtaButton({ calendlyEventType, children, className, showArrow, variant, ...props }: CtaButtonProps) {
  const { openModal } = useCalendlyModal();

  const isHighlightVariant = variant === 'highlight';
  const buttonVariant = isHighlightVariant ? 'default' : variant; // Use 'default' for styling if 'highlight'

  return (
    <Button
      onClick={() => openModal(calendlyEventType)}
      className={cn(
        "group", // for arrow animation
        isHighlightVariant && "bg-highlight text-highlight-foreground hover:bg-highlight/90",
        className
      )}
      variant={buttonVariant}
      {...props}
    >
      {children}
      {showArrow && <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />}
    </Button>
  );
}
