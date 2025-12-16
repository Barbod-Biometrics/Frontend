const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.barbodbiometrics.ir/api/v1";

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

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  // Get access token
  const token = typeof window !== 'undefined' 
    ? localStorage.getItem('barbod_access_token') 
    : null;
  
  // Create headers object
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Add custom headers from options
  if (options.headers) {
    Object.entries(options.headers as Record<string, string>).forEach(([key, value]) => {
      headers[key] = value;
    });
  }
  
  // Add Authorization header if token exists and it's not an auth endpoint
  const isAuthEndpoint = path.startsWith('/auth/');
  if (token && !isAuthEndpoint) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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