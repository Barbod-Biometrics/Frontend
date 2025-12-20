import { clearAuth, getAccessToken, getRefreshToken, saveAuth } from "./auth-storage";
import { emitAuthEvent } from "./auth-events";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.barbodbiometrics.ir/api/v1";
const AUTH_REFRESH_PATH =
  process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH ?? "/auth/refresh";

export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

const extractErrorMessage = (payload: unknown): string | undefined => {
  if (typeof payload === "string") {
    return payload;
  }

  if (payload && typeof payload === "object") {
    const values = Object.values(payload as Record<string, unknown>);
    const firstString = values.find((value) => typeof value === "string");

    if (typeof firstString === "string") {
      return firstString;
    }
  }

  return undefined;
};

type RefreshTokenResponse = {
  access_token: string;
  refresh_token?: string;
  phone_number?: string;
  is_admin?: boolean;
};

type RefreshResult =
  | { ok: true }
  | { ok: false; status?: number; networkError?: boolean };

let refreshInFlight: Promise<RefreshResult> | null = null;

const refreshAccessToken = async (): Promise<RefreshResult> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return { ok: false, status: 0 };
  }

  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${AUTH_REFRESH_PATH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        return { ok: false, status: response.status };
      }

      const contentType = response.headers.get("content-type");
      let payload: unknown = null;

      try {
        if (contentType?.includes("application/json")) {
          payload = await response.json();
        } else {
          payload = await response.text();
        }
      } catch {
        return { ok: false, status: response.status };
      }

      if (!payload || typeof payload !== "object") {
        return { ok: false, status: response.status };
      }

      const tokens = payload as RefreshTokenResponse;
      if (!tokens.access_token) {
        return { ok: false, status: response.status };
      }

      saveAuth(tokens, { preserveExisting: true });
      return { ok: true };
    } catch {
      return { ok: false, networkError: true };
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
};

const buildHeaders = (
  options: RequestInit,
  token: string | null,
  isAuthEndpoint: boolean
) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(
      ([key, value]) => {
        headers[key] = value;
      }
    );
  }

  if (token && !isAuthEndpoint) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  allowRefresh = true
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const isAuthEndpoint = path.startsWith("/auth/");
  const token = getAccessToken();
  const headers = buildHeaders(options, token, isAuthEndpoint);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  let payload: unknown = null;

  try {
    if (contentType?.includes("application/json")) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }
  } catch {
    payload = null;
  }

  if (!response.ok) {
    if (response.status === 401 && allowRefresh && !isAuthEndpoint) {
      const refreshed = await refreshAccessToken();
      if (refreshed.ok) {
        return apiFetch<T>(path, options, false);
      }
      if (!refreshed.networkError) {
        clearAuth();
        emitAuthEvent("unauthorized");
      }
    }
    // Temporary logging for debugging auth requests
    console.log("[api] request failed", {
      path,
      status: response.status,
      payload,
    });
    const message =
      extractErrorMessage(payload) ||
      response.statusText ||
      `Request failed with status ${response.status}`;

    const error: ApiError = new Error(message);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  // Temporary logging for successful requests (helps confirm 2xx/JSON payloads)
  console.log("[api] request success", {
    path,
    status: response.status,
    payload,
  });

  return payload as T;
}
