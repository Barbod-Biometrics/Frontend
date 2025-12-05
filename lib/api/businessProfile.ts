import {
  AccountKind,
  AccountTypePayload,
  BusinessInfoPayload,
  BusinessProfile,
  LocationPayload,
  PersonalInfoPayload,
} from "../../types/businessProfile";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.example.com";
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
  name: string;
  type: string;
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
  };
  person_details?: {
    business_info?: {
      brand_name?: string;
      field_of_work?: string;
      website_url?: string;
      legal_name?: string;
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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request to ${path} failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

const normalizeType = (rawType: string | undefined): AccountKind => {
  const value = (rawType ?? "").toLowerCase();
  if (["legal", "hoghooghi", "حقوقی"].includes(value)) return "legal";
  if (["real", "haghighi", "حقیقی"].includes(value)) return "real";
  return "legal";
};

const toUiProfile = (data: BackendProfile): BusinessProfile => {
  const normalizedType = normalizeType(data.type);
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
        businessNationalId: isLegal ? data.business_details?.business_national_id ?? "" : undefined,
      }
    : undefined;

  return {
    id: data.id,
    name: data.name,
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
            birthDate: rep.rep_dob ?? "",
            phone: rep.rep_mobile_number ?? "",
          }
        : undefined
      : person
        ? {
            firstName: person.first_name ?? "",
            lastName: person.last_name ?? "",
            nationalId: person.national_id ?? "",
            birthDate: person.dob ?? "",
            phone: person.mobile_number ?? "",
          }
        : undefined,
    businessInfo:
      businessInfo ||
      (isLegal && data.business_details?.business_national_id
        ? {
            brandName: "",
            legalName: "",
            fieldOfWork: "",
            websiteUrl: "",
            businessNationalId: data.business_details?.business_national_id ?? "",
          }
        : undefined),
    locationInfo:
      isLegal && locationSource
        ? {
            address: locationSource.address ?? "",
            city: locationSource.city ?? "",
            fixedPhone: locationSource.fixed_phone ?? "",
            plateNumber: locationSource.plate_number ?? "",
            postalCode: locationSource.postal_code ?? "",
            province: locationSource.province ?? "",
            unit: locationSource.unit ?? "",
          }
        : undefined,
  };
};

const toBackendPersonal = (accountType: AccountKind, payload: PersonalInfoPayload) => {
  if (accountType === "legal") {
    return {
      business_details: {
        rep_first_name: payload.firstName,
        rep_last_name: payload.lastName,
        rep_national_id: payload.nationalId,
        rep_dob: payload.birthDate,
        rep_mobile_number: payload.phone,
      },
    };
  }

  return {
    person_details: {
      first_name: payload.firstName,
      last_name: payload.lastName,
      national_id: payload.nationalId,
      dob: payload.birthDate,
      mobile_number: payload.phone,
    },
  };
};

const toBackendBusinessInfo = (accountType: AccountKind, payload: BusinessInfoPayload) => {
  const info = {
    brand_name: payload.brandName,
    legal_name: accountType === "legal" ? payload.legalName : undefined,
    field_of_work: payload.fieldOfWork,
    website_url: payload.websiteUrl,
  };

  if (accountType === "legal") {
    return {
      business_details: {
        business_info: info,
        business_national_id: payload.businessNationalId,
      },
    };
  }

  return {
    person_details: {
      business_info: info,
    },
  };
};

const toBackendLocation = (accountType: AccountKind, payload: LocationPayload) => {
  if (accountType !== "legal") {
    throw new Error("Location info is only applicable to legal (حقوقی) accounts.");
  }

  return {
    business_details: {
      location_info: {
        address: payload.address,
        city: payload.city,
        fixed_phone: payload.fixedPhone,
        plate_number: payload.plateNumber,
        postal_code: payload.postalCode,
        province: payload.province,
        unit: payload.unit,
      },
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

  const data = await request<BackendProfile>("/profiles", {
    method: "POST",
    body: JSON.stringify(payload),
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
    method: "PUT",
    body: JSON.stringify(toBackendPersonal(accountType, payload)),
  });
  return payload;
}

export async function saveBusinessInfo(
  profileId: string,
  accountType: AccountKind,
  payload: BusinessInfoPayload,
): Promise<BusinessInfoPayload> {
  if (USE_MOCK_API) {
    return mockDelay(payload);
  }

  await request(`/profiles/${profileId}`, {
    method: "PUT",
    body: JSON.stringify(toBackendBusinessInfo(accountType, payload)),
  });
  return payload;
}

export async function saveLocationInfo(
  profileId: string,
  accountType: AccountKind,
  payload: LocationPayload,
): Promise<LocationPayload> {
  if (USE_MOCK_API) {
    return mockDelay(payload);
  }

  await request(`/profiles/${profileId}`, {
    method: "PUT",
    body: JSON.stringify(toBackendLocation(accountType, payload)),
  });
  return payload;
}

export async function submitBusinessProfile(profileId: string): Promise<void> {
  if (USE_MOCK_API) {
    return mockDelay(undefined);
  }

  await request<void>(`/profiles/${profileId}/submit`, { method: "POST" });
}
