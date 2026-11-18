import test from 'node:test';
import assert from 'node:assert/strict';
import {validateStellarPayment} from './stellar-payment-policy.mjs';

const quote = {network:'stellar:pubnet', asset:'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75', payTo:'merchant', amount:'10000', expiresAt:121000};
const requirement = {scheme:'exact',network:quote.network,asset:quote.asset,payTo:'merchant',amount:'10000',maxTimeoutSeconds:60};

test('accepts only the exact previously approved quote', () => {
  assert.equal(validateStellarPayment(requirement,quote,1000),true);
  for (const change of [{scheme:'upto'}, {network:'stellar:testnet'}, {asset:'other'}, {payTo:'other'}, {amount:'10001'}, {amount:'010000'}, {maxTimeoutSeconds:0}, {maxTimeoutSeconds:301}]) {
    assert.equal(validateStellarPayment({...requirement,...change},quote,1000),false);
  }
});

test('rejects expired, malformed or non-positive terms before wallet approval', () => {
  assert.equal(validateStellarPayment(requirement,quote,121000),false);
  assert.equal(validateStellarPayment(requirement,quote,61001),false);
  assert.equal(validateStellarPayment({...requirement,amount:'0'},{...quote,amount:'0'},1000),false);
  assert.equal(validateStellarPayment(null,quote,1000),false);
  assert.equal(validateStellarPayment(requirement,{...quote,expiresAt:NaN},1000),false);
});

test('rejects matching terms that use the wrong USDC asset for the network', () => {
  const testnetAsset = 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA';
  for (const asset of ['contract', testnetAsset]) {
    assert.equal(validateStellarPayment({...requirement,asset},{...quote,asset},1000),false);
  }
  assert.equal(validateStellarPayment({...requirement,network:'stellar:testnet',asset:testnetAsset},{...quote,network:'stellar:testnet',asset:testnetAsset},1000),true);
});
