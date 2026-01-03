import { apiFetch, type ApiError } from "./api-client";
import type { TicketSummary, TicketDetail, TicketFileUrl } from "..//store//ticketsAdminSlice";

export class TicketsAdminApi {
  async fetchTickets(): Promise<TicketSummary[]> {
    try {
      const response = await apiFetch<TicketSummary[]>('/admin/tickets');
      return response;
    } catch (error) {
      console.error('Failed to fetch admin tickets:', error);
      throw error as ApiError;
    }
  }

  async fetchTicketDetail(ticketId: string): Promise<TicketDetail> {
    try {
      return await apiFetch<TicketDetail>(`/admin/tickets/${ticketId}`);
    } catch (error) {
      console.error('Failed to fetch ticket detail:', error);
      throw error as ApiError;
    }
  }

  async fetchTicketFileUrl(ticketId: string): Promise<TicketFileUrl> {
    try {
      return await apiFetch<TicketFileUrl>(`/admin/tickets/${ticketId}/file`);
    } catch (error) {
      console.error('Failed to fetch ticket file URL:', error);
      throw error as ApiError;
    }
  }
}

export const ticketsAdminApi = new TicketsAdminApi();