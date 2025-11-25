import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '../types';

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: Theme.DARK, // Default to Dark
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;