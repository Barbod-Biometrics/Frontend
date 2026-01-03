import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store';
import {
  fetchAdminTickets,
  fetchAdminTicketDetail,
  fetchAdminTicketFileUrl,
  setStatusFilter,
  setSearchTerm,
  setCurrentPage,
  clearCurrentTicket,
  clearError,
  resetFilters,
  resetPage,
} from '../store/ticketsAdminSlice';
import { useCallback } from 'react';

export const useAdminTickets = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.ticketsAdmin);

  const memoizedFetchTickets = useCallback(() => {
    return dispatch(fetchAdminTickets());
  }, [dispatch]);

  const memoizedFetchTicketDetail = useCallback((ticketId: string) => {
    return dispatch(fetchAdminTicketDetail(ticketId));
  }, [dispatch]);

  const memoizedFetchTicketFileUrl = useCallback((ticketId: string) => {
    return dispatch(fetchAdminTicketFileUrl(ticketId));
  }, [dispatch]);

  return {
    ...state,
    fetchTickets: memoizedFetchTickets,
    fetchTicketDetail: memoizedFetchTicketDetail,
    fetchTicketFileUrl: memoizedFetchTicketFileUrl,
    setStatusFilter: (status: string) => dispatch(setStatusFilter(status)),
    setSearchTerm: (search: string) => dispatch(setSearchTerm(search)),
    setCurrentPage: (page: number) => dispatch(setCurrentPage(page)),
    clearCurrentTicket: () => dispatch(clearCurrentTicket()),
    clearError: () => dispatch(clearError()),
    resetFilters: () => dispatch(resetFilters()),
    resetPage: () => dispatch(resetPage()), 
  };
};