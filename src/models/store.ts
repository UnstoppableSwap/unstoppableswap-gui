import { BinaryInfo } from '../swap/downloader';

export interface Provider {
  multiAddr: string;
  peerId: string;
  testnet: boolean;
}

export interface ExtendedProvider extends Provider {
  price: number;
  minSwapAmount: number;
  maxSwapAmount: number;
  uptimeSeconds: number;
  downtimeSeconds: number;
  age: number;
  relevancy: number;
}

export interface Swap {
  state: SwapState | null;
  processRunning: boolean;
  logs: string[];
}

export interface SwapState {
  type: SwapStateType;
}

export enum SwapStateType {
  DOWNLOADING_BINARY = 'downloading binary',
  INITIATED = 'initiated',
  RECEIVED_QUOTE = 'received quote',
  WAITING_FOR_BTC_DEPOSIT = 'waiting for btc deposit',
  STARTED = 'started',
  BTC_LOCK_TX_IN_MEMPOOL = 'btc lock tx is in mempool',
  XMR_LOCK_TX_IN_MEMPOOL = 'xmr lock tx is in mempool',
  XMR_REDEEM_IN_MEMPOOL = 'xmr redeem tx is in mempool',
  PROCESS_EXITED = 'process exited',
}

export interface SwapStateDownloadingBinary extends SwapState {
  type: SwapStateType.DOWNLOADING_BINARY;
  binaryInfo: BinaryInfo;
  totalDownloadedBytes: number;
  contentLengthBytes: number;
}

export interface SwapStateInitiated extends SwapState {
  type: SwapStateType.INITIATED;
  provider: Provider;
  refundAddress: string;
  redeemAddress: string;
}

export interface SwapStateReceivedQuote extends SwapState {
  type: SwapStateType.RECEIVED_QUOTE;
  price: number;
  minimumSwapAmount: number;
  maximumSwapAmount: number;
}

export interface SwapStateWaitingForBtcDeposit extends SwapState {
  type: SwapStateType.WAITING_FOR_BTC_DEPOSIT;
  depositAddress: string;
  maxGiveable: number;
}

export interface SwapStateStarted extends SwapState {
  type: SwapStateType.STARTED;
  id: string;
  btcAmount: number;
  bobBtcLockTxFees: number;
}

export interface SwapStateBtcLockInMempool extends SwapState {
  type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL;
  bobBtcLockTxId: string;
  bobBtcLockTxConfirmations: number;
}

export interface SwapStateXmrLockInMempool extends SwapState {
  type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL;
  aliceXmrLockTxId: string;
  aliceXmrLockTxConfirmations: number;
}

export interface SwapStateXmrRedeemInMempool extends SwapState {
  type: SwapStateType.XMR_REDEEM_IN_MEMPOOL;
  bobXmrRedeemTxId: string;
}

export interface SwapStateProcessExited extends SwapState {
  type: SwapStateType.PROCESS_EXITED;
  exitCode: number | null;
  exitSignal: NodeJS.Signals | null | undefined;
}
