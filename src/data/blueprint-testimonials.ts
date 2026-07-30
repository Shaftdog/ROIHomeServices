/**
 * Testimonials for the Billionaire Blueprint landing page.
 *
 * THIS ARRAY IS INTENTIONALLY EMPTY. No Blueprint testimonial has been recorded
 * yet. Names have been floated for outreach (an investor client, a lender), but
 * nobody has given a quote or permission to publish one.
 *
 * DO NOT add a sample, a paraphrase, a composite, or "representative" copy here.
 * Putting words in a named person's mouth is a real misrepresentation, and Rod is
 * a licensed appraiser — an invented endorsement is his exposure, not a
 * placeholder.
 *
 * When a real quote is collected WITH written permission, add it here and the
 * section renders itself. While the array is empty the section renders nothing.
 */

export interface BlueprintTestimonial {
  /** Verbatim quote, as approved by the person who said it. */
  quote: string;
  /** Attribution the person agreed to be published under. */
  name: string;
  /** Optional role/company, e.g. "Investor, Orlando FL" or "Lender". */
  role?: string;
  /** Which product/package the quote is about, when it's specific to one. */
  sku?: string;
}

export const blueprintTestimonials: BlueprintTestimonial[] = [];
