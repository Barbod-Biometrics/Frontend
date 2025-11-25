"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, Globe } from "lucide-react";
import { useLanguage } from "../lib/useLanguage";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Typography } from "./ui/Typography";
import { Card } from "./ui/Card";

interface Stat {
  value: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

const statsData: Record<Language, Stat[]> = {
  [Language.EN]: [
    { value: "99.99%", label: "Accuracy", description: "Industry-leading precision", icon: ShieldCheck },
    { value: "<100ms", label: "Latency", description: "Real-time verification", icon: Zap },
    { value: "10M+", label: "Identities", description: "Scalable architecture", icon: Users },
    { value: "50+", label: "Countries", description: "Global compliance", icon: Globe },
  ],
  [Language.FA]: [
    { value: "۹۹٫۹۹٪", label: "دقت", description: "دقت پیشرو در صنعت", icon: ShieldCheck },
    { value: "<۱۰۰ms", label: "تأخیر", description: "احراز هویت آنی", icon: Zap },
    { value: "۱۰M+", label: "هویت", description: "معماری مقیاس‌پذیر", icon: Users },
    { value: "۵۰+", label: "کشور", description: "پشتیبانی جهانی", icon: Globe },
  ],
};

export function StatsSection() {
  const { language, dir } = useLanguage();
  const stats = statsData[language];

  return (
    <Section spacing="xl" dir={dir}>
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                <div className="group relative">
                  {/* Clean elevated card */}
                  <div className="bg-[color:var(--md-sys-color-surface-container-low)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Subtle state layer */}
                    <div className="absolute inset-0 bg-[color:var(--md-sys-color-primary)] opacity-0 group-hover:opacity-[0.04] rounded-2xl transition-opacity duration-300" />

                    <div className="relative space-y-3">
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-[color:var(--md-sys-color-primary-container)] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-[color:var(--md-sys-color-on-primary-container)]" />
                      </div>

                      {/* Value - Large but not excessive */}
                      <div dir="ltr">
                        <span className="text-4xl font-bold text-[color:var(--md-sys-color-primary)] block leading-none">
                          {stat.value}
                        </span>
                      </div>

                      {/* Label */}
                      <h3 className="text-lg font-semibold text-[color:var(--md-sys-color-on-surface)]">
                        {stat.label}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)] leading-relaxed">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
