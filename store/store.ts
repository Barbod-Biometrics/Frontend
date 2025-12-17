import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import themeReducer from './themeSlice';
import walletReducer from './walletSlice';
import loginReducer from './loginSlice';
import businessProfileReducer from './businessProfileSlice';
import userReducer from './userContactSlice';
import selectedProfileReducer from './selectedProfileSlice';
import businessInfoReducer from './businessInfoSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    theme: themeReducer,
    login: loginReducer,
    businessProfile: businessProfileReducer,
    wallet: walletReducer,
    user: userReducer,
    selectedProfile: selectedProfileReducer,
    businessInfo: businessInfoReducer,
    
  },

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

