import { apiFetch } from "./api-client";

export type ServiceBreakdownRaw = {
  service_name: string;
  total_cost: number;
  total_count: number;
  [key: string]: unknown;
};

export interface BillingApiRawResponse {
  service_breakdown?: ServiceBreakdownRaw[];
  total_spend?: number;
  [key: string]: unknown;
}

export interface BillingItem {
  service: string;
  quantity: number;
  sum: number;
}

export interface BillingSummary {
  items: BillingItem[];
  total_spend: number;
  raw?: BillingApiRawResponse | unknown;
}

async function resolveProfileId(profileId?: string | number): Promise<string> {
  if (profileId !== undefined && profileId !== null) return String(profileId);

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("selected_profile_id");
    if (saved) return saved;
  }

  throw new Error("profile_id is required");
}

export async function getBillingSummary(
  profileId?: string | number,
  fromDate?: string,
  toDate?: string
): Promise<BillingSummary> {
  const finalProfileId = await resolveProfileId(profileId);

  const params = new URLSearchParams({ profile_id: String(finalProfileId) });
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);

  // Use a generic type because API response may be wrapped or unwrapped
  const payload = await apiFetch<any>(`/billing/summary?${params.toString()}`);

  const data: BillingApiRawResponse = payload?.data ?? payload ?? {};

  const breakdown = data.service_breakdown ?? [];
  const totalSpend = (data.total_spend ?? 0) as number;

  const items: BillingItem[] = (breakdown || []).map((b: any) => ({
    service: (b.service_name as string) ?? (b.service as string) ?? "",
    quantity:
      typeof b.total_count === "number"
        ? b.total_count
        : Number(b.total_count ?? b.count ?? 0),
    sum:
      typeof b.total_cost === "number"
        ? b.total_cost
        : Number(b.total_cost ?? b.cost ?? 0),
  }));

  return {
    items,
    total_spend: Number(totalSpend),
    raw: data,
  };
}
