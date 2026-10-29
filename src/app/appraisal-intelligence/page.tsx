import type { Metadata } from "next";
import Link from "next/link";
import {
  Gauge,
  MapPin,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CtaButton } from "@/components/shared/cta-button";
import { Card, CardContent } from "@/components/ui/card";
import FAQSection from "@/components/shared/FAQSection";
import { appraisalIntelligenceFAQs } from "@/data/faqs";
import { ServiceSchema } from "@/components/seo/JsonLd";
import AvmDisclosure from "@/components/appraisal-intelligence/AvmDisclosure";
import SampleScreenResult from "@/components/appraisal-intelligence/SampleScreenResult";
import PlanLadder from "@/components/appraisal-intelligence/PlanLadder";
import { freeScreenUrl, productSiteUrl } from "@/lib/appraisal-intelligence";

const PAGE_URL = "https://www.roihomesvc.com/appraisal-intelligence";

export const metadata: Metadata = {
  title: "Appraisal Intelligence — Screen a Deal in Minutes",
  description:
    "Screen any property for value, rehab, and projected profit with a clear go / caution / no-go call. An automated valuation (AVM), not an appraisal — plus a $297 Deal Analysis when you want a human second opinion.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Appraisal Intelligence — Screen a Deal in Minutes",
    description:
      "Value, rehab, and projected profit with a go / caution / no-go call. An automated valuation (AVM), not an appraisal.",
    url: PAGE_URL,
  },
};

const howItWorks: { icon: typeof MapPin; title: string; body: string }[] = [
  {
    icon: MapPin,
    title: "Add an address",
    body: "Drop in the property you're considering. No account needed for your first free screen.",
  },
  {
    icon: Gauge,
    title: "Get your call",
    body: "A supported value range, a rehab estimate, and projected profit — resolved into a clear go / caution / no-go.",
  },
  {
    icon: ShieldCheck,
    title: "See why, and what to verify",
    body: "The reasoning behind the call and what to confirm yourself before you move — this is a screen, not a guarantee.",
  },
];

export default function AppraisalIntelligencePage() {
  return (
    <div>
      <ServiceSchema
        name="Appraisal Intelligence"
        description="Automated valuation (AVM) deal screening: value, rehab, and projected profit with a go / caution / no-go call."
        url={PAGE_URL}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-deep-charcoal to-accent text-white">
        <div className="container mx-auto px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-semibold text-highlight-foreground">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Appraisal Intelligence
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Know a deal&rsquo;s value, rehab, and projected profit &mdash; before you sign
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-200">
            Screen any property in minutes and get a clear go / caution /
            no-go call, built on real appraiser expertise.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="highlight" className="text-base">
              <Link href={freeScreenUrl("ai-page-hero")}>Screen a deal free</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
            >
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </div>
      </section>

      {/* DISCLOSURE — directly under the hero CTAs */}
      <section className="bg-light-gray py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AvmDisclosure />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="container mx-auto scroll-mt-24 px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Three steps from address to a decision you can act on.
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
          {howItWorks.map(({ icon: Icon, title, body }, index) => (
            <Card key={title} className="h-full">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">
                  {index + 1}. {title}
                </h3>
                <p className="mt-1 text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* SAMPLE SCREEN */}
      <section className="bg-light-gray py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">See a sample screen</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A made-up property, shown for illustration only &mdash; never a
              real client address or result.
            </p>
          </div>
          <SampleScreenResult />
        </div>
      </section>

      {/* PLANS */}
      <section className="container mx-auto px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Plans &amp; screen packs</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Subscribe for ongoing deal flow, or buy a pack when
            you only need a few.
          </p>
        </div>
        <PlanLadder />
      </section>

      {/* DEAL ANALYSIS */}
      <section id="deal-analysis" className="scroll-mt-24 bg-light-gray py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-3xl border-accent/20 shadow-md">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-sm font-semibold text-accent">
                Human second opinion &mdash; $297
              </span>
              <h2 className="text-3xl font-bold md:text-4xl">Deal Analysis</h2>
              <p className="max-w-xl text-balance text-muted-foreground">
                Want a person to check the automated call? For Florida
                properties, a <strong className="font-semibold text-foreground">Certified Deal Analysis</strong>{" "}
                is prepared by a Florida-licensed appraiser. Outside Florida,
                an <strong className="font-semibold text-foreground">MLS-Supported Deal Analysis</strong> is
                available for your own decisions.
              </p>
              <p className="max-w-xl text-balance text-sm text-muted-foreground">
                Neither is an appraisal. The MLS-Supported Deal Analysis is
                not certified and is not valid outside Florida for certified
                use.
              </p>
              <CtaButton calendlyEventType="Investor Consult" size="lg" className="text-base">
                Order a Deal Analysis
              </CtaButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        title="Appraisal Intelligence FAQs"
        subtitle="What it is, what it isn't, and how it fits with our certified appraisal services."
        items={appraisalIntelligenceFAQs}
        className="bg-background"
      />

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-deep-charcoal to-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">
            Screen your next deal before you sign
          </h2>
          <p className="text-lg text-slate-200 mb-6 max-w-2xl mx-auto text-balance">
            Value, rehab, and projected profit, with a clear call &mdash; in
            minutes, free.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" variant="highlight" className="px-10 py-6 text-lg font-semibold">
              <Link href={freeScreenUrl("ai-page-final-cta")}>Screen a deal free</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-300">
            <a
              href={productSiteUrl("ai-page-final-cta")}
              className="inline-flex items-center gap-1 underline hover:text-white"
            >
              Learn more at appraisal-intelligence.com
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </p>
          <div className="mx-auto mt-8 max-w-xl">
            <AvmDisclosure variant="inline" className="text-slate-300" />
          </div>
        </div>
      </section>
    </div>
  );
}
