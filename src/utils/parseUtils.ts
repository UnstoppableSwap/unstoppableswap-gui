/*
Extract btc amount from string

E.g: "0.00100000 BTC"
Output: 0.001
 */
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

/*
Extract btc amount from stdout from balance subcommand

E.g: "Bitcoin balance is 0.00000000 BTC"
Output: 0.00000000

E.g: "Bitcoin balance is 0.10300000 BTC"
Output: 0.10300000
 */
export function extractBtcBalanceFromBalanceString(
  text: string
): number | null {
  if (text != null) {
    if (text.match(/Bitcoin balance is (.*) BTC/)) {
      const balance = Number.parseFloat(text.split(' ')[3]);
      return balance;
    }
  }
  return null;
}
