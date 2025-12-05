"use client";

import { CheckCircle2, Info, Pencil, AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { AccountKind } from "../../types/businessProfile";

type SectionId = "personal" | "business" | "location" | "services";

interface InfoCheckingProps {
  accountType?: AccountKind;
  completedSections?: Partial<Record<SectionId, boolean>>;
  servicesRequestedCount?: number;
  onEditSection?: (section: SectionId) => void;
  onBack?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

const getSectionCopy = (accountType: AccountKind): Record<SectionId, string> => ({
  personal: accountType === "legal" ? "اطلاعات نماینده شرکت" : "اطلاعات شخصی",
  business: "اطلاعات کسب‌وکار",
  location: "آدرس و محل فعالیت",
  services: "خدمات درخواستی",
});

function StatusBadge({
  section,
  isComplete,
  servicesRequestedCount = 0,
}: {
  section: SectionId;
  isComplete: boolean;
  servicesRequestedCount?: number;
}) {
  const baseClasses =
    "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold bg-[color:var(--md-sys-color-surface-container)]";

  if (section === "services") {
    const hasService = servicesRequestedCount > 0;
    return (
      <div
        className={`${baseClasses} ${
          hasService
            ? "border-[color:var(--md-sys-color-primary)]/40 text-[color:var(--md-sys-color-primary)]"
            : "border-[color:var(--md-sys-color-primary)]/30 text-[color:var(--md-sys-color-primary)]"
        }`}
      >
        {hasService ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Info className="h-4 w-4" />
        )}
        <span>
          {hasService
            ? `تا اینجا ${servicesRequestedCount} خدمت انتخاب شده است. در صورت نیاز می‌توانید ویرایش کنید.`
            : "هنوز خدمتی انتخاب نشده است. لطفا یکی از خدمات را انتخاب و ثبت کنید."}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${
        isComplete
          ? "border-[color:var(--md-sys-color-primary)]/40 text-[color:var(--md-sys-color-primary)]"
          : "border-[color:var(--md-sys-color-error)]/60 text-[color:var(--md-sys-color-error)] bg-[color:var(--md-sys-color-error)]/08"
      }`}
    >
      {isComplete ? (
        <CheckCircle2 className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <span>
        {isComplete
          ? "این بخش کامل است و می‌توانید ادامه دهید."
          : "این بخش کامل نشده است. لطفا ویرایش کنید و اطلاعات را تکمیل کنید."}
      </span>
    </div>
  );
}

function SectionCard({
  id,
  copy,
  isComplete,
  servicesRequestedCount,
  onEdit,
}: {
  id: SectionId;
  copy: Record<SectionId, string>;
  isComplete: boolean;
  servicesRequestedCount?: number;
  onEdit?: (section: SectionId) => void;
}) {
  return (
    <article className="rounded-[22px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container)] px-4 py-4 shadow-[var(--elevation-1)] transition hover:-translate-y-0.5 hover:shadow-[var(--elevation-2)]">
      <div className="flex items-center justify-between">
        <Typography variant="body-lg" className="font-semibold text-[color:var(--md-sys-color-on-surface)]">
          {copy[id]}
        </Typography>
        <button
          type="button"
          onClick={() => onEdit?.(id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface-variant)] transition hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/40"
          aria-label={`ویرایش ${copy[id]}`}
        >
          <Pencil className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="mt-3">
        <StatusBadge
          section={id}
          isComplete={isComplete}
          servicesRequestedCount={servicesRequestedCount}
        />
      </div>
    </article>
  );
}

export function InfoChecking({
  accountType = "legal",
  completedSections,
  servicesRequestedCount = 0,
  onEditSection,
  onBack,
  onSubmit,
  isSubmitting,
}: InfoCheckingProps) {
  const sections: SectionId[] = ["personal", "business", "location", "services"];
  const sectionCopy = getSectionCopy(accountType);

  return (
    <section
      dir="rtl"
      className="font-vazirmatn relative w-full max-w-3xl overflow-hidden rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] px-7 py-8 shadow-[var(--elevation-2)] sm:px-9 sm:py-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_12%_18%,rgba(37,99,235,0.06),transparent_32%),radial-gradient(circle_at_88%_10%,rgba(37,99,235,0.06),transparent_32%)]" />
      <div className="relative space-y-6">
        <div className="text-right space-y-3">
          <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)] font-black">
            بررسی و تایید اطلاعات
          </Typography>
          <Typography
            variant="body-md"
            className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
          >
            لطفا پیش از ارسال، همه بخش‌ها را مرور کنید و در صورت نیاز ویرایش نمایید. پس از تایید، درخواست شما ثبت می‌شود.
          </Typography>
        </div>

        <div className="space-y-4">
          {sections.map((section) => (
            <SectionCard
              key={section}
              id={section}
              copy={sectionCopy}
              isComplete={Boolean(completedSections?.[section])}
              servicesRequestedCount={servicesRequestedCount}
              onEdit={onEditSection}
            />
          ))}
        </div>

        <div className="flex flex-col-reverse items-center justify-between gap-3 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="min-w-[140px]"
            onClick={onBack}
          >
            بازگشت
          </Button>
          <Button
            type="button"
            className="min-w-[140px]"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            تایید و ارسال
          </Button>
        </div>
      </div>
    </section>
  );
}
