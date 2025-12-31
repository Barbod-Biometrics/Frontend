"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import provincesAndCities from "../../data/iran-provinces-cities.json";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { AccountKind, LocationPayload } from "../../types/businessProfile";
import { normalizeNumericInput, toPersianDigits } from "../../lib/numberFormat";

interface LocationInfoProps {
  onContinue?: (data: LocationForm) => void;
  onBack?: () => void;
  initialData?: LocationPayload;
  isLoading?: boolean;
  accountType?: AccountKind;
}

type LocationForm = LocationPayload;
const REQUIRED_FIELD_ERROR = "پر کردن این فیلد الزامی است";

const provinceCityMap = provincesAndCities as Record<string, string[]>;
const provinceOptions = Object.keys(provinceCityMap);

export function LocationInfo({
  onContinue,
  onBack,
  initialData,
  isLoading,
  accountType = "legal",
}: LocationInfoProps) {
  const [form, setForm] = useState<LocationForm>({
    address: "",
    province: "",
    city: "",
    fixedPhone: "",
    postalCode: "",
    plateNumber: "",
    unit: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LocationForm, string>>>({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const cityOptions = form.province ? provinceCityMap[form.province] ?? [] : [];

  const clearError = (key: keyof LocationForm, value: string) => {
    setErrors((prev) => {
      if (!prev[key] || !value.trim()) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleChange = (key: keyof LocationForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearError(key, value);
  };

  const handleProvinceChange = (value: string) => {
    setForm((prev) => ({ ...prev, province: value, city: "" }));
    clearError("province", value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed: LocationForm = {
      address: form.address.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      fixedPhone: form.fixedPhone.trim(),
      postalCode: form.postalCode.trim(),
      plateNumber: form.plateNumber.trim(),
      unit: form.unit.trim(),
    };

    const nextErrors: Partial<Record<keyof LocationForm, string>> = {};
    (Object.keys(trimmed) as Array<keyof LocationForm>).forEach((key) => {
      if (!trimmed[key]) {
        nextErrors[key] = REQUIRED_FIELD_ERROR;
      }
    });

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setForm(trimmed);
    onContinue?.(trimmed);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="space-y-2 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)] font-black">
          اطلاعات مکانی
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          لطفا آدرس و کد پستی و سایر جزئیات محل فعالیت را وارد کنید.
        </Typography>
      </div>

      <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
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
            {errors.province && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.province}
              </p>
            )}
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
            {errors.city && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.city}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 text-right">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            آدرس
          </label>
          <input
            dir="rtl"
            type="text"
            value={form.address}
            onChange={(event) => handleChange("address", event.target.value)}
            placeholder="مثال: تهران، خیابان ..."
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
          {errors.address && (
            <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
              {errors.address}
            </p>
          )}
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              تلفن ثابت
            </label>
            <input
              dir="ltr"
              type="tel"
              value={toPersianDigits(form.fixedPhone)}
              onChange={(event) =>
                handleChange("fixedPhone", normalizeNumericInput(event.target.value))
              }
              placeholder="01312345678"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            {errors.fixedPhone && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.fixedPhone}
              </p>
            )}
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              کد پستی
            </label>
            <input
              dir="ltr"
              inputMode="numeric"
              maxLength={10}
              value={toPersianDigits(form.postalCode)}
              onChange={(event) =>
                handleChange("postalCode", normalizeNumericInput(event.target.value, 10))
              }
              placeholder="0133456789"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
          <Typography variant="caption" className="text-[color:var(--md-sys-color-on-surface-variant)]">
            کد پستی باید ۱۰ رقم و بدون خط تیره وارد شود.
          </Typography>
          {errors.postalCode && (
            <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
              {errors.postalCode}
            </p>
          )}
        </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              پلاک
            </label>
            <input
              dir="ltr"
              type="text"
              value={toPersianDigits(form.plateNumber)}
              onChange={(event) =>
                handleChange("plateNumber", normalizeNumericInput(event.target.value))
              }
              placeholder="12"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            {errors.plateNumber && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.plateNumber}
              </p>
            )}
          </div>

          <div className="space-y-2 text-right">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              واحد
            </label>
            <input
              dir="ltr"
              inputMode="numeric"
              value={toPersianDigits(form.unit)}
              onChange={(event) => handleChange("unit", normalizeNumericInput(event.target.value))}
              placeholder="4"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            {errors.unit && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.unit}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-row-reverse items-center justify-between gap-4">
          <Button type="submit" className="min-w-[140px]" disabled={isLoading}>
            ذخیره
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="min-w-[140px]"
            disabled={isLoading}
          >
            بازگشت
          </Button>
        </div>
      </form>
    </section>
  );
}
