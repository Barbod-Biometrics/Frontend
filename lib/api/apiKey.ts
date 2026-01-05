import { apiFetch } from "../api-client";
import { getAccessToken } from "../auth-storage";

type ApiKeyResponse = {
  api_key?: string;
  profile_id?: number | string;
};

export async function generateApiKey(profileId: string): Promise<{
  apiKey: string;
  profileId: string;
}> {
  if (!profileId) {
    throw new Error("Missing profile id.");
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token. Please log in again.");
  }

  const payload = await apiFetch<ApiKeyResponse>(
    `/api-key/${encodeURIComponent(profileId)}/generate`,
    { method: "POST" },
  );

  if (!payload?.api_key) {
    throw new Error("Failed to generate API key.");
  }

  return {
    apiKey: payload.api_key,
    profileId: String(payload.profile_id ?? profileId),
  };
}

export async function regenerateApiKey(profileId: string): Promise<{
  apiKey: string;
  profileId: string;
}> {
  if (!profileId) {
    throw new Error("Missing profile id.");
  }

  const token = getAccessToken();
  if (!token) {
    throw new Error("Missing access token. Please log in again.");
  }

  const payload = await apiFetch<ApiKeyResponse>(
    `/api-key/${encodeURIComponent(profileId)}/regenerate`,
    { method: "POST" },
  );

  if (!payload?.api_key) {
    throw new Error("Failed to regenerate API key.");
  }

  return {
    apiKey: payload.api_key,
    profileId: String(payload.profile_id ?? profileId),
  };
}
