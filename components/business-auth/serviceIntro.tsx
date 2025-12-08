"use client";

import React from "react";
import { ReactNode, useEffect, useState } from "react";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";

import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  badge?: string;
};

const services: ServiceCard[] = [
  {
    id: "face-recognition",
    title: "تشخیص چهره",
    description:
      "فناوری تشخیص چهره ما، با تحلیل دقیق ویژگی‌های صورت از طریق هوش مصنوعی، هویت کاربران را در چند ثانیه تأیید می‌کند. این سرویس با دقت بالا و زمان کوتاه، تجربه‌ای مطمئن برای کاربران و کسب‌وکار فراهم می‌نماید.",
    icon: <FaceScanIcon />,
  },
  {
    id: "liveness-detection",
    title: "تشخیص چهره زنده",
    description:
      "به منظور جلوگیری از جعل هویت با استفاده از عکس یا ویدیو، این سرویس حضور واقعی کاربر را با تحلیل حرکات، عمق تصویر و واکنش‌های زنده تشخیص می‌دهد. امنیت احراز هویت را به سطح ۳ بعدی می‌برد.",
    icon: <LivenessIcon />,
  },
  {
    id: "smart-ocr",
    title: "تشخیص هوشمند مدارک (OCR)",
    description:
      "این سرویس با استفاده از الگوریتم‌های هوش مصنوعی، اطلاعات موجود در کارت ملی را به‌صورت خودکار شناسایی و به داده‌های دیجیتال تبدیل می‌کند. این سرویس دقت بالا، پشتیبانی از چند زبان و سرعت پردازش آنی را در اختیار کسب‌وکارها قرار می‌دهد.",
    icon: <OcrIcon />,
    badge: "OCR",
  },
];

interface ServiceIntroProps {
  onBack?: () => void;
  onContinue?: (serviceId: string) => void;
  initialServiceId?: string;
  isLoading?: boolean;
}

export function ServiceIntro({ onBack, onContinue, initialServiceId, isLoading }: ServiceIntroProps) {
  const [activeId, setActiveId] = useState<string>(initialServiceId ?? services[0]?.id ?? "");

  useEffect(() => {
    if (initialServiceId) {
      setActiveId(initialServiceId);
    }
  }, [initialServiceId]);

  const handleContinue = () => {
    onContinue?.(activeId);
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-6 py-8 shadow-[var(--elevation-2)] sm:px-10 sm:py-10"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.08),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(37,99,235,0.08),transparent_30%)]" />

      <div className="relative space-y-3 text-right">
        <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
          معرفی سرویس ها
        </Typography>
        <Typography
          variant="body-sm"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
        >
          سرویس‌های امنیتی و هوشمند ما برای احراز هویت سریع، دقیق و مشتری‌پسند طراحی شده‌اند.
        </Typography>
      </div>

      <div className="relative mt-6 space-y-4">
        {services.map((service) => {
          const isActive = service.id === activeId;

          return (
            <article
              key={service.id}
              onClick={() => setActiveId(service.id)}
              className={clsx(
                "group relative overflow-hidden rounded-[24px] border bg-[color:var(--md-sys-color-surface)] px-4 py-4 text-right transition-all duration-200 sm:px-5 sm:py-5",
                "cursor-pointer",
                isActive
                  ? "border-[color:var(--md-sys-color-primary)] shadow-[0_14px_32px_rgba(37,99,235,0.18)] ring-2 ring-[color:var(--md-sys-color-primary)]/10"
                  : "border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--elevation-1)] hover:-translate-y-0.5 hover:border-[color:var(--md-sys-color-primary)]/60 hover:shadow-[0_12px_26px_rgba(37,99,235,0.12)]",
              )}
              aria-pressed={isActive}
            >
              <div className="absolute inset-x-6 -top-10 h-20 rounded-full bg-[radial-gradient(circle_at_50%_100%,rgba(37,99,235,0.12),transparent)] blur-xl" />

              <div className="relative flex items-start gap-3">
                {service.id === "smart-ocr" ? (
                  <OcrBadge />
                ) : (
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary)]/10 text-[color:var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(37,99,235,0.16)]">
                    {service.icon}
                  </span>
                )}

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Typography
                        variant="body-lg"
                        className={clsx(
                          "text-[color:var(--md-sys-color-on-surface)] font-semibold",
                          isActive && "text-[color:var(--md-sys-color-primary)]",
                        )}
                      >
                        {service.title}
                      </Typography>
                    </div>
                    <button
                      type="button"
                      aria-label={`انتخاب ${service.title}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveId(service.id);
                      }}
                      className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface)] transition hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/40"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden />
                    </button>
                  </div>

                  <Typography
                    variant="body-md"
                    className="text-[color:var(--md-sys-color-on-surface)] leading-8"
                  >
                    {service.description}
                  </Typography>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="relative mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="secondary"
          className="min-w-[140px]"
          onClick={onBack}
          disabled={isLoading}
        >
          مرحله قبل
        </Button>
        <Button
          className="min-w-[140px]"
          onClick={handleContinue}
          disabled={isLoading}
        >
          ادامه
        </Button>
      </div>
    </section>
  );
}

function FaceScanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="5" height="5" rx="1.5" />
      <rect x="3" y="16" width="5" height="5" rx="1.5" />
      <rect x="16" y="3" width="5" height="5" rx="1.5" />
      <rect x="16" y="16" width="5" height="5" rx="1.5" />
      <circle cx="12" cy="11" r="3.2" />
      <path d="M8.5 17.5c1.2-1 2.4-1.5 3.5-1.5s2.3.5 3.5 1.5" strokeLinecap="round" />
    </svg>
  );
}

function LivenessIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="10" r="3" />
      <path d="M7.5 19c1.5-1.8 3-2.7 4.5-2.7S15.9 17.2 17 19" strokeLinecap="round" />
      <path d="M4 7.5c1.4-2.2 3.9-3.5 8-3.5s6.6 1.3 8 3.5" strokeLinecap="round" />
      <path d="M4 12.5c.5 1 1.3 1.8 2.3 2.4" strokeLinecap="round" />
      <path d="M20 12.5c-.5 1-1.3 1.8-2.3 2.4" strokeLinecap="round" />
    </svg>
  );
}

function OcrIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9.5h3.5m-3.5 3h3.5" strokeLinecap="round" />
      <path d="M13.5 9.5H16c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5h-1" strokeLinecap="round" />
      <path d="M9 17h6" strokeLinecap="round" />
    </svg>
  );
}

function OcrBadge() {
  return (
    <button
      type="button"
      aria-label="OCR badge"
      className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-primary)]/12 text-[color:var(--md-sys-color-primary)] shadow-[0_8px_20px_rgba(37,99,235,0.16)]"
    >
      <svg viewBox="0 0 24 32" className="h-8 w-7" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2.5" y="2.5" width="19" height="27" rx="3" />
        <path d="M7 9.5h10M7 13h10M7" strokeLinecap="round" />
        <text
          x="12.5"
          y="24.2"
          textAnchor="middle"
          fontSize="8"
          fontWeight="700"
          fill="currentColor"
          stroke="none"
          fontFamily="Arial, sans-serif"
        >
          OCR
        </text>
      </svg>
    </button>
  );
}
