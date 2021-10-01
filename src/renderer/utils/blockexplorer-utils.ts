export function getBitcoinTxExplorerUrl(txid: string, testnet: boolean) {
  return `https://blockchair.com/bitcoin${
    testnet ? '/testnet' : ''
  }/transaction/${txid}`;
}

export function getMoneroTxExplorerUrl(txid: string, stagenet: boolean) {
  if (stagenet) {
    return `https://stagenet.xmrchain.net/tx/${txid}`;
  }
  return `https://xmrchain.net/tx/${txid}`;
}
