import test from 'node:test';
import assert from 'node:assert/strict';
import {formatStellarUSDC} from './stellar-amount.mjs';

test('formats Stellar USDC using seven decimal places without floating point', () => {
  assert.equal(formatStellarUSDC('1'), '0.0000001');
  assert.equal(formatStellarUSDC('10000'), '0.001');
  assert.equal(formatStellarUSDC('10000000'), '1');
  assert.equal(formatStellarUSDC('invalid'), 'Unavailable');
});
