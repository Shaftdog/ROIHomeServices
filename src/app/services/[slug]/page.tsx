
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
      title: "Real Estate Appraisal in Florida | ROI Home Services",
      description: "Fast, compliant residential appraisals across Central Florida. Investor, lender & tax appraisals by certified experts. Book an inspection or get a quote today.",
      robots: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
      alternates: {
        canonical: "https://www.roihomesvc.com/services/appraisal"
      },
      openGraph: {
        type: "website",
        siteName: "ROI Home Services",
        locale: "en_US",
        title: "Real Estate Appraisal in Florida | ROI Home Services",
        description: "Fast, compliant residential appraisals across Central Florida. Investor, lender & tax appraisals by certified experts. Book an inspection or get a quote today.",
        url: "https://www.roihomesvc.com/appraisal",
        images: [
          {
            url: "https://www.roihomesvc.com/og/appraisal-1200x630.jpg",
            secureUrl: "https://www.roihomesvc.com/og/appraisal-1200x630.jpg",
            width: 1200,
            height: 630,
            alt: "Florida real estate appraisal service—court-ready, fast turnaround."
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: "Real Estate Appraisal in Florida | ROI Home Services",
        description: "Fast, compliant residential appraisals across Central Florida. Investor, lender & tax appraisals by certified experts. Book an inspection or get a quote today.",
        images: [
          {
            url: "https://www.roihomesvc.com/og/appraisal-1200x630.jpg",
            alt: "Florida real estate appraisal service—court-ready, fast turnaround."
          }
        ]
      }
    };
  }

  return {
    title: `${offering.title} | Services`,
    description: `Learn more about our ${offering.title} service. ${offering.blurb}`,
    alternates: {
      canonical: `https://www.roihomesvc.com/services/${offering.id}`,
    },
    openGraph: {
      title: `${offering.title} | ROI Home Services`,
      description: offering.blurb,
      url: `https://www.roihomesvc.com/services/${offering.id}`,
    },
  };
}


export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const offering = typedOfferingsData.find(o => o.id === params.slug && o.category === 'service');
  
  return <ServiceClientPage offering={offering} />;
}
