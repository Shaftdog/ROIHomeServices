/**
 * Appraisal booking fee schedule — THE authority for what we charge.
 *
 * SECURITY: the client must never be able to influence the amount charged.
 * API routes take the pricing INPUTS (scope, size, units, lot, site influence)
 * and recompute the total here. They must never read a dollar amount, a
 * discounted total, or a coupon's arithmetic from the request body.
 *
 * This schedule previously existed ONLY as a `calculateQuote()` function inside
 * the client component `src/components/scheduler/PropertyDetailsForm.tsx`. Its
 * comment referred to `lib/calculatePrice.ts`, which never existed — so the
 * browser was the only thing that knew what an appraisal cost, and
 * /api/create-payment-intent charged whatever it was handed above a $50 floor.
 * The rules below are that function's rules, copied without alteration.
 *
 * The numbers were confirmed correct by the owner on 2026-07-29. Editing one
 * changes the revenue actually collected, not merely a displayed quote.
 *
 * Money is integer cents throughout: the $0.10/sqft rule on a float dollar
 * total is exactly where drift would otherwise creep in.
 */

export type ScopeOfInspection = "inspection" | "desktop" | "interior" | "exterior";

/** Base fee by scope, in cents. */
const BASE_CENTS: Record<ScopeOfInspection, number> = {
  inspection: 20_000, // $200
  desktop: 25_000, // $250
  interior: 45_000, // $450
  exterior: 35_000, // $350
};

/**
 * Fallback base when scope is absent or unrecognised. The original
 * `calculateQuote` initialised `basePrice = 450` before its if/else chain, so an
 * unknown scope silently priced as an interior. That branch is unreachable
 * through the UI (the form constrains scope), and it is preserved rather than
 * "fixed" so this module cannot change any price the schedule already produced.
 */
const DEFAULT_BASE_CENTS = 45_000; // $450

const SQFT_THRESHOLD = 3000;
const CENTS_PER_SQFT_OVER = 10; // $0.10/sqft on the excess only
const LOT_OVER_ONE_ACRE_CENTS = 10_000; // $100
const SITE_INFLUENCE_CENTS = 10_000; // $100
const MULTI_UNIT_CENTS = 20_000; // $200, for 2–4 units

/** Unit counts that carry the multi-unit surcharge. */
const MULTI_UNIT_VALUES = ["2", "3", "4"];

/** Unit count we decline online — residential is up to four units. */
const DECLINED_UNITS = "5+";

export const DECLINED_UNITS_MESSAGE =
  "Please call for a quote. We only appraise residential properties with up to four units.";

/** The inputs a price is derived from. Anything else on a request is ignored. */
export interface AppraisalPricingInputs {
  scopeOfInspection?: string;
  sizeOfHome?: number;
  numberOfLivingUnits?: string;
  isLotOverOneAcre?: boolean;
  hasSiteInfluence?: boolean;
}

export type AppraisalQuote =
  | { kind: "priced"; amountCents: number }
  /** Not a price: 5+ units is a phone conversation, and submit is blocked. */
  | { kind: "declined"; message: string };

/**
 * Resolve the fee for a set of inputs. Pure and total — every path returns a
 * quote, so a caller can never accidentally proceed with an undefined amount.
 */
export function quoteAppraisalCents(inputs: AppraisalPricingInputs): AppraisalQuote {
  const {
    scopeOfInspection,
    sizeOfHome = 0,
    numberOfLivingUnits,
    isLotOverOneAcre = false,
    hasSiteInfluence = false,
  } = inputs;

  if (numberOfLivingUnits === DECLINED_UNITS) {
    return { kind: "declined", message: DECLINED_UNITS_MESSAGE };
  }

  const scope = scopeOfInspection as ScopeOfInspection;
  let cents = BASE_CENTS[scope] ?? DEFAULT_BASE_CENTS;

  // Guard the sqft arithmetic: a non-finite or negative size must not be able
  // to subtract from the base. Math.trunc keeps the result whole cents.
  const sqft = Number(sizeOfHome);
  if (Number.isFinite(sqft) && sqft > SQFT_THRESHOLD) {
    cents += Math.trunc((sqft - SQFT_THRESHOLD) * CENTS_PER_SQFT_OVER);
  }

  if (isLotOverOneAcre) cents += LOT_OVER_ONE_ACRE_CENTS;
  if (hasSiteInfluence) cents += SITE_INFLUENCE_CENTS;
  if (numberOfLivingUnits && MULTI_UNIT_VALUES.includes(numberOfLivingUnits)) {
    cents += MULTI_UNIT_CENTS;
  }

  return { kind: "priced", amountCents: cents };
}

/** Dollars, for display only. Never send this back to the server as an amount. */
export function centsToDollars(cents: number): number {
  return cents / 100;
}

/**
 * Display helper preserving the original `calculateQuote` contract — a number
 * of dollars, or the decline string — so the existing form UI is unchanged.
 */
export function quoteAppraisalForDisplay(inputs: AppraisalPricingInputs): number | string {
  const quote = quoteAppraisalCents(inputs);
  return quote.kind === "declined" ? quote.message : centsToDollars(quote.amountCents);
}
