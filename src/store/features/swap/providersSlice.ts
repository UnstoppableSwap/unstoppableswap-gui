import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IS_TESTNET } from 'store/store';
import { ExtendedProvider } from '../../../models/store';

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
        (provider) => provider.testnet === IS_TESTNET
      );
      return providers;
    },
  },
});

export const { setProviders } = swapSlice.actions;

export default swapSlice.reducer;
