"use client";

import { useMemo, useState } from "react";
import { Info, ShieldCheck } from "lucide-react";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

type FaceDetectionForm = {
  requestActivation: boolean;
  allowedIps: string[];
  rawIps: string;
};

interface FaceDetectionProps {
  onBack?: () => void;
  onContinue?: (data: FaceDetectionForm) => void;
  onSkip?: () => void;
}

const parseIpList = (value: string) =>
  value
    .split(/[\s,;]+/)
    .map((ip) => ip.trim())
    .filter(Boolean);

export function FaceDetection({ onBack, onContinue, onSkip }: FaceDetectionProps) {
  const [requestActivation, setRequestActivation] = useState(false);
  const [rawIps, setRawIps] = useState("");

  const allowedIps = useMemo(() => parseIpList(rawIps), [rawIps]);

  const handleContinue = () => {
    onContinue?.({ requestActivation, allowedIps, rawIps });
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn relative w-full max-w-[620px] overflow-hidden rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-7 py-8 text-right shadow-[var(--elevation-2)] sm:px-9 sm:py-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.08),transparent_32%),radial-gradient(circle_at_88%_10%,rgba(37,99,235,0.08),transparent_32%)]" />
      <div className="relative space-y-5">
        <div className="mx-auto flex w-max items-center gap-2 rounded-full bg-[color:var(--md-sys-color-primary)]/10 px-3 py-1 text-xs font-semibold text-[color:var(--md-sys-color-primary)] shadow-[0_10px_30px_rgba(37,99,235,0.12)]">
          <ShieldCheck className="h-4 w-4" aria-hidden />
          <span>امنیت بیشتر، پذیرش سریع‌تر</span>
        </div>

        <div className="space-y-2 text-right">
          <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)] font-black">
            سرویس تشخیص چهره
          </Typography>
          <Typography
            variant="body-md"
            className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
          >
            برای فعال سازی سرویس تشخیص چهره، اطلاعات زیر را وارد کنید.
          </Typography>
        </div>

        <div className="flex justify-right">
          <label className="flex items-center gap-3 rounded-2xl bg-[color:var(--md-sys-color-surface-container)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] ring-1 ring-[color:var(--md-sys-color-outline-variant)]">
            <input
              type="checkbox"
              className="h-5 w-5 rounded-[6px] border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-primary)] accent-[color:var(--md-sys-color-primary)]"
              checked={requestActivation}
              onChange={(event) => setRequestActivation(event.target.checked)}
            />
            <span className="text-sm sm:text-base font-semibold">درخواست فعال سازی سرویس تشخیص چهره را دارم.</span>
          </label>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-[color:var(--md-sys-color-primary)]" aria-hidden />
              <span>لیست IP های مجاز (اختیاری)</span>
            </div>
            {allowedIps.length > 0 && (
              <span className="rounded-full bg-[color:var(--md-sys-color-primary)]/10 px-3 py-1 text-xs text-[color:var(--md-sys-color-primary)]">
                {allowedIps.length} آی‌پی ثبت شد
              </span>
            )}
          </div>

          <textarea
            dir="ltr"
            value={rawIps}
            onChange={(event) => setRawIps(event.target.value)}
            placeholder={"مثال:\n192.168.1.12\n91.98.22.4"}
            className="h-52 w-full resize-none rounded-[18px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />

          <Typography variant="body-sm" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-6">
            در صورتی که بیش از یک IP دارید، از کلمه Enter برای جدا کردن آنها استفاده کنید.
          </Typography>
        </div>

        <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="min-w-[140px]"
          >
            مرحله قبل
          </Button>
          <Button
            type="button"
            onClick={handleContinue}
            className="min-w-[140px]"
          >
            ادامه
          </Button>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onSkip}
            className="text-sm font-semibold text-[#1378f2] transition hover:text-[#0f62c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1378f2]/40"
          >
            سرویس را بعدا ثبت نام می کنم
          </button>
        </div>
      </div>
    </section>
  );
}
