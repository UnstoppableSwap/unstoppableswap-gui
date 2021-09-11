// eslint-disable-next-line import/no-cycle
import { Provider } from '../renderer/store';
import { extractAmountFromUnitString } from './utils/parse-utils';
import { BinaryDownloadStatus, BinaryInfo } from './downloader';

export function reduceSwapProcessExit(
  prevState: SwapState,
  exitCode: number | null,
  exitSignal?: NodeJS.Signals | null
): SwapState | null {
  const nextState: SwapStateProcessExited = {
    ...prevState,
    prevState,
    state: 'process excited',
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
}: BinaryDownloadStatus): SwapStatePreparingBinary {
  const nextState: SwapStatePreparingBinary = {
    state: 'preparing binary',
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
    state: 'xmr redeem tx is in mempool',
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

type StateName =
  | 'preparing binary'
  | 'initiated'
  | 'received quote' // Started, SwapStateStarted
  | 'waiting for btc deposit'
  | 'started'
  | 'btc lock tx is in mempool' // SwapSetupCompleted
  | 'btc is locked' // BtcLocked
  | 'xmr lock tx is in mempool' // XmrLockProofReceived
  | 'xmr is locked' // XmrLocked
  | 'encrypted signature is sent' // EncSigSent
  | 'btc is redeemed' // BtcRedeemed
  | 'cancel timelock is expired' // CancelTimelockExpired
  | 'btc is cancelled' // BtcCancelled
  | 'btc is refunded' // BtcRefunded
  | 'xmr redeem tx is in mempool' // XmrRedeemed
  | 'btc is punished' // BtcPunished
  | 'safely aborted' // SafelyAborted
  | 'process excited';

export interface SwapState {
  state: StateName;
  running: boolean;
}

export interface SwapStatePreparingBinary extends SwapState {
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

export interface SwapLog {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN';
  fields: {
    message: string;
    [index: string]: unknown;
  };
}

interface SwapLogReceivedQuote extends SwapLog {
  fields: {
    message: 'Received quote';
    price: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

interface SwapLogWaitingForBtcDeposit extends SwapLog {
  fields: {
    message: 'Waiting for Bitcoin deposit';
    deposit_address: string;
    max_giveable: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

interface SwapLogReceivedBitcoin extends SwapLog {
  fields: {
    message: 'Received Bitcoin';
    max_giveable: string;
    new_balance: string;
  };
}

interface SwapLogStartedSwap extends SwapLog {
  fields: {
    message: 'Starting new swap';
    amount: string;
    fees: string;
    swap_id: string;
  };
}

interface SwapLogPublishedBtcTx extends SwapLog {
  fields: {
    message: 'Published Bitcoin transaction';
    txid: string;
    kind: 'lock' | 'cancel' | 'withdraw';
  };
}

interface SwapLogBtcTxStatusChanged extends SwapLog {
  fields: {
    message: 'Bitcoin transaction status changed';
    txid: string;
    new_status: string;
  };
}

interface SwapLogAliceLockedMonero extends SwapLog {
  fields: {
    message: 'Alice locked Monero';
    txid: string;
  };
}

interface SwapLogReceivedXmrLockTxConfirmation extends SwapLog {
  fields: {
    message: 'Received new confirmation for Monero lock tx';
    txid: string;
    seen_confirmations: string;
    needed_confirmations: string;
  };
}

interface SwapLogRedeemedXmr extends SwapLog {
  fields: {
    message: 'Successfully transferred XMR to wallet';
    monero_receive_address: string;
    txid: string;
  };
}
