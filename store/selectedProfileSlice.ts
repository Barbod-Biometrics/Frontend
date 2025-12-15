
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ProfileListItem, fetchUserProfiles } from '../lib/api/userProfiles';

interface SelectedProfileState {
  currentProfile: ProfileListItem | null;
  allProfiles: ProfileListItem[];
  loading: boolean;
  error: string | null;
  
}

const initialState: SelectedProfileState = {
  currentProfile: null,
  allProfiles: [],
  loading: false,
  error: null,
};

export const loadUserProfiles = createAsyncThunk(
  'selectedProfile/loadProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const profiles = await fetchUserProfiles();
      return profiles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت کسب‌وکارها');
    }
  }
);

const selectedProfileSlice = createSlice({
  name: 'selectedProfile',
  initialState,
  reducers: {
    setCurrentProfile(state, action: PayloadAction<ProfileListItem>) {
      state.currentProfile = action.payload;
     
      if (typeof window !== 'undefined') {
        localStorage.setItem('selected_profile_id', action.payload.id);
        localStorage.setItem('selected_profile_name', action.payload.name);
      }
    },
    
  
    selectProfileById(state, action: PayloadAction<string>) {
      const profileId = action.payload;
      const profile = state.allProfiles.find(p => p.id === profileId);
      
      if (profile) {
        state.currentProfile = profile;
        
       
        if (typeof window !== 'undefined') {
          localStorage.setItem('selected_profile_id', profile.id);
          localStorage.setItem('selected_profile_name', profile.name);
        }
      }
    },
    
    clearCurrentProfile(state) {
      state.currentProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.allProfiles = action.payload;
        
       
        if (action.payload.length > 0 && !state.currentProfile) {
          const savedId = typeof window !== 'undefined' 
            ? localStorage.getItem('selected_profile_id') 
            : null;
          
          let profileToSelect: ProfileListItem | null = null;
          
          if (savedId) {
           
            profileToSelect = action.payload.find(p => p.id === savedId) || null;
          }
          
        
          if (!profileToSelect) {
            profileToSelect = action.payload[0];
          }
          
          state.currentProfile = profileToSelect;
          
         
          if (typeof window !== 'undefined') {
            localStorage.setItem('selected_profile_id', profileToSelect.id);
            localStorage.setItem('selected_profile_name', profileToSelect.name);
          }
        }
      })
      .addCase(loadUserProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export const { 
  setCurrentProfile, 
  selectProfileById, 
  clearCurrentProfile 
} = selectedProfileSlice.actions;

export default selectedProfileSlice.reducer;

// Selectors
export const selectCurrentProfile = (state: { selectedProfile: SelectedProfileState }) => 
  state.selectedProfile.currentProfile;

export const selectCurrentProfileId = (state: { selectedProfile: SelectedProfileState }) => 
  state.selectedProfile.currentProfile?.id;

export const selectAllProfiles = (state: { selectedProfile: SelectedProfileState }) => 
  state.selectedProfile.allProfiles;