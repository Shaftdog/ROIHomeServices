/**
 * Salesmod marketing-lead forwarder.
 *
 * Every website lead/order (contact, quote, booking, $49 Deal Screen order) is
 * forwarded to the Salesmod CRM's marketing webhook, where it lands in
 * marketing_leads and feeds the marketing goal metrics (SEO Prospects, ...).
 *
 * DESIGN GUARANTEES (mirrors roi-agent.ts):
 *  - NEVER throws. A CRM forward must never break the user-facing form/payment
 *    flow — we log and return a structured result.
 *  - No-op when unconfigured (SALESMOD_WEBHOOK_URL unset) so builds/flows work
 *    before the env is wired.
 *  - Idempotent by `externalId` (Stripe PI id) or a server-computed key, so the
 *    fast order path and the durable Stripe webhook collapse to one lead row.
 *
 * REQUIRED ENV (Vercel project settings):
 *   SALESMOD_WEBHOOK_URL     e.g. https://salesmod.vercel.app/api/webhooks/marketing
 *   SALESMOD_WEBHOOK_SECRET  shared HMAC secret (must match Salesmod's
 *                            MARKETING_WEBHOOK_SECRET)
 */

import { createHmac } from 'crypto';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

const smLogger = createChildLogger({ context: LOG_CONTEXTS.API });

/** Client-side attribution captured by getAttributionData() (best-effort). */
export interface LeadAttribution {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  gclid?: string | null;
  page_referrer?: string | null;
  landing_page?: string | null;
  is_paid_traffic?: boolean | null;
  [k: string]: unknown;
}

/**
 * Flatten attribution into Stripe PaymentIntent metadata (string values, '' when
 * absent) so the durable payment_intent.succeeded webhook — which only sees
 * metadata — can still classify the lead's channel. Pair with
 * attributionFromStripeMetadata() on the read side.
 */
export function attributionToStripeMetadata(attr?: LeadAttribution | null): Record<string, string> {
  const a = attr || {};
  // Stripe rejects any metadata VALUE > 500 chars and throws the whole
  // paymentIntents.create — which would break the $49 checkout. Referrer/UTM
  // values are URL-controlled, so cap every value well under the limit.
  const cap = (v: unknown): string => (v == null ? '' : String(v).slice(0, 480));
  return {
    attr_utm_source: cap(a.utm_source),
    attr_utm_medium: cap(a.utm_medium),
    attr_utm_campaign: cap(a.utm_campaign),
    attr_utm_term: cap(a.utm_term),
    attr_utm_content: cap(a.utm_content),
    attr_gclid: cap(a.gclid),
    attr_referrer: cap(a.page_referrer),
    attr_landing: cap(a.landing_page),
    attr_is_paid: a.is_paid_traffic ? '1' : '',
  };
}

/** Rebuild a LeadAttribution from Stripe PaymentIntent metadata. */
export function attributionFromStripeMetadata(metadata: Record<string, string> = {}): LeadAttribution {
  return {
    utm_source: metadata.attr_utm_source || null,
    utm_medium: metadata.attr_utm_medium || null,
    utm_campaign: metadata.attr_utm_campaign || null,
    utm_term: metadata.attr_utm_term || null,
    utm_content: metadata.attr_utm_content || null,
    gclid: metadata.attr_gclid || null,
    page_referrer: metadata.attr_referrer || null,
    landing_page: metadata.attr_landing || null,
    is_paid_traffic: metadata.attr_is_paid === '1',
  };
}

export interface MarketingLeadInput {
  formSource: 'contact' | 'quote' | 'booking' | 'deal_screen_order';
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  /** Order value in cents (deal_screen_order). */
  amountCents?: number | null;
  /** Stripe PaymentIntent id or other natural id for idempotency. */
  externalId?: string | null;
  attribution?: LeadAttribution | null;
  /** Extra non-PII context stored on the lead's raw_payload. */
  context?: Record<string, unknown>;
}

export type ForwardResult =
  | { ok: true; status: number; attempts: number }
  | { ok: false; skipped: true; reason: 'not_configured' }
  | { ok: false; skipped?: false; attempts: number; error: string };

// First-party endpoint (not a cold-starting Fly service) — a short, bounded
// retry is enough to ride out a transient blip without holding the request.
const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 500;
const REQUEST_TIMEOUT_MS = 5_000;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function forwardMarketingLead(input: MarketingLeadInput): Promise<ForwardResult> {
  const url = process.env.SALESMOD_WEBHOOK_URL;
  const secret = process.env.SALESMOD_WEBHOOK_SECRET;

  if (!url) {
    smLogger.warn({ formSource: input.formSource }, 'Salesmod forward not configured (SALESMOD_WEBHOOK_URL unset) — skipping');
    return { ok: false, skipped: true, reason: 'not_configured' };
  }
  if (!secret) {
    smLogger.warn({ formSource: input.formSource }, 'Salesmod forward missing SALESMOD_WEBHOOK_SECRET — skipping');
    return { ok: false, skipped: true, reason: 'not_configured' };
  }

  const payload = {
    form_source: input.formSource,
    email: input.email ?? null,
    name: input.name ?? null,
    phone: input.phone ?? null,
    amount_cents: input.amountCents ?? null,
    external_id: input.externalId ?? null,
    attribution: input.attribution ?? {},
    occurred_at: new Date().toISOString(),
    context: input.context ?? {},
  };

  const body = JSON.stringify(payload);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-salesmod-timestamp': timestamp,
    'x-salesmod-signature': `sha256=${signature}`,
  };

  let lastError = 'unknown error';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) await sleep(BASE_DELAY_MS * 2 ** (attempt - 2));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, { method: 'POST', headers, body, signal: controller.signal });
      if (res.ok) {
        return { ok: true, status: res.status, attempts: attempt };
      }
      // 4xx (bad signature / payload) won't get better on retry — stop early.
      if (res.status >= 400 && res.status < 500) {
        let snippet = '';
        try { snippet = (await res.text()).slice(0, 300); } catch { /* ignore */ }
        lastError = `HTTP ${res.status}${snippet ? `: ${snippet}` : ''}`;
        smLogger.error({ formSource: input.formSource, status: res.status }, 'Salesmod forward rejected (4xx) — not retrying');
        return { ok: false, attempts: attempt, error: lastError };
      }
      lastError = `HTTP ${res.status}`;
    } catch (err) {
      lastError = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    } finally {
      clearTimeout(timeout);
    }
  }

  smLogger.error({ formSource: input.formSource, attempts: MAX_ATTEMPTS, error: lastError }, 'Salesmod forward FAILED after retries');
  return { ok: false, attempts: MAX_ATTEMPTS, error: lastError };
}
