import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import swapReducer from './features/swapSlice';
import historyReducer from './features/historySlice';
import providersSlice from './features/providersSlice';
import electrumSlice from './features/electrumSlice';
import logSlice from './features/logSlice';
import torSlice from './features/torSlice';
import rpcSlice from './features/rpcSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    history: historyReducer,
    providers: providersSlice,
    electrum: electrumSlice,
    log: logSlice,
    tor: torSlice,
    rpc: rpcSlice,
  },
  enhancers: [stateSyncEnhancer()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
