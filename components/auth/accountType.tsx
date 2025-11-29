"use client";

import { ReactNode, useState } from "react";
import clsx from "clsx";
import { Building2, IdCard } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

type AccountKind = "business" | "personal";

type AccountTypeOption = {
  id: AccountKind;
  title: string;
  description: string;
  icon: ReactNode;
};

const accountTypeOptions: AccountTypeOption[] = [
  {
    id: "business",
    title: "شخص حقوقی",
    description:
      "منظور از شخص حقوقی مؤسساتی هستند که به ثبت حقوقی رسیده و دارای مشخصاتی مانند تاریخ ثبت، شماره ثبت، کد اقتصادی و ... باشند.",
    icon: <Building2 className="h-10 w-10 text-[color:var(--md-sys-color-primary)]" aria-hidden />,
  },
  {
    id: "personal",
    title: "شخص حقیقی",
    description:
      "منظور از شخص حقیقی فردی است که دارای خصوصیات مختص به خود مانند نام، نام خانوادگی، شماره شناسنامه، کد ملی و ... می‌باشد.",
    icon: <IdCard className="h-10 w-10 text-[color:var(--md-sys-color-primary)]" aria-hidden />,
  },
];

interface AccountTypeProps {
  onContinue?: (selectedType: AccountKind, accountName: string) => void;
}

export function AccountType({ onContinue }: AccountTypeProps) {
  const [selectedType, setSelectedType] = useState<AccountKind>("business");
  const [accountName, setAccountName] = useState("");

  const handleContinue = () => {
    onContinue?.(selectedType, accountName.trim());
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn w-full max-w-4xl rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
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
              onClick={() => setSelectedType(option.id)}
              className={clsx(
                "group flex h-full flex-col items-start gap-3 rounded-3xl border bg-[color:var(--md-sys-color-surface-container)] p-5 text-right text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] transition-all duration-200",
                isSelected
                  ? "border-[color:var(--md-sys-color-primary)] shadow-[0_12px_30px_rgba(37,99,235,0.22)]"
                  : "border-[color:var(--md-sys-color-outline-variant)] hover:-translate-y-1 hover:shadow-[var(--elevation-2)]",
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
                      : "border-[color:var(--md-sys-color-outline-variant)] bg-transparent",
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
          onChange={(event) => setAccountName(event.target.value)}
          placeholder="مثلاً حساب شخصی"
          className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-3 text-[color:var(--md-sys-color-on-surface)] placeholder:text-[color:var(--md-sys-color-on-surface-variant)] outline-none ring-2 ring-transparent transition focus:border-[color:var(--md-sys-color-primary)] focus:ring-[color:var(--md-sys-color-primary)]/30"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue} className="px-10">
          ادامه
        </Button>
      </div>
    </section>
  );
}
