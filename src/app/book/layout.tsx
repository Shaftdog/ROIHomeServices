import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book an Appraisal',
  description: 'Schedule your property appraisal with ROI Home Services. Fast, professional real estate valuations in Central Florida. Book online in minutes.',
  alternates: {
    canonical: 'https://www.roihomesvc.com/book',
  },
  openGraph: {
    title: 'Book an Appraisal | ROI Home Services',
    description: 'Schedule your property appraisal online. Fast, professional valuations in Central Florida.',
    url: 'https://www.roihomesvc.com/book',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
