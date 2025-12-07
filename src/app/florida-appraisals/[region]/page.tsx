import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CtaButton } from '@/components/shared/cta-button';
import FAQSection from '@/components/shared/FAQSection';
import { RegionServiceSchema, BreadcrumbSchema, FAQSchema } from '@/components/seo/JsonLd';
import { regions, getRegionBySlug, getAllRegionSlugs, getRegionsByNearby } from '@/data/regions';
import { getLocationsByRegionSlug } from '@/data/locations';
import { MapPin, CheckCircle, Phone, ArrowRight, Building } from 'lucide-react';

export async function generateStaticParams() {
  return getAllRegionSlugs().map((region) => ({ region }));
}

export async function generateMetadata({
  params,
}: {
  params: { region: string };
}): Promise<Metadata> {
  const region = getRegionBySlug(params.region);

  if (!region) {
    return { title: 'Region Not Found' };
  }

  return {
    title: `Real Estate Appraisals in ${region.name} | ROI Home Services`,
    description: `Certified property appraisals throughout ${region.name}, Florida. Serving ${region.counties.join(', ')} counties. Fast turnaround, starting at $250.`,
    keywords: [
      `${region.name} appraisal`,
      `${region.name} home valuation`,
      `${region.name} property appraiser`,
      ...region.keyCities.slice(0, 3).map((city) => `${city} appraiser`),
    ],
    alternates: {
      canonical: `https://www.roihomesvc.com/florida-appraisals/${region.slug}`,
    },
    openGraph: {
      title: `Real Estate Appraisals in ${region.name} | ROI Home Services`,
      description: `Certified property appraisals throughout ${region.name}. Serving ${region.counties.length} counties.`,
      url: `https://www.roihomesvc.com/florida-appraisals/${region.slug}`,
    },
  };
}

export default function RegionPage({ params }: { params: { region: string } }) {
  const region = getRegionBySlug(params.region);

  if (!region) {
    notFound();
  }

  const locationPages = getLocationsByRegionSlug(region.slug);
  const nearbyRegions = getRegionsByNearby(region.slug);

  const services = [
    {
      title: 'Estate & Trust Settlements',
      description: `Date-of-death valuations for probate and estate planning in ${region.name}.`,
    },
    {
      title: 'IRS & Tax Appraisals',
      description: `Certified reports meeting strict IRS requirements throughout ${region.counties[0]} County and surrounding areas.`,
    },
    {
      title: 'Bail Bond Appraisals',
      description: `Fast, reliable property valuations when time is critical. Rush service available in ${region.name}.`,
    },
    {
      title: 'Pre-Listing Appraisals',
      description: `Help sellers and agents price properties accurately in the ${region.name} market.`,
    },
    {
      title: 'Investor Valuations',
      description: `As-Is and ARV appraisals for fix-and-flip and rental investors in ${region.keyCities[0]} and beyond.`,
    },
    {
      title: 'Divorce & Legal Matters',
      description: `Neutral, court-defensible appraisals for ${region.counties.join(', ')} county courts.`,
    },
  ];

  return (
    <>
      <RegionServiceSchema
        regionName={region.name}
        regionSlug={region.slug}
        counties={region.counties}
        description={region.description.split('\n')[0]}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.roihomesvc.com' },
          { name: 'Florida Appraisals', url: 'https://www.roihomesvc.com/florida-appraisals' },
          { name: region.name, url: `https://www.roihomesvc.com/florida-appraisals/${region.slug}` },
        ]}
      />
      <FAQSchema items={region.faqs} />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-deep-charcoal to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4">
              <MapPin className="h-4 w-4" />
              <span>
                {region.counties.length} {region.counties.length === 1 ? 'County' : 'Counties'} in{' '}
                {region.vernacularName}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Estate Appraisals in {region.name}
            </h1>
            <p className="text-xl text-slate-200 mb-4">
              ROI Home Services provides certified residential appraisals for the entire{' '}
              {region.name} region, including {region.counties.join(', ')}{' '}
              {region.counties.length === 1 ? 'County' : 'Counties'}.
            </p>
            <p className="text-lg text-slate-300 mb-8">{region.localFlavorAngle}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CtaButton calendlyEventType="Free Consult – 15 min" size="lg" variant="highlight">
                Get a Free Consultation
              </CtaButton>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white text-white hover:bg-white hover:text-accent"
              >
                <Link href="/book">Book an Appraisal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Local Knowledge Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
              Expert Local Market Knowledge
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {region.description.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-muted-foreground mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Counties Served */}
      <section className="py-12 bg-light-gray dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-6">Counties We Serve</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {region.counties.map((county, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-background rounded-full text-sm font-medium shadow-sm"
              >
                {county} County
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* City Pages Section */}
      {locationPages.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Cities in {region.name}
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Click on a city for detailed local information about our appraisal services.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {locationPages.map((location) => (
                <Link
                  key={location.slug}
                  href={`/florida-appraisals/${region.slug}/${location.slug}`}
                >
                  <Card className="h-full hover-lift cursor-pointer transition-all hover:border-accent group">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-accent" />
                          {location.city}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{location.county}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Cities Section (for regions without location pages yet) */}
      {locationPages.length === 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Key Cities We Serve
            </h2>
            <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide appraisal services throughout {region.name}, including these major cities.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {region.keyCities.map((city, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-light-gray dark:bg-slate-700 rounded-full text-sm font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-light-gray dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services in {region.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <div key={index} className="flex gap-4">
                <CheckCircle className="h-6 w-6 text-highlight flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="default" size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/offerings">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title={`${region.name} Appraisal FAQs`}
        subtitle={`Common questions about our appraisal services in ${region.name}.`}
        items={region.faqs}
        className="bg-background"
      />

      {/* Nearby Regions */}
      {nearbyRegions.length > 0 && (
        <section className="py-12 bg-light-gray dark:bg-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-bold text-center mb-6">Also Serving Nearby Regions</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {nearbyRegions.map((nearbyRegion) => (
                <Link
                  key={nearbyRegion.slug}
                  href={`/florida-appraisals/${nearbyRegion.slug}`}
                  className="px-4 py-2 bg-background rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
                >
                  {nearbyRegion.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-accent to-deep-charcoal text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for an Expert Appraisal in {region.name}?
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Get accurate, reliable property valuations from certified appraisers who know the{' '}
            {region.name} market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="highlight" asChild>
              <Link href="/book">Book Your Appraisal</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-accent"
            >
              <a href="tel:407-759-3611">
                <Phone className="mr-2 h-4 w-4" />
                Call 407-759-3611
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Other Regions Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">All Florida Regions We Serve</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {regions
              .filter((r) => r.slug !== region.slug)
              .map((r) => (
                <Link
                  key={r.slug}
                  href={`/florida-appraisals/${r.slug}`}
                  className="px-4 py-2 bg-light-gray dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {r.name}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
