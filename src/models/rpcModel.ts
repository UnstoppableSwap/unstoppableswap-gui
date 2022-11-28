export enum RpcMethod {
  GET_BTC_BALANCE = 'get_bitcoin_balance',
  WITHDRAW_BTC = 'withdraw_btc',
}

export enum RpcProcessStateType {
  STARTED = 'started',
  LISTENING_FOR_CONNECTIONS = 'listening',
  EXITED = 'exited',
  NOT_STARTED = 'not started',
}

export const CLI_RPC_HTTP_ADDRESS = '127.0.0.1:1234';
