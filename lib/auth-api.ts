import { apiFetch } from "./api-client";

export interface VerifyOtpResponse {
  access_token: string;
  refresh_token?: string;
  phone_number?: string;
  is_admin?: boolean;
}

export function requestOtp(phoneNumber: string) {
  return apiFetch<void>("/auth/request-otp", {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber }),
  });
}

export function verifyOtp(phoneNumber: string, otp: string) {
  return apiFetch<VerifyOtpResponse>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify({ phone_number: phoneNumber, otp }),
  });
}
