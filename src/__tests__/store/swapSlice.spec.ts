import { AnyAction } from '@reduxjs/toolkit';
import { Provider, SwapSlice, SwapStateType } from '../../models/storeModel';
import {
  CliLogAliceLockedXmr,
  CliLogBtcTxStatusChanged,
  CliLogPublishedBtcTx,
  CliLogReceivedBtc,
  CliLogReceivedQuote,
  CliLogReceivedXmrLockTxConfirmation,
  CliLogRedeemedXmr,
  CliLogStartedSwap,
  CliLogWaitingForBtcDeposit,
} from '../../models/cliModel';

import reducer, {
  swapAddLog,
  swapInitiate,
  swapProcessExited,
} from '../../store/features/swapSlice';

const mWaitingForBtcDepositLog: CliLogWaitingForBtcDeposit = require('../mock_cli_logs/cli_log_waiting_for_bitcoin_deposit.json');
const mReceivedNewBtcLog: CliLogReceivedBtc = require('../mock_cli_logs/cli_log_received_bitcoin.json');
const mReceivedQuoteLog: CliLogReceivedQuote = require('../mock_cli_logs/cli_log_received_quote.json');
const mStartedCliLog: CliLogStartedSwap = require('../mock_cli_logs/cli_log_starting_new_swap.json');
const mPublishedBtcLockTxLog: CliLogPublishedBtcTx = require('../mock_cli_logs/cli_log_published_btc_lock_tx.json');
const mBobBtcTxLockStatusChanged: CliLogBtcTxStatusChanged = require('../mock_cli_logs/cli_log_bitcoin_transaction_status_changed.json');
const mAliceLockedXmrLog: CliLogAliceLockedXmr = require('../mock_cli_logs/cli_log_alice_locked_monero.json');
const mAliceXmrLockTxConfirmationUpdateLog: CliLogReceivedXmrLockTxConfirmation = require('../mock_cli_logs/cli_log_received_new_conf_for_monero_lock_tx.json');
const mXmrRedeemSuccessfulLog: CliLogRedeemedXmr = require('../mock_cli_logs/cli_log_redeemed_xmr.json');

const initialSwapState = {
  state: null,
  processRunning: false,
  logs: [],
  provider: null,
  stdOut: '',
  resume: null,
  swapId: null,
};

const exampleProvider: Provider = {
  multiAddr: '/dnsaddr/xmr.example',
  peerId: '12394294389438924',
  testnet: true,
};

test('should return the initial state', () => {
  expect(reducer(undefined, {} as AnyAction)).toEqual(initialSwapState);
});

test('should infer correct states from happy-path logs', () => {
  let swap: SwapSlice = initialSwapState;

  swap = reducer(
    swap,
    swapInitiate({
      provider: exampleProvider,
      resume: false,
    })
  );

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.INITIATED,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: null,
  });

  swap = reducer(swap, swapAddLog(mReceivedQuoteLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [mReceivedQuoteLog],
    state: {
      type: SwapStateType.RECEIVED_QUOTE,
      price: 0.00610233,
      minimumSwapAmount: 0.0001,
      maximumSwapAmount: 0.1,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: null,
  });

  swap = reducer(swap, swapAddLog(mWaitingForBtcDepositLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [mReceivedQuoteLog, mWaitingForBtcDepositLog],
    state: {
      type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
      depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
      maxGiveable: 0,
      minimumAmount: 0.0001,
      maximumAmount: 0.1,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: null,
  });

  swap = reducer(swap, swapAddLog(mReceivedNewBtcLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [mReceivedQuoteLog, mWaitingForBtcDepositLog, mReceivedNewBtcLog],
    state: {
      type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
      depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
      maxGiveable: 0.00099878,
      minimumAmount: 0.0001,
      maximumAmount: 0.1,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: null,
  });

  swap = reducer(swap, swapAddLog(mStartedCliLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
    ],
    state: {
      type: SwapStateType.STARTED,
      id: '2a034c59-72bc-4b7b-839f-d32522099bcc',
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });

  swap = reducer(swap, swapAddLog(mPublishedBtcLockTxLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
    ],
    state: {
      type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
      bobBtcLockTxId:
        '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
      bobBtcLockTxConfirmations: 0,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });

  swap = reducer(swap, swapAddLog(mBobBtcTxLockStatusChanged));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
      mBobBtcTxLockStatusChanged,
    ],
    state: {
      type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
      bobBtcLockTxId:
        '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
      bobBtcLockTxConfirmations: 3,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });

  swap = reducer(swap, swapAddLog(mAliceLockedXmrLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
      mBobBtcTxLockStatusChanged,
      mAliceLockedXmrLog,
    ],
    state: {
      type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
      aliceXmrLockTxId:
        'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
      aliceXmrLockTxConfirmations: 0,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });

  swap = reducer(swap, swapAddLog(mAliceXmrLockTxConfirmationUpdateLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
      mBobBtcTxLockStatusChanged,
      mAliceLockedXmrLog,
      mAliceXmrLockTxConfirmationUpdateLog,
    ],
    state: {
      type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
      aliceXmrLockTxId:
        'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
      aliceXmrLockTxConfirmations: 1,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });

  swap = reducer(swap, swapAddLog(mXmrRedeemSuccessfulLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
      mBobBtcTxLockStatusChanged,
      mAliceLockedXmrLog,
      mAliceXmrLockTxConfirmationUpdateLog,
      mXmrRedeemSuccessfulLog,
    ],
    state: {
      type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
      bobXmrRedeemTxId:
        'eadda576b5929c55bcc58f55c24bb52ac1853edb7d3b068ab67a3f66b0a1c546',
      bobXmrRedeemAddress:
        '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });

  swap = reducer(
    swap,
    swapProcessExited({
      exitCode: 0,
      exitSignal: null,
    })
  );

  expect(swap).toStrictEqual({
    processRunning: false,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
      mBobBtcTxLockStatusChanged,
      mAliceLockedXmrLog,
      mAliceXmrLockTxConfirmationUpdateLog,
      mXmrRedeemSuccessfulLog,
    ],
    state: {
      type: SwapStateType.PROCESS_EXITED,
      exitSignal: null,
      exitCode: 0,
      prevState: {
        type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
        bobXmrRedeemTxId:
          'eadda576b5929c55bcc58f55c24bb52ac1853edb7d3b068ab67a3f66b0a1c546',
        bobXmrRedeemAddress:
          '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
      },
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  });
});
