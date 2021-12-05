import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { extractBtcBalanceFromBalanceString } from '../../utils/parseUtils';

export interface BalanceSlice {
  balanceValue: number | null;
  exitCode: number | null;
  processRunning: boolean;
  stdOut: string;
}

const initialState: BalanceSlice = {
  balanceValue: null,
  processRunning: false,
  exitCode: null,
  stdOut: '',
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    balanceAppendStdOut(slice, action: PayloadAction<string>) {
      slice.stdOut += action.payload;

      const balanceValue = action.payload
        .split(/(\r?\n)/g)
        .map(extractBtcBalanceFromBalanceString)
        .find((b) => b !== null);

      if (balanceValue != null) {
        slice.balanceValue = balanceValue;
      } else {
        console.error(`Failed to parse balance StdOut: ${slice.stdOut}`);
      }
    },
    balanceInitiate(slice) {
      slice.processRunning = true;
      slice.stdOut = '';
    },
    balanceProcessExited(
      slice,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) {
      slice.processRunning = false;
      slice.exitCode = action.payload.exitCode;
    },
  },
});

export const { balanceAppendStdOut, balanceInitiate, balanceProcessExited } =
  balanceSlice.actions;

export default balanceSlice.reducer;
