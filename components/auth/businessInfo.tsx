"use client";

import { FormEvent, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface BusinessInfoProps {
  onContinue?: (data: BusinessInfoForm) => void;
  onBack?: () => void;
}

type BusinessInfoForm = {
  brandName: string;
  activity: string;
  website: string;
};

const activityOptions: { value: string; label: string }[] = [
  { value: "", label: "انتخاب کنید" },
  { value: "online-store", label: "فروشگاه آنلاین" },
  { value: "services", label: "ارائه خدمات" },
  { value: "content-media", label: "محتوا و رسانه" },
  { value: "education", label: "آموزش" },
  { value: "other", label: "سایر" },
];

export function BusinessInfo({ onContinue, onBack }: BusinessInfoProps) {
  const [form, setForm] = useState<BusinessInfoForm>({
    brandName: "",
    activity: "",
    website: "",
  });

  const handleChange = (key: keyof BusinessInfoForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
          اطلاعات کسب و کار
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          در ادامه اطلاعات کسب و کار خود را وارد کنید.
        </Typography>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            نام برند
          </label>
          <input
            type="text"
            value={form.brandName}
            onChange={(event) => handleChange("brandName", event.target.value)}
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            زمینه فعالیت
          </label>
          <div className="relative">
            <select
              value={form.activity}
              onChange={(event) => handleChange("activity", event.target.value)}
              className="w-full appearance-none rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 pr-4 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:ring-[color:var(--md-sys-color-primary)]/30"
            >
              {activityOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-right">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--md-sys-color-primary)]"
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            آدرس وب سایت
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
              مثلاً:
            </span>
            <input
              dir="ltr"
              type="url"
              value={form.website}
              onChange={(event) => handleChange("website", event.target.value)}
              placeholder="https://barbod.ir"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 pr-16 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="secondary" 
            onClick={onBack}
            className="min-w-[140px]"
          >
            مرحله قبل
          </Button>
          <Button
            type="submit"
            className="min-w-[140px]"
          >
            ثبت و ادامه
          </Button>
        </div>
      </form>
    </section>
  );
}
