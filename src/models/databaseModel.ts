import { isObject } from 'lodash';
import { satsToBtc, pionerosToXmr } from '../utils/conversionUtils';
import { TxLock } from './bitcoinModel';
import { Provider } from './apiModel';
import logger from '../utils/logger';

export interface DbState {
  Bob: {
    [stateName: string]: unknown;
  };
}

export function isDbState(dbState: unknown): dbState is DbState {
  return isObject(dbState) && 'Bob' in dbState;
}

export interface DbStateDone extends DbState {
  Bob: {
    Done: {
      [stateName: string]: unknown;
    };
  };
}

export function getTypeOfDbState(dbState: DbState): DbStateType {
  let [firstKey] = Object.keys(dbState.Bob);
  if (firstKey === 'Done') {
    [firstKey] = Object.keys((dbState as DbStateDone).Bob.Done);
  }

  return firstKey as DbStateType;
}

export interface ExecutionSetupDoneDbState extends DbState {
  Bob: {
    ExecutionSetupDone: {
      state2: {
        xmr: number;
        cancel_timelock: number;
        punish_timelock: number;
        refund_address: string;
        redeem_address: string;
        punish_address: string;
        tx_lock: TxLock;
        min_monero_confirmations: number;
        tx_redeem_fee: number;
        tx_punish_fee: number;
        tx_refund_fee: number;
        tx_cancel_fee: number;
      };
    };
  };
}

export function isExecutionSetupDoneDbState(
  dbState: DbState
): dbState is ExecutionSetupDoneDbState {
  return 'ExecutionSetupDone' in dbState.Bob;
}

export interface BtcLockedDbState extends DbState {
  Bob: {
    BtcLocked: {
      state3: DbState3;
    };
  };
}

export function isBtcLockedDbState(
  dbState: DbState
): dbState is BtcLockedDbState {
  return 'BtcLocked' in dbState.Bob;
}

export interface XmrLockProofReceivedDbState extends DbState {
  Bob: {
    XmrLockProofReceived: {
      state: DbState3;
      monero_wallet_restore_blockheight: {
        height: number;
      };
    };
  };
}

export function isXmrLockProofReceivedDbState(
  dbState: DbState
): dbState is XmrLockProofReceivedDbState {
  return 'XmrLockProofReceived' in dbState.Bob;
}

export interface XmrLockedDbState extends DbState {
  Bob: {
    XmrLocked: {
      state4: DbState4;
    };
  };
}

export function isXmrLockedDbState(
  dbState: DbState
): dbState is XmrLockedDbState {
  return 'XmrLocked' in dbState.Bob;
}

export interface EncSigSentDbState extends DbState {
  Bob: {
    EncSigSent: {
      state4: DbState4;
    };
  };
}

export function isEncSigSentDbState(
  dbState: DbState
): dbState is EncSigSentDbState {
  return 'EncSigSent' in dbState.Bob;
}

export interface BtcRedeemedDbState extends DbState {
  Bob: {
    BtcRedeemed: DbState5;
  };
}

export function isBtcRedeemedDbState(
  dbState: DbState
): dbState is BtcRedeemedDbState {
  return 'BtcRedeemed' in dbState.Bob;
}

export interface DoneXmrRedeemedDbState extends DbStateDone {
  Bob: {
    Done: {
      XmrRedeemed: {
        tx_lock_id: string;
      };
    };
  };
}

export function isDoneXmrRedeemedDbState(
  dbState: DbState
): dbState is DoneXmrRedeemedDbState {
  return (
    'Done' in dbState.Bob && 'XmrRedeemed' in (dbState as DbStateDone).Bob.Done
  );
}

export interface CancelTimelockExpiredDbState extends DbState {
  Bob: {
    CancelTimelockExpired: DbState6;
  };
}

export function isCancelTimelockExpiredDbState(
  dbState: DbState
): dbState is CancelTimelockExpiredDbState {
  return 'CancelTimelockExpired' in dbState.Bob;
}

export interface BtcCancelledDbState extends DbState {
  Bob: {
    BtcCancelled: DbState6;
  };
}

export function isBtcCancelledDbState(
  dbState: DbState
): dbState is BtcCancelledDbState {
  return 'BtcCancelled' in dbState.Bob;
}

export interface DoneBtcRefundedDbState extends DbStateDone {
  Bob: {
    Done: {
      BtcRefunded: DbState6;
    };
  };
}

export function isDoneBtcRefundedDbState(
  dbState: DbState
): dbState is DoneBtcRefundedDbState {
  return (
    'Done' in dbState.Bob && 'BtcRefunded' in (dbState as DbStateDone).Bob.Done
  );
}

export interface DoneBtcPunishedDbState extends DbStateDone {
  Bob: {
    Done: {
      BtcPunished: {
        tx_lock_id: string;
      };
    };
  };
}

export function isDoneBtcPunishedDbState(
  dbState: DbState
): dbState is DoneBtcPunishedDbState {
  return (
    'Done' in dbState.Bob && 'BtcPunished' in (dbState as DbStateDone).Bob.Done
  );
}

export interface DbState3 {
  xmr: number;
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  redeem_address: string;
  min_monero_confirmations: number;
  tx_redeem_fee: number;
  tx_refund_fee: number;
  tx_cancel_fee: number;
  tx_lock: TxLock;
}

export interface DbState4 {
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  redeem_address: string;
  monero_wallet_restore_blockheight: {
    height: number;
  };
  tx_redeem_fee: number;
  tx_refund_fee: number;
  tx_cancel_fee: number;
  tx_lock: TxLock;
}

export interface DbState5 {
  monero_wallet_restore_blockheight: {
    height: number;
  };
  tx_lock: TxLock;
}

export interface DbState6 {
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  tx_refund_fee: number;
  tx_cancel_fee: number;
  tx_lock: TxLock;
}

export enum DbStateType {
  EXECUTION_SETUP_DONE = 'ExecutionSetupDone',
  BTC_LOCKED = 'BtcLocked',
  XMR_LOCK_PROOF_RECEIVED = 'XmrLockProofReceived',
  XMR_LOCKED = 'XmrLocked',
  ENC_SIG_SENT = 'EncSigSent',
  BTC_REDEEMED = 'BtcRedeemed',
  DONE_XMR_REDEEMED = 'XmrRedeemed',
  CANCEL_TIMELOCK_EXPIRED = 'CancelTimelockExpired',
  BTC_CANCELLED = 'BtcCancelled',
  DONE_BTC_REFUNDED = 'BtcRefunded',
  DONE_BTC_PUNISHED = 'BtcPunished',
}

// See https://github.com/comit-network/xmr-btc-swap/blob/50ae54141255e03dba3d2b09036b1caa4a63e5a3/swap/src/protocol/bob/state.rs#L55
export function getHumanReadableDbStateType(type: DbStateType): string {
  switch (type) {
    case DbStateType.EXECUTION_SETUP_DONE:
      return 'Swap has been initiated';
    case DbStateType.BTC_LOCKED:
      return 'Bitcoin has been locked';
    case DbStateType.XMR_LOCK_PROOF_RECEIVED:
      return 'Monero lock transaction transfer proof has been received';
    case DbStateType.XMR_LOCKED:
      return 'Monero has been locked';
    case DbStateType.ENC_SIG_SENT:
      return 'Encrypted signature has been sent';
    case DbStateType.BTC_REDEEMED:
      return 'Bitcoin has been redeemed';
    case DbStateType.CANCEL_TIMELOCK_EXPIRED:
      return 'Cancel timelock has expired';
    case DbStateType.BTC_CANCELLED:
      return 'Swap has been cancelled';
    case DbStateType.DONE_BTC_REFUNDED:
      return 'Bitcoin has been refunded';
    case DbStateType.DONE_XMR_REDEEMED:
      return 'Monero has been redeemed';
    case DbStateType.DONE_BTC_PUNISHED:
      return 'Bitcoin has been punished';
    default:
      return 'unknown';
  }
}

export enum DbStatePathType {
  HAPPY_PATH = 'happy path',
  UNHAPPY_PATH = 'unhappy path',
}

export interface MergedDbState {
  swapId: string;
  type: DbStateType;
  state: ExecutionSetupDoneDbState; // Only ExecutionSetupDone states or more are saved
  provider: Provider;
  firstEnteredDate: number;
}

export function isMergedDbState(dbState: unknown): dbState is MergedDbState {
  return (
    isObject(dbState) &&
    'swapId' in dbState &&
    'type' in dbState &&
    'state' in dbState &&
    'provider' in dbState &&
    'firstEnteredDate' in dbState
  );
}

export interface MergedExecutionSetupDoneDbState extends MergedDbState {
  type: DbStateType.EXECUTION_SETUP_DONE;
  state: ExecutionSetupDoneDbState;
}

export function isMergedExecutionSetupDoneDbState(
  dbState: MergedDbState
): dbState is MergedExecutionSetupDoneDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    dbState.type === DbStateType.EXECUTION_SETUP_DONE
  );
}

export interface MergedBtcLockedDbState extends MergedDbState {
  type: DbStateType.BTC_LOCKED;
  state: ExecutionSetupDoneDbState & BtcLockedDbState;
}

export function isMergedBtcLockedDbState(
  dbState: MergedDbState
): dbState is MergedBtcLockedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    dbState.type === DbStateType.BTC_LOCKED
  );
}

export interface MergedXmrLockProofReceivedDbState extends MergedDbState {
  type: DbStateType.XMR_LOCK_PROOF_RECEIVED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    XmrLockProofReceivedDbState;
}

export function isMergedXmrLockProofReceivedDbState(
  dbState: MergedDbState
): dbState is MergedXmrLockProofReceivedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isXmrLockProofReceivedDbState(dbState.state) &&
    dbState.type === DbStateType.XMR_LOCK_PROOF_RECEIVED
  );
}

export interface MergedXmrLockedDbState extends MergedDbState {
  type: DbStateType.XMR_LOCKED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    XmrLockProofReceivedDbState &
    XmrLockedDbState;
}

export function isMergedXmrLockedDbState(
  dbState: MergedDbState
): dbState is MergedXmrLockedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isXmrLockProofReceivedDbState(dbState.state) &&
    isXmrLockedDbState(dbState.state) &&
    dbState.type === DbStateType.XMR_LOCKED
  );
}

export interface MergedEncSigSentDbState extends MergedDbState {
  type: DbStateType.ENC_SIG_SENT;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    XmrLockProofReceivedDbState &
    XmrLockedDbState &
    EncSigSentDbState;
}

export function isMergedEncSigSentDbState(
  dbState: MergedDbState
): dbState is MergedEncSigSentDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isXmrLockProofReceivedDbState(dbState.state) &&
    isXmrLockedDbState(dbState.state) &&
    isEncSigSentDbState(dbState.state) &&
    dbState.type === DbStateType.ENC_SIG_SENT
  );
}

export interface MergedBtcRedeemedDbState extends MergedDbState {
  type: DbStateType.BTC_REDEEMED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    XmrLockProofReceivedDbState &
    XmrLockedDbState &
    EncSigSentDbState &
    BtcRedeemedDbState;
}

export function isMergedBtcRedeemedDbState(
  dbState: MergedDbState
): dbState is MergedBtcRedeemedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isXmrLockProofReceivedDbState(dbState.state) &&
    isXmrLockedDbState(dbState.state) &&
    isEncSigSentDbState(dbState.state) &&
    isBtcRedeemedDbState(dbState.state) &&
    dbState.type === DbStateType.BTC_REDEEMED
  );
}

export interface MergedDoneXmrRedeemedDbState extends MergedDbState {
  type: DbStateType.DONE_XMR_REDEEMED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    XmrLockProofReceivedDbState &
    XmrLockedDbState &
    EncSigSentDbState &
    BtcRedeemedDbState &
    DoneXmrRedeemedDbState;
}

export function isMergedDoneXmrRedeemedDbState(
  dbState: MergedDbState
): dbState is MergedDoneXmrRedeemedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isXmrLockProofReceivedDbState(dbState.state) &&
    isXmrLockedDbState(dbState.state) &&
    isEncSigSentDbState(dbState.state) &&
    isBtcRedeemedDbState(dbState.state) &&
    isDoneXmrRedeemedDbState(dbState.state) &&
    dbState.type === DbStateType.DONE_XMR_REDEEMED
  );
}

export interface MergedCancelTimelockExpiredDbState extends MergedDbState {
  type: DbStateType.CANCEL_TIMELOCK_EXPIRED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState;
}

export function isMergedCancelTimelockExpiredDbState(
  dbState: MergedDbState
): dbState is MergedCancelTimelockExpiredDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    dbState.type === DbStateType.CANCEL_TIMELOCK_EXPIRED
  );
}

export interface MergedBtcCancelledDbState extends MergedDbState {
  type: DbStateType.BTC_CANCELLED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState &
    BtcCancelledDbState;
}

export function isMergedBtcCancelledDbState(
  dbState: MergedDbState
): dbState is MergedBtcCancelledDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    dbState.type === DbStateType.BTC_CANCELLED
  );
}

export interface MergedDoneBtcRefundedDbState extends MergedDbState {
  type: DbStateType.DONE_BTC_REFUNDED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState &
    BtcCancelledDbState &
    DoneBtcRefundedDbState;
}

export function isMergedDoneBtcRefundedDbState(
  dbState: MergedDbState
): dbState is MergedDoneBtcRefundedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    isDoneBtcRefundedDbState(dbState.state) &&
    dbState.type === DbStateType.DONE_BTC_REFUNDED
  );
}

export interface MergedDoneBtcPunishedDbState extends MergedDbState {
  type: DbStateType.DONE_BTC_PUNISHED;
  state: ExecutionSetupDoneDbState &
    BtcLockedDbState &
    CancelTimelockExpiredDbState &
    BtcCancelledDbState &
    DoneBtcPunishedDbState;
}

export function isMergedDoneBtcPunishedDbState(
  dbState: MergedDbState
): dbState is MergedDoneBtcPunishedDbState {
  return (
    isExecutionSetupDoneDbState(dbState.state) &&
    isBtcLockedDbState(dbState.state) &&
    isCancelTimelockExpiredDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    isDoneBtcPunishedDbState(dbState.state) &&
    dbState.type === DbStateType.DONE_BTC_PUNISHED
  );
}

export function getSwapTxFees(dbState: MergedDbState): number {
  const tx = dbState.state.Bob.ExecutionSetupDone.state2.tx_lock;

  const sumInput = tx.inner.inputs
    .map((input) => input.witness_utxo.value)
    .reduce((prev, next) => prev + next);

  const sumOutput = tx.inner.global.unsigned_tx.output
    .map((output) => output.value)
    .reduce((prev, next) => prev + next);

  return satsToBtc(sumInput - sumOutput);
}

export function getSwapBtcAmount(dbState: MergedDbState): number {
  return satsToBtc(
    dbState.state.Bob.ExecutionSetupDone.state2.tx_lock.inner.global.unsigned_tx
      .output[0]?.value
  );
}

export function getSwapXmrAmount(dbState: MergedDbState): number {
  return pionerosToXmr(dbState.state.Bob.ExecutionSetupDone.state2.xmr);
}

export function getSwapExchangeRate(dbState: MergedDbState): number {
  const btcAmount = getSwapBtcAmount(dbState);
  const xmrAmount = getSwapXmrAmount(dbState);

  return btcAmount / xmrAmount;
}

// See https://github.com/comit-network/xmr-btc-swap/blob/50ae54141255e03dba3d2b09036b1caa4a63e5a3/swap/src/protocol/bob/swap.rs#L11
export function isSwapResumable(dbState: MergedDbState): boolean {
  // TODO: Add SafelyAborted db state
  return !(
    isMergedDoneBtcRefundedDbState(dbState) ||
    isMergedDoneXmrRedeemedDbState(dbState) ||
    isMergedDoneBtcPunishedDbState(dbState)
  );
}

export function isSwapCancellable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    !isBtcRedeemedDbState(dbState.state) &&
    !isBtcCancelledDbState(dbState.state)
  );
}

export function isSwapRefundable(dbState: MergedDbState): boolean {
  return (
    isBtcLockedDbState(dbState.state) &&
    isBtcCancelledDbState(dbState.state) &&
    !isDoneBtcRefundedDbState(dbState.state) &&
    !isDoneBtcPunishedDbState(dbState.state)
  );
}

export function isHappyPathSwap(dbState: MergedDbState): boolean {
  return (
    isMergedExecutionSetupDoneDbState(dbState) ||
    isMergedBtcLockedDbState(dbState) ||
    isMergedXmrLockProofReceivedDbState(dbState) ||
    isMergedXmrLockedDbState(dbState) ||
    isMergedEncSigSentDbState(dbState) ||
    isMergedBtcRedeemedDbState(dbState) ||
    isMergedDoneXmrRedeemedDbState(dbState)
  );
}

export function isUnhappyPathSwap(dbState: MergedDbState): boolean {
  return (
    isMergedCancelTimelockExpiredDbState(dbState) ||
    isMergedBtcCancelledDbState(dbState) ||
    isMergedDoneBtcRefundedDbState(dbState) ||
    isMergedDoneBtcPunishedDbState(dbState)
  );
}

export function getTypeOfPathDbState(dbState: MergedDbState): DbStatePathType {
  if (isHappyPathSwap(dbState)) {
    return DbStatePathType.HAPPY_PATH;
  }
  if (isUnhappyPathSwap(dbState)) {
    return DbStatePathType.UNHAPPY_PATH;
  }
  logger.error({ dbState }, 'Unknown path type. Assuming happy path');
  return DbStatePathType.HAPPY_PATH;
}
