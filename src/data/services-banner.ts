import offeringsData from "../../public/data/offerings.json";
import type { Offering } from "@/types/offerings";
import { freeScreenUrl, AVM_DISCLOSURE_TEXT } from "@/lib/appraisal-intelligence";

const offerings = offeringsData as Offering[];

/** Looks up a live href/title from offerings.json so slugs can't drift. */
function offering(id: string): Offering {
  const found = offerings.find((o) => o.id === id);
  if (!found) {
    throw new Error(`services-banner: offering "${id}" not found in offerings.json`);
  }
  return found;
}

export interface ServicesBannerSlide {
  id: string;
  eyebrow?: string;
  /** Plain-language benefit headline. Rendered as an h2 — the page's h1 is static, above the banner. */
  headline: string;
  support: string;
  ctaLabel: string;
  ctaHref: string;
  background: "video" | "gradient";
  gradientClassName?: string;
  /** Small-print compliance text rendered under the CTA, styled for a dark hero overlay. */
  disclosureText?: string;
}

export const servicesBannerSlides: ServicesBannerSlide[] = [
  {
    id: "appraisal-intelligence",
    eyebrow: "New: Appraisal Intelligence",
    headline: "Know a deal's value, rehab and projected profit before you sign",
    support:
      "Screen any property in minutes and get a clear go / caution / no-go call, built on real appraiser expertise.",
    ctaLabel: "Screen a deal free",
    ctaHref: freeScreenUrl("home-banner"),
    background: "video",
    disclosureText: AVM_DISCLOSURE_TEXT,
  },
  {
    id: "billionaires-blueprint",
    headline: "A value strategy that runs with your deal, start to exit",
    support:
      "The Billionaire's Blueprint pairs an appraiser's eye with your acquisition, refinance, and resale.",
    ctaLabel: "See the Blueprint",
    ctaHref: "/billionaire-blueprint",
    background: "gradient",
    gradientClassName: "bg-gradient-to-br from-deep-charcoal via-accent to-deep-charcoal",
  },
  {
    id: "florida-appraisals",
    headline: "Certified Florida appraisals, done right the first time",
    support: offering("appraisal").blurb,
    ctaLabel: "Get a Florida appraisal",
    ctaHref: offering("appraisal").href,
    background: "gradient",
    gradientClassName: "bg-gradient-to-br from-accent to-deep-charcoal",
  },
  {
    id: "deal-analysis",
    headline: "A $297 second opinion before you commit",
    support:
      "Certified Deal Analysis in Florida; an MLS-Supported Deal Analysis everywhere else. Not an appraisal.",
    ctaLabel: "See Deal Analysis pricing",
    ctaHref: "/appraisal-intelligence#deal-analysis",
    background: "gradient",
    gradientClassName: "bg-gradient-to-br from-deep-charcoal via-slate-700 to-accent",
  },
  {
    id: "rent-surveys",
    headline: "Know the real rent before you price a lease",
    support: "Long-term and short-term rent surveys, backed by market data, not a guess.",
    ctaLabel: "See rent survey options",
    ctaHref: "/offerings#services",
    background: "gradient",
    gradientClassName: "bg-gradient-to-br from-accent via-deep-charcoal to-accent",
  },
  {
    id: "tax-prelisting",
    headline: "Protect your number, before the tax bill or the listing",
    support: "Tax appeal and pre-listing appraisal packages that hold up when it counts.",
    ctaLabel: "See tax & pre-listing packages",
    ctaHref: "/offerings#solutions",
    background: "gradient",
    gradientClassName: "bg-gradient-to-br from-deep-charcoal to-accent/80",
  },
];
