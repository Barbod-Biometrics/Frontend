"use client";

import Link from "next/link";
import React from "react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { Typography } from "../../components/ui/Typography";
import { useLanguage } from "../../lib/useLanguage";
import { cn } from "../../lib/utils";
import { Language } from "../../types";

const DEMO_PAGE_COPY: Record<Language, { heading: string; description: string; cta: string }> = {
  [Language.EN]: {
    heading: "Service demos",
    description: "Choose a service to run a live demo with the backend.",
    cta: "Start demo",
  },
  [Language.FA]: {
    heading: "دموهای سرویس",
    description: "برای اجرای دموی زنده با بک اند، یک سرویس را انتخاب کنید.",
    cta: "شروع دمو",
  },
};

const DEMOS: Record<Language, { id: string; title: string; description: string; href: string }[]> = {
  [Language.EN]: [
    {
      id: "ocr",
      title: "OCR demo",
      description: "Upload a document image and confirm OCR extraction.",
      href: "/demo/ocr",
    },
    {
      id: "face",
      title: "Face recognition demo",
      description:
        "Capture a reference photo and a short selfie video for face verification.",
      href: "/demo/face-recognition",
    },
    {
      id: "liveness",
      title: "Liveness demo",
      description:
        "Record a short selfie video to verify liveness with an auto-captured still.",
      href: "/demo/liveness",
    },
  ],
  [Language.FA]: [
    {
      id: "ocr",
      title: "دموی OCR",
      description: "یک تصویر از مدرک بارگذاری کنید و استخراج OCR را تایید کنید.",
      href: "/demo/ocr",
    },
    {
      id: "face",
      title: "دموی تشخیص چهره",
      description:
        "یک عکس مرجع و یک ویدیوی سلفی کوتاه ثبت کنید تا تایید چهره انجام شود.",
      href: "/demo/face-recognition",
    },
    {
      id: "liveness",
      title: "دموی زنده بودن",
      description:
        "یک ویدیوی سلفی کوتاه ضبط کنید تا زنده بودن با تصویر خودکار بررسی شود.",
      href: "/demo/liveness",
    },
  ],
};

export default function DemoIndexPage() {
  const { language, dir } = useLanguage();
  const copy = DEMO_PAGE_COPY[language] ?? DEMO_PAGE_COPY[Language.EN];
  const demos = DEMOS[language] ?? DEMOS[Language.EN];
  const isRtl = dir === "rtl";
  const alignClass = isRtl ? "text-right" : "text-left";

  return (
    <div
      className={cn(
        "min-h-screen bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)]",
        isRtl && "font-vazirmatn",
      )}
      dir={dir}
    >
      <Navbar />

      <main className="pr-2 sm:pr-4 lg:pr-8 xl:pr-12">
        <Section spacing="lg">
          <Container className="space-y-10">
            <div className={cn("space-y-3", alignClass)}>
              <Typography variant="h2" className="text-4xl font-bold">
                {copy.heading}
              </Typography>
              <Typography
                variant="body-lg"
                className="text-[color:var(--md-sys-color-on-surface-variant)]"
              >
                {copy.description}
              </Typography>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {demos.map((demo) => (
                <Card
                  key={demo.id}
                  className="border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface-container-low)] shadow-[var(--elevation-2)]"
                >
                  <CardHeader className={alignClass}>
                    <CardTitle>{demo.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Typography
                      variant="body-md"
                      className="text-[color:var(--md-sys-color-on-surface-variant)]"
                    >
                      {demo.description}
                    </Typography>
                    <Link href={demo.href} className="inline-flex">
                      <Button variant="secondary" className="rounded-full px-6">
                        {copy.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
