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
 * the safe failure: a wrong default means a non-Florida buyer is refused a
 * product they could have bought (a lost sale we can fix by adding the SKU here);
 * the opposite default means a stranger pays for a credentialed product we cannot
 * deliver and we owe a manual refund. Adding a SKU here is the explicit, reviewed
 * step that opens it nationwide. Mirrors Salesmod's NON_FL_ALLOWED_SKUS
 * (src/lib/bap/status.ts) — keep the two in step.
 *
 * Pure module (no imports) so client components can use it.
 */

/** Nationwide SKUs. Everything else in the BAP catalog is Florida-only. */
export const NATIONWIDE_SKUS: ReadonlySet<string> = new Set([
  // Automated deal screen (AVM). Nationwide by Rod's rule.
  'BAP-DEAL-SCOUT',
  // Appraiser Package: nationwide per Rod 2026-10-25. Sold under a fixed line
  // item name (see lineItemName) because Salesmod never uses the catalog name.
  'BAP-PACKAGE',
  // Software subscription (AI agent, dashboard, alerts). No property is attached
  // at checkout and no credentialed work product is delivered. JUDGEMENT CALL.
  'BAP-AI-AGENT',
  // Support/updates add-on. No property, no appraisal deliverable. JUDGEMENT CALL.
  'BAP-PRIORITY',
]);

/*
 * BAP-DEAL-ANALYZER is gated on THIS site deliberately. Its catalog name is
 * "Certified Deal Analyzer" and the site has no MLS-Supported variant logic, so a
 * non-Florida buyer here would be sold something named Certified. Outside Florida
 * the MLS-Supported Deal Analysis is reached through the investor portal instead
 * (see DEAL_ANALYZER_OUTSIDE_FL_NOTE).
 */

/** Fixed Stripe line item for BAP-PACKAGE (not the catalog name). */
export const APPRAISER_PACKAGE_LINE_ITEM =
  "Appraiser Package — comps and market data organized for your lender's appraiser";

/** Line-item / display name for a SKU: fixed text for BAP-PACKAGE, catalog name otherwise. */
export function lineItemName(sku: string, catalogName: string): string {
  return sku === 'BAP-PACKAGE' ? APPRAISER_PACKAGE_LINE_ITEM : catalogName;
}

/** Stripe custom-field label. The field KEY (`propertyaddress`) never changes. */
export function propertyAddressLabel(sku: string): string {
  return isFloridaOnlySku(sku) ? 'Florida property address' : 'Property address';
}

/** Extra sentence for the Deal Analyzer refusal only. Never says Certified/appraisal. */
export const DEAL_ANALYZER_OUTSIDE_FL_NOTE =
  'Outside Florida, an MLS-Supported Deal Analysis is available for your own decisions (not an appraisal, not certified): start with a free screen in the investor portal.';

export function nonFloridaMessage(sku: string): string {
  return sku === 'BAP-DEAL-ANALYZER'
    ? `${NON_FLORIDA_MESSAGE} ${DEAL_ANALYZER_OUTSIDE_FL_NOTE}`
    : NON_FLORIDA_MESSAGE;
}

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
    return { ok: false, status: 422, code: 'florida_only', error: nonFloridaMessage(sku) };
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
