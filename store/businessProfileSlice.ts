import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  AccountKind,
  AccountTypePayload,
  BusinessInfoPayload,
  BusinessProfile,
  LocationPayload,
  PersonalInfoPayload,
} from "../types/businessProfile";
import {
  createBusinessProfile as createBusinessProfileApi,
  fetchBusinessProfile as fetchBusinessProfileApi,
  saveBusinessInfo as saveBusinessInfoApi,
  saveLocationInfo as saveLocationInfoApi,
  savePersonalInfo as savePersonalInfoApi,
  submitBusinessProfile as submitBusinessProfileApi,
} from "../lib/api/businessProfile";

type AsyncStatus = "idle" | "loading" | "succeeded" | "failed";

type SectionStatusKey =
  | "bootstrap"
  | "accountType"
  | "personalInfo"
  | "businessInfo"
  | "location"
  | "submit";

type SectionStatuses = Record<SectionStatusKey, AsyncStatus>;

export interface BusinessProfileState {
  profile?: BusinessProfile;
  statuses: SectionStatuses;
  error?: string | null;
}

const initialStatuses: SectionStatuses = {
  bootstrap: "idle",
  accountType: "idle",
  personalInfo: "idle",
  businessInfo: "idle",
  location: "idle",
  submit: "idle",
};

const initialState: BusinessProfileState = {
  profile: undefined,
  statuses: { ...initialStatuses },
  error: null,
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

type ThunkConfig = { state: { businessProfile: BusinessProfileState } };

export const bootstrapBusinessProfile = createAsyncThunk<
  BusinessProfile | null,
  { profileId?: string },
  { rejectValue: string }
>("businessProfile/bootstrap", async ({ profileId }, { rejectWithValue }) => {
  if (!profileId) return null;
  try {
    const data = await fetchBusinessProfileApi(profileId);
    return data;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to load business profile"));
  }
});

export const createBusinessProfile = createAsyncThunk<
  BusinessProfile,
  { accountType: AccountKind; accountName: string },
  { rejectValue: string }
>("businessProfile/create", async ({ accountType, accountName }, { rejectWithValue }) => {
  try {
    const payload: AccountTypePayload = {
      name: accountName,
      type: accountType,
    };
    return await createBusinessProfileApi(payload);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to create business profile"));
  }
});

export const savePersonalInfo = createAsyncThunk<
  PersonalInfoPayload,
  PersonalInfoPayload,
  ThunkConfig & { rejectValue: string }
>("businessProfile/savePersonalInfo", async (payload, { getState, rejectWithValue }) => {
  try {
    const { profile } = getState().businessProfile;
    if (!profile?.id) throw new Error("Profile not created yet");
    await savePersonalInfoApi(profile.id, profile.type, payload);
    return payload;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to save personal info"));
  }
});

export const saveBusinessInfo = createAsyncThunk<
  BusinessInfoPayload,
  BusinessInfoPayload,
  ThunkConfig & { rejectValue: string }
>("businessProfile/saveBusinessInfo", async (payload, { getState, rejectWithValue }) => {
  try {
    const { profile } = getState().businessProfile;
    if (!profile?.id) throw new Error("Profile not created yet");
    await saveBusinessInfoApi(profile.id, profile.type, payload, profile.personalInfo);
    return payload;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to save business info"));
  }
});

export const saveLocationInfo = createAsyncThunk<
  LocationPayload,
  LocationPayload,
  ThunkConfig & { rejectValue: string }
>("businessProfile/saveLocationInfo", async (payload, { getState, rejectWithValue }) => {
  try {
    const { profile } = getState().businessProfile;
    if (!profile?.id) throw new Error("Profile not created yet");
    if (profile.type === "real") {
      throw new Error("Location is not required for real accounts");
    }
    await saveLocationInfoApi(profile.id, profile.type, payload);
    return payload;
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to save location info"));
  }
});

export const submitBusinessProfile = createAsyncThunk<
  void,
  void,
  ThunkConfig & { rejectValue: string }
>("businessProfile/submit", async (_, { getState, rejectWithValue }) => {
  try {
    const { profile } = getState().businessProfile;
    if (!profile?.id) throw new Error("Profile not created yet");
    await submitBusinessProfileApi(profile.id);
  } catch (error) {
    return rejectWithValue(getErrorMessage(error, "Failed to submit business profile"));
  }
});

const businessProfileSlice = createSlice({
  name: "businessProfile",
  initialState,
  reducers: {
    resetStatuses(state) {
      state.statuses = { ...initialStatuses };
      state.error = null;
    },
    setProfileId(state, action: PayloadAction<string>) {
      if (!state.profile) {
        state.profile = { id: action.payload, name: "", type: "legal" };
      } else {
        state.profile.id = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapBusinessProfile.pending, (state) => {
        state.statuses.bootstrap = "loading";
        state.error = null;
      })
      .addCase(bootstrapBusinessProfile.fulfilled, (state, action) => {
        state.statuses.bootstrap = "succeeded";
        if (action.payload) {
          state.profile = action.payload;
        }
      })
      .addCase(bootstrapBusinessProfile.rejected, (state, action) => {
        state.statuses.bootstrap = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(createBusinessProfile.pending, (state) => {
        state.statuses.accountType = "loading";
        state.error = null;
      })
      .addCase(createBusinessProfile.fulfilled, (state, action) => {
        state.statuses.accountType = "succeeded";
        state.profile = action.payload;
      })
      .addCase(createBusinessProfile.rejected, (state, action) => {
        state.statuses.accountType = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(savePersonalInfo.pending, (state) => {
        state.statuses.personalInfo = "loading";
        state.error = null;
      })
      .addCase(savePersonalInfo.fulfilled, (state, action) => {
        state.statuses.personalInfo = "succeeded";
        if (state.profile) {
          state.profile.personalInfo = action.payload;
        }
      })
      .addCase(savePersonalInfo.rejected, (state, action) => {
        state.statuses.personalInfo = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(saveBusinessInfo.pending, (state) => {
        state.statuses.businessInfo = "loading";
        state.error = null;
      })
      .addCase(saveBusinessInfo.fulfilled, (state, action) => {
        state.statuses.businessInfo = "succeeded";
        if (state.profile) {
          state.profile.businessInfo = action.payload;
        }
      })
      .addCase(saveBusinessInfo.rejected, (state, action) => {
        state.statuses.businessInfo = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(saveLocationInfo.pending, (state) => {
        state.statuses.location = "loading";
        state.error = null;
      })
      .addCase(saveLocationInfo.fulfilled, (state, action) => {
        state.statuses.location = "succeeded";
        if (state.profile) {
          state.profile.locationInfo = action.payload;
        }
      })
      .addCase(saveLocationInfo.rejected, (state, action) => {
        state.statuses.location = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      })
      .addCase(submitBusinessProfile.pending, (state) => {
        state.statuses.submit = "loading";
        state.error = null;
      })
      .addCase(submitBusinessProfile.fulfilled, (state) => {
        state.statuses.submit = "succeeded";
      })
      .addCase(submitBusinessProfile.rejected, (state, action) => {
        state.statuses.submit = "failed";
        state.error = action.payload ?? action.error.message ?? null;
      });
  },
});

export const selectBusinessProfileState = (state: { businessProfile: BusinessProfileState }) =>
  state.businessProfile;
export const selectBusinessProfile = (state: { businessProfile: BusinessProfileState }) =>
  state.businessProfile.profile;
export const selectBusinessProfileStatuses = (state: { businessProfile: BusinessProfileState }) =>
  state.businessProfile.statuses;
export const selectProfileId = (state: { businessProfile: BusinessProfileState }) =>
  state.businessProfile.profile?.id;
export const selectCompletedSections = (state: { businessProfile: BusinessProfileState }) => {
  const profile = state.businessProfile.profile;
  const isReal = profile?.type === "real";
  return {
    personal: Boolean(profile?.personalInfo),
    business: Boolean(profile?.businessInfo),
    location: isReal ? true : Boolean(profile?.locationInfo),
    services: true, // placeholder until services step is backed
  };
};
export const selectServicesRequestedCount = () => 0;

export const { resetStatuses, setProfileId } = businessProfileSlice.actions;
export default businessProfileSlice.reducer;
