import { test, expect } from 'bun:test';
import { getUsdcAddress } from '@x402/stellar';
import { STELLAR_USDC } from '../../app/lib/stellar-payment-policy.mjs';

test('mobile USDC allowlist matches the installed Stellar x402 SDK', () => {
  expect(STELLAR_USDC['stellar:pubnet']).toBe(getUsdcAddress('stellar:pubnet'));
  expect(STELLAR_USDC['stellar:testnet']).toBe(getUsdcAddress('stellar:testnet'));
});
