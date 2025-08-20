

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaButton } from "@/components/shared/cta-button";
import { IconPlaceholder } from "@/components/shared/icon-placeholder";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Briefcase, FileText, Building2 } from "lucide-react";
import Typer from './components/Typer';
import HeroButton from './components/HeroButton';
import WhoWeServe from "./components/WhoWeServe";
import offeringsData from "../../public/data/offerings.json";
import type { Offering } from "@/types/offerings";

const typedOfferingsData: Offering[] = offeringsData;

export default function HomePage() {
  const whatWeDoItems = {
    services: typedOfferingsData.filter(o => o.category === 'service').slice(0, 5),
    solutions: typedOfferingsData.filter(o => o.category === 'solution').slice(0, 5),
    sectors: typedOfferingsData.filter(o => o.category === 'sector').slice(0, 5),
  };

  return (
    <>
      {/* New Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center
                          text-center text-white overflow-hidden
                          before:absolute before:inset-0
                          before:bg-[url('/grid.svg')] before:bg-[length:600px_600px]
                          before:opacity-20 before:animate-gridMove">
        <video src="/hero.mp4" autoPlay loop muted playsInline
               className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            <Typer words={['Appraise It', 'Buy It', 'Sell It']} />
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2">Your Property, Solved.</p>
          <p className="mb-10 max-w-xl mx-auto text-balance">
            Valuations, Insights & Real-Estate Solutions across Florida.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <HeroButton href="/services/appraisal"         label="Get a Valuation" />
            <HeroButton href="/sectors/disposition"  label="Sell a Property" />
            <HeroButton href="/offerings#solutions"           label="Solve a Property Issue" />
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <WhoWeServe />

      {/* What We Do Section */}
      <section id="what-we-do" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center justify-center md:justify-start">
                <Briefcase className="mr-3 h-7 w-7 text-accent"/>Services
              </h3>
              <ul className="space-y-3">
                {whatWeDoItems.services.map((item) => (
                  <li key={item.id} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-highlight mr-2 shrink-0" />
                    <Link href={item.href} className="text-muted-foreground hover:text-accent transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center justify-center md:justify-start">
                <FileText className="mr-3 h-7 w-7 text-accent"/>Solutions
              </h3>
              <ul className="space-y-3">
                {whatWeDoItems.solutions.map((item) => ( 
                  <li key={item.id} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-highlight mr-2 shrink-0" />
                     <Link href={item.href} className="text-muted-foreground hover:text-accent transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-center md:text-left flex items-center justify-center md:justify-start">
                <Building2 className="mr-3 h-7 w-7 text-accent"/>Sectors
              </h3>
              <ul className="space-y-3">
                {whatWeDoItems.sectors.map((item) => (
                  <li key={item.id} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-highlight mr-2 shrink-0" />
                    <Link href={item.href} className="text-muted-foreground hover:text-accent transition-colors">
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="py-20 md:py-28 bg-gradient-to-r from-deep-charcoal to-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Ready for Clarity and Confidence in Your Property Decisions?</h2>
          <p className="text-lg text-slate-200 mb-10 max-w-3xl mx-auto text-balance">
            Stop guessing and start knowing. Our expert team is ready to provide the fast, accurate valuations and strategic insights you need.
          </p>
          <CtaButton calendlyEventType="Free Consult – 15 min" size="lg" variant="highlight" className="px-10 py-6 text-lg font-semibold" showArrow>
            Get Your Free 15-min Consult
          </CtaButton>
        </div>
      </section>
    </>
  );
}
