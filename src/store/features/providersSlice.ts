import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sortProviderList } from '../../utils/sortUtils';
import { ExtendedProviderStatus } from '../../models/apiModel';
import { isTestnet } from '../config';

export interface ProvidersSlice {
  providers: ExtendedProviderStatus[];
  selectedProvider: ExtendedProviderStatus | null;
}

const initialState: ProvidersSlice = {
  providers: [],
  selectedProvider: null,
};

export const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders(slice, action: PayloadAction<ExtendedProviderStatus[]>) {
      if (
        process.env.STUB_TESTNET_PROVIDER_MULTIADDR &&
        process.env.STUB_TESTNET_PROVIDER_PEER_ID
      ) {
        action.payload.push({
          multiAddr: process.env.STUB_TESTNET_PROVIDER_MULTIADDR,
          peerId: process.env.STUB_TESTNET_PROVIDER_PEER_ID,
          testnet: true,
          age: 0,
          maxSwapAmount: 10000000,
          minSwapAmount: 100000,
          price: 700000,
          relevancy: 1,
          uptime: 1,
        });
      }

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
