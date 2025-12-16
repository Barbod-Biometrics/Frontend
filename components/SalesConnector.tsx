"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
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
    button: "تماس با فروش",
  },
};

export function SalesConnector() {
  const { language, dir } = useLanguage();
  const c = copy[language];
  const isFa = language === Language.FA;
  const ctaIcon = dir === "rtl" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <section className="rounded-[24px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] shadow-[var(--shadow-lg)]">
      <div
        className={`grid items-center gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[1fr_1fr] ${isFa ? "text-right" : "text-left"}`}
        dir={dir}
      >
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
            {c.heading}
          </p>
          <h3 className="text-2xl font-semibold text-[color:var(--text-primary)]">{c.sales}</h3>
          <p className="text-[color:var(--text-secondary)]">{c.description}</p>
        </div>

        <div className={`flex ${isFa ? "justify-start" : "justify-end"}`}>
          <Link href="/contact-sales">
            <Button size="md" className="rounded-full" iconTrailing={ctaIcon}>
              {c.button}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
