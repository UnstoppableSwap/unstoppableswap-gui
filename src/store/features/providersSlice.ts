import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExtendedProvider } from '../../models/storeModel';
import { isTestnet } from '../config';

const initialState: {
  providers: ExtendedProvider[];
  selectedProvider: ExtendedProvider | null;
} = {
  providers: [],
  selectedProvider: null,
};

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
    setProviders: (state, action: PayloadAction<ExtendedProvider[]>) => {
      const providers = sortProviderList(action.payload).filter(
        (provider) => provider.testnet === isTestnet()
      );
      state.providers = providers;

      const newSelectedProvider = providers.find(
        (prov) => prov.peerId === state.selectedProvider?.peerId
      );
      state.selectedProvider = newSelectedProvider || providers[0] || null;
    },
    setSelectedProvider: (state, action: PayloadAction<ExtendedProvider>) => {
      state.selectedProvider = action.payload;
    },
  },
});

export const { setProviders, setSelectedProvider } = swapSlice.actions;

export default swapSlice.reducer;
