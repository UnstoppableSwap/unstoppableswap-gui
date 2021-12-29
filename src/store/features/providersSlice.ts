import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sortProviderList } from '../../utils/sortUtils';
import { ExtendedProvider } from '../../models/storeModel';
import { isTestnet } from '../config';

export interface ProvidersSlice {
  providers: ExtendedProvider[];
  selectedProvider: ExtendedProvider | null;
}

const initialState: ProvidersSlice = {
  providers: [],
  selectedProvider: null,
};

export const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders(slice, action: PayloadAction<ExtendedProvider[]>) {
      const providers = sortProviderList(action.payload).filter(
        (provider) => provider.testnet === isTestnet()
      );
      slice.providers = providers;

      const newSelectedProvider = providers.find(
        (prov) => prov.peerId === slice.selectedProvider?.peerId
      );
      slice.selectedProvider = newSelectedProvider || providers[0] || null;
    },
    setSelectedProvider(
      slice,
      action: PayloadAction<{
        peerId: string;
      }>
    ) {
      slice.selectedProvider =
        slice.providers.find((prov) => prov.peerId === action.payload.peerId) ||
        null;
    },
  },
});

export const { setProviders, setSelectedProvider } = providersSlice.actions;

export default providersSlice.reducer;
