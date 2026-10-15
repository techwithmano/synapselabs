export type CheckoutCurrency = 'kwd' | 'usd';

export const KWD_TO_USD = 3.27;

export function getUnitPriceInCurrency(
  kwdPrice: number,
  currency: CheckoutCurrency,
): number {
  if (!Number.isFinite(kwdPrice) || kwdPrice < 0) {
    throw new Error('Product price must be a non-negative number.');
  }

  return currency === 'usd' ? Math.round(kwdPrice * KWD_TO_USD) : kwdPrice;
}

export function toStripeMinorUnits(
  amount: number,
  currency: CheckoutCurrency,
): number {
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Checkout amount must be a non-negative number.');
  }

  const minorUnits = Math.round(amount * (currency === 'kwd' ? 1000 : 100));
  if (!Number.isSafeInteger(minorUnits)) {
    throw new Error('Checkout amount is outside the supported range.');
  }
  return minorUnits;
}

export function formatCurrencyAmount(
  amount: number,
  currency: CheckoutCurrency,
): string {
  return currency === 'usd' ? `$${amount} USD` : `${amount} KWD`;
}
