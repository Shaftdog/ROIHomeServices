import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withRouteLogging } from '@/lib/log-helpers';
import { createChildLogger, LOG_CONTEXTS } from '@/lib/logger';
import {
  CatalogUnavailableError,
  fetchBlueprintCatalog,
  formatUsd,
  type BlueprintProduct,
} from '@/lib/blueprint-catalog';

/**
 * POST /api/blueprint/chat — "ROI Assistant" for the Blueprint landing page.
 *
 * COMPLIANCE, not decoration:
 *  1. The assistant is explicitly NOT Rod Haugabrooks and must never present
 *     itself as a licensed appraiser. Rod is licensed; an automated agent
 *     speaking as him about value would create real licensure exposure.
 *  2. It must never give a property value, an ARV, a comp adjustment, or
 *     anything readable as an appraisal opinion. Two layers enforce this: a
 *     deterministic pre-check below (which answers with a booking offer and never
 *     reaches the model), and the system prompt.
 *  3. Scope: what each product is, what it costs, which one fits a situation, and
 *     how the process works — grounded in the live catalog so prices are real.
 *
 * UNCONFIGURED STATE: with no ANTHROPIC_API_KEY this route returns
 * `{ configured: false }` and the widget says plainly that it will connect the
 * visitor with Rod. It never serves a canned answer dressed up as a real one.
 */

const chatLogger = createChildLogger({ context: LOG_CONTEXTS.API });

const MODEL = process.env.BLUEPRINT_CHAT_MODEL || 'claude-sonnet-5';
const BOOKING_PATH = '/book';

const bodySchema = z
  .object({
    messages: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().min(1).max(2000),
        })
      )
      .min(1)
      .max(20),
  })
  .strict();

/**
 * Anything that reads as "tell me what this property is worth". Matching here
 * short-circuits the model entirely and returns a booking offer — a stated
 * policy response, not an attempt to answer the question.
 *
 * Deliberately over-inclusive: a false positive costs a visitor one extra click
 * to book a call, while a false negative lets an automated widget hand out
 * something that reads like a licensed appraiser's value opinion. The deflection
 * copy still offers product help, so the over-broad case degrades gracefully.
 */
const VALUATION_PATTERNS: RegExp[] = [
  /\barv\b/i,
  /\bafter[-\s]?repair\s+value\b/i,
  /\b(?:appraised|market|fair\s+market|as[-\s]?is|resale|retail)\s+value\b/i,
  // "worth" in any form — too close to a value opinion to route to a model.
  /\bworth\b/i,
  /\bwill\b[^?]*\bapprais/i,
  /\bapprais\w*\s+(?:at|for)\s+\$?\d/i,
  /\bvalue\s+(?:of\s+)?(?:my|this|that|the|a)\s+\w+/i,
  /\bhow much\b[^?]*\b(?:sell|rent|value|apprais|make|profit|spread)/i,
  /\bwhat\s+(?:should|would|could|can)\s+i\s+(?:offer|pay|list|bid|sell)\b/i,
  /\bcomps?\s+(?:for|on|near|around)\b/i,
  /\b(?:pull|run|send|give|share|find)\s+(?:me\s+)?(?:the\s+|some\s+)?comps?\b/i,
  /\bwhat\s+are\s+(?:the\s+)?comps?\b/i,
  /\badjustments?\b[^?]*\bcomps?\b/i,
  /\brent\s+(?:estimate|value|comps?)\b/i,
  /\bprice\s+per\s+(?:square\s*(?:foot|feet)|sq\.?\s*ft\.?|sf)\b/i,
];

export function looksLikeValuationRequest(text: string): boolean {
  return VALUATION_PATTERNS.some((pattern) => pattern.test(text));
}

const VALUATION_DEFLECTION =
  "I can't give a value, an ARV, or anything that reads as an appraisal opinion — that has to come from Rod, " +
  'a licensed appraiser, on an actual engagement. I can tell you which product covers the question you\'re asking ' +
  'and what it costs, or you can book a call with Rod directly.';

/** Catalog facts the model is allowed to state, so no price is ever invented. */
function buildCatalogContext(products: BlueprintProduct[]): string {
  return products
    .map((p) => {
      const webinar =
        p.webinarAmountCents !== null && p.webinarAmountCents !== p.amountCents
          ? ` (webinar price ${formatUsd(p.webinarAmountCents)})`
          : '';
      const step = p.step !== null ? ` [Step ${p.step}${p.phase ? `, ${p.phase}` : ''}]` : '';
      return `- ${p.name} (${p.sku}) — ${formatUsd(p.amountCents)}${webinar}${step}: ${p.description}`;
    })
    .join('\n');
}

function buildSystemPrompt(catalogContext: string): string {
  return [
    'You are the ROI Assistant, an automated assistant on the ROI Home Services website.',
    '',
    'IDENTITY RULES (absolute):',
    '- You are NOT Rod Haugabrooks and you are NOT a licensed appraiser. Never write in his voice, never sign as him, and never imply a human is typing.',
    '- If asked who you are, say you are an automated assistant and offer to connect the visitor with Rod.',
    '',
    'SCOPE RULES (absolute):',
    '- You may explain what each product is, what it costs, which product fits a described situation, and how the process works.',
    '- You must NEVER give a property value, a value range, an ARV, a rent estimate, a comparable-sales adjustment, a purchase-price recommendation, or any statement a reader could take as an appraisal opinion — even hypothetically, even with caveats, even if the visitor insists.',
    `- Any question heading toward valuation: say you cannot give a value and offer to book a call (${BOOKING_PATH}).`,
    '- Never invent a price, a statistic, a client count, a turnaround guarantee, or a results figure. Prices come only from the catalog below.',
    "- If you don't know something, say so and offer to book a call. Do not guess.",
    '',
    'Keep replies short — two or three sentences unless the visitor asks for detail.',
    '',
    'CATALOG (the only prices you may state):',
    catalogContext,
  ].join('\n');
}

async function handleBlueprintChat(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  let messages: z.infer<typeof bodySchema>['messages'];
  try {
    messages = bodySchema.parse(await req.json()).messages;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

  // Layer 1 — deterministic. Runs whether or not a model is configured.
  if (lastUserMessage && looksLikeValuationRequest(lastUserMessage.content)) {
    return NextResponse.json({
      configured: true,
      reply: VALUATION_DEFLECTION,
      deflected: true,
      bookingUrl: BOOKING_PATH,
    });
  }

  // No model wired up yet. Say so; do not fake an answer.
  if (!apiKey) {
    return NextResponse.json({ configured: false, bookingUrl: BOOKING_PATH });
  }

  let catalogContext: string;
  try {
    catalogContext = buildCatalogContext(await fetchBlueprintCatalog());
  } catch (error) {
    if (error instanceof CatalogUnavailableError) {
      // Without the catalog the assistant has no grounded prices, and guessing
      // one is exactly the failure mode we refuse.
      chatLogger.warn({ err: error }, 'Chat disabled — catalog unavailable');
      return NextResponse.json({ configured: false, bookingUrl: BOOKING_PATH });
    }
    throw error;
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 500,
        system: buildSystemPrompt(catalogContext),
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      chatLogger.error({ status: res.status }, 'Anthropic chat call failed');
      return NextResponse.json({ error: 'Assistant is unavailable' }, { status: 502 });
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const reply = (data.content ?? [])
      .filter((block) => block.type === 'text' && block.text)
      .map((block) => block.text)
      .join('\n')
      .trim();

    if (!reply) {
      return NextResponse.json({ error: 'Assistant is unavailable' }, { status: 502 });
    }

    return NextResponse.json({ configured: true, reply, bookingUrl: BOOKING_PATH });
  } catch (error) {
    chatLogger.error({ err: error }, 'Unexpected error in Blueprint chat');
    return NextResponse.json({ error: 'Assistant is unavailable' }, { status: 502 });
  }
}

export const POST = withRouteLogging(handleBlueprintChat);
