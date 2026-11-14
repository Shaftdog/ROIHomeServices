// Run: npm run test:ai-page  (Node's built-in runner, like test:blueprint; needs Node >= 22.18).
// Covers the pure parts of the /appraisal-intelligence page: the whole-dollar price format and the
// product names in the FAQ copy. No network, no React.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { APPRAISAL_INTELLIGENCE_PLANS, SCREEN_PACKS, formatWholeDollars } from '../appraisal-intelligence.ts';
import { appraisalIntelligenceFAQs } from '../../data/faqs.ts';

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
