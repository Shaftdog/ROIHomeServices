export interface FAQItem {
  question: string;
  answer: string;
}

// Pre-defined FAQ sets for common use cases
export const generalFAQs: FAQItem[] = [
  {
    question: 'What areas do you serve in Florida?',
    answer:
      'We serve all of Florida, with primary coverage in Central Florida including Orlando, Tampa Bay, Jacksonville, Miami-Dade, and the Gulf Coast. We can accommodate properties throughout the state.',
  },
  {
    question: 'How long does an appraisal typically take?',
    answer:
      'On-site visits typically take 1-2 hours for residential properties. Report delivery is usually 3-7 business days for residential and 2-4 weeks for commercial/multifamily. Rush options are available.',
  },
  {
    question: 'What is the difference between an appraisal and a CMA?',
    answer:
      'A CMA (Comparative Market Analysis) is prepared by a real estate agent for pricing strategy. An appraisal is a USPAP-compliant, certified valuation by a licensed appraiser, designed for legal and financial use with lenders, courts, and the IRS.',
  },
  {
    question: 'Do you offer virtual or desktop appraisals?',
    answer:
      'Yes, we offer multiple scope options including full interior inspections, exterior-only, and desktop appraisals depending on your needs and lender requirements.',
  },
  {
    question: 'How much does an appraisal cost?',
    answer:
      'Typical single-family home appraisals range from $400-$600. Multifamily and commercial properties range from $2,000-$10,000+ depending on size and complexity. Contact us for a specific quote.',
  },
  {
    question: 'Can I challenge an appraisal I disagree with?',
    answer:
      'Yes. For lender-related appraisals, you can request a Reconsideration of Value (ROV) with supporting evidence. For private appraisals, you can order a review or second appraisal when there is new evidence or a material error.',
  },
  {
    question: 'What documents should I have ready for my appraisal?',
    answer:
      'Helpful documents include a list of improvements with dates/costs, permits for major work, HOA documents, recent survey, and for rentals: rent roll, leases, and 12 months of income/expenses.',
  },
  {
    question: 'Do you provide appraisals for legal purposes?',
    answer:
      'Yes, we provide USPAP-compliant appraisals and expert testimony for divorce, probate, estate planning, tax appeals, insurance disputes, partnership dissolutions, and other legal matters.',
  },
];

export const bookingFAQs: FAQItem[] = [
  {
    question: 'How do I schedule an appraisal?',
    answer:
      'You can book online through our scheduling system, or call us at 407-759-3611. We typically can schedule inspections within 2-5 business days.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards, ACH/bank transfer, and checks. Payment is typically due at the time of booking, and fees are non-refundable once work begins.',
  },
  {
    question: 'Can I reschedule my appointment?',
    answer:
      'Yes, please contact us at least 24 hours before your scheduled inspection to reschedule. Last-minute cancellations may incur a fee.',
  },
  {
    question: 'What if I need a rush appraisal?',
    answer:
      'Rush options are available for most services. Contact us to discuss your timeline and we will do our best to accommodate your needs.',
  },
];
