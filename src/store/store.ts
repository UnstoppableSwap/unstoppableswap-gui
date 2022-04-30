import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import swapReducer from './features/swapSlice';
import historyReducer from './features/historySlice';
import balanceReducer from './features/balanceSlice';
import withdrawReducer from './features/withdrawSlice';
import providersSlice from './features/providersSlice';
import electrumSlice from './features/electrumSlice';
import logSlice from './features/logSlice';
import torSlice from './features/torSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    history: historyReducer,
    balance: balanceReducer,
    withdraw: withdrawReducer,
    providers: providersSlice,
    electrum: electrumSlice,
    log: logSlice,
    tor: torSlice,
  },
  enhancers: [stateSyncEnhancer()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
