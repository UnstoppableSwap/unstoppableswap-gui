import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedProvider } from '../../../models/store';

const initialState: ExtendedProvider[] = [];

function sortProviderList(list: ExtendedProvider[]) {
  return list.concat().sort((firstEl, secondEl) => {
    if (!firstEl.testnet && secondEl.testnet) {
      return -1;
    }
    if (!secondEl.testnet && firstEl.testnet) {
      return 1;
    }
    if (firstEl.relevancy > secondEl.relevancy) {
      return -1;
    }
    return 1;
  });
}

export const swapSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders: (_swap, action: PayloadAction<ExtendedProvider[]>) =>
      sortProviderList(action.payload),
  },
});

export const { setProviders } = swapSlice.actions;

export default swapSlice.reducer;
