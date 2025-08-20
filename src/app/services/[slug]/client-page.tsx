
"use client";

import type { Offering } from '@/types/offerings';
import { notFound } from 'next/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, PlayCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from '@/lib/utils';
import { CtaButton } from '@/components/shared/cta-button';

const explainerGridItems = [
    { title: "Comprehensive 1-on-1 Consultation", imageHint: "tablet checklist coffee", imageUrl: "/data/1A_consultation.png", text: "Sit down (virtually or in-person) with a certified appraiser who listens to your goals, reviews key documents, and tailors the assignment to your specific property. You leave the meeting knowing exactly what to expect and how we’ll deliver it." },
    { title: "Expert Valuation Team", imageHint: "team professionals", imageUrl: "/data/2B_valuation_team.png", text: "Your report is prepared and double-checked by a team with decades of combined experience, state certifications, and deep knowledge of Florida’s sub-markets—so underwriters can trust every line." },
    { title: "Mobile Inspection Technology", imageHint: "tablet inspection", imageUrl: "/data/3C_mobile_inspection.png", text: "Our field inspectors capture HD photos, 3-D scans, and measurements in real time, syncing straight to the cloud. This cuts days off turnaround and gives you crystal-clear interior and exterior detail." },
    { title: "Laser Accurate Measurements", imageHint: "laser measure device", imageUrl: "/data/4D_laser_measurements.png", text: "We use commercial-grade laser devices and digital floor-plan tools to measure within ±2 mm. The result: square footage you and your lender can rely on—no tape-measure guesswork." },
    { title: "Statistically Modeled Analysis", imageHint: "data charts graphs", imageUrl: "/data/5_statistical_analysis.png", text: "Beyond simple comps, we benchmark your property against thousands of recent sales using regression modeling and market-trend data, delivering an evidence-backed value you can defend." },
    { title: "AI-Powered Reports", imageHint: "ai interface report", imageUrl: "/data/6_ai_reports.png", text: "Our AI engine flags outliers, checks UAD compliance, and formats the final report so it sails through underwriting—getting you answers faster and with fewer revision requests." },
];

const detailPanelItems = [
    { id: "panel-1", title: "1-on-1 Consultation", content: "Our process starts with a personal strategy session—virtual or on-site—where we learn your valuation goals, review key documents, and map out next steps. You’ll leave the call with a clear timeline, fee quote, and checklist of any supporting information we’ll need." },
    { id: "panel-2", title: "Expert Valuation Team", content: "Every assignment is prepared and peer-reviewed by state-certified appraisers who collectively hold 30+ years of Florida market experience. Two sets of eyes on every report means fewer revision requests and faster lender approvals." },
    { id: "panel-3", title: "Mobile Inspection Technology", content: "Our inspectors capture HD photos, 3-D scans, and site notes on tablets that sync instantly to the cloud, cutting days off turnaround. You receive a secure link to view images and confirm property details the same day." },
    { id: "panel-4", title: "Laser Accurate Measurements", content: "Using commercial-grade laser devices and digital floor-plan software, we verify square footage to within ±2 mm. Precise measurements protect you from underwriting kickbacks tied to GLA discrepancies." },
    { id: "panel-5", title: "Statistically Modeled Analysis", content: "Beyond standard comparable grids, we run multiple regression and market-trend models against thousands of recent sales. The result is an evidence‑backed value conclusion you—and your lender—can confidently defend." },
    { id: "panel-6", title: "AI-Powered Reports", content: "An AI compliance engine checks UAD fields, flags outliers, and auto-formats narrative commentary, ensuring each report meets GSE requirements on the first submission. Faster acceptance, fewer revision calls." },
];

const faqItems = [
    {
        id: "faq-1",
        question: "What’s a real estate appraisal — and why would I need one if there’s no mortgage?",
        answer: (
            <>
                <p>An appraisal is an independent, licensed opinion of market value on a specific date. It’s used for estate/probate, divorce, tax appeals, pre‑listing/FSBO pricing, cash purchases, insurance claims, investment analysis, partnership buyouts, gifting/charitable contributions, and renovation planning (before‑and‑after value).</p>
                <p>Bottom line: When the decision (or the court/IRS/insurer) needs a defensible number, you want a real appraisal.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> Start with a Comprehensive 1‑on‑1 Consultation so we align on your goals and documents up front. Your valuation is then prepared and double‑checked by our Expert Valuation Team, and delivered as AI‑Powered Reports that glide through underwriting and legal reviews.</p>
            </>
        ),
        ctaText: "Get My Appraisal Quote",
    },
    {
        id: "faq-2",
        question: "How do appraisers figure out value — what really moves the number?",
        answer: (
             <>
                <p>Appraisers weigh recent comparable sales, current listings/pending sales, and local trends, adjusted for your home’s size/layout, condition & quality, updates/permits, site & location, and amenities. Depending on the property, they may use:</p>
                <ul className="list-disc list-inside my-2 pl-4">
                    <li>Sales Comparison (most common for homes)</li>
                    <li>Cost Approach (build cost minus depreciation + land)</li>
                    <li>Income Approach (rentals/income property using NOI & cap rate)</li>
                </ul>
                <p>Translation: Data + judgment about how your features compare to what buyers are actually paying right now.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> We capture Laser‑Accurate Measurements with commercial‑grade devices and generate digital floor plans. Then we layer Statistically Modeled Analysis (beyond simple comps) and AI cross‑checks to flag outliers and support a defensible number.</p>
            </>
        ),
        ctaText: "See What Yours Could Be Worth — Get a Quote",
    },
    {
        id: "faq-3",
        question: "Appraisal vs. Home Inspection — what’s the difference?",
        answer: (
            <>
                <p><strong className="text-foreground">Appraisal = Value.</strong> Market‑supported opinion of worth for a specific use/date.</p>
                <p><strong className="text-foreground">Inspection = Condition.</strong> System‑by‑system check (roof, HVAC, electrical, plumbing, safety).</p>
                <p>They’re complementary. Appraisers don’t test systems; inspectors don’t opine on market value.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> Our Mobile Inspection Technology captures HD photos, 3‑D scans, and on‑site measurements that sync to the cloud in real time—so the value analysis is built on cleaner, more complete field data.</p>
            </>
        ),
        ctaText: "Need a Value Opinion? Start Here",
    },
    {
        id: "faq-4",
        question: "What does an appraisal cost — and who pays?",
        answer: (
            <>
                <p>Typical single‑family home: ~$400–$600 (more if complex, rural, very large)</p>
                <p>Multifamily/Commercial: $2,000–$10,000+ depending on size/scope</p>
                <p>Who pays? Whoever orders the appraisal (homeowner, attorney/executor, investor, or lender). Fees are usually non‑refundable once work begins.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> Because we use laser measurements, mobile field capture, and AI‑assisted reporting, we reduce re‑work and revision requests—often saving time and keeping your overall costs predictable. No tape‑measure guesswork.</p>
            </>
        ),
        ctaText: "Get a Firm, No‑Pressure Quote in 30 Seconds",
    },
    {
        id: "faq-5",
        question: "How long does it take?",
        answer: (
            <>
                <p>On‑site visit: typically 1–2 hours for a home</p>
                <p>Turn time: usually 3–7 business days for residential once access/data are set; 2–4 weeks for commercial/multifamily</p>
                <p>Timing varies with access, complexity, and available market data (or leases/financials for income property).</p>
                <p><strong className="text-foreground">ROI Difference:</strong> Cloud‑synced Mobile Inspection Technology plus AI‑formatted reports can shave days off typical timelines and help your file sail through underwriting with fewer back‑and‑forths.</p>
            </>
        ),
        ctaText: "Check Current Availability & Turn Times",
    },
    {
        id: "faq-6",
        question: "How do I prep my property to put its best foot forward?",
        answer: (
            <>
                <p>Ensure full access everywhere (garage, outbuildings, attic/crawlspace; utilities on)</p>
                <p>Provide a list of improvements with dates/costs & permits (roof, HVAC, kitchen/bath, windows, solar)</p>
                <p>Knock out minor deferred maintenance (leaks, loose handrails, peeling paint on older homes)</p>
                <p>Tidy/declutter so spaces are easy to view/measure/photograph</p>
                <p>Have docs ready (survey, plans/permits, HOA). For rentals: rent roll, leases, expenses, vacancy</p>
                <p>These steps don’t inflate value—but they help the appraiser clearly recognize what the market will pay for.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> We arrive with commercial‑grade laser tools and digital floor‑plan tech. Pair that with your improvement list and documents, and our statistical models can better recognize the value your upgrades add.</p>
            </>
        ),
        ctaText: "Want a Prep Checklist + Quote?",
    },
    {
        id: "faq-7",
        question: "Don’t agree with the value — can I challenge it?",
        answer: (
            <>
                <p>Yes. Your options depend on the assignment:</p>
                <ul className="list-disc list-inside my-2 pl-4">
                    <li>Lender‑related: request a Reconsideration of Value (ROV) through the client (the lender/attorney). Share factual corrections and better comps.</li>
                    <li>Private (estate/divorce, etc.): order a review or a second appraisal when there’s new evidence or a material error.</li>
                </ul>
                <p>Revisions require solid, verifiable support—not just disagreement.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> We provide a transparent, evidence‑backed workfile—regression outputs, measurement certs, and photo/scan data—to support you in an ROV or review scenario.</p>
            </>
        ),
        ctaText: "Talk Through Your Situation & Get a Quote",
    },
    {
        id: "faq-8",
        question: "Appraisal vs. CMA (agent pricing) — why do I need both?",
        answer: (
            <>
                <p>A CMA informs pricing strategy; an appraisal is a USPAP‑compliant, certified valuation designed for legal/financial use (lenders, courts, IRS, insurers). Both use comps, but an appraisal includes additional analysis, certification, and scope of work.</p>
                <p>If you need a number you can take to the bank (or the court/IRS), you need an appraisal.</p>
                <p><strong className="text-foreground">ROI Difference:</strong> Your report is double‑checked by our Expert Valuation Team and run through AI‑powered compliance and outlier checks—producing a thorough, USPAP‑compliant valuation built to stand up with lenders, courts, and the IRS.</p>
            </>
        ),
        ctaText: "Get a Certified Appraisal Quote",
    },
];

const reviews = [
  { quote: "The appraiser was polite, thorough and professional. I have recommended ROI appraisal to two of my neighbors.", name: "Pete O.", rating: 4.0 },
  { quote: "Rod was extremely knowledgeable and turn around time was fast! I would not use any other appraiser in the central Florida area.", name: "Dozell V.", rating: 5.0 },
  { quote: "Response to our request for service was almost instantaneous. Bert came out only 2 days later. Efficient and courteous.", name: "Howard C.", rating: 5.0 },
  { quote: "Decided to get an appraisal after getting 4 CMAs with different values. Got the info I was looking for.", name: "Brooke S.", rating: 5.0 },
  { quote: "Was able to easily schedule services. The appraisal was rendered in a timely manner.", name: "Lana J.", rating: 5.0 },
  { quote: "Needed an appraisal for the probate court. Lisa was quick to respond and Chuck was very thorough.", name: "Linda Q.", rating: 5.0 },
  { quote: "Thorough, professional and on time. Absolutely will refer them to my colleagues.", name: "Dudley R.", rating: 5.0 },
  { quote: "Very easy to work with. Professional.", name: "Mark V.", rating: 5.0 },
  { quote: "Very thorough.", name: "Alicia C.", rating: 4.5 },
  { quote: "Very nice people to work with.", name: "Marinus P.", rating: 5.0 },
  { quote: "Great service!", name: "George H.", rating: 4.5 },
  { quote: "Absolutely superb!!!", name: "Kathleen D.", rating: 5.0 },
  { quote: "Excellent service.", name: "Nabot", rating: 5.0 },
  { quote: "Very experienced and they go out of their way to be sure you’re satisfied. I strongly recommend them.", name: "Thomas A.", rating: 5.0 },
  { quote: "Everything I expected.", name: "David V.", rating: 5.0 },
];

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<Star key={i} className="h-5 w-5 text-highlight" fill="hsl(var(--highlight))" />);
    } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
      stars.push(
        <div key={i} className="relative">
          <Star className="h-5 w-5 text-highlight" />
          <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
            <Star className="h-5 w-5 text-highlight" fill="hsl(var(--highlight))" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className="h-5 w-5 text-highlight opacity-50" />);
    }
  }
  return <div className="flex">{stars}</div>;
};


interface ServiceClientPageProps {
  offering: Offering | undefined;
}

export default function ServiceClientPage({ offering }: ServiceClientPageProps) {
  if (!offering) {
    notFound();
  }

  if (offering.id === 'appraisal') {
    // Render NEW custom layout for "appraisal" service
    return (
      <div className="bg-background text-foreground">
        {/* 1. HERO SECTION */}
        <section className="py-16 md:py-24 bg-light-gray dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Get an Accurate Home Appraisal Now with Our Expert Valuation Team</h1>
            <p className="text-xl md:text-2xl text-accent mb-6 font-medium text-balance">Comprehensive Services, Cutting-Edge Technology, and Superior Results</p>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed text-balance">
              Our team of certified appraisers leverages cutting-edge technology and deep local market knowledge to deliver fast, accurate, and reliable home valuations. Whether you're buying, selling, refinancing, or need a valuation for estate planning, we provide comprehensive reports that meet all industry standards and lender requirements. We are committed to transparency, professionalism, and providing you with the insights needed to make informed property decisions with confidence.
            </p>
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-full sm:w-auto max-w-xs sm:max-w-sm md:max-w-md">
                <video 
                  src="/Explainer.mp4" 
                  controls 
                  className="w-full rounded-lg shadow-lg"
                  aria-label="Explainer Video"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                 <Link href="/book" className={cn(buttonVariants({ size: 'lg' }), "bg-highlight text-highlight-foreground hover:bg-highlight/90 px-10 py-3 text-lg font-semibold")}>
                  Start My Appraisal
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PRODUCT EXPLAINER GRID */}
        <section className="py-16 md:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Why Choose ROI Home Services for Your Appraisal?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {explainerGridItems.map((item) => (
              <Card key={item.imageUrl} className="hover-lift flex flex-col">
                <CardHeader className="pb-2">
                  <div className="relative aspect-video mb-4 rounded-t-md overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      data-ai-hint={item.imageHint}
                      unoptimized={true}
                    />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="default" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 px-10 py-3 text-lg">
              <Link href="/book">Book Your Appraisal</Link>
            </Button>
          </div>
        </section>

        {/* 3. REVIEWS CAROUSEL */}
        <section id="reviews" className="py-16 md:py-24 bg-accent text-accent-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">What Our Clients Say</h2>
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl mx-auto"
            >
              <CarouselContent>
                {reviews.map((review, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col h-full bg-background/90 dark:bg-deep-charcoal text-foreground">
                        <CardContent className="flex-grow flex flex-col justify-between p-6">
                           <blockquote className="text-muted-foreground italic mb-4 flex-grow">"{review.quote}"</blockquote>
                           <div>
                             <StarRating rating={review.rating} />
                             <p className="font-semibold mt-2 text-right">- {review.name}</p>
                           </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="text-foreground" />
              <CarouselNext className="text-foreground"/>
            </Carousel>
             <div className="text-center mt-12">
              <Button size="lg" variant="default" asChild className="bg-highlight text-highlight-foreground hover:bg-highlight/90 px-10 py-3 text-lg">
                <Link href="/book">Get Appraisal Now</Link>
              </Button>
            </div>
          </div>
        </section>


        {/* 4. SIX DETAIL PANELS (Accordion) */}
        <section className="py-16 md:py-24 container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">A Closer Look at Our Appraisal Process</h2>
          <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
            {detailPanelItems.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-lg md:text-xl text-left hover:text-accent">{item.title}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  <p className="mb-4">{item.content}</p>
                  <Button variant="link" asChild className="text-accent p-0 hover:underline">
                    <Link href="/book">Schedule Now →</Link>
                  </Button>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* 5. FAQ */}
        <section className="py-16 md:py-24 bg-light-gray dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-balance">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto bg-background p-6 rounded-lg shadow-md">
              {faqItems.map((faq) => (
                <AccordionItem value={faq.id} key={faq.id}>
                  <AccordionTrigger className="text-md md:text-lg text-left hover:text-accent">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed space-y-4">
                    {faq.answer}
                    <Button variant="link" asChild className="text-accent p-0 h-auto font-semibold group">
                        <Link href="/book">{faq.ctaText} <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* 6. PAGE-LEVEL CTA FOOTER */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-deep-charcoal to-accent text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Ready for an Expert-Backed Valuation?</h2>
            <p className="text-lg text-slate-200 mb-10 max-w-2xl mx-auto text-balance">
              Ensure your property decisions are based on accurate, reliable, and timely information. Our team is here to help.
            </p>
            <Button size="lg" variant="highlight" asChild className="px-10 py-3 text-lg font-semibold">
              <Link href="/book">Start My Appraisal</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (offering.id === 'long-term-rent-survey') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Price with confidence anywhere in Florida. Our Long‑Term Rent Survey is built by certified appraisers and tuned to each local submarket—from Miami‑Dade and the Gulf Coast to Orlando, Tampa Bay, Jacksonville, and the Panhandle. We synthesize MLS and off‑market listings, verified lease data, concessions, seasonality, school zones, and major‑employer demand to determine a supportable 12‑month (or longer) rent.</p>
                    <p>Your deliverable features a curated, apples‑to‑apples comp set of three rentals matched by beds/baths, living area, amenities, condition, and micro‑location; a mapped summary with photos; clear adjustment commentary; and a recommended asking rent with pricing scenarios (maximize, market, fast‑lease) plus expected days‑to‑lease. We also flag risks—HOA restrictions, insurance shifts, or nearby development—that can affect absorption and renewal risk. Whether you’re optimizing a single home or a portfolio, our methodology produces accurate, defensible guidance you can share with partners and lenders. Need to stay current? We offer refreshes as market conditions change.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We leverage current data and proven appraisal methodology to deliver exceptional results for Long‑Term Rent Surveys across Florida.</p>
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
                        <AccordionTrigger>What is included in the Long‑Term Rent Survey service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Three best‑fit rental comps with photos and a location map</li>
                                <li>Adjustments and commentary explaining comparability</li>
                                <li>Recommended asking rent (with two alternative pricing scenarios)</li>
                                <li>Expected days‑to‑lease and concession guidance</li>
                                <li>Risk flags (HOA limits, condition notes, local supply pipeline)</li>
                                <li>Optional add‑ons: site visit, broker/property‑manager interviews, quarterly refresh</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Long‑Term Rent Survey process take?</AccordionTrigger>
                        <AccordionContent>
                           Typical turnaround is 3–5 business days from receipt of property details. Rush options (as fast as 48 hours) are available for time‑sensitive listings.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Long‑Term Rent Survey service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Property address, bed/bath count, living area, lot size</li>
                                <li>Amenities (parking, pool, community features), pets policy</li>
                                <li>Recent upgrades/condition notes, HOA/condo rules if applicable</li>
                                <li>Target move‑in date and pricing goals (e.g., lease fast vs. maximize rent)</li>
                                <li>Any prior leases, rent roll, or comps you’d like considered</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'short-term-rent-survey') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Price nightly rates and occupancy with confidence anywhere in Florida. Our Short‑Term Rent Survey (Airbnb/VRBO‑style) is built by certified appraisers and tuned to each submarket—from Miami‑Dade and the Keys to Tampa Bay, Orlando, Jacksonville, the Panhandle, and beyond. We analyze ADR by bedroom count, weekday vs. weekend lift, peak/shoulder/off‑season patterns, event‑driven surges, lead‑time curves, minimum‑stay policies, cleaning/pet fees, and platform effects.</p>
                    <p>Your deliverable includes an apples‑to‑apples comp set of three active/verified listings matched by beds/sleeps, living area, amenities, property type, and micro‑location; a mapped summary with photos; commentary on comparability and adjustments; and recommended pricing bands with an occupancy and RevPAR outlook. We flag risks such as HOA/condo restrictions, local ordinances, registration/permitting issues, insurance changes, and neighborhood sensitivity. Whether launching a new listing or tuning an existing one, we provide accurate, defensible guidance you can share with partners and lenders—and optional refreshes as market conditions shift.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We leverage current data and proven methodology to deliver exceptional Short‑Term Rent Surveys across Florida.</p>
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
                        <AccordionTrigger>What is included in the Short‑Term Rent Survey service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Three best‑fit STR comps with photos, link references, and a location map</li>
                                <li>Recommended pricing bands (peak/weekend, standard/weekday, off‑peak)</li>
                                <li>Occupancy and RevPAR outlook with booking‑window insights</li>
                                <li>Commentary and adjustments explaining comparability</li>
                                <li>Concession/fee guidance (cleaning, pet, early/late check‑in)</li>
                                <li>Risk flags (ordinances, HOA rules, permitting/registration, insurance)</li>
                                <li>Optional add‑ons: site visit, host/PM interviews, quarterly refresh</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Short‑Term Rent Survey process take?</AccordionTrigger>
                        <AccordionContent>
                          Typical turnaround is 3–5 business days from receipt of property details. Rush options (as fast as 48 hours) are available for time‑sensitive launches.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Short‑Term Rent Survey service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address, beds/baths, sleeps, living area, property type</li>
                                <li>Amenities (pool, parking, waterfront, view), pets policy, accessibility notes</li>
                                <li>HOA/condo rules, local registration/permit status if applicable</li>
                                <li>Current calendar blocks, cleaning fee, minimum stay, smart‑pricing settings</li>
                                <li>Prior performance (ADR/Occ/RevPAR) or any comps you want considered</li>
                                <li>Market goals (maximize revenue vs. occupancy, desired guest profile)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'operating-rent-statement') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Present clear, lender‑ready financials anywhere in Florida. Our Operating Rent Statement standardizes your property’s income and expense picture into a clean, defensible package you can share with lenders, investors, and partners. We reconcile ledgers, bank exports, and invoices into T12/T6/T3 cuts; normalize for vacancy and concessions; separate OpEx from CapEx; and surface a supportable Net Operating Income (NOI) with per‑unit and per‑SF metrics. You’ll receive a concise executive summary, visual dashboards, and footnoted adjustments so every figure is easy to understand. We also flag risks (tax reassessments, insurance shifts, HOA changes) and note upside levers like RUBS, fee optimization, or pricing opportunities. Whether you manage a single home or a small portfolio, our process turns scattered records into a reliable operating statement that speeds decisions and underwriting. Optional add‑ons include verification calls and a refresh schedule as conditions change.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We leverage current data, disciplined categorization, and appraisal‑grade methodology to deliver exceptional Operating Rent Statements across Florida.</p>
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
                        <AccordionTrigger>What is included in the Operating Rent Statement service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>One‑page executive summary and visual KPI dashboard</li>
                                <li>T12/T6/T3 operating statement with standardized categories</li>
                                <li>OpEx vs. CapEx segregation with notes and supporting schedules</li>
                                <li>Normalization adjustments (vacancy, concessions, one‑time items)</li>
                                <li>NOI, margin analysis, per‑unit and per‑SF metrics, simple cash‑flow waterfall</li>
                                <li>Rent roll summary, occupancy/delinquency snapshot</li>
                                <li>Delivery in PDF and Excel with footnotes and source mapping</li>
                                <li>Optional add‑ons: verification calls, market benchmark overlay, quarterly refresh</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Operating Rent Statement process take?</AccordionTrigger>
                        <AccordionContent>
                          Typical turnaround is 3–5 business days once documents are received. Rush options (as fast as 48 hours) are available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Operating Rent Statement service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address and unit mix (beds/baths, SF)</li>
                                <li>Current rent roll and copies of active leases</li>
                                <li>Last 12 months: ledger export or bank statements, plus invoices for taxes, insurance, utilities, HOA, services</li>
                                <li>Maintenance logs and any CapEx receipts</li>
                                <li>Management agreement/fee schedule and any addenda</li>
                                <li>Notes on one‑time events to exclude (e.g., vacancy for renovation)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'transaction-coordination') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Close with confidence anywhere in Florida. Our Transaction Coordination (TC) service manages the paperwork, deadlines, and communications from executed contract to closing so nothing slips through the cracks. We build a critical‑dates timeline (deposit, inspection, loan, title, HOA/condo, insurance, appraisal, survey, walk‑through, and closing), then proactively remind all parties and collect every document and signature. We coordinate with buyers/sellers, agents, lenders, title/escrow, inspectors, and HOAs to keep the file moving; track contingencies and extensions; and escalate risks early. Your deliverable is a clean, audit‑ready file with a status dashboard and weekly updates. Whether it’s a financed purchase, cash deal, or investor flip, our TC keeps your transaction compliant, on‑time, and stress‑free. We are not a law firm and do not provide legal advice; we help you administer the contract you choose.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We use disciplined workflows and Florida‑specific best practices to deliver exceptional coordination from contract to close.</p>
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
                        <AccordionTrigger>What is included in the Transaction Coordination service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Critical‑dates timeline (earnest money, inspection, appraisal, loan, title, survey, HOA/condo, insurance, walk‑through, closing)</li>
                                <li>Document management and e‑signature routing (addenda, disclosures, escrow letters)</li>
                                <li>Title/escrow open and milestone tracking; HOA/condo estoppel ordering</li>
                                <li>Scheduling and confirmation for inspections/appraisals; repair request coordination</li>
                                <li>Lender coordination (conditions, CD timeline) and insurance binder follow‑up</li>
                                <li>Weekly status updates and shared checklist; audit‑ready closing file</li>
                                <li>Optional add‑ons: rush onboarding, mobile notary coordination, post‑close handoff</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Transaction Coordination process take?</AccordionTrigger>
                        <AccordionContent>
                          We support you from contract execution through closing. Typical timelines: 30–45 days for financed purchases and 10–21 days for cash deals, depending on title, HOA, inspection, and lender turn times.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Transaction Coordination service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Executed contract and all addenda</li>
                                <li>Parties’ contact info and preferred communication channels</li>
                                <li>Title/escrow details, earnest‑money instructions, and lender info (if financed)</li>
                                <li>Property access instructions; HOA/condo contacts (if applicable)</li>
                                <li>Any disclosures already completed and key deadlines agreed in the contract</li>
                                <li>Service level preferences (e.g., listing‑to‑close or contract‑to‑close)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'marketing-services') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Win attention and convert buyers with full‑stack property marketing anywhere in Florida. From pre‑listing strategy to launch and weekly optimization, we craft an integrated plan: brand‑aligned listing copy, professional photography, drone + video reels, 3D tours and floor plans, feature cards, signage, and single‑property landing pages. We syndicate to MLS/major portals, run geo‑targeted social and search ads, manage email pushes to curated buyer lists, and retarget site visitors. Every campaign includes audience and budget recommendations, A/B tests, and a performance dashboard (impressions, clicks, lead forms, showings requested, and cost‑per‑lead). Whether you’re bringing a home to market, re‑energizing a stale listing, or creating an investor disposition kit, our team executes quickly and transparently so you can focus on offers and negotiations. Optional add‑ons: staging consult, IDX lead‑capture site, neighborhood “why‑buy‑here” content, and local PR outreach.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We apply data‑driven creative and Florida‑specific best practices to deliver consistent, measurable results.</p>
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
                        <AccordionTrigger>What is included in the Marketing Services service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Strategy session and positioning brief</li>
                                <li>Creative production: pro photos (HDR), drone, 4K walkthrough video/reels, 3D tour, floor plan</li>
                                <li>Listing copy and print collateral (feature sheets, postcards)</li>
                                <li>Single‑property landing page with lead forms; MLS/portal syndication</li>
                                <li>Paid ads setup and management (Facebook/Instagram/Google), geo‑targeting, retargeting</li>
                                <li>Email campaign to opt‑in buyer/agent lists</li>
                                <li>Weekly performance report with optimization recommendations</li>
                                <li>Optional add‑ons: staging consult, open‑house kit, signage install, IDX site, PR outreach</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Marketing Services process take?</AccordionTrigger>
                        <AccordionContent>
                          Typical timeline: 3–5 business days from intake to campaign launch. Photography can be scheduled within 24–48 hours of access; premium video/3D may add 1–2 days. Ongoing optimization and reporting are weekly. Rush options are available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Marketing Services service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <p>Compliance: We follow Fair Housing and local MLS/advertising guidelines.</p>
                            <ul className="list-disc list-inside">
                                <li>Property address, access instructions, and preferred showing windows</li>
                                <li>Beds/baths, square footage, lot size, year built, upgrades, HOA/condo rules, and required disclosures</li>
                                <li>Brand assets (logo, colors) and the lead routing email/phone</li>
                                <li>Target buyer profile and pricing strategy</li>
                                <li>Any existing media or floor plans you’d like us to use</li>
                                <li>Ad budget and platform preferences</li>
                                <li>Drone/photography permissions where required (HOA/municipal)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'advocacy') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Get a dedicated real‑estate advocate anywhere in Florida to drive a specific outcome on your behalf. We start with a strategy session to clarify goals, constraints, and deadlines, then design and manage the end‑to‑end plan—bundling the right services (appraisal, marketing, transaction coordination, permitting/title support, tax appeal prep, and more). We coordinate stakeholders (lenders, title/escrow, HOAs, municipalities, insurers, contractors) and keep everyone aligned with a critical‑dates timeline, checklist, and weekly progress reports. Common objectives include selling a property, securing a partial release, removing PMI, appealing assessed value to reduce taxes, resolving open permits/violations, or preparing documentation for refinancing. Your deliverable is a transparent action plan, organized documents, and steady execution until the objective is met—or escalated to vetted professionals when needed. We are not a law firm and do not provide legal or tax advice; we facilitate and coordinate the services required to achieve your real‑estate goal.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We apply disciplined workflows, clear communication, and Florida‑specific know‑how to deliver results.</p>
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
                        <AccordionTrigger>What is included in the Advocacy service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Discovery interview and objectives brief</li>
                                <li>Stakeholder map, critical‑path timeline, and shared checklist</li>
                                <li>Document intake and organization; request/response tracking</li>
                                <li>Coordination with appraisers, agents, title/escrow, lenders, HOAs, municipalities, insurers, and contractors</li>
                                <li>Weekly status updates and risk escalations</li>
                                <li>Deliverables packet (summary letter, timeline, receipts/records)</li>
                                <li>Optional add‑ons: appraisal, marketing launch, transaction coordination, tax‑appeal prep, notarization/mobile signing support</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Advocacy process take?</AccordionTrigger>
                        <AccordionContent>
                          Timelines vary by objective and third‑party turnaround. Typical onboarding and plan build take 2–5 business days; many outcomes complete within 2–8 weeks, depending on lenders, HOAs, and municipal processing. Rush options may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Advocacy service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Property address, ownership and contact info</li>
                                <li>Your objective, deadline, and constraints (budget, access, disclosures)</li>
                                <li>Relevant documents (contracts, notices, tax bills, permits, HOA rules, lender letters)</li>
                                <li>Authorization for us to coordinate with third parties</li>
                                <li>Preferred communication method and update frequency</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'expert-testimony') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>When a dispute hinges on real‑estate facts, you need an independent, defensible opinion. Our Expert Testimony practice supports attorneys, lenders, owners, and fiduciaries anywhere in Florida with USPAP‑compliant analyses and clear courtroom communication. We handle divorces/equitable distribution, probate/estate matters, tax assessment appeals, insurance and construction disputes, partnership dissolutions, bankruptcy/foreclosure matters, and stigma/diminution questions. Engagements typically include a case‑specific scope, document review, site inspection (as needed), research and reconciled opinion of value or review opinion, exhibits, and concise expert declarations. We prepare for deposition and trial with visual aids, plain‑English explanations, and issue‑focused summaries. Throughout, we preserve independence and chain‑of‑custody, maintain complete workfiles, and meet court/Daubert or Frye standards. We are not a law firm and do not provide legal advice; we provide impartial expert analysis and testimony.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We combine rigorous methodology with clear, persuasive communication tailored to the trier of fact.</p>
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
                        <AccordionTrigger>What is included in the Expert Testimony service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Conflict check and tailored engagement scope</li>
                                <li>Document review (pleadings, discovery, opposing reports) and site inspection (as needed)</li>
                                <li>USPAP‑compliant valuation or review report; exhibits and summary/declaration</li>
                                <li>Deposition/trial preparation, demonstratives, and courtroom testimony</li>
                                <li>Timelines management for disclosure and discovery deadlines</li>
                                <li>Optional: rebuttal reports, settlement/mediation support</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Expert Testimony process take?</AccordionTrigger>
                        <AccordionContent>
                         Initial case review typically 2–3 business days from intake. Full reports generally 5–10 business days after access and records are provided; complex matters may require more time. Rush options (as fast as 48–72 hours) may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Expert Testimony service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Parties, case number, venue, and key deadlines (disclosure, discovery, trial)</li>
                                <li>Questions to be answered (e.g., value as of specific date, review of opposing appraisal)</li>
                                <li>Relevant documents (pleadings, prior appraisals, leases, photos, permits, tax records)</li>
                                <li>Property access instructions (if inspection is needed)</li>
                                <li>Contact details for counsel and point of contact; preferred update cadence</li>
                                <li>Executed engagement letter and retainer; confirmation that no contingent fee is requested</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }

  if (offering.id === 'legal-support') {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="mb-8">
                <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Services
                </Link>
            </div>
            <header className="mb-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
                <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
            </header>

            <section className="max-w-3xl mx-auto mb-12">
                <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
                <div className="text-muted-foreground leading-relaxed space-y-4">
                    <p>Protect your interests in any Florida real‑estate matter. Our Legal Support service connects you with licensed real‑estate counsel and coordinates the workstream so your file moves smoothly. Typical engagements include purchase‑and‑sale contract review and addenda drafting, title search & commitment review, curative guidance (liens, releases, vesting, probate/estate), survey/encroachment questions, HOA/condo estoppels & violations, escrow instructions, and closing‑document QC. When disputes arise, we support counsel with discovery‑ready financials, exhibits, valuations, and expert coordination to strengthen negotiation, mediation, or litigation strategy. From first look to clear‑to‑close, we keep deadlines visible, communications documented, and deliverables organized. ROI Home Services is not a law firm and does not provide legal advice; legal services are performed by or under the supervision of licensed attorneys engaged by you.</p>
                    <p>Our commitment to quality and client satisfaction sets us apart. We pair Florida‑specific know‑how with disciplined process to deliver timely, defensible outcomes.</p>
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
                        <AccordionTrigger>What is included in the Legal Support service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                             <ul className="list-disc list-inside">
                                <li>Conflict check and matter intake</li>
                                <li>Attorney contract review with issues memo and suggested revisions</li>
                                <li>Title search or commitment review (exceptions/requirements) and curative plan (liens, releases, partial releases, probate/vesting)</li>
                                <li>Municipal lien/permit search coordination; HOA/COA estoppel ordering and document review</li>
                                <li>Closing‑document QC (CD/ALTA), escrow‑instruction review, and record‑keeping</li>
                                <li>Dispute support: evidence packet, exhibits, valuation/expert coordination for mediation or litigation</li>
                                <li>Deliverables: redlined docs, issue log, timeline, and organized workfile</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>How long does the Legal Support process take?</AccordionTrigger>
                        <AccordionContent>
                          Initial contract or title review typically 2–3 business days after intake. Title searches/commitments 2–5 business days. Curative items vary by third party (1–4+ weeks). Rush options may be available.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>What do I need to provide for the Legal Support service?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground space-y-2">
                            <ul className="list-disc list-inside">
                                <li>Executed contract and addenda; any prior title policy/commitment and survey</li>
                                <li>Parties’ and representatives’ contact info (title/escrow, lender, HOA/COA)</li>
                                <li>Notices/demands, violation letters, or court filings if applicable</li>
                                <li>Deadlines and desired outcome (e.g., clear to close, partial release, dispute resolution)</li>
                                <li>Authority documents as needed (operating agreement, POA, estate/PR letters)</li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </section>
        </div>
    );
  }


  // Render existing generic layout for other services
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <Link href="/offerings#services" className="inline-flex items-center text-accent hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Services
        </Link>
      </div>
      <header className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{offering.title}</h1>
        <p className="text-lg text-muted-foreground capitalize">{offering.category}</p>
      </header>

      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">About this Service</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is a detailed placeholder description for our {offering.title} service. 
          We provide top-tier {offering.title.toLowerCase()} solutions tailored to your specific needs in the Central Florida market. 
          Our expertise ensures you receive accurate, reliable, and timely information to make informed decisions. 
          Whether you're dealing with {offering.blurb.toLowerCase().replace('.', '')}, or need comprehensive analysis, our team is here to assist.
          (This section should be approximately 150 words).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our commitment to quality and client satisfaction sets us apart. We leverage the latest data and methodologies
          to deliver exceptional results for {offering.title}.
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
            <AccordionTrigger>What is included in the {offering.title} service?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: Our {offering.title} service typically includes a comprehensive analysis, detailed reporting, and expert consultation relevant to {offering.blurb.toLowerCase()}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How long does the {offering.title} process take?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: The timeline for {offering.title} can vary depending on complexity, but we strive for efficient turnaround times. We'll provide an estimate upfront.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What do I need to provide for the {offering.title} service?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: Specific requirements will be discussed, but generally, property details and any relevant documentation are helpful for {offering.title}.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
