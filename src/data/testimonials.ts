export interface Testimonial {
  quote: string;
  name: string;
  rating: number;
  location?: string;
  service?: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "The appraiser was polite, thorough and professional. I have recommended ROI appraisal to two of my neighbors.",
    name: "Pete O.",
    rating: 4.0,
    location: "Orlando, FL",
    service: "Residential Appraisal"
  },
  {
    quote: "Rod was extremely knowledgeable and turn around time was fast! I would not use any other appraiser in the central Florida area.",
    name: "Dozell V.",
    rating: 5.0,
    location: "Central Florida",
    service: "Home Appraisal"
  },
  {
    quote: "Response to our request for service was almost instantaneous. Bert came out only 2 days later. Efficient and courteous.",
    name: "Howard C.",
    rating: 5.0,
    location: "Orange County, FL",
    service: "Property Valuation"
  },
  {
    quote: "Decided to get an appraisal after getting 4 CMAs with different values. Got the info I was looking for.",
    name: "Brooke S.",
    rating: 5.0,
    location: "Winter Park, FL",
    service: "Pre-Listing Appraisal"
  },
  {
    quote: "Was able to easily schedule services. The appraisal was rendered in a timely manner.",
    name: "Lana J.",
    rating: 5.0,
    location: "Seminole County, FL",
    service: "Residential Appraisal"
  },
  {
    quote: "Needed an appraisal for the probate court. Lisa was quick to respond and Chuck was very thorough.",
    name: "Linda Q.",
    rating: 5.0,
    location: "Orlando, FL",
    service: "Estate Appraisal"
  },
  {
    quote: "Thorough, professional and on time. Absolutely will refer them to my colleagues.",
    name: "Dudley R.",
    rating: 5.0,
    location: "Tampa Bay, FL",
    service: "Commercial Appraisal"
  },
  {
    quote: "Very easy to work with. Professional.",
    name: "Mark V.",
    rating: 5.0,
    location: "Kissimmee, FL",
    service: "Home Appraisal"
  },
  {
    quote: "Very thorough.",
    name: "Alicia C.",
    rating: 4.5,
    location: "Osceola County, FL"
  },
  {
    quote: "Very nice people to work with.",
    name: "Marinus P.",
    rating: 5.0,
    location: "Lake County, FL"
  },
  {
    quote: "Great service!",
    name: "George H.",
    rating: 4.5,
    location: "Volusia County, FL"
  },
  {
    quote: "Absolutely superb!!!",
    name: "Kathleen D.",
    rating: 5.0,
    location: "Brevard County, FL"
  },
  {
    quote: "Excellent service.",
    name: "Nabot",
    rating: 5.0,
    location: "Central Florida"
  },
  {
    quote: "Very experienced and they go out of their way to be sure you're satisfied. I strongly recommend them.",
    name: "Thomas A.",
    rating: 5.0,
    location: "Orlando, FL",
    service: "Investment Property Appraisal"
  },
  {
    quote: "Everything I expected.",
    name: "David V.",
    rating: 5.0,
    location: "Polk County, FL"
  },
];

export function getAverageRating(): number {
  const total = testimonials.reduce((sum, t) => sum + t.rating, 0);
  return Math.round((total / testimonials.length) * 10) / 10;
}

export function getTestimonialCount(): number {
  return testimonials.length;
}
