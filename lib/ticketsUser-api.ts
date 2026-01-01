
import { apiFetch } from './api-client';

export interface SupportTicket {
  id: string;
  service: string;
  title: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
  description?: string;
  attachment?: string;
}

export interface TicketsResponse {
  success: boolean;
  data: SupportTicket[];
}

export interface CreateTicketResponse {
  success: boolean;
  data: SupportTicket;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface Message {
  id: string;
  ticketId: string;
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
}

export interface CloseTicketResponse {
  ticketId: string;
  status: 'closed';
}

export interface UploadUrlResponse {
  object_key: string;
  upload_url: string;
}


export async function fetchTicketsAPI(params: PaginationParams = {}): Promise<TicketsResponse> {
  try {
    const response = await apiFetch<TicketsResponse>('/support/tickets');
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data,
      };
    }
    
    return response;
    
  } catch (error: any) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}


export async function getUploadUrlAPI(fileExtension: string): Promise<UploadUrlResponse> {
  const url = `/support/tickets/upload-url?file_extension=${encodeURIComponent(fileExtension)}`;
  return await apiFetch<UploadUrlResponse>(url);
}


export async function uploadFileToS3(uploadUrl: string, file: File): Promise<void> {
  console.log('Uploading to S3 URL:', uploadUrl);
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    console.log('S3 upload response:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`خطا در آپلود فایل: ${response.status} ${response.statusText}`);
    }
  } catch (error: any) {
    console.error('S3 upload catch error:', error);
    throw error;
  }
}


export async function createTicketAPI(ticketData: {
  service: string;
  title: string;
  description: string;
  attachment?: string;
}): Promise<CreateTicketResponse> {
  try {
    return await apiFetch<CreateTicketResponse>('/support/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  } catch (error: any) {
    console.error('API create ticket error:', error);
    throw error;
  }
}


export async function fetchTicketMessages(ticketId: string): Promise<Message[]> {
  try {
    return await apiFetch<Message[]>(`/tickets/${ticketId}/messages`);
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    
   
    if (error.status === 404 || error.status === 403) {
      return [];
    }
    
    throw error;
  }
}


export async function sendMessageAPI(ticketId: string, message: string): Promise<Message> {
  try {
    return await apiFetch<Message>(`/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    throw error;
  }
}


export async function closeTicketAPI(ticketId: string): Promise<CloseTicketResponse> {
  try {
    return await apiFetch<CloseTicketResponse>(`/tickets/${ticketId}/close`, {
      method: 'POST',
    });
  } catch (error: any) {
    console.error('Error closing ticket:', error);
    throw error;
  }
}