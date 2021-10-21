import { merge } from 'lodash';
import {
  DbState,
  DbStateType,
  getTypeOfDbState,
  isBtcCancelledDbState,
  isBtcLockedDbState,
  isBtcRedeemedDbState,
  isCancelTimelockExpiredDbState,
  isDoneBtcPunishedDbState,
  isDoneXmrRedeemedDbState,
  isEncSigSentDbState,
  isExecutionSetupDoneDbState,
  isMergedBtcCancelledDbState,
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedCancelTimelockExpiredDbState,
  isMergedDoneBtcPunishedDbState,
  isMergedDoneXmrRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedXmrLockedDbState,
  isMergedXmrLockProofReceivedDbState,
  isXmrLockedDbState,
  isXmrLockProofReceivedDbState,
  MergedBtcCancelledDbState,
  MergedBtcLockedDbState,
  MergedBtcRedeemedDbState,
  MergedCancelTimelockExpiredDbState,
  MergedDbState,
  MergedDoneBtcPunishedDbState,
  MergedDoneXmrRedeemedDbState,
  MergedEncSigSentDbState,
  MergedExecutionSetupDoneDbState,
  MergedXmrLockedDbState,
  MergedXmrLockProofReceivedDbState,
} from '../../models/databaseModel';

const executionSetupDoneState = require('./example_states/execution_setup_done.json');
const btcLockedState = require('./example_states/btc_locked.json');
const xmrLockProofReceivedState = require('./example_states/xmr_lock_proof_received.json');
const xmrLockedState = require('./example_states/xmr_locked.json');
const encSigSentState = require('./example_states/enc_sig_sent.json');
const btcRedeemedState = require('./example_states/btc_redeemed.json');
const doneXmrRedeemedState = require('./example_states/done_xmr_redeemed.json');
const cancelTimelockExpiredState = require('./example_states/cancel_timelock_expired.json');
const btcCancelledState = require('./example_states/btc_cancelled.json');
const doneBtcPunished = require('./example_states/done_btc_punished.json');

/*
TODO!
Add btc refunded case
 */

const allSingleStates = [
  executionSetupDoneState,
  btcLockedState,
  xmrLockProofReceivedState,
  xmrLockedState,
  encSigSentState,
  btcRedeemedState,
  doneXmrRedeemedState,
  btcCancelledState,
  doneBtcPunished,
  cancelTimelockExpiredState,
];

const exampleSwapId = '15de9d95-a1f8-45e8-98a7-5327b940fc41';

const mergedExecutionSetupDoneState: MergedExecutionSetupDoneDbState = {
  swapId: exampleSwapId,
  type: DbStateType.EXECUTION_SETUP_DONE,
  state: merge({}, executionSetupDoneState),
};

const mergedBtcLockedState: MergedBtcLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_LOCKED,
  state: merge({}, executionSetupDoneState, btcLockedState),
};

const mergedXmrLockProofReceivedState: MergedXmrLockProofReceivedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.XMR_LOCK_PROOF_RECEIVED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    xmrLockProofReceivedState
  ),
};

const mergedXmrLockedState: MergedXmrLockedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.XMR_LOCKED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    xmrLockProofReceivedState,
    xmrLockedState
  ),
};

const mergedEncSigSentState: MergedEncSigSentDbState = {
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
};

const mergedBtcRedeemedState: MergedBtcRedeemedDbState = {
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
};

const mergedXmrRedeemedState: MergedDoneXmrRedeemedDbState = {
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
};

const mergedTimelockExpiredState: MergedCancelTimelockExpiredDbState = {
  swapId: exampleSwapId,
  type: DbStateType.CANCEL_TIMELOCK_EXPIRED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState
  ),
};

const mergedBtcCancelled: MergedBtcCancelledDbState = {
  swapId: exampleSwapId,
  type: DbStateType.BTC_CANCELLED,
  state: merge(
    {},
    executionSetupDoneState,
    btcLockedState,
    cancelTimelockExpiredState,
    btcCancelledState
  ),
};

const mergedBtcPunished: MergedDoneBtcPunishedDbState = {
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
};

const allMergedStates = [
  mergedExecutionSetupDoneState,
  mergedBtcLockedState,
  mergedXmrLockProofReceivedState,
  mergedXmrLockedState,
  mergedEncSigSentState,
  mergedBtcRedeemedState,
  mergedXmrRedeemedState,
  mergedTimelockExpiredState,
  mergedBtcCancelled,
  mergedBtcPunished,
];

/*
TODO!
Add test case for btc refunded

const mergedBtcRefunded: MergedDoneBtcRefundedDbState = {
  swapId: exampleSwapId,
  type: DbStateType.DONE_BTC_REFUNDED,
  state: merge({}, executionSetupDoneState, btcLockedState, btcCancelledState, ),
}; */

test('should correctly get type of state', () => {
  expect(getTypeOfDbState(executionSetupDoneState)).toBe(
    DbStateType.EXECUTION_SETUP_DONE
  );
  expect(getTypeOfDbState(btcLockedState)).toBe(DbStateType.BTC_LOCKED);
  expect(getTypeOfDbState(xmrLockProofReceivedState)).toBe(
    DbStateType.XMR_LOCK_PROOF_RECEIVED
  );
  expect(getTypeOfDbState(xmrLockedState)).toBe(DbStateType.XMR_LOCKED);
  expect(getTypeOfDbState(encSigSentState)).toBe(DbStateType.ENC_SIG_SENT);
  expect(getTypeOfDbState(btcRedeemedState)).toBe(DbStateType.BTC_REDEEMED);
  expect(getTypeOfDbState(doneXmrRedeemedState)).toBe(
    DbStateType.DONE_XMR_REDEEMED
  );
  expect(getTypeOfDbState(cancelTimelockExpiredState)).toBe(
    DbStateType.CANCEL_TIMELOCK_EXPIRED
  );
  expect(getTypeOfDbState(btcCancelledState)).toBe(DbStateType.BTC_CANCELLED);
  expect(getTypeOfDbState(doneBtcPunished)).toBe(DbStateType.DONE_BTC_PUNISHED);

  expect.assertions(allSingleStates.length);
});

describe('should correctly assess type guards for single states', () => {
  const statesAndTypeGuards: [
    state: DbState,
    typeGuardFunc: (state: DbState) => boolean
  ][] = [
    [executionSetupDoneState, isExecutionSetupDoneDbState],
    [btcLockedState, isBtcLockedDbState],
    [xmrLockProofReceivedState, isXmrLockProofReceivedDbState],
    [xmrLockedState, isXmrLockedDbState],
    [encSigSentState, isEncSigSentDbState],
    [btcRedeemedState, isBtcRedeemedDbState],
    [doneXmrRedeemedState, isDoneXmrRedeemedDbState],
    [cancelTimelockExpiredState, isCancelTimelockExpiredDbState],
    [btcCancelledState, isBtcCancelledDbState],
    [doneBtcPunished, isDoneBtcPunishedDbState],
  ];

  test.each(statesAndTypeGuards)(`%o`, (state, typeGuardFunc) => {
    allSingleStates.forEach((s) => {
      expect(typeGuardFunc(s)).toBe(s === state);
    });

    expect.assertions(allSingleStates.length);
  });

  test('correct amount of single states', () => {
    expect(statesAndTypeGuards.length).toBe(allSingleStates.length);
    expect(allSingleStates.length).toBe(allMergedStates.length);
  });
});

describe('should correctly assess type guards for encapsulated states', () => {
  const mergedStatesAndTypeGuards: [
    state: MergedDbState,
    typeGuardFunc: (state: MergedDbState) => boolean
  ][] = [
    [mergedExecutionSetupDoneState, isMergedExecutionSetupDoneDbState],
    [mergedBtcLockedState, isMergedBtcLockedDbState],
    [mergedXmrLockProofReceivedState, isMergedXmrLockProofReceivedDbState],
    [mergedXmrLockedState, isMergedXmrLockedDbState],
    [mergedEncSigSentState, isMergedEncSigSentDbState],
    [mergedBtcRedeemedState, isMergedBtcRedeemedDbState],
    [mergedXmrRedeemedState, isMergedDoneXmrRedeemedDbState],
    [mergedTimelockExpiredState, isMergedCancelTimelockExpiredDbState],
    [mergedBtcCancelled, isMergedBtcCancelledDbState],
    [mergedBtcPunished, isMergedDoneBtcPunishedDbState],
  ];

  test.each(mergedStatesAndTypeGuards)(`%o`, (state, typeGuardFunc) => {
    allMergedStates.forEach((s) => {
      expect(typeGuardFunc(s)).toBe(s === state);
    });

    expect.assertions(allMergedStates.length);
  });

  test('correct amount of merged states', () => {
    expect(mergedStatesAndTypeGuards.length).toBe(allMergedStates.length);
    expect(allMergedStates.length).toBe(allSingleStates.length);
  });
});