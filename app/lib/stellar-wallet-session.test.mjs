import test from 'node:test';
import assert from 'node:assert/strict';
import {stellarSessionAddress} from './stellar-wallet-session.mjs';

const address = 'GBX7H2GRCWFPDUGCDGJXUEXE3MYPERWIF5LMFRKYI7Z7CKQH2M56ICOA';
test('only accepts a Stellar mainnet account returned in the matching session scope',()=>{
  assert.equal(stellarSessionAddress({sessionScopes:{'stellar:pubnet':{accounts:[`stellar:pubnet:${address}`]}}}),address);
  assert.throws(()=>stellarSessionAddress({sessionScopes:{'stellar:testnet':{accounts:[`stellar:testnet:${address}`]}}}));
  assert.throws(()=>stellarSessionAddress({sessionScopes:{'stellar:pubnet':{accounts:[`solana:pubnet:${address}`]}}}));
  assert.throws(()=>stellarSessionAddress({sessionScopes:{'stellar:pubnet':{accounts:['stellar:pubnet:not-an-address']}}}));
});
