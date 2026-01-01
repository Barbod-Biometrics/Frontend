// store/slices/ticketsSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTicketsAPI, createTicketAPI, closeTicketAPI } from '..//lib/ticketsUser-api';

export interface SupportTicket {
  id: string;
  service: string;
  title: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
  description?: string;
  attachment?: string;
}

export interface TicketsState {
  items: SupportTicket[];
  allItems: SupportTicket[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    status: string;
  };
}

const initialState: TicketsState = {
  items: [],
  allItems: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  },
  filters: {
    status: 'all',
  },
};


export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async ({ status = 'all' }: { status?: string }, { rejectWithValue }) => {
    try {
      const response = await fetchTicketsAPI({ status });
      return {
        data: response.data,
        success: response.success,
        status,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در دریافت تیکت‌ها');
    }
  }
);


export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData: {
    service: string;
    title: string;
    description: string;
    attachment?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await createTicketAPI(ticketData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در ایجاد تیکت');
    }
  }
);

export const closeTicket = createAsyncThunk(
  'tickets/closeTicket',
  async (ticketId: string, { rejectWithValue }) => {
    try {
      const response = await closeTicketAPI(ticketId);
      return {
        ticketId,
        response,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'خطا در بستن تیکت');
    }
  }
);


function applyPaginationAndFilter(state: TicketsState) {

  let filteredItems = state.allItems;
  
  if (state.filters.status !== 'all') {
    filteredItems = state.allItems.filter(ticket => ticket.status === state.filters.status);
  }
  

  state.pagination.total = filteredItems.length;
  state.pagination.totalPages = Math.ceil(filteredItems.length / state.pagination.limit);
  

  const start = (state.pagination.page - 1) * state.pagination.limit;
  const end = start + state.pagination.limit;
  state.items = filteredItems.slice(start, end);
}

const ticketsSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
      applyPaginationAndFilter(state);
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.pagination.page = 1;
      applyPaginationAndFilter(state);
    },
    addTicket: (state, action: PayloadAction<SupportTicket>) => {
      state.allItems.unshift(action.payload);
      applyPaginationAndFilter(state);
    },
    clearError: (state) => {
      state.error = null;
    },
    resetTickets: (state) => {
      state.items = [];
      state.allItems = [];
      state.pagination.page = 1;
      state.pagination.total = 0;
      state.pagination.totalPages = 1;
    },
 
    updateTicketStatus: (state, action: PayloadAction<{ticketId: string, status: 'pending' | 'answered' | 'closed'}>) => {
      const { ticketId, status } = action.payload;
      
   
      const ticketIndex = state.allItems.findIndex(ticket => ticket.id === ticketId);
      if (ticketIndex !== -1) {
        state.allItems[ticketIndex] = {
          ...state.allItems[ticketIndex],
          status
        };
      }
      
  
      applyPaginationAndFilter(state);
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.success) {
  
          state.allItems = action.payload.data;
          
         
          applyPaginationAndFilter(state);
        }
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createTicket
      .addCase(createTicket.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.allItems.unshift(action.payload.data);
          applyPaginationAndFilter(state);
        }
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      
      // closeTicket
      .addCase(closeTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.loading = false;
        
        
        const { ticketId } = action.payload;
        const ticketIndex = state.allItems.findIndex(ticket => ticket.id === ticketId);
        
        if (ticketIndex !== -1) {
          state.allItems[ticketIndex] = {
            ...state.allItems[ticketIndex],
            status: 'closed'
          };
          
        
          applyPaginationAndFilter(state);
        }
      })
      .addCase(closeTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setPage, 
  setStatusFilter, 
  addTicket, 
  clearError, 
  resetTickets,
  updateTicketStatus 
} = ticketsSlice.actions;

export default ticketsSlice.reducer;