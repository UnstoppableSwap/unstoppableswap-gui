import { DbState } from './databaseModel';

export enum RpcMethod {
  GET_BTC_BALANCE = 'get_bitcoin_balance',
  WITHDRAW_BTC = 'withdraw_btc',
  BUY_XMR = 'buy_xmr',
  RESUME_SWAP = 'resume_swap',
  RAW_HISTORY = 'get_raw_history',
  LIST_SELLERS = 'list_sellers',
  CANCEL_REFUND_SWAP = 'cancel_refund_swap',
  GET_SWAP_INFO = 'get_swap_info',
  SUSPEND_CURRENT_SWAP = 'suspend_current_swap',
}

export enum RpcProcessStateType {
  STARTED = 'started',
  LISTENING_FOR_CONNECTIONS = 'listening',
  EXITED = 'exited',
  NOT_STARTED = 'not started',
}

export interface RpcSellerStatus {
  status:
    | {
        Online: {
          price: number;
          min_quantity: number;
          max_quantity: number;
        };
      }
    | 'Unreachable';
  multiaddr: string;
}

export type RawRpcResponseSuccess<T> = {
  jsonrpc: string;
  id: string;
  result: T;
};
export type RawRpcResponseError = {
  jsonrpc: string;
  id: string;
  error: { code: number; message: string };
};

export type RawRpcResponse<T> = RawRpcResponseSuccess<T> | RawRpcResponseError;

export function isSuccessResponse<T>(
  response: RawRpcResponse<T>
): response is RawRpcResponseSuccess<T> {
  return 'result' in response;
}

export function isErrorResponse<T>(
  response: RawRpcResponse<T>
): response is RawRpcResponseError {
  return 'error' in response;
}

export interface WithdrawBitcoinResponse {
  txid: string;
}

export interface BuyXmrResponse {
  swapId: string;
}

export type SwapTimelockInfoNone = {
  None: {
    blocks_left: number;
  };
};

export type SwapTimelockInfoCancelled = {
  Cancel: {
    blocks_left: number;
  };
};

export type SwapTimelockInfoPunished = 'Punish';

export type SwapTimelockInfo =
  | SwapTimelockInfoNone
  | SwapTimelockInfoCancelled
  | SwapTimelockInfoPunished;

export function isSwapTimelockInfoNone(
  info: SwapTimelockInfo
): info is SwapTimelockInfoNone {
  return typeof info === 'object' && 'None' in info;
}

export function isSwapTimelockInfoCancelled(
  info: SwapTimelockInfo
): info is SwapTimelockInfoCancelled {
  return typeof info === 'object' && 'Cancel' in info;
}

export function isSwapTimelockInfoPunished(
  info: SwapTimelockInfo
): info is SwapTimelockInfoPunished {
  return info === 'Punish';
}

export type SwapSellerInfo = {
  peerId: string;
  addresses: string[];
};

export interface GetSwapInfoResponse {
  swapId: string;
  completed: boolean;
  seller: SwapSellerInfo;
  startDate: string;
  stateName: SwapStateName;
  timelock: null | SwapTimelockInfo;
}

export interface BalanceBitcoinResponse {
  balance: number;
}

export interface RawSwapHistoryResponse {
  raw_history: {
    [swapId: string]: DbState[];
  };
}

export enum SwapStateName {
  Started = 'quote has been requested',
  SwapSetupCompleted = 'execution setup done',
  BtcLocked = 'btc is locked',
  XmrLockProofReceived = 'XMR lock transaction transfer proof received',
  XmrLocked = 'xmr is locked',
  EncSigSent = 'encrypted signature is sent',
  BtcRedeemed = 'btc is redeemed',
  CancelTimelockExpired = 'cancel timelock is expired',
  BtcCancelled = 'btc is cancelled',
  BtcRefunded = 'btc is refunded',
  XmrRedeemed = 'xmr is redeemed',
  BtcPunished = 'btc is punished',
  SafelyAborted = 'safely aborted',
}
