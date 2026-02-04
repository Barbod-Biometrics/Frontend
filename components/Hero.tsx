"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

import GradientText from "./GradientText";
import { Button } from "./ui/Button";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Typography } from "./ui/Typography";
import TopologicalFace from "./TopologicalFace";
import { Theme, Language } from "../types";
import { selectIsAdmin, selectIsAuthenticated } from "../store/loginSlice";
import type { RootState } from "../store/store";

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
    badge: "احراز هویت دیجیتال",
    headingTop: "احراز هویت دیجیتال",
    headingHighlight: "سریع، امن و هوشمند",
    description:
      "پلتفرم ما با ترکیب فناوری تشخیص چهره، تحلیل مدارک هویتی و هوش مصنوعی، فرآیند احراز هویت کاربران را برای کسب‌وکارها ساده، امن و مقیاس‌پذیر می‌سازد.",
    primaryCta: "شروع کنید",
    secondaryCta: "مشاهده دمو",
    stats: [
      { value: "1.6M+", label: "بررسی روزانه" },
      { value: "<30s", label: "زمان احراز هویت" },
      { value: "99.9%", label: "پایداری سرویس" },
    ],
  },
};

interface HeroProps {
  language: Language;
  theme: Theme;
  dir?: "rtl" | "ltr";
}

export function Hero({ language, theme, dir }: HeroProps) {
  const router = useRouter();
  const isAdmin = useSelector(selectIsAdmin);
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const contentDir = dir ?? (language === Language.FA ? "rtl" : "ltr");
  const copy = heroCopy[language];
  const isFa = language === Language.FA;
  const gradientColors =
    theme === Theme.LIGHT
      ? ["#1e3a8a", "#4079ff", "#1e3a8a", "#4079ff", "#1e3a8a"]
      : ["#e0f2ff", "#60a5fa", "#ffffff", "#60a5fa", "#e0f2ff"];
  const highlightGlow =
    theme === Theme.LIGHT
      ? "drop-shadow-[0_0_18px_rgba(37,99,235,0.35)]"
      : "drop-shadow-[0_0_22px_rgba(96,165,250,0.45)]";

  const handlePrimaryClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAdmin) {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const primaryVariant = isFa ? "star" : "monochrome";
  const primaryClassName = isFa
    ? "min-w-[180px] lg:min-w-[200px]"
    : "h-14 min-w-[180px] rounded-full px-12 text-lg shadow-[var(--elevation-2)] transition-all hover:-translate-y-0 hover:shadow-[var(--elevation-3)] lg:h-16 lg:px-16";

  return (
    <Section
      spacing="lg"
      className={isFa ? "font-vazirmatn" : ""}
      dir={contentDir}
    >
      <Container className="relative z-10 flex min-h-[800px] flex-col items-center overflow-visible text-center">
        <div className="pointer-events-none absolute inset-0 -z-10 flex items-end justify-center overflow-hidden lg:items-center lg:overflow-visible">
          <div className="h-[980px] w-[220%] max-w-none -translate-y-16 opacity-85 sm:h-[1120px] sm:w-[210%] sm:-translate-y-12 lg:h-[1300px] lg:w-[220%] lg:-translate-y-32 xl:h-[1500px] xl:-translate-y-48">
            <TopologicalFace theme={theme} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex w-full flex-grow flex-col"
        >
          <div className="flex flex-grow flex-col items-center justify-center space-y-8 lg:space-y-10">
            <Typography variant="h1" component="h1">
              <span className="mb-2 block lg:mb-4">{copy.headingTop}</span>
              <GradientText
                colors={gradientColors}
                animationSpeed={3}
                showBorder={false}
                className={`font-bold leading-[1.35] pb-[0.08em] ${highlightGlow}`}
              >
                {copy.headingHighlight}
              </GradientText>
            </Typography>

            <Typography
              variant="body-lg"
              className={`max-w-3xl text-center ${
                theme === Theme.LIGHT
                  ? "text-[color:var(--md-sys-color-on-surface)] opacity-85"
                  : "opacity-90"
              }`}
            >
              {copy.description}
            </Typography>
          </div>

          <div className="mt-auto flex w-full flex-col items-center pt-12 lg:pt-20">
            <div className="flex flex-col gap-6 pb-12 sm:flex-row sm:justify-center lg:pb-16">
              <Button
                variant={primaryVariant}
                size="lg"
                className={primaryClassName}
                onClick={handlePrimaryClick}
              >
                {copy.primaryCta}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="h-14 min-w-[180px] rounded-full px-12 text-lg transition-all lg:h-16 lg:px-16"
                onClick={() => router.push("/demo")}
              >
                {copy.secondaryCta}
              </Button>
            </div>

            <div className="grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8 lg:gap-12">
              {copy.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group cursor-default text-center"
                >
                  <div className="mb-2 text-3xl font-bold tracking-tight text-[color:var(--md-sys-color-on-surface)] transition-colors group-hover:text-[color:var(--md-sys-color-primary)] sm:text-4xl lg:text-5xl">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium uppercase tracking-wider text-[color:var(--md-sys-color-on-surface-variant)] sm:text-base lg:text-lg">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
