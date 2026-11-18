export function formatStellarUSDC(amount) {
  if (typeof amount !== 'string' || !/^\d+$/.test(amount)) return 'Unavailable';
  const value = BigInt(amount);
  const fraction = String(value % 10000000n).padStart(7, '0').replace(/0+$/, '');
  return String(value / 10000000n) + (fraction ? '.' + fraction : '');
}
