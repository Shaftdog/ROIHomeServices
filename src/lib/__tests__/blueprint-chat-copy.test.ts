// Run: npm run test:blueprint
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatFreeScreenUrl, VALUATION_DEFLECTION } from '../blueprint-chat-copy.ts';

test('deflection offers the AVM screen and limits certified appraisal to Florida', () => {
  assert.match(VALUATION_DEFLECTION, /free deal screen/);
  assert.match(VALUATION_DEFLECTION, /AVM/);
  assert.match(VALUATION_DEFLECTION, /not an appraisal/);
  assert.match(VALUATION_DEFLECTION, /Florida properties only/);
  assert.doesNotMatch(VALUATION_DEFLECTION, /has to come from Rod/);
  assert.doesNotMatch(VALUATION_DEFLECTION, /Realie|ATTOM|spread/i);
});

test('free screen URL is an absolute app URL', () => {
  const u = new URL(chatFreeScreenUrl());
  assert.equal(u.pathname, '/free-screen');
  assert.equal(u.searchParams.get('utm_campaign'), 'blueprint-chat');
});
