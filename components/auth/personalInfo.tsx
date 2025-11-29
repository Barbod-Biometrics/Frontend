"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface PersonalInfoProps {
  onContinue?: (data: PersonalInfoForm) => void;
  onBack?: () => void;
}

type PersonalInfoForm = {
  isBusinessOwner: boolean;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  phone: string;
};

export function PersonalInfo({ onContinue, onBack }: PersonalInfoProps) {
  const [form, setForm] = useState<PersonalInfoForm>({
    isBusinessOwner: true,
    firstName: "",
    lastName: "",
    nationalId: "",
    birthDate: "",
    phone: "",
  });

  const handleChange = (key: keyof PersonalInfoForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onContinue?.(form);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="space-y-2 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
          اطلاعات شخصی
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          در ادامه اطلاعات شخصی خود را وارد کنید.
        </Typography>
      </div>

      <div className="mt-6 space-y-3 rounded-3xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-5 py-5 shadow-[var(--elevation-1)]">
        <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface)]">
          آیا صاحب کسب و کار هستید؟
        </Typography>
        <div className="flex items-center gap-6 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
          {[
            { id: "yes", label: "هستم", value: true },
            { id: "no", label: "نیستم", value: false },
          ].map((option) => {
            const checked = form.isBusinessOwner === option.value;
            return (
              <label key={option.id} className="inline-flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="business-owner"
                  className="h-4 w-4 accent-[color:var(--md-sys-color-primary)]"
                  checked={checked}
                  onChange={() => handleChange("isBusinessOwner", option.value)}
                />
                <span className="select-none">{option.label}</span>
              </label>
            );
          })}
        </div>
        <Typography
          variant="body-sm"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-6"
        >
          در صورتی که خودتان صاحب کسب و کار هستید، می‌بایست شماره موبایلی که آن را وارد می‌کنید
          با نام شما تطابق داشته باشد؛ در غیر این صورت در بخش‌های بعدی اطلاعات فردی که شماره
          موبایل و کد ملی یکسانی دارد را وارد کنید.
        </Typography>
      </div>

      <div className="mt-6 grid gap-4 text-right">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              نام
            </label>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              نام خانوادگی
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            کد ملی
          </label>
          <input
            type="text"
            value={form.nationalId}
            onChange={(e) => handleChange("nationalId", e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            تاریخ تولد
          </label>
          <div className="relative">
            <input
              type="text"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              placeholder="مثلاً ۱۳۷۵/۰۲/۱۵"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 pr-12 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            <Calendar
              className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--md-sys-color-primary)]"
              aria-hidden
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            شماره موبایل
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button variant="secondary" className="min-w-[140px]" onClick={onBack}>
          مرحله قبل
        </Button>
        <Button className="min-w-[140px]" onClick={handleSubmit}>
          ثبت و ادامه
        </Button>
      </div>
    </section>
  );
}
