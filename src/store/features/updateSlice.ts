import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UpdateInfo } from 'electron-updater';

export interface UpdateState {
  updateNotification: UpdateInfo | null;
}

const initialState: UpdateState = {
  updateNotification: null,
};

const updateSlice = createSlice({
  name: 'update',
  initialState,
  reducers: {
    updateReceived: (state, action: PayloadAction<UpdateInfo>) => {
      state.updateNotification = action.payload;
    },
    updateShownToUser: (state) => {
      state.updateNotification = null;
    },
  },
});

export const { updateReceived, updateShownToUser } = updateSlice.actions;

export default updateSlice.reducer;
