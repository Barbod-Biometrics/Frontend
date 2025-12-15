
import { apiFetch } from './api-client';

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


export const currencyUtils = {
  rialToToman: (rial: number) => Math.floor(rial / 10),
  tomanToRial: (toman: number) => toman * 10,
};


async function getProfileId(profileId?: string): Promise<string> {
 
  if (profileId) return profileId;
  
 
  if (typeof window !== 'undefined') {
    const savedId = localStorage.getItem('selected_profile_id');
    if (savedId) return savedId;
  }
  
 
  return "1";
}

export async function walletDeposit(
  amount: number, 
  description?: string,
  profileId?: string
): Promise<DepositResponse> {
  const finalProfileId = await getProfileId(profileId);
  return apiFetch<DepositResponse>(`/profiles/${finalProfileId}/wallet/deposit`, {
    method: 'POST',
    body: JSON.stringify({ 
      amount: currencyUtils.tomanToRial(amount), 
      description: description || 'واریز' 
    })
  });
}

export async function getWalletSummary(profileId?: string): Promise<SummaryResponse> {
  const finalProfileId = await getProfileId(profileId);
  const response = await apiFetch<SummaryResponse>(`/profiles/${finalProfileId}/wallet/summary`);
  if (!response.success) {
    throw new Error('Failed to get wallet summary');
  }
  return response;
}

export async function getWalletTransactions(
  page = 1, 
  pageSize = 10,
  profileId?: string
): Promise<TransactionsResponse> {
  const finalProfileId = await getProfileId(profileId);
  const params = new URLSearchParams({ 
    page: page.toString(), 
    page_size: pageSize.toString() 
  });
  const response = await apiFetch<TransactionsResponse>(
    `/profiles/${finalProfileId}/wallet/transactions?${params}`
  );
  if (!response.success) {
    throw new Error('Failed to get transactions');
  }
  return response;
}


export function mapTransaction(tx: ApiTransaction) {
  return {
    id: tx.id,
    type:'deposit' as const,
    amount: currencyUtils.rialToToman(tx.amount),
    date: tx.date.split('T')[0],
    description: tx.description,
    status: tx.status.toLowerCase() as 'completed' | 'pending' | 'failed'
  };
}


export async function walletDepositLegacy(amount: number, description?: string): Promise<DepositResponse> {
  return walletDeposit(amount, description, "1");
}

export async function getWalletSummaryLegacy(): Promise<SummaryResponse> {
  return getWalletSummary("1");
}

export async function getWalletTransactionsLegacy(page = 1, pageSize = 10): Promise<TransactionsResponse> {
  return getWalletTransactions(page, pageSize, "1");
}