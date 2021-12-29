import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import swapReducer from './features/swapSlice';
import historyReducer from './features/historySlice';
import balanceReducer from './features/balanceSlice';
import withdrawReducer from './features/withdrawSlice';
import providersSlice from './features/providersSlice';
import downloaderSlice from './features/downloaderSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    history: historyReducer,
    balance: balanceReducer,
    withdraw: withdrawReducer,
    providers: providersSlice,
    downloader: downloaderSlice,
  },
  enhancers: [stateSyncEnhancer()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
