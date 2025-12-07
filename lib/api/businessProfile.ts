import {
  AccountKind,
  AccountTypePayload,
  BusinessInfoPayload,
  BusinessProfile,
  LocationPayload,
  PersonalInfoPayload,
} from "../../types/businessProfile";
import { apiFetch } from "../api-client";
import { getAccessToken } from "../auth-storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.barbodbiometrics.ir/api/v1";
const USE_MOCK_API =
  process.env.NEXT_PUBLIC_BUSINESS_AUTH_USE_MOCK === "true" ||
  API_BASE_URL.includes("api.example.com");

const mockDelay = async <T>(result: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(result), ms));

const createMockProfile = (overrides?: Partial<BusinessProfile>): BusinessProfile => ({
  id: overrides?.id ?? `mock-profile-${Date.now()}`,
  name: overrides?.name ?? "حساب نمایشی",
  type: overrides?.type ?? "legal",
  verificationStatus: overrides?.verificationStatus,
  isActive: overrides?.isActive ?? true,
  createdAt: overrides?.createdAt ?? new Date().toISOString(),
  balance: overrides?.balance ?? 0,
  personalInfo: overrides?.personalInfo,
  businessInfo: overrides?.businessInfo,
  locationInfo: overrides?.locationInfo,
});

type BackendProfile = {
  id: string;
  name?: string;
  profile_name?: string;
  type?: string;
  profile_type?: string;
  verification_status?: string;
  is_active?: boolean;
  created_at?: string;
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
    signatories?: Array<{
      dob?: string;
      documents?: {
        id_book_page_one?: string;
        national_card_back?: string;
        national_card_front?: string;
      };
      first_name?: string;
      last_name?: string;
      mobile_number?: string;
      national_id?: string;
      signatory_id?: number;
    }>;
  };
  person_details?: {
    business_info?: {
      brand_name?: string;
      field_of_work?: string;
      website_url?: string;
      legal_name?: string;
    };
    business_national_id?: string;
    documents?: {
      id_book_page_one?: string;
      national_card_back?: string;
      national_card_front?: string;
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
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token. Please log in again.");
  }
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(init?.headers ?? {}),
  };

  const payload = await apiFetch<T | null>(path, { ...init, headers });
  return (payload === null ? undefined : payload) as T;
}

const normalizeDate = (value?: string) => (value ? value.split("T")[0] : "");

const normalizeType = (rawType: string | undefined): AccountKind | undefined => {
  const value = (rawType ?? "").toLowerCase();
  if (["legal", "business", "hoghooghi", "حقوقی"].includes(value)) return "legal";
  if (["real", "personal", "haghighi", "حقیقی"].includes(value)) return "real";
  return undefined;
};

const toUiProfile = (data: BackendProfile): BusinessProfile => {
  const profileType = data.profile_type ?? data.type;
  const normalizedType =
    normalizeType(profileType) ?? (data.person_details ? "real" : "legal");
  const isLegal = normalizedType === "legal";

  const rep = data.business_details;
  const person = data.person_details;

  const businessInfoSource = isLegal ? rep?.business_info : person?.business_info;
  const locationSource = isLegal ? rep?.location_info : person?.location_info;

  const businessInfo = businessInfoSource
    ? {
        brandName: businessInfoSource.brand_name ?? "",
        legalName: isLegal ? businessInfoSource.legal_name ?? "" : undefined,
        fieldOfWork: businessInfoSource.field_of_work ?? "",
        websiteUrl: businessInfoSource.website_url ?? "",
        businessNationalId: isLegal
          ? data.business_details?.business_national_id ?? ""
          : person?.business_national_id ?? "",
      }
    : undefined;

  const locationInfo = locationSource
    ? {
        address: locationSource.address ?? "",
        city: locationSource.city ?? "",
        fixedPhone: locationSource.fixed_phone ?? "",
        plateNumber: locationSource.plate_number ?? "",
        postalCode: locationSource.postal_code ?? "",
        province: locationSource.province ?? "",
        unit: locationSource.unit ?? "",
      }
    : undefined;

  return {
    id: data.id,
    name: data.name ?? data.profile_name ?? "",
    type: normalizedType,
    verificationStatus: data.verification_status,
    isActive: data.is_active,
    createdAt: data.created_at,
    balance: data.balance,
    personalInfo: isLegal
      ? rep
        ? {
            firstName: rep.rep_first_name ?? "",
            lastName: rep.rep_last_name ?? "",
            nationalId: rep.rep_national_id ?? "",
            birthDate: normalizeDate(rep.rep_dob),
            phone: rep.rep_mobile_number ?? "",
          }
        : undefined
      : person
        ? {
            firstName: person.first_name ?? "",
            lastName: person.last_name ?? "",
            nationalId: person.national_id ?? "",
            birthDate: normalizeDate(person.dob),
            phone: person.mobile_number ?? "",
          }
        : undefined,
    businessInfo:
      businessInfo ||
      (isLegal && rep?.business_national_id
        ? {
            brandName: "",
            legalName: "",
            fieldOfWork: "",
            websiteUrl: "",
            businessNationalId: rep?.business_national_id ?? "",
          }
        : undefined),
    locationInfo,
  };
};

const toBackendPersonal = (accountType: AccountKind, payload: PersonalInfoPayload) => {
  if (accountType === "legal") {
    return {
      business_details: {
        rep_first_name: payload.firstName,
        rep_last_name: payload.lastName,
        rep_national_id: payload.nationalId,
        rep_dob: normalizeDate(payload.birthDate),
        rep_mobile_number: payload.phone,
      },
    };
  }

  return {
    person_details: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      national_id: payload.nationalId,
      dob: normalizeDate(payload.birthDate),
      mobile_number: payload.phone,
    },
  };
};

const toBackendBusinessInfo = (
  accountType: AccountKind,
  payload: BusinessInfoPayload,
  repInfo?: PersonalInfoPayload,
) => {
  const info = {
    brand_name: payload.brandName,
    field_of_work: payload.fieldOfWork,
    website_url: payload.websiteUrl,
  };
  const businessNationalId = payload.businessNationalId?.trim();

  if (accountType === "legal") {
    if (!repInfo) {
      throw new Error("Representative info missing. Please complete personal info first.");
    }

    return {
      business_details: {
        rep_first_name: repInfo.firstName,
        rep_last_name: repInfo.lastName,
        rep_national_id: repInfo.nationalId,
        rep_dob: normalizeDate(repInfo.birthDate),
        rep_mobile_number: repInfo.phone,
        ...(businessNationalId ? { business_national_id: businessNationalId } : {}),
        business_info: info,
      },
    };
  }

  if (!repInfo) {
    throw new Error("Personal info missing. Please complete personal info first.");
  }

  return {
    person_details: {
      first_name: repInfo.firstName,
      last_name: repInfo.lastName,
      national_id: repInfo.nationalId,
      dob: normalizeDate(repInfo.birthDate),
      mobile_number: repInfo.phone,
      business_info: info,
      ...(businessNationalId ? { business_national_id: businessNationalId } : {}),
    },
  };
};
const toBackendLocation = (
  accountType: AccountKind,
  payload: LocationPayload,
  personal?: PersonalInfoPayload,
) => {
  if (accountType !== "legal" && !personal) {
    throw new Error("Personal info missing. Please complete personal info first.");
  }

  const location = {
    address: payload.address,
    city: payload.city,
    fixed_phone: payload.fixedPhone,
    plate_number: payload.plateNumber,
    postal_code: payload.postalCode,
    province: payload.province,
    unit: payload.unit,
  };

  if (accountType === "legal") {
    return {
      business_details: {
        location_info: location,
      },
    };
  }

  return {
    person_details: {
      first_name: personal!.firstName,
      last_name: personal!.lastName,
      national_id: personal!.nationalId,
      dob: normalizeDate(personal!.birthDate),
      mobile_number: personal!.phone,
      location_info: location,
    },
  };
};

const buildSubmitPayload = (profile: BusinessProfile) => {
  const isLegal = profile.type === "legal";
  const personal = profile.personalInfo;
  const business = profile.businessInfo;
  const location = profile.locationInfo;

  const commonBusinessInfo = business
    ? {
        brand_name: business.brandName,
        field_of_work: business.fieldOfWork,
        website_url: business.websiteUrl,
      }
    : undefined;

  if (isLegal) {
    return {
      name: profile.name,
      type: "business",
      business_details: {
        rep_first_name: personal?.firstName ?? "",
        rep_last_name: personal?.lastName ?? "",
        rep_national_id: personal?.nationalId ?? "",
        rep_dob: normalizeDate(personal?.birthDate),
        rep_mobile_number: personal?.phone ?? "",
        ...(business?.businessNationalId
          ? { business_national_id: business.businessNationalId }
          : {}),
        ...(commonBusinessInfo ? { business_info: commonBusinessInfo } : {}),
        ...(location
          ? {
              location_info: {
                address: location.address,
                postal_code: location.postalCode,
                city: location.city,
                fixed_phone: location.fixedPhone,
                plate_number: location.plateNumber,
                province: location.province,
                unit: location.unit,
              },
            }
          : {}),
      },
    };
  }

  return {
    name: profile.name,
    type: "personal",
    person_details: {
      first_name: personal?.firstName ?? "",
      last_name: personal?.lastName ?? "",
      national_id: personal?.nationalId ?? "",
      dob: normalizeDate(personal?.birthDate),
      mobile_number: personal?.phone ?? "",
      ...(commonBusinessInfo ? { business_info: commonBusinessInfo } : {}),
      ...(location
        ? {
            location_info: {
              address: location.address,
              city: location.city,
              fixed_phone: location.fixedPhone,
              plate_number: location.plateNumber,
              postal_code: location.postalCode,
              province: location.province,
              unit: location.unit,
            },
          }
        : {}),
    },
  };
};

export async function fetchBusinessProfile(profileId: string): Promise<BusinessProfile> {
  if (USE_MOCK_API) {
    return mockDelay(
      createMockProfile({
        id: profileId,
        name: "پروفایل آزمایشی",
        type: "legal",
        personalInfo: undefined,
        businessInfo: undefined,
        locationInfo: undefined,
      }),
    );
  }

  const data = await request<BackendProfile>(`/profiles/${profileId}`);
  return toUiProfile(data);
}

export async function createBusinessProfile(payload: AccountTypePayload): Promise<BusinessProfile> {
  if (USE_MOCK_API) {
    return mockDelay(
      createMockProfile({
        id: `mock-${payload.type}-${Date.now()}`,
        name: payload.name,
        type: payload.type,
      }),
    );
  }

  // Backend expects specific string literals for profile_type
  const backendProfileType = payload.type === "real" ? "personal" : "business";

  const data = await request<BackendProfile>("/profiles/", {
    method: "POST",
    body: JSON.stringify({
      profile_name: payload.name,
      profile_type: backendProfileType,
    }),
  });
  return toUiProfile(data);
}

export async function savePersonalInfo(
  profileId: string,
  accountType: AccountKind,
  payload: PersonalInfoPayload,
): Promise<PersonalInfoPayload> {
  if (USE_MOCK_API) {
    return mockDelay(payload);
  }

  await request(`/profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify(toBackendPersonal(accountType, payload)),
  });
  return payload;
}

export async function saveBusinessInfo(
  profileId: string,
  accountType: AccountKind,
  payload: BusinessInfoPayload,
  repInfo?: PersonalInfoPayload,
): Promise<BusinessInfoPayload> {
  if (USE_MOCK_API) {
    return mockDelay(payload);
  }

  await request(`/profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify(toBackendBusinessInfo(accountType, payload, repInfo)),
  });
  return payload;
}

export async function saveLocationInfo(
  profileId: string,
  accountType: AccountKind,
  payload: LocationPayload,
  personal?: PersonalInfoPayload,
): Promise<LocationPayload> {
  if (USE_MOCK_API) {
    return mockDelay(payload);
  }

  await request(`/profiles/${profileId}`, {
    method: "PATCH",
    body: JSON.stringify(toBackendLocation(accountType, payload, personal)),
  });
  return payload;
}

export async function submitBusinessProfile(profile: BusinessProfile): Promise<void> {
  if (USE_MOCK_API) {
    return mockDelay(undefined);
  }

  if (!profile?.id) {
    throw new Error("Profile not created yet");
  }

  await request<void>(`/profiles/${profile.id}/submit`, {
    method: "POST",
    body: JSON.stringify(buildSubmitPayload(profile)),
  });
}

