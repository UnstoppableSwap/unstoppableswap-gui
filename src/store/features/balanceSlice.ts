import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { extractAmountFromUnitString } from '../../utils/parseUtils';
import { isCliLogCheckedBitcoinBalance, CliLog } from '../../models/cliModel';

export interface BalanceSlice {
  balanceValue: number | null;
  exitCode: number | null;
  processRunning: boolean;
  stdOut: string;
  logs: CliLog[];
}

const initialState: BalanceSlice = {
  balanceValue: null,
  processRunning: false,
  exitCode: null,
  stdOut: '',
  logs: [],
};

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    balanceAppendStdOut(slice, action: PayloadAction<string>) {
      slice.stdOut += action.payload;
    },
    balanceAddLog(slice, action: PayloadAction<CliLog>) {
      const log = action.payload;

      if (isCliLogCheckedBitcoinBalance(log)) {
        slice.balanceValue = extractAmountFromUnitString(log.fields.balance);
      }

      slice.logs.push(log);
    },
    balanceInitiate(slice) {
      slice.processRunning = true;
      slice.stdOut = '';
      slice.logs = [];
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

export const {
  balanceAppendStdOut,
  balanceInitiate,
  balanceProcessExited,
  balanceAddLog,
} = balanceSlice.actions;

export default balanceSlice.reducer;
