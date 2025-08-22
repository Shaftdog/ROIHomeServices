
import type { Offering } from '@/types/offerings';
import offeringsData from '../../../../public/data/offerings.json';
import { Metadata } from 'next';
import ServiceClientPage from './client-page';

const typedOfferingsData: Offering[] = offeringsData as Offering[];

export async function generateStaticParams() {
  const services = typedOfferingsData.filter((o) => o.category === 'service');
  return services.map((service) => ({
    slug: service.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'service');

  if (!offering) {
    return {
      title: "Offering Not Found",
      description: "The requested service offering could not be found."
    };
  }
  
  if (offering.id === 'appraisal') {
    return {
      title: "Home Appraisal | ROI Home Services",
      description: "Get an accurate home appraisal with our expert valuation team. Comprehensive services, cutting-edge technology, and superior results.",
    };
  }

  return {
    title: `${offering.title} | Services | ROI Home Services`,
    description: `Learn more about our ${offering.title} service. ${offering.blurb}`,
  };
}


export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'service');
  
  return <ServiceClientPage offering={offering} />;
}
