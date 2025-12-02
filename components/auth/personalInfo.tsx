"use client";

import { useMemo, useState } from "react";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Calendar as DatePickerCalendar, DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

interface PersonalInfoProps {
  onContinue?: (data: PersonalInfoForm) => void;
  onBack?: () => void;
}

const BIRTHDATE_FORMAT = "YYYY/MM/DD";
const LATIN_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);

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

  const handleChange = (key: keyof PersonalInfoForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBirthDateSelect = (date: DateObject | DateObject[] | null) => {
    const nextDate = Array.isArray(date) ? date[0] : date;
    if (nextDate?.isValid) {
      const normalized = nextDate.set({ digits: LATIN_DIGITS }).format(BIRTHDATE_FORMAT);
      handleChange("birthDate", normalized);
    } else {
      handleChange("birthDate", "");
    }
    setIsDateDialogOpen(false);
  };

  const handleSubmit = () => {
    onContinue?.(form);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
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

      <div className="mt-6 space-y-3 rounded-3xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container)] px-5 py-5 shadow-[var(--elevation-1)]">
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
              <label
                key={option.id}
                className="inline-flex cursor-pointer items-center gap-2"
              >
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
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            کد ملی
          </label>
          <input
            dir="ltr"
            type="text"
            value={form.nationalId}
            onChange={(e) => handleChange("nationalId", e.target.value)}
            placeholder="0982342316"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            تاریخ تولد
          </label>
          <div className="relative">
            <input
              type="text"
              dir="ltr"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
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
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
            شماره موبایل
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="09904644661"
            className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
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
                className="font-vazirmatn"
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
