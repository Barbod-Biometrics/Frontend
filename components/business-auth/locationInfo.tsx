"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import provincesAndCities from "../../data/iran-provinces-cities.json";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { AccountKind, LocationPayload } from "../../types/businessProfile";

interface LocationInfoProps {
  onContinue?: (data: LocationForm) => void;
  onBack?: () => void;
  initialData?: LocationPayload;
  isLoading?: boolean;
  accountType?: AccountKind;
}

type LocationForm = LocationPayload;
const REQUIRED_FIELD_ERROR = "پر کردن این فیلد الزامی است";
const POSTAL_CODE_LENGTH = 10;
const POSTAL_CODE_LENGTH_ERROR = "کد پستی 10 رقمی است";

const normalizeDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1776))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/[^0-9]/g, "");

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
  const [errors, setErrors] = useState<
    Partial<Record<keyof LocationForm, string>>
  >({});
  const [isProvinceOpen, setIsProvinceOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [provinceQuery, setProvinceQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const provinceRef = useRef<HTMLDivElement | null>(null);
  const cityRef = useRef<HTMLDivElement | null>(null);
  const provinceSearchRef = useRef<HTMLInputElement | null>(null);
  const citySearchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    if (isProvinceOpen) {
      provinceSearchRef.current?.focus();
    }
  }, [isProvinceOpen]);

  useEffect(() => {
    if (isCityOpen) {
      citySearchRef.current?.focus();
    }
  }, [isCityOpen]);

  useEffect(() => {
    if (!form.province) {
      setIsCityOpen(false);
      setCityQuery("");
    }
  }, [form.province]);

  const cityOptions = form.province
    ? (provinceCityMap[form.province] ?? [])
    : [];
  const filteredProvinces = useMemo(() => {
    const query = provinceQuery.trim();
    if (!query) return provinceOptions;
    return provinceOptions.filter((province) => province.includes(query));
  }, [provinceQuery]);

  const filteredCities = useMemo(() => {
    const query = cityQuery.trim();
    if (!query) return cityOptions;
    return cityOptions.filter((city) => city.includes(query));
  }, [cityOptions, cityQuery]);

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

  const handleProvinceSelect = (value: string) => {
    handleProvinceChange(value);
    setIsProvinceOpen(false);
    setProvinceQuery("");
    setIsCityOpen(false);
    setCityQuery("");
  };

  const handleCitySelect = (value: string) => {
    handleChange("city", value);
    setIsCityOpen(false);
    setCityQuery("");
  };

  const handleProvinceBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!provinceRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsProvinceOpen(false);
      setProvinceQuery("");
    }
  };

  const handleCityBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!cityRef.current?.contains(event.relatedTarget as Node | null)) {
      setIsCityOpen(false);
      setCityQuery("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed: LocationForm = {
      address: form.address.trim(),
      province: form.province.trim(),
      city: form.city.trim(),
      fixedPhone: normalizeDigits(form.fixedPhone),
      postalCode: normalizeDigits(form.postalCode),
      plateNumber: normalizeDigits(form.plateNumber),
      unit: normalizeDigits(form.unit),
    };

    const nextErrors: Partial<Record<keyof LocationForm, string>> = {};
    (Object.keys(trimmed) as Array<keyof LocationForm>).forEach((key) => {
      if (!trimmed[key]) {
        nextErrors[key] = REQUIRED_FIELD_ERROR;
      }
    });

    if (
      !nextErrors.postalCode &&
      trimmed.postalCode &&
      !new RegExp(`^\\d{${POSTAL_CODE_LENGTH}}$`).test(trimmed.postalCode)
    ) {
      nextErrors.postalCode = POSTAL_CODE_LENGTH_ERROR;
    }

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
        <Typography
          variant="h5"
          className="text-[color:var(--md-sys-color-on-surface)] font-black"
        >
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
            <div
              className="relative"
              ref={provinceRef}
              onBlur={handleProvinceBlur}
            >
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isProvinceOpen}
                onClick={() => setIsProvinceOpen((prev) => !prev)}
                className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-10 py-3 text-right outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
              >
                <span
                  className={
                    form.province
                      ? "text-[color:var(--md-sys-color-on-surface)]"
                      : "text-[color:var(--md-sys-color-on-surface-variant)]"
                  }
                >
                  {form.province || "انتخاب استان"}
                </span>
              </button>
              <ChevronDown
                className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--md-sys-color-primary)] transition-transform ${
                  isProvinceOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
              {isProvinceOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-3)]">
                  <div className="px-3 pt-3">
                    <input
                      ref={provinceSearchRef}
                      dir="rtl"
                      type="search"
                      value={provinceQuery}
                      onChange={(event) => setProvinceQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.preventDefault();
                      }}
                      placeholder="جستجوی استان"
                      className="w-full rounded-xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container)] px-4 py-2 text-sm text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto py-2 dropdown-scrollbar">
                    {!provinceQuery && (
                      <button
                        type="button"
                        onClick={() => handleProvinceSelect("")}
                        className="w-full px-4 py-2 text-right text-sm text-[color:var(--md-sys-color-on-surface-variant)] transition hover:bg-[color:var(--md-sys-color-primary)]/10"
                      >
                        انتخاب استان
                      </button>
                    )}
                    {filteredProvinces.length > 0 ? (
                      filteredProvinces.map((province) => {
                        const isSelected = form.province === province;
                        return (
                          <button
                            key={province}
                            type="button"
                            onClick={() => handleProvinceSelect(province)}
                            className={
                              "w-full px-4 py-2 text-right text-sm transition " +
                              (isSelected
                                ? "bg-[color:var(--md-sys-color-primary)]/15 text-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-primary)]/20"
                                : "text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-primary)]/10")
                            }
                          >
                            {province}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-right text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                        موردی یافت نشد
                      </div>
                    )}
                  </div>
                </div>
              )}
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
            <div className="relative" ref={cityRef} onBlur={handleCityBlur}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isCityOpen}
                disabled={!form.province}
                onClick={() => setIsCityOpen((prev) => !prev)}
                className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-10 py-3 text-right outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30 disabled:cursor-not-allowed disabled:bg-[color:var(--md-sys-color-surface-variant)]"
              >
                <span
                  className={
                    form.city
                      ? "text-[color:var(--md-sys-color-on-surface)]"
                      : "text-[color:var(--md-sys-color-on-surface-variant)]"
                  }
                >
                  {form.city ||
                    (form.province
                      ? "انتخاب شهر"
                      : "ابتدا استان را انتخاب کنید")}
                </span>
              </button>
              <ChevronDown
                className={`pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[color:var(--md-sys-color-primary)] transition-transform ${
                  isCityOpen ? "rotate-180" : ""
                }`}
                aria-hidden
              />
              {isCityOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-3)]">
                  <div className="px-3 pt-3">
                    <input
                      ref={citySearchRef}
                      dir="rtl"
                      type="search"
                      value={cityQuery}
                      onChange={(event) => setCityQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") event.preventDefault();
                      }}
                      placeholder="جستجوی شهر"
                      className="w-full rounded-xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container)] px-4 py-2 text-sm text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto py-2 dropdown-scrollbar">
                    {!cityQuery && (
                      <button
                        type="button"
                        onClick={() => handleCitySelect("")}
                        className="w-full px-4 py-2 text-right text-sm text-[color:var(--md-sys-color-on-surface-variant)] transition hover:bg-[color:var(--md-sys-color-primary)]/10"
                      >
                        انتخاب شهر
                      </button>
                    )}
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => {
                        const isSelected = form.city === city;
                        return (
                          <button
                            key={city}
                            type="button"
                            onClick={() => handleCitySelect(city)}
                            className={
                              "w-full px-4 py-2 text-right text-sm transition " +
                              (isSelected
                                ? "bg-[color:var(--md-sys-color-primary)]/15 text-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-primary)]/20"
                                : "text-[color:var(--md-sys-color-on-surface)] hover:bg-[color:var(--md-sys-color-primary)]/10")
                            }
                          >
                            {city}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-right text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                        موردی یافت نشد
                      </div>
                    )}
                  </div>
                </div>
              )}
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
              value={form.fixedPhone}
              onChange={(event) =>
                handleChange("fixedPhone", normalizeDigits(event.target.value))
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
              value={form.postalCode}
              onChange={(event) =>
                handleChange("postalCode", normalizeDigits(event.target.value))
              }
              placeholder="0133456789"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            <Typography
              variant="caption"
              className="text-[color:var(--md-sys-color-on-surface-variant)]"
            >
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
              value={form.plateNumber}
              onChange={(event) =>
                handleChange("plateNumber", normalizeDigits(event.target.value))
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
              value={form.unit}
              onChange={(event) =>
                handleChange("unit", normalizeDigits(event.target.value))
              }
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
