import { configureStore } from '@reduxjs/toolkit';
import swapReducer from './features/swap/swapSlice';
import providersReducer from './features/swap/providersSlice';
import historyReducer from './features/swap/historySlice';

export const IS_TESTNET =
  process.env.TESTNET?.toString().toLowerCase() === 'true';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    providers: providersReducer,
    history: historyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
