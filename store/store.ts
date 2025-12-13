import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './languageSlice';
import themeReducer from './themeSlice';
import walletReducer from './walletSlice';
import loginReducer from './loginSlice';
import businessProfileReducer from './businessProfileSlice';
import userReducer from './userContactSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
    theme: themeReducer,
    login: loginReducer,
    businessProfile: businessProfileReducer,
  
    wallet: walletReducer,
    user: userReducer,
    
  },

    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['wallet/fetchData/pending', 'wallet/fetchData/fulfilled', 'wallet/fetchData/rejected'],
        ignoredPaths: ['wallet.transactions'],
      },
    }),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

