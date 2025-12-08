"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BarChart3, Bolt, Check, FileText, Layers, Shield, Sparkles, UserCheck, ScanFace } from "lucide-react";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Language, Theme } from "../../types";
import { Container } from "../ui/Container";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Typography } from "../ui/Typography";
import { resolveCopy, ServiceContent } from "./serviceContent";
import { ServiceVisual } from "./ServiceVisual";

interface ServicePageTemplateProps {
  content: ServiceContent;
  language: Language;
  dir: "ltr" | "rtl";
}

const iconMap = {
  shield: Shield,
  bolt: Bolt,
  user: UserCheck,
  chart: BarChart3,
  spark: Sparkles,
  doc: FileText,
  layers: Layers,
};

export function ServicePageTemplate({ content, language, dir }: ServicePageTemplateProps) {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const { hero, features, steps, pricing, finalCta, accent } = content;
  const isFa = language === Language.FA;

  const ctaIcon = dir === "rtl" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />;

  const renderIcon = (name: keyof typeof iconMap) => {
    const Icon = iconMap[name];
    return <Icon className="w-6 h-6 text-[color:var(--md-sys-color-primary)]" />;
  };

  const accentShadow = useMemo(
    () => ({
      boxShadow: `0 30px 80px ${accent.to}33`,
    }),
    [accent]
  );

  return (
    <div className={`${isFa ? "font-vazirmatn" : ""}`}>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[color:var(--md-sys-color-surface)] via-[color:var(--md-sys-color-surface)] to-[color:var(--md-sys-color-surface-container)]">
        <Container>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`} dir={dir}>
            <div className={`flex flex-col gap-6 ${dir === "rtl" ? "lg:order-2" : ""}`}>
              {hero.eyebrow && (
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[color:var(--md-sys-color-surface-container-high)] shadow-[var(--elevation-1)] w-fit"
                >
                  <Sparkles className="w-4 h-4 text-[color:var(--md-sys-color-primary)]" />
                  {resolveCopy(hero.eyebrow, language)}
                </span>
              )}
              <Typography variant="h2" className="leading-tight">
                {resolveCopy(hero.title, language)}
              </Typography>
              <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] max-w-2xl leading-8">
                {resolveCopy(hero.description, language)}
              </Typography>

              <div className={`flex flex-wrap items-center gap-3 ${dir === "rtl" ? "justify-end" : ""}`}>
                <Button size="lg" className="h-12 rounded-full px-8 shadow-[var(--elevation-2)]" iconTrailing={ctaIcon}>
                  {resolveCopy(hero.primaryCta, language)}
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="h-12 rounded-full px-7 shadow-[var(--elevation-1)] border border-[color:var(--md-sys-color-outline-variant)]/50"
                  iconTrailing={ctaIcon}
                >
                  {resolveCopy(hero.secondaryCta, language)}
                </Button>
              </div>
            </div>

            <div className={`${dir === "rtl" ? "lg:order-1" : ""}`}>
              <ServiceVisual variant={hero.visual} accentFrom={accent.from} accentTo={accent.to} theme={theme || Theme.LIGHT} />
            </div>
          </div>
        </Container>
      </section>

      {/* Feature cards */}
      <section className="py-16 md:py-22 bg-[color:var(--md-sys-color-surface-container)]">
        <Container>
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}>
            {features.map((feature, idx) => (
              <Card
                key={idx}
                hover
                className="p-6 md:p-7 rounded-3xl bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-2)] border border-[color:var(--md-sys-color-outline-variant)]/30 flex flex-col gap-3 min-h-[220px]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-[color:var(--md-sys-color-surface-container-high)] flex items-center justify-center shadow-[var(--elevation-1)]">
                    {renderIcon(feature.icon)}
                  </div>
                  <Typography variant="h6" className="leading-tight">
                    {resolveCopy(feature.title, language)}
                  </Typography>
                </div>
                <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7">
                  {resolveCopy(feature.description, language)}
                </Typography>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Steps / process */}
      <section className="py-18 md:py-24 bg-[color:var(--md-sys-color-surface)]">
        <Container>
          <div className="space-y-16">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              const swap = dir === "rtl" ? !isEven : isEven;

              return (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center"
                  dir={dir}
                >
                  <div className={swap ? "md:order-2" : ""}>
                    <div className="inline-flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-[color:var(--md-sys-color-primary)]/10 flex items-center justify-center text-[color:var(--md-sys-color-primary)]">
                        <Check className="w-5 h-5" />
                      </div>
                      <Typography variant="h4" className="leading-tight">
                        {resolveCopy(step.title, language)}
                      </Typography>
                    </div>
                    <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8 max-w-2xl">
                      {resolveCopy(step.description, language)}
                    </Typography>
                  </div>

                  <div className={swap ? "md:order-1" : ""}>
                    <ProcessVisual visual={step.visual} accent={accent} />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Pricing */}
      <section className="py-18 md:py-24 bg-[color:var(--md-sys-color-surface-container)]">
        <Container>
          <div className="text-center mb-12" dir={dir}>
            <Typography variant="h3" className="mb-3">
              {resolveCopy(pricing.title, language)}
            </Typography>
            <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)]">
              {resolveCopy(pricing.note, language)}
            </Typography>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-[var(--elevation-3)] bg-[color:var(--md-sys-color-surface)] border border-[color:var(--md-sys-color-outline-variant)]/30">
            <div
              className="hidden md:grid grid-cols-4 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] px-6 py-4"
              style={{ background: `linear-gradient(90deg, ${accent.from}22, ${accent.to}22)` }}
            >
              <span className="text-center">{resolveCopy({ en: "Plan", fa: "پلن" }, language)}</span>
              <span className="text-center">{resolveCopy({ en: "Capabilities", fa: "امکانات" }, language)}</span>
              <span className="text-center">{resolveCopy({ en: "Monthly requests", fa: "تعداد درخواست ماهانه" }, language)}</span>
              <span className="text-center">{resolveCopy({ en: "Price", fa: "قیمت" }, language)}</span>
            </div>

            <div className="divide-y divide-[color:var(--md-sys-color-outline-variant)]/30">
              {pricing.plans.map((plan, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-4 gap-3 px-6 py-5 items-center text-[color:var(--md-sys-color-on-surface)]"
                >
                  <div className="text-center md:text-left font-semibold">{resolveCopy(plan.name, language)}</div>
                  <div className="text-center md:text-left text-[color:var(--md-sys-color-on-surface-variant)]">
                    {resolveCopy(plan.features, language)}
                  </div>
                  <div className="text-center md:text-left text-[color:var(--md-sys-color-on-surface-variant)]">
                    {resolveCopy(plan.requests, language)}
                  </div>
                  <div className="text-center md:text-left font-semibold">{resolveCopy(plan.price, language)}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-22 bg-[color:var(--md-sys-color-surface)]">
        <Container>
          <Card
            className="p-10 md:p-12 rounded-[28px] shadow-[var(--elevation-3)] bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)]/30"
            style={accentShadow}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6" dir={dir}>
              <div className="md:col-span-2 space-y-3">
                <Typography variant="h4">{resolveCopy(finalCta.title, language)}</Typography>
                <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7">
                  {resolveCopy(finalCta.description, language)}
                </Typography>
              </div>
              <div className={`flex gap-3 ${dir === "rtl" ? "justify-start" : "justify-end"}`}>
                <Button size="lg" className="h-12 rounded-full px-8 shadow-[var(--elevation-2)]">
                  {resolveCopy(finalCta.primary, language)}
                </Button>
                {finalCta.secondary && (
                  <Button variant="secondary" size="lg" className="h-12 rounded-full px-7 border border-[color:var(--md-sys-color-outline-variant)]/40">
                    {resolveCopy(finalCta.secondary, language)}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Container>
      </section>
    </div>
  );
}

interface ProcessVisualProps {
  visual: "analysis" | "shield" | "document" | "compare" | "scan";
  accent: { from: string; to: string };
}

function ProcessVisual({ visual, accent }: ProcessVisualProps) {
  const gradient = `linear-gradient(135deg, ${accent.from}, ${accent.to})`;

  if (visual === "document") {
    return (
      <div className="relative h-full w-full rounded-[28px] p-6 shadow-[var(--elevation-2)] bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)]/40">
        <div className="absolute inset-0 rounded-[28px]" style={{ background: `${gradient}`, opacity: 0.08 }} />
        <div className="relative space-y-3">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="h-3 rounded-full bg-[color:var(--md-sys-color-on-surface)]/10"
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <div className="grid grid-cols-3 gap-3 pt-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-2xl bg-[color:var(--md-sys-color-on-surface-variant)]/10 border border-[color:var(--md-sys-color-outline-variant)]/30"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (visual === "shield") {
    return (
      <div
        className="relative h-full w-full rounded-[28px] overflow-hidden shadow-[var(--elevation-2)]"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 opacity-25 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 flex items-center justify-center p-10">
          <div className="relative w-40 h-40">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-3xl border border-white/50"
                initial={{ scale: 0.8 + i * 0.05, opacity: 0.5 }}
                animate={{ scale: 1.05 + i * 0.05, opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
              />
            ))}
            <motion.div
              className="absolute inset-8 rounded-2xl bg-white/15 backdrop-blur-2xl border border-white/30 flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              animate={{ scale: [0.96, 1.02, 0.96] }}
              transition={{ duration: 2.1, repeat: Infinity }}
            >
              <Shield className="w-14 h-14 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (visual === "compare") {
    return (
      <div className="relative h-full w-full rounded-[28px] p-6 shadow-[var(--elevation-2)] bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)]/40">
        <div className="absolute inset-0 rounded-[28px]" style={{ background: gradient, opacity: 0.08 }} />
        <div className="relative grid grid-cols-2 gap-4">
          {[0, 1].map((side) => (
            <div
              key={side}
              className="rounded-2xl bg-[color:var(--md-sys-color-surface)] border border-[color:var(--md-sys-color-outline-variant)]/30 p-4 space-y-3 shadow-[var(--elevation-1)]"
            >
              <div className="w-full h-32 rounded-xl bg-[color:var(--md-sys-color-on-surface-variant)]/10" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-3 rounded-full bg-[color:var(--md-sys-color-on-surface-variant)]/20" />
              ))}
            </div>
          ))}
          <motion.div
            className="absolute inset-y-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-[color:var(--md-sys-color-primary)]/15 border border-[color:var(--md-sys-color-primary)]/40 flex items-center justify-center"
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            <Sparkles className="w-8 h-8 text-[color:var(--md-sys-color-primary)]" />
          </motion.div>
        </div>
      </div>
    );
  }

  if (visual === "scan") {
    return (
      <div
        className="relative h-full w-full rounded-[28px] overflow-hidden shadow-[var(--elevation-2)]"
        style={{ background: gradient }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-56 h-56 rounded-[30px] bg-white/15 backdrop-blur-2xl border border-white/30 shadow-[0_25px_60px_rgba(0,0,0,0.25)] flex items-center justify-center"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ScanFace className="w-16 h-16 text-white drop-shadow-lg" />
          </motion.div>
        </div>
      </div>
    );
  }

  // analysis fallback
  return (
    <div className="relative h-full w-full rounded-[28px] p-6 shadow-[var(--elevation-2)] bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)]/40">
      <div className="absolute inset-0 rounded-[28px]" style={{ background: gradient, opacity: 0.08 }} />
      <div className="relative grid grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            className="h-24 rounded-2xl bg-[color:var(--md-sys-color-on-surface-variant)]/10 border border-[color:var(--md-sys-color-outline-variant)]/20"
            animate={{ y: [0, -4, 0], opacity: [0.9, 1, 0.9] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
}
