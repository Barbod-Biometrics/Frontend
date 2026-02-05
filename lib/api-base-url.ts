const DEFAULT_PUBLIC_API_BASE_PATH = "/api/v1";
const DEFAULT_BACKEND_API_BASE_URL = "https://api.barbodbiometrics.ir/api/v1";

const normalizeBase = (value: string) => value.replace(/\/+$/, "");

export const getPublicApiBaseUrl = () => {
  const configured = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (configured?.startsWith("/")) {
    return normalizeBase(configured);
  }
  return DEFAULT_PUBLIC_API_BASE_PATH;
};

export const getBackendApiBaseUrl = () => {
  const configured =
    process.env.API_BACKEND_BASE_URL?.trim() ??
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim();

  if (configured && /^https?:\/\//.test(configured)) {
    return normalizeBase(configured);
  }

  return DEFAULT_BACKEND_API_BASE_URL;
};

export const getApiBaseUrl = () =>
  typeof window === "undefined" ? getBackendApiBaseUrl() : getPublicApiBaseUrl();

