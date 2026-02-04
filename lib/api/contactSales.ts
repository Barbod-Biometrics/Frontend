import { apiFetch } from "../api-client";

export type SubmitContactSalesRequest = {
  first_name: string;
  last_name: string;
  phone: string;
  business_name: string;
  description: string;
  email?: string;
  captcha_token?: string;
};

export type SubmitContactSalesResponse = {
  id: number;
  message: string;
};

export async function submitContactSales(
  payload: SubmitContactSalesRequest
): Promise<SubmitContactSalesResponse> {
  return apiFetch<SubmitContactSalesResponse>("/contact-sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
