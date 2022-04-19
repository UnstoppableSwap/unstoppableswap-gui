import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CliLog, isCliLog } from '../../models/cliModel';
import { getLinesOfString, logFilePathToSwapId } from '../../utils/parseUtils';

export interface LogSlice {
  [swapId: string]: CliLog[];
}

const initialState: LogSlice = {};

export const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    swapLogFileDataChanged(
      slice,
      {
        payload: { fileData, logFilePath },
      }: PayloadAction<{ logFilePath: string; fileData: string }>
    ) {
      const swapId = logFilePathToSwapId(logFilePath);
      const lines = getLinesOfString(fileData);
      slice[swapId] = lines
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(isCliLog);
    },
  },
});

export const { swapLogFileDataChanged } = logSlice.actions;

export default logSlice.reducer;
