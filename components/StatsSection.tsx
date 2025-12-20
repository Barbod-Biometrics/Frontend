"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, ScanFace, ShieldCheck, Zap } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { cn } from "../lib/utils";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { Typography } from "./ui/Typography";

type StatItem = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const headingCopy: Record<Language, { badge: string; title: string; subtitle: string }> = {
  [Language.EN]: {
    badge: "Key reliability metrics",
    title: "Why teams trust Barbod",
    subtitle:
      "Barbod’s identity stack is tuned for speed, security, and observability so you ship dependable onboarding at any scale.",
  },
  [Language.FA]: {
    badge: "شاخص‌های کلیدی",
    title: "چرا تیم‌ها به باربد اعتماد می‌کنند",
    subtitle:
      "زیرساخت احراز هویت باربد برای سرعت، امنیت و مشاهده‌پذیری طراحی شده است تا در هر مقیاسی نتایج دقیق ارائه دهد.",
  },
};

const statsData: Record<Language, StatItem[]> = {
  [Language.EN]: [
    {
      title: "Security & privacy",
      description:
        "All data is processed and stored with strong encryption and in line with international security standards. No unauthorized access to sensitive information is possible.",
      icon: ShieldCheck,
    },
    {
      title: "Speed & accuracy",
      description:
        "With advanced AI algorithms, verification completes in under 5 seconds. Face recognition accuracy is over 98% and the verification error rate is below 1%.",
      icon: Zap,
    },
    {
      title: "Spoofing protection",
      description:
        "Advanced liveness checks prevent the use of spoofed images or videos. Our system reliably distinguishes real faces from fabricated content.",
      icon: ScanFace,
    },
    {
      title: "Integration & scalability",
      description:
        "Our SDKs integrate easily with banking, financial, and government systems. The platform is designed to process millions of requests at any moment.",
      icon: Globe,
    },
  ],
  [Language.FA]: [
    {
      title: "امنیت و حریم خصوصی",
      description:
        "تمامی داده‌ها با رمزنگاری پیشرفته و مطابق با استانداردهای امنیتی بین‌المللی پردازش و ذخیره می‌شوند. هیچ‌گونه دسترسی بدون مجوز به اطلاعات حساس امکان‌پذیر نیست.",
      icon: ShieldCheck,
    },
    {
      title: "سرعت و دقت",
      description:
        "با استفاده از الگوریتم‌های هوش مصنوعی پیشرفته، احراز هویت در کمتر از ۵ ثانیه انجام می‌شود. دقت تشخیص چهره بیش از ۹۸٪ و خطای تأیید کمتر از ۱٪ است.",
      icon: Zap,
    },
    {
      title: "حفاظت در برابر جعل چهره",
      description:
        "با فناوری پیشرفته تشخیص چهره زنده، از استفاده از تصاویر یا ویدیوهای جعلی جلوگیری می‌شود. سیستم ما تفاوت چهره واقعی و تصاویر ساختگی را با دقت بالا شناسایی می‌کند.",
      icon: ScanFace,
    },
    {
      title: "یکپارچگی و مقیاس‌پذیری",
      description:
        "رابط‌ها و بسته‌های توسعه ما به‌سادگی با سامانه‌های بانکی، مالی و دولتی ادغام می‌شوند. پلتفرم به‌گونه‌ای طراحی شده است که توان پردازش میلیون‌ها درخواست در هر لحظه را دارد.",
      icon: Globe,
    },
  ],
};

export function StatsSection() {
  const { language, dir } = useLanguage();
  const stats = statsData[language];
  const isRtl = dir === "rtl";
  const copy = headingCopy[language];

  return (
    <Section spacing="md" dir={dir}>
      <Container className="relative space-y-10">
        <div className="pointer-events-none absolute inset-0 opacity-60 blur-3xl [background:radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.14),transparent_45%)]" />

        <div className={cn("relative max-w-4xl space-y-3", isRtl ? "text-right" : "text-left")}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--md-sys-color-on-surface-variant)]">
            {copy.badge}
          </span>
          <Typography variant="h3" className="leading-tight">
            {copy.title}
          </Typography>
          <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8">
            {copy.subtitle}
          </Typography>
        </div>

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
                className="group relative h-full"
              >
                <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[color:var(--md-sys-color-primary)]/10 via-transparent to-[color:var(--md-sys-color-tertiary)]/12 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <Card className="relative h-full border border-[color:var(--md-sys-color-outline-variant)]/60 bg-card/70 shadow-[var(--elevation-2)] backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--elevation-3)]">
                  <CardHeader className="flex-row items-center gap-4 space-y-0 p-7 pb-2" dir={dir}>
                    <motion.span
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--md-sys-color-primary)] to-[color:var(--md-sys-color-tertiary)] text-white shadow-[var(--elevation-2)]"
                      whileHover={{ scale: 1.06, rotate: 2 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.span>

                    <div className={cn("flex-1 pt-1", isRtl ? "text-right" : "text-left")}>
                      <h3 className="text-xl font-semibold leading-tight text-foreground">{stat.title}</h3>
                    </div>
                  </CardHeader>

                  <CardContent className="p-7 pt-2">
                    <p
                      className={cn(
                        "text-base leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)] transition-colors duration-300 group-hover:text-foreground",
                        isRtl ? "text-right" : "text-left"
                      )}
                    >
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
