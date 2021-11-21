import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isSwapLogPublishedBtcTx, SwapLog } from '../../models/swapModel';
import {
  Withdraw,
  WithdrawStateInitiated,
  WithdrawStateProcessExited,
  WithdrawStateType,
  WithdrawStateWithdrawTxInMempool,
} from '../../models/storeModel';

const initialState: Withdraw = {
  state: null,
  stdOut: '',
  logs: [],
  processRunning: false,
};

export const withdrawSlice = createSlice({
  name: 'withdraw',
  initialState,
  reducers: {
    withdrawReset: () => initialState,
    withdrawAppendStdOut: (withdraw, action: PayloadAction<string>) => {
      withdraw.stdOut += action.payload;
    },
    withdrawAddLog: (withdraw, action: PayloadAction<SwapLog>) => {
      const log = action.payload;
      withdraw.logs.push(log);

      if (isSwapLogPublishedBtcTx(log)) {
        const nextState: WithdrawStateWithdrawTxInMempool = {
          type: WithdrawStateType.BTC_WITHDRAW_TX_IN_MEMPOOL,
          txid: log.fields.txid,
        };

        withdraw.state = nextState;
      }
    },
    withdrawInitiate: (withdraw) => {
      const nextState: WithdrawStateInitiated = {
        type: WithdrawStateType.INITIATED,
      };

      withdraw.state = nextState;
      withdraw.stdOut = '';
      withdraw.logs = [];
      withdraw.processRunning = true;
    },
    withdrawProcessExited: (
      withdraw,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) => {
      const nextState: WithdrawStateProcessExited = {
        type: WithdrawStateType.PROCESS_EXITED,
        exitCode: action.payload.exitCode,
        exitSignal: action.payload.exitSignal,
        prevState: withdraw.state,
      };

      withdraw.state = nextState;
      withdraw.processRunning = false;
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
