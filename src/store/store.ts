import { configureStore } from '@reduxjs/toolkit';
import swapReducer from './features/swapSlice';
import providersReducer from './features/providersSlice';
import historyReducer from './features/historySlice';
import balanceReducer from './features/balanceSlice';

export const IS_TESTNET =
  process.env.TESTNET?.toString().toLowerCase() === 'true';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    providers: providersReducer,
    history: historyReducer,
    balance: balanceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
