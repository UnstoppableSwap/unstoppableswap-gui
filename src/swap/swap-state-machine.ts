/*
// eslint-disable-next-line import/no-cycle
import { Provider } from '../renderer/store';
import { extractAmountFromUnitString } from './utils/parse-utils';
import { BinaryDownloadStatus, BinaryInfo } from './downloader';
import {
  SwapLog,
  SwapLogAliceLockedMonero,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedBitcoin,
  SwapLogReceivedQuote,
  SwapLogReceivedXmrLockTxConfirmation,
  SwapLogRedeemedXmr,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from './swap-process-manager';

enum StateType {
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

export function reduceSwapProcessExit(
  prevState: SwapState,
  exitCode: number | null,
  exitSignal?: NodeJS.Signals | null
): SwapState | null {
  const nextState: SwapStateProcessExited = {
    ...prevState,
    prevState,
    type: StateType.PROCESS_EXITED,
    exitCode,
    exitSignal,
    running: false,
  };

  return nextState;
}

export function reduceBinaryDownloadStatusUpdate({
  totalDownloadedBytes,
  contentLengthBytes,
  binaryInfo,
}: BinaryDownloadStatus): SwapStateDownloadingBinary {
  const nextState: SwapStateDownloadingBinary = {
    state: 'downloading binary',
    totalDownloadedBytes,
    contentLengthBytes,
    binaryInfo,
    running: false,
  };
  return nextState;
}

function reduceReceivedQuoteLog(
  prevState: SwapState,
  log: SwapLogReceivedQuote
): SwapState {
  const price = extractAmountFromUnitString(log.fields.price);
  const minimumSwapAmount = extractAmountFromUnitString(
    log.fields.minimum_amount
  );
  const maximumSwapAmount = extractAmountFromUnitString(
    log.fields.maximum_amount
  );

  if (prevState.state === 'initiated') {
    const nextState: SwapStateReceivedQuote = {
      ...(prevState as SwapStateInitiated),
      state: 'received quote',
      price,
      minimumSwapAmount,
      maximumSwapAmount,
    };
    return nextState;
  }
  return prevState;
}

function reduceWaitingForDepositLog(
  prevState: SwapState,
  log: SwapLogWaitingForBtcDeposit
): SwapState {
  const maxGiveable = extractAmountFromUnitString(log.fields.max_giveable);
  const depositAddress = log.fields.deposit_address;

  const nextState: SwapStateWaitingForBtcDeposit = {
    ...(prevState as SwapStateReceivedQuote),
    state: 'waiting for btc deposit',
    maxGiveable,
    depositAddress,
  };
  return nextState;
}

function reduceReceivedBitcoinLog(
  prevState: SwapState,
  log: SwapLogReceivedBitcoin
): SwapState {
  const maxGiveable = extractAmountFromUnitString(log.fields.max_giveable);

  if (prevState.state === 'waiting for btc deposit') {
    const nextState: SwapStateWaitingForBtcDeposit = {
      ...(prevState as SwapStateWaitingForBtcDeposit),
      maxGiveable,
    };
    return nextState;
  }
  return prevState;
}

function reduceSwapStartedLog(
  prevState: SwapState,
  log: SwapLogStartedSwap
): SwapState {
  const btcAmount = extractAmountFromUnitString(log.fields.amount);
  const bobBtcLockTxFees = extractAmountFromUnitString(log.fields.fees);
  const id = log.fields.swap_id;

  const nextState: SwapStateStarted = {
    ...(prevState as SwapStateWaitingForBtcDeposit),
    state: 'started',
    btcAmount,
    bobBtcLockTxFees,
    id,
  };
  return nextState;
}

function reducePublishedBtcTx(
  prevState: SwapState,
  log: SwapLogPublishedBtcTx
): SwapState {
  const bobBtcLockTxId = log.fields.txid;

  if (log.fields.kind === 'lock') {
    const nextState: SwapStateBtcLockInMempool = {
      ...(prevState as SwapStateStarted),
      state: 'btc lock tx is in mempool',
      bobBtcLockTxId,
      bobBtcLockTxConfirmations: 0,
    };
    return nextState;
  }
  return prevState;
}

function reduceBtcTxStatusChanged(
  prevState: SwapState,
  log: SwapLogBtcTxStatusChanged
): SwapState {
  if (prevState.state === 'btc lock tx is in mempool') {
    const status = log.fields.new_status;
    const prevBtcLockTxInMempoolState = prevState as SwapStateBtcLockInMempool;

    if (log.fields.txid === prevBtcLockTxInMempoolState.bobBtcLockTxId) {
      if (log.fields.new_status.startsWith('confirmed with')) {
        const bobBtcLockTxConfirmations = Number.parseInt(
          status.split(' ')[2],
          10
        );

        const nextState: SwapStateBtcLockInMempool = {
          ...prevBtcLockTxInMempoolState,
          bobBtcLockTxConfirmations,
        };
        return nextState;
      }
    }
  }

  return prevState;
}

function reduceAliceLockedMonero(
  prevState: SwapState,
  log: SwapLogAliceLockedMonero
): SwapState {
  const nextState: SwapStateXmrLockInMempool = {
    ...(prevState as SwapStateBtcLockInMempool),
    state: 'xmr lock tx is in mempool',
    aliceXmrLockTxId: log.fields.txid,
    aliceXmrLockTxConfirmations: 0,
  };
  return nextState;
}

function reduceXmrLockTxStatusChange(
  prevState: SwapState,
  log: SwapLogReceivedXmrLockTxConfirmation
): SwapState {
  if (prevState.state === 'xmr lock tx is in mempool') {
    const aliceXmrLockTxConfirmations = Number.parseInt(
      log.fields.seen_confirmations,
      10
    );

    const nextState: SwapStateXmrLockInMempool = {
      ...(prevState as SwapStateXmrLockInMempool),
      aliceXmrLockTxConfirmations,
    };
    return nextState;
  }
  return prevState;
}

function reduceRedeemedXmr(
  prevState: SwapState,
  log: SwapLogRedeemedXmr
): SwapState {
  const bobXmrRedeemTxId = log.fields.txid;

  const nextState: SwapStateXmrRedeemInMempool = {
    ...(prevState as SwapStateXmrLockInMempool),
    type: StateType.XMR_REDEEM_IN_MEMPOOL,
    bobXmrRedeemTxId,
  };
  return nextState;
}

export function reduceSwapLog(prevState: SwapState, log: SwapLog): SwapState {
  switch (log.fields.message) {
    case 'Received quote':
      return reduceReceivedQuoteLog(prevState, log as SwapLogReceivedQuote);
    case 'Waiting for Bitcoin deposit':
      return reduceWaitingForDepositLog(
        prevState,
        log as SwapLogWaitingForBtcDeposit
      );
    case 'Received Bitcoin':
      return reduceReceivedBitcoinLog(prevState, log as SwapLogReceivedBitcoin);
    case 'Starting new swap':
      return reduceSwapStartedLog(prevState, log as SwapLogStartedSwap);
    case 'Published Bitcoin transaction':
      return reducePublishedBtcTx(prevState, log as SwapLogPublishedBtcTx);
    case 'Bitcoin transaction status changed':
      return reduceBtcTxStatusChanged(
        prevState,
        log as SwapLogBtcTxStatusChanged
      );
    case 'Alice locked Monero':
      return reduceAliceLockedMonero(
        prevState,
        log as SwapLogAliceLockedMonero
      );
    case 'Received new confirmation for Monero lock tx':
      return reduceXmrLockTxStatusChange(
        prevState,
        log as SwapLogReceivedXmrLockTxConfirmation
      );
    case 'Successfully transferred XMR to wallet':
      return reduceRedeemedXmr(prevState, log as SwapLogRedeemedXmr);
    default:
      console.error(`Swap log was not reduced Log: ${JSON.stringify(log)}`);
      return prevState;
  }
}

export interface SwapState {
  state: StateType;
  running: boolean;
}

export interface SwapStateDownloadingBinary extends SwapState {
  binaryInfo: BinaryInfo;
  totalDownloadedBytes: number;
  contentLengthBytes: number;
}

export interface SwapStateInitiated extends SwapState {
  provider: Provider;
  refundAddress: string;
  redeemAddress: string;
}

export interface SwapStateReceivedQuote extends SwapStateInitiated {
  price: number;
  minimumSwapAmount: number;
  maximumSwapAmount: number;
}

export interface SwapStateWaitingForBtcDeposit extends SwapStateReceivedQuote {
  depositAddress: string;
  maxGiveable: number;
}

export interface SwapStateStarted extends SwapStateReceivedQuote {
  id: string;
  btcAmount: number;
  bobBtcLockTxFees: number;
}

export interface SwapStateBtcLockInMempool extends SwapStateStarted {
  bobBtcLockTxId: string;
  bobBtcLockTxConfirmations: number;
}

export interface SwapStateXmrLockInMempool extends SwapStateBtcLockInMempool {
  aliceXmrLockTxId: string;
  aliceXmrLockTxConfirmations: number;
}

export interface SwapStateXmrRedeemInMempool extends SwapStateXmrLockInMempool {
  bobXmrRedeemTxId: string;
}

export interface SwapStateProcessExited extends SwapState {
  prevState: SwapState;
  exitCode: number | null;
  exitSignal: NodeJS.Signals | null | undefined;
}
*/
