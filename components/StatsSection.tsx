"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, ScanFace, ShieldCheck, Zap } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { cn } from "../lib/utils";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Card, CardContent, CardHeader } from "./ui/Card";

type StatItem = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const statsData: Record<Language, StatItem[]> = {
  [Language.EN]: [
    {
      title: "Security & privacy",
      description:
        "All data is processed and stored with strong encryption and in line with international security standards. No unauthorized access to sensitive information is possible.",
      icon: ShieldCheck,
    },
    {
      title: "Speed & accuracy",
      description:
        "With advanced AI algorithms, verification completes in under 5 seconds. Face recognition accuracy is over 98% and the verification error rate is below 1%.",
      icon: Zap,
    },
    {
      title: "Spoofing protection",
      description:
        "Advanced liveness checks prevent the use of spoofed images or videos. Our system reliably distinguishes real faces from fabricated content.",
      icon: ScanFace,
    },
    {
      title: "Integration & scalability",
      description:
        "Our SDKs integrate easily with banking, financial, and government systems. The platform is designed to process millions of requests at any moment.",
      icon: Globe,
    },
  ],
  [Language.FA]: [
    {
      title: "امنیت و حریم خصوصی",
      description:
        "تمامی داده‌ها با رمزنگاری پیشرفته و مطابق با استانداردهای امنیتی بین‌المللی پردازش و ذخیره می‌شوند. هیچ‌گونه دسترسی بدون مجوز به اطلاعات حساس امکان‌پذیر نیست.",
      icon: ShieldCheck,
    },
    {
      title: "سرعت و دقت",
      description:
        "با استفاده از الگوریتم‌های هوش مصنوعی پیشرفته، احراز هویت در کمتر از ۵ ثانیه انجام می‌شود. دقت تشخیص چهره بیش از ۹۸٪ و خطای تأیید کمتر از ۱٪ است.",
      icon: Zap,
    },
    {
      title: "حفاظت در برابر جعل چهره",
      description:
        "با فناوری پیشرفته تشخیص چهره زنده، از استفاده از تصاویر یا ویدیوهای جعلی جلوگیری می‌شود. سیستم ما تفاوت چهره واقعی و تصاویر ساختگی را با دقت بالا شناسایی می‌کند.",
      icon: ScanFace,
    },
    {
      title: "یکپارچگی و مقیاس‌پذیری",
      description:
        "رابط‌ها و بسته‌های توسعه ما به‌سادگی با سامانه‌های بانکی، مالی و دولتی ادغام می‌شوند. پلتفرم به‌گونه‌ای طراحی شده است که توان پردازش میلیون‌ها درخواست در هر لحظه را دارد.",
      icon: Globe,
    },
  ],
};

export function StatsSection() {
  const { language, dir } = useLanguage();
  const stats = statsData[language];
  const isRtl = dir === "rtl";

  return (
    <Section spacing="md" dir={dir}>
      <Container className="space-y-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.45, ease: "easeOut" }}
              >
                <Card
                  variant="filled"
                  className="group h-full border-border/35 bg-card/60 backdrop-blur-sm hover:border-foreground/25 hover:bg-card/80 hover:shadow-[var(--elevation-3)]"
                >
                  <CardHeader
                    className="flex-row items-start gap-3 space-y-0 p-7 pb-0"
                    dir={dir}
                  >
                    <motion.span
                      className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:shadow-[var(--elevation-2)]"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <Icon className="h-7 w-7" />
                    </motion.span>

                    <div className={cn("flex-1 pt-1", isRtl ? "text-right" : "text-left")}>
                      <h3 className="text-base font-semibold leading-tight text-foreground">
                        {stat.title}
                      </h3>
                    </div>
                  </CardHeader>

                  <CardContent className="p-7 pt-4">
                    <p
                      className={cn(
                        "text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground",
                        isRtl ? "text-right" : "text-left"
                      )}
                    >
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
