"use client";

import { FormEvent, useState } from "react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface LocationInfoProps {
  onContinue?: (data: LocationForm) => void;
  onBack?: () => void;
}

type LocationForm = {
  postalCode: string;
};

export function LocationInfo({ onContinue, onBack }: LocationInfoProps) {
  const [form, setForm] = useState<LocationForm>({ postalCode: "" });

  const handleChange = (value: string) => {
    setForm({ postalCode: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue?.(form);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="space-y-2 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)] font-black">
          موقعیت مکانی
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          اطلاعات زیر تنها جهت احراز موقعیت مکانی و ارتباط بهتر با کسب و کار شما دریافت می‌شود.
        </Typography>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            کد پستی
          </label>
          <input
            dir="ltr"
            inputMode="numeric"
            maxLength={10}
            value={form.postalCode}
            onChange={(event) => handleChange(event.target.value)}
            placeholder="0133456789"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
          <Typography variant="caption" className="text-[color:var(--md-sys-color-on-surface-variant)]">
            بدون فاصله وارد کنید؛ برای ارسال بسته‌ها و تایید آدرس استفاده می‌شود.
          </Typography>
        </div>

        <div className="flex flex-row-reverse items-center justify-between gap-4">
          <Button
            type="submit"
            size="lg"
            className="min-w-[140px] px-10 shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
          >
            ادامه
          </Button>
          <Button
            type="button"
            size="lg"
            variant="secondary"
            onClick={onBack}
            className="min-w-[140px] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] hover:bg-[color:var(--md-sys-color-surface-container-high)]"
          >
            مرحله قبل
          </Button>
        </div>
      </form>
    </section>
  );
}
