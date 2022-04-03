import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sortProviderList } from '../../utils/sortUtils';
import { ExtendedProvider } from '../../models/apiModel';
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
        (prov) => prov.multiAddr === slice.selectedProvider?.multiAddr
      );
      slice.selectedProvider = newSelectedProvider || providers[0] || null;
    },
    setSelectedProvider(
      slice,
      action: PayloadAction<{
        multiAddr: string;
      }>
    ) {
      slice.selectedProvider =
        slice.providers.find(
          (prov) => prov.multiAddr === action.payload.multiAddr
        ) || null;
    },
  },
});

export const { setProviders, setSelectedProvider } = providersSlice.actions;

export default providersSlice.reducer;
