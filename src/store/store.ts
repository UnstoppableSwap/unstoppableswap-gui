import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import swapReducer from './features/swapSlice';
import providersSlice from './features/providersSlice';
import torSlice from './features/torSlice';
import rpcSlice from './features/rpcSlice';
import alertsSlice from './features/alertsSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    providers: providersSlice,
    tor: torSlice,
    rpc: rpcSlice,
    alerts: alertsSlice,
  },
  enhancers: [stateSyncEnhancer()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
