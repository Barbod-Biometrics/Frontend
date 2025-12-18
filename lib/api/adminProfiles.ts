import { apiFetch } from "../api-client";
import { getAccessToken } from "../auth-storage";

export type AdminProfileSummary = {
  created_at: string;
  id: number;
  is_active: boolean;
  mobile_number: string;
  national_id: string;
  owner_name: string;
  profile_name: string;
  profile_type: string;
  user_id: number;
  verification_status: string;
};

export type AdminProfilesResponse = {
  page: number;
  page_size: number;
  profiles: AdminProfileSummary[];
  total_count: number;
  total_pages: number;
};

export type AdminProfilesQuery = {
  page?: number;
  status?: "pending" | "verified" | "rejected" | "draft";
  profileType?: "business" | "personal";
  search?: string;
  sortBy?: "created_at" | "profile_name" | "verification_status" | "profile_type";
  sortOrder?: "asc" | "desc";
};

const DEFAULT_PAGE_SIZE = 5;

const emptyResponse = (page?: number): AdminProfilesResponse => ({
  page: page ?? 1,
  page_size: DEFAULT_PAGE_SIZE,
  profiles: [],
  total_count: 0,
  total_pages: 0,
});

export async function fetchAdminProfiles(
  filters: AdminProfilesQuery = {},
): Promise<AdminProfilesResponse> {
  const token = getAccessToken();
  if (!token) {
    console.warn("fetchAdminProfiles: Missing access token.");
    return emptyResponse(filters.page);
  }

  const params = new URLSearchParams();
  params.set("page_size", String(DEFAULT_PAGE_SIZE));

  if (filters.page !== undefined && filters.page !== null && filters.page !== "") {
    params.set("page", String(filters.page));
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.profileType) {
    params.set("profile_type", filters.profileType);
  }

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.sortBy) {
    params.set("sort_by", filters.sortBy);
  }

  if (filters.sortOrder) {
    params.set("sort_order", filters.sortOrder);
  }

  const queryString = params.toString();
  const path = `/admin/profiles${queryString ? `?${queryString}` : ""}`;

  try {
    const response = await apiFetch<AdminProfilesResponse>(path, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      page: response?.page ?? Number(filters.page ?? 1),
      page_size: response?.page_size ?? DEFAULT_PAGE_SIZE,
      profiles: response?.profiles ?? [],
      total_count: response?.total_count ?? 0,
      total_pages: response?.total_pages ?? 0,
    };
  } catch (error) {
    console.warn("fetchAdminProfiles failed:", error);
    return emptyResponse(filters.page);
  }
}
