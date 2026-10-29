import type { Metadata } from 'next';
import Link from "next/link";
import { CtaButton } from "@/components/shared/cta-button";
import FAQSection from "@/components/shared/FAQSection";
import TestimonialsSection from "@/components/shared/TestimonialsSection";
import { generalFAQs } from "@/data/faqs";
import { testimonials } from "@/data/testimonials";

export const metadata: Metadata = {
  title: 'ROI Home Services | Central Florida Appraisals & Consulting',
  description: 'Expert property valuations and advisory services in Central Florida. Appraisals, rent surveys, and real estate consulting. Fast, data-driven, professional.',
  alternates: {
    canonical: 'https://www.roihomesvc.com',
  },
};
import { CheckCircle, Briefcase, FileText, Building2 } from "lucide-react";
import WhoWeServe from "./components/WhoWeServe";
import ServicesBanner from "@/components/home/services-banner";
import { servicesBannerSlides } from "@/data/services-banner";
import offeringsData from "../../public/data/offerings.json";
import type { Offering } from "@/types/offerings";

const typedOfferingsData: Offering[] = offeringsData as Offering[];

export default function HomePage() {
  const whatWeDoItems = {
    services: typedOfferingsData.filter(o => o.category === 'service').slice(0, 5),
    solutions: typedOfferingsData.filter(o => o.category === 'solution').slice(0, 5),
    sectors: typedOfferingsData.filter(o => o.category === 'sector').slice(0, 5),
  };

  return (
    <>
      {/* Services Banner — replaces the old single-hero section. A real,
          static, non-animated H1 sits above the rotating slides so crawlers
          and screen readers always get one stable headline; each slide's
          own headline below is an <h2> (see ServicesBanner). */}
      <div className="bg-deep-charcoal px-4 py-3 text-center sm:py-4">
        <h1 className="text-balance text-lg font-semibold text-white sm:text-xl">
          ROI Home Services &mdash; Florida Appraisals, Appraisal Intelligence &amp; Real Estate Solutions
        </h1>
      </div>
      <ServicesBanner slides={servicesBannerSlides} />

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

      {/* Testimonials Section */}
      <TestimonialsSection
        testimonials={testimonials}
        subtitle="See what our clients are saying about their experience with ROI Home Services."
        className="bg-accent text-accent-foreground"
      />

      {/* FAQ Section */}
      <FAQSection
        items={generalFAQs.slice(0, 6)}
        subtitle="Get answers to the most common questions about our appraisal and consulting services."
        className="bg-light-gray dark:bg-slate-800"
      />

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
