
import { apiFetch } from './api-client';
import { getAccessToken } from './auth-storage';

export interface UserInfo {
  email: string;
  phone_number: string;
}

export interface UpdateUserInfo {
  email?: string;
  phone_number?: string;
}

export async function getUserInfo(): Promise<UserInfo> {
  const token = getAccessToken();
  
  return apiFetch<UserInfo>('/user/info', {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function updateUserInfo(data: UpdateUserInfo): Promise<UserInfo> {
  const token = getAccessToken();
  
  return apiFetch<UserInfo>('/user/update-info', {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
}