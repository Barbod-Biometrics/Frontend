import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import themeReducer from './themeSlice';
import loginReducer from './loginSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    theme: themeReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
