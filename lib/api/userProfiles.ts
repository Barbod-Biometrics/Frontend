import { apiFetch } from "../api-client";
import { getAccessToken } from "../auth-storage";

export type ProfileListItem = {
  id: string;
  name: string;
  type: string;
  verification_status?: string;
  has_api_key?: boolean;
};

type BackendProfile = {
  id?: string;
  name?: string;
  profile_name?: string;
  type?: string;
  profile_type?: string;
  verification_status?: string;
  has_api_key?: boolean;
  api_key_created?: boolean;
  api_key_exists?: boolean;
};

const mapType = (raw?: string) => (raw ?? "").toLowerCase();

const toListItem = (profile: BackendProfile): ProfileListItem | null => {
  const id = profile.id ?? "";
  if (!id) return null;
  const name = profile.name ?? profile.profile_name ?? "";
  const hasApiKey =
    typeof profile.has_api_key === "boolean"
      ? profile.has_api_key
      : typeof profile.api_key_created === "boolean"
        ? profile.api_key_created
        : typeof profile.api_key_exists === "boolean"
          ? profile.api_key_exists
          : undefined;
  return {
    id,
    name,
    type: mapType(profile.profile_type ?? profile.type),
    verification_status: profile.verification_status,
    has_api_key: hasApiKey,
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
