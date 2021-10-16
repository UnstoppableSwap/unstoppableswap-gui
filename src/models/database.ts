export interface EncapsulatedDbState {
  swap_id: string;
  state: DbState;
}

export type DbState =
  | ExecutionSetupDoneDbState
  | BtcLockedDbState
  | XmrLockProofReceivedDbState
  | XmrLockedDbState
  | EncSigSentDbState
  | BtcRedeemedDbState
  | DoneXmrRedeemedDbState
  | CancelTimelockExpiredDbState
  | BtcCancelledDbState
  | DoneBtcRefundedDbState
  | DoneBtcPunishedDbState;

export interface ExecutionSetupDoneDbState {
  Bob: {
    ExecutionSetupDone: {
      state2: {
        xmr: number;
        cancel_timelock: number;
        punish_timelock: number;
        refund_address: string;
        redeem_address: string;
        punish_address: string;
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

export interface BtcLockedDbState {
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

export interface XmrLockProofReceivedDbState {
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

export interface XmrLockedDbState {
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

export interface EncSigSentDbState {
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

export interface BtcRedeemedDbState {
  Bob: {
    BtcRedeemed: DbState5;
  };
}

export function isBtcRedeemedDbState(
  dbState: DbState
): dbState is BtcRedeemedDbState {
  return 'BtcRedeemed' in dbState.Bob;
}

export interface DoneXmrRedeemedDbState {
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
    'Done' in dbState.Bob &&
    'XmrRedeemed' in (dbState as DoneXmrRedeemedDbState).Bob.Done
  );
}

export interface CancelTimelockExpiredDbState {
  Bob: {
    CancelTimelockExpired: DbState6;
  };
}

export function isCancelTimelockExpiredDbState(
  dbState: DbState
): dbState is CancelTimelockExpiredDbState {
  return 'CancelTimelockExpired' in dbState.Bob;
}

export interface BtcCancelledDbState {
  Bob: {
    BtcCancelled: DbState6;
  };
}

export function isBtcCancelledDbState(
  dbState: DbState
): dbState is BtcCancelledDbState {
  return 'BtcCancelled' in dbState.Bob;
}

export interface DoneBtcRefundedDbState {
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
    'Done' in dbState.Bob &&
    'BtcRefunded' in (dbState as DoneBtcRefundedDbState).Bob.Done
  );
}

export interface DoneBtcPunishedDbState {
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
    'Done' in dbState.Bob &&
    'BtcPunished' in (dbState as DoneXmrRedeemedDbState).Bob.Done
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
}

export interface DbState5 {
  monero_wallet_restore_blockheight: {
    height: number;
  };
}

export interface DbState6 {
  cancel_timelock: number;
  punish_timelock: number;
  refund_address: string;
  tx_refund_fee: number;
  tx_cancel_fee: number;
}
