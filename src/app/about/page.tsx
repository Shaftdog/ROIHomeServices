
import Image from "next/image";
import { CtaButton } from "@/components/shared/cta-button";
import { Briefcase } from "lucide-react"; // More specific icons

export default function AboutPage() {

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">About ROI Home Services</h1>
      </header>

      {/* Founder Story Section */}
      <section className="mb-12 md:mb-16 grid md:grid-cols-5 gap-8 items-center">
        <div className="md:col-span-2">
          <Image
            src="https://picsum.photos/seed/founder/600/600"
            alt="Founder of ROI Home Services"
            width={600}
            height={600}
            className="rounded-xl shadow-lg object-cover aspect-square"
            data-ai-hint="professional headshot business owner"
          />
        </div>
        <div className="md:col-span-3">
          <h2 className="text-3xl font-semibold mb-4">Our Founder&apos;s Journey</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              ROI Home Services was born out of over three decades of real estate experience and a passion for creating lasting value in communities. Our founder, Rod Haugabrooks, began his career navigating property auctions and negotiating with financial institutions during one of the most challenging housing markets in history. His ability to see opportunity where others saw obstacles became the foundation for what would later grow into ROI Home Services.
            </p>
            <p>
              In the early years, Rod successfully orchestrated over a thousand real estate deals, building a reputation for strategic insight and integrity. He founded ROI Homes in 2011, focusing on helping families and investors find the right opportunities. As the company’s services expanded, it rebranded in 2017 as ROI Home Services to reflect a broader mission—delivering appraisal, valuation, and real estate solutions that empower clients to make confident decisions.
            </p>
            <p>
              Today, ROI Home Services is not just about valuations—it&apos;s about creating systems, processes, and services that simplify real estate for lenders, investors, and homeowners alike. Rod&apos;s vision extends beyond transactions; it&apos;s about building trust, providing clarity, and ensuring that every client, from individuals to institutional lenders, feels supported through every step of the real estate process.
            </p>
            <p>
              Our journey continues with the same entrepreneurial spirit that started it all: identifying opportunities, adapting to change, and always putting clients first.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-12 md:mb-16 py-12 bg-light-gray rounded-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <div className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance space-y-4">
             <p>
              At ROI Home Services, our mission is to deliver trusted, accurate, and timely real estate solutions that empower lenders, investors, and homeowners to make confident decisions. We combine decades of experience with modern systems to simplify complex processes, ensuring clarity, compliance, and consistency in every appraisal and valuation we provide.
            </p>
            <p>
              We are committed to building long-term relationships through integrity, innovation, and service excellence, while continuously adapting to the evolving needs of the real estate industry. Our goal is to create measurable value for our clients, strengthen communities, and position ROI Home Services as a reliable partner in every stage of the real estate journey.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Page CTA */}
      <section className="bg-gradient-to-r from-deep-charcoal to-accent text-white py-12 md:py-16 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Work With a Trusted Partner?</h2>
        <p className="text-slate-200 mb-8 max-w-xl mx-auto text-balance">
          Let our expertise guide your next property decision. Schedule a free consultation to discuss your needs.
        </p>
        <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
          Book a Consultation
        </CtaButton>
      </section>
    </div>
  );
}
