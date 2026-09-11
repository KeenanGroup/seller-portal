import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module from 'node:module';
import { fileURLToPath } from 'node:url';
const repo = fileURLToPath(new URL('../', import.meta.url));
const require = Module.createRequire(path.join(repo, 'package.json'));
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
process.env.PAYLOAD_API_URL = 'https://cms.invalid/api';
process.env.PAYLOAD_API_KEY = 'fixture';
process.env.SUPABASE_URL = 'https://db.invalid';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'fixture';
let fixture, calls;
global.fetch = async (input, init) => {
  const url = new URL(String(input));
  assert.equal(init?.method || 'GET', 'GET');
  calls.push(url);
  if (url.origin === 'https://cms.invalid') {
    assert.equal(url.pathname, '/api/seller-portals');
    assert.equal(url.searchParams.get('where[isActive][equals]'), 'true');
    assert.equal(url.searchParams.get('depth'), '0');
    assert.equal(init.cache, 'no-store');
    return Response.json({docs: fixture.portals});
  }
  assert.equal(url.origin, 'https://db.invalid', 'No unlisted network destination');
  assert.equal(url.pathname, '/rest/v1/properties');
  assert.equal(new Headers(init.headers).get('authorization'), 'Bearer fixture');
  if (fixture.error) return Response.json({message:'Fixture unavailable'}, {status:503});
  const candidates = url.searchParams.get('mls_number').slice(4,-1).split(',').map(x=>x.replace(/^"|"$/g,''));
  return Response.json(fixture.rows.filter(row=>candidates.includes(row.mls_number)));
};
const compiled = ts.transpileModule(fs.readFileSync(path.join(repo, 'app/page.tsx'),'utf8'), {
 compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}
}).outputText;
const mod = new Module(path.join(repo, 'app/page.fixture.cjs'));
mod.filename = path.join(repo, 'app/page.fixture.cjs');
mod.paths = Module._nodeModulePaths(repo);
mod._compile(compiled, mod.filename);
const portal = (mlsNumber) => ({slug:'fixture-home',displayName:'Fixture Home',isActive:true,mlsNumber,listingStatus:'active',listingSnapshot:{listPrice:999000,bedrooms:3,bathrooms:2,sqft:1800}});
const row = (mls_number, price_current=725000, price_list=800000) => ({mls_number,price_current,price_list,status:'Active',bedrooms:4,bathrooms_full:3,bathrooms_half:1,sqft_total:2500,subdivision:'Fixture Neighborhood'});
const cases = [
 ['numeric CMS to ACT MLS',portal('1234567'),[row('ACT1234567')],725000],
 ['ACT CMS to numeric MLS',portal('ACT1234567'),[row('1234567')],725000],
 ['numeric exact match wins',portal('1234567'),[row('ACT1234567',600000),row('1234567')],725000],
 ['ACT exact match wins',portal('ACT1234567'),[row('1234567',600000),row('ACT1234567')],725000],
 ['whitespace is trimmed',portal(' 1234567 '),[row('ACT1234567')],725000],
 ['price_list fallback',portal('1234567'),[row('ACT1234567',null,800000)],800000],
 ['null live prices use snapshot',portal('1234567'),[row('ACT1234567',null,null)],999000],
 ['missing live row uses snapshot',portal('1234567'),[],999000],
 ['different identifier is not matched',portal('7654321'),[row('ACT1234567')],999000],
 ['unknown prefix exact match retained',portal('XYZ1234567'),[row('XYZ1234567')],725000],
 ['unknown prefix not normalized',portal('XYZ1234567'),[row('ACT1234567')],999000],
 ['API failure uses snapshot',portal('1234567'),[],999000,true],
];
const results=[];
for (const [name,p,rows,price,error] of cases) {
 fixture={portals:[p],rows,error};calls=[];
 const html=renderToStaticMarkup(await mod.exports.default());
 const card=html.match(/<a href="\/fixture-home"[^]*?<\/a>/)?.[0];
 assert.ok(card, name+' must preserve card URL');
 assert.ok(card.includes('$'+price.toLocaleString('en-US')), name+': incorrect rendered price');
 if(price!==999000) assert.ok(!card.includes('$999,000'), name+': stale snapshot visible');
 assert.equal(calls.filter(x=>x.origin==='https://db.invalid').length,error ? 4 : 1, name+': bounded SDK requests');
 results.push({name,pass:true});
}
console.log(JSON.stringify({verdict:'PASS',cases:results,actual_homepage_render:true,actual_supabase_sdk:true,external_network_calls:0},null,2));
