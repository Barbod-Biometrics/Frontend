"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import React from "react";

import { cn } from "../../lib/utils";
import { Language } from "../../types";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { Typography } from "../ui/Typography";
import type {
  ServiceCta,
  ServiceFeature,
  ServiceHighlight,
  ServicePageContentByLanguage,
  ServiceVisual,
} from "./serviceContent";

export function ServicePageTemplate({
  content,
  language,
  dir,
}: {
  content: ServicePageContentByLanguage;
  language: Language;
  dir: "rtl" | "ltr";
}) {
  const isFa = language === Language.FA;
  const isRtl = dir === "rtl";
  const data = content[language] ?? content[Language.EN];
  const ctaArrow = isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <Section
      spacing="xl"
      dir={dir}
      className={cn(
        "bg-gradient-to-b from-[color:var(--md-sys-color-surface)] to-[color:var(--md-sys-color-background)]",
        isFa && "font-vazirmatn"
      )}
    >
      <Container size="xl" className="space-y-14 lg:space-y-16">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr,0.95fr]">
          <div className={cn("order-2 space-y-6 lg:order-1", isRtl ? "text-right" : "text-left")}>
            <Typography variant="h2" className="leading-tight text-[color:var(--md-sys-color-on-surface)]">
              {data.hero.title}
            </Typography>
            <Typography
              variant="body-lg"
              className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8"
            >
              {data.hero.description}
            </Typography>

            <div
              className={cn(
                "flex flex-wrap gap-3",
                isRtl ? "justify-end lg:justify-start lg:flex-row-reverse" : "justify-start"
              )}
            >
              <Link href={data.hero.primaryCta.href} className="inline-flex">
                <Button size="lg" className="rounded-full px-8 h-12">
                  {data.hero.primaryCta.label}
                </Button>
              </Link>
              <Link href={data.hero.secondaryCta.href} className="inline-flex">
                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-8 h-12"
                  iconTrailing={ctaArrow}
                >
                  {data.hero.secondaryCta.label}
                </Button>
              </Link>
            </div>
          </div>

          <GradientVisual visual={data.hero.visual} className="order-1 lg:order-2 min-h-[360px]" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {data.features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} dir={dir} />
          ))}
        </div>

        <div className="space-y-10 lg:space-y-12">
          {data.highlights.map((highlight, idx) => (
            <HighlightRow key={`${highlight.title}-${idx}`} highlight={highlight} dir={dir} ctaArrow={ctaArrow} />
          ))}
        </div>

        <BottomCta
          title={data.bottomCta.title}
          detail={data.bottomCta.detail}
          secondaryDetail={data.bottomCta.secondaryDetail}
          primary={data.bottomCta.primary}
          secondary={data.bottomCta.secondary}
          dir={dir}
        />
      </Container>
    </Section>
  );
}

function GradientVisual({ visual, className }: { visual: ServiceVisual; className?: string }) {
  const Icon = visual.icon ?? Sparkles;
  const accent = visual.accent ?? visual.to;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-[color:var(--md-sys-color-outline-variant)] bg-card/70 shadow-[var(--elevation-2)]",
        className
      )}
    >
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${visual.from}, ${visual.to})` }} />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${accent}33, transparent 45%), radial-gradient(circle at 80% 30%, ${accent}25, transparent 45%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.25), transparent 45%)`,
        }}
      />
      <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute -left-16 -bottom-20 h-64 w-64 rounded-full blur-3xl" style={{ background: accent, opacity: 0.35 }} />
      <div className="absolute -right-20 -top-24 h-56 w-56 rounded-full blur-3xl" style={{ background: "#ffffff", opacity: 0.18 }} />

      <div className="relative z-10 flex h-full items-center justify-center p-12">
        <div className="grid place-items-center gap-3">
          <div className="flex items-center justify-center rounded-3xl bg-white/15 p-6 backdrop-blur-md shadow-[var(--elevation-3)]">
            <Icon className="h-16 w-16 text-white drop-shadow-lg" />
          </div>
          <div className="h-1.5 w-28 rounded-full bg-white/60 shadow-[0_0_14px_rgba(255,255,255,0.4)]" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ feature, dir }: { feature: ServiceFeature; dir: "rtl" | "ltr" }) {
  const Icon = feature.icon;
  const isRtl = dir === "rtl";

  return (
    <Card className="h-full border border-border/30 bg-card/70 shadow-[var(--elevation-1)] backdrop-blur-sm">
      <CardHeader className="flex-row items-start gap-4 space-y-0 p-6 pb-2" dir={dir}>
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--md-sys-color-surface-variant)] text-foreground shadow-[var(--elevation-1)]">
          <Icon className="h-6 w-6" />
        </span>
        <div className={cn("flex-1 pt-1", isRtl ? "text-right" : "text-left")}>
          <CardTitle className="text-base font-semibold leading-tight">{feature.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-2">
        <p
          className={cn(
            "text-sm leading-relaxed text-[color:var(--md-sys-color-on-surface-variant)]",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
}

function HighlightRow({
  highlight,
  dir,
  ctaArrow,
}: {
  highlight: ServiceHighlight;
  dir: "rtl" | "ltr";
  ctaArrow: React.ReactNode;
}) {
  const isRtl = dir === "rtl";
  const visualFirst = highlight.align === "left";

  const textBlock = (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border border-[color:var(--md-sys-color-outline-variant)] bg-card/70 p-6 shadow-[var(--elevation-2)] backdrop-blur-sm",
        isRtl ? "text-right" : "text-left"
      )}
    >
      <div
        className={cn(
          "absolute top-6 bottom-6 w-1 rounded-full bg-gradient-to-b from-[color:var(--md-sys-color-primary)] to-[color:var(--md-sys-color-tertiary)]",
          isRtl ? "right-4" : "left-4",
          "hidden md:block"
        )}
      />
      <div className={cn("space-y-4", isRtl ? "pr-6 md:pr-10" : "pl-6 md:pl-10")}>
        <Typography variant="h3" className="text-[color:var(--md-sys-color-on-surface)] leading-tight">
          {highlight.title}
        </Typography>
        <Typography
          variant="body-md"
          className="text-[color:var(--md-sys-color-on-surface-variant)] leading-8"
        >
          {highlight.description}
        </Typography>
        {highlight.cta ? (
          <Link href={highlight.cta.href} className="inline-flex">
            <Button
              variant={highlight.cta.variant ?? "secondary"}
              className="rounded-full px-7 h-11"
              iconTrailing={ctaArrow}
            >
              {highlight.cta.label}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );

  return (
    <div className="grid items-center gap-6 lg:grid-cols-2">
      {visualFirst ? (
        <>
          <GradientVisual visual={highlight.visual} className="min-h-[280px]" />
          {textBlock}
        </>
      ) : (
        <>
          {textBlock}
          <GradientVisual visual={highlight.visual} className="min-h-[280px]" />
        </>
      )}
    </div>
  );
}

function BottomCta({
  title,
  detail,
  secondaryDetail,
  primary,
  secondary,
  dir,
}: {
  title: string;
  detail: string;
  secondaryDetail: string;
  primary: ServiceCta;
  secondary: ServiceCta;
  dir: "rtl" | "ltr";
}) {
  const isRtl = dir === "rtl";

  return (
    <div className="relative overflow-hidden rounded-[26px] border border-[color:var(--md-sys-color-outline-variant)] bg-card/80 shadow-[var(--elevation-3)]">
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--md-sys-color-surface)] via-[color:var(--md-sys-color-surface-container)] to-[color:var(--md-sys-color-surface)]" />
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_30%,rgba(14,165,233,0.18),transparent_50%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_48%)]" />
      <div className="relative grid items-center gap-8 p-8 md:p-10 lg:grid-cols-2">
        <div className={cn("space-y-4", isRtl ? "text-right" : "text-left")}>
          <Typography variant="h3" className="text-[color:var(--md-sys-color-on-surface)] leading-tight">
            {title}
          </Typography>
          <Typography
            variant="body-md"
            className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
          >
            {detail}
          </Typography>
          <Link href={primary.href} className="inline-flex">
            <Button size="lg" className="rounded-full px-8 h-12" variant={primary.variant ?? "primary"}>
              {primary.label}
            </Button>
          </Link>
        </div>

        <div
          className={cn(
            "space-y-4 rounded-[20px] border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)]/70 p-6 shadow-[var(--elevation-2)] backdrop-blur-sm",
            isRtl ? "text-right" : "text-left"
          )}
        >
          <Typography
            variant="body-md"
            className="text-[color:var(--md-sys-color-on-surface-variant)] leading-7"
          >
            {secondaryDetail}
          </Typography>
          <Link href={secondary.href} className="inline-flex">
            <Button variant={secondary.variant ?? "secondary"} size="lg" className="rounded-full px-8 h-12">
              {secondary.label}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
