"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { Typography } from "../ui/Typography";
import { Input } from "../Input";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import {
  resolveApiErrorMessage,
  runFaceCrop,
  runFaceVerification,
  runOcr,
  type FaceVerificationResponse,
  type OcrResponse,
} from "../../lib/api/testServices";
import { cn } from "../../lib/utils";

type RequestStatus = "idle" | "loading" | "success" | "error";

type ConfirmationStatus = {
  label: string;
  className: string;
};

type TestServicesFlowProps = {
  variant?: "page" | "modal";
};

type TestServicesCopy = {
  heading: string;
  description: string;
  connectionTitle: string;
  mode: {
    production: string;
    demo: string;
  };
  apiKeyLabel: string;
  apiKeyPlaceholder: string;
  demoNote: string;
  stepOneTitle: string;
  stepTwoTitle: string;
  documentLabel: string;
  documentHelper: string;
  referenceLabel: string;
  referenceHelper: string;
  referenceEmpty: string;
  livenessLabel: string;
  livenessHelper: string;
  runOcr: string;
  runningOcr: string;
  runVerification: string;
  runningVerification: string;
  ocrConfirmation: string;
  faceConfirmation: string;
  crop: {
    title: string;
    description: string;
    sourceLabel: string;
    sourceHelper: string;
    sourceEmpty: string;
    run: string;
    running: string;
    resultTitle: string;
    imageAlt: string;
    empty: string;
    requiresKey: string;
    status: {
      idle: string;
      running: string;
      ready: string;
      failed: string;
    };
  };
  status: {
    running: string;
    confirmed: string;
    notConfirmed: string;
    awaiting: string;
  };
  meta: {
    remainingAttempts: (count: number) => string;
    rechargeIn: (seconds: number) => string;
  };
  fileField: {
    selected: (name: string) => string;
    empty: string;
  };
  result: {
    noResponse: string;
  };
  errors: {
    missingOcrFile: string;
    missingCroppedPhoto: string;
    missingFaceVideo: string;
    missingCropFile: string;
    cropRequiresKey: string;
    ocrFailed: string;
    faceFailed: string;
    cropFailed: string;
    badRequest: string;
    unauthorized: string;
    rateLimited: string;
    server: string;
  };
};

const TEST_SERVICES_COPY: Record<Language, TestServicesCopy> = {
  [Language.EN]: {
    heading: "Test Services",
    description:
      "Run OCR first, crop a passport photo from the document image, then validate face recognition and liveness with the cropped photo and a short video.",
    connectionTitle: "Connection settings",
    mode: {
      production: "Using production endpoints (API key)",
      demo: "Using demo endpoints (rate limited)",
    },
    apiKeyLabel: "API key (optional)",
    apiKeyPlaceholder: "Leave empty to use demo endpoints",
    demoNote:
      "Demo endpoints are rate-limited per IP. Provide a key to use production endpoints.",
    stepOneTitle: "Step 1 — OCR",
    stepTwoTitle: "Step 3 — Face recognition & liveness",
    documentLabel: "Document image",
    documentHelper: "Use a clear, front-facing document photo.",
    referenceLabel: "Cropped reference photo",
    referenceHelper: "Generated from the OCR document in step 2.",
    referenceEmpty: "Run the crop step to generate a reference photo.",
    livenessLabel: "Liveness video",
    livenessHelper: "Short selfie video with a clear face and natural movement.",
    runOcr: "Run OCR",
    runningOcr: "Running OCR...",
    runVerification: "Run verification",
    runningVerification: "Running verification...",
    ocrConfirmation: "OCR confirmation",
    faceConfirmation: "Face & liveness confirmation",
    crop: {
      title: "Step 2 — Passport photo crop",
      description: "Crop a passport photo from the OCR document image.",
      sourceLabel: "OCR document image",
      sourceHelper: "Uses the document uploaded in the OCR step. Run OCR first to enable cropping.",
      sourceEmpty: "Upload a document image in the OCR step first.",
      run: "Crop photo",
      running: "Cropping...",
      resultTitle: "Cropped photo",
      imageAlt: "Cropped passport photo",
      empty: "No cropped image yet.",
      requiresKey: "Requires API key (production only).",
      status: {
        idle: "Awaiting image",
        running: "Cropping...",
        ready: "Ready",
        failed: "Failed",
      },
    },
    status: {
      running: "Running...",
      confirmed: "Confirmed",
      notConfirmed: "Not confirmed",
      awaiting: "Awaiting result",
    },
    meta: {
      remainingAttempts: (count) => `Remaining attempts: ${count}`,
      rechargeIn: (seconds) => `Recharge in: ${seconds}s`,
    },
    fileField: {
      selected: (name) => `Selected: ${name}`,
      empty: "No file selected yet.",
    },
    result: {
      noResponse: "No response yet.",
    },
    errors: {
      missingOcrFile: "Select an OCR image before submitting.",
      missingCroppedPhoto: "Crop a reference photo before submitting.",
      missingFaceVideo: "Select a liveness video before submitting.",
      missingCropFile: "Upload a document image before cropping.",
      cropRequiresKey: "Provide an API key to crop photos.",
      ocrFailed: "OCR request failed.",
      faceFailed: "Face verification request failed.",
      cropFailed: "Photo crop request failed.",
      badRequest: "Request was rejected. Check the uploaded files.",
      unauthorized: "Unauthorized. Check your API key.",
      rateLimited: "Too many requests. Try again later.",
      server: "Server error. Please try again.",
    },
  },
  [Language.FA]: {
    heading: "سرویس های تست",
    description:
      "ابتدا OCR را اجرا کنید، سپس از تصویر مدرک عکس پرسنلی برش دهید و در نهایت تشخیص چهره و زنده بودن را با عکس برش خورده و یک ویدیوی کوتاه بررسی کنید.",
    connectionTitle: "تنظیمات اتصال",
    mode: {
      production: "استفاده از اندپوینت های اصلی (کلید API)",
      demo: "استفاده از اندپوینت های دمو (محدودیت نرخ)",
    },
    apiKeyLabel: "کلید API (اختیاری)",
    apiKeyPlaceholder: "برای استفاده از اندپوینت های دمو خالی بگذارید",
    demoNote:
      "اندپوینت های دمو برای هر IP محدودیت نرخ دارند. برای استفاده از اندپوینت های اصلی، کلید ارائه کنید.",
    stepOneTitle: "مرحله ۱ — OCR",
    stepTwoTitle: "مرحله ۳ — تشخیص چهره و زنده بودن",
    documentLabel: "تصویر مدرک",
    documentHelper: "از یک تصویر واضح و روبه رو از مدرک استفاده کنید.",
    referenceLabel: "عکس مرجع برش خورده",
    referenceHelper: "از تصویر OCR مرحله ۲ ساخته می شود.",
    referenceEmpty: "برای ساخت عکس مرجع، مرحله برش را اجرا کنید.",
    livenessLabel: "ویدئوی زنده بودن",
    livenessHelper: "یک ویدئوی سلفی کوتاه با چهره واضح و حرکت طبیعی.",
    runOcr: "اجرای OCR",
    runningOcr: "در حال اجرای OCR...",
    runVerification: "اجرای اعتبارسنجی",
    runningVerification: "در حال اجرای اعتبارسنجی...",
    ocrConfirmation: "تایید OCR",
    faceConfirmation: "تایید چهره و زنده بودن",
    crop: {
      title: "مرحله ۲ — برش عکس پرسنلی",
      description: "از تصویر مدرک OCR، عکس پرسنلی برش داده می شود.",
      sourceLabel: "تصویر مدرک OCR",
      sourceHelper: "از تصویر مرحله OCR استفاده می شود. ابتدا OCR را اجرا کنید.",
      sourceEmpty: "ابتدا در مرحله OCR یک تصویر بارگذاری کنید.",
      run: "برش عکس",
      running: "در حال برش...",
      resultTitle: "عکس برش خورده",
      imageAlt: "عکس پرسنلی برش خورده",
      empty: "هنوز عکسی برش نشده است.",
      requiresKey: "نیاز به کلید API دارد (فقط حالت اصلی).",
      status: {
        idle: "در انتظار تصویر",
        running: "در حال برش...",
        ready: "آماده",
        failed: "ناموفق",
      },
    },
    status: {
      running: "در حال اجرا...",
      confirmed: "تایید شد",
      notConfirmed: "تایید نشد",
      awaiting: "در انتظار نتیجه",
    },
    meta: {
      remainingAttempts: (count) => `تلاش های باقی مانده: ${count}`,
      rechargeIn: (seconds) => `امکان تلاش مجدد در: ${seconds} ثانیه`,
    },
    fileField: {
      selected: (name) => `انتخاب شده: ${name}`,
      empty: "هنوز فایلی انتخاب نشده است.",
    },
    result: {
      noResponse: "هنوز پاسخی دریافت نشده است.",
    },
    errors: {
      missingOcrFile: "قبل از ارسال، یک تصویر برای OCR انتخاب کنید.",
      missingCroppedPhoto: "قبل از ارسال، عکس مرجع را برش دهید.",
      missingFaceVideo: "قبل از ارسال، یک ویدئوی زنده بودن انتخاب کنید.",
      missingCropFile: "قبل از برش، یک تصویر مدرک بارگذاری کنید.",
      cropRequiresKey: "برای برش عکس به کلید API نیاز دارید.",
      ocrFailed: "درخواست OCR ناموفق بود.",
      faceFailed: "درخواست تایید چهره ناموفق بود.",
      cropFailed: "درخواست برش عکس ناموفق بود.",
      badRequest: "درخواست پذیرفته نشد. فایل های ارسالی را بررسی کنید.",
      unauthorized: "مجوز دسترسی نامعتبر است. کلید API را بررسی کنید.",
      rateLimited: "تعداد درخواست ها زیاد است. بعدا دوباره تلاش کنید.",
      server: "خطای سرور. لطفا دوباره تلاش کنید.",
    },
  },
};

const buildConfirmationStatus = (
  success: boolean | null,
  isLoading: boolean,
  labels: TestServicesCopy["status"],
): ConfirmationStatus => {
  if (isLoading) {
    return {
      label: labels.running,
      className: "bg-amber-100 text-amber-700 border-amber-200",
    };
  }
  if (success === true) {
    return {
      label: labels.confirmed,
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }
  if (success === false) {
    return {
      label: labels.notConfirmed,
      className: "bg-rose-100 text-rose-700 border-rose-200",
    };
  }
  return {
    label: labels.awaiting,
    className:
      "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)] border-[color:var(--md-sys-color-outline-variant)]",
  };
};

const buildRequestStatus = (
  status: RequestStatus,
  labels: TestServicesCopy["crop"]["status"],
): ConfirmationStatus => {
  if (status === "loading") {
    return {
      label: labels.running,
      className: "bg-amber-100 text-amber-700 border-amber-200",
    };
  }
  if (status === "success") {
    return {
      label: labels.ready,
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  }
  if (status === "error") {
    return {
      label: labels.failed,
      className: "bg-rose-100 text-rose-700 border-rose-200",
    };
  }
  return {
    label: labels.idle,
    className:
      "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface-variant)] border-[color:var(--md-sys-color-outline-variant)]",
  };
};

const renderMeta = (result?: {
  remaining_attempts?: number;
  recharge_in_seconds?: number;
}, labels?: TestServicesCopy["meta"]) => {
  if (!labels) return null;

  const rows = [
    result?.remaining_attempts !== undefined
      ? labels.remainingAttempts(result.remaining_attempts)
      : null,
    result?.recharge_in_seconds !== undefined
      ? labels.rechargeIn(result.recharge_in_seconds)
      : null,
  ].filter(Boolean) as string[];

  if (!rows.length) return null;

  return (
    <div className="mt-3 space-y-1 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
      {rows.map((row) => (
        <div key={row}>{row}</div>
      ))}
    </div>
  );
};

function FileField({
  label,
  accept,
  file,
  onChange,
  helper,
  selectedLabel,
  emptyLabel,
}: {
  label: string;
  accept: string;
  file: File | null;
  onChange: (file: File | null) => void;
  helper?: string;
  selectedLabel: (name: string) => string;
  emptyLabel: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
        {label}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="w-full rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-3 text-sm text-[color:var(--md-sys-color-on-surface)] file:mr-4 file:rounded-lg file:border-0 file:bg-[color:var(--md-sys-color-primary)]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--md-sys-color-primary)]"
      />
      <div className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
        {file ? selectedLabel(file.name) : emptyLabel}
      </div>
      {helper ? (
        <div className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
          {helper}
        </div>
      ) : null}
    </div>
  );
}

function ResultPanel({
  title,
  success,
  isLoading,
  message,
  error,
  raw,
  meta,
  dir,
  statusLabels,
  emptyLabel,
}: {
  title: string;
  success: boolean | null;
  isLoading: boolean;
  message?: string;
  error?: string | null;
  raw?: string | null;
  meta?: React.ReactNode;
  dir: "rtl" | "ltr";
  statusLabels: TestServicesCopy["status"];
  emptyLabel: string;
}) {
  const status = buildConfirmationStatus(success, isLoading, statusLabels);

  return (
    <div className="h-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-4 shadow-[var(--elevation-1)]">
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          dir === "rtl" ? "flex-row-reverse text-right" : "text-left",
        )}
      >
        <Typography variant="h6" className="text-[color:var(--md-sys-color-on-surface)]">
          {title}
        </Typography>
        <span
          className={cn("rounded-full border px-3 py-1 text-xs font-semibold", status.className)}
        >
          {status.label}
        </span>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {message ? (
        <p className="mt-3 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
          {message}
        </p>
      ) : null}

      {meta}

      {raw ? (
        <pre className="mt-4 max-h-64 overflow-auto rounded-xl bg-black/80 p-3 text-xs text-emerald-200">
          {raw}
        </pre>
      ) : (
        <p className="mt-4 text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
          {emptyLabel}
        </p>
      )}
    </div>
  );
}

function ImageResultPanel({
  title,
  status,
  error,
  imageUrl,
  imageAlt,
  emptyLabel,
  dir,
  statusLabels,
}: {
  title: string;
  status: RequestStatus;
  error?: string | null;
  imageUrl?: string | null;
  imageAlt: string;
  emptyLabel: string;
  dir: "rtl" | "ltr";
  statusLabels: TestServicesCopy["crop"]["status"];
}) {
  const statusInfo = buildRequestStatus(status, statusLabels);

  return (
    <div className="h-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-4 shadow-[var(--elevation-1)]">
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          dir === "rtl" ? "flex-row-reverse text-right" : "text-left",
        )}
      >
        <Typography variant="h6" className="text-[color:var(--md-sys-color-on-surface)]">
          {title}
        </Typography>
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-semibold",
            statusInfo.className,
          )}
        >
          {statusInfo.label}
        </span>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="h-64 w-full rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
}

export function TestServicesFlow({ variant = "page" }: TestServicesFlowProps) {
  const { language, dir } = useLanguage();
  const copy = TEST_SERVICES_COPY[language] ?? TEST_SERVICES_COPY[Language.EN];
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";
  const spacing = variant === "modal" ? "md" : "lg";
  const containerSize = variant === "modal" ? "lg" : "xl";
  const stackSpacing = variant === "modal" ? "space-y-6" : "space-y-10";
  const headingVariant = variant === "modal" ? "h3" : "h2";

  const [apiKey, setApiKey] = useState("");

  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrStatus, setOcrStatus] = useState<RequestStatus>("idle");
  const [ocrResult, setOcrResult] = useState<OcrResponse | null>(null);
  const [ocrError, setOcrError] = useState<string | null>(null);

  const [facePhoto, setFacePhoto] = useState<File | null>(null);
  const [faceVideo, setFaceVideo] = useState<File | null>(null);
  const [faceStatus, setFaceStatus] = useState<RequestStatus>("idle");
  const [faceResult, setFaceResult] = useState<FaceVerificationResponse | null>(null);
  const [faceError, setFaceError] = useState<string | null>(null);

  const [cropStatus, setCropStatus] = useState<RequestStatus>("idle");
  const [cropResult, setCropResult] = useState<Blob | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);

  const apiKeyValue = apiKey.trim();
  const modeLabel = apiKeyValue
    ? copy.mode.production
    : copy.mode.demo;

  const ocrSuccess =
    typeof ocrResult?.success === "boolean" ? ocrResult.success : null;
  const faceSuccess =
    typeof faceResult?.success === "boolean" ? faceResult.success : null;

  const ocrRaw = useMemo(
    () => (ocrResult ? JSON.stringify(ocrResult, null, 2) : null),
    [ocrResult],
  );
  const faceRaw = useMemo(
    () => (faceResult ? JSON.stringify(faceResult, null, 2) : null),
    [faceResult],
  );

  useEffect(() => {
    if (!cropResult) {
      setCropPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(cropResult);
    setCropPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cropResult]);

  const handleOcrSubmit = async () => {
    if (!ocrFile) {
      setOcrError(copy.errors.missingOcrFile);
      return;
    }

    setOcrStatus("loading");
    setOcrError(null);
    setOcrResult(null);

    try {
      const response = await runOcr(ocrFile, {
        apiKey: apiKeyValue || undefined,
      });
      setOcrResult(response);
      setOcrStatus("success");
      if (apiKeyValue && cropStatus !== "loading") {
        void handleCropSubmit();
      }
    } catch (error) {
      const message = resolveApiErrorMessage(
        error,
        {
          400: copy.errors.badRequest,
          401: copy.errors.unauthorized,
          429: copy.errors.rateLimited,
          500: copy.errors.server,
        },
        copy.errors.ocrFailed,
      );
      setOcrError(message);
      setOcrStatus("error");
    }
  };

  const handleFaceSubmit = async () => {
    if (!facePhoto) {
      setFaceError(copy.errors.missingCroppedPhoto);
      return;
    }
    if (!faceVideo) {
      setFaceError(copy.errors.missingFaceVideo);
      return;
    }

    setFaceStatus("loading");
    setFaceError(null);
    setFaceResult(null);

    try {
      const response = await runFaceVerification(facePhoto, faceVideo, {
        apiKey: apiKeyValue || undefined,
      });
      setFaceResult(response);
      setFaceStatus("success");
    } catch (error) {
      const message = resolveApiErrorMessage(
        error,
        {
          400: copy.errors.badRequest,
          401: copy.errors.unauthorized,
          429: copy.errors.rateLimited,
          500: copy.errors.server,
        },
        copy.errors.faceFailed,
      );
      setFaceError(message);
      setFaceStatus("error");
    }
  };

  const handleCropSubmit = async () => {
    if (!ocrFile) {
      setCropError(copy.errors.missingCropFile);
      return;
    }
    if (!apiKeyValue) {
      setCropError(copy.errors.cropRequiresKey);
      return;
    }

    setCropStatus("loading");
    setCropError(null);
    setCropResult(null);
    setFacePhoto(null);

    try {
      const response = await runFaceCrop(ocrFile, {
        apiKey: apiKeyValue,
        mode: "production",
      });
      setCropResult(response);
      setCropStatus("success");
      const croppedFile = new File([response], `crop-${Date.now()}.jpg`, {
        type: response.type || "image/jpeg",
      });
      setFacePhoto(croppedFile);
      setFaceError(null);
    } catch (error) {
      const message = resolveApiErrorMessage(
        error,
        {
          400: copy.errors.badRequest,
          401: copy.errors.unauthorized,
          429: copy.errors.rateLimited,
          500: copy.errors.server,
        },
        copy.errors.cropFailed,
      );
      setCropError(message);
      setCropStatus("error");
    }
  };

  return (
    <Section spacing={spacing} dir={dir}>
      <Container size={containerSize} className={stackSpacing}>
        <div className={cn("space-y-3", alignClass)}>
          <Typography variant={headingVariant} className="font-bold">
            {copy.heading}
          </Typography>
          <Typography
            variant="body-lg"
            className="text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            {copy.description}
          </Typography>
        </div>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface-container-low)] shadow-[var(--elevation-2)]">
          <CardHeader className={cn("space-y-2", alignClass)}>
            <CardTitle>{copy.connectionTitle}</CardTitle>
            <Typography
              variant="body-sm"
              className="text-[color:var(--md-sys-color-on-surface-variant)]"
            >
              {modeLabel}
            </Typography>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <Input
              label={copy.apiKeyLabel}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder={copy.apiKeyPlaceholder}
            />
            <div className={cn("text-sm", alignClass)}>
              <div className="text-[color:var(--md-sys-color-on-surface-variant)]">
                {copy.demoNote}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={alignClass}>
            <CardTitle>{copy.stepOneTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <FileField
                label={copy.documentLabel}
                accept="image/*"
                file={ocrFile}
                onChange={(file) => {
                  setOcrFile(file);
                  setOcrError(null);
                  setCropError(null);
                  setCropResult(null);
                  setCropStatus("idle");
                  setFacePhoto(null);
                }}
                helper={copy.documentHelper}
                selectedLabel={copy.fileField.selected}
                emptyLabel={copy.fileField.empty}
              />
              <Button
                variant="secondary"
                onClick={handleOcrSubmit}
                disabled={ocrStatus === "loading"}
              >
                {ocrStatus === "loading" ? copy.runningOcr : copy.runOcr}
              </Button>
            </div>

            <ResultPanel
              title={copy.ocrConfirmation}
              success={ocrSuccess}
              isLoading={ocrStatus === "loading"}
              message={ocrResult?.message}
              error={ocrError}
              raw={ocrRaw}
              meta={renderMeta(ocrResult ?? undefined, copy.meta)}
              dir={dir}
              statusLabels={copy.status}
              emptyLabel={copy.result.noResponse}
            />
          </CardContent>
        </Card>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={cn("space-y-2", alignClass)}>
            <CardTitle>{copy.crop.title}</CardTitle>
            <Typography
              variant="body-sm"
              className="text-[color:var(--md-sys-color-on-surface-variant)]"
            >
              {copy.crop.description}
            </Typography>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  {copy.crop.sourceLabel}
                </div>
                <div className="w-full rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-3 text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {ocrFile
                    ? copy.fileField.selected(ocrFile.name)
                    : copy.crop.sourceEmpty}
                </div>
                <div className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                  {copy.crop.sourceHelper}
                </div>
              </div>
              <Typography
                variant="body-sm"
                className="text-[color:var(--md-sys-color-on-surface-variant)]"
              >
                {copy.crop.requiresKey}
              </Typography>
              <Button
                variant="secondary"
                onClick={handleCropSubmit}
                disabled={
                  cropStatus === "loading" ||
                  !ocrFile ||
                  !apiKeyValue ||
                  ocrStatus !== "success"
                }
              >
                {cropStatus === "loading" ? copy.crop.running : copy.crop.run}
              </Button>
            </div>

            <ImageResultPanel
              title={copy.crop.resultTitle}
              status={cropStatus}
              error={cropError}
              imageUrl={cropPreviewUrl}
              imageAlt={copy.crop.imageAlt}
              emptyLabel={copy.crop.empty}
              dir={dir}
              statusLabels={copy.crop.status}
            />
          </CardContent>
        </Card>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={alignClass}>
            <CardTitle>{copy.stepTwoTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
                  {copy.referenceLabel}
                </div>
                <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-3">
                  {cropPreviewUrl ? (
                    <img
                      src={cropPreviewUrl}
                      alt={copy.crop.imageAlt}
                      className="h-40 w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                      {copy.referenceEmpty}
                    </div>
                  )}
                </div>
                <div className="text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                  {copy.referenceHelper}
                </div>
              </div>
              <FileField
                label={copy.livenessLabel}
                accept="video/*"
                file={faceVideo}
                onChange={(file) => {
                  setFaceVideo(file);
                  setFaceError(null);
                }}
                helper={copy.livenessHelper}
                selectedLabel={copy.fileField.selected}
                emptyLabel={copy.fileField.empty}
              />
              <Button
                variant="secondary"
                onClick={handleFaceSubmit}
                disabled={faceStatus === "loading" || !facePhoto || !faceVideo}
              >
                {faceStatus === "loading"
                  ? copy.runningVerification
                  : copy.runVerification}
              </Button>
            </div>

            <ResultPanel
              title={copy.faceConfirmation}
              success={faceSuccess}
              isLoading={faceStatus === "loading"}
              message={
                faceResult?.success
                  ? faceResult?.message
                  : faceResult?.reason ?? faceResult?.message
              }
              error={faceError}
              raw={faceRaw}
              meta={renderMeta(faceResult ?? undefined, copy.meta)}
              dir={dir}
              statusLabels={copy.status}
              emptyLabel={copy.result.noResponse}
            />
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
