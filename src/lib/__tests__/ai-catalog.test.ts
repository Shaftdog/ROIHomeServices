// Run: npm run test:catalog  (Node's built-in runner, like test:blueprint; needs Node >= 22.18).
// Covers src/lib/ai-catalog.ts without the network: `fetch` is stubbed in every test.
//
// Fixtures:
//   fixtures/ai-catalog-before-launch.json  the route's live body (launch: false), unchanged.
//   the launch-shaped body is built below with PLACEHOLDER names and numbers on purpose: this repo is
//   public, and the tests need that body's shape, not its words.
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// The logger reads LOG_LEVEL when it loads, so set it before the module under test is imported.
process.env.LOG_LEVEL = 'silent';
const {
  AI_CATALOG_CACHE_TAG, AI_CATALOG_DEFAULT_URL, AI_CATALOG_NAME_KEYS, AiCatalogUnavailableError, fetchAiCatalog,
  parseAiCatalog,
} = await import('../ai-catalog.ts');

const here = dirname(fileURLToPath(import.meta.url));
type Json = Record<string, any>;
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const BEFORE: Json = JSON.parse(readFileSync(join(here, 'fixtures', 'ai-catalog-before-launch.json'), 'utf8'));

/** A launch-shaped body: member plans load `credits`, the newsletter grants `analyses`, plus a rate card. */
function launchBody(): Json {
  const names = Object.fromEntries(AI_CATALOG_NAME_KEYS.map((k) => [k, `placeholder ${k}`]));
  const plan = (code: string, member: boolean, interval: 'month' | 'year', extra: Json) =>
    ({ code, name: `Plan ${code}`, price: 10, interval, member, newsletter: true, ...extra });
  return {
    version: 'placeholder-version',
    launch: true,
    names,
    plans: [
      plan('m1', true, 'month', { credits: 11 }),
      plan('m2', true, 'year', { credits: 22 }),
      plan('n1', false, 'month', { analyses: 3 }),
    ],
    packs: [{ code: 'p1', name: 'Placeholder pack', price: 5, analyses: 2 }],
    extraCredits: null,
    rateCard: { version: 'placeholder.v0', actions: [{ action: 'placeholder-action', credits: 7 }] },
    perDeal: clone(BEFORE.perDeal),
    disclosure: 'Placeholder disclosure.',
  };
}

const realFetch = globalThis.fetch;
const realTimeout = AbortSignal.timeout;
afterEach(() => {
  globalThis.fetch = realFetch;
  AbortSignal.timeout = realTimeout;
  delete process.env.AI_CATALOG_URL;
});

interface Seen { url: unknown; init: Json | undefined }
/** Replace fetch with a stub that answers `respond` and records how it was called. */
function stubFetch(respond: () => Response | Promise<Response>): Seen[] {
  const calls: Seen[] = [];
  globalThis.fetch = (async (url: unknown, init?: Json) => {
    calls.push({ url, init });
    return respond();
  }) as typeof fetch;
  return calls;
}
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

const unavailable = (re?: RegExp) => ({ name: 'AiCatalogUnavailableError', ...(re ? { message: re } : {}) });

/** Run one mutation on a fresh copy of a body and expect the validator to refuse it. */
function refuses(label: string, base: () => Json, mutate: (b: Json) => void, why?: RegExp) {
  test(`refuses: ${label}`, () => {
    const b = base();
    mutate(b);
    assert.throws(() => parseAiCatalog(b), unavailable(why));
  });
}

// ---- both states parse ------------------------------------------------------------------------------

test('the live before-launch body parses; rateCard and extraCredits are null', () => {
  const c = parseAiCatalog(BEFORE);
  assert.equal(c.launch, false);
  assert.equal(c.rateCard, null);
  assert.equal(c.extraCredits, null);
  assert.equal(c.version, BEFORE.version);
  assert.equal(c.disclosure, BEFORE.disclosure);
  assert.deepEqual(Object.keys(c.names).sort(), [...AI_CATALOG_NAME_KEYS].sort());
  assert.equal(c.plans.length, BEFORE.plans.length);
  assert.equal(c.packs.length, BEFORE.packs.length);
  assert.equal(c.perDeal.length, BEFORE.perDeal.length);
  if (c.launch === false) {
    const essential = c.plans.find((p) => p.code === 'member_monthly');
    assert.deepEqual(
      [essential?.price, essential?.analyses, essential?.checks, essential?.member],
      [47, 6, 30, true],
    );
    assert.equal(c.plans.find((p) => p.code === 'newsletter_annual')?.analyses, 15);
  }
});

test('a before-launch body that carries launch-only keys still returns null for them', () => {
  const b = clone(BEFORE);
  b.rateCard = { version: 'x', actions: [{ action: 'a', credits: 1 }] };
  b.extraCredits = { anything: true };
  const c = parseAiCatalog(b);
  assert.equal(c.rateCard, null);
  assert.equal(c.extraCredits, null);
});

test('a launch-shaped body parses: member plans carry credits, the newsletter carries analyses', () => {
  const c = parseAiCatalog(launchBody());
  assert.equal(c.launch, true);
  assert.equal(c.extraCredits, null);
  assert.deepEqual(c.rateCard, { version: 'placeholder.v0', actions: [{ action: 'placeholder-action', credits: 7 }] });
  if (c.launch === true) {
    const [m1, m2, n1] = c.plans;
    assert.equal(m1.member === true && m1.credits, 11);
    assert.equal(m2.member === true && m2.credits, 22);
    assert.equal(n1.member === false && n1.analyses, 3);
    assert.ok(!('analyses' in m1) && !('blurb' in m1));
  }
});

test('a launch-shaped body without rateCard or extraCredits returns null for both', () => {
  const b = launchBody();
  delete b.rateCard;
  delete b.extraCredits;
  const c = parseAiCatalog(b);
  assert.equal(c.rateCard, null);
  assert.equal(c.extraCredits, null);
});

test('a launch-shaped body with rateCard: null is accepted and returns null (null means not available)', () => {
  const b = launchBody();
  b.rateCard = null;
  const c = parseAiCatalog(b);
  assert.equal(c.launch, true);
  assert.equal(c.rateCard, null);
});

test('a non-null extraCredits is ignored (returned as null), not a failure', () => {
  const b = launchBody();
  b.extraCredits = [{ code: 'x', price: 5 }];
  assert.equal(parseAiCatalog(b).extraCredits, null);
});

test('unknown extra keys are accepted and not passed through', () => {
  for (const base of [() => clone(BEFORE), launchBody]) {
    const b = base();
    b.somethingNew = { a: 1 };
    b.names.aNewName = 'x';
    b.plans[0].aNewPlanField = true;
    b.packs[0].aNewPackField = 1;
    b.perDeal[0].aNewProductField = 'x';
    const c = parseAiCatalog(b);
    assert.ok(!('somethingNew' in c));
    assert.ok(!('aNewName' in c.names));
    assert.ok(!('aNewPlanField' in c.plans[0]));
    assert.ok(!('aNewPackField' in c.packs[0]));
    assert.ok(!('aNewProductField' in c.perDeal[0]));
  }
});

// ---- validation refuses -----------------------------------------------------------------------------

test('refuses: a body that is not an object', () => {
  for (const v of [null, 'text', 42, [], undefined]) assert.throws(() => parseAiCatalog(v), unavailable());
});
test('refuses: launch missing or not a boolean', () => {
  const b = clone(BEFORE);
  delete b.launch;
  assert.throws(() => parseAiCatalog(b), unavailable(/launch/));
  b.launch = 'false';
  assert.throws(() => parseAiCatalog(b), unavailable(/launch/));
});

for (const [label, base] of [['before launch', () => clone(BEFORE)], ['after launch', launchBody]] as const) {
  for (const key of AI_CATALOG_NAME_KEYS) {
    refuses(`names.${key} missing (${label})`, base, (b) => { delete b.names[key]; }, new RegExp(`names\\.${key}`));
  }
  refuses(`names.checker blank (${label})`, base, (b) => { b.names.checker = '   '; }, /names\.checker/);
  refuses(`names not an object (${label})`, base, (b) => { b.names = []; }, /names/);
  refuses(`plans not an array (${label})`, base, (b) => { b.plans = { 0: {} }; }, /plans/);
  refuses(`plans empty (${label})`, base, (b) => { b.plans = []; }, /plans/);
  refuses(`plan price 0 (${label})`, base, (b) => { b.plans[0].price = 0; }, /plans\[0\]\.price/);
  refuses(`plan price negative (${label})`, base, (b) => { b.plans[1].price = -1; }, /plans\[1\]\.price/);
  refuses(`plan price a string (${label})`, base, (b) => { b.plans[0].price = '47'; }, /price/);
  refuses(`plan price NaN-like null (${label})`, base, (b) => { b.plans[0].price = null; }, /price/);
  refuses(`plan interval unknown (${label})`, base, (b) => { b.plans[0].interval = 'week'; }, /interval/);
  refuses(`plan member missing (${label})`, base, (b) => { delete b.plans[0].member; }, /member/);
  refuses(`plan code missing (${label})`, base, (b) => { delete b.plans[0].code; }, /plans\[0\]\.code/);
  refuses(`plan code blank (${label})`, base, (b) => { b.plans[0].code = '  '; }, /plans\[0\]\.code/);
  refuses(`plan name missing (${label})`, base, (b) => { delete b.plans[0].name; }, /plans\[0\]\.name/);
  refuses(`plan name blank (${label})`, base, (b) => { b.plans[0].name = ''; }, /plans\[0\]\.name/);
  refuses(`plan newsletter missing (${label})`, base, (b) => { delete b.plans[0].newsletter; }, /plans\[0\]\.newsletter/);
  refuses(`duplicate plan code (${label})`, base, (b) => { b.plans[1].code = b.plans[0].code; }, /appears twice/);
  refuses(`packs not an array (${label})`, base, (b) => { b.packs = 'x'; }, /packs/);
  refuses(`pack price 0 (${label})`, base, (b) => { b.packs[0].price = 0; }, /packs\[0\]\.price/);
  refuses(`pack price negative (${label})`, base, (b) => { b.packs[0].price = -39; }, /packs\[0\]\.price/);
  refuses(`pack analyses 0 (${label})`, base, (b) => { b.packs[0].analyses = 0; }, /packs\[0\]\.analyses/);
  refuses(`pack analyses fractional (${label})`, base, (b) => { b.packs[0].analyses = 2.5; }, /packs\[0\]\.analyses/);
  refuses(`pack code missing (${label})`, base, (b) => { delete b.packs[0].code; }, /packs\[0\]\.code/);
  refuses(`pack name missing (${label})`, base, (b) => { delete b.packs[0].name; }, /packs\[0\]\.name/);
  refuses(`duplicate pack code (${label})`, base, (b) => { b.packs[1] = { ...b.packs[0] }; }, /appears twice/);
  refuses(`perDeal not an array (${label})`, base, (b) => { b.perDeal = null; }, /perDeal/);
  refuses(`perDeal empty (${label})`, base, (b) => { b.perDeal = []; }, /perDeal/);
  refuses(`perDeal price 0 (${label})`, base, (b) => { b.perDeal[0].price = 0; }, /perDeal\[0\]\.price/);
  refuses(`perDeal price negative (${label})`, base, (b) => { b.perDeal[2].price = -750; }, /perDeal\[2\]\.price/);
  refuses(`perDeal annualPrice 0 (${label})`, base, (b) => { b.perDeal[0].annualPrice = 0; }, /annualPrice/);
  refuses(`perDeal sku missing (${label})`, base, (b) => { delete b.perDeal[0].sku; }, /sku/);
  refuses(`perDeal name missing (${label})`, base, (b) => { delete b.perDeal[0].name; }, /perDeal\[0\]\.name/);
  refuses(`perDeal name blank (${label})`, base, (b) => { b.perDeal[0].name = ' '; }, /perDeal\[0\]\.name/);
  refuses(`perDeal description not a string (${label})`, base, (b) => { b.perDeal[0].description = 42; }, /perDeal\[0\]\.description/);
  refuses(`perDeal group not a string (${label})`, base, (b) => { b.perDeal[0].group = 7; }, /perDeal\[0\]\.group/);
  refuses(`perDeal phase not a string (${label})`, base, (b) => { b.perDeal[0].phase = 7; }, /perDeal\[0\]\.phase/);
  refuses(`perDeal step a string (${label})`, base, (b) => { b.perDeal[0].step = '3'; }, /perDeal\[0\]\.step/);
  refuses(`perDeal annualPrice a string (${label})`, base, (b) => { b.perDeal[0].annualPrice = '99'; }, /perDeal\[0\]\.annualPrice/);
  refuses(`perDeal annualPrice negative (${label})`, base, (b) => { b.perDeal[0].annualPrice = -99; }, /perDeal\[0\]\.annualPrice/);
  refuses(`perDeal flagship not a boolean (${label})`, base, (b) => { b.perDeal[0].flagship = 'yes'; }, /flagship/);
  refuses(`perDeal billingInterval unknown (${label})`, base, (b) => { b.perDeal[0].billingInterval = 'year'; }, /billingInterval/);
  refuses(`duplicate perDeal sku (${label})`, base, (b) => { b.perDeal[1].sku = b.perDeal[0].sku; }, /appears twice/);
  refuses(`disclosure missing (${label})`, base, (b) => { delete b.disclosure; }, /disclosure/);
  refuses(`disclosure blank (${label})`, base, (b) => { b.disclosure = ' '; }, /disclosure/);
  refuses(`version missing (${label})`, base, (b) => { delete b.version; }, /version/);
  refuses(`version blank (${label})`, base, (b) => { b.version = '  '; }, /version/);
}

refuses('before launch: plan blurb missing', () => clone(BEFORE), (b) => { delete b.plans[0].blurb; }, /blurb/);
refuses('before launch: plan analyses missing', () => clone(BEFORE), (b) => { delete b.plans[0].analyses; }, /analyses/);
refuses('before launch: plan checks negative', () => clone(BEFORE), (b) => { b.plans[0].checks = -1; }, /checks/);
refuses('before launch: plan checks missing', () => clone(BEFORE), (b) => { delete b.plans[0].checks; }, /plans\[0\]\.checks/);
refuses('after launch: member plan without credits', launchBody, (b) => { delete b.plans[0].credits; }, /plans\[0\]\.credits/);
refuses('after launch: member plan with 0 credits', launchBody, (b) => { b.plans[0].credits = 0; }, /plans\[0\]\.credits/);
refuses('after launch: member plan with fractional credits', launchBody, (b) => { b.plans[0].credits = 1.5; }, /credits/);
refuses('after launch: non-member plan without analyses', launchBody, (b) => { delete b.plans[2].analyses; }, /plans\[2\]\.analyses/);
refuses('after launch: non-member plan with negative analyses', launchBody, (b) => { b.plans[2].analyses = -1; }, /plans\[2\]\.analyses/);
refuses('after launch: non-member plan with fractional analyses', launchBody, (b) => { b.plans[2].analyses = 1.5; }, /plans\[2\]\.analyses/);
refuses('after launch: rateCard not an object', launchBody, (b) => { b.rateCard = 'rates'; }, /at rateCard: expected an object/);
refuses('after launch: rateCard an array', launchBody, (b) => { b.rateCard = []; }, /at rateCard: expected an object/);
refuses('after launch: rateCard action blank', launchBody, (b) => { b.rateCard.actions[0].action = '  '; }, /rateCard\.actions\[0\]\.action/);
refuses('after launch: rateCard credits 0', launchBody, (b) => { b.rateCard.actions[0].credits = 0; }, /rateCard\.actions\[0\]\.credits/);
refuses('after launch: rateCard actions not an array', launchBody, (b) => { b.rateCard.actions = {}; }, /rateCard\.actions/);
refuses('after launch: rateCard without version', launchBody, (b) => { delete b.rateCard.version; }, /rateCard\.version/);
refuses('after launch: duplicate rateCard action', launchBody, (b) => { b.rateCard.actions.push({ ...b.rateCard.actions[0] }); }, /appears twice/);

// ---- fetchAiCatalog ---------------------------------------------------------------------------------

test('fetchAiCatalog returns the parsed catalog and asks for revalidate 300 with an abort signal', async () => {
  const calls = stubFetch(() => json(BEFORE));
  const c = await fetchAiCatalog();
  assert.equal(c.launch, false);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, AI_CATALOG_DEFAULT_URL);
  assert.equal(AI_CATALOG_DEFAULT_URL, 'https://portal.roihomesvc.com/api/public/catalog');
  assert.equal(calls[0].init?.next?.revalidate, 300);
  // the tag lets a later step call revalidateTag('ai-catalog'); nothing else rides in `next`
  assert.equal(AI_CATALOG_CACHE_TAG, 'ai-catalog');
  assert.deepEqual(calls[0].init?.next?.tags, ['ai-catalog']);
  assert.deepEqual(Object.keys(calls[0].init?.next ?? {}).sort(), ['revalidate', 'tags']);
  assert.ok(calls[0].init?.signal instanceof AbortSignal);
  assert.equal(calls[0].init?.signal.aborted, false);
  // no key, no cookie, no auth: the route is public
  assert.deepEqual(Object.keys(calls[0].init ?? {}).sort(), ['next', 'signal']);
});

test('the request asks for a 5000 ms timeout, and a timeout becomes the named error', async () => {
  const asked: number[] = [];
  AbortSignal.timeout = (ms: number) => {
    asked.push(ms);
    return realTimeout.call(AbortSignal, 5); // a real signal, short enough to fire inside the test
  };
  globalThis.fetch = ((_url: unknown, init: Json) =>
    new Promise((_resolve, reject) => {
      init.signal.addEventListener('abort', () => reject(init.signal.reason));
    })) as typeof fetch;
  await assert.rejects(fetchAiCatalog(), unavailable(/unreachable/));
  assert.deepEqual(asked, [5000]);
});

test('an abort (not only a timeout) becomes the named error', async () => {
  globalThis.fetch = (async () => { throw new DOMException('This operation was aborted', 'AbortError'); }) as typeof fetch;
  await assert.rejects(fetchAiCatalog(), unavailable(/unreachable/));
});

test('a network failure becomes the named error', async () => {
  globalThis.fetch = (async () => { throw new TypeError('fetch failed'); }) as typeof fetch;
  await assert.rejects(fetchAiCatalog(), unavailable(/unreachable/));
});

for (const status of [201, 204, 301, 304, 400, 404, 429, 500, 503]) {
  test(`a ${status} response becomes the named error`, async () => {
    stubFetch(() => new Response(status === 204 || status === 304 ? null : JSON.stringify(BEFORE), { status }));
    await assert.rejects(fetchAiCatalog(), unavailable(new RegExp(String(status))));
  });
}

test('a 200 whose body is not JSON becomes the named error', async () => {
  stubFetch(() => new Response('<html>maintenance</html>', { status: 200, headers: { 'content-type': 'text/html' } }));
  await assert.rejects(fetchAiCatalog(), unavailable(/malformed/));
});

test('a 200 with an empty body becomes the named error', async () => {
  stubFetch(() => new Response('', { status: 200 }));
  await assert.rejects(fetchAiCatalog(), unavailable(/malformed/));
});

test('a 200 JSON body that fails validation becomes the named error (no partial catalog)', async () => {
  const b = clone(BEFORE);
  b.plans[0].price = 0;
  stubFetch(() => json(b));
  await assert.rejects(fetchAiCatalog(), (err: Error) => {
    assert.ok(err instanceof AiCatalogUnavailableError);
    assert.match(err.message, /plans\[0\]\.price/);
    return true;
  });
});

test('a 200 JSON body missing a names key becomes the named error', async () => {
  const b = clone(BEFORE);
  delete b.names.certified;
  stubFetch(() => json(b));
  await assert.rejects(fetchAiCatalog(), unavailable(/names\.certified/));
});

test('a 200 JSON body with plans that is not an array becomes the named error', async () => {
  const b = clone(BEFORE);
  b.plans = 'none';
  stubFetch(() => json(b));
  await assert.rejects(fetchAiCatalog(), unavailable(/plans/));
});

test('AI_CATALOG_URL overrides the default; blank falls back to it', async () => {
  const calls = stubFetch(() => json(BEFORE));
  process.env.AI_CATALOG_URL = 'http://localhost:3000/api/public/catalog';
  await fetchAiCatalog();
  process.env.AI_CATALOG_URL = '   ';
  await fetchAiCatalog();
  assert.deepEqual(calls.map((c) => c.url), ['http://localhost:3000/api/public/catalog', AI_CATALOG_DEFAULT_URL]);
});

test('an AI_CATALOG_URL that is not an http(s) URL throws the named error and calls nothing', async () => {
  const calls = stubFetch(() => json(BEFORE));
  for (const bad of ['not a url', 'ftp://example.com/x', 'javascript:alert(1)', 'file:///etc/passwd']) {
    process.env.AI_CATALOG_URL = bad;
    await assert.rejects(fetchAiCatalog(), unavailable(/AI_CATALOG_URL/));
  }
  assert.equal(calls.length, 0);
});

test('an AI_CATALOG_URL with a username or password throws the named error, calls nothing, and never echoes it', async () => {
  const calls = stubFetch(() => json(BEFORE));
  for (const bad of [
    'https://alice:s3cret@portal.example.com/api/public/catalog',
    'https://alice@portal.example.com/api/public/catalog',
    'https://:s3cret@portal.example.com/api/public/catalog',
    'http://alice:s3cret@localhost:3000/api/public/catalog',
  ]) {
    process.env.AI_CATALOG_URL = bad;
    await assert.rejects(fetchAiCatalog(), (err: Error) => {
      assert.ok(err instanceof AiCatalogUnavailableError);
      assert.match(err.message, /AI_CATALOG_URL/);
      assert.doesNotMatch(err.message, /alice|s3cret/);
      return true;
    });
  }
  assert.equal(calls.length, 0);
});

test('a non-200 answer has its body cancelled before the named error; a failing cancel changes nothing', async () => {
  let cancelled = 0;
  stubFetch(() => new Response(
    new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('{"oops":true}')); }, cancel() { cancelled++; } }),
    { status: 503 },
  ));
  await assert.rejects(fetchAiCatalog(), unavailable(/status 503/));
  assert.equal(cancelled, 1);

  for (const cancel of [async () => { throw new Error('locked'); }, () => { throw new Error('locked'); }]) {
    stubFetch(() => ({ status: 500, body: { cancel } }) as unknown as Response);
    await assert.rejects(fetchAiCatalog(), unavailable(/status 500/));
  }
});

test('an unexpected error inside the parser is wrapped in the named error', async () => {
  stubFetch(() => ({
    status: 200,
    json: async () => ({ get launch(): boolean { throw new RangeError('surprise from the parser'); } }),
  }) as unknown as Response);
  await assert.rejects(fetchAiCatalog(), (err: Error) => {
    assert.ok(err instanceof AiCatalogUnavailableError);
    assert.match(err.message, /could not be validated/);
    assert.doesNotMatch(err.message, /surprise/);
    return true;
  });
});

// A duplicate code, SKU or action echoes the value in the message, and so in the log: cut at 80 characters.
for (const [label, base, mutate] of [
  ['plan code', () => clone(BEFORE), (b: Json, v: string) => { b.plans[0].code = v; b.plans[1].code = v; }],
  ['pack code', () => clone(BEFORE), (b: Json, v: string) => { b.packs[1] = { ...b.packs[0], code: v }; b.packs[0].code = v; }],
  ['perDeal sku', () => clone(BEFORE), (b: Json, v: string) => { b.perDeal[0].sku = v; b.perDeal[1].sku = v; }],
  ['rateCard action', launchBody, (b: Json, v: string) => { b.rateCard.actions = [{ action: v, credits: 1 }, { action: v, credits: 2 }]; }],
] as const) {
  test(`a duplicate ${label} echoes at most 80 characters of the value`, () => {
    const b = base();
    mutate(b, 'x'.repeat(300));
    assert.throws(() => parseAiCatalog(b), (err: Error) => {
      assert.ok(err instanceof AiCatalogUnavailableError);
      assert.match(err.message, /appears twice/);
      assert.ok(err.message.includes('x'.repeat(80)));
      assert.ok(!err.message.includes('x'.repeat(81)));
      assert.ok(err.message.length < 200);
      return true;
    });
  });
}

test('a short duplicate value is echoed whole', () => {
  const b = clone(BEFORE);
  b.plans[1].code = b.plans[0].code;
  assert.throws(() => parseAiCatalog(b), unavailable(new RegExp(`\\(${b.plans[0].code} appears twice\\)`)));
});

// ---- nothing imports it yet -------------------------------------------------------------------------

// The brief for this module: used by no page yet. DELETE THIS TEST in the PR that adds the first page
// that reads the catalog; it exists so the reader cannot slip into a render path unnoticed before then.
test('no file under src/app or src/components imports the reader', () => {
  const root = join(here, '..', '..');
  const offenders: string[] = [];
  for (const dir of ['app', 'components']) {
    for (const rel of readdirSync(join(root, dir), { recursive: true, encoding: 'utf8' })) {
      if (!/\.(m?[jt]sx?)$/.test(rel)) continue;
      const source = readFileSync(join(root, dir, rel), 'utf8');
      if (/['"`][^'"`\n]*\bai-catalog(\.ts)?['"`]/.test(source)) offenders.push(join('src', dir, rel));
    }
  }
  assert.deepEqual(offenders, []);
});
