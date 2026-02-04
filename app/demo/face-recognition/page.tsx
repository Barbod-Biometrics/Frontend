"use client";

import React from "react";

import { Footer } from "../../../components/Footer";
import { Navbar } from "../../../components/Navbar";
import { FaceVerificationDemo } from "../../../components/test-services/FaceVerificationDemo";
import { useLanguage } from "../../../lib/useLanguage";
import { cn } from "../../../lib/utils";
import { Language } from "../../../types";

const FACE_DEMO_COPY: Record<
  Language,
  { title: string; description: string; confirmationLabel: string }
> = {
  [Language.EN]: {
    title: "Face recognition demo",
    description:
      "Capture a reference photo and a short selfie video. The backend will confirm whether the face matches and the session is valid.",
    confirmationLabel: "Face confirmation",
  },
  [Language.FA]: {
    title: "دموی تشخیص چهره",
    description:
      "یک عکس مرجع و یک ویدیوی سلفی کوتاه ثبت کنید. بک اند تایید می کند که چهره مطابقت دارد و نشست معتبر است.",
    confirmationLabel: "تایید چهره",
  },
};

export default function DemoFaceRecognitionPage() {
  const { language, dir } = useLanguage();
  const copy = FACE_DEMO_COPY[language] ?? FACE_DEMO_COPY[Language.EN];
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
        />
      </main>

      <Footer />
    </div>
  );
}
