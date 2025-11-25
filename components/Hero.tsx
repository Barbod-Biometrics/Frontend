"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Typography } from "./ui/Typography";
import TopologicalFace from "./TopologicalFace";
import { Theme, Language } from "../types";

type HeroCopy = {
  badge: string;
  headingTop: string;
  headingHighlight: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: { value: string; label: string }[];
};

const heroCopy: Record<Language, HeroCopy> = {
  [Language.EN]: {
    badge: "Biometric verification without the overhead",
    headingTop: "Scale biometric onboarding",
    headingHighlight: "without operational drag",
    description:
      "Barbod unifies face match, liveness, document OCR, and voice biometrics in a single SDK. Design compliant user journeys, automate case reviews, and integrate with your core systems faster than stitching point solutions.",
    primaryCta: "Get started",
    secondaryCta: "Watch overview",
    stats: [
      { value: "1.6M+", label: "Daily checks" },
      { value: "<30s", label: "Verification time" },
      { value: "99.9%", label: "Uptime SLA" },
    ],
  },
  [Language.FA]: {
    badge: "بدون بار عملیاتی",
    headingTop: "مقیاس‌دهی آنبوردینگ بیومتریک",
    headingHighlight: "بدون بار عملیاتی",
    description:
      "باربود تشخیص چهره، تست زنده‌بودن، OCR اسناد و بیومتریک صوتی را در یک SDK واحد یکپارچه می‌کند. سفرهای کاربری مطابق مقررات بسازید، بررسی پرونده‌ها را خودکار کنید و سریع‌تر از کنار هم چیدن ابزارهای جداگانه، آن را به سیستم‌های اصلی پیوند دهید.",
    primaryCta: "شروع سریع",
    secondaryCta: "مشاهده دمو",
    stats: [
      { value: "۱٫۶میلیون+", label: "چک روزانه" },
      { value: "<۳۰ثانیه", label: "زمان احراز هویت" },
      { value: "۹۹٫۹٪", label: "دقت شناسایی" },
    ],
  },
};

interface HeroProps {
  language: Language;
  theme: Theme;
  dir?: "rtl" | "ltr";
}

export function Hero({ language, theme, dir }: HeroProps) {
  const contentDir = dir ?? (language === Language.FA ? "rtl" : "ltr");
  const copy = heroCopy[language];
  const isFa = language === Language.FA;

  return (
    <Section
      spacing="xl"
      className={`${isFa ? "font-vazirmatn" : ""}`}
      dir={contentDir}
    >
      <Container className="flex flex-col items-center text-center overflow-visible relative z-10">
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <div className="w-[220%] max-w-none h-[1100px] md:h-[1400px] opacity-85">
            <TopologicalFace theme={theme} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative space-y-10 flex flex-col items-center"
        >
          <div className="animate-float inline-flex items-center gap-3 rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] px-5 py-2.5 text-sm font-medium text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)] backdrop-blur-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--md-sys-color-primary)] animate-pulse-slow" />
            {copy.badge}
          </div>

          <Typography variant="h1" component="h1">
            <span className="block mb-4">{copy.headingTop}</span>
            <span className="text-brand-gradient">{copy.headingHighlight}</span>
          </Typography>

          <Typography variant="body-lg" className="max-w-3xl text-center opacity-90">
            {copy.description}
          </Typography>

          <div className="flex flex-col sm:flex-row sm:justify-center gap-6 pt-8">
            <Button size="lg" className="h-16 px-16 text-lg rounded-full shadow-[var(--elevation-2)] hover:shadow-[var(--elevation-3)] transition-all hover:-translate-y-1 min-w-[180px]">
              {copy.primaryCta}
            </Button>
            <Button variant="secondary" size="lg" className="h-16 px-16 text-lg rounded-full transition-all min-w-[180px]">
              {copy.secondaryCta}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-12 pt-12 w-full max-w-5xl border-t border-[color:var(--md-sys-color-outline-variant)]/50">
            {copy.stats.map((stat) => (
              <div key={stat.label} className="text-center group cursor-default">
                <div className="mb-2 text-4xl sm:text-5xl font-bold text-[color:var(--md-sys-color-on-surface)] tracking-tight transition-colors group-hover:text-[color:var(--md-sys-color-primary)]">{stat.value}</div>
                <div className="text-sm sm:text-base font-medium text-[color:var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
