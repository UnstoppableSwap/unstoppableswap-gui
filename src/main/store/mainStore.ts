import { configureStore } from '@reduxjs/toolkit';
import { stateSyncEnhancer } from 'electron-redux';
import { reducers } from '../../store/combinedReducer';
import { createMainListeners } from './mainStoreListeners';

export const store = configureStore({
  reducer: reducers,
  enhancers: [stateSyncEnhancer()],
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(createMainListeners().middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
