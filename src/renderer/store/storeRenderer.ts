import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import { reducers } from 'store/combinedReducer';

export const store = configureStore({
  reducer: reducers,
  enhancers: [stateSyncEnhancer()],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
