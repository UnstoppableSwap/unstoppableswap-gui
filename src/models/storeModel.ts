import { SwapLog } from './swapModel';

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

export interface SwapSlice {
  state: SwapState | null;
  logs: SwapLog[];
  stdOut: string;
  processRunning: boolean;
  provider: Provider | null;
  resume: boolean | null;
  swapId: string | null;
}

export interface SwapState {
  type: SwapStateType;
}

export enum SwapStateType {
  INITIATED = 'initiated',
  RECEIVED_QUOTE = 'received quote',
  WAITING_FOR_BTC_DEPOSIT = 'waiting for btc deposit',
  STARTED = 'started',
  BTC_LOCK_TX_IN_MEMPOOL = 'btc lock tx is in mempool',
  XMR_LOCK_TX_IN_MEMPOOL = 'xmr lock tx is in mempool',
  XMR_REDEEM_IN_MEMPOOL = 'xmr redeem tx is in mempool',
  PROCESS_EXITED = 'process exited',
}

export function isSwapState(state?: SwapState | null): state is SwapState {
  return state?.type != null;
}

export interface SwapStateInitiated extends SwapState {
  type: SwapStateType.INITIATED;
}

export function isSwapStateInitiated(
  state?: SwapState | null
): state is SwapStateInitiated {
  return state?.type === SwapStateType.INITIATED;
}

export interface SwapStateReceivedQuote extends SwapState {
  type: SwapStateType.RECEIVED_QUOTE;
  price: number;
  minimumSwapAmount: number;
  maximumSwapAmount: number;
}

export function isSwapStateReceivedQuote(
  state?: SwapState | null
): state is SwapStateReceivedQuote {
  return state?.type === SwapStateType.RECEIVED_QUOTE;
}

export interface SwapStateWaitingForBtcDeposit extends SwapState {
  type: SwapStateType.WAITING_FOR_BTC_DEPOSIT;
  depositAddress: string;
  maxGiveable: number;
  minimumAmount: number;
  maximumAmount: number;
}

export function isSwapStateWaitingForBtcDeposit(
  state?: SwapState | null
): state is SwapStateWaitingForBtcDeposit {
  return state?.type === SwapStateType.WAITING_FOR_BTC_DEPOSIT;
}

export interface SwapStateStarted extends SwapState {
  type: SwapStateType.STARTED;
  id: string;
}

export function isSwapStateStarted(
  state?: SwapState | null
): state is SwapStateStarted {
  return state?.type === SwapStateType.STARTED;
}

export interface SwapStateBtcLockInMempool extends SwapState {
  type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL;
  bobBtcLockTxId: string;
  bobBtcLockTxConfirmations: number;
}

export function isSwapStateBtcLockInMempool(
  state?: SwapState | null
): state is SwapStateBtcLockInMempool {
  return state?.type === SwapStateType.BTC_LOCK_TX_IN_MEMPOOL;
}

export interface SwapStateXmrLockInMempool extends SwapState {
  type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL;
  aliceXmrLockTxId: string;
  aliceXmrLockTxConfirmations: number;
}

export function isSwapStateXmrLockInMempool(
  state?: SwapState | null
): state is SwapStateXmrLockInMempool {
  return state?.type === SwapStateType.XMR_LOCK_TX_IN_MEMPOOL;
}

export interface SwapStateXmrRedeemInMempool extends SwapState {
  type: SwapStateType.XMR_REDEEM_IN_MEMPOOL;
  bobXmrRedeemTxId: string;
}

export function isSwapStateXmrRedeemInMempool(
  state?: SwapState | null
): state is SwapStateXmrRedeemInMempool {
  return state?.type === SwapStateType.XMR_REDEEM_IN_MEMPOOL;
}

export interface SwapStateProcessExited extends SwapState {
  type: SwapStateType.PROCESS_EXITED;
  exitCode: number | null;
  exitSignal: NodeJS.Signals | null | undefined;
  prevState: SwapState | null;
}

export function isSwapStateProcessExited(
  state?: SwapState | null
): state is SwapStateProcessExited {
  return state?.type === SwapStateType.PROCESS_EXITED;
}

export interface WithdrawSlice {
  state: WithdrawState | null;
  stdOut: string;
  logs: SwapLog[];
  processRunning: boolean;
}

export enum WithdrawStateType {
  INITIATED = 'initiated',
  BTC_WITHDRAW_TX_IN_MEMPOOL = 'btc withdraw tx in mempool',
  PROCESS_EXITED = 'process exited',
}

export interface WithdrawState {
  type: WithdrawStateType;
}

export interface WithdrawStateInitiated {
  type: WithdrawStateType.INITIATED;
}

export interface WithdrawStateWithdrawTxInMempool {
  type: WithdrawStateType.BTC_WITHDRAW_TX_IN_MEMPOOL;
  txid: string;
}

export interface WithdrawStateProcessExited {
  type: WithdrawStateType.PROCESS_EXITED;
  exitCode: number | null;
  exitSignal: NodeJS.Signals | null | undefined;
  prevState: WithdrawState | null;
}

export function isWithdrawState(
  state?: WithdrawState | null
): state is WithdrawState {
  return state?.type != null;
}

export function isWithdrawStateInitiated(
  state?: WithdrawState | null
): state is WithdrawStateInitiated {
  return isWithdrawState(state) && state.type === WithdrawStateType.INITIATED;
}

export function isWithdrawStateWithdrawTxInMempool(
  state?: WithdrawState | null
): state is WithdrawStateWithdrawTxInMempool {
  return (
    isWithdrawState(state) &&
    state.type === WithdrawStateType.BTC_WITHDRAW_TX_IN_MEMPOOL
  );
}

export function isWithdrawStateProcessExited(
  state?: WithdrawState | null
): state is WithdrawStateProcessExited {
  return (
    isWithdrawState(state) && state.type === WithdrawStateType.PROCESS_EXITED
  );
}
