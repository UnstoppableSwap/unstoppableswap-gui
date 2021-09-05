export function satsToBtc(sats: number): number {
  return sats / 100000000;
}

export function btcToSats(btc: number): number {
  return btc * 100000000;
}
