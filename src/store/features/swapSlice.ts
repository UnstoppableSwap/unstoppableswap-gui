import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { extractAmountFromUnitString } from '../../utils/parseUtils';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateWaitingForBtcDeposit,
  isSwapStateXmrLockInMempool,
  Provider,
  SwapSlice,
  SwapStateBtcLockInMempool,
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
  isCliLogAliceLockedXmr,
  isCliLogBtcTxStatusChanged,
  isCliLogPublishedBtcTx,
  isCliLogReceivedBtc,
  isCliLogReceivedQuote,
  isCliLogReceivedXmrLockTxConfirmation,
  isCliLogRedeemedXmr,
  isCliLogStartedSwap,
  isCliLogWaitingForBtcDeposit,
  CliLog,
} from '../../models/cliModel';

const initialState: SwapSlice = {
  state: null,
  processRunning: false,
  swapId: null,
  logs: [],
  stdOut: '',
  provider: null,
  resume: null,
};

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    swapAddLog(slice, action: PayloadAction<CliLog>) {
      const log = action.payload;
      slice.logs.push(log);

      if (isCliLogReceivedQuote(log)) {
        const price = extractAmountFromUnitString(log.fields.price);
        const minimumSwapAmount = extractAmountFromUnitString(
          log.fields.minimum_amount
        );
        const maximumSwapAmount = extractAmountFromUnitString(
          log.fields.maximum_amount
        );

        if (
          price != null &&
          minimumSwapAmount != null &&
          maximumSwapAmount != null
        ) {
          const nextState: SwapStateReceivedQuote = {
            type: SwapStateType.RECEIVED_QUOTE,
            price,
            minimumSwapAmount,
            maximumSwapAmount,
          };

          slice.state = nextState;
        }
      } else if (isCliLogWaitingForBtcDeposit(log)) {
        const maxGiveable = extractAmountFromUnitString(
          log.fields.max_giveable
        );
        const minimumAmount = extractAmountFromUnitString(
          log.fields.minimum_amount
        );
        const maximumAmount = extractAmountFromUnitString(
          log.fields.maximum_amount
        );

        const depositAddress = log.fields.deposit_address;

        if (
          maxGiveable != null &&
          minimumAmount != null &&
          maximumAmount != null
        ) {
          const nextState: SwapStateWaitingForBtcDeposit = {
            type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
            depositAddress,
            maxGiveable,
            minimumAmount,
            maximumAmount,
          };

          slice.state = nextState;
        }
      } else if (isCliLogReceivedBtc(log)) {
        const maxGiveable = extractAmountFromUnitString(
          log.fields.max_giveable
        );

        if (
          isSwapStateWaitingForBtcDeposit(slice.state) &&
          maxGiveable != null
        ) {
          slice.state.maxGiveable = maxGiveable;
        }
      } else if (isCliLogStartedSwap(log)) {
        const nextState: SwapStateStarted = {
          type: SwapStateType.STARTED,
          id: log.fields.swap_id,
        };

        slice.state = nextState;
        slice.swapId = log.fields.swap_id;
      } else if (isCliLogPublishedBtcTx(log)) {
        if (log.fields.kind === 'lock') {
          const nextState: SwapStateBtcLockInMempool = {
            type: SwapStateType.BTC_LOCK_TX_IN_MEMPOOL,
            bobBtcLockTxId: log.fields.txid,
            bobBtcLockTxConfirmations: 0,
          };

          slice.state = nextState;
        }
      } else if (isCliLogBtcTxStatusChanged(log)) {
        if (isSwapStateBtcLockInMempool(slice.state)) {
          if (slice.state.bobBtcLockTxId === log.fields.txid) {
            const newStatusText = log.fields.new_status;

            if (newStatusText.startsWith('confirmed with')) {
              const confirmations = Number.parseInt(
                newStatusText.split(' ')[2],
                10
              );

              slice.state.bobBtcLockTxConfirmations = confirmations;
            }
          }
        }
      } else if (isCliLogAliceLockedXmr(log)) {
        const nextState: SwapStateXmrLockInMempool = {
          type: SwapStateType.XMR_LOCK_TX_IN_MEMPOOL,
          aliceXmrLockTxId: log.fields.txid,
          aliceXmrLockTxConfirmations: 0,
        };

        slice.state = nextState;
      } else if (isCliLogReceivedXmrLockTxConfirmation(log)) {
        if (isSwapStateXmrLockInMempool(slice.state)) {
          if (slice.state.aliceXmrLockTxId === log.fields.txid) {
            slice.state.aliceXmrLockTxConfirmations = Number.parseInt(
              log.fields.seen_confirmations,
              10
            );
          }
        }
      } else if (isCliLogRedeemedXmr(log)) {
        const nextState: SwapStateXmrRedeemInMempool = {
          type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
          bobXmrRedeemTxId: log.fields.txid,
          bobXmrRedeemAddress: log.fields.monero_receive_address,
        };

        slice.state = nextState;
      } else {
        console.debug(
          `Swap log was not reduced Log: ${JSON.stringify(log, null, 4)}`
        );
      }
    },
    swapAppendStdOut(slice, action: PayloadAction<string>) {
      slice.stdOut += action.payload;
    },
    swapReset() {
      return initialState;
    },
    swapInitiate(
      swap,
      action: PayloadAction<{
        provider: Provider | null;
        resume: boolean;
      }>
    ) {
      const nextState: SwapStateInitiated = {
        type: SwapStateType.INITIATED,
      };

      swap.processRunning = true;
      swap.state = nextState;
      swap.logs = [];
      swap.provider = action.payload.provider;
      swap.resume = action.payload.resume;
    },
    swapProcessExited(
      swap,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) {
      const nextState: SwapStateProcessExited = {
        type: SwapStateType.PROCESS_EXITED,
        exitSignal: action.payload.exitSignal,
        exitCode: action.payload.exitCode,
        prevState: swap.state,
      };

      swap.state = nextState;
      swap.processRunning = false;
    },
  },
});

export const {
  swapInitiate,
  swapProcessExited,
  swapReset,
  swapAddLog,
  swapAppendStdOut,
} = swapSlice.actions;

export default swapSlice.reducer;
