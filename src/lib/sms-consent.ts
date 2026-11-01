/**
 * SMS program constants and consent text (Twilio A2P 10DLC).
 * Change SMS_CONSENT_VERSION whenever SMS_CONSENT_TEXT changes.
 */

export const SMS_CONSENT_VERSION = '2026-10-31';

export const SMS_CONSENT_TEXT =
  'Yes, ROI Home Services may text me at the number above about my appraisal order, appointment scheduling and order updates. Message frequency varies. Msg & data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase.';

export const SMS_BRAND = 'ROI Home Services';
export const SMS_PROGRAM_NAME = 'ROI Home Services appointment and order texts';
export const SMS_SENDING_NUMBERS = ['(407) 759-3611', '(321) 248-1640'] as const;
export const SMS_SUPPORT_PHONE = '(407) 720-9288';
export const SMS_SUPPORT_EMAIL = 'admin@myroihome.com';

export type SmsConsentSource = 'contact_form' | 'booking_form';

export interface SmsConsentRecord {
  granted: boolean;
  version: string;
  at: string;
  source: SmsConsentSource;
}
