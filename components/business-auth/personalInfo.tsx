"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import {
  Calendar as DatePickerCalendar,
  DateObject,
} from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { AccountKind, PersonalInfoPayload } from "../../types/businessProfile";
import {
  normalizeDateInput,
  normalizeNumericInput,
  toPersianDigits,
} from "../../lib/numberFormat";

interface PersonalInfoProps {
  onContinue?: (data: PersonalInfoPayload) => void;
  onBack?: () => void;
  initialData?: PersonalInfoPayload;
  isLoading?: boolean;
  accountType?: AccountKind;
}

const BIRTHDATE_FORMAT = "YYYY-MM-DD";
const LATIN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type PersonalInfoForm = PersonalInfoPayload;
const REQUIRED_FIELD_ERROR = "پر کردن این فیلد الزامی است";

export function PersonalInfo({
  onContinue,
  onBack,
  initialData,
  isLoading,
  accountType = "legal",
}: PersonalInfoProps) {
  const [form, setForm] = useState<PersonalInfoForm>({
    firstName: "",
    lastName: "",
    nationalId: "",
    birthDate: "",
    phone: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonalInfoForm, string>>
  >({});

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    }
  }, [initialData]);

  const parsedBirthDate = useMemo(() => {
    if (!form.birthDate) return null;
    try {
      const date = new DateObject({
        date: form.birthDate,
        calendar: persian,
        locale: persian_fa,
        format: BIRTHDATE_FORMAT,
      }).setDigits(LATIN_DIGITS);
      return date.isValid ? date : null;
    } catch {
      return null;
    }
  }, [form.birthDate]);

  const clearError = (key: keyof PersonalInfoForm, value: string) => {
    setErrors((prev) => {
      if (!prev[key] || !value.trim()) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleChange = (key: keyof PersonalInfoForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearError(key, value);
  };

  const handleBirthDateSelect = (date: DateObject | DateObject[] | null) => {
    const nextDate = Array.isArray(date) ? date[0] : date;
    if (nextDate?.isValid) {
      const normalized = nextDate
        .set({ digits: LATIN_DIGITS })
        .format(BIRTHDATE_FORMAT);
      handleChange("birthDate", normalized);
    } else {
      handleChange("birthDate", "");
    }
    setIsDateDialogOpen(false);
  };

  const handleSubmit = () => {
    const trimmed: PersonalInfoForm = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      nationalId: form.nationalId.trim(),
      birthDate: form.birthDate.trim(),
      phone: form.phone.trim(),
    };

    const nextErrors: Partial<Record<keyof PersonalInfoForm, string>> = {};
    (Object.keys(trimmed) as Array<keyof PersonalInfoForm>).forEach((key) => {
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
        <Typography
          variant="h5"
          className="text-[color:var(--md-sys-color-on-surface)]"
        >
          {accountType === "legal" ? "اطلاعات نماینده" : "اطلاعات شخصی"}
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          در ادامه اطلاعات شخصی خود را وارد کنید.
        </Typography>
      </div>

      <div className="mt-6 grid gap-5 text-right">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              نام
            </label>
            <input
              dir="rtl"
              type="text"
              value={form.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              placeholder="امین"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            {errors.firstName && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
              نام خانوادگی
            </label>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              placeholder="خلج"
              className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            {errors.lastName && (
              <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            کد ملی
          </label>
          <input
            dir="ltr"
            type="text"
            value={toPersianDigits(form.nationalId)}
            onChange={(e) =>
              handleChange(
                "nationalId",
                normalizeNumericInput(e.target.value, 10),
              )
            }
            placeholder="0982342316"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
          {errors.nationalId && (
            <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
              {errors.nationalId}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            تاریخ تولد
          </label>
          <div className="relative">
            <input
              type="text"
              dir="ltr"
              value={toPersianDigits(form.birthDate)}
              onChange={(e) =>
                handleChange("birthDate", normalizeDateInput(e.target.value))
              }
              inputMode="numeric"
              placeholder={BIRTHDATE_FORMAT}
              className="pl-14 pt-4 w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
            />
            <button
              type="button"
              onClick={() => setIsDateDialogOpen(true)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[color:var(--md-sys-color-primary)] transition hover:bg-[color:var(--md-sys-color-primary)]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/40"
              aria-label="?????? ????? ????"
            >
              <CalendarIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
          {errors.birthDate && (
            <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
              {errors.birthDate}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            شماره موبایل
          </label>
          <input
            type="tel"
            value={toPersianDigits(form.phone)}
            onChange={(e) =>
              handleChange("phone", normalizeNumericInput(e.target.value, 11))
            }
            placeholder="09904644661"
            dir="ltr"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
          {errors.phone && (
            <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button variant="secondary" className="min-w-[140px]" onClick={onBack}>
          مرحله قبل
        </Button>
        <Button
          className="min-w-[140px]"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          ثبت و ادامه
        </Button>
      </div>

      {isDateDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsDateDialogOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[24px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] p-5 shadow-[var(--elevation-2)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <Typography
                variant="body-lg"
                className="pr-45 items-center text-[color:var(--md-sys-color-on-surface)] font-semibold"
              >
                تقویم
              </Typography>
              <button
                type="button"
                onClick={() => setIsDateDialogOpen(false)}
                className="rounded-full p-2 text-[color:var(--md-sys-color-on-surface-variant)] transition hover:bg-[color:var(--md-sys-color-primary)]/10 hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50"
                aria-label="تفویم"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="flex justify-center">
              <DatePickerCalendar
                className="business-auth-date-picker font-vazirmatn"
                value={parsedBirthDate || undefined}
                onChange={handleBirthDateSelect}
                calendar={persian}
                locale={persian_fa}
                digits={LATIN_DIGITS}
                format={BIRTHDATE_FORMAT}
                highlightToday
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
