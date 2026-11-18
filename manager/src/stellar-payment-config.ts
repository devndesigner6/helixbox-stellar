import {StrKey} from '@stellar/stellar-sdk';
import {getUsdcAddress} from '@x402/stellar';

export interface StellarPaymentConfig {
  network: 'stellar:pubnet' | 'stellar:testnet';
  asset: string;
  payTo: string;
  facilitatorUrl: string;
}

export function createStellarPaymentConfig(env: Record<string, string | undefined>): StellarPaymentConfig {
  const network = env.STELLAR_NETWORK;
  if (network !== 'stellar:pubnet' && network !== 'stellar:testnet') throw new Error('Select a supported Stellar network');
  const payTo = (env.STELLAR_PAY_TO || '').trim();
  if (!StrKey.isValidEd25519PublicKey(payTo)) throw new Error('STELLAR_PAY_TO must be a valid Stellar public account');
  const asset = getUsdcAddress(network);
  if (env.STELLAR_USDC_ASSET && env.STELLAR_USDC_ASSET !== asset) throw new Error('STELLAR_USDC_ASSET must be the network USDC contract');
  let facilitator: URL;
  try { facilitator = new URL(env.STELLAR_FACILITATOR_URL || ''); }
  catch { throw new Error('STELLAR_FACILITATOR_URL must be an HTTPS URL'); }
  if (facilitator.protocol !== 'https:' || facilitator.username || facilitator.password || facilitator.search || facilitator.hash) {
    throw new Error('STELLAR_FACILITATOR_URL must be an HTTPS URL without credentials, query or fragment');
  }
  return {network, asset, payTo, facilitatorUrl:facilitator.toString().replace(/\/+$/, '')};
}
