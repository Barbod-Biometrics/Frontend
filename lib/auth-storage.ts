import { VerifyOtpResponse } from "./auth-api";

const ACCESS_TOKEN_KEY = "barbod_access_token";
const REFRESH_TOKEN_KEY = "barbod_refresh_token";
const PHONE_NUMBER_KEY = "barbod_phone_number";

const isBrowser = () => typeof window !== "undefined";

export const saveAuth = (tokens: VerifyOtpResponse) => {
  if (!isBrowser()) return;

  if (tokens.access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
  }

  if (tokens.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  if (tokens.phone_number) {
    localStorage.setItem(PHONE_NUMBER_KEY, tokens.phone_number);
  }
};

export const clearAuth = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(PHONE_NUMBER_KEY);
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
