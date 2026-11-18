// Match the USDC contracts in @x402/stellar; XDR validation and signing are separate.
export const STELLAR_USDC = Object.freeze({
  'stellar:pubnet': 'CCW67TSZV3SSS2HXMBQ5JFGCKJNXKZM7UQUWUZPUTHXSTZLEO7SJMI75',
  'stellar:testnet': 'CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA',
});

// Compares the challenge to a previously displayed quote; it does not validate or sign XDR.
export function validateStellarPayment(requirement, quote, now = Date.now()) {
  if (!requirement || !quote || !Number.isFinite(now) || !Number.isFinite(quote.expiresAt) || quote.expiresAt <= now) return false;
  if (!['stellar:pubnet', 'stellar:testnet'].includes(quote.network)) return false;
  if (quote.asset !== STELLAR_USDC[quote.network] || typeof quote.payTo !== 'string' || !quote.payTo) return false;
  if (typeof quote.amount !== 'string' || !/^[1-9]\d{0,19}$/.test(quote.amount)) return false;
  return requirement.scheme === 'exact' && requirement.network === quote.network &&
    requirement.asset === quote.asset && requirement.payTo === quote.payTo && requirement.amount === quote.amount &&
    Number.isInteger(requirement.maxTimeoutSeconds) && requirement.maxTimeoutSeconds > 0 && requirement.maxTimeoutSeconds <= 300 &&
    now + requirement.maxTimeoutSeconds * 1000 <= quote.expiresAt;
}
