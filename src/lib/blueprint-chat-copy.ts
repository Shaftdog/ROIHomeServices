import { APP_URL, AVM_SHORT_LINE, freeScreenUrl } from './appraisal-intelligence.ts';

/** Campaign tag for the free-screen link served by the Blueprint chat. */
export const CHAT_FREE_SCREEN_CAMPAIGN = 'blueprint-chat';

/** Free deal screen URL returned to the widget as a structured field. */
export function chatFreeScreenUrl(): string {
  return freeScreenUrl(CHAT_FREE_SCREEN_CAMPAIGN);
}

/**
 * Reply when a visitor asks what a property is worth. Offers the free screen
 * (an AVM, not an appraisal) to anyone; a certified appraisal from Rod is
 * Florida-only. No URL in the text: the widget renders it from `freeScreenUrl`.
 */
export const VALUATION_DEFLECTION =
  "I can't give a value, an ARV, or anything that reads as an appraisal opinion. " +
  'What I can point you to is the free deal screen, which gives an automated valuation (AVM) estimate ' +
  'for properties nationwide — an estimate, not an appraisal. ' +
  'A certified appraisal from Rod is available for Florida properties only. ' +
  'I can also tell you which product covers your question and what it costs.';

/** Link label for the free screen, built from the shared AVM wording. */
export const FREE_SCREEN_LINK_LABEL = `Try the free deal screen (${AVM_SHORT_LINE.charAt(0).toLowerCase()}${AVM_SHORT_LINE.slice(1).replace(/\.$/, '')})`;

/** True when a model reply refers to the free screen, so the link is worth attaching. */
export function mentionsFreeScreen(reply: string): boolean {
  return /\bfree\s+(?:deal\s+)?screen/i.test(reply);
}

/** Accept only an https URL on the app origin; guards what the widget renders as a link. */
export function isAllowedScreenUrl(url: string | undefined): url is string {
  try {
    return !!url && new URL(url).origin === APP_URL;
  } catch {
    return false;
  }
}
