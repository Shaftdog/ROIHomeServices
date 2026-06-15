import {
  BrainCircuit,
  Database,
  GraduationCap,
  ShieldX,
  Sparkles,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

/**
 * SAL-38 / SAL-55 — "Why a regular AI chatbot won't work" + the Data-Lake moat.
 *
 * Two-column contrast: what generic AI gets wrong on valuation, versus the
 * appraiser-grade Data Lake (workfiles + trainings + community) that powers the
 * Deal Screen and compounds over time. Copy is kept compliant — the Deal Screen
 * is decision-support, not an appraisal.
 */

const genericAiPitfalls: {
  icon: typeof ShieldX;
  title: string;
  body: string;
}[] = [
  {
    icon: BrainCircuit,
    title: "It hallucinates valuation theory",
    body: "Ask a general chatbot what a property is worth and it will confidently invent methodology — paraphrasing things it has read rather than applying how value is actually concluded.",
  },
  {
    icon: ShieldX,
    title: "It invents adjustments",
    body: "Generic AI makes up comp adjustments out of thin air — numbers with no paired-sales support, no market evidence, and no way to defend them.",
  },
  {
    icon: Sparkles,
    title: "It shortcuts the value",
    body: "It jumps straight to a number to be helpful, skipping the comp selection, condition reads, and risk checks that decide whether the price actually makes sense.",
  },
  {
    icon: GraduationCap,
    title: "It lacks appraiser domain knowledge",
    body: "Functional obsolescence, location drags, over-improvement, the quirks of a specific submarket — a general model has never sat across the table from these the way an appraiser has.",
  },
  {
    icon: Database,
    title: "Public-grade data, public-grade answers",
    body: "With only public records to draw on — and no proprietary warehouse of real appraisal evidence — the result is a public-grade guess, not an appraiser-grade read.",
  },
];

const dataLakeEdges: {
  icon: typeof Database;
  title: string;
  body: string;
}[] = [
  {
    icon: Database,
    title: "Real appraisal workfiles",
    body: "Our growing Data Lake is built on real appraisal workfiles — the comps, adjustments, and conclusions behind completed work — so the read is grounded in appraiser-grade evidence, not scraped listings.",
  },
  {
    icon: GraduationCap,
    title: "Appraiser trainings baked in",
    body: "Decades of valuation training and review notes shape how the read is framed, so the methodology reflects how a seasoned appraiser actually thinks about a deal.",
  },
  {
    icon: Users,
    title: "A community that compounds",
    body: "Every workfile, training, and member that joins makes the warehouse deeper and the reads sharper — a moat that compounds with the community, not one any generic model can copy.",
  },
];

export default function DealScreenMoatSection() {
  return (
    <section className="bg-deep-charcoal py-16 text-white md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Why a regular AI chatbot won&rsquo;t screen your deal
          </h2>
          <p className="mt-4 text-balance text-lg text-slate-300">
            Ask a general AI &ldquo;what&rsquo;s it worth?&rdquo; and you get a
            confident guess built on public data. The Deal Screen is built on an
            appraiser-grade Data Lake instead &mdash; here&rsquo;s the
            difference.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {/* Generic AI: what goes wrong */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-100">
              <ShieldX className="h-5 w-5 text-red-400" aria-hidden="true" />
              A generic chatbot
            </h3>
            <div className="space-y-4">
              {genericAiPitfalls.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* The Data Lake moat */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-100">
              <Database className="h-5 w-5 text-highlight" aria-hidden="true" />
              Our appraiser-grade Data Lake
            </h3>
            <div className="space-y-4">
              {dataLakeEdges.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-lg border border-highlight/30 bg-highlight/10 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-highlight/20 text-highlight">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100">{title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                      {body}
                    </p>
                  </div>
                </div>
              ))}

              <Card className="border-highlight/30 bg-transparent">
                <CardContent className="p-5">
                  <p className="text-sm leading-relaxed text-slate-200">
                    Order a Deal Screen and you&rsquo;re not buying a one-off
                    answer &mdash; you&rsquo;re tapping an ongoing AI powerhouse
                    that gets sharper with every workfile and member, the way
                    Grok sits on top of X. It&rsquo;s a compounding edge no
                    general-purpose model can match.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-slate-400">
          The Deal Screen is decision-support, not an appraisal. It does not
          guarantee any value, sale price, or appraised value.
        </p>
      </div>
    </section>
  );
}
