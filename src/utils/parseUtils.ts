/*
Extract btc amount from string

E.g: "0.00100000 BTC"
Output: 0.001
 */

// eslint-disable-next-line import/prefer-default-export
export function extractAmountFromUnitString(text: string): number | null {
  if (text != null) {
    const parts = text.split(' ');
    if (parts.length === 2) {
      const amount = Number.parseFloat(parts[0]);
      return amount;
    }
  }
  return null;
}
