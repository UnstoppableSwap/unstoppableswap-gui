import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedProvider } from '../../../models/store';

const initialState: ExtendedProvider[] = [];

export const swapSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders: (_swap, action: PayloadAction<ExtendedProvider[]>) =>
      action.payload,
  },
});

export const { setProviders } = swapSlice.actions;

export default swapSlice.reducer;
