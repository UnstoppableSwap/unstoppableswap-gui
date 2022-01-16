import { merge } from 'lodash';
import {
  MergedExecutionSetupDoneDbState,
  DbStateType,
  MergedBtcLockedDbState,
  MergedXmrLockProofReceivedDbState,
  MergedXmrLockedDbState,
  MergedEncSigSentDbState,
  MergedBtcRedeemedDbState,
  MergedDoneXmrRedeemedDbState,
  MergedCancelTimelockExpiredDbState,
  MergedBtcCancelledDbState,
  MergedDoneBtcRefundedDbState,
  MergedDoneBtcPunishedDbState,
} from '../../models/databaseModel';
import { Provider } from '../../models/storeModel';

import executionSetupDoneState from '../mock_db_states/db_state_execution_setup_done.json';
import btcLockedState from '../mock_db_states/db_state_btc_locked.json';
import xmrLockProofReceivedState from '../mock_db_states/db_state_xmr_lock_proof_received.json';
import xmrLockedState from '../mock_db_states/db_state_xmr_locked.json';
import encSigSentState from '../mock_db_states/db_state_enc_sig_sent.json';
import btcRedeemedState from '../mock_db_states/db_state_btc_redeemed.json';
import doneXmrRedeemedState from '../mock_db_states/db_state_done_xmr_redeemed.json';
import cancelTimelockExpiredState from '../mock_db_states/db_state_cancel_timelock_expired.json';
import btcCancelledState from '../mock_db_states/db_state_btc_cancelled.json';
import doneBtcRefunded from '../mock_db_states/db_state_done_btc_refunded.json';
import doneBtcPunished from '../mock_db_states/db_state_done_btc_punished.json';

export const exampleSwapId = '15de9d95-a1f8-45e8-98a7-5327b940fc41';
export const exampleProvider: Provider = {
  multiAddr: '/dnsaddr/xmr.example',
  peerId: '32394294389438924',
  testnet: false,
};

export const mergedExecutionSetupDoneState: MergedExecutionSetupDoneDbState = {
  swapId: exampleSwapId,
  type: DbStateType.EXECUTION_SETUP_DONE,
  state: merge({}, executionSetupDoneState),
  provider: exampleProvider,
};

export const mergedBtcLockedState: MergedBtcLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_LOCKED,
  state: merge({}, executionSetupDoneState, btcLockedState),
  provider: exampleProvider,
};

export const mergedXmrLockProofReceivedState: MergedXmrLockProofReceivedDbState =
  {
    swapId: exampleSwapId,
    type: DbStateType.XMR_LOCK_PROOF_RECEIVED,
    state: merge(
      {},
      executionSetupDoneState,
      btcLockedState,
      xmrLockProofReceivedState
    ),
    provider: exampleProvider,
  };

export const mergedXmrLockedState: MergedXmrLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.XMR_LOCKED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    xmrLockProofReceivedState,
    xmrLockedState
  ),
  provider: exampleProvider,
};

export const mergedEncSigSentState: MergedEncSigSentDbState = {
  swapId: exampleSwapId,
  type: DbStateType.ENC_SIG_SENT,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    xmrLockProofReceivedState,
    xmrLockedState,
    encSigSentState
  ),
  provider: exampleProvider,
};

export const mergedBtcRedeemedState: MergedBtcRedeemedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_REDEEMED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    xmrLockProofReceivedState,
    xmrLockedState,
    encSigSentState,
    btcRedeemedState
  ),
  provider: exampleProvider,
};

export const mergedXmrRedeemedState: MergedDoneXmrRedeemedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_XMR_REDEEMED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    xmrLockProofReceivedState,
    xmrLockedState,
    encSigSentState,
    btcRedeemedState,
    doneXmrRedeemedState
  ),
  provider: exampleProvider,
};

export const mergedTimelockExpiredState: MergedCancelTimelockExpiredDbState = {
  swapId: exampleSwapId,
  type: DbStateType.CANCEL_TIMELOCK_EXPIRED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState
  ),
  provider: exampleProvider,
};

export const mergedBtcCancelled: MergedBtcCancelledDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_CANCELLED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState
  ),
  provider: exampleProvider,
};

export const mergedBtcRefunded: MergedDoneBtcRefundedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_BTC_REFUNDED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState,
    doneBtcRefunded
  ),
  provider: exampleProvider,
};

export const mergedBtcPunished: MergedDoneBtcPunishedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_BTC_PUNISHED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState,
    doneBtcPunished
  ),
  provider: exampleProvider,
};
