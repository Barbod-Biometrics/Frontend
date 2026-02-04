"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { Typography } from "../ui/Typography";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import {
  resolveApiErrorMessage,
  runOcr,
  type OcrResponse,
} from "../../lib/api/testServices";
import { cn } from "../../lib/utils";
import { ResultPanel } from "./ResultPanel";

type RequestStatus = "idle" | "loading" | "success" | "error";

type OcrDemoCopy = {
  heading: string;
  description: string;
  uploadTitle: string;
  documentLabel: string;
  documentHelper: string;
  runOcr: string;
  runningOcr: string;
  confirmationTitle: string;
  previewTitle: string;
  previewAlt: string;
  previewEmpty: string;
  submitNote: string;
  meta: {
    remainingAttempts: (count: number) => string;
    rechargeIn: (seconds: number) => string;
  };
  fileField: {
    selected: (name: string) => string;
    empty: string;
  };
  errors: {
    missingFile: string;
    ocrFailed: string;
    badRequest: string;
    unauthorized: string;
    rateLimited: string;
    server: string;
  };
};

const OCR_DEMO_COPY: Record<Language, OcrDemoCopy> = {
  [Language.EN]: {
    heading: "OCR demo",
    description:
      "Upload a document image, then run OCR to get a confirmation and response message from the backend.",
    uploadTitle: "Upload document",
    documentLabel: "Document image",
    documentHelper: "Use a clear, front-facing document photo.",
    runOcr: "Run OCR",
    runningOcr: "Running OCR...",
    confirmationTitle: "OCR confirmation",
    previewTitle: "Uploaded image",
    previewAlt: "Uploaded document",
    previewEmpty: "No image uploaded yet.",
    submitNote:
      "When you are ready, submit the image to the OCR service. Demo endpoints are rate-limited per IP.",
    meta: {
      remainingAttempts: (count) => `Remaining attempts: ${count}`,
      rechargeIn: (seconds) => `Recharge in: ${seconds}s`,
    },
    fileField: {
      selected: (name) => `Selected: ${name}`,
      empty: "No file selected yet.",
    },
    errors: {
      missingFile: "Upload an image before running OCR.",
      ocrFailed: "OCR request failed.",
      badRequest: "Request was rejected. Check the uploaded files.",
      unauthorized: "Unauthorized. Check your API key.",
      rateLimited: "Too many requests. Try again later.",
      server: "Server error. Please try again.",
    },
  },
  [Language.FA]: {
    heading: "دموی OCR",
    description:
      "یک تصویر از مدرک بارگذاری کنید، سپس OCR را اجرا کنید تا پیام تایید و پاسخ از بک اند دریافت شود.",
    uploadTitle: "بارگذاری تصویر",
    documentLabel: "تصویر مدرک",
    documentHelper: "از یک تصویر واضح و رو به رو از مدرک استفاده کنید.",
    runOcr: "اجرای OCR",
    runningOcr: "در حال اجرای OCR...",
    confirmationTitle: "تایید OCR",
    previewTitle: "تصویر بارگذاری شده",
    previewAlt: "مدرک بارگذاری شده",
    previewEmpty: "هنوز تصویری بارگذاری نشده است.",
    submitNote:
      "وقتی آماده بودید، تصویر را برای سرویس OCR ارسال کنید. اندپوینت های دمو برای هر IP محدودیت نرخ دارند.",
    meta: {
      remainingAttempts: (count) => `تلاش های باقی مانده: ${count}`,
      rechargeIn: (seconds) => `امکان تلاش مجدد در: ${seconds} ثانیه`,
    },
    fileField: {
      selected: (name) => `انتخاب شده: ${name}`,
      empty: "هنوز فایلی انتخاب نشده است.",
    },
    errors: {
      missingFile: "قبل از اجرای OCR یک تصویر بارگذاری کنید.",
      ocrFailed: "درخواست OCR ناموفق بود.",
      badRequest: "درخواست پذیرفته نشد. فایل های ارسالی را بررسی کنید.",
      unauthorized: "مجوز دسترسی نامعتبر است. کلید API را بررسی کنید.",
      rateLimited: "تعداد درخواست ها زیاد است. بعدا دوباره تلاش کنید.",
      server: "خطای سرور. لطفا دوباره تلاش کنید.",
    },
  },
};

const renderMeta = (result?: {
  remaining_attempts?: number;
  recharge_in_seconds?: number;
}, labels?: OcrDemoCopy["meta"]) => {
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

export function OcrCameraDemo() {
  const { language, dir } = useLanguage();
  const copy = OCR_DEMO_COPY[language] ?? OCR_DEMO_COPY[Language.EN];
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";

  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [result, setResult] = useState<OcrResponse | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const success =
    typeof result?.success === "boolean" ? result.success : null;
  const raw = useMemo(
    () => (result ? JSON.stringify(result, null, 2) : null),
    [result],
  );

  useEffect(() => {
    if (!documentFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(documentFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [documentFile]);

  const handleFileChange = (file: File | null) => {
    setDocumentFile(file);
    setStatus("idle");
    setRequestError(null);
    setResult(null);
  };

  const handleRun = async () => {
    if (!documentFile) {
      setRequestError(copy.errors.missingFile);
      return;
    }

    setStatus("loading");
    setRequestError(null);
    setResult(null);

    try {
      const response = await runOcr(documentFile, { mode: "demo" });
      setResult(response);
      setStatus("success");
    } catch (err) {
      const message = resolveApiErrorMessage(
        err,
        {
          400: copy.errors.badRequest,
          401: copy.errors.unauthorized,
          429: copy.errors.rateLimited,
          500: copy.errors.server,
        },
        copy.errors.ocrFailed,
      );
      setRequestError(message);
      setStatus("error");
    }
  };

  return (
    <Section spacing="lg" dir={dir}>
      <Container className="space-y-10">
        <div className={cn("space-y-3", alignClass)}>
          <Typography variant="h2" className="text-4xl font-bold">
            {copy.heading}
          </Typography>
          <Typography
            variant="body-lg"
            className="text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            {copy.description}
          </Typography>
        </div>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={alignClass}>
            <CardTitle>{copy.uploadTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <FileField
                label={copy.documentLabel}
                accept="image/*"
                file={documentFile}
                onChange={handleFileChange}
                helper={copy.documentHelper}
                selectedLabel={copy.fileField.selected}
                emptyLabel={copy.fileField.empty}
              />
              <Typography
                variant="body-md"
                className="text-[color:var(--md-sys-color-on-surface-variant)]"
              >
                {copy.submitNote}
              </Typography>
              <Button
                variant="secondary"
                onClick={handleRun}
                disabled={status === "loading"}
              >
                {status === "loading" ? copy.runningOcr : copy.runOcr}
              </Button>
            </div>

            <ResultPanel
              title={copy.confirmationTitle}
              success={success}
              isLoading={status === "loading"}
              message={result?.message}
              error={requestError}
              raw={raw}
              meta={renderMeta(result ?? undefined, copy.meta)}
              dir={dir}
            />
          </CardContent>
        </Card>

        <Card className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)]">
          <CardHeader className={alignClass}>
            <CardTitle>{copy.previewTitle}</CardTitle>
          </CardHeader>
          <CardContent className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] p-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={copy.previewAlt}
                className="h-64 w-full rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-64 items-center justify-center text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                {copy.previewEmpty}
              </div>
            )}
          </CardContent>
        </Card>
      </Container>
    </Section>
  );
}
