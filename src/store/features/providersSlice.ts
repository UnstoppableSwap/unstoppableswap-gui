import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Multiaddr } from 'multiaddr';
import { isTestnet } from '../config';
import { CliLog, isCliLogFetchedPeerStatus } from '../../models/cliModel';
import { extractAmountFromUnitString } from '../../utils/parseUtils';
import { ExtendedProviderStatus, ProviderStatus } from '../../models/apiModel';
import { btcToSats } from '../../utils/conversionUtils';
import { sortProviderList } from '../../utils/sortUtils';
import { isProviderCompatible } from '../../utils/multiAddrUtils';

export interface ProvidersSlice {
  rendezvous: {
    providers: (ExtendedProviderStatus | ProviderStatus)[];
    exitCode: number | null;
    processRunning: boolean;
    stdOut: string;
    logs: CliLog[];
  };
  registry: {
    providers: ExtendedProviderStatus[] | null;
    failedReconnectAttemptsSinceLastSuccess: number;
  };
  selectedProvider: ExtendedProviderStatus | null;
}

const initialState: ProvidersSlice = {
  rendezvous: {
    providers: [],
    processRunning: false,
    exitCode: null,
    stdOut: '',
    logs: [],
  },
  registry: {
    providers: null,
    failedReconnectAttemptsSinceLastSuccess: 0,
  },
  selectedProvider: null,
};

function selectNewSelectedProvider(
  slice: ProvidersSlice,
  peerId?: string
): ProviderStatus {
  const selectedPeerId = peerId || slice.selectedProvider?.peerId;

  return (
    slice.registry.providers?.find((prov) => prov.peerId === selectedPeerId) ||
    slice.rendezvous.providers.find((prov) => prov.peerId === selectedPeerId) ||
    slice.registry.providers?.at(0) ||
    slice.rendezvous.providers[0] ||
    null
  );
}

export const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    listSellersAppendStdOut(slice, action: PayloadAction<string>) {
      slice.rendezvous.stdOut += action.payload;
    },
    listSellersAddLog(slice, action: PayloadAction<CliLog>) {
      const log = action.payload;

      if (isCliLogFetchedPeerStatus(log) && log.fields.status === 'Online') {
        const price = extractAmountFromUnitString(log.fields.price);
        const minSwapAmount = extractAmountFromUnitString(
          log.fields.min_quantity
        );
        const maxSwapAmount = extractAmountFromUnitString(
          log.fields.max_quantity
        );

        const multiAddrCombined = new Multiaddr(log.fields.address);
        const multiAddr = multiAddrCombined.decapsulate('p2p').toString();
        const peerId = multiAddrCombined.getPeerId();

        if (price && minSwapAmount && maxSwapAmount && peerId) {
          // We want to ignore that are already present in the public registry
          if (
            !slice.registry.providers?.some(
              (prov) => prov.peerId === peerId && prov.multiAddr === multiAddr
            )
          ) {
            const newProvider: ExtendedProviderStatus = {
              multiAddr,
              peerId,
              price: btcToSats(price),
              minSwapAmount: btcToSats(minSwapAmount),
              maxSwapAmount: btcToSats(maxSwapAmount),
              testnet: isTestnet(),
            };
            const indexOfExistingProvider =
              slice.rendezvous.providers.findIndex(
                (prov) => prov.peerId === peerId && prov.multiAddr === multiAddr
              );

            // Avoid duplicates, replace instead
            if (indexOfExistingProvider !== -1) {
              slice.rendezvous.providers[indexOfExistingProvider] = newProvider;
            } else {
              slice.rendezvous.providers.push(newProvider);
            }
          }
        }
      }

      slice.rendezvous.logs.push(log);
      slice.rendezvous.providers = sortProviderList(slice.rendezvous.providers);
    },
    listSellersInitiate(slice) {
      slice.rendezvous.processRunning = true;
      slice.rendezvous.stdOut = '';
      slice.rendezvous.logs = [];
      slice.rendezvous.exitCode = null;
      slice.selectedProvider = selectNewSelectedProvider(slice);
    },
    listSellersProcessExited(
      slice,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) {
      slice.selectedProvider = selectNewSelectedProvider(slice);
      slice.rendezvous.processRunning = false;
      slice.rendezvous.exitCode = action.payload.exitCode;
    },
    setRegistryProviders(
      slice,
      action: PayloadAction<ExtendedProviderStatus[]>
    ) {
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
          recommended: true,
        });
      }

      slice.registry.providers = sortProviderList(action.payload).filter(
        isProviderCompatible
      );
      slice.selectedProvider = selectNewSelectedProvider(slice);
    },
    increaseFailedRegistryReconnectAttemptsSinceLastSuccess(slice) {
      slice.registry.failedReconnectAttemptsSinceLastSuccess++;
    },
    setSelectedProvider(
      slice,
      action: PayloadAction<{
        peerId: string;
      }>
    ) {
      slice.selectedProvider = selectNewSelectedProvider(
        slice,
        action.payload.peerId
      );
    },
  },
});

export const {
  listSellersAppendStdOut,
  listSellersAddLog,
  listSellersInitiate,
  listSellersProcessExited,
  setRegistryProviders,
  increaseFailedRegistryReconnectAttemptsSinceLastSuccess,
  setSelectedProvider,
} = providersSlice.actions;

export default providersSlice.reducer;
