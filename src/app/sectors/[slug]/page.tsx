
import type { Offering } from '@/types/offerings';
import offeringsData from '../../../../public/data/offerings.json';
import { notFound } from 'next/navigation';
import { CtaButton } from '@/components/shared/cta-button';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const typedOfferingsData: Offering[] = offeringsData as Offering[];

export async function generateStaticParams() {
  const sectors = typedOfferingsData.filter((o) => o.category === 'sector');
  return sectors.map((sector) => ({
    slug: sector.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'sector');

  if (!offering) {
    return {
      title: "Sector Not Found",
    };
  }

  return {
    title: `${offering.title} | Sectors`,
    description: `Learn more about our services for the ${offering.title} sector. ${offering.blurb}`,
    alternates: {
      canonical: `https://www.roihomesvc.com/sectors/${offering.id}`,
    },
    openGraph: {
      title: `${offering.title} Sector | ROI Home Services`,
      description: offering.blurb,
      url: `https://www.roihomesvc.com/sectors/${offering.id}`,
    },
  };
}

export default function SectorDetailPage({ params }: { params: { slug: string } }) {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'sector');

  if (!offering) {
    notFound();
  }
  
  if (offering.id === 'disposition') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sectors
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Sector</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Sell (or exit) on your terms anywhere in Florida. Our Disposition service bundles only what you need—from a simple, accurate valuation to a full‑service package that includes advocacy, marketing, appraisal, legal support, transaction coordination, and design/staging. We start with a strategy session to define price, timing, and constraints, then build a critical‑path plan covering prep, launch, negotiation, and close. You’ll get clear pricing guidance, a launch‑ready marketing kit, stakeholder coordination (agents, lenders, title/escrow, HOAs, attorneys), and weekly progress reports. Prefer a lighter touch? Choose valuation‑only or à‑la‑carte modules and handle the rest yourself—we’ll still provide a checklist and milestones so nothing slips. Our goal is a smooth, transparent process that maximizes proceeds and minimizes friction. ROI Home Services is not a law firm; any legal work is performed by or under the supervision of licensed attorneys you engage.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We tailor the bundle to your objectives and keep every step documented and on schedule.</p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
                        Book a Free Consultation
                    </CtaButton>
                </div>
            </section>

            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is included in the Disposition service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Discovery/strategy session and pricing guidance</li>
                                <li>Choice of modules: valuation (restricted appraisal or consult), advocacy, marketing launch, design/staging, transaction coordination, and legal support coordination</li>
                                <li>Launch plan: prep checklist, media production, listing/syndication, buyer outreach</li>
                                <li>Offer management and negotiation support; weekly status dashboard</li>
                                <li>Closing coordination with title/escrow, lender, HOA/COA, and attorneys</li>
                                <li>Deliverables: plan, timeline, issue log, and organized closing packet</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Disposition process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Typical prep to launch: 5–10 business days (faster with existing media). Contract to close: 30–45 days for financed deals and 10–21 days for cash, subject to title/HOA and lender timelines. Rush options and auction/wholesale alternatives available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Disposition service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address, access instructions, disclosures, HOA/COA details</li>
                                <li>Basic facts: beds/baths, SF, lot size, improvements, permits</li>
                                <li>Target price, timeline, and constraints (tenant, repairs, payoff/liens)</li>
                                <li>Preferred service bundle (full‑service vs. à‑la‑carte) and budget</li>
                                <li>Contacts for stakeholders (agent, lender, title/escrow, attorney) and preferred update cadence</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'acquisitions') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sectors
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Sector</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Buy with confidence anywhere in Florida. Our Acquisition service bundles only what you need—from search and screening to due diligence, underwriting, negotiation, and closing. We start with a strategy session to define criteria (location, budget, property type, returns/affordability, timeline) and build a targeted pipeline. We pre‑screen opportunities, provide market‑supported valuation (restricted appraisal or consult), rent surveys (short‑ and long‑term), and an operating model (T12/T6/T3 normalization with repair and CapEx budgets). We coordinate inspections, insurance quotes, title/commitment and survey review, HOA/COA requirements, lender pre‑approval, and appraisal scheduling; then craft an offer, escalation, and contingency plan. Throughout the process you’ll receive a clear checklist, critical‑dates timeline, and weekly updates through escrow to close. Prefer à‑la‑carte? Pick only the modules you need and keep full control. ROI Home Services is not a law firm; any legal work is performed by or under the supervision of licensed attorneys you engage.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We tailor the bundle to your objective and keep every milestone documented, proactive, and on schedule.</p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
                        Book a Free Consultation
                    </CtaButton>
                </div>
            </section>

            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is included in the Acquisition service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Criteria & sourcing plan; curated deal pipeline</li>
                                <li>Valuation support (restricted appraisal or consult) and rent surveys (LTR/STR)</li>
                                <li>Underwriting: income/expense normalization (T12/T6/T3), DSCR/cash‑on‑cash, sensitivity</li>
                                <li>Inspections coordination; repair/CapEx budgeting and timeline</li>
                                <li>Title/commitment & survey review, HOA/COA requirements, insurance coordination</li>
                                <li>Offer strategy, negotiation support, and contingency tracking</li>
                                <li>Transaction coordination from execution to closing; weekly status dashboard</li>
                                <li>Optional add‑ons: advocacy, marketing (for BRRRR/flip exit), legal support coordination</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Acquisition process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Search to contract varies by market and criteria. Typical due‑diligence periods are 7–15 days; financed purchases usually close in 30–45 days, cash in 10–21 days, subject to title/HOA and lender timelines. Rush options and off‑market sourcing are available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Acquisition service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Target criteria (location, budget, property type, beds/baths, condition) and timeline</li>
                                <li>Proof of funds or lender pre‑approval, plus preferred lender/insurance contacts</li>
                                <li>Access for inspections and appraisal; HOA/COA info if applicable</li>
                                <li>Any prior valuations, rent rolls, or underwriting you want considered</li>
                                <li>Preferred communication method and update cadence</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'development') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sectors
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Sector</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Turn raw land or plans into bankable projects anywhere in Florida. Our Development service delivers feasibility analysis, valuation, and consulting for new construction and land development—from SFR and townhomes to multifamily, mixed‑use, and small commercial. We combine market studies (demand, absorption, rent/price comps), highest and best use, density/yield, and residual land value with a clear entitlement roadmap (zoning, variances, concurrency, impact fees). You’ll receive a concise go/no‑go memo, sensitivity‑tested pro forma (costs, revenues, timelines), risk register, and lender‑ready exhibits you can share with partners or investors. We coordinate with surveyors, civil/architectural teams, and title to highlight constraints (floodplain/wetlands, utilities, access, easements) and opportunities (phasing, BRTR, amenity mix). Whether you’re weighing an offer, sharpening a site plan, or aligning take‑out financing, our guidance is objective, practical, and fast. ROI Home Services is not a law, engineering, or surveying firm; we coordinate with licensed professionals you engage.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We pair disciplined underwriting with Florida‑specific entitlement and market know‑how.</p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
                        Book a Free Consultation
                    </CtaButton>
                </div>
            </section>

            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is included in the Development service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Site & context brief (parcel data, access, utilities, environmental flags)</li>
                                <li>Market/absorption study with rent/sale comps and program recommendations</li>
                                <li>Highest & Best Use, density/yield analysis, and residual land value</li>
                                <li>Conceptual pro forma with sensitivity (cost, price/rent, schedule, financing)</li>
                                <li>Entitlement roadmap (zoning, permits, concurrency, impact/utility fees)</li>
                                <li>Risk register and mitigation plan; lender‑ready summary deck</li>
                                <li>Optional add‑ons: appraisal, operating model (T12/T6/T3), survey/title review coordination, design/staging concepts for presales/lease‑up</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Development process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                         Rapid screen: 3–5 business days after intake. Full feasibility: 7–15 business days (scope‑dependent). Entitlement coordination timelines vary by jurisdiction; rush options may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Development service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Parcel ID/address, survey (if available), concept/site plan or desired program</li>
                                <li>Zoning/FLU info, prior studies (traffic, environmental/Phase I), wetland/flood data</li>
                                <li>Preliminary cost inputs (hard/soft), utility availability, HOA/CCRs (if any)</li>
                                <li>Target outcomes (build‑to‑sell, build‑to‑rent), timeline, and budget</li>
                                <li>Contact details for your design/engineering/title team and preferred update cadence</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'asset-management') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sectors
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Sector</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Drive consistent performance anywhere in Florida. Our Asset Management service delivers portfolio‑level visibility and property‑level action plans so you can protect NOI today and grow value over time. We review each asset’s rent roll, T12/T6/T3 financials, pricing strategy, and competitive set; benchmark KPIs (occupancy, renewal rate, concessions, maintenance turns, delinquency); and surface quick wins and structural levers (revenue management, expense optimization, CapEx with ROI, fees/RUBS). You’ll receive a clear roadmap with risk flags (tax reassessment, insurance, HOA changes), scenario modeling (hold/sell/refi), and lender‑ready reporting. We can also coordinate with PM teams to tighten collections, leasing funnels, make‑ready timelines, and vendor performance. Whether you own a single home or a small portfolio, our analysis translates into practical steps that move the numbers. We provide operational consulting—not legal, tax, or investment advice; we coordinate with licensed professionals you engage.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We combine disciplined underwriting with dashboard‑driven insights tailored to your strategy.</p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
                        Book a Free Consultation
                    </CtaButton>
                </div>
            </section>

            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is included in the Asset Management service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Portfolio review and KPI dashboard (NOI, occupancy, delinquency, renewal %, concessions)</li>
                                <li>Financial normalization (T12/T6/T3), variance analysis, and benchmarking</li>
                                <li>Pricing/Rent strategy: LTR/STR surveys, renewal grids, and concessions plan</li>
                                <li>Expense optimization and vendor review; CapEx plan with ROI and timeline</li>
                                <li>Scenario modeling (hold/sell/refi), DSCR & sensitivity</li>
                                <li>Monthly or quarterly performance memo and lender‑ready packet</li>
                                <li>Optional add‑ons: advocacy, appraisal, transaction coordination, legal support coordination</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Asset Management process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Onboarding and baseline review typically 3–7 business days after document receipt. Ongoing reporting is monthly or quarterly with mid‑cycle check‑ins as needed. Rush reviews may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Asset Management service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Asset list with addresses and unit mix; PM contact info</li>
                                <li>Rent rolls, T12/T6/T3 financials, budgets, and CapEx plan</li>
                                <li>Current pricing/renewal policy, concessions, and marketing channels</li>
                                <li>Debt summary (rate, IO/amortization, maturity), insurance, taxes/assessments, HOA/COA</li>
                                <li>Goals and constraints (hold horizon, DSCR targets, risk tolerance), plus preferred report cadence</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'property-management') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sectors
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Sector</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Protect your asset and your time anywhere in Florida. Our Property Management service handles day‑to‑day operations for single‑family homes, townhomes, condos, and small multifamily. We price the rental, create launch‑ready marketing, screen applicants (income, credit, eviction, criminal, landlord refs), and execute compliant leases. After move‑in we manage rent collection and delinquency, 24/7 maintenance coordination, make‑ready turns, periodic inspections, HOA/COA compliance, renewals and rent‑increase strategy, and coordinated notices when needed. Owners receive clear monthly statements, year‑end 1099s, and an online portal for documents and payouts. Choose full‑service management or lease‑only; add‑ons include STR oversight, preventative maintenance plans, and insurance/tax coordination. We work transparently with preferred vendors and, when necessary, coordinate with counsel for lawful enforcement. We are not a law firm; legal services are performed by or under the supervision of licensed attorneys you engage. We follow Fair Housing and local/MLS guidelines.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We pair disciplined processes with Florida‑specific market know‑how to deliver consistent results.</p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
                        Book a Free Consultation
                    </CtaButton>
                </div>
            </section>

            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is included in the Property Management service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Pricing strategy and launch marketing (photos, listing, syndication)</li>
                                <li>Showings, tenant screening, and lease execution</li>
                                <li>Rent collection/ACH payouts, delinquency management, and notices</li>
                                <li>24/7 maintenance coordination, preferred‑vendor network, make‑readies</li>
                                <li>Periodic inspections (move‑in/mid‑term/move‑out) and HOA/COA compliance</li>
                                <li>Renewals and rent‑increase strategy; owner portal, monthly statements, year‑end 1099</li>
                                <li>Optional add‑ons: STR oversight, preventative maintenance plan, insurance/tax coordination, eviction coordination with counsel</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Property Management process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Onboarding typically 2–5 business days after intake. Lease‑up often 7–21 days depending on condition, price, and seasonality. Make‑ready timelines vary with scope and vendor availability.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Property Management service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property details (address, beds/baths, SF), photos if available, and access/lock details</li>
                                <li>HOA/COA rules, keys/fobs/remotes, warranties, and service contracts</li>
                                <li>Desired rent, pet policy, and restrictions; existing lease/tenant info if occupied</li>
                                <li>Owner ID/W‑9, ACH/bank details for payouts, insurance binder, and utility accounts</li>
                                <li>Any prior inspections or maintenance logs and preferred update cadence</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'lending') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sectors
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Finance your purchase or refinance anywhere in Florida with a lending process that’s fast, transparent, and built for real‑estate investors and owners. We match your deal to the right program—DSCR 30‑year rentals, bridge/fix‑and‑flip with rehab draws, new‑construction, portfolio/blanket, rate‑and‑term or cash‑out—and coordinate the steps from pre‑qual to funding. You’ll get clear term scenarios, a document checklist, underwriting support, appraisal coordination, title/insurance alignment, and closing prep so there are no surprises. Prefer a light touch? Use us just for packaging and appraisal; need full support? We’ll manage the entire timeline with weekly updates. ROI Home Services is not a mortgage lender or broker; lending is provided by or under the supervision of licensed third‑party lenders you engage. We facilitate, package, and coordinate to keep your file moving.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We pair Florida‑specific know‑how with disciplined process to deliver timely, competitive financing outcomes.</p>
                </div>
            </section>

            <section className="max-w-3xl mx-auto mb-12 text-center">
                <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
                        Book a Free Consultation
                    </CtaButton>
                </div>
            </section>

            <section className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>What is included in the Lending service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Deal consult and program matching (DSCR, bridge/rehab, construction, portfolio, cash‑out)</li>
                                <li>Rate/term scenarios and estimated closing costs</li>
                                <li>Document checklist and packaging; lender portal submission</li>
                                <li>Underwriting coordination and conditions tracking</li>
                                <li>Appraisal ordering/coordination and title/insurance alignment</li>
                                <li>Timeline management to clear‑to‑close; weekly status updates</li>
                                <li>Optional add‑ons: rent surveys (LTR/STR), valuation consult, transaction coordination</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Lending process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Pre‑qual typically 24–48 hours after intake. DSCR and bridge loans often close in 10–21 days once conditions are met; construction and portfolio loans may take 3–4+ weeks depending on scope, appraisal, title, and draw setup. Rush options may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Lending service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Borrower/Entity info (ID, EIN, articles/operating agreement), PFS & REO</li>
                                <li>Bank statements (2–3 months), reserves, and source of funds</li>
                                <li>Purchase contract or payoff statement; rehab scope & budget (if applicable)</li>
                                <li>Rent roll/leases or STR performance; insurance quotes</li>
                                <li>Property details (address, beds/baths, GLA, lot size), HOA/COA info</li>
                                <li>Title/escrow contact and preferred lender (if already selected); appraisal access instructions</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <Link href="/offerings#sectors" className="inline-flex items-center text-accent hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sectors
        </Link>
      </div>
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
         <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
      </header>

      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Expertise in {offering.title}</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is a detailed placeholder description for our services related to the {offering.title} sector. 
          We understand the unique challenges and opportunities within {offering.title.toLowerCase()}, providing specialized valuation and consulting. 
          Our experience covers {offering.blurb.toLowerCase().replace('.', '')}, ensuring you have the insights needed for success.
          (This section should be approximately 150 words).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          We are dedicated to supporting clients in the {offering.title} sector with accurate and actionable advice.
        </p>
      </section>

      <section className="max-w-3xl mx-auto mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
            Book a Free Consultation
          </CtaButton>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Get a Quote</Link>
          </Button>
        </div>
      </section>

      <section className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does ROI Home Services cater to the {offering.title} sector?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: We offer specialized valuation and consulting services, like {offering.blurb.toLowerCase()}, tailored to the specific needs of the {offering.title} sector.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What experience do you have in {offering.title}?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: Our team has extensive experience and a deep understanding of the nuances within the {offering.title} sector, enabling us to provide expert advice.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can you provide examples of your work in the {offering.title} sector?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: Yes, we can share relevant case studies or examples (anonymized for confidentiality) upon request that demonstrate our capabilities in the {offering.title} sector.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
