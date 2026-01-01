
export interface SupportTicket {
  id: string;
  service: string;
  title: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
}
export interface TicketsResponse {
  success: boolean;
  data: {
    tickets: SupportTicket[];
    total: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  };
}