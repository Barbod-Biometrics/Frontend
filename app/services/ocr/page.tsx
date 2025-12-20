"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, Layers, ScanLine, Zap } from "lucide-react";

import { Footer } from "../../../components/Footer";
import { Navbar } from "../../../components/Navbar";
import { SalesConnector } from "../../../components/SalesConnector";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Container } from "../../../components/ui/Container";
import { Section } from "../../../components/ui/Section";
import { Typography } from "../../../components/ui/Typography";

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
};

const features: Feature[] = [
  {
    icon: ScanLine,
    title: "یکپارچگی و مقیاس‌پذیری",
    description: "استفاده آسان از API و قابلیت اتصال به سامانه‌ها، پردازش در مقیاس بالا را فراهم می‌کند.",
  },
  {
    icon: Globe,
    title: "نرخ پاسخ‌دهی",
    description: "پاسخ‌دهی سریع و پردازش هوشمند، خروجی را در زمان کوتاه ارائه می‌دهد.",
  },
  {
    icon: Layers,
    title: "کارت‌های پردازش شده",
    description: "استخراج دقیق اطلاعات کارت ملی و تبدیل به داده دیجیتال قابل استفاده.",
  },
  {
    icon: Zap,
    title: "نرخ موفقیت",
    description: "تشخیص دقیق حتی در کیفیت‌های متفاوت تصویر با نرخ موفقیت بالا.",
  },
];

const highlights: Highlight[] = [
  {
    title: "استخراج هوشمند اطلاعات از کارت ملی",
    description:
      "سرویس OCR کارت ملی با بهره‌گیری از الگوریتم‌های پیشرفته، تمامی اطلاعات را استخراج کرده و داده‌های تمیز و قابل استفاده تولید می‌کند. فرآیند به صورت خودکار و سریع و بدون دخالت انسانی انجام می‌شود.",
    image: "/assets/images/ocr-2.jpg",
    alt: "استخراج هوشمند اطلاعات از کارت ملی",
  },
  {
    title: "تحلیل و اعتبارسنجی داده‌ها",
    description:
      "پس از استخراج اطلاعات، سیستم به‌صورت خودکار خطاها و تناقض‌ها را تشخیص داده و با الگوریتم‌های داخلی صحت داده‌ها را بررسی می‌کند.",
    image: "/assets/images/ocr-3.jpg",
    alt: "تحلیل و اعتبارسنجی داده‌ها",
    reverse: true,
  },
];

export default function OCRPage() {
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
                  سرویس OCR و استعلام کارت ملی
                </Typography>
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed">
                  این سرویس با استفاده از هوش مصنوعی و پردازش تصویر، اطلاعات کارت ملی را به صورت خودکار استخراج و به داده‌های دیجیتال
                  تبدیل می‌کند. سپس با استعلام از مراجع رسمی، صحت اطلاعات بررسی شده و نتیجه به‌صورت آنی ارائه می‌شود. احراز هویت سریع،
                  دقیق و بدون ورود دستی اطلاعات انجام می‌شود.
                </Typography>
                <div className="flex flex-wrap gap-4 justify-end lg:justify-center">
                  <Button size="lg" variant="monochrome" className="rounded-full px-10 shadow-[var(--elevation-2)]">
                    درخواست سرویس
                  </Button>
                  <Button size="lg" variant="secondary" className="rounded-full px-10">
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
                    src="/assets/images/ocr-1.jpg"
                    alt="سرویس OCR و استعلام کارت ملی"
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
                سرویس OCR و استعلام کارت ملی
              </Typography>
              <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8">
                یکپارچگی و مقیاس‌پذیری، نرخ پاسخ‌دهی، کارت‌های پردازش شده و نرخ موفقیت
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
                className={`grid lg:grid-cols-2 gap-12 items-center ${index < highlights.length - 1 ? "mb-20" : ""}`}
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
                    <img src={highlight.image} alt={highlight.alt} className="w-full h-auto" loading="lazy" />
                  </div>
                </motion.div>
              </div>
            ))}

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-right"
              >
                <Typography variant="h3" className="mb-6">
                  استعلام برخط از مراجع رسمی
                </Typography>
                <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
                  در مرحله پایانی، اطلاعات استخراج شده با مراجع رسمی تطبیق داده می‌شود و نتیجه به‌صورت لحظه‌ای ارائه می‌شود.
                </Typography>
                <Button variant="monochrome" className="rounded-full px-10 shadow-[var(--elevation-2)]">
                  تست سرویس
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <Card className="rounded-3xl overflow-hidden shadow-2xl bg-[color:var(--md-sys-color-surface-container-high)]">
                  <CardHeader className="pb-2">
                    <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
                      استعلام برخط از مراجع رسمی
                    </Typography>
                    <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)]">
                      در مرحله پایانی، اطلاعات استخراج شده با مراجع رسمی تطبیق داده می‌شود و نتیجه به‌صورت لحظه‌ای ارائه می‌شود.
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl bg-slate-900 text-green-300 font-mono text-base p-6 shadow-inner" dir="ltr">
                      <div className="mb-2">curl -X POST \</div>
                      <div className="mb-2 pl-4">https://api.example.com/ocr \</div>
                      <div className="mb-2 pl-4">-H "Authorization: Bearer TOKEN" \</div>
                      <div className="pl-4">-F "image=@document.jpg"</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
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
