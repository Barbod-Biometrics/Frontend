import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { requestOtp, verifyOtp, VerifyOtpResponse } from "../lib/auth-api";
import { getIsAdmin, saveAuth } from "../lib/auth-storage";
import type { RootState } from "./store";

type Step = "login" | "otp";

interface LoginState {
  step: Step;
  phoneNumber: string;
  authError: string | null;
  isSubmitting: boolean;
  isHovered: boolean;
  isAdmin?: boolean;
  hydrated: boolean;
}

const initialState: LoginState = {
  step: "login",
  phoneNumber: "",
  authError: null,
  isSubmitting: false,
  isHovered: false,
  isAdmin: undefined,
  hydrated: false,
};

const toMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};

const maskPhoneNumber = (phone: string) => {
  if (!phone) return "";
  const normalized = phone.replace(/\s/g, "");
  const lastDigits = normalized.slice(-4);
  const masked = normalized.slice(0, -4).replace(/\d/g, "*");
  return `${masked}${lastDigits}`;
};

export const requestOtpThunk = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("login/requestOtp", async (phoneNumber, { rejectWithValue }) => {
  try {
    await requestOtp(phoneNumber);
  } catch (error) {
    return rejectWithValue(
      toMessage(error, "Unable to send the code right now. Please try again.")
    );
  }
});

export const verifyOtpThunk = createAsyncThunk<
  VerifyOtpResponse,
  string,
  { state: RootState; rejectValue: string }
>("login/verifyOtp", async (otp, { getState, rejectWithValue }) => {
  const phoneNumber = getState().login.phoneNumber;
  if (!phoneNumber) {
    return rejectWithValue("Missing phone number. Please start again.");
  }

  try {
    return await verifyOtp(phoneNumber, otp);
  } catch (error) {
    return rejectWithValue(
      toMessage(error, "Verification failed. Please try again.")
    );
  }
});

export const resendOtpThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: string }
>("login/resendOtp", async (_, { getState, rejectWithValue }) => {
  const phoneNumber = getState().login.phoneNumber;
  if (!phoneNumber) {
    return rejectWithValue("Missing phone number. Please start again.");
  }

  try {
    await requestOtp(phoneNumber);
  } catch (error) {
    return rejectWithValue(
      toMessage(error, "Unable to send the code right now. Please try again.")
    );
  }
});

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setIsHovered(state, action: PayloadAction<boolean>) {
      state.isHovered = action.payload;
    },
    hydrateFromStorage(state) {
      if (typeof window === "undefined") return;
      const isAdmin = getIsAdmin();
      if (typeof isAdmin === "boolean") {
        state.isAdmin = isAdmin;
        state.step = "otp";
      }
      // mark that we've checked persistent storage
      state.hydrated = true;
    },
    resetLogin(state) {
      state.step = "login";
      state.phoneNumber = "";
      state.authError = null;
      state.isSubmitting = false;
      state.isHovered = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestOtpThunk.pending, (state) => {
        state.isSubmitting = true;
        state.authError = null;
      })
      .addCase(requestOtpThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.phoneNumber = action.meta.arg;
        state.step = "otp";
      })
      .addCase(requestOtpThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.authError =
          action.payload ||
          "Unable to send the code right now. Please try again.";
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.isSubmitting = true;
        state.authError = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.authError = null;
        // store admin flag on successful verification
        const payload = action.payload as VerifyOtpResponse | undefined;
        state.isAdmin = payload?.is_admin ?? false;
        // persist tokens and related info
        if (payload) saveAuth(payload);
        // mark authenticated state as checked
        state.hydrated = true;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.authError =
          action.payload || "Verification failed. Please try again.";
        if (action.payload === "Missing phone number. Please start again.") {
          state.step = "login";
          state.phoneNumber = "";
        }
      })
      .addCase(resendOtpThunk.pending, (state) => {
        state.isSubmitting = true;
        state.authError = null;
      })
      .addCase(resendOtpThunk.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(resendOtpThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.authError =
          action.payload ||
          "Unable to send the code right now. Please try again.";
      });
  },
});

export const { setIsHovered, resetLogin, hydrateFromStorage } =
  loginSlice.actions;

export const selectLogin = (state: RootState) => state.login;
export const selectMaskedPhone = (state: RootState) =>
  maskPhoneNumber(state.login.phoneNumber);

export const selectIsAdmin = (state: RootState) => state.login.isAdmin;
export const selectIsAuthenticated = (state: RootState) =>
  typeof state.login.isAdmin !== "undefined";
export const selectIsHydrated = (state: RootState) => state.login.hydrated;

export default loginSlice.reducer;
