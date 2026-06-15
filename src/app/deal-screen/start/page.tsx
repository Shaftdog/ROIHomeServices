import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Complete Your Deal Screen — $49",
  description:
    "Complete your $49 Deal Screen order. Secure checkout for an appraiser-grade, decision-support read on your deal.",
  alternates: {
    canonical: "https://www.roihomesvc.com/deal-screen/start",
  },
  // Checkout/intermediate funnel page — keep it out of the index.
  robots: { index: false, follow: false },
};

interface StartPageProps {
  // Next.js 15 App Router delivers searchParams as a Promise.
  searchParams: Promise<{
    address?: string;
    contract?: string;
    arv?: string;
  }>;
}

/** Format a raw digit string as USD, falling back to the raw value. */
function formatCurrency(raw?: string): string | null {
  if (!raw) return null;
  const num = Number(raw);
  if (isNaN(num)) return raw;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export default async function DealScreenStartPage({
  searchParams,
}: StartPageProps) {
  const { address, contract, arv } = await searchParams;

  const propertyLabel = address?.trim() || "your property";
  const contractDisplay = formatCurrency(contract);
  const arvDisplay = formatCurrency(arv);

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <Card className="mx-auto max-w-xl shadow-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl text-primary">
            Complete your $49 Deal Screen for {propertyLabel}
          </CardTitle>
          <CardDescription>
            You&rsquo;re one step from your verdict, ARV range, MLS-verified
            comps, risk flags, and pro-forma.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <dl className="divide-y rounded-lg border bg-secondary/40 text-sm">
            <div className="flex items-center justify-between gap-4 p-4">
              <dt className="font-medium text-muted-foreground">Property</dt>
              <dd className="text-right font-semibold">{propertyLabel}</dd>
            </div>
            {contractDisplay && (
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="font-medium text-muted-foreground">
                  Contract price
                </dt>
                <dd className="text-right font-semibold">{contractDisplay}</dd>
              </div>
            )}
            {arvDisplay && (
              <div className="flex items-center justify-between gap-4 p-4">
                <dt className="font-medium text-muted-foreground">
                  Target ARV
                </dt>
                <dd className="text-right font-semibold">{arvDisplay}</dd>
              </div>
            )}
            <div className="flex items-center justify-between gap-4 p-4">
              <dt className="font-medium text-muted-foreground">Deal Screen</dt>
              <dd className="text-right font-semibold text-accent">$49</dd>
            </div>
          </dl>

          <div className="flex items-start gap-3 rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm text-muted-foreground">
            <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-accent" />
            <p>
              Secure $49 checkout is being wired up. Your details have been
              captured &mdash; payment will be enabled here shortly so you can
              complete your order.
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/deal-screen">Back to Deal Screen</Link>
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Decision-support only &mdash; not an appraisal, not for lending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
