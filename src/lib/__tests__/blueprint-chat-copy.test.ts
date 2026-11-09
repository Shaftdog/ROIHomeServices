// Run: npm run test:blueprint
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { chatFreeScreenUrl, isAllowedScreenUrl, mentionsFreeScreen, VALUATION_DEFLECTION } from '../blueprint-chat-copy.ts';
import { APP_URL } from '../appraisal-intelligence.ts';

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

test('free screen URL origin is the app origin', () => {
  assert.equal(new URL(chatFreeScreenUrl()).origin, APP_URL);
});

test('isAllowedScreenUrl accepts the chat URL and rejects look-alikes', () => {
  assert.equal(isAllowedScreenUrl(chatFreeScreenUrl()), true);
  for (const bad of ['javascript:alert(1)', 'https://app.appraisal-intelligence.com.evil.com/', '/free-screen', undefined]) {
    assert.equal(isAllowedScreenUrl(bad), false, String(bad));
  }
});

test('mentionsFreeScreen gates the link on model replies', () => {
  assert.equal(mentionsFreeScreen('Try the free deal screen for an estimate.'), true);
  assert.equal(mentionsFreeScreen('The Blueprint costs $750.'), false);
});

test('link label reads naturally', async () => {
  const { FREE_SCREEN_LINK_LABEL } = await import('../blueprint-chat-copy.ts');
  assert.equal(FREE_SCREEN_LINK_LABEL, 'Try the free deal screen (an automated valuation (AVM), not an appraisal)');
});
