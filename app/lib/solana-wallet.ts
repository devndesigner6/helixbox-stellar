import { createMultichainClient } from '@metamask/connect-multichain';
import type { TransactionPartialSigner } from '@solana/kit';
import { Linking } from 'react-native';

export const SOLANA_MAINNET = 'solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp';

let clientPromise: ReturnType<typeof createMultichainClient> | undefined;

function getClient() {
  if (!clientPromise) {
    clientPromise = createMultichainClient({
      dapp: { name: 'HelixBox', url: 'https://helixboxide.xyz' },
      api: { supportedNetworks: { [SOLANA_MAINNET]: process.env.EXPO_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com' } },
      mobile: { preferredOpenLink: (url: string) => Linking.openURL(url) },
    }).catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }
  return clientPromise;
}

export async function connectSolanaWallet(): Promise<string> {
  const client = await getClient();
  await client.connect([SOLANA_MAINNET], []);
  const session = await client.provider.getSession();
  const account = session?.sessionScopes?.[SOLANA_MAINNET]?.accounts?.[0];
  const address = account?.split(':').pop();
  if (!address || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    throw new Error('MetaMask did not return a valid Solana account');
  }
  return address;
}

export async function disconnectSolanaWallet(): Promise<void> {
  const client = await getClient();
  await client.disconnect([SOLANA_MAINNET]);
}

export async function createSolanaPaymentSigner(): Promise<TransactionPartialSigner> {
  throw new Error('Legacy Solana signing is disabled in the Stellar migration');
}
