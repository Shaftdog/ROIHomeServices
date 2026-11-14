// Run: npm run test:ai-page  (Node's built-in runner, like test:blueprint; needs Node >= 22.18).
// Covers the /appraisal-intelligence page: the whole-dollar price format, the one-time order price
// guard, the product names in the FAQ copy, and (by reading the source, like test:catalog) the markup
// a revert would change. No network, no React.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  APPRAISAL_INTELLIGENCE_PLANS,
  CERTIFIED_DEAL_ANALYSIS_SKU,
  SCREEN_PACKS,
  certifiedOrderPriceCents,
  formatWholeDollars,
} from '../appraisal-intelligence.ts';
import { isFloridaOnlySku } from '../blueprint-florida.ts';
import { appraisalIntelligenceFAQs } from '../../data/faqs.ts';

const src = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const read = (rel: string) => readFileSync(join(src, rel), 'utf8');

test('a price of 1,000 or more gets a thousands separator', () => {
  assert.equal(formatWholeDollars(1997), '1,997');
  assert.equal(formatWholeDollars(1000), '1,000');
  assert.equal(formatWholeDollars(12345), '12,345');
});

test('a price under 1,000 is printed exactly as the number', () => {
  for (const n of [0, 5, 39, 47, 97, 297, 397, 997, 999]) {
    assert.equal(formatWholeDollars(n), String(n));
  }
  for (let n = 0; n < 1000; n++) assert.equal(formatWholeDollars(n), String(n));
});

test('the plan and pack prices render as the page shows them', () => {
  const shown = (prices: number[]) => prices.map(formatWholeDollars);
  assert.deepEqual(shown(APPRAISAL_INTELLIGENCE_PLANS.map((p) => p.monthlyPrice)), ['47', '97', '297']);
  assert.deepEqual(shown(APPRAISAL_INTELLIGENCE_PLANS.map((p) => p.annualPrice)), ['397', '997', '1,997']);
  assert.deepEqual(shown(SCREEN_PACKS.map((p) => p.price)), ['39', '47', '97']);
});

test('the FAQ copy never calls a Deal Analysis by the bare name', () => {
  for (const { question, answer } of appraisalIntelligenceFAQs) {
    for (const text of [question, answer]) {
      for (const m of text.matchAll(/Deal Analys[ie]s/g)) {
        const before = text.slice(0, m.index);
        assert.match(before, /(Certified|MLS-Supported) $/, `bare "${m[0]}" in: ${text}`);
      }
    }
  }
});

// ---- the order price guard ---------------------------------------------------------------------------

const row = (over: Partial<{ sku: string; amountCents: number; billingInterval: string | null }> = {}) => ({
  sku: CERTIFIED_DEAL_ANALYSIS_SKU,
  amountCents: 29700,
  billingInterval: null,
  ...over,
});

test('a one-time row with a whole positive amount gives that amount', () => {
  assert.equal(certifiedOrderPriceCents([row()]), 29700);
  assert.equal(certifiedOrderPriceCents([{ sku: 'OTHER', amountCents: 100, billingInterval: null }, row()]), 29700);
});

test('no Certified Deal Analysis row gives no price', () => {
  assert.equal(certifiedOrderPriceCents([]), null);
  assert.equal(certifiedOrderPriceCents([row({ sku: 'OTHER' })]), null);
});

test('a zero, negative, fractional or non-finite amount gives no price', () => {
  for (const amountCents of [0, -1, -29700, 0.5, 29700.5, NaN, Infinity]) {
    assert.equal(certifiedOrderPriceCents([row({ amountCents })]), null, String(amountCents));
  }
});

test('a row with a billing interval gives no price', () => {
  assert.equal(certifiedOrderPriceCents([row({ billingInterval: 'month' })]), null);
  assert.equal(certifiedOrderPriceCents([row({ billingInterval: 'year' })]), null);
});

// ---- the source a revert would change ----------------------------------------------------------------

test('PlanLadder prints every price through formatWholeDollars', () => {
  const ladder = read('components/appraisal-intelligence/PlanLadder.tsx');
  for (const raw of ['plan.monthlyPrice', 'plan.annualPrice', 'pack.price']) {
    const escaped = raw.replace('.', '\\.');
    assert.doesNotMatch(ladder, new RegExp(`\\$\\{\\s*${escaped}\\s*\\}`), `raw \${${raw}}`);
    assert.match(ladder, new RegExp(`formatWholeDollars\\(\\s*${escaped}\\s*\\)`), `no formatWholeDollars(${raw})`);
  }
});

test('the page heads the paid section "Certified Deal Analysis" and keeps its anchor', () => {
  const page = read('app/appraisal-intelligence/page.tsx');
  assert.ok(page.includes('Certified Deal Analysis</h2>'), 'heading');
  assert.ok(!page.includes('Order a Deal Analysis'), 'old button label');
  assert.ok(page.includes('id="deal-analysis"'), 'anchor the home banner links to');
});

test('the Certified Deal Analysis SKU keeps the state selector', () => {
  assert.equal(CERTIFIED_DEAL_ANALYSIS_SKU, 'BAP-DEAL-ANALYZER');
  assert.equal(isFloridaOnlySku('BAP-DEAL-ANALYZER'), true);
});

test('the outside-Florida link campaign defaults to the Blueprint one and the page overrides it', () => {
  const button = read('components/blueprint/BlueprintBuyButton.tsx');
  assert.match(button, /outsideFloridaCampaign = 'blueprint-non-florida'/);
  assert.ok(button.includes('freeScreenUrl(outsideFloridaCampaign)'), 'the link uses the prop');
  assert.ok(!button.includes("freeScreenUrl('blueprint-non-florida')"), 'no hard-coded campaign');
  const page = read('app/appraisal-intelligence/page.tsx');
  assert.ok(page.includes('outsideFloridaCampaign="ai-page-certified-outside-fl"'), 'page passes its own campaign');
  assert.ok(!read('app/billionaire-blueprint/page.tsx').includes('outsideFloridaCampaign'), 'Blueprint page passes none');
});

test('the home banner names the product the way the page heads it', () => {
  const banner = read('data/services-banner.ts');
  assert.ok(banner.includes('ctaLabel: "See Certified Deal Analysis pricing"'));
  assert.ok(!banner.includes('"See Deal Analysis pricing"'));
});
