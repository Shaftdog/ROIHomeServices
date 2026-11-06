/**
 * Which Billionaire Appraisal Platform (BAP) SKUs can only be sold for Florida
 * properties — ONE place, shared by the server gate and the buyer UI.
 *
 * RULE (Rod, 2026-11-03): only USPAP products — the Certified Deal Analyzer, the
 * Blueprint ladder, and anything carrying Rod's Florida credential — are
 * Florida-specific. The Deal Screener and screens are NATIONWIDE and are never
 * gated or described as Florida-only.
 *
 * This is an ALLOW-LIST of the nationwide SKUs, not a list of Florida ones. A new
 * SKU added to the Salesmod catalog therefore defaults to Florida-only. That is
 * the safe failure: the cost of a wrong default is one extra question asked of a
 * buyer who could have skipped it; the cost of the opposite default is a stranger
 * paying for a credentialed product we cannot deliver and a manual refund. Adding
 * a SKU here is the explicit, reviewed step that opens it nationwide.
 *
 * Pure module (no imports) so client components can use it.
 */

/** Nationwide SKUs. Everything else in the BAP catalog is Florida-only. */
export const NATIONWIDE_SKUS: ReadonlySet<string> = new Set([
  // Automated deal screen (AVM). Nationwide by Rod's rule.
  'BAP-DEAL-SCOUT',
  // Software subscription (AI agent, dashboard, alerts). No property is attached
  // at checkout and no credentialed work product is delivered. JUDGEMENT CALL.
  'BAP-AI-AGENT',
  // Support/updates add-on. No property, no appraisal deliverable. JUDGEMENT CALL.
  'BAP-PRIORITY',
]);

export function isFloridaOnlySku(sku: string): boolean {
  return !NATIONWIDE_SKUS.has(sku);
}

export type FloridaGateResult =
  | { ok: true; propertyState: string | null }
  | { ok: false; status: 400 | 422; code: 'property_state_required' | 'florida_only'; error: string };

export const FLORIDA_ONLY_NOTICE = 'Florida properties only';

export const NON_FLORIDA_MESSAGE =
  'This product is only available for properties in Florida, so we cannot take an order for a property in another state. The free deal screen works for properties nationwide.';

/**
 * Server-side gate. `propertyState` is the buyer-stated two-letter state of the
 * property. Nationwide SKUs always pass (a supplied state is only recorded).
 */
export function checkFloridaGate(sku: string, propertyState: string | undefined): FloridaGateResult {
  const state = propertyState?.trim().toUpperCase() || null;
  if (!isFloridaOnlySku(sku)) return { ok: true, propertyState: state };
  if (!state) {
    return {
      ok: false,
      status: 400,
      code: 'property_state_required',
      error: 'Tell us which state the property is in. This product is for Florida properties only.',
    };
  }
  if (state !== 'FL') {
    return { ok: false, status: 422, code: 'florida_only', error: NON_FLORIDA_MESSAGE };
  }
  return { ok: true, propertyState: 'FL' };
}

/** US states + DC for the buyer's "where is the property" choice. */
export const US_STATES: ReadonlyArray<{ code: string; name: string }> = [
  ['AL', 'Alabama'], ['AK', 'Alaska'], ['AZ', 'Arizona'], ['AR', 'Arkansas'], ['CA', 'California'],
  ['CO', 'Colorado'], ['CT', 'Connecticut'], ['DE', 'Delaware'], ['DC', 'District of Columbia'],
  ['FL', 'Florida'], ['GA', 'Georgia'], ['HI', 'Hawaii'], ['ID', 'Idaho'], ['IL', 'Illinois'],
  ['IN', 'Indiana'], ['IA', 'Iowa'], ['KS', 'Kansas'], ['KY', 'Kentucky'], ['LA', 'Louisiana'],
  ['ME', 'Maine'], ['MD', 'Maryland'], ['MA', 'Massachusetts'], ['MI', 'Michigan'], ['MN', 'Minnesota'],
  ['MS', 'Mississippi'], ['MO', 'Missouri'], ['MT', 'Montana'], ['NE', 'Nebraska'], ['NV', 'Nevada'],
  ['NH', 'New Hampshire'], ['NJ', 'New Jersey'], ['NM', 'New Mexico'], ['NY', 'New York'],
  ['NC', 'North Carolina'], ['ND', 'North Dakota'], ['OH', 'Ohio'], ['OK', 'Oklahoma'], ['OR', 'Oregon'],
  ['PA', 'Pennsylvania'], ['RI', 'Rhode Island'], ['SC', 'South Carolina'], ['SD', 'South Dakota'],
  ['TN', 'Tennessee'], ['TX', 'Texas'], ['UT', 'Utah'], ['VT', 'Vermont'], ['VA', 'Virginia'],
  ['WA', 'Washington'], ['WV', 'West Virginia'], ['WI', 'Wisconsin'], ['WY', 'Wyoming'],
].map(([code, name]) => ({ code, name }));
