import { VerifyOtpResponse } from "./auth-api";

const ACCESS_TOKEN_KEY = "barbod_access_token";
const REFRESH_TOKEN_KEY = "barbod_refresh_token";
const PHONE_NUMBER_KEY = "barbod_phone_number";
const IS_ADMIN_KEY = "barbod_is_admin";

const isBrowser = () => typeof window !== "undefined";

type SaveAuthOptions = {
  preserveExisting?: boolean;
};

export const saveAuth = (
  tokens: VerifyOtpResponse,
  options: SaveAuthOptions = {}
) => {
  if (!isBrowser()) return;
  const preserveExisting = options.preserveExisting ?? false;

  if (tokens.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  }

  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  } else if (!preserveExisting) {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (tokens.phone_number) {
    localStorage.setItem(PHONE_NUMBER_KEY, tokens.phone_number);
  }
  if (typeof tokens.is_admin !== "undefined") {
    localStorage.setItem(IS_ADMIN_KEY, tokens.is_admin ? "1" : "0");
  } else if (!preserveExisting) {
    localStorage.removeItem(IS_ADMIN_KEY);
  }
};

export const clearAuth = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PHONE_NUMBER_KEY);
  localStorage.removeItem(IS_ADMIN_KEY);
};

export const clearClientStorage = async () => {
  if (!isBrowser()) return;

  try {
    localStorage.clear();
  } catch {}

  try {
    sessionStorage.clear();
  } catch {}

  if ("caches" in window) {
    try {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
    } catch {}
  }
};

export const getAccessToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getPhoneNumber = () => {
  if (!isBrowser()) return null;
  return localStorage.getItem(PHONE_NUMBER_KEY);
};

export const getIsAdmin = () => {
  if (!isBrowser()) return null;
  const v = localStorage.getItem(IS_ADMIN_KEY);
  if (v === null) return null;
  return v === "1";
};
