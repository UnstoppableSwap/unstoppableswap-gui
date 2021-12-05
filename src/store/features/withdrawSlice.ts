import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isSwapLogPublishedBtcTx, SwapLog } from '../../models/swapModel';
import {
  WithdrawSlice,
  WithdrawStateInitiated,
  WithdrawStateProcessExited,
  WithdrawStateType,
  WithdrawStateWithdrawTxInMempool,
} from '../../models/storeModel';

const initialState: WithdrawSlice = {
  state: null,
  stdOut: '',
  logs: [],
  processRunning: false,
};

export const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {
    withdrawReset() {
      return initialState;
    },
    withdrawAppendStdOut(slice, action: PayloadAction<string>) {
      slice.stdOut += action.payload;
    },
    withdrawAddLog(slice, action: PayloadAction<SwapLog>) {
      const log = action.payload;
      slice.logs.push(log);

      if (isSwapLogPublishedBtcTx(log)) {
        const nextState: WithdrawStateWithdrawTxInMempool = {
          type: WithdrawStateType.BTC_WITHDRAW_TX_IN_MEMPOOL,
          txid: log.fields.txid,
        };

        slice.state = nextState;
      }
    },
    withdrawInitiate(slice) {
      const nextState: WithdrawStateInitiated = {
        type: WithdrawStateType.INITIATED,
      };

      slice.state = nextState;
      slice.stdOut = '';
      slice.logs = [];
      slice.processRunning = true;
    },
    withdrawProcessExited(
      slice,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) {
      const nextState: WithdrawStateProcessExited = {
        type: WithdrawStateType.PROCESS_EXITED,
        exitCode: action.payload.exitCode,
        exitSignal: action.payload.exitSignal,
        prevState: slice.state,
      };

      slice.state = nextState;
      slice.processRunning = false;
    },
  },
});

export const {
  withdrawInitiate,
  withdrawProcessExited,
  withdrawAppendStdOut,
  withdrawAddLog,
  withdrawReset,
} = withdrawSlice.actions;

export default withdrawSlice.reducer;
