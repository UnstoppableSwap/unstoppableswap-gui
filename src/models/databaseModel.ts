import { pionerosToXmr, satsToBtc } from '../utils/conversionUtils';
import { TxLock } from './bitcoinModel';
import logger from '../utils/logger';
import { ExtendedSwapInfo } from '../store/features/rpcSlice';
import { SwapStateName } from './rpcModel';

export interface DbState {
  Bob: {
    [stateName: string]: unknown;
  };
}

export function isDbState(dbState: unknown): dbState is DbState {
  return typeof dbState === 'object' && dbState !== null && 'Bob' in dbState;
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

// See https://github.com/comit-network/xmr-btc-swap/blob/50ae54141255e03dba3d2b09036b1caa4a63e5a3/swap/src/protocol/bob/state.rs#L55
export function getHumanReadableDbStateType(type: SwapStateName): string {
  switch (type) {
    case SwapStateName.SwapSetupCompleted:
      return 'Swap has been initiated';
    case SwapStateName.BtcLocked:
      return 'Bitcoin has been locked';
    case SwapStateName.XmrLockProofReceived:
      return 'Monero lock transaction transfer proof has been received';
    case SwapStateName.XmrLocked:
      return 'Monero has been locked';
    case SwapStateName.EncSigSent:
      return 'Encrypted signature has been sent';
    case SwapStateName.BtcRedeemed:
      return 'Bitcoin has been redeemed';
    case SwapStateName.CancelTimelockExpired:
      return 'Cancel timelock has expired';
    case SwapStateName.BtcCancelled:
      return 'Swap has been cancelled';
    case SwapStateName.BtcRefunded:
      return 'Bitcoin has been refunded';
    case SwapStateName.XmrRedeemed:
      return 'Monero has been redeemed';
    case SwapStateName.BtcPunished:
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
  type: SwapStateName;
  raw: ExecutionSetupDoneDbState;
}

export interface MergedExecutionSetupDoneDbState extends MergedDbState {
  type: SwapStateName.SwapSetupCompleted;
  state: ExecutionSetupDoneDbState;
}

export function isMergedExecutionSetupDoneDbState(
  dbState: MergedDbState
): dbState is MergedExecutionSetupDoneDbState {
  return (
    isExecutionSetupDoneDbState(dbState.raw) &&
    dbState.type === SwapStateName.SwapSetupCompleted
  );
}

export function getSwapTxFees(swap: ExtendedSwapInfo): number {
  const tx = swap.state.raw.Bob.ExecutionSetupDone.state2.tx_lock;

  const sumInput = tx.inner.inputs
    .map((input) => input.witness_utxo.value)
    .reduce((prev, next) => prev + next);

  const sumOutput = tx.inner.unsigned_tx.output
    .map((output) => output.value)
    .reduce((prev, next) => prev + next);

  return satsToBtc(sumInput - sumOutput);
}

export function getSwapBtcAmount(swap: ExtendedSwapInfo): number {
  return satsToBtc(
    swap.state.raw.Bob.ExecutionSetupDone.state2.tx_lock.inner.unsigned_tx
      .output[0]?.value
  );
}

export function getSwapXmrAmount(swap: ExtendedSwapInfo): number {
  return pionerosToXmr(swap.state.raw.Bob.ExecutionSetupDone.state2.xmr);
}

export function getSwapExchangeRate(swap: ExtendedSwapInfo): number {
  const btcAmount = getSwapBtcAmount(swap);
  const xmrAmount = getSwapXmrAmount(swap);

  return btcAmount / xmrAmount;
}

export function getSwapRefundAddress(swap: ExtendedSwapInfo): string {
  return swap.state.raw.Bob.ExecutionSetupDone.state2.refund_address;
}

export function getSwapPunishTimelockOffset(swap: ExtendedSwapInfo): number {
  return swap.state.raw.Bob.ExecutionSetupDone.state2.punish_timelock;
}

// See https://github.com/comit-network/xmr-btc-swap/blob/50ae54141255e03dba3d2b09036b1caa4a63e5a3/swap/src/protocol/bob/swap.rs#L11
export function isSwapResumable(swap: ExtendedSwapInfo): boolean {
  // TODO: Add SafelyAborted db state
  return !swap.completed;
}

/*
Checks if a swap is in a state where it can possibly be cancelled

The following conditions must be met:
 - The bitcoin must be locked
 - The bitcoin must not be redeemed
 - The bitcoin must not be cancelled
 - The bitcoin must not be refunded
  - The bitcoin must not be punished

See: https://github.com/comit-network/xmr-btc-swap/blob/7023e75bb51ab26dff4c8fcccdc855d781ca4b15/swap/src/cli/cancel.rs#L16-L35
 */
export function isSwapCancellable(dbState: MergedDbState): boolean {
  return [
    SwapStateName.BtcLocked,
    SwapStateName.XmrLockProofReceived,
    SwapStateName.XmrLocked,
    SwapStateName.EncSigSent,
    SwapStateName.CancelTimelockExpired,
  ].includes(dbState.type);
}

/*
Checks if a swap is in a state where it can possibly be refunded (meaning it's not impossible)

The following conditions must be met:
 - The bitcoin must be locked
 - The bitcoin must not be redeemed
 - The bitcoin must not be refunded
 - The bitcoin must not be punished

See: https://github.com/comit-network/xmr-btc-swap/blob/7023e75bb51ab26dff4c8fcccdc855d781ca4b15/swap/src/cli/refund.rs#L16-L34
 */
export function isSwapRefundable(dbState: MergedDbState): boolean {
  return [
    SwapStateName.BtcLocked,
    SwapStateName.XmrLockProofReceived,
    SwapStateName.XmrLocked,
    SwapStateName.EncSigSent,
    SwapStateName.CancelTimelockExpired,
    SwapStateName.BtcCancelled,
  ].includes(dbState.type);
}

export function isHappyPathSwap(dbState: MergedDbState): boolean {
  return [
    SwapStateName.SwapSetupCompleted,
    SwapStateName.BtcLocked,
    SwapStateName.XmrLockProofReceived,
    SwapStateName.XmrLocked,
    SwapStateName.EncSigSent,
    SwapStateName.BtcRedeemed,
    SwapStateName.XmrRedeemed,
    // We assume here that safely aborted is "happy" because the user will not lose any funds
    SwapStateName.SafelyAborted,
  ].includes(dbState.type);
}

export function isUnhappyPathSwap(dbState: MergedDbState): boolean {
  return [
    SwapStateName.CancelTimelockExpired,
    SwapStateName.BtcCancelled,
    SwapStateName.BtcRefunded,
    SwapStateName.BtcPunished,
  ].includes(dbState.type);
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
