import { piconerosToXmr, satsToBtc } from '../utils/conversionUtils';
import logger from '../utils/logger';
import { GetSwapInfoResponse, SwapStateName } from './rpcModel';

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

export function getSwapTxFees(swap: GetSwapInfoResponse): number {
  return satsToBtc(swap.txLockFee);
}

export function getSwapBtcAmount(swap: GetSwapInfoResponse): number {
  return satsToBtc(swap.btcAmount);
}

export function getSwapXmrAmount(swap: GetSwapInfoResponse): number {
  return piconerosToXmr(swap.xmrAmount);
}

export function getSwapExchangeRate(swap: GetSwapInfoResponse): number {
  const btcAmount = getSwapBtcAmount(swap);
  const xmrAmount = getSwapXmrAmount(swap);

  return btcAmount / xmrAmount;
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
export function isSwapCancellable(swapStateName: SwapStateName): boolean {
  return [
    SwapStateName.BtcLocked,
    SwapStateName.XmrLockProofReceived,
    SwapStateName.XmrLocked,
    SwapStateName.EncSigSent,
    SwapStateName.CancelTimelockExpired,
  ].includes(swapStateName);
}

export function isSwapMoneroRecoverable(swapStateName: SwapStateName): boolean {
  return [SwapStateName.BtcRedeemed].includes(swapStateName);
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
export function isSwapRefundable(swapStateName: SwapStateName): boolean {
  return [
    SwapStateName.BtcLocked,
    SwapStateName.XmrLockProofReceived,
    SwapStateName.XmrLocked,
    SwapStateName.EncSigSent,
    SwapStateName.CancelTimelockExpired,
    SwapStateName.BtcCancelled,
  ].includes(swapStateName);
}

export function isHappyPathSwap(swapStateName: SwapStateName): boolean {
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
  ].includes(swapStateName);
}

export function isUnhappyPathSwap(swapStateName: SwapStateName): boolean {
  return [
    SwapStateName.CancelTimelockExpired,
    SwapStateName.BtcCancelled,
    SwapStateName.BtcRefunded,
    SwapStateName.BtcPunished,
  ].includes(swapStateName);
}

export function getTypeOfPathDbState(
  swapStateName: SwapStateName
): DbStatePathType {
  if (isHappyPathSwap(swapStateName)) {
    return DbStatePathType.HAPPY_PATH;
  }
  if (isUnhappyPathSwap(swapStateName)) {
    return DbStatePathType.UNHAPPY_PATH;
  }
  logger.error({ swapStateName }, 'Unknown path type. Assuming happy path');
  return DbStatePathType.HAPPY_PATH;
}
