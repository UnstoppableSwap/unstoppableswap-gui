import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Multiaddr } from 'multiaddr';
import { isTestnet } from '../config';
import { CliLog, isCliLogFetchedPeerStatus } from '../../models/cliModel';
import { extractAmountFromUnitString } from '../../utils/parseUtils';
import { ExtendedProviderStatus } from '../../models/apiModel';
import { btcToSats } from '../../utils/conversionUtils';

export interface ListSellersSlice {
  sellers: ExtendedProviderStatus[];
  exitCode: number | null;
  processRunning: boolean;
  stdOut: string;
  logs: CliLog[];
}

const initialState: ListSellersSlice = {
  sellers: [],
  processRunning: false,
  exitCode: null,
  stdOut: '',
  logs: [],
};

export const listSellersSlice = createSlice({
  name: 'listSellers',
  initialState,
  reducers: {
    listSellersAppendStdOut(slice, action: PayloadAction<string>) {
      slice.stdOut += action.payload;
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
          slice.sellers.push({
            multiAddr,
            peerId,
            price: btcToSats(price),
            minSwapAmount: btcToSats(minSwapAmount),
            maxSwapAmount: btcToSats(maxSwapAmount),
            testnet: isTestnet(),
          });
        }
      }

      slice.logs.push(log);
    },
    listSellersInitiate(slice) {
      slice.processRunning = true;
      slice.stdOut = '';
      slice.logs = [];
      slice.sellers = [];
      slice.exitCode = null;
    },
    listSellersProcessExited(
      slice,
      action: PayloadAction<{
        exitCode: number | null;
        exitSignal: NodeJS.Signals | null;
      }>
    ) {
      slice.processRunning = false;
      slice.exitCode = action.payload.exitCode;
    },
  },
});

export const {
  listSellersAppendStdOut,
  listSellersAddLog,
  listSellersInitiate,
  listSellersProcessExited,
} = listSellersSlice.actions;

export default listSellersSlice.reducer;
