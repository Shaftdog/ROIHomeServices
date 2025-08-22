
import * as React from 'react';
import type { Client } from '@/types/clients';
import clientsData from '../../../../public/data/clients.json';
import { notFound } from 'next/navigation';
import { CtaButton } from '@/components/shared/cta-button';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Package, Goal, Rocket, Users, Home, Link as LinkIcon, Info, Handshake, FileText, Banknote, Search, Shield, Building, BarChart2, Briefcase, Scale, Square, DraftingCompass, Building2, Lightbulb, TrendingUp, Shuffle, UserCheck, Zap } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { IconPlaceholder } from '@/components/shared/icon-placeholder';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const typedClientsData: Client[] = clientsData;

export async function generateStaticParams() {
  return typedClientsData.map((client) => ({
    slug: client.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const client = typedClientsData.find(c => c.id === params.slug);

  if (!client) {
    return {
      title: "Client Type Not Found",
    };
  }
  
  if (params.slug === 'homeowners') {
      return {
          title: "For Homeowners | ROI Home Services",
          description: "A plain-English guide to our services and solutions for homeowners. Find the right bundle for your property goals.",
      }
  }
  
   if (params.slug === 'real-estate-investors-builders') {
      return {
          title: "For Real Estate Investors & Builders | ROI Home Services",
          description: "A quick guide to services for investor goals like fix-and-flip, BRRRR, buy-and-hold, multifamily, and development.",
      }
  }

  return {
    title: `${client.title} | ROI Home Services`,
    description: `Learn how ROI Home Services provides expert appraisal and consulting for ${client.title}. ${client.description}`,
  };
}

export default function ClientDetailPage({ params }: { params: { slug: string } }) {
  const client = typedClientsData.find(c => c.id === params.slug);

  if (!client) {
    notFound();
  }

  if (params.slug === 'real-estate-agents-brokers') {
    const goals = [
        {
            title: "Win the listing",
            bestFit: [{ name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }, { name: "Marketing Services", href: "/services/marketing-services" }],
            addOns: [{ name: "Co-branded one-pager", href: "#" }, { name: "Neighborhood stats", href: "#" }, { name: "Prep checklist", href: "#" }],
            why: "Defensible price + ANSI GLA + pro media = confidence for the seller and a stronger listing pitch."
        },
        {
            title: "Price it right (and defend it)",
            bestFit: [{ name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }],
            addOns: [{ name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }],
            why: "Clear comps, documented adjustments, and a pricing band you can explain in 60 seconds."
        },
        {
            title: "Get to market fast",
            bestFit: [{ name: "Marketing Services", href: "/services/marketing-services" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
            addOns: [{ name: "Single-property page", href: "#" }, { name: "Reels", href: "#" }, { name: "3D tour", href: "#" }, { name: "Floor plan", href: "#" }],
            why: "Launch-ready assets in days, not weeks—so you can capture momentum."
        },
        {
            title: "Contract-to-close without surprises",
            bestFit: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }],
            addOns: [{ name: "Legal Support", href: "/services/legal-support" }, { name: "Advocacy", href: "/services/advocacy" }],
            why: "Critical-dates timeline, e-sign routing, title/HOA coordination, and early risk flags."
        },
        {
            title: "Support buyers (primary or investor)",
            bestFit: [{ name: "Acquisition", href: "/sectors/acquisitions" }],
            addOns: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Lending", href: "/sectors/lending" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
            why: "Targeted pipeline, ARV/As-Is clarity, DSCR fit, and clean files for financing."
        },
        {
            title: "List or manage rentals",
            bestFit: [{ name: "Long-Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Property Management", href: "/sectors/property-management" }],
            bestFitSTR: [{ name: "Short-Term Rent Survey", href: "/services/short-term-rent-survey" }],
            addOns: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }],
            why: "Supportable rent, fewer vacancy days, and lender-ready reporting."
        },
        {
            title: "Bring an investor flip to market",
            bestFit: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Marketing Services", href: "/services/marketing-services" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }],
            addOns: [],
            why: "Validate ARV & timeline, attract buyers with pro media, and keep the file on track."
        },
        {
            title: "Solve a sticky issue",
            bestFit: [{ name: "Legal Support", href: "/services/legal-support" }, { name: "Advocacy", href: "/services/advocacy" }],
            addOns: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" }],
            why: "Issue mapping, curative plan, and evidence-ready exhibits when escalation is needed."
        },
        {
            title: "Land & new construction",
            bestFit: [{ name: "Development", href: "/sectors/development" }],
            addOns: [{ name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Marketing Services", href: "/services/marketing-services" }],
            why: "Feasibility/H&BU, residual land value, and lender/partner-ready exhibits."
        },
    ];

    const bundles = [
        { icon: UserCheck, title: "Win-the-Listing Kit", items: ["Pre-Listing Appraisal (pricing bands)", "ANSI Home Measurement (GLA + floor plan)", "Co-branded marketing preview one-pager", "Prep-to-List checklist"] },
        { icon: Rocket, title: "Prep-to-List (3–5 days)", items: ["Home Measurement (ANSI)", "Marketing launch kit (photos/drone, copy, landing page)", "Listing timeline & disclosure checklist"] },
        { icon: Handshake, title: "Contract-to-Close", items: ["Transaction Coordination (critical dates, e-sign, title/HOA)", "Legal Support coordination (as needed)", "Weekly status dashboard to client"] },
        { icon: Building, title: "Investor Buyer-Ready", items: ["Investor Valuation Package (As-Is/ARV)", "Long- or Short-Term Rent Survey", "Lending packaging & appraisal coordination"] },
    ];

    const workflowMap = [
        { stage: "Price", services: [{ name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Qualitative", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative", href: "/solutions/quantitative-adjustments" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }] },
        { stage: "Market", services: [{ name: "Marketing Services", href: "/services/marketing-services" }] },
        { stage: "Negotiate", services: [{ name: "Evidence Packet", href: "#" }, { name: "Seller Net Sheet", href: "#" }] },
        { stage: "Close", services: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Legal Support", href: "/services/legal-support" }] },
        { stage: "Rent/Manage", services: [{ name: "LTR Survey", href: "/services/long-term-rent-survey" }, { name: "STR Survey", href: "/services/short-term-rent-survey" }, { name: "Property Management", href: "/sectors/property-management" }] },
        { stage: "Optimize", services: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Asset Management", href: "/sectors/asset-management" }] },
    ];

    const serviceDirectory = {
        "Valuation & Pricing": [{ name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
        "Launch & Lead Gen": [{ name: "Marketing Services", href: "/services/marketing-services" }],
        "Contract to Close": [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Legal Support", href: "/services/legal-support" }, { name: "Advocacy", href: "/services/advocacy" }],
        "Investor & Rentals": [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Long-Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Short-Term Rent Survey", href: "/services/short-term-rent-survey" }, { name: "Property Management", href: "/sectors/property-management" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }],
        "Development": [{ name: "Development", href: "/sectors/development" }, { name: "Disposition", href: "/sectors/disposition" }],
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <header className="mb-12 text-center">
                <IconPlaceholder icon={Users} className="mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{client.title}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                    A fast guide to the services and solutions we use to help you win listings, price accurately, launch fast, and close cleanly—statewide across Florida. Everything below can be bundled à-la-carte or white-labeled/co-branded for your presentation.
                </p>
                <div className="mt-6">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book a Free Consultation</CtaButton>
                </div>
            </header>

            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">What do you want to accomplish?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <span className="text-accent mr-2">{(index + 1).toString().padStart(2, '0')}</span>{goal.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold">Best-fit:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.bestFit.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                        {goal.bestFitSTR && <><br /><span className="font-semibold">(nightly/STR):</span> {goal.bestFitSTR.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}</>}
                                    </p>
                                </div>
                                {goal.addOns.length > 0 && <div>
                                    <h4 className="font-semibold">Add-ons:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.addOns.map((s, i) => <React.Fragment key={`${s.name}-${i}`}>{i > 0 && ' • '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>}
                                <div>
                                    <h4 className="font-semibold">Why these:</h4>
                                    <p className="text-muted-foreground">{goal.why}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Popular Agent Bundles (customizable)</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bundles.map((bundle) => (
                        <Card key={bundle.title} className="hover-lift">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <IconPlaceholder icon={bundle.icon} className="bg-transparent p-0" />
                                <CardTitle className="text-xl">{bundle.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    {bundle.items.map(item => <li key={item} className="flex items-start"><CheckCircle className="h-4 w-4 text-highlight mr-2 mt-0.5 shrink-0" />{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Workflow Map</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {workflowMap.map(stage => (
                        <div key={stage.stage} className="text-center">
                            <h3 className="font-semibold text-lg mb-2">{stage.stage}</h3>
                            <ul className="space-y-1">
                               {stage.services.map((service, index) => (
                                    <li key={`${service.name}-${index}`}>
                                        <Link href={service.href} className="text-sm text-muted-foreground hover:text-accent hover:underline">
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                 </div>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">Service Directory</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {Object.entries(serviceDirectory).map(([category, services]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {services.map(service => (
                                    <li key={service.href}>
                                        <Link href={service.href} className="text-muted-foreground hover:text-accent hover:underline flex items-center text-sm">
                                            <LinkIcon className="h-3 w-3 mr-2 shrink-0"/>{service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="bg-light-gray p-6 rounded-lg text-sm text-muted-foreground">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Info className="h-5 w-5 mr-2"/>Notes & Compliance</h2>
                <ul className="space-y-2 list-disc list-inside">
                    <li>Appraisals are independent/USPAP-compliant and not contingent on listing or sale outcomes.</li>
                    <li>ROI Home Services is not a law firm or a mortgage lender/broker. Legal and lending services are provided by or under the supervision of licensed third parties you engage.</li>
                    <li>We follow Fair Housing and local MLS/advertising rules. ANSI Z765-2021 used for measurement unless your brokerage requests an allowed exception.</li>
                </ul>
            </section>

             <section className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to collaborate?</h2>
                <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book Now</CtaButton>
             </section>
        </div>
    );
  }
  
  if (params.slug === 'real-estate-investors-builders') {
    const goals = [
        { title: "Find & acquire a deal", bestFit: [{ name: "Acquisition", href: "/sectors/acquisitions" }, { name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }], addOns: [{ name: "Lending", href: "/sectors/lending" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Legal Support", href: "/services/legal-support" }], why: "Source a targeted pipeline, underwrite As‑Is & ARV with comps, line up financing, and close on schedule." },
        { title: "Underwrite quickly & clearly", bestFit: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }], addOns: [{ name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }], why: "Get As‑Is/ARV, DSCR/CaC, and defensible line‑item adjustments you can share with partners/lenders." },
        { title: "Finance or refinance", bestFit: [{ name: "Lending", href: "/sectors/lending" }], addOns: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }], why: "Package the file, support underwriting, and move from conditions to clear‑to‑close faster." },
        { title: "Launch as a long‑term rental (LTR)", bestFit: [{ name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Property Management", href: "/sectors/property-management" }], addOns: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }], why: "Price right, reduce vacancy, and get clean, lender‑ready financials." },
        { title: "Launch as a short‑term rental (STR)", bestFit: [{ name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }], addOns: [{ name: "Marketing Services", href: "/services/marketing-services" }, { name: "Property Management", href: "/sectors/property-management" }, { name: "Legal Support", href: "/services/legal-support" }], why: "Set ADR bands/occupancy outlook, optimize listings, and stay compliant." },
        { title: "BRRRR: Buy → Rehab → Rent → Refi → Repeat", bestFit: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Lending", href: "/sectors/lending" }], addOns: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }], why: "Nail ARV and rent, hit DSCR targets, and keep timelines tight from rehab through refi." },
        { title: "Fix‑and‑Flip: Buy → Rehab → Sell", bestFit: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Marketing Services", href: "/services/marketing-services" }], addOns: [{ name: "Disposition", href: "/sectors/disposition" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }], why: "Validate ARV and hold time, then launch with pro media and efficient contract‑to‑close." },
        { title: "Improve portfolio performance", bestFit: [{ name: "Asset Management", href: "/sectors/asset-management" }], addOns: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Property Management", href: "/sectors/property-management" }, { name: "Qualitative/Quantitative Adjustments", href: "/solutions/qualitative-adjustments" }], why: "KPI dashboard, pricing/renewal strategy, expense optimization, and ROI‑driven CapEx plans." },
        { title: "Plan a development or BTR site", bestFit: [{ name: "Development", href: "/sectors/development" }], addOns: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Legal Support", href: "/services/legal-support" }], why: "Feasibility/H&BU, residual land value, entitlement roadmap, and lender‑ready exhibits." },
        { title: "Lower taxes or resolve disputes", bestFit: [{ name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" }], addOns: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Legal Support", href: "/services/legal-support" }], why: "Evidence‑driven appeals with counsel/expert support when needed." },
        { title: "Exit or recapitalize", bestFit: [{ name: "Disposition", href: "/sectors/disposition" }], addOns: [{ name: "Marketing Services", href: "/services/marketing-services" }, { name: "Pre‑Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }], why: "Maximize proceeds, present a clean package, and close predictably." },
    ];

    const bundles = [
        { icon: Search, title: "Fast Underwrite (48–72 hours)", items: ["Investor Valuation Package (As-Is & ARV)", "Target rent survey (LTR or STR)", "Offer/contingency checklist"] },
        { icon: Rocket, title: "BRRRR Starter", items: ["Investor Valuation Package + Long‑Term Rent Survey", "Lending packaging & appraisal coordination", "DSCR snapshot and refi plan"] },
        { icon: Goal, title: "Flip‑to‑Market", items: ["Investor Valuation Package (ARV + hold‑time notes)", "Marketing launch kit (photos/drone, copy, landing page)", "Transaction Coordination to close"] },
        { icon: TrendingUp, title: "Operate & Optimize (Quarterly)", items: ["Asset Management dashboard & memo", "Operating Rent Statement (T12/T6/T3)", "Pricing/renewals plan and CapEx ROI tracker"] },
        { icon: Building2, title: "STR Launch", items: ["Short‑Term Rent Survey (ADR bands/occupancy)", "Listing optimization + media", "STR oversight via Property Management"] },
    ];
    
    const lifecycleMap = [
        { stage: "Sourcing", services: [{ name: "Acquisition", href: "/sectors/acquisitions" }] },
        { stage: "Underwriting", services: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Qualitative", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative", href: "/solutions/quantitative-adjustments" }] },
        { stage: "Finance", services: [{ name: "Lending", href: "/sectors/lending" }] },
        { stage: "Due Diligence", services: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Legal Support", href: "/services/legal-support" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }] },
        { stage: "Operate", services: [{ name: "Property Management", href: "/sectors/property-management" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }] },
        { stage: "Optimize", services: [{ name: "Asset Management", href: "/sectors/asset-management" }, { name: "Rent Surveys", href: "/services/long-term-rent-survey" }] },
        { stage: "Exit", services: [{ name: "Disposition", href: "/sectors/disposition" }, { name: "Marketing Services", href: "/services/marketing-services" }, { name: "Pre‑Listing Appraisal", href: "/solutions/pre-listing-appraisal" }] },
    ];
    
    const serviceDirectory = {
        "Acquisition/Exit": [{ name: "Acquisition", href: "/sectors/acquisitions" }, { name: "Disposition", href: "/sectors/disposition" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }],
        "Valuation/Underwriting": [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Pre‑Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }],
        "Pricing & Ops": [{ name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }],
        "Ongoing": [{ name: "Property Management", href: "/sectors/property-management" }, { name: "Asset Management", href: "/sectors/asset-management" }],
        "Specialty/Compliance": [{ name: "Home Measurement", href: "/solutions/home-measurement-services" }, { name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" }, { name: "Legal Support", href: "/services/legal-support" }, { name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Development", href: "/sectors/development" }],
        "Financing": [{ name: "Lending", href: "/sectors/lending" }]
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <header className="mb-12 text-center">
                <IconPlaceholder icon={Briefcase} className="mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{client.title}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                    A quick guide to the services and solutions we recommend for common investor goals—fix‑and‑flip, BRRRR, buy‑and‑hold (LTR/STR), small multifamily, and infill development. Every plan is customized to your deal size, timeline, and exit.
                </p>
                <div className="mt-6">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book a Free Consultation</CtaButton>
                </div>
            </header>

            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">What do you want to accomplish?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <span className="text-accent mr-2">{(index + 1).toString().padStart(2, '0')}</span>{goal.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold">Best-fit:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.bestFit.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>
                                {goal.addOns.length > 0 && <div>
                                    <h4 className="font-semibold">Add-ons:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.addOns.map((s, i) => <React.Fragment key={`${s.name}-${i}`}>{i > 0 && ' • '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>}
                                <div>
                                    <h4 className="font-semibold">Why these:</h4>
                                    <p className="text-muted-foreground">{goal.why}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Popular Investor Bundles (customizable)</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bundles.map((bundle) => (
                        <Card key={bundle.title} className="hover-lift">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <IconPlaceholder icon={bundle.icon} className="bg-transparent p-0" />
                                <CardTitle className="text-xl">{bundle.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    {bundle.items.map(item => <li key={item} className="flex items-start"><CheckCircle className="h-4 w-4 text-highlight mr-2 mt-0.5 shrink-0" />{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Lifecycle Map</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {lifecycleMap.map(stage => (
                        <div key={stage.stage} className="text-center">
                            <h3 className="font-semibold text-lg mb-2">{stage.stage}</h3>
                            <ul className="space-y-1">
                               {stage.services.map((service, index) => (
                                    <li key={`${service.name}-${index}`}>
                                        <Link href={service.href} className="text-sm text-muted-foreground hover:text-accent hover:underline">
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                 </div>
            </section>

            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">Service Directory</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {Object.entries(serviceDirectory).map(([category, services]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {services.map(service => (
                                    <li key={service.href}>
                                        <Link href={service.href} className="text-muted-foreground hover:text-accent hover:underline flex items-center text-sm">
                                            <LinkIcon className="h-3 w-3 mr-2 shrink-0"/>{service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="bg-light-gray p-6 rounded-lg text-sm text-muted-foreground">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Info className="h-5 w-5 mr-2"/>Notes & Compliance</h2>
                <ul className="space-y-2 list-disc list-inside">
                    <li>ROI Home Services is not a law firm or a mortgage lender/broker. Legal and lending services are provided by or under the supervision of licensed third parties you engage.</li>
                    <li>Appraisals are independent and USPAP‑compliant; consulting services are not appraisals unless specifically scoped as such.</li>
                    <li>Fair Housing, MLS/advertising, and local ordinance compliance apply for rentals and marketing.</li>
                </ul>
            </section>

             <section className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
                <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book Now</CtaButton>
             </section>
        </div>
    );
  }

  if (params.slug === 'homeowners') {
    const goals = [
        {
            title: "Sell for the best price",
            bestFit: [{ name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }, { name: "Marketing Services", href: "/services/marketing-services" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }],
            addOns: [{ name: "Advocacy", href: "/services/advocacy" }, { name: "Legal Support", href: "/services/legal-support" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
            why: "Get a defensible list price, launch with pro marketing, and keep deadlines/documents on track through closing."
        },
        {
            title: "Sell quickly with support (DIY/FSBO)",
            bestFit: [{ name: "FSBO Package", href: "/solutions/fsbo-package" }, { name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" }],
            addOns: [{ name: "Marketing Services", href: "/services/marketing-services" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }],
            why: "You control the sale; we handle pricing, launch assets, paperwork, and closing logistics."
        },
        {
            title: "Keep it as a rental",
            bestFit: [{ name: "Long-Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Property Management", href: "/sectors/property-management" }],
            bestFitSTR: [{ name: "Short-Term Rent Survey", href: "/services/short-term-rent-survey" }, { name: "STR oversight (add-on)", href: "#" }],
            addOns: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
            why: "Set the right rent, reduce vacancy and surprise costs, and get clean monthly reporting."
        },
        {
            title: "Buy a property (primary or investment)",
            bestFit: [{ name: "Acquisition", href: "/sectors/acquisitions" }, { name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Lending", href: "/sectors/lending" }],
            addOns: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Advocacy", href: "/services/advocacy" }],
            why: "Source smarter, underwrite clearly (As-Is/ARV, DSCR), and close on schedule."
        },
        {
            title: "Lower my property taxes",
            bestFit: [{ name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" }],
            addOns: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Legal Support", href: "/services/legal-support" }],
            why: "We assemble evidence and file on time; counsel/testimony available when needed."
        },
        {
            title: "Plan or test a development",
            bestFit: [{ name: "Development", href: "/sectors/development" }],
            addOns: [{ name: "Appraisal/Valuation", href: "/services/appraisal" }, { name: "Legal Support", href: "/services/legal-support" }],
            why: "Feasibility, H&BU, residual land value, entitlement roadmap—before you spend big."
        },
        {
            title: "Tune value with focused analysis",
            bestFit: [{ name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }],
            addOns: [],
            why: "Answer targeted “what’s it worth if…?” questions without a full appraisal."
        },
        {
            title: "General help / coordination",
            bestFit: [{ name: "Advocacy", href: "/services/advocacy" }],
            addOns: [],
            why: "We orchestrate the right mix (valuation, marketing, TC, legal coordination) to hit your goal."
        },
    ];

    const bundles = [
        { icon: Search, title: "Quick Value Check (2–3 days)", items: ["Pre-Listing or Restricted Appraisal", "Qualitative/Quantitative Adjustments memo", "Pricing bands + next-steps checklist"] },
        { icon: Rocket, title: "Prep‑to‑List (5–7 days)", items: ["Pre-Listing Appraisal", "Home Measurement (ANSI)", "Marketing kit (photos/drone, copy, landing page)", "Launch plan + timeline"] },
        { icon: Goal, title: "Sell‑for‑Max (Full Service)", items: ["Pre-Listing Appraisal + Marketing Services", "Transaction Coordination to close", "Advocacy & Legal Support (as needed)", "Weekly status dashboard"] },
        { icon: Home, title: "Keep & Rent (LTR)", items: ["Long-Term Rent Survey", "Property Management onboarding", "Operating Rent Statement setup (T12/T6/T3)", "Renewal strategy & calendar"] },
        { icon: Building, title: "STR Launch (Airbnb/VRBO)", items: ["Short-Term Rent Survey (pricing bands, occupancy outlook)", "Media + listing optimization", "Operations checklist (fees, cleaners, calendar rules)"] },
        { icon: Banknote, title: "Investor ARV/BRRRR", items: ["Investor Valuation Package (As-Is + ARV, DSCR/CaC)", "Lending packaging & appraisal coordination", "Transaction Coordination to close"] },
        { icon: Shield, title: "Tax Relief", items: ["Tax Appeal Package (evidence & filing plan)", "Optional Expert Testimony + Legal Support"] },
    ];
    
     const processSteps = [
        { icon: Handshake, title: "Free consult", description: "Clarify goals, timeline, and constraints." },
        { icon: FileText, title: "Custom plan", description: "Pick the right modules and price transparently." },
        { icon: Rocket, title: "Execute", description: "We coordinate stakeholders, dates, and deliverables." },
        { icon: CheckCircle, title: "Decide & act", description: "You get a clean packet to share with buyers, lenders, partners, or the county." },
    ];

    const serviceDirectory = {
        "Appraisals & Valuation": [
            { name: "Pre-Listing Appraisal", href: "/solutions/pre-listing-appraisal" },
            { name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" },
            { name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" },
            { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" },
        ],
        "Pricing & Revenue": [
            { name: "Long-Term Rent Survey", href: "/services/long-term-rent-survey" },
            { name: "Short-Term Rent Survey", href: "/services/short-term-rent-survey" },
            { name: "Operating Rent Statement", href: "/services/operating-rent-statement" },
        ],
        "Sell/Buy Support": [
            { name: "Marketing Services", href: "/services/marketing-services" },
            { name: "Transaction Coordination", href: "/services/transaction-coordination" },
            { name: "Acquisition", href: "/sectors/acquisitions" },
            { name: "Disposition", href: "/sectors/disposition" },
            { name: "FSBO Package", href: "/solutions/fsbo-package" },
        ],
        "Ongoing & Portfolio": [
            { name: "Property Management", href: "/sectors/property-management" },
            { name: "Asset Management", href: "/sectors/asset-management" },
        ],
        "Specialty & Compliance": [
            { name: "Home Measurement", href: "/solutions/home-measurement-services" },
            { name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" },
            { name: "Legal Support", href: "/services/legal-support" },
            { name: "Expert Testimony", href: "/services/expert-testimony" },
            { name: "Development", href: "/sectors/development" },
        ],
        "Financing": [
             { name: "Lending", href: "/sectors/lending" },
        ]
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <header className="mb-12 text-center">
                <IconPlaceholder icon={Home} className="mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-3">For Homeowners</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                    A quick, plain-English guide to our services and solutions—and which ones fit your situation. Pick a goal below and jump to the matching bundle. Every plan is customized for your property, timeline, and budget.
                </p>
                 <div className="mt-6">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book a Free Consultation</CtaButton>
                </div>
            </header>

            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">What do you want to accomplish?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <span className="text-accent mr-2">{(index + 1).toString().padStart(2, '0')}</span>{goal.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold">Best-fit:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.bestFit.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                        {goal.bestFitSTR && <><br/><span className="font-semibold">(nightly/STR):</span> {goal.bestFitSTR.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}</>}
                                    </p>
                                </div>
                                {goal.addOns.length > 0 && <div>
                                    <h4 className="font-semibold">Add-ons:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.addOns.map((s, i) => <React.Fragment key={`${s.name}-${i}`}>{i > 0 && ', '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>}
                                <div>
                                    <h4 className="font-semibold">Why these:</h4>
                                    <p className="text-muted-foreground">{goal.why}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Popular Bundles (customizable)</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bundles.map((bundle) => (
                        <Card key={bundle.title} className="hover-lift">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <IconPlaceholder icon={bundle.icon} className="bg-transparent p-0" />
                                <CardTitle className="text-xl">{bundle.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    {bundle.items.map(item => <li key={item} className="flex items-start"><CheckCircle className="h-4 w-4 text-highlight mr-2 mt-0.5 shrink-0" />{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
                 <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processSteps.map(step => (
                        <div key={step.title} className="text-center">
                            <IconPlaceholder icon={step.icon} className="mx-auto mb-4" />
                            <h3 className="font-semibold text-lg">{step.title}</h3>
                            <p className="text-muted-foreground text-sm">{step.description}</p>
                        </div>
                    ))}
                 </div>
            </section>

             <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">Service Directory</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {Object.entries(serviceDirectory).map(([category, services]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {services.map(service => (
                                    <li key={service.href}>
                                        <Link href={service.href} className="text-muted-foreground hover:text-accent hover:underline flex items-center text-sm">
                                            <LinkIcon className="h-3 w-3 mr-2 shrink-0"/>{service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-light-gray p-6 rounded-lg text-sm text-muted-foreground">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Info className="h-5 w-5 mr-2"/>Notes & Compliance</h2>
                <ul className="space-y-2 list-disc list-inside">
                    <li>ROI Home Services is not a law firm or a mortgage lender/broker. Legal and lending services are provided by or under the supervision of licensed third parties you engage.</li>
                    <li>We follow Fair Housing, MLS/advertising, and ANSI Z765-2021 measurement practices as applicable.</li>
                    <li>Timelines may vary by county, HOA/COA, lender, and market conditions.</li>
                </ul>
            </section>
            
             <section className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
                <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book Now</CtaButton>
             </section>
        </div>
    );
  }

  if (params.slug === 'mortgage-lenders') {
    const goals = [
        { title: "Package & pre‑underwrite the file", bestFit: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }], addOns: [{ name: "Home Measurement", href: "/solutions/home-measurement-services" }, { name: "Legal Support", href: "/services/legal-support" }], why: "Standardized T12/T6/T3, defensible rent, ANSI GLA, and early visibility on curative items." },
        { title: "Independent valuation (As‑Is / ARV)", bestFit: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }], addOns: [{ name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }], why: "USPAP‑compliant scope with bracketed comps and documented adjustments you can cite in credit." },
        { title: "Clear conditions fast", bestFit: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }], addOns: [{ name: "Lending packaging support", href: "/sectors/lending" }, { name: "Legal Support for curative plans", href: "/services/legal-support" }], why: "Centralized checklist, critical‑dates timeline, e‑sign routing, title/insurance/HOA follow‑through." },
        { title: "DSCR & cash‑flow tie‑outs", bestFit: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Rent Survey (LTR/STR)", href: "/services/long-term-rent-survey" }], addOns: [{ name: "Asset Management", href: "/sectors/asset-management" }], why: "Income normalization with vacancy/concessions and a clean DSCR/cash‑on‑cash snapshot." },
        { title: "Bridge/Fix‑and‑Flip risk control", bestFit: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }], addOns: [{ name: "Scope/budget cross‑check", href: "#" }, { name: "Milestone draw checklist via Transaction Coordination", href: "/services/transaction-coordination" }], why: "Validate ARV and timeline; track permits, insurance, and progress for draw releases." },
        { title: "Portfolio or blanket loans", bestFit: [{ name: "Asset Management", href: "/sectors/asset-management" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }], addOns: [{ name: "Property‑level Home Measurement", href: "/solutions/home-measurement-services" }, { name: "Selective Rent Surveys", href: "/services/long-term-rent-survey" }], why: "Consolidated KPI view, NOI standardization, and tie‑outs that scale across multiple assets." },
        { title: "Tax disputes, litigation, or expert needs", bestFit: [{ name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" }, { name: "Expert Testimony", href: "/services/expert-testimony" }], addOns: [{ name: "Legal Support", href: "/services/legal-support" }], why: "Evidence packets and expert coordination when value/condition is contested." },
    ];

    const bundles = [
        { icon: FileText, title: "DSCR Ready‑to‑Underwrite", items: ["Operating Rent Statement (T12/T6/T3 normalization)", "Long‑Term or Short‑Term Rent Survey", "DSCR & sensitivity snapshot (rate/insurance scenarios)"] },
        { icon: TrendingUp, title: "Flip/Bridge ARV Pack", items: ["Investor Valuation Package (As‑Is + ARV with bracketed comps)", "Rehab scope/budget cross‑check", "Draw/milestone checklist setup (optional)"] },
        { icon: Building, title: "Portfolio Refi Package", items: ["Consolidated Operating Rent Statements by asset", "KPI dashboard and variance analysis", "Selective measurements (ANSI) and rent surveys as needed"] },
        { icon: Zap, title: "Curative & Conditions Fast‑Track", items: ["Transaction Coordination (conditions tracker, e‑sign, title/HOA/insurance)", "Legal Support coordination for curative items", "Weekly status digest to credit & closing"] },
    ];

    const workflowMap = [
        { stage: "Intake", services: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }] },
        { stage: "Valuation", services: [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Qualitative", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative", href: "/solutions/quantitative-adjustments" }] },
        { stage: "Income Support", services: [{ name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }] },
        { stage: "Conditions/Clearing", services: [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Legal Support", href: "/services/legal-support" }] },
        { stage: "Post‑Close/Monitoring", services: [{ name: "Asset Management", href: "/sectors/asset-management" }] },
    ];

    const serviceDirectory = {
        "Valuation": [{ name: "Investor Valuation Package", href: "/solutions/investor-valuation-package" }, { name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }],
        "Income & Reporting": [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }],
        "Execution": [{ name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Legal Support", href: "/services/legal-support" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
        "Portfolio": [{ name: "Asset Management", href: "/sectors/asset-management" }, { name: "Property Management", href: "/sectors/property-management" }],
        "Finance Packaging": [{ name: "Lending", href: "/sectors/lending" }],
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <header className="mb-12 text-center">
                <IconPlaceholder icon={Banknote} className="mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{client.title}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                    A concise guide to how we help DSCR, bridge, construction, and conventional lenders keep files clean, timelines short, and risk visible—statewide across Florida. Deliverables are lender‑friendly, sortable, and easy to drop into your LOS or credit memo.
                </p>
                <div className="mt-6">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book a Free Consultation</CtaButton>
                </div>
            </header>
            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">What do you want to accomplish?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <span className="text-accent mr-2">{(index + 1).toString().padStart(2, '0')}</span>{goal.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold">Best-fit:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.bestFit.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>
                                {goal.addOns.length > 0 && <div>
                                    <h4 className="font-semibold">Add-ons:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.addOns.map((s, i) => <React.Fragment key={`${s.name}-${i}`}>{i > 0 && ' • '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>}
                                <div>
                                    <h4 className="font-semibold">Why these:</h4>
                                    <p className="text-muted-foreground">{goal.why}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
             <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Popular Lender Bundles (customizable)</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {bundles.map((bundle) => (
                        <Card key={bundle.title} className="hover-lift">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <IconPlaceholder icon={bundle.icon} className="bg-transparent p-0" />
                                <CardTitle className="text-xl">{bundle.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    {bundle.items.map(item => <li key={item} className="flex items-start"><CheckCircle className="h-4 w-4 text-highlight mr-2 mt-0.5 shrink-0" />{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Workflow Map</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {workflowMap.map(stage => (
                        <div key={stage.stage} className="text-center">
                            <h3 className="font-semibold text-lg mb-2">{stage.stage}</h3>
                            <ul className="space-y-1">
                               {stage.services.map((service, index) => (
                                    <li key={`${service.name}-${index}`}>
                                        <Link href={service.href} className="text-sm text-muted-foreground hover:text-accent hover:underline">
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                 </div>
            </section>

             <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">Service Directory</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {Object.entries(serviceDirectory).map(([category, services]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {services.map(service => (
                                    <li key={service.href}>
                                        <Link href={service.href} className="text-muted-foreground hover:text-accent hover:underline flex items-center text-sm">
                                            <LinkIcon className="h-3 w-3 mr-2 shrink-0"/>{service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="bg-light-gray p-6 rounded-lg text-sm text-muted-foreground">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Info className="h-5 w-5 mr-2"/>Notes & Compliance</h2>
                <ul className="space-y-2 list-disc list-inside">
                    <li>Appraisals are independent/USPAP‑compliant. We do not accept contingent fees tied to value or approval.</li>
                    <li>ROI Home Services is not a mortgage lender or broker; lending is provided by or under the supervision of licensed third‑party lenders you engage.</li>
                    <li>We are not a law firm; legal services are performed by or under the supervision of licensed attorneys you engage.</li>
                    <li>Deliverables are intended to support—not replace—your institution’s underwriting standards.</li>
                </ul>
            </section>

             <section className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to collaborate?</h2>
                <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book Now</CtaButton>
             </section>
        </div>
    );
  }

  if (params.slug === 'attorneys') {
    const goals = [
        { title: "Independent valuation or review (trial/mediation)", bestFit: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Appraisal/Review (USPAP)", href: "/services/appraisal" }], addOns: [{ name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }], why: "USPAP‑compliant analysis, paired‑sales support, ANSI GLA verification, and clear demonstratives for the trier of fact." },
        { title: "Property tax appeal (informal or VAB)", bestFit: [{ name: "Tax Appeal Package", href: "/solutions/tax-appeal-package" }, { name: "Appraisal (restricted, as scoped)", href: "/services/appraisal" }], addOns: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Legal Support", href: "/services/legal-support" }], why: "TRIM audit, comps/adjustments, income support, and a deadline‑driven filing plan with optional hearing testimony." },
        { title: "Title/curative & closing support", bestFit: [{ name: "Legal Support", href: "/services/legal-support" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }], addOns: [{ name: "Home Measurement", href: "/solutions/home-measurement-services" }, { name: "Operating Rent Statement", href: "/services/operating-rent-statement" }], why: "Commitment review, lien/estoppel coordination, document routing, and audit‑ready files to meet deadlines." },
        { title: "Damages / diminution / easement or stigma analysis", bestFit: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Appraisal (impact analysis, as needed)", href: "/services/appraisal" }], addOns: [{ name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }, { name: "Development (H&BU)", href: "/sectors/development" }], why: "Market‑supported impact ranges with bracketed comps and H&BU context." },
        { title: "Divorce, probate, or partition actions", bestFit: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Appraisal (date‑specific or review)", href: "/services/appraisal" }], addOns: [{ name: "Advocacy", href: "/services/advocacy" }, { name: "Disposition", href: "/sectors/disposition" }, { name: "Acquisition", href: "/sectors/acquisitions" }], why: "Neutral or party engagement with clear valuation, then coordinate sale or buy‑out execution." },
        { title: "STR ordinance/permit compliance or disputes", bestFit: [{ name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }], addOns: [{ name: "Legal Support", href: "/services/legal-support" }, { name: "Expert Testimony", href: "/services/expert-testimony" }], why: "Document economic impacts (ADR/occupancy/RevPAR), check rules/registration, and prepare exhibits." },
        { title: "Development / land‑use feasibility", bestFit: [{ name: "Development", href: "/sectors/development" }], addOns: [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Legal Support", href: "/services/legal-support" }], why: "Feasibility, H&BU, residual land value, and entitlement roadmap for negotiations or hearings." },
        { title: "Receivership or asset monitoring", bestFit: [{ name: "Asset Management", href: "/sectors/asset-management" }], addOns: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Property Management", href: "/sectors/property-management" }], why: "KPI tracking, income normalization, and operational stability during proceedings." },
    ];

    const bundles = [
        { icon: FileText, title: "Case‑Ready Valuation Pack", items: ["Expert valuation or review with exhibits", "Qualitative/Quantitative Adjustments memo", "Measurement (ANSI) and photo/map set"] },
        { icon: Shield, title: "VAB Appeal Exhibit Pack", items: ["TRIM audit + sales grid (paired‑sales)", "Income support (LTR/STR) with normalization", "Filing timeline and hearing prep notes; optional testimony"] },
        { icon: Zap, title: "Curative & Closing Fast‑Track", items: ["Title/commitment review and issue log", "Estoppel, lien, and permit coordination", "Conditions tracker, e‑sign routing, and closing packet"] },
        { icon: Handshake, title: "Probate/Partition Disposition", items: ["Independent valuation", "Prep‑to‑list marketing kit or buy‑out analysis", "Transaction Coordination through closing"] },
        { icon: BarChart2, title: "Damages/Diminution Analysis", items: ["Impact study (easement, view, proximity, condition)", "Bracketed comps and sensitivity ranges", "Expert declaration and demonstratives"] },
    ];

    const workflowMap = [
        { stage: "Intake/Scope", services: [{ name: "Conflict check", href: "#" }, { name: "Expert Testimony scope", href: "/services/expert-testimony" }] },
        { stage: "Evidence", services: [{ name: "Qualitative", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative", href: "/solutions/quantitative-adjustments" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }] },
        { stage: "Income", services: [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "LTR Survey", href: "/services/long-term-rent-survey" }, { name: "STR Survey", href: "/services/short-term-rent-survey" }] },
        { stage: "Curative/Execution", services: [{ name: "Legal Support", href: "/services/legal-support" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }] },
        { stage: "Hearing/Trial", services: [{ name: "Expert Testimony", href: "/services/expert-testimony" }] },
        { stage: "Disposition/Exit", services: [{ name: "Marketing Services", href: "/services/marketing-services" }, { name: "Disposition", href: "/sectors/disposition" }] },
    ];
    
    const serviceDirectory = {
        "Valuation & Expert": [{ name: "Expert Testimony", href: "/services/expert-testimony" }, { name: "Qualitative Adjustments", href: "/solutions/qualitative-adjustments" }, { name: "Quantitative Adjustments", href: "/solutions/quantitative-adjustments" }, { name: "Home Measurement", href: "/solutions/home-measurement-services" }],
        "Income & Pricing": [{ name: "Operating Rent Statement", href: "/services/operating-rent-statement" }, { name: "Long‑Term Rent Survey", href: "/services/long-term-rent-survey" }, { name: "Short‑Term Rent Survey", href: "/services/short-term-rent-survey" }],
        "Curative & Execution": [{ name: "Legal Support", href: "/services/legal-support" }, { name: "Transaction Coordination", href: "/services/transaction-coordination" }, { name: "Advocacy", href: "/services/advocacy" }],
        "Development/Land‑Use": [{ name: "Development", href: "/sectors/development" }],
        "Sell/Close": [{ name: "Disposition", href: "/sectors/disposition" }, { name: "Marketing Services", href: "/services/marketing-services" }],
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <header className="mb-12 text-center">
                <IconPlaceholder icon={Scale} className="mx-auto mb-4" />
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{client.title}</h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
                    A concise guide to how we support litigation, dispute resolution, tax appeals, curative/title work, and transactions—statewide across Florida. Deliverables are evidence‑ready, sourced, and easy to drop into your pleadings, discovery, or settlement memos. Co‑branding on summaries is available.
                </p>
                <div className="mt-6">
                    <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book a Free Consultation</CtaButton>
                </div>
            </header>

            <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">What do you want to accomplish?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {goals.map((goal, index) => (
                        <Card key={index} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    <span className="text-accent mr-2">{(index + 1).toString().padStart(2, '0')}</span>{goal.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold">Best-fit:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.bestFit.map((s, i) => <React.Fragment key={s.href}>{i > 0 && ' + '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>
                                {goal.addOns.length > 0 && <div>
                                    <h4 className="font-semibold">Add-ons:</h4>
                                    <p className="text-muted-foreground">
                                        {goal.addOns.map((s, i) => <React.Fragment key={`${s.name}-${i}`}>{i > 0 && ' • '}<Link href={s.href} className="underline hover:text-accent">{s.name}</Link></React.Fragment>)}
                                    </p>
                                </div>}
                                <div>
                                    <h4 className="font-semibold">Why these:</h4>
                                    <p className="text-muted-foreground">{goal.why}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Popular Attorney Bundles (customizable)</h2>
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bundles.map((bundle) => (
                        <Card key={bundle.title} className="hover-lift">
                            <CardHeader className="flex-row items-center gap-4 space-y-0">
                                <IconPlaceholder icon={bundle.icon} className="bg-transparent p-0" />
                                <CardTitle className="text-xl">{bundle.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm">
                                    {bundle.items.map(item => <li key={item} className="flex items-start"><CheckCircle className="h-4 w-4 text-highlight mr-2 mt-0.5 shrink-0" />{item}</li>)}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            </section>
            
            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-10">Workflow Map</h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {workflowMap.map(stage => (
                        <div key={stage.stage} className="text-center">
                            <h3 className="font-semibold text-lg mb-2">{stage.stage}</h3>
                            <ul className="space-y-1">
                               {stage.services.map((service, index) => (
                                    <li key={`${service.name}-${index}`}>
                                        <Link href={service.href} className="text-sm text-muted-foreground hover:text-accent hover:underline">
                                            {service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                 </div>
            </section>
            
             <section className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-10">Service Directory</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                    {Object.entries(serviceDirectory).map(([category, services]) => (
                        <div key={category}>
                            <h3 className="text-xl font-semibold mb-4">{category}</h3>
                            <ul className="space-y-2">
                                {services.map(service => (
                                    <li key={service.href}>
                                        <Link href={service.href} className="text-muted-foreground hover:text-accent hover:underline flex items-center text-sm">
                                            <LinkIcon className="h-3 w-3 mr-2 shrink-0"/>{service.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>
            
            <section className="bg-light-gray p-6 rounded-lg text-sm text-muted-foreground">
                <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center"><Info className="h-5 w-5 mr-2"/>Notes & Compliance</h2>
                <ul className="space-y-2 list-disc list-inside">
                    <li>Appraisals are independent/USPAP‑compliant and not contingent on case outcome; no contingent fees.</li>
                    <li>ROI Home Services is not a law firm. Legal services are provided by or under the supervision of licensed attorneys you engage.</li>
                    <li>We maintain workfile retention, chain‑of‑custody, and confidentiality; we prepare for Daubert/Frye challenges as applicable.</li>
                    <li>Deliverables support—not replace—your legal judgment and court rules.</li>
                </ul>
            </section>

             <section className="mt-16 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to collaborate?</h2>
                <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">Book Now</CtaButton>
             </section>
        </div>
    );
  }


  // @ts-expect-error - Dynamic icon access from lucide-react
  const Icon = LucideIcons[client.icon] || LucideIcons.Users;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="mb-8">
        <Link href="/offerings#clients" className="inline-flex items-center text-accent hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Client Types
        </Link>
      </div>
      <header className="mb-10 text-center">
        <IconPlaceholder icon={Icon} className="mx-auto mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-3">{client.title}</h1>
      </header>

      <section className="max-w-3xl mx-auto mb-12">
        <h2 className="text-2xl font-semibold mb-4">Specialized Services for {client.title}</h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is a detailed placeholder description for our services tailored to {client.title}. 
          We understand the unique challenges and goals you face, whether it&apos;s navigating complex transactions, planning for the future, or making critical investment decisions. 
          Our expertise in {client.description.toLowerCase().replace('.', '')} ensures you receive accurate valuations and strategic advice.
          (This section should be expanded to approximately 150 words).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Our team is committed to providing the clarity and confidence you need to succeed in your real estate endeavors.
        </p>
      </section>

      <section className="max-w-3xl mx-auto mb-12 text-center">
        <h2 className="text-2xl font-semibold mb-6">How Can We Help?</h2>
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
        <h2 className="text-2xl font-semibold mb-6 text-center">Frequently Asked Questions for {client.title}</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is the most common service for {client.title}?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: {client.title} frequently require our residential appraisal services for financing, estate planning, or pre-listing valuations. We tailor each report to your specific needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>How quickly can you provide a valuation for a property?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: Our standard turnaround time is typically 3-5 business days after the property inspection. We also offer rush services for time-sensitive situations.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Why should I choose ROI Home Services over a simple CMA from a real estate agent?</AccordionTrigger>
            <AccordionContent>
              Placeholder answer: While a CMA is a helpful pricing tool, a certified appraisal from ROI Home Services is a legally defensible and impartial valuation required by lenders, courts, and government agencies. It provides a more thorough and reliable assessment of a property&apos;s true market value.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}
