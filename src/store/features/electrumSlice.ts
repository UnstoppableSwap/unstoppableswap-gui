import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ElectrumTransactionData,
  SwapBlockchainTx,
} from '../../models/electrumModel';

export type ElectrumSlice = {
  transaction: SwapBlockchainTx;
  status: ElectrumTransactionData;
}[];

const initialState: ElectrumSlice = [];

export const electrumSlice = createSlice({
  name: 'electrum',
  initialState,
  reducers: {
    transactionsStatusChanged(
      _,
      {
        payload,
      }: PayloadAction<
        {
          transaction: SwapBlockchainTx;
          status: ElectrumTransactionData;
        }[]
      >
    ) {
      return payload;
    },
  },
});

export const { transactionsStatusChanged } = electrumSlice.actions;

export default electrumSlice.reducer;
