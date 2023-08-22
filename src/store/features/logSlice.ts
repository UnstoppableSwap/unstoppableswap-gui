import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import { CliLog, isCliLog } from '../../models/cliModel';
import { getLinesOfString } from '../../utils/parseUtils';

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
      { payload: { fileData } }: PayloadAction<{ fileData: string }>
    ) {
      const lines = getLinesOfString(fileData);
      const logsInFile = lines
        .map((line) => {
          try {
            return JSON.parse(line);
          } catch (e) {
            return null;
          }
        })
        .filter(isCliLog);

      const logsFilteredBySwapId = _.groupBy(
        logsInFile,
        (log) =>
          (log.spans?.find((span) => 'swap_id' in span)?.swap_id as string) ||
          null
      );

      Object.entries(logsFilteredBySwapId).forEach(([swapId, logs]) => {
        if (swapId) {
          slice[swapId] = logs;
        }
      });
    },
  },
});

export const { swapLogFileDataChanged } = logSlice.actions;

export default logSlice.reducer;
