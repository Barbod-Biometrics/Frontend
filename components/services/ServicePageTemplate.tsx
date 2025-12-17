"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { cn } from "../../lib/utils";
import { Language } from "../../types";
import { Button } from "../ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/Card";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";
import { Typography } from "../ui/Typography";
import type { ServicePageContentByLanguage } from "./serviceContent";

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
  const ctaIcon = isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />;

  return (
    <Section spacing="lg" dir={dir} className={isFa ? "font-vazirmatn" : ""}>
      <Container size="lg" className="space-y-10">
        <div className="relative overflow-hidden rounded-[28px] border border-border/35 bg-card/60 p-8 shadow-[var(--elevation-2)] backdrop-blur-sm sm:p-10">
          <div className="pointer-events-none absolute inset-0 opacity-60 [background:radial-gradient(circle_at_20%_20%,color-mix(in_srgb,var(--md-sys-color-primary)_18%,transparent),transparent_55%),radial-gradient(circle_at_80%_30%,color-mix(in_srgb,var(--md-sys-color-tertiary)_16%,transparent),transparent_50%)]" />
          <div
            className={cn(
              "relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between",
              isRtl ? "text-right" : "text-left"
            )}
          >
            <div className="max-w-3xl space-y-3">
              <Typography variant="h2" className="text-foreground">
                {data.title}
              </Typography>
              <Typography variant="body-lg" className="text-muted-foreground">
                {data.subtitle}
              </Typography>
            </div>

            <Link href={data.cta.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full rounded-full px-10 sm:w-auto"
                iconTrailing={ctaIcon}
              >
                {data.cta.label}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <Card
            variant="filled"
            className="border-border/35 bg-card/60 shadow-[var(--elevation-1)] backdrop-blur-sm"
          >
            <CardHeader className="p-7 pb-0">
              <CardTitle className="text-xl">{isFa ? "توضیحات" : "Overview"}</CardTitle>
              <CardDescription>{isFa ? "تصویر کلی از سرویس" : "What this service delivers"}</CardDescription>
            </CardHeader>
            <CardContent className="p-7 pt-4">
              <p
                className={cn(
                  "text-sm leading-relaxed text-muted-foreground",
                  isRtl ? "text-right" : "text-left"
                )}
              >
                {data.description}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            {data.features.map((feature) => (
              <Card
                key={feature.title}
                variant="filled"
                className="h-full border-border/35 bg-card/60 backdrop-blur-sm"
              >
                <CardHeader
                  className={cn(
                    "flex-row items-start gap-3 space-y-0 p-6 pb-0",
                    isRtl && "flex-row-reverse"
                  )}
                  dir={dir}
                >
                  <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Check className="h-5 w-5" />
                  </span>
                  <div className={cn("flex-1", isRtl ? "text-right" : "text-left")}>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <p
                    className={cn(
                      "text-sm leading-relaxed text-muted-foreground",
                      isRtl ? "text-right" : "text-left"
                    )}
                  >
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

