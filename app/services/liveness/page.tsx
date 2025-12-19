"use client";

import React from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle, Eye, Lock, Zap } from "lucide-react";

import { Footer } from "../../../components/Footer";
import { Input } from "../../../components/Input";
import { Navbar } from "../../../components/Navbar";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Container } from "../../../components/ui/Container";
import { Section } from "../../../components/ui/Section";
import { Typography } from "../../../components/ui/Typography";
import { SalesConnector } from "../../../components/SalesConnector";

type Feature = {
  icon: React.ElementType;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Eye,
    title: "تشخیص زنده بودن",
    description: "شناسایی چهره واقعی از تصاویر، ویدیوها و ماسک‌های ساختگی",
  },
  {
    icon: Lock,
    title: "امنیت دوطرفه",
    description: "جلوگیری از حملات spoofing با تحلیل چندلایه",
  },
  {
    icon: Camera,
    title: "تحلیل لحظه‌ای",
    description: "بررسی زنده بودن در زمان واقعی با تاخیر کمتر از ۱ ثانیه",
  },
  {
    icon: Zap,
    title: "دقت بالا",
    description: "نرخ تشخیص صحیح بالای ۹۹.۵٪ در شرایط مختلف",
  },
];

export default function LivenessPage() {
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
                  سرویس تشخیص زنده بودن چهره
                </Typography>
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed">
                  سیستم پیشرفته تشخیص زنده بودن ما با استفاده از الگوریتم‌های یادگیری عمیق و تحلیل
                  چندلایه، قادر به تشخیص چهره واقعی از تصاویر ساختگی، ویدیوها، و ماسک‌های سه‌بعدی
                  می‌باشد. این سرویس برای جلوگیری از کلاهبرداری و حملات spoofing طراحی شده است.
                </Typography>
                <div className="flex flex-wrap gap-4 justify-end lg:justify-center">
                  <Button size="lg" variant="monochrome" className="rounded-full px-10 shadow-[var(--elevation-2)]">
                    شروع رایگان
                  </Button>
                  <Button size="lg" variant="secondary" className="rounded-full px-10">
                    مشاهده دمو
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-3xl overflow-hidden border border-[color:var(--md-sys-color-outline-variant)]/50 bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-3)] p-4">
                  <img
                    src="/assets/images/liveness-detection-4.jpg"
                    alt="تشخیص زنده بودن"
                    className="w-full h-auto rounded-2xl object-cover"
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative max-w-3xl space-y-3 text-right"
            >
              <Typography variant="h3" className="leading-tight">
                قابلیت‌های پیشرفته برای تشخیص زنده بودن
              </Typography>
              <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8">
                پوشش امنیت، سرعت، دقت و مقاومت در برابر حملات جعل برای اطمینان از زنده بودن کاربر
              </Typography>
            </motion.div>

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
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20" dir="rtl">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-right"
              >
                <Typography variant="h3" className="mb-6">
                  الگوریتم پیشرفته تشخیص زنده بودن
                </Typography>
                <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] mb-6" dir="rtl">
                  سیستم ما با استفاده از شبکه‌های عصبی عمیق و تحلیل چندلایه، حرکات طبیعی چهره،
                  بافت پوست، و نشانه‌های حیاتی را بررسی می‌کند تا اطمینان حاصل کند که فرد در مقابل
                  دوربین به صورت زنده حضور دارد.
                </Typography>
                <ul className="space-y-3 text-right" dir="rtl">
                  {["تحلیل micro-expressions چهره", "بررسی بافت و عمق تصویر", "شناسایی حرکات طبیعی"].map((item) => (
                    <li key={item} className="flex flex-row-reverse items-center gap-3 justify-end text-right w-full" dir="rtl">
                      <span className="text-[color:var(--md-sys-color-on-surface)]">{item}</span>
                      <div className="w-6 h-6 rounded-full bg-[color:var(--md-sys-color-primary)]/12 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-[color:var(--md-sys-color-primary)]" />
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/assets/images/liveness-detection-2.jpg"
                    alt="تحلیل زنده بودن"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-2 lg:order-1"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/assets/images/liveness-detection-3.jpg"
                    alt="مقابله با جعل"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2 text-right"
              >
                <Typography variant="h3" className="mb-6">
                  محافظت در برابر حملات
                </Typography>
                <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
                  سیستم ما قادر به شناسایی انواع حملات spoofing از جمله تصاویر چاپی، نمایش ویدیو،
                  ماسک‌های سه‌بعدی و deep fake می‌باشد. با استفاده از تکنولوژی‌های پیشرفته، امنیت
                  سیستم احراز هویت شما تضمین می‌شود.
                </Typography>
                <div className="space-y-4">
                  <Card className="border-r-4 border-r-[color:var(--md-sys-color-primary)] shadow-md">
                    <CardContent className="pt-6">
                      <Typography variant="h6" className="mb-2">
                        تشخیص تصاویر ساختگی
                      </Typography>
                      <Typography variant="body-sm" className="text-[color:var(--md-sys-color-on-surface-variant)]">
                        شناسایی تصاویر چاپی، نمایشگرها و ماسک‌ها
                      </Typography>
                    </CardContent>
                  </Card>
                  <Card className="border-r-4 border-r-[color:var(--md-sys-color-tertiary)] shadow-md">
                    <CardContent className="pt-6">
                      <Typography variant="h6" className="mb-2">
                        محافظت از deep fake
                      </Typography>
                      <Typography variant="body-sm" className="text-[color:var(--md-sys-color-on-surface-variant)]">
                        شناسایی ویدیوهای دستکاری شده و محتوای جعلی
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-right"
              >
                <Typography variant="h3" className="mb-6">
                  یکپارچه‌سازی ساده و سریع
                </Typography>
                <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] mb-6">
                  API استاندارد RESTful ما امکان یکپارچه‌سازی آسان با برنامه‌های موبایل و وب را فراهم
                  می‌کند. SDK های آماده برای iOS، Android و Web در دسترس هستند.
                </Typography>
                <Button variant="monochrome" className="rounded-full px-8 shadow-[var(--elevation-2)]">
                  مشاهده مستندات
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
                      نمونه درخواست API
                    </Typography>
                    <Typography variant="body-sm" className="text-[color:var(--md-sys-color-on-surface-variant)]">
                      نمونه ساده برای ارسال درخواست احراز زنده بودن
                    </Typography>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-2xl bg-slate-900 text-green-300 font-mono text-sm p-5 shadow-inner" dir="ltr">
                      <div className="mb-2">curl -X POST \</div>
                      <div className="mb-2 pl-4">https://api.example.com/liveness \</div>
                      <div className="mb-2 pl-4">-H "Authorization: Bearer TOKEN" \</div>
                      <div className="pl-4">-F "video=@selfie.mp4"</div>
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
