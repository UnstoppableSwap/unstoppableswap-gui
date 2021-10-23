import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedProvider } from '../../models/storeModel';
import { isTestnet } from '../config';

const initialState: ExtendedProvider[] = [];

function sortProviderList(list: ExtendedProvider[]) {
  return list.concat().sort((firstEl, secondEl) => {
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
    setProviders: (_swap, action: PayloadAction<ExtendedProvider[]>) => {
      const providers = sortProviderList(action.payload).filter(
        (provider) => provider.testnet === isTestnet()
      );
      return providers;
    },
  },
});

export const { setProviders } = swapSlice.actions;

export default swapSlice.reducer;
