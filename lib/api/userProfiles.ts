import { apiFetch } from "../api-client";
import { getAccessToken } from "../auth-storage";

export type ProfileListItem = {
  id: string;
  name: string;
  type: string;
  verification_status?: string;
  has_api_key?: boolean;
  has_apikey?: boolean;
};

type BackendProfile = {
  id?: string;
  name?: string;
  profile_name?: string;
  type?: string;
  profile_type?: string;
  verification_status?: string;
  has_api_key?: boolean | number | string;
  has_apikey?: boolean | number | string;
  api_key_created?: boolean | number | string;
  api_key_exists?: boolean | number | string;
};

const mapType = (raw?: string) => (raw ?? "").toLowerCase();

const normalizeBoolean = (value: unknown): boolean | undefined => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true" || normalized === "1") return true;
    if (normalized === "false" || normalized === "0") return false;
  }
  return undefined;
};

const resolveHasApiKey = (...values: unknown[]): boolean | undefined => {
  for (const value of values) {
    const normalized = normalizeBoolean(value);
    if (typeof normalized === "boolean") return normalized;
  }
  return undefined;
};

const toListItem = (profile: BackendProfile): ProfileListItem | null => {
  const id = profile.id ?? "";
  if (!id) return null;
  const name = profile.name ?? profile.profile_name ?? "";
  const hasApiKey = resolveHasApiKey(
    profile.has_apikey,
    profile.has_api_key,
    profile.api_key_created,
    profile.api_key_exists,
  );
  return {
    id,
    name,
    type: mapType(profile.profile_type ?? profile.type),
    verification_status: profile.verification_status,
    has_api_key: hasApiKey,
    has_apikey: hasApiKey,
  };
};

export async function fetchUserProfiles(): Promise<ProfileListItem[]> {
  try {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Missing access token. Please log in again.");
    }

    const data = await apiFetch<BackendProfile[] | null>("/profiles/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!data || !Array.isArray(data)) return [];

    return data
      .map(toListItem)
      .filter((item): item is ProfileListItem => Boolean(item?.id));
  } catch (error) {
    // Gracefully handle expired/invalid tokens or other network issues.
    console.warn("fetchUserProfiles failed:", error);
    return [];
  }
}
