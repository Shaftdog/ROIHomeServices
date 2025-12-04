import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Offerings',
  description: 'Explore ROI Home Services offerings: appraisal services, rent surveys, expert testimony, transaction coordination, and real estate solutions for Central Florida.',
  alternates: {
    canonical: 'https://www.roihomesvc.com/offerings',
  },
  openGraph: {
    title: 'Services & Solutions | ROI Home Services',
    description: 'Comprehensive appraisal services, rent surveys, expert testimony, and real estate solutions for Central Florida.',
    url: 'https://www.roihomesvc.com/offerings',
  },
};

export default function OfferingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
