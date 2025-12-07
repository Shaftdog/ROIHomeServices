import { MetadataRoute } from 'next'
import offerings from '@/../public/data/offerings.json'
import { locations } from '@/data/locations'
import { regions } from '@/data/regions'

const BASE_URL = 'https://www.roihomesvc.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/book`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/offerings`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/accessibility`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Dynamic pages from offerings
  const services = offerings
    .filter((o) => o.category === 'service')
    .map((service) => ({
      url: `${BASE_URL}${service.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  const sectors = offerings
    .filter((o) => o.category === 'sector')
    .map((sector) => ({
      url: `${BASE_URL}${sector.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  const solutions = offerings
    .filter((o) => o.category === 'solution')
    .map((solution) => ({
      url: `${BASE_URL}${solution.href}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  // Florida Appraisals Hub & Spoke pages (new structure)
  const floridaAppraisalsPages: MetadataRoute.Sitemap = [
    // Hub page
    {
      url: `${BASE_URL}/florida-appraisals`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // Region hub pages
    ...regions.map((region) => ({
      url: `${BASE_URL}/florida-appraisals/${region.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    // City spoke pages (nested under regions)
    ...locations.map((location) => ({
      url: `${BASE_URL}/florida-appraisals/${location.regionSlug}/${location.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [...staticPages, ...services, ...sectors, ...solutions, ...floridaAppraisalsPages]
}
