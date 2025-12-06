import { apiFetch } from './api-client';

const PROFILE_ID = "1";

// Types
interface DepositResponse {
  data: { 
    message: string; 
    new_balance: number; 
    transaction_id: string 
  };
  success: boolean;
}

interface SummaryResponse {
  data: { 
    balance: number; 
    last_updated: string; 
    total_deposits: number; 
    total_withdrawals: number; 
    transaction_count: number 
  };
  success: boolean;
}

interface ApiTransaction { 
  id: string; 
  type: string; 
  amount: number; 
  date: string; 
  description: string; 
  status: string; 
}

interface TransactionsResponse {
  data: { 
    page: number; 
    page_size: number; 
    total_count: number; 
    total_pages: number; 
    transactions: ApiTransaction[] 
  };
  success: boolean;
}

// Currency utilities
export const currencyUtils = {
  rialToToman: (rial: number) => Math.floor(rial / 10),
  tomanToRial: (toman: number) => toman * 10,
};

// API Functions
export async function walletDeposit(amount: number, description?: string): Promise<DepositResponse> {
  return apiFetch<DepositResponse>(`/profiles/${PROFILE_ID}/wallet/deposit`, {
    method: 'POST',
    body: JSON.stringify({ 
      amount: currencyUtils.tomanToRial(amount), 
      description: description || 'Deposit' 
    })
  });
}

export async function getWalletSummary(): Promise<SummaryResponse> {
  const response = await apiFetch<SummaryResponse>(`/profiles/${PROFILE_ID}/wallet/summary`);
  if (!response.success) {
    throw new Error('Failed to get wallet summary');
  }
  return response;
}

export async function getWalletTransactions(page = 1, pageSize = 10): Promise<TransactionsResponse> {
  const params = new URLSearchParams({ 
    page: page.toString(), 
    page_size: pageSize.toString() 
  });
  const response = await apiFetch<TransactionsResponse>(`/profiles/${PROFILE_ID}/wallet/transactions?${params}`);
  if (!response.success) {
    throw new Error('Failed to get transactions');
  }
  return response;
}

// Map API transaction to local format
export function mapTransaction(tx: ApiTransaction) {
  return {
    id: tx.id,
    type: (tx.type.toLowerCase() === 'deposit' ? 'deposit' : 'withdrawal') as 'deposit' | 'withdrawal',
    amount: currencyUtils.rialToToman(tx.amount),
    date: tx.date.split('T')[0],
    description: tx.description,
    status: tx.status.toLowerCase() as 'completed' | 'pending' | 'failed'
  };
}