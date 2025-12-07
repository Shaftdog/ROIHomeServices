import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CtaButton } from '@/components/shared/cta-button';
import { BreadcrumbSchema, RegionServiceSchema } from '@/components/seo/JsonLd';
import { regions } from '@/data/regions';
import { MapPin, ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Florida Real Estate Appraisals | Statewide Service',
  description:
    'ROI Home Services provides certified real estate appraisals throughout all of Florida. Serving 13 regions from the First Coast to the Florida Keys. Fast turnaround, starting at $250.',
  keywords: [
    'Florida real estate appraiser',
    'Florida home appraisal',
    'Florida property valuation',
    'certified appraiser Florida',
    'statewide appraisal services',
  ],
  alternates: {
    canonical: 'https://www.roihomesvc.com/florida-appraisals',
  },
  openGraph: {
    title: 'Florida Real Estate Appraisals | ROI Home Services',
    description:
      'Certified real estate appraisals throughout all of Florida. 13 regions, 67 counties. Fast turnaround, starting at $250.',
    url: 'https://www.roihomesvc.com/florida-appraisals',
  },
};

export default function FloridaAppraisalsPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.roihomesvc.com' },
          { name: 'Florida Appraisals', url: 'https://www.roihomesvc.com/florida-appraisals' },
        ]}
      />
      <RegionServiceSchema
        regionName="Florida"
        regionSlug=""
        counties={['All Florida Counties']}
        description="Certified real estate appraisals throughout all of Florida. Serving 13 regions from the First Coast to the Florida Keys."
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-deep-charcoal to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Florida Real Estate Appraisals
            </h1>
            <p className="text-xl text-slate-200 mb-4">
              ROI Home Services provides certified residential appraisals throughout the entire
              state of Florida. From the First Coast to the Florida Keys, our licensed appraisers
              deliver accurate, defensible valuations.
            </p>
            <p className="text-lg text-slate-300 mb-8">
              Serving all 67 counties across 13 distinct regions. Fast turnaround, transparent
              pricing starting at $250.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CtaButton calendlyEventType="Free Consult – 15 min" size="lg" variant="highlight">
                Get a Free Consultation
              </CtaButton>
              <Link
                href="/book"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-md hover:bg-white hover:text-accent transition-colors font-medium"
              >
                Book an Appraisal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-light-gray dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">20+</div>
              <p className="text-muted-foreground">Years Experience</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">12,000+</div>
              <p className="text-muted-foreground">Appraisals Completed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">13</div>
              <p className="text-muted-foreground">Regions Served</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">$250</div>
              <p className="text-muted-foreground">Starting Price</p>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Florida Service Regions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your region to learn about our local appraisal services and find city-specific
              information.
            </p>
          </header>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regions.map((region) => (
              <Link key={region.slug} href={`/florida-appraisals/${region.slug}`}>
                <Card className="h-full hover-lift cursor-pointer transition-all hover:border-accent group">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        {region.name}
                      </span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {region.counties.length} {region.counties.length === 1 ? 'county' : 'counties'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {region.keyCities.slice(0, 3).map((city, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-light-gray dark:bg-slate-700 rounded"
                        >
                          {city}
                        </span>
                      ))}
                      {region.keyCities.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-light-gray dark:bg-slate-700 rounded">
                          +{region.keyCities.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-light-gray dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Appraisal Services Statewide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whatever your appraisal need, we provide certified, USPAP-compliant valuations
              throughout Florida.
            </p>
          </header>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Estate & Trust Settlements',
                description:
                  'Accurate date-of-death valuations for probate, estate planning, and trust administration.',
              },
              {
                title: 'IRS & Tax Purposes',
                description:
                  'Certified reports that meet strict IRS requirements for gift tax, estate tax, and charitable donations.',
              },
              {
                title: 'Bail Bond Appraisals',
                description:
                  'Fast, reliable property valuations when time is critical. Rush turnaround available.',
              },
              {
                title: 'Pre-Listing Appraisals',
                description:
                  'Independent valuations to help sellers and agents price properties accurately before listing.',
              },
              {
                title: 'Investor Valuations',
                description:
                  'As-Is and After Repair Value (ARV) appraisals for fix-and-flip and rental investors.',
              },
              {
                title: 'Divorce & Legal Matters',
                description:
                  'Neutral, court-defensible appraisals for equitable distribution in divorce proceedings.',
              },
            ].map((service, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-highlight flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-accent to-deep-charcoal text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for an Expert Appraisal Anywhere in Florida?
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Get accurate, reliable property valuations from certified appraisers who know Florida
            markets inside and out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center px-8 py-4 bg-highlight text-deep-charcoal rounded-md hover:bg-highlight/90 transition-colors font-bold"
            >
              Book Your Appraisal
            </Link>
            <a
              href="tel:407-759-3611"
              className="inline-flex items-center justify-center px-8 py-4 border border-white text-white rounded-md hover:bg-white hover:text-accent transition-colors font-medium"
            >
              Call 407-759-3611
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
