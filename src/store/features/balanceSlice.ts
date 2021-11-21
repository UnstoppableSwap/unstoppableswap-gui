import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { extractBtcBalanceFromBalanceString } from '../../utils/parseUtils';

export interface BalanceState {
  balanceValue: number | null;
  exitCode: number | null;
  processRunning: boolean;
  stdOut: string;
}

const initialState: BalanceState = {
  balanceValue: null,
  processRunning: false,
  exitCode: null,
  stdOut: '',
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    balanceAppendStdOut: (balance, action: PayloadAction<string>) => {
      balance.stdOut += action.payload;

      const balanceValue = action.payload
        .split(/(\r?\n)/g)
        .map(extractBtcBalanceFromBalanceString)
        .find((b) => b !== null);

      if (balanceValue != null) {
        balance.balanceValue = balanceValue;
      } else {
        console.error(`Failed to parse balance StdOut: ${balance.stdOut}`);
      }
    },
    balanceInitiate: (balance) => {
      balance.processRunning = true;
      balance.stdOut = '';
    },
    balanceProcessExited: (
      balance,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) => {
      balance.processRunning = false;
      balance.exitCode = action.payload.exitCode;
    },
  },
});

export const { balanceAppendStdOut, balanceInitiate, balanceProcessExited } =
  balanceSlice.actions;

export default balanceSlice.reducer;
