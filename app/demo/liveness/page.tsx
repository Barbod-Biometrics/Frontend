"use client";

import React from "react";

import { Footer } from "../../../components/Footer";
import { Navbar } from "../../../components/Navbar";
import { FaceVerificationDemo } from "../../../components/test-services/FaceVerificationDemo";
import { useLanguage } from "../../../lib/useLanguage";
import { cn } from "../../../lib/utils";
import { Language } from "../../../types";

const LIVENESS_DEMO_COPY: Record<
  Language,
  { title: string; description: string; confirmationLabel: string }
> = {
  [Language.EN]: {
    title: "Liveness demo",
    description:
      "Record a short selfie video. A still image is captured automatically to verify liveness.",
    confirmationLabel: "Liveness confirmation",
  },
  [Language.FA]: {
    title: "دموی زنده بودن",
    description:
      "یک ویدیوی سلفی کوتاه ضبط کنید. برای بررسی زنده بودن، یک تصویر ثابت به صورت خودکار گرفته می شود.",
    confirmationLabel: "تایید زنده بودن",
  },
};

export default function DemoLivenessPage() {
  const { language, dir } = useLanguage();
  const copy = LIVENESS_DEMO_COPY[language] ?? LIVENESS_DEMO_COPY[Language.EN];
  const isRtl = dir === "rtl";

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
        <FaceVerificationDemo
          title={copy.title}
          description={copy.description}
          confirmationLabel={copy.confirmationLabel}
          autoCapturePhoto
        />
      </main>

      <Footer />
    </div>
  );
}
