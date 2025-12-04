import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import themeReducer from './themeSlice';
import businessProfileReducer from './businessProfileSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    theme: themeReducer,
    businessProfile: businessProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
