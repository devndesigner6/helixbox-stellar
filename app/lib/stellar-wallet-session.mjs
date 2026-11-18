export function stellarSessionAddress(session) {
  const accounts = session?.sessionScopes?.['stellar:pubnet']?.accounts;
  if (!Array.isArray(accounts)) throw new Error('MetaMask did not return a Stellar mainnet account');
  for (const account of accounts) {
    if (typeof account !== 'string' || !account.startsWith('stellar:pubnet:')) continue;
    const address = account.slice('stellar:pubnet:'.length);
    if (/^G[A-Z2-7]{55}$/.test(address)) return address;
  }
  throw new Error('MetaMask did not return a Stellar mainnet account');
}
