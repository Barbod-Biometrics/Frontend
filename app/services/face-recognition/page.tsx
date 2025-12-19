"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Shield, Users, Zap } from "lucide-react";

import { Footer } from "../../../components/Footer";
import { Navbar } from "../../../components/Navbar";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Container } from "../../../components/ui/Container";
import { Section } from "../../../components/ui/Section";
import { Typography } from "../../../components/ui/Typography";
import { SalesConnector } from "../../../components/SalesConnector";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
};

type Highlight = {
  title: string;
  description: string;
  image: string;
  alt: string;
  reverse?: boolean;
  ctaLabel?: string;
};

const features: Feature[] = [
  {
    icon: Shield,
    title: "امنیت قوی",
    description:
      "طبق الگوریتم‌های پیشرفته‌ی شناسایی چهره، امنیت بالا و حفظ حریم خصوصی کاربران تضمین شده و اجازه دسترسی افراد غیر مجاز داده نمی‌شود.",
  },
  {
    icon: Zap,
    title: "پردازش سریع",
    description:
      "پردازش و تطبیق چهره در کمتر از ۵ ثانیه انجام شده و خطای سیستم نیز بسیار پایین است.",
  },
  {
    icon: Users,
    title: "اخذ صورت‌های موفق",
    description:
      "تمامی مراحل تشخیص با ثبت نتایج موفق یا ناموفق پایش می‌شود تا گزارش دقیقی از وضعیت تطبیق در اختیار شما باشد.",
  },
  {
    icon: CheckCircle,
    title: "دقت بالا",
    description:
      "با کمک مدل‌ها و الگوهای یادگیری عمیق در پردازش تصویر، دقت تطبیق چهره بسیار بالا بوده و خطای سیستم به حداقل می‌رسد.",
  },
];

const highlights: Highlight[] = [
  {
    title: "تطبیق دقیق چهره",
    description:
      "سرویس تطبیق چهره با الگوریتم‌های پیشرفته پردازش تصویر و یادگیری عمیق، تصویر کاربر را با داده‌های مرجع مقایسه می‌کند و هویت او را با دقت بسیار بالا تایید یا رد می‌کند.",
    image: "/assets/images/face-recognition-2.jpg",
    alt: "تطبیق دقیق چهره",
  },
  {
    title: "تحلیل ویژگی‌های چهره",
    description:
      "سیستم تشخیص چهره به‌طور خودکار ویژگی‌های کلیدی صورت شامل ساختار صورت و فاصله اجزا را استخراج و تحلیل کرده و مسیر تطبیق دقیق و مطمئن را انجام می‌دهد.",
    image: "/assets/images/face-recognition-3.jpg",
    alt: "تحلیل ویژگی‌های چهره",
    reverse: true,
  },
  {
    title: "استعلام برخط و تایید هویت",
    description:
      "در مرحله نهایی، داده‌های استخراج‌شده به‌صورت برخط با پایگاه‌های رسمی تطبیق داده می‌شود تا صحت هویت کاربر تایید شده و نتیجه به‌صورت لحظه‌ای ارائه گردد.",
    image: "/assets/images/face-recognition-1.jpg",
    alt: "استعلام برخط و تایید هویت",
    ctaLabel: "تست سرویس",
  },
];

export default function FaceRecognitionPage() {
  return (
    <div className="min-h-screen bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)] font-vazirmatn" dir="rtl">
      <Navbar />

      <main>
        <Section spacing="lg" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--md-sys-color-primary)]/12 to-[color:var(--md-sys-color-tertiary)]/12" />
          <Container className="relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="text-right space-y-6"
              >
                <span className="inline-flex items-center rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-primary)]/10 px-4 py-2 text-xs font-semibold text-[color:var(--md-sys-color-primary)]">
                  سرویس‌ها / تطبیق چهره
                </span>
                <Typography variant="h2" className="text-5xl font-bold leading-tight">
                  تطبیق چهره
                </Typography>
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed">
                  با استفاده از سرویس تطبیق چهره، هویت کاربر از طریق تحلیل تصویر و الگوریتم‌های پیشرفته
                  پردازش تصویری بررسی شده و در گام بعد با پایگاه داده تطبیق داده می‌شود. این سرویس
                  طیف گسترده‌ای از سناریوهای هویت و تمامی فرآیندهای حساس هویتی قابل استفاده است.
                </Typography>
                <div className="flex flex-wrap gap-4 justify-end lg:justify-center">
                  <Button size="lg" variant="monochrome" className="rounded-full px-10 shadow-[var(--elevation-2)]">
                    درخواست سرویس
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-10"
                    iconTrailing={<ArrowLeft className="h-4 w-4" />}
                  >
                    تست سرویس
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[color:var(--md-sys-color-surface-container-high)] p-8">
                  <img
                    src="/assets/images/face-recognition-1.jpg"
                    alt="تطبیق چهره"
                    className="w-full h-auto rounded-2xl opacity-90"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[color:var(--md-sys-color-primary)]/35 rounded-full blur-3xl opacity-60" />
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-[color:var(--md-sys-color-tertiary)]/35 rounded-full blur-3xl opacity-60" />
              </motion.div>
            </div>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container className="relative space-y-10">
            <div className="pointer-events-none absolute inset-0 opacity-60 blur-3xl [background:radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(99,102,241,0.14),transparent_45%)]" />

            <div className="relative max-w-3xl space-y-3 text-right">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--md-sys-color-outline-variant)]/60 bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--md-sys-color-on-surface-variant)]">
                ویژگی‌های کلیدی
              </span>
              <Typography variant="h3" className="leading-tight">
                قابلیت‌های پیشرفته برای تطبیق چهره
              </Typography>
              <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8">
                امنیت، دقت، سرعت و پایش کامل در تمامی فرآیندهای تشخیص و تطبیق چهره
              </Typography>
            </div>

            <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
                  className="group relative h-full"
                >
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-[color:var(--md-sys-color-primary)]/10 via-transparent to-[color:var(--md-sys-color-tertiary)]/12 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <Card className="relative h-full border border-[color:var(--md-sys-color-outline-variant)]/60 bg-card/70 shadow-[var(--elevation-2)] backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[var(--elevation-3)]">
                    <CardHeader className="flex-row items-center gap-4 space-y-0 p-7 pb-2" dir="rtl">
                      <motion.span
                        className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--md-sys-color-primary)] to-[color:var(--md-sys-color-tertiary)] text-white shadow-[var(--elevation-2)]"
                        whileHover={{ scale: 1.06, rotate: 2 }}
                        transition={{ duration: 0.3 }}
                      >
                        <feature.icon className="h-7 w-7" />
                      </motion.span>
                      <div className="flex-1 pt-1 text-right">
                        <h3 className="text-lg font-semibold leading-tight text-foreground">{feature.title}</h3>
                      </div>
                    </CardHeader>
                    <CardContent className="p-7 pt-2">
                      <p className="text-sm leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)] transition-colors duration-300 group-hover:text-foreground text-right">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Container>
        </Section>

        <Section spacing="lg" className="bg-[color:var(--md-sys-color-surface-container-low)]/60">
          <Container>
            {highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  index < highlights.length - 1 ? "mb-20" : ""
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, x: highlight.reverse ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`order-1 ${highlight.reverse ? "lg:order-2" : "lg:order-1"} text-right`}
                >
                  <div className="relative flex items-start gap-4 justify-end pr-2">
                    <span
                      className="mt-1 inline-flex h-14 w-1.5 rounded-full bg-gradient-to-b from-[color:var(--md-sys-color-primary)] to-[color:var(--md-sys-color-tertiary)] shadow-[0_6px_18px_rgba(0,0,0,0.1)]"
                      aria-hidden
                    />
                    <div className="space-y-4 text-right">
                      <Typography variant="h3" className="mb-2">
                        {highlight.title}
                      </Typography>
                      <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)]" dir="rtl">
                        {highlight.description}
                      </Typography>
                      {highlight.ctaLabel ? (
                        <Button
                          size="lg"
                          variant="secondary"
                          className="rounded-full px-8"
                          iconTrailing={<ArrowLeft className="h-4 w-4" />}
                        >
                          {highlight.ctaLabel}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: highlight.reverse ? 50 : -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className={`relative order-2 ${highlight.reverse ? "lg:order-1" : "lg:order-2"}`}
                >
                  <div className="rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src={highlight.image}
                      alt={highlight.alt}
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              </div>
            ))}
          </Container>
        </Section>

        <Section spacing="md">
          <Container>
            <SalesConnector />
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
