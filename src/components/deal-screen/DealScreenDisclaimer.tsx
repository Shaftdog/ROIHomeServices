import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

interface DealScreenDisclaimerProps {
  /**
   * `card` (default) renders a bordered, info-toned callout suited to page
   * sections. `inline` renders compact muted text for tight spots (e.g. under
   * a form) where a full callout would be visually heavy.
   */
  variant?: "card" | "inline";
  className?: string;
}

/**
 * SAL-29 — Compliance disclaimer for the Deal Screen funnel.
 *
 * Single source of truth for the decision-support language so the wording
 * stays identical across the landing page, the order form, and the checkout
 * start page. Visually clear (info-toned, not destructive) so it reassures
 * rather than alarms.
 */
export default function DealScreenDisclaimer({
  variant = "card",
  className,
}: DealScreenDisclaimerProps) {
  const body = (
    <>
      This is <strong className="font-semibold">decision-support</strong> — not
      an appraisal, not an appraisal under USPAP, and not for mortgage lending.
      Values are ranged opinions of most-probable price for the named recipient
      only.
    </>
  );

  if (variant === "inline") {
    return (
      <p
        className={cn(
          "text-center text-xs leading-relaxed text-muted-foreground",
          className
        )}
        role="note"
      >
        {body}
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
      <p>{body}</p>
    </div>
  );
}
