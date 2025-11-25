"use client";

import Link from "next/link";
import { Phone } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Typography } from "./ui/Typography";
import { Button } from "./ui/Button";

const ctaCopy: Record<Language, { title: string; salesText: string; salesBtn: string }> = {
  [Language.EN]: {
    title: "Use Barbod services",
    salesText: "Talk to our team to create a tailored package for your business.",
    salesBtn: "Contact sales",
  },
  [Language.FA]: {
    title: "استفاده از سرویس‌های باربد",
    salesText: "برای ایجاد بسته اختصاصی کسب‌وکار خود با تیم فروش ما تماس بگیرید.",
    salesBtn: "تماس با تیم فروش",
  },
};

export function CTASection() {
  const { language, dir } = useLanguage();
  const copy = ctaCopy[language];

  return (
    <Section dir={dir}>
      <Container>
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.08),transparent_32%)] blur-3xl" />
          <div className="animate-float relative overflow-hidden rounded-[var(--radius-xl)] bg-[color:var(--md-sys-color-primary-container)] p-12 md:p-16 shadow-[var(--elevation-3)] flex justify-start">
            <div className="flex w-full max-w-2xl flex-col gap-6 items-start text-start">
              <Typography variant="h2" className="text-[color:var(--md-sys-color-on-primary-container)]">
                {copy.title}
              </Typography>
              <Typography variant="body-lg" className="max-w-xl text-[color:var(--md-sys-color-on-primary-container)]/80">
                {copy.salesText}
              </Typography>
              <Link href="/contact-us">
                <Button
                  size="lg"
                  className="bg-[color:var(--md-sys-color-on-primary-container)] text-[color:var(--md-sys-color-primary-container)] hover:bg-[color:var(--md-sys-color-on-primary-container)]/90 hover:shadow-[var(--elevation-2)] h-14 px-10"
                  iconLeading={<Phone className="h-5 w-5" />}
                >
                  {copy.salesBtn}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
