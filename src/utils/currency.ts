export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${formatted}`;
}

export function formatCurrencyShort(amount: number): string {
  const abs = Math.abs(amount);
  if (abs >= 1000000) {
    return `$${(abs / 1000000).toFixed(1)}M`;
  }
  if (abs >= 1000) {
    return `$${(abs / 1000).toFixed(1)}K`;
  }
  return formatCurrency(amount);
}
