import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../types';
import { walletDeposit, getWalletSummary, getWalletTransactions, mapTransaction, currencyUtils } from '../lib/wallet-api';
import { setCurrentProfile } from './selectedProfileSlice';

export interface Transaction {
  id: string;
  type: 'deposit';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface WalletState {
  balance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  lastUpdated?: string;
  apiLoading: { summary: boolean; transactions: boolean; deposit: boolean };
  currentProfileId?: string;
  allTransactionsLoaded: boolean;
  transactionsMap: Record<string, Transaction[]>;
}

const initialState: WalletState = {
  balance: 0,
  totalDeposits: 0,
  totalWithdrawals: 0,
  transactionCount: 0,
  transactions: [],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalPages: 1,
  lastUpdated: undefined,
  apiLoading: { summary: false, transactions: false, deposit: false },
  currentProfileId: undefined,
  allTransactionsLoaded: false,
  transactionsMap: {}
};

export const fetchWalletSummary = createAsyncThunk(
  'wallet/fetchSummary',
  async (args: { profileId?: string } | void, { rejectWithValue, getState }) => {
    try {
      const profileId = typeof args === 'object' ? args?.profileId : undefined;
      
      let finalProfileId = profileId;
      if (!finalProfileId) {
        const state = getState() as any;
        finalProfileId = state.selectedProfile?.currentProfile?.id;
      }
      
      if (!finalProfileId) {
        return rejectWithValue('پروفایل انتخاب نشده است');
      }
      
      const res = await getWalletSummary(finalProfileId);
      return {
        profileId: finalProfileId,
        balance: currencyUtils.rialToToman(res.data.balance),
        totalDeposits: currencyUtils.rialToToman(res.data.total_deposits),
        totalWithdrawals: currencyUtils.rialToToman(res.data.total_withdrawals),
        transactionCount: res.data.transaction_count,
        lastUpdated: res.data.last_updated,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت اطلاعات کیف پول');
    }
  }
);

export const fetchWalletTransactions = createAsyncThunk(
  'wallet/fetchTransactions',
  async (
    args: { 
      page?: number; 
      pageSize?: number; 
      profileId?: string;
      reset?: boolean;
    } = {}, 
    { rejectWithValue, getState }
  ) => {
    try {
      const { page = 1, pageSize = 10, profileId, reset = false } = args;
      
      let finalProfileId = profileId;
      if (!finalProfileId) {
        const state = getState() as any;
        finalProfileId = state.selectedProfile?.currentProfile?.id;
      }
      
      if (!finalProfileId) {
        return rejectWithValue('پروفایل انتخاب نشده است');
      }
      
      const res = await getWalletTransactions(page, pageSize, finalProfileId);
      return {
        profileId: finalProfileId,
        transactions: res.data.transactions.map(mapTransaction),
        totalCount: res.data.total_count,
        currentPage: res.data.page,
        totalPages: res.data.total_pages,
        pageSize: res.data.page_size,
        reset,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت تراکنش‌ها');
    }
  }
);

export const createDeposit = createAsyncThunk(
  'wallet/createDeposit',
  async (
    args: { 
      amount: number; 
      description?: string;
      profileId?: string 
    }, 
    { rejectWithValue, getState }
  ) => {
    try {
      const { amount, description, profileId } = args;
      
      let finalProfileId = profileId;
      if (!finalProfileId) {
        const state = getState() as any;
        finalProfileId = state.selectedProfile?.currentProfile?.id;
      }
      
      if (!finalProfileId) {
        return rejectWithValue('پروفایل انتخاب نشده است');
      }
      
      const res = await walletDeposit(amount, description, finalProfileId);
      
      if (!res.success) {
        return rejectWithValue(res.data.message || 'واریز ناموفق بود');
      }

      return {
        profileId: finalProfileId,
        transactionId: res.data.transaction_id,
        newBalance: currencyUtils.rialToToman(res.data.new_balance),
        message: res.data.message,
        amount,
        description: description || 'واریز',
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در پردازش واریز');
    }
  }
);

export const fetchWalletData = createAsyncThunk(
  'wallet/fetchData',
  async (language: Language = Language.FA, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        balance: 2500000,
        totalDeposits: 1500000,
        totalWithdrawals: 650000,
        transactionCount: 6,
        transactions: []
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'خطای ناشناخته');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    goToNextPage(state) {
      if (state.currentPage < state.totalPages) state.currentPage++;
    },
    goToPrevPage(state) {
      if (state.currentPage > 1) state.currentPage--;
    },
    clearError(state) {
      state.error = null;
    },
    resetWalletForProfileChange(state, action: PayloadAction<string | undefined>) {
      const newProfileId = action.payload;
      
      if (state.currentProfileId && state.transactions.length > 0) {
        state.transactionsMap[state.currentProfileId] = [...state.transactions];
      }
      
      state.balance = 0;
      state.totalDeposits = 0;
      state.totalWithdrawals = 0;
      state.transactionCount = 0;
      state.transactions = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.lastUpdated = undefined;
      state.allTransactionsLoaded = false;
      state.currentProfileId = newProfileId;
      
      if (newProfileId && state.transactionsMap[newProfileId]) {
        state.transactions = state.transactionsMap[newProfileId];
        state.transactionCount = state.transactions.length;
        state.totalPages = Math.ceil(state.transactions.length / state.itemsPerPage);
      }
    },
    setCurrentProfileId(state, action: PayloadAction<string>) {
      state.currentProfileId = action.payload;
    },
    clearWalletCache(state) {
      state.transactionsMap = {};
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setCurrentProfile, (state, action) => {
      const newProfileId = action.payload.id;
      
      if (state.currentProfileId !== newProfileId) {
        if (state.currentProfileId && state.transactions.length > 0) {
          state.transactionsMap[state.currentProfileId] = [...state.transactions];
        }
        
        state.balance = 0;
        state.transactions = [];
        state.transactionCount = 0;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalDeposits = 0;
        state.totalWithdrawals = 0;
        state.lastUpdated = undefined;
        state.allTransactionsLoaded = false;
        state.currentProfileId = newProfileId;
        
        if (state.transactionsMap[newProfileId]) {
          state.transactions = state.transactionsMap[newProfileId];
          state.transactionCount = state.transactions.length;
          state.totalPages = Math.ceil(state.transactions.length / state.itemsPerPage);
        }
      }
    });

    builder.addCase(fetchWalletSummary.pending, (state) => {
      state.apiLoading.summary = true;
      state.error = null;
    }).addCase(fetchWalletSummary.fulfilled, (state, action) => {
      state.apiLoading.summary = false;
      
      if (!state.currentProfileId || state.currentProfileId === action.payload.profileId) {
        state.balance = action.payload.balance;
        state.totalDeposits = action.payload.totalDeposits;
        state.totalWithdrawals = action.payload.totalWithdrawals;
        state.transactionCount = action.payload.transactionCount;
        state.lastUpdated = action.payload.lastUpdated;
        state.currentProfileId = action.payload.profileId;
      }
    }).addCase(fetchWalletSummary.rejected, (state, action) => {
      state.apiLoading.summary = false;
      state.error = action.payload as string;
    });

    builder.addCase(fetchWalletTransactions.pending, (state) => {
      state.apiLoading.transactions = true;
      state.error = null;
    }).addCase(fetchWalletTransactions.fulfilled, (state, action) => {
      state.apiLoading.transactions = false;
  
      if (!state.currentProfileId || state.currentProfileId === action.payload.profileId) {
        state.transactions = action.payload.transactions;
        state.transactionCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.itemsPerPage = action.payload.pageSize;
        state.currentProfileId = action.payload.profileId;
        
        if (state.transactionsMap) {
          state.transactionsMap[action.payload.profileId] = [...state.transactions];
        }
      }
    }).addCase(fetchWalletTransactions.rejected, (state, action) => {
      state.apiLoading.transactions = false;
      state.error = action.payload as string;
    });

    builder.addCase(createDeposit.pending, (state) => {
      state.apiLoading.deposit = true;
      state.error = null;
    }).addCase(createDeposit.fulfilled, (state, action) => {
      state.apiLoading.deposit = false;
      
      if (!state.currentProfileId || state.currentProfileId === action.payload.profileId) {
        const newTx: Transaction = {
          id: action.payload.transactionId,
          type: 'deposit',
          amount: action.payload.amount,
          date: new Date().toISOString().split('T')[0],
          description: action.payload.description,
          status: 'completed',
        };
        
        state.transactions.unshift(newTx);
        state.balance = action.payload.newBalance;
        state.totalDeposits += action.payload.amount;
        state.transactionCount += 1;
        state.totalPages = Math.ceil(state.transactionCount / state.itemsPerPage);
        state.lastUpdated = new Date().toISOString();
        state.currentProfileId = action.payload.profileId;
        
        if (state.currentProfileId) {
          state.transactionsMap[state.currentProfileId] = [...state.transactions];
        }
      }
    }).addCase(createDeposit.rejected, (state, action) => {
      state.apiLoading.deposit = false;
      state.error = action.payload as string;
    });

    builder
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading = false;
      
        if (state.transactions.length === 0) {
          state.balance = action.payload.balance;
          state.totalDeposits = action.payload.totalDeposits;
          state.totalWithdrawals = action.payload.totalWithdrawals;
          state.transactionCount = action.payload.transactionCount;
          state.transactions = action.payload.transactions;
          state.totalPages = Math.ceil(action.payload.transactionCount / state.itemsPerPage);
          state.currentPage = 1;
        }
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'خطا در دریافت اطلاعات';
      });
  },
});

export const { 
  setCurrentPage, 
  goToNextPage, 
  goToPrevPage, 
  clearError,
  resetWalletForProfileChange,
  setCurrentProfileId,
  clearWalletCache
} = walletSlice.actions;
export default walletSlice.reducer;

export const selectCurrentPageTransactions = (state: { wallet: WalletState }) => {
  const { transactions, currentPage, itemsPerPage, currentProfileId } = state.wallet;
  
  if (!currentProfileId || transactions.length === 0) {
    return [];
  }
  
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  
  if (start >= transactions.length) {
    return [];
  }
  
  return transactions.slice(start, Math.min(end, transactions.length));
};

export const selectApiLoading = (state: { wallet: WalletState }) => state.wallet.apiLoading;
export const selectWalletError = (state: { wallet: WalletState }) => state.wallet.error;

export const selectIsProfileMatch = (state: { wallet: WalletState; selectedProfile: any }) => {
  return state.wallet.currentProfileId === state.selectedProfile?.currentProfile?.id;
};

export const selectCurrentProfileTransactions = (state: { wallet: WalletState }) => {
  const { currentProfileId, transactions } = state.wallet;
  return currentProfileId ? transactions : [];
};