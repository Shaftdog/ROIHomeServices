import type { Metadata } from "next";

import DealScreenCheckout from "@/components/deal-screen/DealScreenCheckout";
import DealScreenDisclaimer from "@/components/deal-screen/DealScreenDisclaimer";

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
      <DealScreenCheckout
        deal={{
          address: address?.trim() || undefined,
          contract: contract || undefined,
          arv: arv || undefined,
        }}
        display={{
          propertyLabel,
          contract: contractDisplay,
          arv: arvDisplay,
        }}
      />

      {/* SAL-29 — compliance disclaimer on the checkout/start page */}
      <div className="mt-10">
        <DealScreenDisclaimer />
      </div>
    </div>
  );
}
