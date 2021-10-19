import { AnyAction } from '@reduxjs/toolkit';
import { Provider, Swap, SwapStateType } from '../../models/storeModel';
import {
  SwapLogAliceLockedXmr,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedBtc,
  SwapLogReceivedQuote,
  SwapLogReceivedXmrLockTxConfirmation,
  SwapLogRedeemedXmr,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from '../../models/swapModel';

import reducer, {
  aliceLockedXmrLog,
  btcTransactionStatusChangedLog,
  initiateSwap,
  publishedBtcTransactionLog,
  receivedBtcLog,
  receivedQuoteLog,
  startingNewSwapLog,
  transferredXmrToWalletLog,
  waitingForBtcDepositLog,
  xmrLockStatusChangedLog,
} from '../../store/features/swap/swapSlice';

const mReceivedQuoteLog: SwapLogReceivedQuote = {
  timestamp: '2021-09-05 03:40:36',
  level: 'INFO',
  fields: {
    message: 'Received quote',
    price: '0.00610233 BTC',
    minimum_amount: '0.00010000 BTC',
    maximum_amount: '0.10000000 BTC',
  },
};

const mWaitingForBtcDepositLog: SwapLogWaitingForBtcDeposit = {
  timestamp: '2021-09-05 03:40:36',
  level: 'INFO',
  fields: {
    message: 'Waiting for Bitcoin deposit',
    deposit_address: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
    max_giveable: '0.00000000 BTC',
    minimum_amount: '0.00010000 BTC',
    maximum_amount: '0.10000000 BTC',
  },
};

const mReceivedNewBtcLog: SwapLogReceivedBtc = {
  timestamp: '2021-09-05 03:41:03',
  level: 'INFO',
  fields: {
    message: 'Received Bitcoin',
    new_balance: '0.00100000 BTC',
    max_giveable: '0.00099878 BTC',
  },
};

const mStartedSwapLog: SwapLogStartedSwap = {
  timestamp: '2021-09-05 03:41:03',
  level: 'INFO',
  fields: {
    message: 'Starting new swap',
    swap_id: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  },
};

const mPublishedBtcLockTxLog: SwapLogPublishedBtcTx = {
  timestamp: '2021-09-05 03:41:07',
  level: 'INFO',
  fields: {
    message: 'Published Bitcoin transaction',
    txid: '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
    kind: 'lock',
  },
};

const mBobBtcTxLockStatusChanged: SwapLogBtcTxStatusChanged = {
  timestamp: '2021-09-05 03:56:02',
  level: 'DEBUG',
  fields: {
    message: 'Bitcoin transaction status changed',
    txid: '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
    new_status: 'confirmed with 3 blocks',
  },
};

const mAliceLockedXmrLog: SwapLogAliceLockedXmr = {
  timestamp: '2021-09-05 03:56:52',
  level: 'INFO',
  fields: {
    message: 'Alice locked Monero',
    txid: 'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
  },
};

const mAliceXmrLockTxConfirmationUpdateLog: SwapLogReceivedXmrLockTxConfirmation =
  {
    timestamp: '2021-09-05 03:57:16',
    level: 'INFO',
    fields: {
      message: 'Received new confirmation for Monero lock tx',
      txid: 'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
      seen_confirmations: '1',
      needed_confirmations: '10',
    },
  };

const mXmrRedeemSuccessfulLog: SwapLogRedeemedXmr = {
  timestamp: '2021-09-05 04:07:37',
  level: 'INFO',
  fields: {
    message: 'Successfully transferred XMR to wallet',
    monero_receive_address:
      '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
    txid: 'eadda576b5929c55bcc58f55c24bb52ac1853edb7d3b068ab67a3f66b0a1c546',
  },
};

const initialSwapState = {
  state: null,
  processRunning: false,
  logs: [],
  provider: null,
  stdOut: '',
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
  let swap: Swap = initialSwapState;

  swap = reducer(
    swap,
    initiateSwap({
      provider: exampleProvider,
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
  });

  swap = reducer(swap, receivedQuoteLog(mReceivedQuoteLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.RECEIVED_QUOTE,
      price: 0.00610233,
      minimumSwapAmount: 0.0001,
      maximumSwapAmount: 0.1,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(swap, waitingForBtcDepositLog(mWaitingForBtcDepositLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
      depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
      maxGiveable: 0,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(swap, receivedBtcLog(mReceivedNewBtcLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
      depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
      maxGiveable: 0.00099878,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(swap, startingNewSwapLog(mStartedSwapLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.STARTED,
      id: '2a034c59-72bc-4b7b-839f-d32522099bcc',
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(swap, publishedBtcTransactionLog(mPublishedBtcLockTxLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
      bobBtcLockTxId:
        '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
      bobBtcLockTxConfirmations: 0,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(
    swap,
    btcTransactionStatusChangedLog(mBobBtcTxLockStatusChanged)
  );

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
      bobBtcLockTxId:
        '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
      bobBtcLockTxConfirmations: 3,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(swap, aliceLockedXmrLog(mAliceLockedXmrLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
      aliceXmrLockTxId:
        'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
      aliceXmrLockTxConfirmations: 0,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(
    swap,
    xmrLockStatusChangedLog(mAliceXmrLockTxConfirmationUpdateLog)
  );

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
      aliceXmrLockTxId:
        'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
      aliceXmrLockTxConfirmations: 1,
    },
    provider: exampleProvider,
    stdOut: '',
  });

  swap = reducer(swap, transferredXmrToWalletLog(mXmrRedeemSuccessfulLog));

  expect(swap).toStrictEqual({
    processRunning: true,
    logs: [],
    state: {
      type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
      bobXmrRedeemTxId:
        'eadda576b5929c55bcc58f55c24bb52ac1853edb7d3b068ab67a3f66b0a1c546',
    },
    provider: exampleProvider,
    stdOut: '',
  });
});
