import type { Metadata } from 'next';
import { AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import BlueprintVideo from '@/components/blueprint/BlueprintVideo';
import BlueprintLifecycle from '@/components/blueprint/BlueprintLifecycle';
import BlueprintProductTile from '@/components/blueprint/BlueprintProductTile';
import BlueprintProductDetail from '@/components/blueprint/BlueprintProductDetail';
import BlueprintPackages from '@/components/blueprint/BlueprintPackages';
import BlueprintTestimonials from '@/components/blueprint/BlueprintTestimonials';
import BlueprintWebinarButton from '@/components/blueprint/BlueprintWebinarButton';
import BlueprintChatWidget from '@/components/blueprint/BlueprintChatWidget';
import {
  CatalogUnavailableError,
  fetchBlueprintCatalog,
  formatUsd,
  groupCatalog,
  sumAmountCents,
  type BlueprintProduct,
} from '@/lib/blueprint-catalog';
import { EXPLAINER_VIDEO_URL, HERO_VIDEO_URL, BOOKING_PATH } from '@/lib/blueprint-config';
import { verifyCheckoutSession, type CheckoutVerdict } from '@/lib/blueprint-checkout-verify';

export const metadata: Metadata = {
  title: "The Billionaire's Blueprint — Value Strategy for Investors",
  description:
    "See the deal the way the appraiser will. A five-step appraisal system that runs alongside your project from acquisition through refinance or exit, plus a low-cost deal screen before you go under contract.",
  alternates: {
    canonical: 'https://www.roihomesvc.com/billionaire-blueprint',
  },
  openGraph: {
    title: "The Billionaire's Blueprint — Value Strategy for Investors",
    description:
      'A five-step appraisal system for investors, from acquisition through refinance or exit.',
    url: 'https://www.roihomesvc.com/billionaire-blueprint',
  },
};

interface PageProps {
  searchParams: Promise<{ checkout?: string; session_id?: string }>;
}

/** Rendered when the catalog can't be read — we never show a remembered price. */
function PricingUnavailable() {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center">
      <AlertCircle className="mx-auto h-6 w-6 text-destructive" aria-hidden="true" />
      <h2 className="mt-3 text-xl font-semibold">Pricing is temporarily unavailable</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        We couldn&rsquo;t load the product catalog just now, and we&rsquo;d rather show you
        nothing than a price we can&rsquo;t confirm. Book a call and Rod will walk you
        through the options directly.
      </p>
      <Button asChild className="mt-4">
        <a href={BOOKING_PATH}>Book a call</a>
      </Button>
    </div>
  );
}

/**
 * Renders only what Stripe confirms. `verdict` comes from retrieving the Checkout
 * Session server-side — a typed `?checkout=success` yields 'unknown', which says
 * nothing about payment rather than congratulating someone who paid nothing.
 */
function CheckoutBanner({ verdict }: { verdict: CheckoutVerdict }) {
  if (verdict === 'unknown') return null;

  const paid = verdict === 'paid';
  return (
    <div
      role="status"
      className={`border-b px-4 py-3 text-center text-sm ${
        paid ? 'border-highlight/40 bg-highlight/10' : 'border-border bg-light-gray'
      }`}
    >
      {paid ? (
        <span className="inline-flex items-center gap-2 font-medium">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          Payment confirmed — Rod will follow up by email.
        </span>
      ) : verdict === 'cancelled' ? (
        <span className="text-muted-foreground">Checkout cancelled — nothing was charged.</span>
      ) : (
        <span className="text-muted-foreground">
          We haven&apos;t seen a completed payment for that checkout yet. If you just paid, give it a
          moment and refresh — otherwise nothing was charged.
        </span>
      )}
    </div>
  );
}

function GroupSection({
  id,
  title,
  subtitle,
  products,
  className = '',
}: {
  id: string;
  title: string;
  subtitle?: string;
  products: BlueprintProduct[];
  className?: string;
}) {
  if (products.length === 0) return null;

  return (
    <section id={id} className={`scroll-mt-24 py-14 md:py-20 ${className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
          {subtitle && <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>}
        </div>
        <div
          className={`mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 ${
            products.length > 2 ? 'lg:grid-cols-3' : ''
          }`}
        >
          {products.map((product) => (
            <BlueprintProductTile
              key={product.sku}
              product={product}
              featured={product.flagship}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function BillionaireBlueprintPage({ searchParams }: PageProps) {
  const { checkout, session_id: sessionId } = await searchParams;
  // Verified with Stripe, not taken from the query string.
  const checkoutVerdict = await verifyCheckoutSession(checkout, sessionId);

  let catalog: BlueprintProduct[] | null = null;
  try {
    catalog = await fetchBlueprintCatalog();
  } catch (error) {
    // A missing catalog degrades the page; it must not 500 it. Anything other than
    // an expected catalog failure is a real bug and should surface.
    if (!(error instanceof CatalogUnavailableError)) throw error;
  }

  const grouped = catalog ? groupCatalog(catalog) : null;
  const tripwire = grouped?.['billionaire-tripwire'] ?? [];
  const ladder = grouped?.['billionaire-ladder'] ?? [];
  const packages = grouped?.['billionaire-package'] ?? [];
  const addons = grouped?.['billionaire-addon'] ?? [];
  const entryProduct = tripwire[0] ?? ladder[0] ?? null;

  return (
    <div>
      <CheckoutBanner verdict={checkoutVerdict} />

      {/* HERO — intro video + the offer in one screen */}
      <section className="bg-gradient-to-br from-deep-charcoal to-accent text-white">
        <div className="container mx-auto grid items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center rounded-full bg-highlight px-4 py-1.5 text-sm font-semibold text-highlight-foreground">
              The Billionaire&rsquo;s Blueprint
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              See the deal the way the appraiser will.
            </h1>
            <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-slate-200">
              Investors lose margin at the appraisal, not at the closing table. This is
              a {ladder.length > 0 ? `${ladder.length}-step` : 'staged'} appraisal system that
              runs with your project &mdash; from the property you&rsquo;re about to put under
              contract, through the rehab, to the value a lender&rsquo;s appraiser puts on it at
              the end.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {entryProduct && (
                <Button asChild size="lg" variant="highlight" className="text-base">
                  <a href="#products">
                    See the products
                    <ArrowRight aria-hidden="true" />
                  </a>
                </Button>
              )}
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#lifecycle">How it works</a>
              </Button>
            </div>

            {ladder.length > 0 && (
              <p className="mt-6 text-sm text-slate-300">
                {ladder.length} steps &middot; {formatUsd(sumAmountCents(ladder))} if bought
                individually &middot; packages below
              </p>
            )}
          </div>

          <div>
            <BlueprintVideo
              url={HERO_VIDEO_URL}
              title="Introduction to the Billionaire's Blueprint"
              emptyLabel="Intro video"
              className="shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* EXPLAINER + DEAL-LIFECYCLE TIMELINE */}
      <section id="lifecycle" className="scroll-mt-24 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Where each piece fires</h2>
            <p className="mt-3 text-lg text-muted-foreground">
              The steps are sequenced to a deal, not to a menu. Here&rsquo;s the order they
              come in and what each one costs.
            </p>
          </div>

          <div className="mx-auto mb-12 max-w-3xl">
            <BlueprintVideo
              url={EXPLAINER_VIDEO_URL}
              title="How the Billionaire's Blueprint works across a deal"
              emptyLabel="Explainer video"
            />
          </div>

          {grouped ? (
            <BlueprintLifecycle tripwire={tripwire} ladder={ladder} addons={addons} />
          ) : (
            <PricingUnavailable />
          )}
        </div>
      </section>

      {/* PRODUCT TILES, GROUPED AS THE CATALOG GROUPS THEM */}
      {grouped ? (
        <>
          <div id="products" className="scroll-mt-24" />

          <GroupSection
            id="start-here"
            title="Start before you commit"
            subtitle="A cheap read on the deal in front of you, before you are on the hook for it."
            products={tripwire}
            className="bg-light-gray"
          />

          <GroupSection
            id="steps"
            title={ladder.length > 0 ? `The ${ladder.length} steps` : 'The steps'}
            subtitle="Buy the step you need, or the whole system as a package below."
            products={ladder}
          />

          <GroupSection
            id="addons"
            title="Add-ons"
            subtitle="Ongoing coverage that runs alongside the steps."
            products={addons}
            className="bg-light-gray"
          />

          {/* PER-PRODUCT DETAIL — one section per ladder rung */}
          {ladder.length > 0 && (
            <section id="details" className="scroll-mt-24 py-16 md:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-12 max-w-2xl text-center">
                  <h2 className="text-3xl font-bold md:text-4xl">Step by step</h2>
                  <p className="mt-3 text-lg text-muted-foreground">
                    What each step is, when it fires, and what it costs.
                  </p>
                </div>
                <div className="mx-auto max-w-5xl">
                  {ladder.map((product) => (
                    <BlueprintProductDetail key={product.sku} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* PACKAGES — positioned against buying the rungs individually */}
          {packages.length > 0 && (
            <section id="packages" className="scroll-mt-24 bg-light-gray py-16 md:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mx-auto mb-10 max-w-2xl text-center">
                  <h2 className="text-3xl font-bold md:text-4xl">Packages</h2>
                  <p className="mt-3 text-lg text-muted-foreground">
                    Bundled, and priced against what the same pieces cost one at a time.
                  </p>
                </div>
                <BlueprintPackages packages={packages} ladder={ladder} addons={addons} />
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <PricingUnavailable />
          </div>
        </section>
      )}

      {/*
        TESTIMONIALS — renders nothing until a real, permission-granted quote exists.
        See src/data/blueprint-testimonials.ts; do not add sample copy there.
      */}
      <BlueprintTestimonials />

      {/* CLOSING CTA */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold md:text-4xl">Not sure which step you&rsquo;re on?</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
            Tell us where the deal is and we&rsquo;ll point you at the right one.
          </p>
          <Button asChild size="lg" className="mt-6 text-base">
            <a href={BOOKING_PATH}>Book a call</a>
          </Button>
        </div>
      </section>

      {/* Floating, always visible */}
      <BlueprintWebinarButton />
      <BlueprintChatWidget />
    </div>
  );
}
