"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Users, Globe } from "lucide-react";
import { useLanguage } from "../lib/useLanguage";
import { Language } from "../types";
import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
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
    { value: "99.99%", label: "دقت", description: "بالاترین دقت در صنعت", icon: ShieldCheck },
    { value: "<100ms", label: "تاخیر", description: "تایید آنی و بلادرنگ", icon: Zap },
    { value: "10M+", label: "شناسه", description: "زیرساخت مقیاس‌پذیر", icon: Users },
    { value: "50+", label: "کشور", description: "انطباق جهانی", icon: Globe },
  ],
};

export function StatsSection() {
  const { language, dir } = useLanguage();
  const stats = statsData[language];
  const isFa = language === Language.FA;

  return (
    <Section spacing="md" dir={dir}>
      <Container className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} variant="filled" className="h-full group cursor-pointer">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4, ease: "easeOut" }}
                  whileHover={{
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                  className="flex flex-col gap-4 p-7 h-full"
                >
                  <div className="flex items-center gap-3" dir={dir}>
                    <motion.span
                      className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-surface-container-low)] text-[color:var(--md-sys-color-primary)] transition-all duration-300 group-hover:bg-[color:var(--md-sys-color-primary)] group-hover:text-[color:var(--md-sys-color-on-primary)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                      <Icon className="h-8 w-8" />
                    </motion.span>
                    <div className="text-base font-semibold uppercase tracking-[0.08em] text-[color:var(--md-sys-color-on-surface-variant)] transition-colors duration-300 group-hover:text-[color:var(--md-sys-color-on-surface)]">
                      {stat.label}
                    </div>
                  </div>

                  <div className={`text-5xl font-bold text-[color:var(--md-sys-color-on-surface)] transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-[color:var(--md-sys-color-primary)] group-hover:to-[color:var(--md-sys-color-tertiary)] group-hover:bg-clip-text group-hover:text-transparent ${isFa ? 'text-right' : ''}`}>
                    {stat.value}
                  </div>

                  <p className={`text-base text-[color:var(--md-sys-color-on-surface-variant)] transition-colors duration-300 group-hover:text-[color:var(--md-sys-color-on-surface)] ${isFa ? 'text-right' : ''}`}>{stat.description}</p>
                </motion.div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
