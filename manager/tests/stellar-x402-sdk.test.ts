import test from 'node:test';
import assert from 'node:assert/strict';
import {ExactStellarScheme} from '@x402/stellar/exact/server';

test('the pinned Stellar x402 server scheme creates seven-decimal USDC prices', async () => {
  const scheme = new ExactStellarScheme();
  const price = await scheme.parsePrice('$0.001', 'stellar:pubnet');
  assert.equal(price.amount,'10000');
  assert.equal(price.asset,'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75');
});
