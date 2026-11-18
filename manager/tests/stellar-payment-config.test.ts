import test from 'node:test';
import assert from 'node:assert/strict';
import {createStellarPaymentConfig} from '../src/stellar-payment-config.ts';

const payTo = 'GBX7H2GRCWFPDUGCDGJXUEXE3MYPERWIF5LMFRKYI7Z7CKQH2M56ICOA';
const valid = {STELLAR_NETWORK:'stellar:pubnet', STELLAR_PAY_TO:payTo, STELLAR_FACILITATOR_URL:'https://facilitator.example'};

test('uses the official Stellar USDC asset for the explicitly selected network', () => {
  const config = createStellarPaymentConfig(valid);
  assert.equal(config.network,'stellar:pubnet');
  assert.equal(config.asset,'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75');
  assert.equal(config.payTo,payTo);
  assert.equal(createStellarPaymentConfig({...valid,STELLAR_NETWORK:'stellar:testnet'}).asset,'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA');
});

test('fails closed on missing network, invalid checksum, untrusted asset or unsafe facilitator', () => {
  for (const change of [{STELLAR_NETWORK:''},{STELLAR_NETWORK:'solana:mainnet'}, {STELLAR_PAY_TO:payTo.slice(0,-1)+'B'}, {STELLAR_PAY_TO:''},
    {STELLAR_FACILITATOR_URL:'http://example.com'}, {STELLAR_FACILITATOR_URL:'https://user:pass@example.com'}, {STELLAR_USDC_ASSET:'not-usdc'}]) {
    assert.throws(()=>createStellarPaymentConfig({...valid,...change}));
  }
});
