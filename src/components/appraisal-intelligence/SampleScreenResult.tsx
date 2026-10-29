import { AlertTriangle, TrendingUp, Wrench, DollarSign } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Static mock of a screen result, for illustration only.
 *
 * "412 Mockingbird Lane, Maitland, FL 32751" is a made-up property — not a
 * real address, order, or client result. Never swap this for a real screen;
 * see the Copy rules in the build brief (no real client data on the
 * marketing site).
 */
const MOCK_ADDRESS = "412 Mockingbird Lane, Maitland, FL 32751";

const verdictStyles: Record<"go" | "caution" | "no-go", string> = {
  go: "bg-highlight text-highlight-foreground",
  caution: "bg-amber-400 text-amber-950",
  "no-go": "bg-destructive text-destructive-foreground",
};

export default function SampleScreenResult({ className }: { className?: string }) {
  return (
    <Card className={cn("mx-auto max-w-2xl overflow-hidden shadow-lg", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-light-gray px-6 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Sample screen &mdash; made-up property
          </p>
          <p className="font-semibold">{MOCK_ADDRESS}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wide",
            verdictStyles.caution
          )}
        >
          Caution
        </span>
      </div>
      <CardContent className="grid gap-6 p-6 sm:grid-cols-3">
        <div className="flex items-start gap-3">
          <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="text-sm text-muted-foreground">Supported value</p>
            <p className="text-lg font-semibold">$285,000&ndash;$305,000</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Wrench className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="text-sm text-muted-foreground">Rehab estimate</p>
            <p className="text-lg font-semibold">$34,000&ndash;$52,000</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <DollarSign className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="text-sm text-muted-foreground">Projected profit</p>
            <p className="text-lg font-semibold">$6,200&ndash;$21,800</p>
          </div>
        </div>
        <div className="sm:col-span-3 flex items-start gap-3 rounded-lg bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Why &ldquo;caution&rdquo;: projected profit only clears the buy-box minimum at
            the cheap end of the rehab range. Verify scope of work and get a
            contractor bid before you firm up an offer.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
