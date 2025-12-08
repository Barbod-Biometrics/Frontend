"use client";

import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { Building2, IdCard } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { AccountKind } from "../../types/businessProfile";

type AccountTypeOption = {
  id: AccountKind;
  title: string;
  description: string;
  icon: ReactNode;
};

const accountTypeOptions: AccountTypeOption[] = [
  {
    id: "legal",
    title: "شخص حقوقی",
    description:
      "منظور از شخص حقوقی مؤسساتی هستند که به ثبت حقوقی رسیده و دارای مشخصاتی مانند تاریخ ثبت، شماره ثبت، کد اقتصادی و ... باشند.",
    icon: <Building2 className="h-10 w-10 text-[color:var(--md-sys-color-primary)]" aria-hidden />,
  },
  {
    id: "real",
    title: "شخص حقیقی",
    description:
      "منظور از شخص حقیقی فردی است که دارای خصوصیات مختص به خود مانند نام، نام خانوادگی، شماره شناسنامه، کد ملی و ... می‌باشد.",
    icon: <IdCard className="h-10 w-10 text-[color:var(--md-sys-color-primary)]" aria-hidden />,
  },
];

interface AccountTypeProps {
  onContinue?: (selectedType: AccountKind, accountName: string) => void;
  onBack?: () => void;
  initialType?: AccountKind;
  initialName?: string;
  isLoading?: boolean;
  onTypeChange?: (type: AccountKind) => void;
}

export function AccountType({
  onContinue,
  onBack,
  initialType,
  initialName,
  isLoading,
  onTypeChange,
}: AccountTypeProps) {
  const [selectedType, setSelectedType] = useState<AccountKind>(initialType ?? "legal");
  const [accountName, setAccountName] = useState(initialName ?? "");
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (typeof initialName === "string") {
      setAccountName(initialName);
    }
  }, [initialName]);

  useEffect(() => {
    onTypeChange?.(selectedType);
  }, [selectedType, onTypeChange]);

  const handleContinue = () => {
    const trimmedName = accountName.trim();
    if (!trimmedName) {
      setNameError("وارد کردن نام کسب‌وکار الزامی است.");
      return;
    }
    setNameError(null);
    onContinue?.(selectedType, trimmedName);
  };

  const handleSelectType = (type: AccountKind) => {
    setSelectedType(type);
    onTypeChange?.(type);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="space-y-2 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
          اطلاعات حساب
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          لطفا برای فعال‌سازی سرویس احراز هویت، نوع حساب خود را مشخص کنید.
        </Typography>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {accountTypeOptions.map((option) => {
          const isSelected = option.id === selectedType;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectType(option.id)}
              className={clsx(
                "group flex h-full flex-col items-start gap-3 rounded-3xl border bg-[color:var(--md-sys-color-surface-container)] p-5 text-right text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] transition-all duration-200",
                isSelected
                  ? "border-[color:var(--md-sys-color-primary)] shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
                  : "border-[color:var(--md-sys-color-outline)] hover:-translate-y-1 hover:shadow-[var(--elevation-2)]",
              )}
              aria-pressed={isSelected}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={clsx(
                    "inline-flex items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary)]/10 p-3 text-[color:var(--md-sys-color-primary)] transition-colors",
                    isSelected && "bg-[color:var(--md-sys-color-primary)]/15",
                  )}
                >
                  {option.icon}
                </span>
                <div
                  className={clsx(
                    "h-5 w-5 rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary)]"
                      : "border-[color:var(--md-sys-color-outline)] bg-transparent",
                  )}
                  aria-hidden
                />
              </div>

              <div className="space-y-2">
                <Typography
                  variant="body-lg"
                  className={clsx(
                    "text-[color:var(--md-sys-color-on-surface)] font-semibold",
                    isSelected && "text-[color:var(--md-sys-color-primary)]",
                  )}
                >
                  {option.title}
                </Typography>
                <Typography
                  variant="body-sm"
                  className="text-[color:var(--md-sys-color-on-surface-variant)] leading-6"
                >
                  {option.description}
                </Typography>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-10 space-y-0.5 text-right">
        <label
          htmlFor="account-name"
          className="block text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]"
        >
          نام حساب
        </label>
        <input
          id="account-name"
          type="text"
          value={accountName}
          onChange={(event) => {
            const value = event.target.value;
            setAccountName(value);
            if (nameError && value.trim()) {
              setNameError(null);
            }
          }}
          placeholder="مثلاً حساب شخصی"
          className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] pr-5 pl-5 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
        />
        {nameError && (
          <p className="text-right text-sm text-[color:var(--md-sys-color-error)]">{nameError}</p>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="min-w-[140px]"
          disabled={isLoading}
        >
          مرحله قبل
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="min-w-[140px]"
          disabled={isLoading}
        >
          ادامه
        </Button>
      </div>
    </section>
  );
}
