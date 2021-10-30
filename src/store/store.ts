import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import swapReducer from './features/swapSlice';
import providersReducer from './features/providersSlice';
import historyReducer from './features/historySlice';
import balanceReducer from './features/balanceSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    providers: providersReducer,
    history: historyReducer,
    balance: balanceReducer,
  },
  enhancers: [stateSyncEnhancer()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
