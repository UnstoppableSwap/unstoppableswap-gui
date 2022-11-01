export enum SwapSpawnType {
  INIT = 'init',
  RESUME = 'resume',
  CANCEL_REFUND = 'cancel-refund',
}

export interface CliLog {
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN';
  fields: {
    message: string;
    [index: string]: unknown;
  };
}

export function isCliLog(log: unknown): log is CliLog {
  if (log) {
    return (
      'timestamp' in (log as CliLog) &&
      'level' in (log as CliLog) &&
      'fields' in (log as CliLog) &&
      typeof (log as CliLog).fields?.message === 'string'
    );
  }
  return false;
}

export interface CliLogReceivedQuote extends CliLog {
  fields: {
    message: 'Received quote';
    price: string;
    minimum_amount: string;
    maximum_amount: string;
  };
}

export function isCliLogReceivedQuote(log: CliLog): log is CliLogReceivedQuote {
  return log.fields.message === 'Received quote';
}

export interface CliLogWaitingForBtcDeposit extends CliLog {
  fields: {
    message: 'Waiting for Bitcoin deposit';
    deposit_address: string;
    max_giveable: string;
    minimum_amount: string;
    maximum_amount: string;
    min_deposit: string;
  };
}

export function isCliLogWaitingForBtcDeposit(
  log: CliLog
): log is CliLogWaitingForBtcDeposit {
  return log.fields.message === 'Waiting for Bitcoin deposit';
}

export interface CliLogReceivedBtc extends CliLog {
  fields: {
    message: 'Received Bitcoin';
    max_giveable: string;
    new_balance: string;
  };
}

export function isCliLogReceivedBtc(log: CliLog): log is CliLogReceivedBtc {
  return log.fields.message === 'Received Bitcoin';
}

export interface CliLogStartedSwap extends CliLog {
  fields: {
    message: 'Starting new swap';
    swap_id: string;
  };
}

export function isCliLogStartedSwap(log: CliLog): log is CliLogStartedSwap {
  return log.fields.message === 'Starting new swap';
}

export interface CliLogPublishedBtcTx extends CliLog {
  fields: {
    message: 'Published Bitcoin transaction';
    txid: string;
    kind: 'lock' | 'cancel' | 'withdraw' | 'refund';
  };
}

export function isCliLogPublishedBtcTx(
  log: CliLog
): log is CliLogPublishedBtcTx {
  return log.fields.message === 'Published Bitcoin transaction';
}

export interface CliLogBtcTxFound extends CliLog {
  fields: {
    message: 'Found relevant Bitcoin transaction';
    txid: string;
    status: string;
  };
}

export function isCliLogBtcTxFound(log: CliLog): log is CliLogBtcTxFound {
  return log.fields.message === 'Found relevant Bitcoin transaction';
}

export interface CliLogBtcTxStatusChanged extends CliLog {
  fields: {
    message: 'Bitcoin transaction status changed';
    txid: string;
    new_status: string;
  };
}

export function isCliLogBtcTxStatusChanged(
  log: CliLog
): log is CliLogBtcTxStatusChanged {
  return log.fields.message === 'Bitcoin transaction status changed';
}

export interface CliLogAliceLockedXmr extends CliLog {
  fields: {
    message: 'Alice locked Monero';
    txid: string;
  };
}

export function isCliLogAliceLockedXmr(
  log: CliLog
): log is CliLogAliceLockedXmr {
  return log.fields.message === 'Alice locked Monero';
}

export interface CliLogReceivedXmrLockTxConfirmation extends CliLog {
  fields: {
    message: 'Received new confirmation for Monero lock tx';
    txid: string;
    seen_confirmations: string;
    needed_confirmations: string;
  };
}

export interface CliLogFetchedPeerStatus extends CliLog {
  fields: {
    message: 'Fetched peer status';
    price: string;
    min_quantity: string;
    max_quantity: string;
    status: string;
    address: string;
  };
}

export function isCliLogReceivedXmrLockTxConfirmation(
  log: CliLog
): log is CliLogReceivedXmrLockTxConfirmation {
  return log.fields.message === 'Received new confirmation for Monero lock tx';
}

export interface CliLogAdvancingState extends CliLog {
  fields: {
    message: 'Advancing state';
    state:
      | 'quote has been requested'
      | 'execution setup done'
      | 'btc is locked'
      | 'XMR lock transaction transfer proof received'
      | 'xmr is locked'
      | 'encrypted signature is sent'
      | 'btc is redeemed'
      | 'cancel timelock is expired'
      | 'btc is cancelled'
      | 'btc is refunded'
      | 'xmr is redeemed'
      | 'btc is punished'
      | 'safely aborted';
  };
}

export function isCliLogAdvancingState(
  log: CliLog
): log is CliLogAdvancingState {
  return log.fields.message === 'Advancing state';
}

export interface CliLogRedeemedXmr extends CliLog {
  fields: {
    message: 'Successfully transferred XMR to wallet';
    monero_receive_address: string;
    txid: string;
  };
}

export function isCliLogRedeemedXmr(log: CliLog): log is CliLogRedeemedXmr {
  return log.fields.message === 'Successfully transferred XMR to wallet';
}

export interface CliLogCheckedBitcoinBalance extends CliLog {
  fields: {
    message: 'Checked Bitcoin balance';
    balance: string;
  };
}

export function isCliLogCheckedBitcoinBalance(
  log: CliLog
): log is CliLogCheckedBitcoinBalance {
  return log.fields.message === 'Checked Bitcoin balance';
}

export function isCliLogFetchedPeerStatus(
  log: CliLog
): log is CliLogFetchedPeerStatus {
  return log.fields.message === 'Fetched peer status';
}
