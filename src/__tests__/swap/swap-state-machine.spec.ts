import {
  getNextState,
  SwapLog,
  SwapState,
  SwapStateBtcLockInMempool,
  SwapStateInitiated,
  SwapStateReceivedQuote,
  SwapStateStarted,
  SwapStateWaitingForBtcDeposit,
  SwapStateXmrLockInMempool,
  SwapStateXmrRedeemInMempool,
} from '../../swap/swap-state-machine';

const receivedQuoteLog: SwapLog = {
  timestamp: '2021-09-05 03:40:36',
  level: 'INFO',
  fields: {
    message: 'Received quote',
    price: '0.00610233 BTC',
    minimum_amount: '0.00010000 BTC',
    maximum_amount: '0.10000000 BTC',
  },
};

const waitingForBitcoinDepositLog: SwapLog = {
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

const receivedNewBitcoinLog: SwapLog = {
  timestamp: '2021-09-05 03:41:03',
  level: 'INFO',
  fields: {
    message: 'Received Bitcoin',
    new_balance: '0.00100000 BTC',
    max_giveable: '0.00099878 BTC',
  },
};

const startedSwapLog: SwapLog = {
  timestamp: '2021-09-05 03:41:03',
  level: 'INFO',
  fields: {
    message: 'Starting new swap',
    amount: '0.00099878 BTC',
    fees: '0.00000122 BTC',
    swap_id: '2a034c59-72bc-4b7b-839f-d32522099bcc',
  },
};

const publishedBtcLockTxLog: SwapLog = {
  timestamp: '2021-09-05 03:41:07',
  level: 'INFO',
  fields: {
    message: 'Published Bitcoin transaction',
    txid: '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
    kind: 'lock',
  },
};

const bobBtcTxLockStatusChanged: SwapLog = {
  timestamp: '2021-09-05 03:56:02',
  level: 'DEBUG',
  fields: {
    message: 'Bitcoin transaction status changed',
    txid: '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
    new_status: 'confirmed with 3 blocks',
    old_status: 'confirmed with 2 blocks',
  },
};

const aliceLockedMoneroLog: SwapLog = {
  timestamp: '2021-09-05 03:56:52',
  level: 'INFO',
  fields: {
    message: 'Alice locked Monero',
    txid: 'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
  },
};

const aliceXmrLockTxConfirmationUpdateLog: SwapLog = {
  timestamp: '2021-09-05 03:57:16',
  level: 'INFO',
  fields: {
    message: 'Received new confirmation for Monero lock tx',
    txid: 'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
    seen_confirmations: '1',
    needed_confirmations: '10',
  },
};

const xmrRedeemSuccessfulLog: SwapLog = {
  timestamp: '2021-09-05 04:07:37',
  level: 'INFO',
  fields: {
    message: 'Successfully transferred XMR to wallet',
    monero_receive_address:
      '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
    txid: 'eadda576b5929c55bcc58f55c24bb52ac1853edb7d3b068ab67a3f66b0a1c546',
  },
};

test('should infer correct states from happy-path logs', () => {
  const initiatedState: SwapStateInitiated = {
    provider: {
      multiAddr: '/dns4/xmr.swap/tcp/9939',
      peerId: '12D3KooWCdMKjesXMJz1SiZ7HgotrxuqhQJbP5sgBm2BwP1cqThi',
      testnet: false,
    },
    state: 'initiated',
    redeemAddress: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kxpjzsx',
    refundAddress:
      '59McWTPGc745SRWrSMoh8oTjoXoQq6sPUgKZ66dQWXuKFQ2q19h9gvhJNZcFTizcnT12r63NFgHiGd6gBCjabzmzHAMoyD6',
  };

  const actualReceivedQuoteState: SwapState = getNextState(
    initiatedState,
    receivedQuoteLog
  );

  const expectedReceivedQuoteState: SwapStateReceivedQuote = {
    ...initiatedState,
    state: 'received quote',
    price: 0.00610233,
    minimumSwapAmount: 0.0001,
    maximumSwapAmount: 0.1,
  };

  expect(actualReceivedQuoteState).toStrictEqual(expectedReceivedQuoteState);

  const actualWaitingForDepositState: SwapState = getNextState(
    expectedReceivedQuoteState,
    waitingForBitcoinDepositLog
  );

  const expectedWaitingForDepositState: SwapStateWaitingForBtcDeposit = {
    ...expectedReceivedQuoteState,
    state: 'waiting for btc deposit',
    depositAddress: 'tb1qajq94d72k9hhcmtrlwhfuhc5yz0w298uym980g',
    maxGiveable: 0,
  };

  expect(actualWaitingForDepositState).toStrictEqual(
    expectedWaitingForDepositState
  );

  const actualReceivedBitcoinState: SwapState = getNextState(
    expectedWaitingForDepositState,
    receivedNewBitcoinLog
  );

  const expectedReceivedBitcoinState: SwapStateWaitingForBtcDeposit = {
    ...expectedWaitingForDepositState,
    maxGiveable: 0.00099878,
  };

  expect(actualReceivedBitcoinState).toStrictEqual(
    expectedReceivedBitcoinState
  );

  const actualStartedSwapState: SwapState = getNextState(
    expectedReceivedBitcoinState,
    startedSwapLog
  );

  const expectedStartedSwapState: SwapStateStarted = {
    ...expectedReceivedBitcoinState,
    state: 'started',
    id: '2a034c59-72bc-4b7b-839f-d32522099bcc',
    btcAmount: 0.00099878,
    bobBtcLockTxFees: 0.00000122,
  };

  expect(actualStartedSwapState).toStrictEqual(expectedStartedSwapState);

  const actualBtcLockTxInMempoolState = getNextState(
    expectedStartedSwapState,
    publishedBtcLockTxLog
  );

  const expectedBtcLockTxInMempoolState: SwapStateBtcLockInMempool = {
    ...expectedStartedSwapState,
    state: 'btc lock tx is in mempool',
    bobBtcLockTxId:
      '6297106e3fb91cfb94e5b069af03248ebfdc63087db4a19c833f76df1b9aff51',
    bobBtcLockTxConfirmations: 0,
  };

  expect(actualBtcLockTxInMempoolState).toStrictEqual(
    expectedBtcLockTxInMempoolState
  );

  const actualBtcLockTxInMempoolStateAfterStatusChange: SwapState =
    getNextState(expectedBtcLockTxInMempoolState, bobBtcTxLockStatusChanged);

  const expectedBtcLockTxInMempoolStateAfterStatusChange: SwapStateBtcLockInMempool =
    {
      ...expectedBtcLockTxInMempoolState,
      bobBtcLockTxConfirmations: 3,
    };

  expect(actualBtcLockTxInMempoolStateAfterStatusChange).toStrictEqual(
    expectedBtcLockTxInMempoolStateAfterStatusChange
  );

  const actualXmrLockTxInMempoolState: SwapState = getNextState(
    expectedBtcLockTxInMempoolStateAfterStatusChange,
    aliceLockedMoneroLog
  );

  const expectedXmrLockTxInMempoolState: SwapStateXmrLockInMempool = {
    ...expectedBtcLockTxInMempoolStateAfterStatusChange,
    state: 'xmr lock tx is in mempool',
    aliceXmrLockTxId:
      'cb46ad562ffc868a7c2d8c72cecd9090cca7b6f102199db6a6cbef65afeb09d1',
    aliceXmrLockTxConfirmations: 0,
  };

  expect(actualXmrLockTxInMempoolState).toStrictEqual(
    expectedXmrLockTxInMempoolState
  );

  const actualXmrLockTxConfirmationUpdate: SwapState = getNextState(
    expectedXmrLockTxInMempoolState,
    aliceXmrLockTxConfirmationUpdateLog
  );

  const expectedXmrLockTxConfirmationUpdate: SwapStateXmrLockInMempool = {
    ...expectedXmrLockTxInMempoolState,
    aliceXmrLockTxConfirmations: 1,
  };

  expect(actualXmrLockTxConfirmationUpdate).toStrictEqual(
    expectedXmrLockTxConfirmationUpdate
  );

  const actualXmrRedeemInMempoolState: SwapState = getNextState(
    expectedXmrLockTxConfirmationUpdate,
    xmrRedeemSuccessfulLog
  );

  const expectedXmrRedeemInMempoolState: SwapStateXmrRedeemInMempool = {
    ...expectedXmrLockTxConfirmationUpdate,
    state: 'xmr redeem tx is in mempool',
    bobXmrRedeemTxId:
      'eadda576b5929c55bcc58f55c24bb52ac1853edb7d3b068ab67a3f66b0a1c546',
  };

  expect(actualXmrRedeemInMempoolState).toStrictEqual(
    expectedXmrRedeemInMempoolState
  );
});
