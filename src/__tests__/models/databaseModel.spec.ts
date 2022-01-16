import {
  DbState,
  DbStatePathType,
  DbStateType,
  getTypeOfDbState,
  getTypeOfPathDbState,
  isBtcCancelledDbState,
  isBtcLockedDbState,
  isBtcRedeemedDbState,
  isCancelTimelockExpiredDbState,
  isDoneBtcPunishedDbState,
  isDoneBtcRefundedDbState,
  isDoneXmrRedeemedDbState,
  isEncSigSentDbState,
  isExecutionSetupDoneDbState,
  isMergedBtcCancelledDbState,
  isMergedBtcLockedDbState,
  isMergedBtcRedeemedDbState,
  isMergedCancelTimelockExpiredDbState,
  isMergedDoneBtcPunishedDbState,
  isMergedDoneBtcRefundedDbState,
  isMergedDoneXmrRedeemedDbState,
  isMergedEncSigSentDbState,
  isMergedExecutionSetupDoneDbState,
  isMergedXmrLockedDbState,
  isMergedXmrLockProofReceivedDbState,
  isXmrLockedDbState,
  isXmrLockProofReceivedDbState,
  MergedDbState,
} from '../../models/databaseModel';
import {
  mergedBtcCancelled,
  mergedBtcLockedState,
  mergedBtcPunished,
  mergedBtcRedeemedState,
  mergedBtcRefunded,
  mergedEncSigSentState,
  mergedExecutionSetupDoneState,
  mergedTimelockExpiredState,
  mergedXmrLockedState,
  mergedXmrLockProofReceivedState,
  mergedXmrRedeemedState,
} from '../__utils__/mock_db_states';
import encSigSentState from '../mock_db_states/db_state_enc_sig_sent.json';
import executionSetupDoneState from '../mock_db_states/db_state_execution_setup_done.json';
import btcLockedState from '../mock_db_states/db_state_btc_locked.json';
import xmrLockProofReceivedState from '../mock_db_states/db_state_xmr_lock_proof_received.json';
import xmrLockedState from '../mock_db_states/db_state_xmr_locked.json';
import btcRedeemedState from '../mock_db_states/db_state_btc_redeemed.json';
import doneXmrRedeemedState from '../mock_db_states/db_state_done_xmr_redeemed.json';
import cancelTimelockExpiredState from '../mock_db_states/db_state_cancel_timelock_expired.json';
import btcCancelledState from '../mock_db_states/db_state_btc_cancelled.json';
import doneBtcRefunded from '../mock_db_states/db_state_done_btc_refunded.json';
import doneBtcPunished from '../mock_db_states/db_state_done_btc_punished.json';

const singleStatesTypesAndTypeGuards: [
  state: DbState,
  type: DbStateType,
  typeGuardFunc: (state: DbState) => boolean
][] = [
  [
    executionSetupDoneState,
    DbStateType.EXECUTION_SETUP_DONE,
    isExecutionSetupDoneDbState,
  ],
  [btcLockedState, DbStateType.BTC_LOCKED, isBtcLockedDbState],
  [
    xmrLockProofReceivedState,
    DbStateType.XMR_LOCK_PROOF_RECEIVED,
    isXmrLockProofReceivedDbState,
  ],
  [xmrLockedState, DbStateType.XMR_LOCKED, isXmrLockedDbState],
  [encSigSentState, DbStateType.ENC_SIG_SENT, isEncSigSentDbState],
  [btcRedeemedState, DbStateType.BTC_REDEEMED, isBtcRedeemedDbState],
  [
    doneXmrRedeemedState,
    DbStateType.DONE_XMR_REDEEMED,
    isDoneXmrRedeemedDbState,
  ],
  [
    cancelTimelockExpiredState,
    DbStateType.CANCEL_TIMELOCK_EXPIRED,
    isCancelTimelockExpiredDbState,
  ],
  [btcCancelledState, DbStateType.BTC_CANCELLED, isBtcCancelledDbState],
  [doneBtcRefunded, DbStateType.DONE_BTC_REFUNDED, isDoneBtcRefundedDbState],
  [doneBtcPunished, DbStateType.DONE_BTC_PUNISHED, isDoneBtcPunishedDbState],
];

const mergedStatesAndTypeGuards: [
  state: MergedDbState,
  path: DbStatePathType,
  typeGuardFunc: (state: MergedDbState) => boolean
][] = [
  [
    mergedExecutionSetupDoneState,
    DbStatePathType.HAPPY_PATH,
    isMergedExecutionSetupDoneDbState,
  ],
  [mergedBtcLockedState, DbStatePathType.HAPPY_PATH, isMergedBtcLockedDbState],
  [
    mergedXmrLockProofReceivedState,
    DbStatePathType.HAPPY_PATH,
    isMergedXmrLockProofReceivedDbState,
  ],
  [mergedXmrLockedState, DbStatePathType.HAPPY_PATH, isMergedXmrLockedDbState],
  [
    mergedEncSigSentState,
    DbStatePathType.HAPPY_PATH,
    isMergedEncSigSentDbState,
  ],
  [
    mergedBtcRedeemedState,
    DbStatePathType.HAPPY_PATH,
    isMergedBtcRedeemedDbState,
  ],
  [
    mergedXmrRedeemedState,
    DbStatePathType.HAPPY_PATH,
    isMergedDoneXmrRedeemedDbState,
  ],
  [
    mergedTimelockExpiredState,
    DbStatePathType.UNHAPPY_PATH,
    isMergedCancelTimelockExpiredDbState,
  ],
  [
    mergedBtcCancelled,
    DbStatePathType.UNHAPPY_PATH,
    isMergedBtcCancelledDbState,
  ],
  [
    mergedBtcRefunded,
    DbStatePathType.UNHAPPY_PATH,
    isMergedDoneBtcRefundedDbState,
  ],
  [
    mergedBtcPunished,
    DbStatePathType.UNHAPPY_PATH,
    isMergedDoneBtcPunishedDbState,
  ],
];

describe('should correctly assess type guards and type of db state for single states', () => {
  test.each(singleStatesTypesAndTypeGuards)(
    `%o`,
    (state, type, typeGuardFunc) => {
      singleStatesTypesAndTypeGuards.forEach(([s]) => {
        expect(typeGuardFunc(s)).toBe(s === state);
      });
      singleStatesTypesAndTypeGuards.forEach(([s]) => {
        expect(getTypeOfDbState(s) === type).toBe(s === state);
      });

      expect.assertions(singleStatesTypesAndTypeGuards.length * 2);
    }
  );
});

describe('should correctly assess type guards for merged states', () => {
  test.each(mergedStatesAndTypeGuards)(
    `%o`,
    (state, pathType, typeGuardFunc) => {
      mergedStatesAndTypeGuards.forEach(([s]) => {
        expect(typeGuardFunc(s)).toBe(s === state);
      });

      expect(getTypeOfPathDbState(state)).toBe(pathType);

      expect.assertions(mergedStatesAndTypeGuards.length + 1);
    }
  );
});

test('same amount of merged and single stats', () => {
  expect(singleStatesTypesAndTypeGuards.length).toBe(
    mergedStatesAndTypeGuards.length
  );
});
