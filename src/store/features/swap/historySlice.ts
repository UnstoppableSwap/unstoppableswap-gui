import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EncapsulatedDbState } from '../../../models/database';

const initialState: EncapsulatedDbState[] = [];

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    databaseStateChanged: (_, action: PayloadAction<EncapsulatedDbState[]>) =>
      action.payload,
  },
});

export const { databaseStateChanged } = historySlice.actions;

export default historySlice.reducer;
