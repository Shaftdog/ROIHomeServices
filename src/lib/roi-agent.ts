/**
 * ROI Appraisal Agent trigger (SAL-20).
 *
 * When a $49 Deal Screen payment succeeds we hand the order off to the ROI
 * Appraisal Agent (a Python service deployed on Fly.io) so it can generate the
 * appraiser-grade Deal Screen. The agent is fronted by Fly.io, which scales to
 * zero — the FIRST request after idle pays a cold-start penalty (the machine
 * has to boot), so a naive single POST will frequently time out / 502. We ride
 * that out with exponential backoff retries.
 *
 * DESIGN GUARANTEES
 *  - NEVER throws. The charge already cleared and the admin email already fired
 *    by the time we get here, so a trigger failure must never break the
 *    payment/confirmation flow. We log a structured error and return a result.
 *  - Idempotent by `idempotencyKey` (the Stripe PaymentIntent id). Both the
 *    durable webhook AND the immediate order-capture endpoint call this, so the
 *    agent must dedupe on this key to avoid double-generating a screen.
 *  - Tolerant of an unconfigured env: if ROI_AGENT_URL is unset we log
 *    "ROI agent trigger not configured" and return without erroring, so the
 *    build/flow works before the env is wired in production.
 *
 * REQUIRED ENVIRONMENT VARIABLES (document in .env / Vercel project settings):
 *   ROI_AGENT_URL     Base URL of the ROI agent intake endpoint on Fly.io,
 *                     e.g. https://roi-appraisal-agent.fly.dev/api/intake
 *   ROI_AGENT_SECRET  Shared secret sent as `Authorization: Bearer <secret>`
 *                     AND `x-roi-agent-secret: <secret>` so the agent can
 *                     authenticate the caller. Optional but strongly recommended.
 */

import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';

const roiLogger = createChildLogger({ context: LOG_CONTEXTS.PAYMENT });

/** Payload POSTed to the ROI agent to enqueue a Deal Screen generation job. */
export interface TriggerDealScreenPayload {
  event: 'NEW_ORDER';
  source: 'deal_screen';
  /** Stripe PaymentIntent id — the dedupe key for idempotent triggering. */
  idempotencyKey: string;
  customer: {
    email: string;
  };
  deal: {
    address?: string;
    contract?: string;
    arv?: string;
  };
}

/** Caller-facing arguments. `event`/`source` are filled in for you. */
export interface TriggerDealScreenInput {
  /** Stripe PaymentIntent id (idempotency / dedupe key). */
  idempotencyKey: string;
  customer: {
    email: string;
  };
  deal: {
    address?: string;
    contract?: string;
    arv?: string;
  };
}

export type TriggerDealScreenResult =
  /** Agent accepted the job (2xx). */
  | { ok: true; status: number; attempts: number }
  /** Trigger intentionally skipped because ROI_AGENT_URL is not configured. */
  | { ok: false; skipped: true; reason: 'not_configured' }
  /** All retries exhausted / non-2xx / network failure. Logged, not thrown. */
  | { ok: false; skipped?: false; attempts: number; error: string };

// Retry tuning: ~5 attempts with growing delays (1s, 2s, 4s, 8s, 16s) between
// them. This window comfortably outlasts a Fly.io machine cold start.
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 1000;
// Per-attempt request timeout. A booting Fly machine can hold the socket open;
// we don't want a single attempt to hang the whole route.
const REQUEST_TIMEOUT_MS = 20_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Exponential backoff delay (ms) BEFORE the given 1-based attempt number. */
function backoffDelayMs(attempt: number): number {
  // attempt 1 -> no wait (handled by caller); waits precede attempts 2..N.
  return BASE_DELAY_MS * 2 ** (attempt - 2);
}

/**
 * POST a NEW_ORDER to the ROI Appraisal Agent with cold-start-tolerant retries.
 *
 * Resolves with a structured result and NEVER throws — the payment has already
 * been captured, so a downstream trigger failure must not surface to the buyer.
 */
export async function triggerDealScreenJob(
  input: TriggerDealScreenInput
): Promise<TriggerDealScreenResult> {
  const url = process.env.ROI_AGENT_URL;
  const secret = process.env.ROI_AGENT_SECRET;

  // Unconfigured env: no-op so the build/flow works before the env is wired.
  if (!url) {
    roiLogger.warn(
      { idempotencyKey: input.idempotencyKey },
      'ROI agent trigger not configured (ROI_AGENT_URL unset) — skipping'
    );
    return { ok: false, skipped: true, reason: 'not_configured' };
  }

  const payload: TriggerDealScreenPayload = {
    event: 'NEW_ORDER',
    source: 'deal_screen',
    idempotencyKey: input.idempotencyKey,
    customer: { email: input.customer.email },
    deal: {
      address: input.deal.address,
      contract: input.deal.contract,
      arv: input.deal.arv,
    },
  };

  const body = JSON.stringify(payload);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    // Idempotency advertised both ways: a header (for proxies / generic dedupe)
    // and inside the body (idempotencyKey) for the agent itself.
    'Idempotency-Key': input.idempotencyKey,
  };
  if (secret) {
    headers['Authorization'] = `Bearer ${secret}`;
    headers['x-roi-agent-secret'] = secret;
  }

  let lastError = 'unknown error';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    if (attempt > 1) {
      const delay = backoffDelayMs(attempt);
      roiLogger.info(
        { idempotencyKey: input.idempotencyKey, attempt, delayMs: delay },
        'ROI agent trigger — backing off before retry (cold-start tolerance)'
      );
      await sleep(delay);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body,
        signal: controller.signal,
      });

      if (res.ok) {
        roiLogger.info(
          {
            idempotencyKey: input.idempotencyKey,
            attempt,
            status: res.status,
          },
          'ROI agent Deal Screen job enqueued'
        );
        return { ok: true, status: res.status, attempts: attempt };
      }

      // Non-2xx: capture a short body snippet for diagnostics and retry.
      let snippet = '';
      try {
        snippet = (await res.text()).slice(0, 500);
      } catch {
        // ignore body read failures
      }
      lastError = `HTTP ${res.status}${snippet ? `: ${snippet}` : ''}`;
      roiLogger.warn(
        {
          idempotencyKey: input.idempotencyKey,
          attempt,
          status: res.status,
        },
        'ROI agent trigger attempt returned non-2xx'
      );
    } catch (err) {
      lastError =
        err instanceof Error ? `${err.name}: ${err.message}` : String(err);
      roiLogger.warn(
        { idempotencyKey: input.idempotencyKey, attempt, err },
        'ROI agent trigger attempt failed (network/timeout) — will retry if attempts remain'
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  // All attempts exhausted. Log a structured error and return — DO NOT throw.
  // The order is never lost: the charge cleared and the admin email already
  // fired; this only delays automated screen generation, which is recoverable.
  roiLogger.error(
    {
      idempotencyKey: input.idempotencyKey,
      attempts: MAX_ATTEMPTS,
      error: lastError,
    },
    'ROI agent trigger FAILED after all retries — manual follow-up required'
  );

  return { ok: false, attempts: MAX_ATTEMPTS, error: lastError };
}
