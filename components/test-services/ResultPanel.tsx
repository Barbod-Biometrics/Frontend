"use client";

import React from "react";

import { Typography } from "../ui/Typography";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import { cn } from "../../lib/utils";

type ResultPanelProps = {
  title: string;
  success: boolean | null;
  isLoading: boolean;
  message?: string;
  error?: string | null;
  raw?: string | null;
  meta?: React.ReactNode;
  dir: "rtl" | "ltr";
};

type ConfirmationStatus = {
  label: string;
  className: string;
};

type ResultPanelCopy = {
  status: {
    running: string;
    confirmed: string;
    notConfirmed: string;
    awaiting: string;
  };
  empty: string;
};

const RESULT_PANEL_COPY: Record<Language, ResultPanelCopy> = {
  [Language.EN]: {
    status: {
      running: "Running...",
      confirmed: "Confirmed",
      notConfirmed: "Not confirmed",
      awaiting: "Awaiting result",
    },
    empty: "No response yet.",
  },
  [Language.FA]: {
    status: {
      running: "در حال اجرا...",
      confirmed: "تایید شد",
      notConfirmed: "تایید نشد",
      awaiting: "در انتظار نتیجه",
    },
    empty: "هنوز پاسخی دریافت نشده است.",
  },
};

const buildConfirmationStatus = (
  success: boolean | null,
  isLoading: boolean,
  labels: ResultPanelCopy["status"],
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

export function ResultPanel({
  title,
  success,
  isLoading,
  message,
  error,
  raw,
  meta,
  dir,
}: ResultPanelProps) {
  const { language } = useLanguage();
  const copy = RESULT_PANEL_COPY[language] ?? RESULT_PANEL_COPY[Language.EN];
  const status = buildConfirmationStatus(success, isLoading, copy.status);

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
        <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", status.className)}>
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
          {copy.empty}
        </p>
      )}
    </div>
  );
}
