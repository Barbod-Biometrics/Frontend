
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBusinessInfo } from '../lib/businessInfo-api';

export interface BusinessInfoState {
  data: any | null;
  loading: boolean;
  error: string | null;
  lastFetchedProfileId: string | null;
}

const initialState: BusinessInfoState = {
  data: null,
  loading: false,
  error: null,
  lastFetchedProfileId: null,
};

export const fetchBusinessInfo = createAsyncThunk(
  'businessInfo/fetchData',
  async (profileId: string, { rejectWithValue }) => {
    try {
      const data = await getBusinessInfo(profileId);
      return { profileId, data };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت اطلاعات کسب‌وکار');
    }
  }
);

const businessInfoSlice = createSlice({
  name: 'businessInfo',
  initialState,
  reducers: {
    clearBusinessInfo: (state) => {
      state.data = null;
      state.error = null;
      state.lastFetchedProfileId = null;
    },
    resetBusinessInfoError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.lastFetchedProfileId = action.payload.profileId;
      })
      .addCase(fetchBusinessInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

export const { clearBusinessInfo, resetBusinessInfoError } = businessInfoSlice.actions;
export default businessInfoSlice.reducer;