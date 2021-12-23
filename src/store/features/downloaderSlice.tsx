import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BinaryDownloadStatus } from '../../models/downloaderModel';

export interface DownloaderSlice {
  status: BinaryDownloadStatus | null;
  error: string | null;
}

const initialState: DownloaderSlice = {
  status: null,
  error: null,
};

export const downloaderSlice = createSlice({
  name: 'downloader',
  initialState,
  reducers: {
    cliDownloaderProgressUpdate: (
      slice,
      action: PayloadAction<BinaryDownloadStatus>
    ) => {
      slice.status = action.payload;
      slice.error = null;
    },
    cliDownloadEnd: (slice, action: PayloadAction<string | null>) => {
      const error = action.payload;
      if (error) {
        slice.error = error;
      } else {
        slice.status = null;
        slice.error = null;
      }
    },
    cliDownloadReset: () => initialState,
  },
});

export const { cliDownloaderProgressUpdate, cliDownloadEnd } =
  downloaderSlice.actions;

export default downloaderSlice.reducer;
