// store/walletSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Language } from '../types';

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
}

const initialState: WalletState = {
  balance: 2500000,
  totalDeposits: 1500000,
  totalWithdrawals: 650000,
  transactionCount: 6,
  transactions: [
    {
      id: '1',
      type: 'deposit',
      amount: 500000,
      date: '2025-12-01',
      description: 'شارژ حساب از درگاه بانکی',
      status: 'completed'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 200000,
      date: '2025-11-30',
      description: 'انتقال به حساب بانکی',
      status: 'completed'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 1000000,
      date: '2025-11-28',
      description: 'دریافت از فروش محصول',
      status: 'completed'
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: 150000,
      date: '2025-11-25',
      description: 'خرید از فروشگاه',
      status: 'completed'
    },
    {
      id: '5',
      type: 'withdrawal',
      amount: 300000,
      date: '2025-11-20',
      description: 'انتقال به کیف پول دیگر',
      status: 'completed'
    },
    {
      id: '6',
      type: 'deposit',
      amount: 300000,
      date: '2025-11-15',
      description: 'بازگشت مبلغ',
      status: 'completed'
    }
  ],
  loading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 4,
  totalPages: 2,
  lastUpdated: new Date().toISOString()
};

// تعریف AsyncThunkConfig
interface AsyncThunkConfig {
  state: unknown;
  rejectValue: string;
}

// Async thunk for fetching wallet data
export const fetchWalletData = createAsyncThunk<
  { 
    balance: number; 
    totalDeposits: number; 
    totalWithdrawals: number; 
    transactionCount: number;
    transactions: Transaction[];
  },
  Language,
  AsyncThunkConfig
>(
  'wallet/fetchData',
  async (language: Language = Language.FA, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data
      return {
        balance: 2500000,
        totalDeposits: 1500000,
        totalWithdrawals: 650000,
        transactionCount: 6,
        transactions: initialState.transactions
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setBalance(state, action: PayloadAction<number>) {
      state.balance = action.payload;
    },
    
    addTransaction(state, action: PayloadAction<Transaction>) {
      // اضافه کردن تراکنش جدید به ابتدای لیست
      state.transactions.unshift(action.payload);
      state.transactionCount = state.transactions.length;
      
      // محاسبه مجدد صفحات
      state.totalPages = Math.ceil(state.transactions.length / state.itemsPerPage);
      
      // به‌روزرسانی موجودی و آمار
      if (action.payload.type === 'deposit') {
        state.totalDeposits += action.payload.amount;
        state.balance += action.payload.amount;
      } else {
        state.totalWithdrawals += action.payload.amount;
        state.balance -= action.payload.amount;
      }
    },
    
    updateWalletData(state, action: PayloadAction<Partial<WalletState>>) {
      return { ...state, ...action.payload };
    },
    
    // Pagination actions
    setCurrentPage(state, action: PayloadAction<number>) {
      const newPage = Math.max(1, Math.min(action.payload, state.totalPages));
      state.currentPage = newPage;
    },
    
    setItemsPerPage(state, action: PayloadAction<number>) {
      state.itemsPerPage = action.payload;
      // محاسبه مجدد صفحات
      state.totalPages = Math.ceil(state.transactions.length / state.itemsPerPage);
      // اگر صفحه جاری بزرگتر از صفحات جدید بود، به آخرین صفحه برو
      if (state.currentPage > state.totalPages) {
        state.currentPage = Math.max(1, state.totalPages);
      }
    },
    
    goToNextPage(state) {
      if (state.currentPage < state.totalPages) {
        state.currentPage += 1;
      }
    },
    
    goToPrevPage(state) {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    
    // Reset pagination to first page
    resetPagination(state) {
      state.currentPage = 1;
    }
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
        state.totalDeposits = action.payload.totalDeposits;
        state.totalWithdrawals = action.payload.totalWithdrawals;
        state.transactionCount = action.payload.transactionCount;
        state.transactions = action.payload.transactions;
        
        
        // محاسبه صفحات بعد از دریافت داده
        state.totalPages = Math.ceil(action.payload.transactionCount / state.itemsPerPage);
        // برگشت به صفحه اول
        state.currentPage = 1;
      })
      .addCase(fetchWalletData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'خطا در دریافت اطلاعات';
      });
  }
});

// Export actions
export const { 
  setBalance, 
  addTransaction, 
  updateWalletData,
  setCurrentPage,
  setItemsPerPage,
  goToNextPage,
  goToPrevPage,
  resetPagination
} = walletSlice.actions;

export default walletSlice.reducer;

// Selector functions (تعریف خارج از slice)
export const selectCurrentPageTransactions = (state: { wallet: WalletState }) => {
  const { transactions, currentPage, itemsPerPage } = state.wallet;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return transactions.slice(startIndex, endIndex);
};

export const selectPaginationInfo = (state: { wallet: WalletState }) => {
  const { transactions, currentPage, itemsPerPage, totalPages } = state.wallet;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  return {
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems: transactions.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, transactions.length)
  };
};