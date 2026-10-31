/**
 * Shared config for the Appraisal Intelligence product surface on
 * roihomesvc.com — the homepage services banner and /appraisal-intelligence.
 *
 * Appraisal Intelligence is an automated valuation (AVM) product, not an
 * appraisal. Keep copy that touches it compliant with
 * AVM_DISCLOSURE_TEXT below (see also <AvmDisclosure />).
 */

/** The investor portal app (Salesmod), where screening actually happens. */
/** Public accuracy record (back-test of closed flips; AVM, not an appraisal). */
export const ACCURACY_RECORD_URL = 'https://portal.roihomesvc.com/accuracy';

export const APP_URL = 'https://app.appraisal-intelligence.com';

/** The standalone Appraisal Intelligence marketing/product site. */
export const AI_PRODUCT_SITE_URL = 'https://appraisal-intelligence.com';

/**
 * Path to the free, no-signup deal screen inside the app.
 *
 * Confirmed 2026-10-28 against origin/main of Salesmod: src/app/free-screen
 * (PR #467, #657) is a top-level public route — it is NOT in middleware's
 * `protectedRoutes` list (src/lib/supabase/middleware.ts), so it needs no
 * session. The flow is screen-first: visitor enters an address, sees the
 * (redacted headline) result, then creates an account to see the full
 * report — the account step is not a wall in front of the free screen.
 *
 * Drop NEXT_PUBLIC_AI_FREE_SCREEN_PATH into the env to override this
 * without a code change, if the route ever moves.
 */
function readPath(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const FREE_SCREEN_PATH = readPath(process.env.NEXT_PUBLIC_AI_FREE_SCREEN_PATH) ?? '/free-screen';

/**
 * Builds an app.appraisal-intelligence.com URL with UTM params attached.
 * `campaign` should identify the surface the click came from, e.g.
 * "home-banner-ai" or "ai-page-hero".
 */
export function freeScreenUrl(campaign: string): string {
  const url = new URL(FREE_SCREEN_PATH, APP_URL);
  url.searchParams.set('utm_source', 'roihomesvc');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

/** Same UTM convention for the standalone product-site "learn more" link. */
export function productSiteUrl(campaign: string): string {
  const url = new URL(AI_PRODUCT_SITE_URL);
  url.searchParams.set('utm_source', 'roihomesvc');
  url.searchParams.set('utm_medium', 'referral');
  url.searchParams.set('utm_campaign', campaign);
  return url.toString();
}

/**
 * Verbatim AVM compliance disclosure. Single source of truth — render it
 * through <AvmDisclosure /> rather than retyping it, so wording can't drift
 * between the homepage banner, the product page, and the deal-analysis
 * section.
 */
export const AVM_DISCLOSURE_TEXT =
  'Automated valuation (AVM) — not an appraisal, and not an opinion of value by a certified appraiser. ' +
  'No one has inspected this property for this screen. For a certified appraiser’s opinion of value on a ' +
  'Florida property, order a Certified Deal Analysis; outside Florida, an MLS-Supported Deal Analysis is ' +
  'available for your own decisions (not an appraisal).';

/**
 * Plan ladder for Appraisal Intelligence.
 *
 * Mirrors Salesmod's src/lib/investor/billing/plans.ts (PR #653, #467 —
 * confirmed live on origin/main 2026-10-28). Plan codes/lookup keys live only
 * in Salesmod; this is display data for the marketing site. Re-check against
 * plans.ts before publishing if pricing is ever touched there — Stripe price
 * creation (scripts/billing/create-investor-prices.ts) is a separate step
 * from the code merge and wasn't confirmed live as of this writing.
 */
export interface AppraisalIntelligencePlan {
  id: 'essential' | 'pro' | 'power';
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  /** Matches plans.ts's own monthly blurb — the same copy subscribers see in-app. */
  description: string;
  featured?: boolean;
}

export const APPRAISAL_INTELLIGENCE_PLANS: AppraisalIntelligencePlan[] = [
  {
    id: 'essential',
    name: 'Essential',
    monthlyPrice: 47,
    annualPrice: 397,
    description: '30 Scout checks and 6 full Deal Screens every month, your own buy box, and the newsletter.',
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 97,
    annualPrice: 997,
    description: '100 Scout checks and 20 full Deal Screens every month, your own buy box, and the newsletter.',
    featured: true,
  },
  {
    id: 'power',
    name: 'Power',
    monthlyPrice: 297,
    annualPrice: 1997,
    description: '350 Scout checks and 70 full Deal Screens every month, your own buy box, and the newsletter.',
  },
];

/**
 * One-time screen packs — the three `screen_*` plan codes in plans.ts.
 * No subscription, good for a year (ONE_TIME_CREDIT_DAYS).
 */
export interface ScreenPack {
  id: 'single' | 'pack5' | 'pack15';
  name: string;
  price: number;
  screens: number;
}

export const SCREEN_PACKS: ScreenPack[] = [
  { id: 'single', name: 'One Deal Screen', price: 39, screens: 1 },
  { id: 'pack5', name: '5 Deal Screens', price: 47, screens: 5 },
  { id: 'pack15', name: '15 Deal Screens', price: 97, screens: 15 },
];
