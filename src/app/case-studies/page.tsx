
import Image from "next/image";
import { CtaButton } from "@/components/shared/cta-button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { TrendingUp, ShieldCheck, Banknote, Zap } from "lucide-react";

const caseStudiesData = [
  {
    title: "The Savvy Investor Flip",
    clientType: "Real Estate Investor",
    problem: "An investor needed a reliable ARV (After Repair Value) for a distressed property in a rapidly changing Orlando neighborhood to secure funding and determine a profitable offer.",
    action: "ROI Home Services conducted a thorough 'as-is' valuation and a projected ARV based on proposed renovations, local market trends, and comparable renovated sales. We provided a detailed report within 48 hours.",
    result: "The investor secured financing confidently, acquired the property, completed renovations, and sold it for 12% above the initial ARV projection, realizing a $75,000 profit.",
    metrics: [
      { value: "$75K", label: "Profit Realized" },
      { value: "12%", label: "Above ARV" },
      { value: "48hr", label: "Report Turnaround" }
    ],
    imageUrl: "https://picsum.photos/seed/flip/600/400",
    imageHint: "renovated house modern",
    icon: TrendingUp,
  },
  {
    title: "Family Home Refinance Success",
    clientType: "Homeowner",
    problem: "A family sought to refinance their home to consolidate debt and fund a college education, but were concerned about meeting the lender's LTV requirements after a previous low appraisal from another firm.",
    action: "We performed a comprehensive appraisal, meticulously documenting recent comparable sales and property improvements often overlooked. Our detailed report clearly justified a higher market value.",
    result: "The appraisal supported a valuation 15% higher than the previous one, enabling the family to successfully refinance, achieve their financial goals, and secure a lower interest rate.",
    metrics: [
      { value: "15%", label: "Value Increase" },
      { value: "Loan Secured", label: "In 7 Days" },
      { value: "Goals Met", label: "Financial Relief" }
    ],
    imageUrl: "https://picsum.photos/seed/familyhome/600/400",
    imageHint: "happy family house",
    icon: ShieldCheck,
  },
   {
    title: "Complex Waterfront Appraisal",
    clientType: "High Net Worth Individual",
    problem: "A client required an appraisal for a unique waterfront property for estate planning purposes. The property had custom features and limited direct comparables, making valuation challenging.",
    action: "Our team utilized advanced valuation techniques, including cost approach and detailed market analysis of similar luxury sales across a wider region, adjusting for specific features and location nuances.",
    result: "Delivered a well-supported, defensible valuation that was accepted by legal and financial advisors, facilitating smooth estate planning and providing clarity on asset value.",
    metrics: [
      { value: "Complex Valuation", label: "Handled Expertly" },
      { value: "Accepted by Advisors", label: "Legally Sound" },
      { value: "$5M+", label: "Asset Value Clarified" }
    ],
    imageUrl: "https://picsum.photos/seed/waterfront/600/400",
    imageHint: "luxury waterfront property",
    icon: Banknote,
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Proven Results: Our Success Stories</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance">
          Discover how ROI Home Services has helped clients like you achieve their property goals through accurate valuations and expert insights.
        </p>
      </header>

      <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 md:gap-12 mb-16 md:mb-24">
        {caseStudiesData.map((study, index) => (
          <Card key={index} className="overflow-hidden shadow-xl hover-lift flex flex-col md:flex-row">
            <div className="md:w-1/3 relative">
              <Image
                src={study.imageUrl}
                alt={study.title}
                width={600}
                height={400}
                className="object-cover w-full h-64 md:h-full"
                data-ai-hint={study.imageHint}
              />
            </div>
            <div className="md:w-2/3 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex items-center mb-2">
                  <study.icon className="h-8 w-8 text-accent mr-3" />
                  <CardTitle className="text-2xl md:text-3xl">{study.title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground font-medium">{study.clientType}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">The Challenge:</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{study.problem}</p>
                </div>
                <div className="mb-4">
                  <h4 className="font-semibold text-lg mb-1">Our Solution:</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{study.action}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1">The Outcome:</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{study.result}</p>
                </div>
              </CardContent>
              <CardFooter className="bg-light-gray p-4 md:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
                  {study.metrics.map(metric => (
                    <div key={metric.label} className="text-center sm:text-left">
                      <p className="text-2xl font-bold text-accent">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                    </div>
                  ))}
                </div>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>

      <section className="bg-gradient-to-r from-deep-charcoal to-accent text-white py-12 md:py-16 rounded-xl text-center">
        <Zap className="h-12 w-12 text-highlight mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">See How We Can Help Your Property Achieve Its Potential.</h2>
        <p className="text-slate-200 mb-8 max-w-xl mx-auto text-balance">
          Whether you&apos;re buying, selling, investing, or planning, our expertise can make a difference.
        </p>
        <CtaButton calendlyEventType="Free Consult – 15 min" variant="highlight" size="lg">
          Book a Call
        </CtaButton>
      </section>
    </div>
  );
}
