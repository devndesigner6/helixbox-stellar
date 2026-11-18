import test from 'node:test';
import assert from 'node:assert/strict';
import {bootstrapConfiguredProxies} from '../src/proxy-bootstrap.ts';

test('bootstraps a separate proxy with its configured secret and no built-in default', () => {
  const saved: string[][] = [];
  bootstrapConfiguredProxies(['https://proxy.example'], 'fixture-secret', (...args) => saved.push(args));
  assert.deepEqual(saved, [['https://proxy.example','fixture-secret']]);
  bootstrapConfiguredProxies(['https://other.example'], '', (...args) => saved.push(args));
  assert.deepEqual(saved[1], ['https://other.example','']);
});

test('does not reuse a bootstrap password across multiple configured proxies', () => {
  assert.throws(()=>bootstrapConfiguredProxies(['https://one.example','https://two.example'],'fixture-secret',()=>{}), /one proxy/i);
});
