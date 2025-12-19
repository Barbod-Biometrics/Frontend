import { apiFetch } from "../api-client";
import { getAccessToken } from "../auth-storage";
import type { BusinessProfile, AccountKind } from "../../types/businessProfile";

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

type AdminProfileDetails = {
  balance?: number;
  business_details?: {
    business_info?: {
      brand_name?: string;
      field_of_work?: string;
      website_url?: string;
      legal_name?: string;
    };
    business_national_id?: string;
    location_info?: {
      address?: string;
      city?: string;
      fixed_phone?: string;
      plate_number?: string;
      postal_code?: string;
      province?: string;
      unit?: string;
    };
    rep_dob?: string;
    rep_first_name?: string;
    rep_last_name?: string;
    rep_mobile_number?: string;
    rep_national_id?: string;
  };
  created_at?: string;
  id: number;
  is_active?: boolean;
  person_details?: {
    business_info?: {
      brand_name?: string;
      field_of_work?: string;
      website_url?: string;
    };
    dob?: string;
    first_name?: string;
    last_name?: string;
    location_info?: {
      address?: string;
      city?: string;
      fixed_phone?: string;
      plate_number?: string;
      postal_code?: string;
      province?: string;
      unit?: string;
    };
    mobile_number?: string;
    national_id?: string;
  };
  profile_name?: string;
  profile_type?: string;
  user_id?: number;
  verification_status?: string;
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

const normalizeType = (raw?: string): AccountKind => {
  const val = (raw ?? "").toLowerCase();
  if (val === "business" || val === "legal") return "legal";
  if (val === "personal" || val === "real") return "real";
  return "real";
};

const normalizeDate = (value?: string) => (value ? value.split("T")[0] : "");

export async function fetchAdminProfileDetails(profileId: string | number): Promise<BusinessProfile | null> {
  const token = getAccessToken();
  if (!token) {
    console.warn("fetchAdminProfileDetails: Missing access token.");
    return null;
  }

  try {
    const data = await apiFetch<AdminProfileDetails>(`/admin/profiles/${profileId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data) return null;

    const type = normalizeType(data.profile_type);
    const isLegal = type === "legal";

    const businessInfoSource = isLegal ? data.business_details?.business_info : data.person_details?.business_info;
    const locationSource = isLegal ? data.business_details?.location_info : data.person_details?.location_info;

    const businessInfo = businessInfoSource
      ? {
          brandName: businessInfoSource.brand_name ?? "",
          legalName: isLegal ? businessInfoSource.legal_name ?? "" : undefined,
          fieldOfWork: businessInfoSource.field_of_work ?? "",
          websiteUrl: businessInfoSource.website_url ?? "",
          businessNationalId: isLegal ? data.business_details?.business_national_id ?? "" : undefined,
        }
      : undefined;

    const locationInfo = locationSource
      ? {
          address: locationSource.address ?? "",
          province: locationSource.province ?? "",
          city: locationSource.city ?? "",
          fixedPhone: locationSource.fixed_phone ?? "",
          postalCode: locationSource.postal_code ?? "",
          plateNumber: locationSource.plate_number ?? "",
          unit: locationSource.unit ?? "",
        }
      : undefined;

    const personalInfo = isLegal
      ? data.business_details
        ? {
            firstName: data.business_details.rep_first_name ?? "",
            lastName: data.business_details.rep_last_name ?? "",
            nationalId: data.business_details.rep_national_id ?? "",
            birthDate: normalizeDate(data.business_details.rep_dob),
            phone: data.business_details.rep_mobile_number ?? "",
          }
        : undefined
      : data.person_details
        ? {
            firstName: data.person_details.first_name ?? "",
            lastName: data.person_details.last_name ?? "",
            nationalId: data.person_details.national_id ?? "",
            birthDate: normalizeDate(data.person_details.dob),
            phone: data.person_details.mobile_number ?? "",
          }
        : undefined;

    return {
      id: data.id.toString(),
      name: data.profile_name ?? "",
      type,
      verificationStatus: data.verification_status,
      isActive: data.is_active,
      createdAt: data.created_at,
      balance: data.balance,
      personalInfo,
      businessInfo,
      locationInfo,
    };
  } catch (error) {
    console.warn("fetchAdminProfileDetails failed:", error);
    return null;
  }
}

export async function approveAdminProfile(
  profileId: string | number,
  note = "",
): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token. Please log in again.");
  }

  await apiFetch<void>(`/admin/profiles/${profileId}/approve`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ note }),
  });
}

export async function rejectAdminProfile(
  profileId: string | number,
  reason = "",
): Promise<void> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token. Please log in again.");
  }

  await apiFetch<void>(`/admin/profiles/${profileId}/reject`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reason }),
  });
}
