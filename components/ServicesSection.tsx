"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Fingerprint, Mic, ScanFace } from "lucide-react";
import { useRouter } from "next/navigation";

import { useLanguage } from "../lib/useLanguage";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

type ServiceId = "face" | "liveness" | "ocr" | "voice";

function hexToRgb(hexColor: string): { r: number; g: number; b: number } | null {
  const normalized = hexColor.replace("#", "").trim();
  if (normalized.length !== 6) return null;

  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

function ComingSoonBadge({
  label,
  accentHex,
  dir,
}: {
  label: string;
  accentHex: string;
  dir: "rtl" | "ltr";
}) {
  const rgb = hexToRgb(accentHex) ?? { r: 255, g: 255, b: 255 };
  const accent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const border = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.34)`;
  const background = `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.22) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) 100%)`;
  const glow = `0 10px 28px rgba(0,0,0,0.18)`;

  return (
    <span
      dir={dir}
      className="inline-flex items-center gap-2 self-center rounded-full px-4 py-2 text-sm font-semibold tracking-wide backdrop-blur-md"
      style={{
        background,
        border: `1px solid ${border}`,
        color: accent,
        boxShadow: glow,
      }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />
      <span className="leading-none">{label}</span>
    </span>
  );
}

interface Service {
  id: ServiceId;
  title: string;
  description: string;
  imageGradient: string;
  colorFrom: string;
  colorTo: string;
  icon: React.ReactNode;
}

const servicesData: Record<Language, Service[]> = {
  [Language.EN]: [
    {
      id: "face",
      title: "Face Verification",
      description:
        "High-precision 1:1 and 1:N face matching using advanced 3D topology analysis. Robust to lighting, age, and accessories.",
      imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      colorFrom: "#667eea",
      colorTo: "#764ba2",
      icon: <ScanFace className="w-6 h-6" />,
    },
    {
      id: "liveness",
      title: "Liveness Detection",
      description:
        "ISO 30107-3 compliant liveness checks to block spoofing attempts like printed photos, video replays, and 3D masks.",
      imageGradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      colorFrom: "#8b5cf6",
      colorTo: "#ec4899",
      icon: <Fingerprint className="w-6 h-6" />,
    },
    {
      id: "ocr",
      title: "Document OCR",
      description:
        "Extract data instantly from IDs, passports, and driver licenses with Persian, Arabic, and Latin support.",
      imageGradient: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
      colorFrom: "#16a34a",
      colorTo: "#22c55e",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: "voice",
      title: "Voice Biometrics",
      description:
        "Phrase-independent voice authentication for secure, frictionless phone banking and support.",
      imageGradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      colorFrom: "#f59e0b",
      colorTo: "#ef4444",
      icon: <Mic className="w-6 h-6" />,
    },
  ],
  [Language.FA]: [
    {
      id: "face",
      title: "احراز هویت چهره",
      description:
        "تطبیق چهره ۱:۱ و ۱:N با تحلیل سه‌بعدی؛ مقاوم در برابر نور، سن و اکسسوری.",
      imageGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      colorFrom: "#667eea",
      colorTo: "#764ba2",
      icon: <ScanFace className="w-6 h-6" />,
    },
    {
      id: "liveness",
      title: "تشخیص زنده بودن",
      description:
        "بررسی‌های لایونس مطابق با استاندارد ISO 30107-3 برای جلوگیری از حملات جعل هویت شامل عکس‌های چاپ شده، بازپخش ویدیو و ماسک‌های سه‌بعدی.",
      imageGradient: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
      colorFrom: "#8b5cf6",
      colorTo: "#ec4899",
      icon: <Fingerprint className="w-6 h-6" />,
    },
    {
      id: "ocr",
      title: "OCR مدارک",
      description:
        "استخراج داده آنی از مدارک هویتی با پشتیبانی فارسی، عربی و لاتین.",
      imageGradient: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
      colorFrom: "#16a34a",
      colorTo: "#22c55e",
      icon: <FileText className="w-6 h-6" />,
    },
    {
      id: "voice",
      title: "بیومتریک صوتی",
      description:
        "احراز هویت صوتی مستقل از عبارت؛ مناسب مراکز تماس و بانکداری تلفنی.",
      imageGradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
      colorFrom: "#f59e0b",
      colorTo: "#ef4444",
      icon: <Mic className="w-6 h-6" />,
    },
  ],
};

const titles: Record<
  Language,
  { heading: string; sub: string; button: string }
> = {
  [Language.EN]: {
    heading: "Barbod Services",
    sub: "A unified platform for high-precision, secure, and fast user identification.",
    button: "Learn more",
  },
  [Language.FA]: {
    heading: "سرویس‌های باربد",
    sub: "پلتفرمی یکپارچه برای شناسایی و تایید کاربران با دقت، امنیت و سرعت بالا",
    button: "اطلاعات بیشتر",
  },
};

const PROGRESS_DURATION = 5000; // 5 seconds per slide

export function ServicesSection() {
  const { language, dir } = useLanguage();
  const router = useRouter();
  const services = servicesData[language];
  const copy = titles[language];

  const [activeId, setActiveId] = useState<ServiceId>(services[0].id);
  const [isDesktop, setIsDesktop] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const tabListRef = useRef<HTMLDivElement | null>(null);

  const serviceHref: Partial<Record<ServiceId, string>> = {
    face: "/services/face-recognition",
    liveness: "/services/liveness",
    ocr: "/services/ocr",
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const handleChange = (event?: MediaQueryListEvent) => {
      setIsDesktop(event ? event.matches : media.matches);
    };
    handleChange();
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      const currentIdx = services.findIndex((s) => s.id === activeId);
      const nextIndex = (currentIdx + 1) % services.length;
      setActiveId(services[nextIndex].id);
    }, PROGRESS_DURATION);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [activeId, services, isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;
    const container = tabListRef.current;
    if (!container || container.scrollWidth <= container.clientWidth) return;

    const activeButton = container.querySelector<HTMLButtonElement>(
      `[data-service-id="${activeId}"]`
    );
    activeButton?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeId, isDesktop]);

  const handleTabClick = (id: ServiceId) => {
    setActiveId(id);
  };

  const currentService = services.find((s) => s.id === activeId) || services[0];
  const learnMoreHref = serviceHref[currentService.id];
  const isComingSoonService = currentService.id === "voice";
  const comingSoonLabel = language === Language.FA ? "به زودی" : "Coming soon!";

  const iconColor = (service: Service, isActive: boolean) =>
    isActive ? service.colorTo : "var(--text-secondary)";

  const ctaArrow = dir === "rtl" ? "←" : "→";

  return (
    <Section dir={dir}>
      <Container>
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Typography variant="h2" className="mb-4">
              {copy.heading}
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
          >
            <Typography
              variant="body-lg"
              className="mx-auto max-w-3xl text-center text-[color:var(--md-sys-color-on-surface-variant)]"
            >
              {copy.sub}
            </Typography>
          </motion.div>
        </div>

        <div className="lg:hidden">
          <Accordion
            type="single"
            value={activeId}
            onValueChange={(value) => {
              if (!value) return;
              setActiveId(value as ServiceId);
            }}
            className="space-y-4"
            dir={dir}
          >
            {services.map((service) => {
              const isActive = activeId === service.id;
              const isComingSoonService = service.id === "voice";
              const itemHref = serviceHref[service.id];
              return (
                <AccordionItem
                  key={service.id}
                  value={service.id}
                  className={`border-b-0 overflow-hidden rounded-[var(--radius-xl)] border border-[color:var(--md-sys-color-outline-variant)]/30 ${
                    isActive
                      ? "bg-[color:var(--md-sys-color-surface-container)] shadow-[var(--elevation-1)]"
                      : "bg-[color:var(--md-sys-color-surface-container-low)]"
                  }`}
                >
                  <AccordionTrigger
                    className={`px-5 py-4 text-base font-semibold no-underline hover:no-underline ${
                      dir === "rtl" ? "flex-row-reverse text-right" : "text-left"
                    }`}
                  >
                    <span
                      className={`flex items-center gap-3 ${
                        dir === "rtl" ? "flex-row-reverse" : ""
                      }`}
                    >
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-1)]"
                        style={{ color: iconColor(service, isActive) }}
                      >
                        {React.isValidElement(service.icon)
                          ? React.cloneElement(service.icon as React.ReactElement<any>, {
                              className: "w-6 h-6",
                            })
                          : service.icon}
                      </span>
                      <span>{service.title}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-5">
                    <Typography
                      variant="body-md"
                      className="text-[color:var(--md-sys-color-on-surface-variant)]"
                    >
                      {service.description}
                    </Typography>
                    <div
                      className={`mt-4 flex flex-wrap items-center gap-3 ${
                        dir === "rtl" ? "justify-end" : ""
                      }`}
                      dir={dir}
                    >
                      {!isComingSoonService && itemHref ? (
                        <Button
                          variant="secondary"
                          className="px-8 py-3 rounded-full text-sm font-medium group h-11"
                          onClick={() => router.push(itemHref)}
                          iconTrailing={
                            <span
                              className={`transition-transform duration-200 ${
                                dir === "rtl"
                                  ? "group-hover:-translate-x-1"
                                  : "group-hover:translate-x-1"
                              }`}
                            >
                              {ctaArrow}
                            </span>
                          }
                        >
                          {copy.button}
                        </Button>
                      ) : null}
                      {isComingSoonService ? (
                        <ComingSoonBadge
                          label={comingSoonLabel}
                          accentHex={service.colorFrom}
                          dir={dir}
                        />
                      ) : null}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <div
          ref={tabListRef}
          className="hide-scrollbar mb-12 hidden lg:flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-px-4 -mx-4 px-4 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0 lg:justify-center lg:items-stretch lg:snap-none"
        >
          {services.map((service) => {
            const isActive = activeId === service.id;
            return (
              <Button
                key={service.id}
                type="button"
                variant="ghost"
                size="md"
                onClick={() => handleTabClick(service.id)}
                data-service-id={service.id}
                className={`relative group min-w-[240px] sm:min-w-[220px] shrink-0 lg:shrink snap-center lg:flex-1 h-auto px-8 py-6 whitespace-normal rounded-[var(--radius-xl)] text-base font-medium transition-all duration-300 overflow-hidden text-left justify-start hover:bg-transparent
                  ${isActive
                    ? "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-2)] scale-[1.03] z-10"
                    : "bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-on-surface-variant)] hover:bg-[color:var(--md-sys-color-surface-container)]"
                  }`}
              >
                <div
                  className="flex items-center gap-4 relative z-10"
                  dir={dir}
                >
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-1)] transition-all duration-300"
                    style={{
                      color: iconColor(service, isActive),
                      transform: isActive ? "scale(1.08)" : "scale(1)",
                    }}
                  >
                    {React.isValidElement(service.icon)
                      ? React.cloneElement(
                          service.icon as React.ReactElement<any>,
                          { className: "w-7 h-7" }
                        )
                      : service.icon}
                  </span>
                  <span
                    className={`font-semibold transition-colors duration-300 ${
                      isActive
                        ? "text-[color:var(--md-sys-color-on-surface)]"
                        : "text-[color:var(--md-sys-color-on-surface-variant)]"
                    }`}
                  >
                    {service.title}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-transparent">
                  <div
                    key={
                      isActive
                        ? `progress-${activeId}`
                        : `progress-${service.id}`
                    }
                    className="h-full rounded-full"
                    style={{
                      opacity: isActive ? 1 : 0,
                      background: `linear-gradient(90deg, ${service.colorFrom}, ${service.colorTo})`,
                      animation: isActive
                        ? `serviceProgress ${PROGRESS_DURATION}ms linear forwards`
                        : "none",
                    }}
                  />
                </div>
              </Button>
            );
          })}
        </div>

        <div className="hidden lg:block">
          <Card className="relative rounded-[32px] shadow-[var(--elevation-2)] overflow-hidden border border-[color:var(--md-sys-color-outline-variant)]/20 animate-float-delayed">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[480px]">
              {/* Text content section - now first */}
              <div className="flex flex-col justify-center p-8 lg:p-16 order-2 lg:order-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentService.id}
                    initial={{ opacity: 0, x: dir === "rtl" ? -28 : 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir === "rtl" ? 28 : -28 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex flex-col gap-6 items-start w-full"
                  >
                    <Typography variant="h3" className="leading-tight">
                      {currentService.title}
                    </Typography>

                    <Typography
                      variant="body-lg"
                      className="min-h-[84px] font-light text-[color:var(--md-sys-color-on-surface-variant)]"
                    >
                      {currentService.description}
                    </Typography>

                    <div className="flex flex-wrap items-center gap-3" dir={dir}>
                      {!isComingSoonService && learnMoreHref ? (
                        <Button
                          variant="secondary"
                          className="px-10 py-4 rounded-full text-base font-medium group h-12"
                          onClick={() => router.push(learnMoreHref)}
                          iconTrailing={
                            <span
                              className={`transition-transform duration-200 ${
                                dir === "rtl"
                                  ? "group-hover:-translate-x-1"
                                  : "group-hover:translate-x-1"
                              }`}
                            >
                              {ctaArrow}
                            </span>
                          }
                        >
                          {copy.button}
                        </Button>
                      ) : null}
                      {isComingSoonService ? (
                        <ComingSoonBadge
                          label={comingSoonLabel}
                          accentHex={currentService.colorFrom}
                          dir={dir}
                        />
                      ) : null}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Gradient animation section - now second */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentService.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-64 lg:h-full w-full relative overflow-hidden order-1 lg:order-2"
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: currentService.imageGradient }}
                  />
                  <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                  {/* Minimal, professional service animations */}
                  <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-16">
                    {/* Face Verification - Simple Biometric Scanner */}
                    {currentService.id === "face" && (
                      <div className="relative w-full max-w-md aspect-square">
                        <svg className="w-full h-full" viewBox="0 0 300 300">
                          {/* Face outline */}
                          <motion.rect
                            x="75"
                            y="50"
                            width="150"
                            height="200"
                            rx="75"
                            fill="none"
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth="2"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
                          />

                          {/* Corner brackets */}
                          {[
                            [75, 50],
                            [225, 50],
                            [75, 250],
                            [225, 250],
                          ].map(([x, y], i) => (
                            <motion.g key={i}>
                              <line
                                x1={x}
                                y1={y}
                                x2={x + (i % 2 === 0 ? 20 : -20)}
                                y2={y}
                                stroke="rgba(255,255,255,0.6)"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                              <line
                                x1={x}
                                y1={y}
                                x2={x}
                                y2={y + (i < 2 ? 20 : -20)}
                                stroke="rgba(255,255,255,0.6)"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            </motion.g>
                          ))}

                          {/* Scanning beam */}
                          <motion.rect
                            x="75"
                            y="35"
                            width="150"
                            height="3"
                            fill="rgba(255,255,255,0.7)"
                            style={{ filter: "blur(1px)" }}
                            animate={{ y: [15, 215, 15] }}
                            transition={{
                              duration: 2.2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                        </svg>
                      </div>
                    )}

                    {/* Liveness Detection - Subtle Pulse */}
                    {currentService.id === "liveness" && (
                      <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                        <svg className="w-full h-full" viewBox="0 0 200 200">
                          {/* Expanding rings */}
                          {[...Array(3)].map((_, i) => (
                            <motion.circle
                              key={i}
                              cx="100"
                              cy="100"
                              r="40"
                              fill="none"
                              stroke="rgba(255,255,255,0.35)"
                              strokeWidth="2"
                              initial={{ r: 40, opacity: 0 }}
                              animate={{
                                r: [40, 80],
                                opacity: [0.55, 0],
                              }}
                              transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                delay: i * 0.65,
                                ease: "easeOut",
                              }}
                            />
                          ))}

                          {/* Center dot */}
                          <motion.circle
                            cx="100"
                            cy="100"
                            r="12"
                            fill="rgba(255,255,255,0.9)"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.9, 1, 0.9],
                            }}
                            transition={{
                              duration: 1.6,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            style={{ transformOrigin: "100px 100px" }}
                          />
                        </svg>
                      </div>
                    )}

                    {/* OCR - Clean Document Scanner */}
                    {currentService.id === "ocr" && (
                      <div className="relative w-full max-w-sm">
                        <svg className="w-full" viewBox="0 0 200 260">
                          {/* Document */}
                          <rect
                            x="30"
                            y="30"
                            width="140"
                            height="200"
                            rx="4"
                            fill="rgba(255,255,255,0.08)"
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth="2"
                          />

                          {/* Text lines */}
                          {[...Array(8)].map((_, i) => (
                            <motion.line
                              key={i}
                              x1="50"
                              y1={60 + i * 20}
                              x2="150"
                              y2={60 + i * 20}
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="2"
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.55, delay: i * 0.06 }}
                            />
                          ))}

                          {/* Scanning beam */}
                          <motion.line
                            x1="30"
                            y1="30"
                            x2="170"
                            y2="30"
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth="2"
                            style={{ filter: "blur(1px)" }}
                            animate={{ y1: [30, 230], y2: [30, 230] }}
                            transition={{
                              duration: 1.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        </svg>
                      </div>
                    )}

                    {/* Voice - Smooth Waveform */}
                    {currentService.id === "voice" && (
                      <div className="relative w-full max-w-lg h-40">
                        <svg className="w-full h-full" viewBox="0 0 400 100">
                          {/* Waveform bars */}
                          {[...Array(20)].map((_, i) => {
                            const height = 20 + Math.sin(i * 0.6) * 15;
                            return (
                              <motion.rect
                                key={i}
                                x={10 + i * 19}
                                y={50 - height / 2}
                                width="12"
                                height={height}
                                rx="6"
                                fill="rgba(255,255,255,0.6)"
                                animate={{
                                  scaleY: [1, 1.35 + Math.sin(i * 0.4) * 0.25, 1],
                                }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                  delay: i * 0.05,
                                  ease: "easeInOut",
                                }}
                                style={{
                                  transformOrigin: `${10 + i * 19 + 6}px 50px`,
                                }}
                              />
                            );
                          })}
                        </svg>
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </Container>
      <style jsx>{`
        @keyframes serviceProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </Section>
  );
}
