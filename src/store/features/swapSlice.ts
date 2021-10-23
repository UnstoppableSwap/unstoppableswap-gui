import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BinaryDownloadStatus } from '../../swap/downloader';
import { extractAmountFromUnitString } from '../../utils/parseUtils';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateWaitingForBtcDeposit,
  isSwapStateXmrLockInMempool,
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
} from '../../models/storeModel';
import {
  isSwapLogAliceLockedXmr,
  isSwapLogBtcTxStatusChanged,
  isSwapLogPublishedBtcTx,
  isSwapLogReceivedBtc,
  isSwapLogReceivedQuote,
  isSwapLogReceivedXmrLockTxConfirmation,
  isSwapLogRedeemedXmr,
  isSwapLogStartedSwap,
  isSwapLogWaitingForBtcDeposit,
  SwapLog,
} from '../../models/swapModel';

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
    swapAddLog: (swap, action: PayloadAction<SwapLog>) => {
      const log = action.payload;
      swap.logs.push(log);

      if (isSwapLogReceivedQuote(log)) {
        const price = extractAmountFromUnitString(log.fields.price);
        const minimumSwapAmount = extractAmountFromUnitString(
          log.fields.minimum_amount
        );
        const maximumSwapAmount = extractAmountFromUnitString(
          log.fields.maximum_amount
        );

        const nextState: SwapStateReceivedQuote = {
          type: SwapStateType.RECEIVED_QUOTE,
          price,
          minimumSwapAmount,
          maximumSwapAmount,
        };

        swap.state = nextState;
      } else if (isSwapLogWaitingForBtcDeposit(log)) {
        const maxGiveable = extractAmountFromUnitString(
          log.fields.max_giveable
        );
        const depositAddress = log.fields.deposit_address;

        const nextState: SwapStateWaitingForBtcDeposit = {
          type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
          depositAddress,
          maxGiveable,
        };

        swap.state = nextState;
      } else if (isSwapLogReceivedBtc(log)) {
        const maxGiveable = extractAmountFromUnitString(
          log.fields.max_giveable
        );

        if (isSwapStateWaitingForBtcDeposit(swap.state)) {
          swap.state.maxGiveable = maxGiveable;
        }
      } else if (isSwapLogStartedSwap(log)) {
        const nextState: SwapStateStarted = {
          type: SwapStateType.STARTED,
          id: log.fields.swap_id,
        };

        swap.state = nextState;
      } else if (isSwapLogPublishedBtcTx(log)) {
        if (log.fields.kind === 'lock') {
          const nextState: SwapStateBtcLockInMempool = {
            type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
            bobBtcLockTxId: log.fields.txid,
            bobBtcLockTxConfirmations: 0,
          };

          swap.state = nextState;
        }
      } else if (isSwapLogBtcTxStatusChanged(log)) {
        if (isSwapStateBtcLockInMempool(swap.state)) {
          if (swap.state.bobBtcLockTxId === log.fields.txid) {
            const newStatusText = log.fields.new_status;

            if (newStatusText.startsWith('confirmed with')) {
              const confirmations = Number.parseInt(
                newStatusText.split(' ')[2],
                10
              );

              swap.state.bobBtcLockTxConfirmations = confirmations;
            }
          }
        }
      } else if (isSwapLogAliceLockedXmr(log)) {
        const nextState: SwapStateXmrLockInMempool = {
          type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
          aliceXmrLockTxId: log.fields.txid,
          aliceXmrLockTxConfirmations: 0,
        };

        swap.state = nextState;
      } else if (isSwapLogReceivedXmrLockTxConfirmation(log)) {
        if (isSwapStateXmrLockInMempool(swap.state)) {
          if (swap.state.aliceXmrLockTxId === log.fields.txid) {
            swap.state.aliceXmrLockTxConfirmations = Number.parseInt(
              log.fields.seen_confirmations,
              10
            );
          }
        }
      } else if (isSwapLogRedeemedXmr(log)) {
        const nextState: SwapStateXmrRedeemInMempool = {
          type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
          bobXmrRedeemTxId: log.fields.txid,
        };

        swap.state = nextState;
      } else {
        console.error(`Swap log was not reduced Log: ${JSON.stringify(log)}`);
      }
    },
    swapAppendStdOut: (swap, action: PayloadAction<string>) => {
      swap.stdOut += action.payload;
    },
    swapReset: () => initialState,
    swapDownloadProgressUpdate: (
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
    swapInitiate: (
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
    swapProcessExited: (
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
  swapInitiate,
  swapProcessExited,
  swapDownloadProgressUpdate,
  swapReset,
  swapAddLog,
  swapAppendStdOut,
} = swapSlice.actions;

export default swapSlice.reducer;
