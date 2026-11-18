import test from 'node:test';
import assert from 'node:assert/strict';
import {validateStellarPayment} from './stellar-payment-policy.mjs';

const quote = {network:'stellar:pubnet', asset:'contract', payTo:'merchant', amount:'10000', expiresAt:121000};
const requirement = {scheme:'exact',network:'stellar:pubnet',asset:'contract',payTo:'merchant',amount:'10000',maxTimeoutSeconds:60};

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
