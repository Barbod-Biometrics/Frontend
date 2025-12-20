"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpLeft, ArrowUpRight } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { cn } from "../lib/utils";
import { Language } from "../types";
import { Button } from "./ui/Button";

const copy: Record<
  Language,
  {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  }
> = {
  [Language.EN]: {
    title: "Talk to our sales team",
    description:
      "For a tailored package for your business, connect with sales and we'll respond fast.",
    primaryCta: "Contact sales",
    secondaryCta: "Contact page",
  },
  [Language.FA]: {
    title: "تماس با تیم فروش",
    description: "برای ایجاد بسته اختصاصی کسب و کارتان با تیم فروش تماس بگیرید.",
    primaryCta: "تماس با تیم فروش",
    secondaryCta: "صفحه تماس با ما",
  },
};

export function SalesConnector() {
  const { language, dir } = useLanguage();
  const c = copy[language];
  const isFa = language === Language.FA;
  const ctaIcon =
    dir === "rtl" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-border/35 bg-card/60 shadow-[var(--elevation-2)] backdrop-blur-sm",
        isFa && "font-vazirmatn"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-50 [background:radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--md-sys-color-primary)_18%,transparent),transparent_45%),radial-gradient(circle_at_80%_30%,color-mix(in_srgb,var(--md-sys-color-tertiary)_16%,transparent),transparent_40%)]" />
      <div
        className={cn(
          "relative flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center lg:justify-between",
          isFa ? "text-right" : "text-left"
        )}
        dir={dir}
      >
        <div className="space-y-4 max-w-3xl">
          <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">{c.title}</h3>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {c.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/contact-sales" className="w-full sm:w-auto">
            <Button size="lg" className="w-full rounded-full px-10 sm:w-auto" iconTrailing={ctaIcon}>
              {c.primaryCta}
            </Button>
          </Link>
          <Link href="/contact-us" className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full px-8 sm:w-auto"
              iconTrailing={
                dir === "rtl" ? <ArrowUpLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />
              }
            >
              {c.secondaryCta}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
