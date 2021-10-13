import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BinaryDownloadStatus } from '../../../swap/downloader';
import { extractAmountFromUnitString } from '../../../swap/utils/parse-utils';
import {
  Provider,
  Swap,
  SwapStateBtcLockInMempool,
  SwapStateDownloadingBinary,
  SwapStateInitiated,
  SwapStateProcessExited,
  SwapStateReceivedQuote,
  SwapStateStarted,
  SwapStateType,
  SwapStateWaitingForBtcDeposit,
  SwapStateXmrLockInMempool,
  SwapStateXmrRedeemInMempool,
} from '../../../models/store';
import {
  SwapLog,
  SwapLogAliceLockedXmr,
  SwapLogBtcTxStatusChanged,
  SwapLogPublishedBtcTx,
  SwapLogReceivedBtc,
  SwapLogReceivedQuote,
  SwapLogReceivedXmrLockTxConfirmation,
  SwapLogRedeemedXmr,
  SwapLogStartedSwap,
  SwapLogWaitingForBtcDeposit,
} from '../../../models/swap';

const initialState: Swap = {
  state: null,
  processRunning: false,
  logs: [],
  stdOut: '',
  provider: null,
};

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    addLog: (swap, action: PayloadAction<SwapLog>) => {
      swap.logs.push(action.payload);
    },
    appendStdOut: (swap, action: PayloadAction<string>) => {
      swap.stdOut += action.payload;
    },
    resetSwap: () => initialState,
    downloadProgressUpdate: (
      swap,
      action: PayloadAction<BinaryDownloadStatus>
    ) => {
      const nextState: SwapStateDownloadingBinary = {
        type: SwapStateType.DOWNLOADING_BINARY,
        binaryInfo: action.payload.binaryInfo,
        totalDownloadedBytes: action.payload.totalDownloadedBytes,
        contentLengthBytes: action.payload.contentLengthBytes,
      };

      swap.processRunning = false;
      swap.state = nextState;
    },
    initiateSwap: (
      swap,
      action: PayloadAction<{
        provider: Provider;
      }>
    ) => {
      const nextState: SwapStateInitiated = {
        type: SwapStateType.INITIATED,
      };

      swap.processRunning = true;
      swap.state = nextState;
      swap.logs = [];
      swap.provider = action.payload.provider;
    },
    receivedQuoteLog: (swap, action: PayloadAction<SwapLogReceivedQuote>) => {
      const price = extractAmountFromUnitString(action.payload.fields.price);
      const minimumSwapAmount = extractAmountFromUnitString(
        action.payload.fields.minimum_amount
      );
      const maximumSwapAmount = extractAmountFromUnitString(
        action.payload.fields.maximum_amount
      );

      const nextState: SwapStateReceivedQuote = {
        type: SwapStateType.RECEIVED_QUOTE,
        price,
        minimumSwapAmount,
        maximumSwapAmount,
      };

      swap.state = nextState;
    },
    waitingForBtcDepositLog: (
      swap,
      action: PayloadAction<SwapLogWaitingForBtcDeposit>
    ) => {
      const maxGiveable = extractAmountFromUnitString(
        action.payload.fields.max_giveable
      );
      const depositAddress = action.payload.fields.deposit_address;

      const nextState: SwapStateWaitingForBtcDeposit = {
        type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
        depositAddress,
        maxGiveable,
      };

      swap.state = nextState;
    },
    receivedBtcLog: (swap, action: PayloadAction<SwapLogReceivedBtc>) => {
      const maxGiveable = extractAmountFromUnitString(
        action.payload.fields.max_giveable
      );

      if (swap.state?.type === SwapStateType.WAITING_FOR_BTC_DEPOSIT) {
        (<SwapStateWaitingForBtcDeposit>swap.state).maxGiveable = maxGiveable;
      }
    },
    startingNewSwapLog: (swap, action: PayloadAction<SwapLogStartedSwap>) => {
      const btcAmount = extractAmountFromUnitString(
        action.payload.fields.amount
      );
      const bobBtcLockTxFees = extractAmountFromUnitString(
        action.payload.fields.fees
      );

      const nextState: SwapStateStarted = {
        type: SwapStateType.STARTED,
        btcAmount,
        bobBtcLockTxFees,
        id: action.payload.fields.swap_id,
      };

      swap.state = nextState;
    },
    publishedBtcTransactionLog: (
      swap,
      action: PayloadAction<SwapLogPublishedBtcTx>
    ) => {
      if (action.payload.fields.kind === 'lock') {
        const nextState: SwapStateBtcLockInMempool = {
          type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
          bobBtcLockTxId: action.payload.fields.txid,
          bobBtcLockTxConfirmations: 0,
        };

        swap.state = nextState;
      }
    },
    btcTransactionStatusChangedLog: (
      swap,
      action: PayloadAction<SwapLogBtcTxStatusChanged>
    ) => {
      if (swap.state?.type === SwapStateType.BTC_LOCK_TX_IN_MEMPOOL) {
        const state = <SwapStateBtcLockInMempool>swap.state;

        if (state.bobBtcLockTxId === action.payload.fields.txid) {
          if (action.payload.fields.new_status.startsWith('confirmed with')) {
            state.bobBtcLockTxConfirmations = Number.parseInt(
              action.payload.fields.new_status.split(' ')[2],
              10
            );
          }
        }
      }
    },
    aliceLockedXmrLog: (swap, action: PayloadAction<SwapLogAliceLockedXmr>) => {
      const nextState: SwapStateXmrLockInMempool = {
        type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
        aliceXmrLockTxId: action.payload.fields.txid,
        aliceXmrLockTxConfirmations: 0,
      };

      swap.state = nextState;
    },
    xmrLockStatusChangedLog: (
      swap,
      action: PayloadAction<SwapLogReceivedXmrLockTxConfirmation>
    ) => {
      if (swap.state?.type === SwapStateType.XMR_LOCK_TX_IN_MEMPOOL) {
        const state = <SwapStateXmrLockInMempool>swap.state;

        if (state.aliceXmrLockTxId === action.payload.fields.txid) {
          state.aliceXmrLockTxConfirmations = Number.parseInt(
            action.payload.fields.seen_confirmations,
            10
          );
        }
      }
    },
    transferredXmrToWalletLog: (
      swap,
      action: PayloadAction<SwapLogRedeemedXmr>
    ) => {
      const nextState: SwapStateXmrRedeemInMempool = {
        type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
        bobXmrRedeemTxId: action.payload.fields.txid,
      };

      swap.state = nextState;
    },
    processExited: (
      swap,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) => {
      const nextState: SwapStateProcessExited = {
        type: SwapStateType.PROCESS_EXITED,
        exitSignal: action.payload.exitSignal,
        exitCode: action.payload.exitCode,
      };

      swap.state = nextState;
      swap.processRunning = false;
    },
  },
});

export const {
  downloadProgressUpdate,
  receivedQuoteLog,
  startingNewSwapLog,
  waitingForBtcDepositLog,
  initiateSwap,
  processExited,
  publishedBtcTransactionLog,
  btcTransactionStatusChangedLog,
  aliceLockedXmrLog,
  xmrLockStatusChangedLog,
  transferredXmrToWalletLog,
  receivedBtcLog,
  addLog,
  resetSwap,
  appendStdOut,
} = swapSlice.actions;

export default swapSlice.reducer;
