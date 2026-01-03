import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ticketsAdminApi } from '../lib//ticketsAdmin-api';
import type { ApiError } from '../lib//api-client';

export interface TicketUserContact {
  email: string;
  phone: string;
}

export interface TicketSummary {
  id: string;
  title: string;
  service: string;
  status: string;
  createdAt: string;
  lastMessageAt: string;
  userContact: TicketUserContact;
}

export interface TicketDetail extends TicketSummary {
  userId: string;
  message: string;
  updatedAt: string;
  fileUrl?: string;
}

export interface TicketFileUrl {
  url: string;
}

interface AdminTicketsState {
  allTickets: TicketSummary[];
  displayedTickets: TicketSummary[];
  currentTicket: TicketDetail | null;
  currentFileUrl: string | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string; 
    search: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

const initialState: AdminTicketsState = {
  allTickets: [],
  displayedTickets: [],
  currentTicket: null,
  currentFileUrl: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    search: '',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
};

interface RejectValue {
  message: string;
  status?: number;
}

export const fetchAdminTickets = createAsyncThunk<
  TicketSummary[],
  void,
  { rejectValue: RejectValue }
>(
  'ticketsAdmin/fetchTickets',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketsAdminApi.fetchTickets();
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Failed to fetch tickets',
        status: apiError.status,
      });
    }
  }
);

export const fetchAdminTicketDetail = createAsyncThunk<
  TicketDetail,
  string,
  { rejectValue: RejectValue }
>(
  'ticketsAdmin/fetchTicketDetail',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await ticketsAdminApi.fetchTicketDetail(ticketId);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Failed to fetch ticket details',
        status: apiError.status,
      });
    }
  }
);

export const fetchAdminTicketFileUrl = createAsyncThunk<
  TicketFileUrl,
  string,
  { rejectValue: RejectValue }
>(
  'ticketsAdmin/fetchTicketFileUrl',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await ticketsAdminApi.fetchTicketFileUrl(ticketId);
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return rejectWithValue({
        message: apiError.message || 'Failed to fetch file URL',
        status: apiError.status,
      });
    }
  }
);

const filterAndPaginateTickets = (
  tickets: TicketSummary[],
  filters: { status: string; search: string },
  pagination: { currentPage: number; itemsPerPage: number }
) => {
  let filtered = [...tickets];
  
 
  if (filters.status) {
    filtered = filtered.filter(ticket => ticket.status === filters.status);
  }
  
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(ticket =>
      ticket.title.toLowerCase().includes(searchLower) ||
      ticket.service.toLowerCase().includes(searchLower) ||
      ticket.userContact.phone.includes(filters.search)
    );
  }
  
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginated = filtered.slice(startIndex, endIndex);
  
  return {
    filtered,
    paginated,
    totalItems: filtered.length,
    totalPages: Math.ceil(filtered.length / pagination.itemsPerPage),
  };
};

const ticketsAdminSlice = createSlice({
  name: 'ticketsAdmin',
  initialState,
  reducers: {
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.filters.status = action.payload;
      state.pagination.currentPage = 1;
      
      const result = filterAndPaginateTickets(
        state.allTickets,
        { ...state.filters, status: action.payload },
        state.pagination
      );
      
      state.displayedTickets = result.paginated;
      state.pagination.totalItems = result.totalItems;
      state.pagination.totalPages = result.totalPages;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
      
      const result = filterAndPaginateTickets(
        state.allTickets,
        { ...state.filters, search: action.payload },
        state.pagination
      );
      
      state.displayedTickets = result.paginated;
      state.pagination.totalItems = result.totalItems;
      state.pagination.totalPages = result.totalPages;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
      
      const result = filterAndPaginateTickets(
        state.allTickets,
        state.filters,
        { ...state.pagination, currentPage: action.payload }
      );
      
      state.displayedTickets = result.paginated;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
      state.currentFileUrl = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
      
      const result = filterAndPaginateTickets(
        state.allTickets,
        initialState.filters,
        state.pagination
      );
      
      state.displayedTickets = result.paginated;
      state.pagination.totalItems = result.totalItems;
      state.pagination.totalPages = result.totalPages;
    },
    resetPage: (state) => {
      state.pagination.currentPage = 1;
      
      const result = filterAndPaginateTickets(
        state.allTickets,
        state.filters,
        { ...state.pagination, currentPage: 1 }
      );
      
      state.displayedTickets = result.paginated;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.allTickets = action.payload || [];
        
        const result = filterAndPaginateTickets(
          action.payload || [],
          state.filters,
          state.pagination
        );
        
        state.displayedTickets = result.paginated;
        state.pagination.totalItems = result.totalItems;
        state.pagination.totalPages = result.totalPages;
      })
      .addCase(fetchAdminTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch tickets';
      })
      .addCase(fetchAdminTicketDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTicketDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTicket = action.payload;
      })
      .addCase(fetchAdminTicketDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch ticket details';
      })
      .addCase(fetchAdminTicketFileUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminTicketFileUrl.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFileUrl = action.payload.url;
      })
      .addCase(fetchAdminTicketFileUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch file URL';
      });
  },
});

export const {
  setStatusFilter,
  setSearchTerm,
  setCurrentPage,
  clearCurrentTicket,
  clearError,
  resetFilters,
  resetPage,
} = ticketsAdminSlice.actions;

export default ticketsAdminSlice.reducer;