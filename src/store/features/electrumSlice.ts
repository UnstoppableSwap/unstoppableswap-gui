import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ElectrumServerAddress,
  ElectrumTransactionData,
  SwapBlockchainTx,
} from '../../models/electrumModel';

export type ElectrumSlice = {
  txs: {
    transaction: SwapBlockchainTx;
    status: ElectrumTransactionData;
  }[];
  connection: ElectrumServerAddress | null;
};

const initialState: ElectrumSlice = {
  txs: [],
  connection: null,
};

export const electrumSlice = createSlice({
  name: 'electrum',
  initialState,
  reducers: {
    connectedToElectrumServer: (
      state,
      action: PayloadAction<ElectrumServerAddress>
    ) => {
      state.connection = action.payload;
    },
    disconnectedFromElectrumServer: (state) => {
      state.connection = null;
    },
    transactionsStatusChanged(
      slice,
      { payload }: PayloadAction<ElectrumSlice['txs']>
    ) {
      slice.txs = payload;
    },
  },
});

export const {
  transactionsStatusChanged,
  connectedToElectrumServer,
  disconnectedFromElectrumServer,
} = electrumSlice.actions;

export default electrumSlice.reducer;
