import {createMultichainClient} from '@metamask/connect-multichain';
import {Linking} from 'react-native';
import {stellarSessionAddress} from './stellar-wallet-session.mjs';

const NETWORK = 'stellar:pubnet';
let clientPromise: ReturnType<typeof createMultichainClient> | undefined;

function getClient() {
  if (!clientPromise) {
    clientPromise = createMultichainClient({
      dapp:{name:'HelixBox Stellar',url:'https://helixboxide.xyz'},
      api:{supportedNetworks:{}},
      mobile:{preferredOpenLink:(url:string)=>Linking.openURL(url)},
    }).catch(error=>{clientPromise=undefined;throw error;});
  }
  return clientPromise;
}

export async function connectStellarWallet(): Promise<string> {
  const client = await getClient();
  await client.connect([NETWORK as never], []);
  return stellarSessionAddress(await client.provider.getSession());
}

export async function disconnectStellarWallet(): Promise<void> {
  const client = await getClient();
  await client.disconnect([NETWORK as never]);
}
