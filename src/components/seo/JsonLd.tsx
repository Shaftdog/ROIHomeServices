import Script from 'next/script'

interface JsonLdProps {
  data: Record<string, unknown>
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      strategy="afterInteractive"
    />
  )
}

// Organization Schema
export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ROI Home Services',
    url: 'https://www.roihomesvc.com',
    logo: 'https://www.roihomesvc.com/logo.png',
    description:
      'Expert property valuations and advisory services in Central Florida. Fast, data-driven, and professional.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Orlando',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'State',
      name: 'Florida',
    },
    sameAs: [
      'https://www.linkedin.com/company/roi-home-services',
    ],
  }

  return <JsonLd data={data} />
}

// LocalBusiness Schema
export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.roihomesvc.com/#organization',
    name: 'ROI Home Services',
    image: 'https://www.roihomesvc.com/logo.png',
    url: 'https://www.roihomesvc.com',
    telephone: '+1-407-555-0123',
    description:
      'Expert property valuations and advisory services in Central Florida. Fast, data-driven, and professional.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Orlando',
      addressRegion: 'FL',
      postalCode: '32801',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.5383,
      longitude: -81.3792,
    },
    areaServed: [
      {
        '@type': 'State',
        name: 'Florida',
      },
    ],
    priceRange: '$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Appraisal & Consulting Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Real Estate Appraisal',
            description: 'Certified residential & commercial valuations for lending, estate, divorce, tax, and portfolio needs.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Rent Survey',
            description: 'Data-driven market rent analysis for investment properties.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Expert Testimony',
            description: 'USPAP-compliant analyses and courtroom communication for legal disputes.',
          },
        },
      ],
    },
  }

  return <JsonLd data={data} />
}

// Service Schema
interface ServiceSchemaProps {
  name: string
  description: string
  url: string
}

export function ServiceSchema({ name, description, url }: ServiceSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url,
    provider: {
      '@type': 'LocalBusiness',
      name: 'ROI Home Services',
      url: 'https://www.roihomesvc.com',
    },
    areaServed: {
      '@type': 'State',
      name: 'Florida',
    },
  }

  return <JsonLd data={data} />
}

// BreadcrumbList Schema
interface BreadcrumbItem {
  name: string
  url: string
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}

// WebSite Schema with SearchAction
export function WebSiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ROI Home Services',
    url: 'https://www.roihomesvc.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.roihomesvc.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return <JsonLd data={data} />
}

// FAQ Schema
interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  items: FAQItem[]
}

export function FAQSchema({ items }: FAQSchemaProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return <JsonLd data={data} />
}
