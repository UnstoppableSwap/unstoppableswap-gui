import { configureStore } from '@reduxjs/toolkit';
import swapReducer from './features/swap/swapSlice';
import providersReducer from './features/swap/providersSlice';

export const store = configureStore({
  reducer: {
    swap: swapReducer,
    providers: providersReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
