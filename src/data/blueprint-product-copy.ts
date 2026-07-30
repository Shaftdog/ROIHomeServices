/**
 * Optional extended copy for the per-product detail sections, keyed by SKU.
 *
 * THIS IS INTENTIONALLY EMPTY. The catalog gives us each product's name, price,
 * step, lifecycle phase, and one-line description — those are facts and the page
 * renders them. Anything beyond that (what's in the deliverable, turnaround,
 * what the client has to provide) is not recorded anywhere, and writing it here
 * would mean inventing the scope of a service a licensed appraiser has to stand
 * behind.
 *
 * Fill in a SKU when Rod has confirmed the wording, and the detail section for
 * that product picks it up. Until then each detail section shows catalog facts
 * only.
 */

export interface BlueprintProductCopy {
  /** Longer narrative shown under the catalog description. */
  body?: string;
  /** Concrete deliverables — only what is actually delivered. */
  deliverables?: string[];
  /** What the client needs to hand over for the work to start. */
  clientProvides?: string[];
}

export const blueprintProductCopy: Record<string, BlueprintProductCopy> = {};
