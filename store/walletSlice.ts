import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../types';
import { walletDeposit, getWalletSummary, getWalletTransactions, mapTransaction, currencyUtils } from '../lib/wallet-api';

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
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
  apiLoading: { summary: false, transactions: false, deposit: false }
};

// Async Thunks
export const fetchWalletSummary = createAsyncThunk(
  'wallet/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getWalletSummary();
      return {
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
  async ({ page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {}, { rejectWithValue }) => {
    try {
      const res = await getWalletTransactions(page, pageSize);
      return {
        transactions: res.data.transactions.map(mapTransaction),
        totalCount: res.data.total_count,
        currentPage: res.data.page,
        totalPages: res.data.total_pages,
        pageSize: res.data.page_size,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت تراکنش‌ها');
    }
  }
);

export const createDeposit = createAsyncThunk(
  'wallet/createDeposit',
  async ({ amount, description }: { amount: number; description?: string }, { rejectWithValue }) => {
    try {
      const res = await walletDeposit(amount, description);
      
      
      if (!res.success) {
        return rejectWithValue(res.data.message || 'واریز ناموفق بود');
      }

      return {
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
  },
  extraReducers: (builder) => {
    // Summary
    builder.addCase(fetchWalletSummary.pending, (state) => {
      state.apiLoading.summary = true;
      state.error = null;
    }).addCase(fetchWalletSummary.fulfilled, (state, action) => {
      state.apiLoading.summary = false;
      state.balance = action.payload.balance;
      state.totalDeposits = action.payload.totalDeposits;
      state.totalWithdrawals = action.payload.totalWithdrawals;
      state.transactionCount = action.payload.transactionCount;
      state.lastUpdated = action.payload.lastUpdated;
    }).addCase(fetchWalletSummary.rejected, (state, action) => {
      state.apiLoading.summary = false;
      state.error = action.payload as string;
    });

    // Transactions
    builder.addCase(fetchWalletTransactions.pending, (state) => {
      state.apiLoading.transactions = true;
      state.error = null;
    }).addCase(fetchWalletTransactions.fulfilled, (state, action) => {
      state.apiLoading.transactions = false;
      state.transactions = action.payload.transactions;
      state.transactionCount = action.payload.totalCount;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.itemsPerPage = action.payload.pageSize;
    }).addCase(fetchWalletTransactions.rejected, (state, action) => {
      state.apiLoading.transactions = false;
      state.error = action.payload as string;
    });

    // Deposit
    builder.addCase(createDeposit.pending, (state) => {
      state.apiLoading.deposit = true;
      state.error = null;
    }).addCase(createDeposit.fulfilled, (state, action) => {
      state.apiLoading.deposit = false;
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
      state.transactionCount = state.transactions.length;
      state.totalPages = Math.ceil(state.transactions.length / state.itemsPerPage);
      state.lastUpdated = new Date().toISOString();
    }).addCase(createDeposit.rejected, (state, action) => {
      state.apiLoading.deposit = false;
      state.error = action.payload as string;
    });

    // Legacy
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

export const { setCurrentPage, goToNextPage, goToPrevPage, clearError } = walletSlice.actions;
export default walletSlice.reducer;

export const selectCurrentPageTransactions = (state: { wallet: WalletState }) => {
  const { transactions, currentPage, itemsPerPage } = state.wallet;
  const start = (currentPage - 1) * itemsPerPage;
  return transactions.slice(start, start + itemsPerPage);
};

export const selectApiLoading = (state: { wallet: WalletState }) => state.wallet.apiLoading;
export const selectWalletError = (state: { wallet: WalletState }) => state.wallet.error;