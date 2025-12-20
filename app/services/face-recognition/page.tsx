"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, Shield, Users, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

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
      "باربد با الگوریتم‌های پیشرفته بیومتریک و رمزنگاری، امنیت داده‌ها و اطلاعات حساس کاربران را تضمین می‌کند.",
  },
  {
    icon: Zap,
    title: "پردازش سریع",
    description:
      "پردازش تصویر و تطبیق در زمان کوتاه انجام می‌شود تا تجربه کاربری سریع و بدون تأخیر ارائه گردد.",
  },
  {
    icon: Users,
    title: "احراز هویت های موفق",
    description:
      "ثبت تمامی درخواست‌های موفق امکان پایش کامل و ارائه گزارش‌های دقیق را فراهم می‌کند.",
  },
  {
    icon: CheckCircle,
    title: "دقت بالا",
    description:
      "الگوریتم‌های تطبیق چهره با دقت بسیار بالا و نرخ خطای پایین عمل می‌کنند.",
  },
];

const highlights: Highlight[] = [
  {
    title: "تطبیق دقیق چهره",
    description:
      "سرویس تطبیق چهره با تحلیل ویژگی‌های چهره و الگوریتم‌های پیشرفته، تصویر کاربر را با داده‌های مرجع مقایسه کرده و با دقت بسیار بالا تایید یا رد می‌کند.",
    image: "/assets/images/face-recognition-2.jpg",
    alt: "تطبیق دقیق چهره",
  },
  {
    title: "تحلیل ویژگی‌های چهره",
    description:
      "در این مرحله ویژگی‌های کلیدی صورت مانند فاصله نقاط اصلی صورت و هندسه چهره استخراج و تحلیل می‌شود تا تطبیق دقیق و مطمئن با داده‌های مرجع انجام شود.",
    image: "/assets/images/face-recognition-3.jpg",
    alt: "تحلیل ویژگی‌های چهره",
    reverse: true,
  },
  {
    title: "استعلام برخط و تایید هویت",
    description:
      "در مرحله نهایی، اطلاعات تایید شده با پایگاه‌های رسمی تطبیق داده می‌شوند و نتیجه به‌صورت لحظه‌ای ارائه می‌گردد.",
    image: "/assets/images/face-recognition-1.jpg",
    alt: "استعلام برخط و تایید هویت",
    ctaLabel: "تست سرویس",
  },
];

export default function FaceRecognitionPage() {
  const router = useRouter();

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
                <Typography variant="h2" className="text-5xl font-bold leading-tight">
                  تطبیق چهره
                </Typography>
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed">
                  با استفاده از سرویس تطبیق چهره، هویت کاربران از طریق تحلیل تصویر و الگوریتم‌های پیشرفته پردازش تصویری
                  بررسی شده و با دقت بسیار بالا به مراجع استعلام تطبیق داده می‌شود. این سرویس برای بانک‌ها، شرکت‌های بزرگ
                  و تمامی نهادهای حساس هویتی قابل استفاده است.
                </Typography>
                <div className="flex flex-wrap gap-4 justify-end lg:justify-center">
                  <Button
                    size="lg"
                    variant="monochrome"
                    className="rounded-full px-10 shadow-[var(--elevation-2)]"
                    onClick={() => router.push("/login")}
                  >
                    درخواست سرویس
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="rounded-full px-10"
                    onClick={() => router.push("/liveness-check")}
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
                <div className="relative overflow-hidden rounded-3xl">
                  <img
                    src="/assets/images/face-reconition-4.jpg"
                    alt="تطبیق چهره"
                    className="w-full h-auto rounded-3xl object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
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
              <Typography variant="h3" className="leading-tight">
                تطبیق چهره
              </Typography>
              <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8">
                امنیت قوی، پردازش سریع، احراز هویت های موفق و دقت بالا
              </Typography>
            </div>

            <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        <h3 className="text-xl font-semibold leading-tight text-foreground">{feature.title}</h3>
                      </div>
                    </CardHeader>
                    <CardContent className="p-7 pt-2">
                      <p className="text-base leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)] transition-colors duration-300 group-hover:text-foreground text-right">
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
                      <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)]" dir="rtl">
                        {highlight.description}
                      </Typography>
                      {highlight.ctaLabel ? (
                        <Button
                          size="lg"
                          variant="secondary"
                          className="rounded-full px-8"
                          onClick={() => router.push("/liveness-check")}
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
                  <div className="rounded-3xl overflow-hidden">
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


