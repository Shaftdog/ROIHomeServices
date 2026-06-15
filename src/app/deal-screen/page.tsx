import type { Metadata } from "next";
import {
  CheckCircle2,
  Gauge,
  ScrollText,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";

import FAQSection from "@/components/shared/FAQSection";
import type { FAQItem } from "@/data/faqs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DealScreenOrderForm from "@/components/deal-screen/DealScreenOrderForm";

export const metadata: Metadata = {
  title: "Deal Screen — Will It Appraise? Know Before You Buy",
  description:
    "The $49 Deal Screen is an appraiser-grade, decision-support read on your next purchase: a go / renegotiate / pass verdict, after-repair value range, MLS-verified comps, margin-killing risk flags, and a pro-forma with break-evens. Not an appraisal.",
  alternates: {
    canonical: "https://www.roihomesvc.com/deal-screen",
  },
  openGraph: {
    title: "Deal Screen — Will It Appraise? Know Before You Buy",
    description:
      "An appraiser-grade, $49 decision-support read on your next deal: verdict, ARV range, MLS-verified comps, risk flags, and a pro-forma with break-evens. Decision-support only — not an appraisal.",
    url: "https://www.roihomesvc.com/deal-screen",
  },
};

const whatYouGet: { icon: typeof CheckCircle2; title: string; body: string }[] =
  [
    {
      icon: Gauge,
      title: "A clear verdict: go / renegotiate / pass",
      body: "A straight call on the deal in front of you — not a wall of numbers to interpret yourself.",
    },
    {
      icon: Target,
      title: "After-repair value (ARV) range",
      body: "A defensible value range for the finished property, grounded in real market evidence.",
    },
    {
      icon: ScrollText,
      title: "MLS-verified comparable sales",
      body: "The actual sold comps behind the number, hand-checked against MLS data — not an automated guess.",
    },
    {
      icon: ShieldAlert,
      title: "The risk flags that kill margin",
      body: "Functional obsolescence, location drags, condition issues, and over-improvement called out before they cost you.",
    },
    {
      icon: Sparkles,
      title: "A pro-forma with break-evens",
      body: "Your numbers run forward to the break-even price and the cushion you have to work with.",
    },
  ];

const dealScreenFAQs: FAQItem[] = [
  {
    question: "Is this an appraisal?",
    answer:
      "No. The Deal Screen is decision-support — a fast, appraiser-grade read to help you decide whether to move on a property. It is not a USPAP appraisal and is not intended for lending, loan underwriting, or any legal or tax use. When you need a certified value for a lender, court, or the IRS, order a full appraisal.",
  },
  {
    question: "How fast will I get it?",
    answer:
      "Most Deal Screens are turned around quickly so you can act before a deal moves. You'll receive your verdict, ARV range, comps, risk flags, and pro-forma in a single, easy-to-read report.",
  },
  {
    question: "What do I need to provide?",
    answer:
      "Just the property address to start. If you have a contract price and a target after-repair value, add them — it sharpens the read and lets us frame your break-evens against your actual numbers.",
  },
  {
    question: "Who is the Deal Screen for?",
    answer:
      "Investors, flippers, and buyers who want an experienced, appraiser-grade gut-check before they commit. It's built to catch the margin-killers early and tell you whether the price makes sense.",
  },
  {
    question: "Why $49?",
    answer:
      "It's an introductory price (normally $149) to make a fast, professional read accessible on every deal you're weighing. The goal is to save you from the bad ones and give you conviction on the good ones.",
  },
  {
    question: "Does a verdict guarantee the property's value?",
    answer:
      "No. The Deal Screen is a professional opinion to support your decision — it does not guarantee a value, a sale price, or a lender's appraised value. You remain responsible for your own purchase decision.",
  },
];

export default function DealScreenPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-deep-charcoal to-accent text-white">
        <div className="container mx-auto grid items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-semibold text-highlight-foreground">
              <Sparkles className="h-4 w-4" />
              Intro price &mdash; $49 (normally $149)
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Will It Appraise? Know Before You Buy.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-200">
              The Deal Screen is an appraiser-grade, decision-support read on
              your next purchase &mdash; a fast, clear answer on whether the
              price makes sense, so you can move with conviction or walk away
              before it costs you.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="highlight"
                className="text-base"
              >
                <a href="#order-form">Screen My Deal &mdash; $49</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#what-you-get">See What You Get</a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-slate-300">
              Decision-support only &mdash; not an appraisal, not for lending.
            </p>
          </div>

          {/* Inline order form as the primary conversion point */}
          <div className="scroll-mt-24 lg:justify-self-end" id="order-form">
            <DealScreenOrderForm
              id="hero-order-form"
              className="w-full max-w-md bg-background text-foreground shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* WHAT YOU GET FOR $49 */}
      <section
        id="what-you-get"
        className="container mx-auto scroll-mt-24 px-4 py-16 sm:px-6 md:py-24 lg:px-8"
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            What you get for $49
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete, appraiser-grade read on the deal &mdash; everything you
            need to decide, in one report.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">
          {whatYouGet.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="h-full">
              <CardContent className="flex gap-4 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-1 text-muted-foreground">{body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-highlight" />
          Built and reviewed by a Florida appraisal professional with 30+ years
          in the market.
        </p>
      </section>

      {/* PRICE FRAMING */}
      <section className="bg-light-gray py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mx-auto max-w-3xl border-accent/20 shadow-md">
            <CardContent className="flex flex-col items-center gap-6 p-8 text-center md:p-12">
              <h2 className="text-3xl font-bold md:text-4xl">
                One smart deal pays for a thousand screens
              </h2>
              <div className="flex items-end justify-center gap-3">
                <span className="text-2xl font-medium text-muted-foreground line-through">
                  $149
                </span>
                <span className="text-5xl font-bold text-accent md:text-6xl">
                  $49
                </span>
              </div>
              <p className="max-w-xl text-balance text-muted-foreground">
                Introductory pricing for a fast, professional read on every deal
                you&rsquo;re weighing. Catch the margin-killers before you sign,
                and walk into the good ones with conviction.
              </p>
              <Button asChild size="lg" className="text-base">
                <a href="#order-form">Screen My Deal &mdash; $49</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection
        title="Deal Screen FAQs"
        subtitle="The short answers — including the one everyone asks first."
        items={dealScreenFAQs}
        className="bg-background"
      />

      {/* FINAL ORDER FORM — primary conversion point */}
      <section className="bg-light-gray py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Screen your deal in minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Enter the address to get your verdict, ARV range, comps, risk
              flags, and pro-forma.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <DealScreenOrderForm id="bottom-order-form" />
          </div>
        </div>
      </section>

      {/* Compliance line */}
      <section className="bg-background py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mx-auto max-w-3xl text-center text-sm text-muted-foreground">
            Decision-support only &mdash; not an appraisal, not for lending. The
            Deal Screen is a professional opinion to support your purchase
            decision and does not guarantee any value, sale price, or appraised
            value.
          </p>
        </div>
      </section>
    </div>
  );
}
