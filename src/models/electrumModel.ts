import { TransportScheme } from 'electrum-cash';
import { isObject } from 'lodash';

export interface ElectrumTransactionData {
  confirmations?: number;
  hash: string;
}

export interface SwapBlockchainTx {
  swapId: string;
  kind: string;
  txid: string;
}

export type ElectrumServerAddress = [
  testnet: boolean,
  host: string,
  port: number,
  transport: TransportScheme
];

export function isElectrumTransactionData(
  txState: unknown
): txState is ElectrumTransactionData {
  return isObject(txState) && 'hash' in txState && 'vout' in txState;
}
