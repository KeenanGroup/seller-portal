import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Module from 'node:module';
const repo = fileURLToPath(new URL('../', import.meta.url));
const requireRepo = Module.createRequire(path.join(repo, 'package.json'));
const ts = requireRepo('typescript');
const { NextRequest } = requireRepo('next/server');
const intervals = new Set();
const realSet = global.setInterval, realClear = global.clearInterval;
global.setInterval = (...args) => { const h = realSet(...args); intervals.add(h); return h; };
global.clearInterval = h => { intervals.delete(h); return realClear(h); };
process.env.PAYLOAD_API_URL = 'https://cms.invalid/api';
process.env.PAYLOAD_API_KEY = 'fixture';
process.env.SUPABASE_URL = 'https://db.invalid';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture-database-key';
const portal = { id: 'fixture', slug: '123-fixture', passcode: 'fixture-passcode', mlsNumber: 'ACT999001', displayName: 'Fixture', isActive: true };
let requests = [], unexpected = [];
global.fetch = async (input, init) => {
  const url = new URL(String(input));
  const headers = new Headers(init?.headers);
  requests.push({ url: url.href, authorization: headers.get('authorization') });
  let data;
  if (url.origin === 'https://cms.invalid') {
    if (url.pathname === '/api/seller-portals') data = { docs: [portal] };
    else if (['/api/seller-updates', '/api/market-updates'].includes(url.pathname)) data = { docs: [] };
    else { unexpected.push(url.href); throw new Error('Unexpected fixture path'); }
  } else if (url.origin === 'https://db.invalid' && url.pathname === '/rest/v1/properties') {
    assert.equal(headers.get('authorization'), 'Bearer fixture-database-key');
    data = [{ mls_number: 'ACT999001', slug: 'fixture', price_current: 1234567, status: 'Active' }];
  } else { unexpected.push(url.href); throw new Error('Network not admitted'); }
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
function load(relative) {
  const source = fs.readFileSync(path.join(repo, relative), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const filename = path.join(repo, relative + '.fixture.cjs');
  const mod = new Module(filename);
  mod.filename = filename;
  mod.paths = Module._nodeModulePaths(repo);
  mod._compile(compiled, filename);
  return mod.exports;
}
async function run() {
  requests = [];
  const { GET } = load('app/api/portal/[slug]/route.ts');
  const home = load('app/page.tsx').default;
  const results = [];
  for (const passcode of ['', 'incorrect']) {
    const res = await GET(new NextRequest('https://portal.invalid/api/portal/123-fixture', { headers: { 'x-portal-passcode': passcode } }), { params: Promise.resolve({ slug: '123-fixture' }) });
    assert.equal(res.status, 401);
    results.push(await res.json());
  }
  for (let i = 0; i < 10; i++) {
    const res = await GET(new NextRequest('https://portal.invalid/api/portal/123-fixture', { headers: { 'x-portal-passcode': 'fixture-passcode' } }), { params: Promise.resolve({ slug: '123-fixture' }) });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.listing.list_price, 1234567);
    results.push(body);
    assert.ok(await home());
  }
  await new Promise(resolve => setImmediate(resolve));
  const timerCount = intervals.size;
  for (const h of intervals) realClear(h);
  intervals.clear();
  return { requests: [...requests], results, timerCount };
}
(async () => {
  try {
    const after = await run();
    assert.equal(after.requests.filter(x => x.url.startsWith('https://db.invalid/')).length, 20);
    assert.equal(after.timerCount, 0);
    assert.deepEqual(unexpected, []);
    console.log(JSON.stringify({ verdict: 'PASS', actual_route_and_page_requests_per_variant: 22, active_intervals: after.timerCount, synthetic_authorization_and_listing_reads_pass: true, provider_calls: 0 }, null, 2));
  } finally {
    for (const h of intervals) realClear(h);
    global.setInterval = realSet;
    global.clearInterval = realClear;
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
