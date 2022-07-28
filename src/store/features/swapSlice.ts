import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { extractAmountFromUnitString } from '../../utils/parseUtils';
import {
  isSwapStateBtcLockInMempool,
  isSwapStateReceivedQuote,
  isSwapStateWaitingForBtcDeposit,
  isSwapStateXmrLockInMempool,
  SwapSlice,
  SwapStateBtcCancelled,
  SwapStateBtcLockInMempool,
  SwapStateBtcRedemeed,
  SwapStateBtcRefunded,
  SwapStateInitiated,
  SwapStateProcessExited,
  SwapStateReceivedQuote,
  SwapStateStarted,
  SwapStateType,
  SwapStateWaitingForBtcDeposit,
  SwapStateXmrLocked,
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
  isCliLogAdvancingState,
  SwapSpawnType,
} from '../../models/cliModel';
import logger from '../../utils/logger';
import { Provider } from '../../models/apiModel';

const initialState: SwapSlice = {
  state: null,
  processRunning: false,
  swapId: null,
  logs: [],
  stdOut: '',
  provider: null,
  spawnType: null,
};

export const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    swapAddLog(slice, action: PayloadAction<CliLog[]>) {
      const logs = action.payload;
      slice.logs.push(...logs);

      logs.forEach((log) => {
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
          const minDeposit = extractAmountFromUnitString(
            log.fields.min_deposit
          );
          const minimumAmount = extractAmountFromUnitString(
            log.fields.minimum_amount
          );
          const maximumAmount = extractAmountFromUnitString(
            log.fields.maximum_amount
          );

          const depositAddress = log.fields.deposit_address;
          const price = isSwapStateReceivedQuote(slice.state)
            ? slice.state.price
            : null;

          if (
            maxGiveable != null &&
            minimumAmount != null &&
            maximumAmount != null &&
            minDeposit != null
          ) {
            const nextState: SwapStateWaitingForBtcDeposit = {
              type: SwapStateType.WAITING_FOR_BTC_DEPOSIT,
              depositAddress,
              maxGiveable,
              minimumAmount,
              maximumAmount,
              minDeposit,
              price,
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
          } else if (log.fields.kind === 'cancel') {
            const nextState: SwapStateBtcCancelled = {
              type: SwapStateType.BTC_CANCELLED,
              btcCancelTxId: log.fields.txid,
            };

            slice.state = nextState;
          } else if (log.fields.kind === 'refund') {
            const nextState: SwapStateBtcRefunded = {
              type: SwapStateType.BTC_REFUNDED,
              bobBtcRefundTxId: log.fields.txid,
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
        } else if (isCliLogAdvancingState(log)) {
          if (log.fields.state === 'xmr is locked') {
            const nextState: SwapStateXmrLocked = {
              type: SwapStateType.XMR_LOCKED,
            };

            slice.state = nextState;
          } else if (log.fields.state === 'btc is redeemed') {
            const nextState: SwapStateBtcRedemeed = {
              type: SwapStateType.BTC_REDEEMED,
            };

            slice.state = nextState;
          }
        } else if (isCliLogRedeemedXmr(log)) {
          const nextState: SwapStateXmrRedeemInMempool = {
            type: SwapStateType.XMR_REDEEM_IN_MEMPOOL,
            bobXmrRedeemTxId: log.fields.txid,
            bobXmrRedeemAddress: log.fields.monero_receive_address,
          };

          slice.state = nextState;
        } else {
          logger.debug({ log }, `Swap log was not reduced`);
        }
      });
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
        spawnType: SwapSpawnType;
        swapId: string | null;
      }>
    ) {
      const nextState: SwapStateInitiated = {
        type: SwapStateType.INITIATED,
      };

      swap.processRunning = true;
      swap.state = nextState;
      swap.logs = [];
      swap.provider = action.payload.provider;
      swap.spawnType = action.payload.spawnType;
      swap.swapId = action.payload.swapId;
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
