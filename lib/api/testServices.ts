import { getApiBaseUrl } from "../api-base-url";

const API_BASE_URL = getApiBaseUrl();

export type OcrResponse = {
  success?: boolean;
  message?: string;
  remaining_attempts?: number;
  recharge_in_seconds?: number;
  stats?: Record<string, unknown>;
  [key: string]: unknown;
};

export type FaceVerificationResponse = {
  success?: boolean;
  message?: string;
  reason?: string;
  remaining_attempts?: number;
  recharge_in_seconds?: number;
  results?: unknown;
  stats?: unknown;
  messages?: unknown;
};

type Mode = "demo" | "production";

type RequestOptions = {
  mode?: Mode;
  apiKey?: string;
};

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

export const resolveApiErrorMessage = (
  error: unknown,
  statusMap: Partial<Record<number, string>>,
  fallback: string,
): string => {
  if (error instanceof ApiError) {
    return statusMap[error.status] ?? error.message ?? fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

const extractErrorMessage = (payload: unknown): string | undefined => {
  if (typeof payload === "string") return payload;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    if (typeof record.message === "string") {
      return record.message;
    }

    const values = Object.values(record);
    const firstString = values.find((value) => typeof value === "string");
    if (typeof firstString === "string") return firstString;
  }

  return undefined;
};

const readPayload = async (response: Response): Promise<unknown> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  if (contentType.includes("text/")) {
    return response.text();
  }
  return null;
};

const postFormData = async <T>(
  path: string,
  formData: FormData,
  apiKey?: string,
): Promise<T> => {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  const payload = await readPayload(response);

  if (!response.ok) {
    const message =
      extractErrorMessage(payload) ||
      response.statusText ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
};

const postFormDataBlob = async (
  path: string,
  formData: FormData,
  apiKey?: string,
): Promise<Blob> => {
  const headers: Record<string, string> = {};
  if (apiKey) {
    headers["X-API-KEY"] = apiKey;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const payload = await readPayload(response);
    const message =
      extractErrorMessage(payload) ||
      response.statusText ||
      `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return response.blob();
};

const resolveMode = ({ mode, apiKey }: RequestOptions): Mode => {
  if (mode) return mode;
  return apiKey ? "production" : "demo";
};

export async function runOcr(
  image: File,
  options: RequestOptions = {},
): Promise<OcrResponse> {
  const resolvedMode = resolveMode(options);
  if (resolvedMode === "production" && !options.apiKey) {
    throw new Error("Missing API key for production OCR requests.");
  }

  const formData = new FormData();
  formData.append("image", image);
  const path = resolvedMode === "demo" ? "/demo/ocr/extract" : "/ocr/extract";
  return postFormData<OcrResponse>(path, formData, options.apiKey);
}

export async function runFaceVerification(
  photo: File,
  video: File,
  options: RequestOptions = {},
): Promise<FaceVerificationResponse> {
  const resolvedMode = resolveMode(options);
  if (resolvedMode === "production" && !options.apiKey) {
    throw new Error("Missing API key for production face verification requests.");
  }

  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("video", video);
  const path =
    resolvedMode === "demo"
      ? "/demo/face-verification/verify"
      : "/face-verification/verify";
  return postFormData<FaceVerificationResponse>(path, formData, options.apiKey);
}

export async function runFaceCrop(
  image: File,
  options: RequestOptions = {},
): Promise<Blob> {
  const resolvedMode = resolveMode(options);
  if (resolvedMode !== "production" || !options.apiKey) {
    throw new Error("Missing API key for face crop requests.");
  }

  const formData = new FormData();
  formData.append("image", image);
  return postFormDataBlob("/face-verification/crop", formData, options.apiKey);
}
