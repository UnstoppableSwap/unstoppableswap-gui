import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MergedDbState } from '../../../models/databaseModel';

const initialState: MergedDbState[] = [];

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    databaseStateChanged: (_, action: PayloadAction<MergedDbState[]>) =>
      action.payload,
  },
});

export const { databaseStateChanged } = historySlice.actions;

export default historySlice.reducer;
