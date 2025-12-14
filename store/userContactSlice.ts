// store/userSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  getUserInfo, 
  updateUserInfo, 
  UserInfo, 
  UpdateUserInfo 
} from '../lib/userContact-api';

interface UserState {
  email: string;
  phone_number: string;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  email: '',
  phone_number: '',
  loading: false,
  error: null,
};

export const fetchUserInfo = createAsyncThunk(
  'user/fetchInfo',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getUserInfo();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت اطلاعات');
    }
  }
);

export const updateUserContact = createAsyncThunk(
  'user/updateContact',
  async (data: UpdateUserInfo, { rejectWithValue }) => {
    try {
      const response = await updateUserInfo(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در بروزرسانی اطلاعات');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.email = action.payload.email;
      state.phone_number = action.payload.phone_number;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        state.email = action.payload.email;
        state.phone_number = action.payload.phone_number;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserContact.fulfilled, (state, action: PayloadAction<UserInfo>) => {
        state.loading = false;
        if (action.payload.email !== undefined) {
          state.email = action.payload.email;
        }
        if (action.payload.phone_number !== undefined) {
          state.phone_number = action.payload.phone_number;
        }
      })
      .addCase(updateUserContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUserInfo } = userSlice.actions;
export default userSlice.reducer;