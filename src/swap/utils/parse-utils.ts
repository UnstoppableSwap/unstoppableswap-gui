/*
Extract btc amount from string
E.g: "0.00100000 BTC"
 */
// eslint-disable-next-line import/prefer-default-export
export function extractAmountFromUnitString(text: string): number {
  const parts = text.split(' ');
  if (parts.length === 2) {
    const amount = Number.parseFloat(parts[0]);
    return amount;
  }
  throw new Error('Does not have format AMOUNT UNIT');
}
