import { DbState } from './databaseModel';

export enum RpcMethod {
  GET_BTC_BALANCE = 'get_bitcoin_balance',
  WITHDRAW_BTC = 'withdraw_btc',
  BUY_XMR = 'buy_xmr',
  RESUME_SWAP = 'resume_swap',
  RAW_HISTORY = 'raw_get_history',
  LIST_SELLERS = 'list_sellers',
  GET_SELLER = 'get_seller',
  GET_SWAP_START_DATE = 'get_swap_start_date',
}

export enum RpcProcessStateType {
  STARTED = 'started',
  LISTENING_FOR_CONNECTIONS = 'listening',
  EXITED = 'exited',
  NOT_STARTED = 'not started',
}

export const CLI_RPC_HTTP_ADDRESS = '127.0.0.1:1234';

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

export interface WithdrawBitcoinResponse {
  txid: string;
}

export interface BalanceBitcoinResponse {
  balance: number;
}

export interface RawSwapHistoryResponse {
  [swapId: string]: DbState[];
}

export interface GetSellerResponse {
  peerId: string;
  addresses: string[];
}

export interface GetSwapStartDateResponse {
  start_date: string;
}
