"use client";

import { FormEvent, useState } from "react";
import { ChevronDown } from "lucide-react";
import provincesAndCities from "../../data/iran-provinces-cities.json";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface LocationInfoProps {
  onContinue?: (data: LocationForm) => void;
  onBack?: () => void;
}

type LocationForm = {
  address: string;
  province: string;
  city: string;
  fixedNumber: string;
  postalCode: string;
  plateNumber: string;
  unit: string;
};

const provinceCityMap = provincesAndCities as Record<string, string[]>;
const provinceOptions = Object.keys(provinceCityMap);

export function LocationInfo({ onContinue, onBack }: LocationInfoProps) {
  const [form, setForm] = useState<LocationForm>({
    address: "",
    province: "",
    city: "",
    fixedNumber: "",
    postalCode: "",
    plateNumber: "",
    unit: "",
  });

  const cityOptions = form.province ? provinceCityMap[form.province] ?? [] : [];

  const handleChange = (key: keyof LocationForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleProvinceChange = (value: string) => {
    setForm((prev) => ({ ...prev, province: value, city: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onContinue?.(form);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="space-y-2 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)] font-black">
          اطلاعات موقعیت مکانی
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          لطفاً آدرس محل فعالیت کسب‌ و کار را دقیق وارد کنید تا بررسی مدارک بدون مشکل انجام شود.
        </Typography>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            آدرس
          </label>
          <input
            dir="rtl"
            type="text"
            value={form.address}
            onChange={(event) => handleChange("address", event.target.value)}
            placeholder="خیابان، کوچه، پلاک..."
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              استان
            </label>
            <div className="relative">
              <select
                value={form.province}
                onChange={(event) => handleProvinceChange(event.target.value)}
                className="w-full appearance-none rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
              >
                <option value="" className="text-right">
                  انتخاب استان
                </option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province} className="text-right">
                    {province}
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
              شهر
            </label>
            <div className="relative">
              <select
                value={form.city}
                onChange={(event) => handleChange("city", event.target.value)}
                disabled={!form.province}
                className="w-full appearance-none rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30 disabled:cursor-not-allowed disabled:bg-[color:var(--md-sys-color-surface-variant)] disabled:text-[color:var(--md-sys-color-on-surface-variant)]"
              >
                <option value="" className="text-right">
                  {form.province ? "انتخاب شهر" : "ابتدا استان را انتخاب کنید"}
                </option>
                {cityOptions.map((city) => (
                  <option key={city} value={city} className="text-right">
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--md-sys-color-primary)]"
                aria-hidden
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              شماره ثابت
            </label>
            <input
              dir="ltr"
              type="tel"
              value={form.fixedNumber}
              onChange={(event) => handleChange("fixedNumber", event.target.value)}
              placeholder="01312345678"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              کد پستی
            </label>
            <input
              dir="ltr"
              inputMode="numeric"
              maxLength={10}
              value={form.postalCode}
              onChange={(event) => handleChange("postalCode", event.target.value)}
              placeholder="0133456789"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            <Typography variant="caption" className="text-[color:var(--md-sys-color-on-surface-variant)]">
              کد پستی باید ۱۰ رقم و بدون فاصله باشد؛ از روی قبوض یا سامانه پست قابل دریافت است.
            </Typography>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              شماره پلاک
            </label>
            <input
              dir="ltr"
              type="text"
              value={form.plateNumber}
              onChange={(event) => handleChange("plateNumber", event.target.value)}
              placeholder="12"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              واحد
            </label>
            <input
              dir="ltr"
              inputMode="numeric"
              value={form.unit}
              onChange={(event) => handleChange("unit", event.target.value)}
              placeholder="4"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between gap-4">
          <Button
            type="submit"
            className="min-w-[140px]"
          >
            ادامه
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="min-w-[140px]"
          >
            بازگشت
          </Button>
        </div>
      </form>
    </section>
  );
}
