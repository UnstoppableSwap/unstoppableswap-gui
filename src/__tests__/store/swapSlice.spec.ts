import { AnyAction } from '@reduxjs/toolkit';
import {
  SwapSlice,
  SwapStateBtcLockInMempool,
  SwapStateType,
} from '../../models/storeModel';
import {
  CliLog,
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
import { Provider } from '../../models/apiModel';

const mWaitingForBtcDepositLog: CliLogWaitingForBtcDeposit = require('../mock_cli_logs/cli_log_waiting_for_bitcoin_deposit.json');
const mReceivedNewBtcLog: CliLogReceivedBtc = require('../mock_cli_logs/cli_log_received_bitcoin.json');
const mReceivedQuoteLog: CliLogReceivedQuote = require('../mock_cli_logs/cli_log_received_quote.json');
const mStartedCliLog: CliLogStartedSwap = require('../mock_cli_logs/cli_log_starting_new_swap.json');
const mPublishedBtcLockTxLog: CliLogPublishedBtcTx = require('../mock_cli_logs/cli_log_published_btc_lock_tx.json');
const mBobBtcTxLockStatusChanged: CliLogBtcTxStatusChanged = require('../mock_cli_logs/cli_log_bitcoin_transaction_status_changed.json');
const mAliceLockedXmrLog: CliLogAliceLockedXmr = require('../mock_cli_logs/cli_log_alice_locked_monero.json');
const mAliceXmrLockTxConfirmationUpdateLog: CliLogReceivedXmrLockTxConfirmation = require('../mock_cli_logs/cli_log_received_new_conf_for_monero_lock_tx.json');
const mAdvancingStateXmrIsLockedLog: CliLog = require('../mock_cli_logs/cli_log_advancing_state_xmr_is_locked.json');
const mAdvancingStateBtcRedeemedLog: CliLog = require('../mock_cli_logs/cli_log_advancing_state_btc_redeemed.json');
const mXmrRedeemSuccessfulLog: CliLogRedeemedXmr = require('../mock_cli_logs/cli_log_redeemed_xmr.json');

const mPublishedBtcCancelTxLog: CliLog = require('../mock_cli_logs/cli_log_published_btc_cancel_tx.json');
const mPublishedBtcRefundTxLog: CliLog = require('../mock_cli_logs/cli_log_published_btc_refund_tx.json');

function testChainedReducer(
  initialState: SwapSlice,
  states: [AnyAction, unknown][]
) {
  let state = initialState;

  states.forEach(([action, expectedState]) => {
    state = reducer(state, action);
    expect(state).toStrictEqual(expectedState);
  });
}

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
  const states: [AnyAction, unknown][] = [
    [
      swapInitiate({
        provider: exampleProvider,
        resume: false,
        swapId: null,
      }),
      {
        processRunning: true,
        logs: [],
        state: {
          type: SwapStateType.INITIATED,
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: null,
      },
    ],
    [
      swapAddLog([mReceivedQuoteLog]),
      {
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
      },
    ],
    [
      swapAddLog([mWaitingForBtcDepositLog]),
      {
        processRunning: true,
        logs: [mReceivedQuoteLog, mWaitingForBtcDepositLog],
        state: {
          type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
          depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
          maxGiveable: 0,
          minimumAmount: 0.0001,
          maximumAmount: 0.1,
          price: 0.00610233,
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: null,
      },
    ],
    [
      swapAddLog([mReceivedNewBtcLog]),
      {
        processRunning: true,
        logs: [mReceivedQuoteLog, mWaitingForBtcDepositLog, mReceivedNewBtcLog],
        state: {
          type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
          depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
          maxGiveable: 0.00099878,
          minimumAmount: 0.0001,
          maximumAmount: 0.1,
          price: 0.00610233,
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: null,
      },
    ],
    [
      swapAddLog([mStartedCliLog]),
      {
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
      },
    ],
    [
      swapAddLog([mPublishedBtcLockTxLog]),
      {
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
      },
    ],
    [
      swapAddLog([mBobBtcTxLockStatusChanged]),
      {
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
      },
    ],
    [
      swapAddLog([mAliceLockedXmrLog]),
      {
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
      },
    ],
    [
      swapAddLog([mAliceXmrLockTxConfirmationUpdateLog]),
      {
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
      },
    ],
    [
      swapAddLog([mAdvancingStateXmrIsLockedLog]),
      {
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
          mAdvancingStateXmrIsLockedLog,
        ],
        state: {
          type: SwapStateType.XMR_LOCKED,
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
      },
    ],
    [
      swapAddLog([mAdvancingStateBtcRedeemedLog]),
      {
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
          mAdvancingStateXmrIsLockedLog,
          mAdvancingStateBtcRedeemedLog,
        ],
        state: {
          type: SwapStateType.BTC_REDEEMED,
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
      },
    ],
    [
      swapAddLog([mXmrRedeemSuccessfulLog]),
      {
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
          mAdvancingStateXmrIsLockedLog,
          mAdvancingStateBtcRedeemedLog,
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
      },
    ],
    [
      swapProcessExited({
        exitCode: 0,
        exitSignal: null,
      }),
      {
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
          mAdvancingStateXmrIsLockedLog,
          mAdvancingStateBtcRedeemedLog,
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
      },
    ],
  ];

  testChainedReducer(initialSwapState, states);
});

test('should infer correct states from refund-path', () => {
  const states: [AnyAction, unknown][] = [
    [
      swapAddLog([mPublishedBtcCancelTxLog]),
      {
        processRunning: true,
        logs: [
          mReceivedQuoteLog,
          mWaitingForBtcDepositLog,
          mReceivedNewBtcLog,
          mStartedCliLog,
          mPublishedBtcLockTxLog,
          mBobBtcTxLockStatusChanged,
          mPublishedBtcCancelTxLog,
        ],
        state: {
          type: SwapStateType.BTC_CANCELLED,
          btcCancelTxId:
            '4b4f379f34e88084d0443886942d4f059a1ae1cc91102adae5654f4b3ea980f7',
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
      },
    ],
    [
      swapAddLog([mPublishedBtcRefundTxLog]),
      {
        processRunning: true,
        logs: [
          mReceivedQuoteLog,
          mWaitingForBtcDepositLog,
          mReceivedNewBtcLog,
          mStartedCliLog,
          mPublishedBtcLockTxLog,
          mBobBtcTxLockStatusChanged,
          mPublishedBtcCancelTxLog,
          mPublishedBtcRefundTxLog,
        ],
        state: {
          type: SwapStateType.BTC_REFUNDED,
          bobBtcRefundTxId:
            '4dfb63a139d5f00d31b55beeabcf229647f18d6f68c44e09d7750ee185a6b1f2',
        },
        provider: exampleProvider,
        stdOut: '',
        resume: false,
        swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
      },
    ],
  ];

  const initialBtcLockedState: SwapSlice = {
    processRunning: true,
    logs: [
      mReceivedQuoteLog,
      mWaitingForBtcDepositLog,
      mReceivedNewBtcLog,
      mStartedCliLog,
      mPublishedBtcLockTxLog,
      mBobBtcTxLockStatusChanged,
    ],
    state: <SwapStateBtcLockInMempool>{
      type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
      bobBtcLockTxId:
        '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
      bobBtcLockTxConfirmations: 3,
    },
    provider: exampleProvider,
    stdOut: '',
    resume: false,
    swapId: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  };

  testChainedReducer(initialBtcLockedState, states);
});
