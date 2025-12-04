import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with ROI Home Services. Schedule a free consultation, request an appraisal, or ask questions about our property valuation services in Central Florida.',
  alternates: {
    canonical: 'https://www.roihomesvc.com/contact',
  },
  openGraph: {
    title: 'Contact ROI Home Services',
    description: 'Schedule a free consultation or request an appraisal. We serve Central Florida with expert property valuations.',
    url: 'https://www.roihomesvc.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
