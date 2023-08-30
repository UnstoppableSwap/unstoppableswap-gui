import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TorSlice {
  exitCode: number | null;
  processRunning: boolean;
  stdOut: string;
}

const initialState: TorSlice = {
  processRunning: false,
  exitCode: null,
  stdOut: '',
};

export const torSlice = createSlice({
  name: 'tor',
  initialState,
  reducers: {
    torAppendStdOut(slice, action: PayloadAction<string>) {
      slice.stdOut += action.payload;
    },
    torInitiate(slice) {
      slice.processRunning = true;
    },
    torProcessExited(
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

export const { torAppendStdOut, torInitiate, torProcessExited } =
  torSlice.actions;

export default torSlice.reducer;
