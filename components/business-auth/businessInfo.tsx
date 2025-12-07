"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { AccountKind, BusinessInfoPayload } from "../../types/businessProfile";

interface BusinessInfoProps {
  accountType?: AccountKind;
  onContinue?: (data: BusinessInfoForm) => void;
  onBack?: () => void;
  initialData?: BusinessInfoPayload;
  isLoading?: boolean;
}

type BusinessInfoForm = BusinessInfoPayload;

const activityOptions: { value: string; label: string }[] = [
  { value: "", label: "Choose activity" },
  { value: "online-store", label: "Online store" },
  { value: "services", label: "Services" },
  { value: "content-media", label: "Content / Media" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

export function BusinessInfo({
  accountType = "legal",
  onContinue,
  onBack,
  initialData,
  isLoading,
}: BusinessInfoProps) {
  const [form, setForm] = useState<BusinessInfoForm>({
    brandName: "",
    fieldOfWork: "",
    websiteUrl: "",
    businessNationalId: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (key: keyof BusinessInfoForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: BusinessInfoPayload = {
      brandName: form.brandName,
      fieldOfWork: form.fieldOfWork,
      websiteUrl: form.websiteUrl,
      businessNationalId: form.businessNationalId,
    };

    onContinue?.(payload);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="space-y-2 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)] font-black">
          اطلاعات کسب‌ و کار
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          لطفا جزئیات فعالیت و شناسه ملی کسب‌وکار خود را وارد کنید.
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
            placeholder="مثال: باربد"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            شناسه / کد ملی کسب‌ و کار
          </label>
          <input
            type="text"
            value={form.businessNationalId ?? ""}
            onChange={(event) => handleChange("businessNationalId", event.target.value)}
            placeholder="10345678901"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            حوزه فعالیت
          </label>
          <div className="relative">
            <select
              value={form.fieldOfWork}
              onChange={(event) => handleChange("fieldOfWork", event.target.value)}
              className="w-full appearance-none rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:ring-[color:var(--md-sys-color-primary)]/30"
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
            وب‌ سایت
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[color:var(--md-sys-color-on-surface-variant)]">
              آدرس:
            </span>
            <input
              dir="ltr"
              type="url"
              value={form.websiteUrl}
              onChange={(event) => handleChange("websiteUrl", event.target.value)}
              placeholder="https://barbod.ir"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="min-w-[140px]"
            disabled={isLoading}
          >
            بازگشت
          </Button>
          <Button type="submit" className="min-w-[140px]" disabled={isLoading}>
            ذخیره و ادامه
          </Button>
        </div>
      </form>
    </section>
  );
}
