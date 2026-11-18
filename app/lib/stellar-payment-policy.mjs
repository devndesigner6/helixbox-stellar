// Compares the challenge to a previously displayed quote; it does not validate or sign XDR.
export function validateStellarPayment(requirement, quote, now = Date.now()) {
  if (!requirement || !quote || !Number.isFinite(now) || !Number.isFinite(quote.expiresAt) || quote.expiresAt <= now) return false;
  if (!['stellar:pubnet', 'stellar:testnet'].includes(quote.network)) return false;
  if (typeof quote.asset !== 'string' || !quote.asset || typeof quote.payTo !== 'string' || !quote.payTo) return false;
  if (typeof quote.amount !== 'string' || !/^[1-9]\d{0,19}$/.test(quote.amount)) return false;
  return requirement.scheme === 'exact' && requirement.network === quote.network &&
    requirement.asset === quote.asset && requirement.payTo === quote.payTo && requirement.amount === quote.amount &&
    Number.isInteger(requirement.maxTimeoutSeconds) && requirement.maxTimeoutSeconds > 0 && requirement.maxTimeoutSeconds <= 300 &&
    now + requirement.maxTimeoutSeconds * 1000 <= quote.expiresAt;
}
