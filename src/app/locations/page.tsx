import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CtaButton } from '@/components/shared/cta-button';
import { locations } from '@/data/locations';
import { MapPin, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Service Areas',
  description: 'ROI Home Services provides expert real estate appraisals throughout Florida. View our service areas including Orlando, Tampa, Jacksonville, Miami, and more.',
  alternates: {
    canonical: 'https://www.roihomesvc.com/locations',
  },
  openGraph: {
    title: 'Florida Service Areas | ROI Home Services',
    description: 'Expert real estate appraisals throughout Florida. Orlando, Tampa, Jacksonville, Miami, and more.',
    url: 'https://www.roihomesvc.com/locations',
  },
};

export default function LocationsPage() {
  // Group locations by region
  const locationsByRegion = locations.reduce((acc, location) => {
    if (!acc[location.region]) {
      acc[location.region] = [];
    }
    acc[location.region].push(location);
    return acc;
  }, {} as Record<string, typeof locations>);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Florida Service Areas</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We provide expert real estate appraisals and valuations throughout the state of Florida.
          Select your area below for local information and services.
        </p>
      </header>

      {Object.entries(locationsByRegion).map(([region, regionLocations]) => (
        <section key={region} className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-accent" />
            {region}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionLocations.map((location) => (
              <Link key={location.slug} href={`/locations/${location.slug}`}>
                <Card className="h-full hover-lift cursor-pointer transition-all hover:border-accent">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl flex items-center justify-between">
                      {location.city}
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{location.county}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {location.description.substring(0, 120)}...
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {location.nearbyAreas.slice(0, 3).map((area, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-light-gray dark:bg-slate-800 rounded"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="mt-16 py-12 px-8 bg-gradient-to-r from-deep-charcoal to-accent rounded-lg text-white text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Don&apos;t See Your Area?</h2>
        <p className="text-slate-200 mb-6 max-w-xl mx-auto">
          We serve all of Florida. Contact us to discuss your appraisal needs anywhere in the state.
        </p>
        <CtaButton calendlyEventType="Free Consult – 15 min" size="lg" variant="highlight">
          Get a Free Consultation
        </CtaButton>
      </section>
    </div>
  );
}
