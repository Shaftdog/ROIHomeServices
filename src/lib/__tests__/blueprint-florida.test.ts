// Run: npm run test:blueprint  (Node's built-in runner; no test framework is
// installed in this repo, so this covers the pure gate + request schema only).
// Needs Node >= 22.18 (built-in TypeScript type stripping; verified on 24.19). Not
// recorded in package.json "engines" because Vercel reads that to pick the build Node.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  APPRAISER_PACKAGE_LINE_ITEM, checkFloridaGate, isFloridaOnlySku, lineItemName, NATIONWIDE_SKUS,
  propertyAddressLabel,
} from '../blueprint-florida.ts';
import { blueprintCheckoutBodySchema as schema } from '../blueprint-checkout-schema.ts';

const FL_ONLY = [
  'BAP-BLUEPRINT', 'BAP-HALFWAY', 'BAP-FULL-SENS', 'BAP-REVIEW-ROV',
  'BAP-DEAL-ANALYZER', 'BAP-PKG-BLUEPRINT', 'BAP-PKG-AI', 'BAP-PKG-PROTECTION',
];

test('Florida-only SKUs accept FL (any case/whitespace)', () => {
  for (const sku of FL_ONLY) {
    assert.deepEqual(checkFloridaGate(sku, 'FL'), { ok: true, propertyState: 'FL' });
  }
  assert.equal(checkFloridaGate('BAP-BLUEPRINT', ' fl ').ok, true);
});

test('Florida-only SKUs refuse non-FL with 422', () => {
  for (const sku of FL_ONLY) {
    const r = checkFloridaGate(sku, 'GA');
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.status, 422);
      assert.equal(r.code, 'florida_only');
    }
  }
});

test('Florida-only SKUs refuse a missing or blank state with 400', () => {
  for (const state of [undefined, '', '  ']) {
    const r = checkFloridaGate('BAP-BLUEPRINT', state);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.status, 400);
      assert.equal(r.code, 'property_state_required');
    }
  }
});

test('nationwide SKUs are never gated', () => {
  for (const sku of NATIONWIDE_SKUS) {
    assert.equal(isFloridaOnlySku(sku), false);
    assert.equal(checkFloridaGate(sku, undefined).ok, true);
    assert.equal(checkFloridaGate(sku, 'TX').ok, true);
  }
  assert.ok(NATIONWIDE_SKUS.has('BAP-DEAL-SCOUT'));
  assert.ok(NATIONWIDE_SKUS.has('BAP-PACKAGE'));
  assert.equal(checkFloridaGate('BAP-PACKAGE', 'GA').ok, true);
});

test('unknown / new SKUs default to Florida-only', () => {
  assert.equal(isFloridaOnlySku('BAP-SOMETHING-NEW'), true);
  assert.equal(checkFloridaGate('BAP-SOMETHING-NEW', 'GA').ok, false);
});

test('schema stays strict: smuggled amount/price/currency/discount are rejected', () => {
  for (const extra of [{ amount: 1 }, { price: 1 }, { amountCents: 1 }, { currency: 'usd' }, { coupon: 'X' }]) {
    assert.equal(schema.safeParse({ sku: 'BAP-BLUEPRINT', propertyState: 'FL', ...extra }).success, false);
  }
});

test('schema accepts a valid body and rejects a malformed state', () => {
  assert.equal(schema.safeParse({ sku: 'BAP-BLUEPRINT', propertyState: 'FL' }).success, true);
  assert.equal(schema.safeParse({ sku: 'BAP-DEAL-SCOUT', interval: 'month' }).success, true);
  assert.equal(schema.safeParse({ sku: 'BAP-BLUEPRINT', propertyState: 'Florida' }).success, false);
  assert.equal(schema.safeParse({ propertyState: 'FL' }).success, false);
});

test('BAP-PACKAGE uses the fixed line item; other SKUs keep the catalog name', () => {
  assert.equal(lineItemName('BAP-PACKAGE', 'Appraiser Package'), APPRAISER_PACKAGE_LINE_ITEM);
  assert.equal(
    APPRAISER_PACKAGE_LINE_ITEM,
    "Appraiser Package — comps and market data organized for your lender's appraiser"
  );
  assert.equal(lineItemName('BAP-BLUEPRINT', 'Desktop Blueprint'), 'Desktop Blueprint');
});

test('address label says Florida only for Florida-only SKUs', () => {
  assert.equal(propertyAddressLabel('BAP-BLUEPRINT'), 'Florida property address');
  assert.equal(propertyAddressLabel('BAP-PKG-AI'), 'Florida property address');
  assert.equal(propertyAddressLabel('BAP-PACKAGE'), 'Property address');
});

test('only the Deal Analyzer refusal points to the MLS-Supported analysis, without Certified/appraisal claims', () => {
  const da = checkFloridaGate('BAP-DEAL-ANALYZER', 'GA');
  const bp = checkFloridaGate('BAP-BLUEPRINT', 'GA');
  assert.ok(!da.ok && !bp.ok);
  if (!da.ok && !bp.ok) {
    assert.match(da.error, /MLS-Supported Deal Analysis/);
    assert.match(da.error, /free screen/);
    assert.doesNotMatch(da.error, /Certified/);
    assert.doesNotMatch(bp.error, /MLS-Supported/);
  }
});
