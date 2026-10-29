import { Info } from "lucide-react";

import { cn } from "@/lib/utils";
import { AVM_DISCLOSURE_TEXT } from "@/lib/appraisal-intelligence";

interface AvmDisclosureProps {
  /**
   * `card` (default) renders a bordered, info-toned callout suited to page
   * sections. `inline` renders compact muted text for tight spots (e.g.
   * under a hero CTA) where a full callout would be visually heavy.
   */
  variant?: "card" | "inline";
  className?: string;
}

/**
 * Compliance disclosure for Appraisal Intelligence (AVM product).
 *
 * Single source of truth for the AVM wording — AVM_DISCLOSURE_TEXT in
 * src/lib/appraisal-intelligence.ts — so it can't drift between the
 * homepage banner, the product page hero, and the Deal Analysis section.
 * Deliberately a separate component from the appraisal-firm's
 * DealScreenDisclaimer: the AVM product and the certified appraisal
 * services are different products and must read as distinct (appraiser
 * independence).
 */
export default function AvmDisclosure({
  variant = "card",
  className,
}: AvmDisclosureProps) {
  if (variant === "inline") {
    return (
      <p
        className={cn(
          "text-center text-xs leading-relaxed text-muted-foreground",
          className
        )}
        role="note"
      >
        {AVM_DISCLOSURE_TEXT}
      </p>
    );
  }

  return (
    <div
      role="note"
      className={cn(
        "mx-auto flex max-w-3xl items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 p-4 text-left text-sm leading-relaxed text-muted-foreground",
        className
      )}
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <p>{AVM_DISCLOSURE_TEXT}</p>
    </div>
  );
}
