import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CtaButton } from '@/components/shared/cta-button';
import FAQSection from '@/components/shared/FAQSection';
import { ServiceSchema, BreadcrumbSchema } from '@/components/seo/JsonLd';
import { locations, getLocationBySlug, getAllLocationSlugs } from '@/data/locations';
import { MapPin, CheckCircle, Phone, ArrowRight } from 'lucide-react';

export async function generateStaticParams() {
  return getAllLocationSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const location = getLocationBySlug(params.slug);

  if (!location) {
    return { title: 'Location Not Found' };
  }

  return {
    title: `Real Estate Appraisal in ${location.city}, FL`,
    description: `Expert property appraisals and valuations in ${location.city}, ${location.county}. Certified appraisers serving ${location.region}. Fast turnaround, accurate valuations.`,
    keywords: location.keywords,
    alternates: {
      canonical: `https://www.roihomesvc.com/locations/${location.slug}`,
    },
    openGraph: {
      title: `Real Estate Appraisal in ${location.city}, Florida | ROI Home Services`,
      description: `Expert property appraisals in ${location.city}, ${location.county}. Certified appraisers serving ${location.region}.`,
      url: `https://www.roihomesvc.com/locations/${location.slug}`,
    },
  };
}

export default function LocationPage({ params }: { params: { slug: string } }) {
  const location = getLocationBySlug(params.slug);

  if (!location) {
    notFound();
  }

  const services = [
    {
      title: 'Residential Appraisals',
      description: `Single-family homes, condos, and townhouses in ${location.city} and ${location.county}.`,
    },
    {
      title: 'Commercial Appraisals',
      description: `Office buildings, retail spaces, and industrial properties throughout ${location.region}.`,
    },
    {
      title: 'Rent Surveys',
      description: `Long-term and short-term rental valuations for investment properties in ${location.city}.`,
    },
    {
      title: 'Expert Testimony',
      description: `USPAP-compliant appraisals for legal matters in ${location.county} courts.`,
    },
  ];

  const locationFaqs = [
    {
      question: `How long does an appraisal take in ${location.city}?`,
      answer: `For residential properties in ${location.city}, the on-site inspection typically takes 1-2 hours. Report delivery is usually 3-7 business days. Commercial properties in ${location.county} may require 2-4 weeks depending on complexity.`,
    },
    {
      question: `What areas do you serve near ${location.city}?`,
      answer: `We serve ${location.city} and surrounding areas including ${location.nearbyAreas.join(', ')}. Our appraisers have extensive knowledge of the ${location.region} real estate market.`,
    },
    {
      question: `How much does a home appraisal cost in ${location.city}?`,
      answer: `Typical single-family home appraisals in ${location.city} range from $400-$600. Complex properties, luxury homes, and commercial properties in ${location.county} may cost more. Contact us for a specific quote.`,
    },
    {
      question: `Do you provide rush appraisals in ${location.city}?`,
      answer: `Yes, we offer expedited turnaround for properties in ${location.city} and throughout ${location.county}. Rush options can be as fast as 48-72 hours for residential appraisals.`,
    },
  ];

  return (
    <>
      <ServiceSchema
        name={`Real Estate Appraisal in ${location.city}, FL`}
        description={`Expert property appraisals and valuations in ${location.city}, ${location.county}. Serving ${location.region}.`}
        url={`https://www.roihomesvc.com/locations/${location.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://www.roihomesvc.com' },
          { name: 'Locations', url: 'https://www.roihomesvc.com/locations' },
          { name: location.city, url: `https://www.roihomesvc.com/locations/${location.slug}` },
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-deep-charcoal to-accent text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-sm mb-4">
              <MapPin className="h-4 w-4" />
              <span>{location.county} • {location.region}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Real Estate Appraisal in {location.city}, Florida
            </h1>
            <p className="text-xl text-slate-200 mb-8">
              {location.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CtaButton calendlyEventType="Free Consult – 15 min" size="lg" variant="highlight">
                Get a Free Consultation
              </CtaButton>
              <Button variant="outline" size="lg" asChild className="border-white text-white hover:bg-white hover:text-accent">
                <Link href="/book">Book an Appraisal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Our Services in {location.city}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-highlight" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
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

      {/* Service Area Section */}
      <section className="py-16 md:py-24 bg-light-gray dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Serving {location.city} & Surrounding Areas
            </h2>
            <p className="text-muted-foreground mb-8">
              Our certified appraisers provide expert valuations throughout {location.county} and the greater {location.region} area.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {location.nearbyAreas.map((area, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-background rounded-full text-sm font-medium shadow-sm"
                >
                  {area}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Serving zip codes: {location.zipCodes.slice(0, 10).join(', ')}
              {location.zipCodes.length > 10 && ` and ${location.zipCodes.length - 10} more`}
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title={`${location.city} Appraisal FAQs`}
        subtitle={`Common questions about our appraisal services in ${location.city} and ${location.county}.`}
        items={locationFaqs}
        className="bg-background"
      />

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-accent to-deep-charcoal text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready for an Expert Appraisal in {location.city}?
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Get accurate, reliable property valuations from certified appraisers who know the {location.region} market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="highlight" asChild>
              <Link href="/book">Book Your Appraisal</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-accent">
              <a href="tel:407-759-3611">
                <Phone className="mr-2 h-4 w-4" />
                Call 407-759-3611
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Other Locations Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Other Florida Locations We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {locations
              .filter((loc) => loc.slug !== location.slug)
              .slice(0, 6)
              .map((loc) => (
                <Link
                  key={loc.slug}
                  href={`/locations/${loc.slug}`}
                  className="px-4 py-2 bg-light-gray dark:bg-slate-800 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {loc.city}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
