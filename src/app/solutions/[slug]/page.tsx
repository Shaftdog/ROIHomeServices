
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
  const solutions = typedOfferingsData.filter((o) => o.category === 'solution');
  return solutions.map((solution) => ({
    slug: solution.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'solution');

  if (!offering) {
    return {
      title: "Solution Not Found",
    };
  }

  return {
    title: `${offering.title} | Solutions`,
    description: `Learn more about our ${offering.title} solution. ${offering.blurb}`,
    alternates: {
      canonical: `https://www.roihomesvc.com/solutions/${offering.id}`,
    },
    openGraph: {
      title: `${offering.title} | ROI Home Services`,
      description: offering.blurb,
      url: `https://www.roihomesvc.com/solutions/${offering.id}`,
    },
  };
}

export default function SolutionDetailPage({ params }: { params: { slug: string } }) {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'solution');

  if (!offering) {
    notFound();
  }
  
  if (offering.id === 'tax-appeal-package') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Solution</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Lowering an unfair assessment starts with clear, defensible evidence. Our Tax Appeal Package gives Florida owners a turnkey path—from quick screen to filing support—so you can challenge value confidently. We review your TRIM notice and property record, verify square footage/attributes, and benchmark against recent sales, paired‑sales/adjustment analysis, and neighborhood trends. For rentals, we add income support (LTR/STR rent surveys, T12/T6/T3 normalization, vacancy/concession adjustments) and reconcile approaches into a supportable opinion range. You’ll receive an appeal memo, exhibits (maps, photos, comps, adjustments), and a deadline‑driven plan for petitioning the county Value Adjustment Board (VAB) or seeking an informal review. We coordinate with appraisers, property appraiser staff, and—when engaged—licensed counsel. Throughout, we keep your documents organized and your dates visible. We are not a law firm and do not provide legal advice; legal representation is provided by or under the supervision of licensed attorneys you engage. </p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We pair disciplined valuation methods with county‑specific process knowledge to deliver timely, defensible appeal packages.</p>
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
                        <AccordionTrigger>What is included in the Tax Appeal Package?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>TRIM notice and property‑record audit (attributes, exemptions, errors)</li>
                                <li>Market evidence: sales grid, paired‑sales/qualitative & quantitative adjustments, neighborhood trend snapshot</li>
                                <li>Income support for rentals: LTR/STR rent surveys, operating statement normalization, capitalization checks</li>
                                <li>Exhibits packet: maps, photos, comps, adjustments, and summary memo</li>
                                <li>Timeline and filing checklist for informal review and VAB petition</li>
                                <li>Coordination with the property appraiser’s office and, if engaged, legal counsel</li>
                                <li>Optional add‑ons: inspection/photos, restricted appraisal, expert testimony, quarterly reassessment watch</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Tax Appeal process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Initial screen: 2–3 business days. Full evidence packet: typically 5–10 business days after receiving documents and access (if needed). Filing and hearing timelines depend on county VAB calendars and statutory deadlines.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Tax Appeal Package?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>TRIM notice, parcel ID/address, and property appraiser record link</li>
                                <li>Photos and notes on condition/repairs; permits or insurance claims if applicable</li>
                                <li>For rentals: rent roll/leases and last 12 months income/expense (T12)</li>
                                <li>Prior appraisals, surveys, or comps you’d like considered</li>
                                <li>Any exemption or classification details (homestead, portability, agricultural, etc.)</li>
                                <li>Authorization for us to coordinate with the county and your attorney (if applicable)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }
  
  if (offering.id === 'fsbo-package') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Sell your home yourself—without going it alone. Our FSBO Package supports owners anywhere in Florida with the pieces of a traditional listing you actually need: pricing guidance, marketing, paperwork, and coordination through closing. Start with a strategy call and a pre‑listing valuation (restricted appraisal or consult) to set defensible pricing bands. We then build a launch kit—professional photos/drone, feature sheets, single‑property page, and ad copy—and set up showings, lead capture, and inquiry routing. When offers arrive, we prepare a seller net sheet, coach negotiations, route e‑signatures, and coordinate title/escrow, inspections, appraisal access, HOA/COA items, and closing. Choose a light DIY bundle or a Full FSBO package that adds transaction coordination and weekly status updates. Need MLS exposure or attorney review? We coordinate with licensed brokers and counsel you engage. We are not a law firm or brokerage; legal/brokerage services are performed by or under the supervision of licensed professionals. </p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We make FSBO simple, compliant, and transparent from pricing to closing.</p>
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
                        <AccordionTrigger>What is included in the FSBO Package?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Strategy call and pricing guidance (restricted appraisal or consult)</li>
                                <li>Launch kit: pro photos/drone, listing copy, feature sheets, single‑property page</li>
                                <li>Lead capture and showing setup; inquiry routing to your phone/email</li>
                                <li>Offer review with seller net sheet and negotiation coaching</li>
                                <li>Document prep/coordination: e‑signature routing, disclosures/addenda templates</li>
                                <li>Title/escrow, inspection, appraisal‑access, and HOA/COA coordination</li>
                                <li>Weekly status updates (Full FSBO) and closing checklist</li>
                                <li>Optional add‑ons: MLS exposure via partner broker, staging consult, yard sign/lockbox, attorney review, marketing ads, open‑house kit</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the FSBO process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Launch typically 3–5 business days after intake/photography. Contract‑to‑close is commonly 30–45 days (financed) or 10–21 days (cash), subject to title/HOA and lender timelines. Rush options are available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the FSBO Package?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <p>Compliance: We follow Fair Housing and Florida/MLS advertising guidelines. Brokerage and legal work are performed by or under the supervision of licensed professionals you engage.</p>
                            <ul className="list-disc list-inside">
                                <li>Property details (address, beds/baths, SF, lot, year built), upgrades, and disclosures</li>
                                <li>Access instructions (showings, lockbox), HOA/COA rules/fees if applicable</li>
                                <li>Target list price and timing; any must‑have terms</li>
                                <li>Preferred lead routing (phone/email) and availability for showings</li>
                                <li>Seller ID for e‑sign, payoff/lien info for closing, and contact for title/escrow</li>
                                <li>Any prior appraisals, surveys, or comps you want considered</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'qualitative-adjustments') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Solution</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Need to know what a specific feature is worth in your Florida market—without commissioning a full appraisal? Our Qualitative Adjustments service isolates the contributory value of a single element (or a small set of elements) and provides a market‑supported range you can use in pricing, negotiations, or underwriting notes. Typical requests include waterfront vs. non‑waterfront, conservation or golf‑course view, busy road adjacency, or upgrading a home from Q4/C4 to Q3/C3 quality/condition. We build paired‑sales sets and bracketed comparisons, explain key differences, and present a clear narrative with percent and dollar guidance plus sensitivity bands. You’ll receive a concise memo you can share with partners, along with a worksheet showing how the adjustment would affect an indicated value at several price points. If needs expand, we can roll this work into a full appraisal or restricted appraisal update. This service is consulting and not a stand‑alone appraisal.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We use disciplined methodology and Florida‑specific market data to deliver defensible, easy‑to‑apply guidance.</p>
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
                        <AccordionTrigger>What is included in the Qualitative Adjustments service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Discovery call and scoped objective (feature to quantify; property context)</li>
                                <li>Three paired‑sales sets (6 comps total) with map/photos and comparability notes</li>
                                <li>Bracketed analysis and narrative explaining the adjustment logic</li>
                                <li>Recommended percent and dollar adjustment range with sensitivity table</li>
                                <li>Example impact on the indicated value at multiple price points</li>
                                <li>Optional add‑ons: site visit, additional feature analysis, integration into a full or restricted appraisal</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Qualitative Adjustments process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Typical turnaround is 2–3 business days from receipt of property details. Rush options (as fast as 24–48 hours) may be available depending on scope and market data.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Qualitative Adjustments service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address, beds/baths, living area, lot size, year built, property type</li>
                                <li>The specific feature(s) to analyze (e.g., waterfront premium, Q4/C4 → Q3/C3)</li>
                                <li>Photos, recent upgrades/condition notes, HOA/condo rules if applicable</li>
                                <li>Any comps or prior reports you’d like considered</li>
                                <li>Your use‑case (pricing, negotiation, lending memo) and preferred deliverable format</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'quantitative-adjustments') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Solution</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Need precise, line‑item values for features that can be counted and measured—without ordering a full appraisal? Our Quantitative Adjustments service isolates unit adjustments that are defensible in your Florida submarket. We focus on items such as gross living area ($/SF), lot size ($/SF or $/acre), bed/bath counts, garage bays, pool, lanai/porch, outbuildings/ADU, and view or waterfront frontage increments. Using matched‑pair sets, bracketed comp groups, and reasonableness checks (e.g., constrained regression where data allow), we derive a supportable adjustment schedule with caps/floors and sensitivity bands. You’ll receive a concise memo, exhibits, and a ready‑to‑use worksheet that shows how each coefficient impacts indicated value at multiple price points. If your scope expands, we can roll these findings into a full or restricted appraisal. This is consulting, not a stand‑alone appraisal or opinion of value.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We apply disciplined methodology and Florida‑specific market data to produce clear, defensible line‑item values.</p>
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
                        <AccordionTrigger>What is included in the Quantitative Adjustments service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Adjustment schedule table with unit values (e.g., $/SF GLA, $/bedroom, $/bath, $/garage bay, pool premium, lot size $/SF/acre, lanai/porch, ADU/outbuilding)</li>
                                <li>Three matched‑pair sets (6 comps total) plus supplemental comps for reasonableness checks</li>
                                <li>Bracketed analysis, caps/floors, and sensitivity table (% and $ impact at various price points)</li>
                                <li>Application examples to a typical sales‑comparison grid</li>
                                <li>Exhibits: map, photos, and brief commentary on comparability</li>
                                <li>Optional add‑ons: site visit, additional feature coefficients, integration into a full or restricted appraisal</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Quantitative Adjustments process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Typical turnaround is 2–3 business days from receipt of property details and target features. Rush options (as fast as 24–48 hours) may be available; niche features or sparse data sets can add time.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Quantitative Adjustments service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address, beds/baths, GLA, lot size, year built, property type</li>
                                <li>Specific feature(s) to quantify (e.g., pool, 2→3 garage bays, GLA $/SF) and any UAD ratings if known (Q/C)</li>
                                <li>Photos, recent upgrades/condition notes, HOA/condo rules if applicable</li>
                                <li>Any comps or prior appraisals/reports you’d like considered</li>
                                <li>Target market area in Florida, effective date, and use‑case (pricing, negotiation, lending memo)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'pre-listing-appraisal') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Set a confident list price anywhere in Florida with a USPAP‑compliant appraisal built for sellers and listing agents. We analyze recent and competing listings, verified closed sales, concessions, seasonality, and micro‑location factors to develop a reconciled opinion of value and a practical pricing strategy. Your deliverable includes a bracketed sales‑comparison grid with commentary and adjustments; a map and photo set; market metrics (absorption, median DOM); and list‑price bands (stretch / market / fast‑sale) with expected time‑to‑contract. We also flag risk factors (condition issues, HOA/condo restrictions, insurance shifts) and note high‑ROI prep items that can improve marketability. Choose the scope that fits your needs: full appraisal (1004), exterior‑only/desktop, or a restricted appraisal for decision support. Our goal is a defensible report that helps you launch confidently and negotiate from strength. We provide independent appraisal services; a report is not a guarantee of sale price or timing. </p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We pair rigorous methodology with Florida‑specific market insight to support successful listings.</p>
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
                        <AccordionTrigger>What is included in the Pre‑Listing Appraisal?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>USPAP‑compliant appraisal with reconciled opinion of value</li>
                                <li>Sales‑comparison grid (bracketed comps, adjustments, commentary)</li>
                                <li>Comp map and photos; competitive‑set snapshot (active/pending)</li>
                                <li>Market metrics: absorption, median days‑on‑market, concession trends</li>
                                <li>List‑price bands (stretch / market / fast‑sale) and time‑to‑contract outlook</li>
                                <li>Risk and readiness notes (repairs, disclosures, HOA/COA items)</li>
                                <li>Optional add‑ons: prep checklist, contractor estimate coordination, refresh update</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Typical turnaround is 3–5 business days after inspection/access and receipt of documents. Rush options (as fast as 48–72 hours) may be available; condos/complex properties can add time for document review.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address, bed/bath count, GLA, lot size, year built, property type</li>
                                <li>List of upgrades/repairs with dates and costs; permits if applicable</li>
                                <li>HOA/COA rules, fees, and special assessments (if any)</li>
                                <li>Access instructions for inspection (or photos if desktop scope)</li>
                                <li>Any competing listings or prior reports you want considered</li>
                                <li>Your goals and timeline (launch date, desired days‑to‑contract)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'investor-valuation-package') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Make confident buy, rehab, and refinance decisions anywhere in Florida with an investor‑ready package focused on As‑Is and After‑Repair Value (ARV). Built for fix‑and‑flip, BRRRR, and rental investors, our package combines a USPAP‑compliant appraisal (scope to fit the deal), rehab scope/budget cross‑check, LTR/STR rent surveys, operating statement normalization (T12/T6/T3), and lender‑friendly exhibits. We bracket comps by condition (as‑is vs. renovated), document adjustments, and present sensitivity bands for price, days‑to‑complete, and cost overruns. For rentals, we add DSCR and cash‑on‑cash snapshots with rate/insurance scenarios. Your deliverable is a clear report and worksheet you can share with partners and lenders so everyone aligns on numbers, timeline, and risk. Choose appraisal‑only, consult‑only, or the full package—then add transaction coordination, marketing, or advocacy as needed. We provide independent appraisal/consulting; results are not guarantees of financing, sale price, or timeline. </p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We combine disciplined valuation with Florida‑specific market data to produce actionable, lender‑ready insights.</p>
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
                        <AccordionTrigger>What is included in the Investor Valuation Package?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>As‑Is and ARV analysis with bracketed comps and documented adjustments</li>
                                <li>Scope/budget cross‑check and timeline reasonableness review</li>
                                <li>Rent surveys (LTR/STR) and operating statement normalization (T12/T6/T3)</li>
                                <li>DSCR, cash‑on‑cash, and simple exit scenarios (sell vs. hold/refi)</li>
                                <li>Risk flags (permits, insurance, HOA/COA, supply chain) and sensitivity tables</li>
                                <li>Lender‑ready exhibits (maps, photos, grids) and a shareable summary memo</li>
                                <li>Optional add‑ons: transaction coordination, advocacy, marketing launch, expert testimony</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Typical turnaround is 3–5 business days after access and receipt of documents; complex rehabs or multifamily may require 5–10 business days. Rush options (as fast as 48–72 hours) may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Address/parcel ID, property details (beds/baths, GLA, lot size, year built) and access</li>
                                <li>Purchase contract/LOI, rehab scope & budget, contractor bids if available</li>
                                <li>Photos, plans, permits/violations, HOA/COA rules</li>
                                <li>For rentals: rent roll/leases, recent T12/T6/T3 and utility info</li>
                                <li>Lending goals and timeline (DSCR/bridge/perm), target exit, and any comps you want considered</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'home-measurement-services') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Solutions
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>List, price, and underwrite with confidence anywhere in Florida. Our Home Measurement service provides a precise, MLS‑ready floor area and a clear sketch that follows ANSI Z765‑2021 measurement guidelines commonly used in appraisal. We capture the home with professional tools, confirm level‑by‑level areas, and identify what is and is not Gross Living Area (GLA)—e.g., below‑grade space, enclosed lanais, garages, and low‑ceiling sections. Your deliverable includes a labeled floor plan with room dimensions, total/level GLA, non‑GLA areas (garage/porch/lanai), ceiling‑height notes, and a summary you can share with agents, buyers, and lenders. For remodels or new listings, we can compare builder plans vs. field‑measured results and flag variances. Optional add‑ons include fixtures on floor plans, 3D tour capture, and marketing photos. This service is measurement/diagramming only—it is not a code inspection or full appraisal. </p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We apply consistent standards and meticulous field practice to deliver accurate, defensible measurements across Florida.</p>
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
                        <AccordionTrigger>What is included in the Home Measurement service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Field measurement and labeled sketch following ANSI Z765‑2021</li>
                                <li>Total and per‑level GLA with room dimensions</li>
                                <li>Non‑GLA areas itemized (garage, porch, lanai/sunroom, balcony, below‑grade)</li>
                                <li>Ceiling‑height notes and assumptions; inclusion/exclusion summary</li>
                                <li>PDF deliverable; optional editable image/PNG and floor‑plan with fixtures</li>
                                <li>Optional add‑ons: 3D tour capture, marketing photos, site plan diagram</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Home Measurement process take?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          Typical turnaround is 1–3 business days after access; rush options as fast as 24 hours may be available depending on size and location.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Home Measurement service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <p>Note: MLS and lender policies vary. We follow ANSI for consistency and will note any local exceptions requested by your brokerage or lender.</p>
                            <ul className="list-disc list-inside">
                                <li>Property address, access/lock instructions, and parking info</li>
                                <li>Known additions/enclosures (lanai, porch), ceiling anomalies, or below‑grade areas</li>
                                <li>HOA/COA rules for on‑site work (if applicable)</li>
                                <li>Any builder plans, prior appraisals, or floor plans for comparison</li>
                                <li>Preferred file format (PDF only, plus PNG, or with fixtures)</li>
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
        <Link href="/offerings#solutions" className="inline-flex items-center text-accent hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Solutions
        </Link>
      </div>
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
        <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
      </header>

      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Solution Overview: {offering.title}</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is a detailed placeholder description for our {offering.title} solution. 
          The {offering.title.toLowerCase()} is designed to address specific needs such as {offering.blurb.toLowerCase().replace('.', '')}.
          We provide clear, actionable reports and insights to help you achieve your objectives.
          (This section should be approximately 150 words).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our {offering.title} solution is crafted with precision and attention to detail, ensuring you receive the highest quality information.
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
            <AccordionTrigger>What are the key features of the {offering.title} solution?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: The {offering.title} solution includes {offering.blurb.toLowerCase()} and is delivered with a comprehensive report and expert support.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Who is the {offering.title} solution for?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: This solution is ideal for individuals or businesses needing {offering.blurb.toLowerCase().split(' ')[0]} or similar services.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>How can I order the {offering.title} solution?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: You can order the {offering.title} solution by contacting us for a quote or booking a consultation to discuss your specific requirements.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
