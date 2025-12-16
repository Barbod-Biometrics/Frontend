"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { cn } from "../lib/utils";
import { Language } from "../types";
import { Button } from "./ui/Button";

const copy: Record<
  Language,
  {
    heading: string;
    description: string;
    sales: string;
    button: string;
  }
> = {
  [Language.EN]: {
    heading: "Use Barbod services",
    description: "For a tailored package for your business, talk to our sales team.",
    sales: "Contact sales team",
    button: "Contact sales",
  },
  [Language.FA]: {
    heading: "استفاده از سرویس‌های باربد",
    description: "برای ایجاد بسته اختصاصی کسب و کارتان با تیم فروش تماس بگیرید.",
    sales: "تماس با تیم فروش",
    button: "تماس با تیم فروش",
  },
};

export function SalesConnector() {
  const { language, dir } = useLanguage();
  const c = copy[language];
  const isFa = language === Language.FA;
  const ctaIcon = dir === "rtl" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-border/35 bg-card/60 shadow-[var(--elevation-2)] backdrop-blur-sm",
        isFa && "font-vazirmatn"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--md-sys-color-primary)_18%,transparent),transparent_45%),radial-gradient(circle_at_80%_30%,color-mix(in_srgb,var(--md-sys-color-tertiary)_16%,transparent),transparent_40%)]" />
      <div
        className={cn("relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between", isFa ? "text-right" : "text-left")}
        dir={dir}
      >
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {c.heading}
          </p>
          <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">{c.sales}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{c.description}</p>
        </div>

        <div className="flex w-full sm:w-auto">
          <Link href="/contact-sales" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full px-10 sm:w-auto" iconTrailing={ctaIcon}>
              {c.button}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
