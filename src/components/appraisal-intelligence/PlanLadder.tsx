import Link from "next/link";
import { Check, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  APPRAISAL_INTELLIGENCE_PLANS,
  SCREEN_PACKS,
  accuracyRecordUrl,
  freeScreenUrl,
} from "@/lib/appraisal-intelligence";

/**
 * Subscription ladder + one-time screen packs for Appraisal Intelligence.
 * Numbers mirror Salesmod's src/lib/investor/billing/plans.ts — see the
 * comment there for how to keep the two in sync.
 */
export default function PlanLadder() {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {APPRAISAL_INTELLIGENCE_PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              "relative flex flex-col",
              plan.featured && "border-accent shadow-lg ring-1 ring-accent"
            )}
          >
            <CardHeader>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="text-3xl font-bold">
                ${plan.monthlyPrice}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or ${plan.annualPrice}/yr
              </p>
              <p className="mt-4 flex-1 text-sm text-muted-foreground">{plan.description}</p>
              <Button asChild className="mt-6" variant={plan.featured ? "default" : "outline"}>
                <Link href={freeScreenUrl(`ai-page-plan-${plan.id}`)}>Start with {plan.name}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-center text-lg font-semibold">Prefer to pay per screen?</h3>
        <p className="mx-auto mt-1 max-w-md text-center text-sm text-muted-foreground">
          One-time screen packs, no subscription — good for a year.
        </p>
        <div className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
          {SCREEN_PACKS.map((pack) => (
            <Card key={pack.id} className="flex flex-col items-center p-6 text-center">
              <p className="text-2xl font-bold">${pack.price}</p>
              <p className="mt-1 text-sm text-muted-foreground">{pack.name}</p>
              <Button asChild className="mt-4 w-full" variant="outline" size="sm">
                <Link href={freeScreenUrl(`ai-page-pack-${pack.id}`)}>Start free</Link>
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-start justify-center gap-2 text-sm text-muted-foreground">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-highlight" aria-hidden="true" />
        <p>
          Every plan is the automated valuation (AVM) — see the disclosure
          above. For a certified appraiser&rsquo;s opinion of value, see{" "}
          <Link href="#deal-analysis" className="font-medium text-accent hover:underline">
            Deal Analysis
          </Link>
          .
        </p>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        How accurate is the Screen?{" "}
        <a href={accuracyRecordUrl("ai-page-plans-accuracy")}
          className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
          See our published accuracy record <span aria-hidden="true">&rarr;</span>
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </p>
    </div>
  );
}
