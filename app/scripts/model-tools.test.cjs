const assert = require('node:assert/strict');
const {test} = require('node:test');
const {readFileSync} = require('node:fs');
const {resolve} = require('node:path');
const {runInNewContext} = require('node:vm');
const ts = require('typescript');

const source = ts.transpileModule(readFileSync(resolve(__dirname, '../lib/model-tools.ts'), 'utf8'), {
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},
}).outputText;
function load(manager, fetcher) {
  const module = {exports:{}};
  runInNewContext(source, {exports:module.exports, process:{env:{EXPO_PUBLIC_MANAGER_URL:manager}}, Date, AbortController, setTimeout, clearTimeout,
    fetch:fetcher, require:name=>{
      if(name==='@react-native-async-storage/async-storage')return {default:{}};
      if(name==='./stellar-amount.mjs')return require('../lib/stellar-amount.mjs');
      throw new Error(name);
    }});
  return module.exports;
}

test('uses the Stellar manager by default, never the old deployment', async()=>{
  let url='';
  const api=load('',async value=>{url=String(value);return Response.json({});});
  await api.modelRequest('');
  assert.equal(url,'https://helixbox-stellar-manager-43f4.onrender.com/v2/models');
});

test('does not make a model purchase while Stellar payments are disabled', async()=>{
  let calls=0;
  const api=load('https://manager.example',async()=>{calls++;return Response.json({});});
  await assert.rejects(api.modelRequest('/quotes','paired',{}), /not available yet/i);
  await assert.rejects(api.payForModelCall({},'paired'), /not available yet/i);
  assert.equal(calls,0);
});

test('formats Stellar USDC without floats',()=>{
  const api=load('',async()=>Response.json({}));
  assert.equal(api.formatUSDC('10000'),'0.001');
  assert.equal(api.formatUSDC('10000000'),'1');
  assert.equal(api.formatUSDC('invalid'),'Unavailable');
});
