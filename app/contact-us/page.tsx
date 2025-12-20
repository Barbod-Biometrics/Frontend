"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

import { ContactAccessSection } from "../../components/ContactAccessSection";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Container } from "../../components/ui/Container";
import { Section } from "../../components/ui/Section";
import { Typography } from "../../components/ui/Typography";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

const MAP_LINK =
  "https://www.google.com/maps/place/School+of+Computer+Engineering,+Iran+University+of+Science+and+Technology,+Tehran";

const heroCopy: Record<Language, { badge: string; title: string; subtitle: string; mapCta: string; salesCta: string }> =
{
  [Language.EN]: {
    badge: "We are here to help",
    title: "Contact Barbod",
    subtitle:
      "Find us at Iran University of Science and Technology, School of Computer Engineering. Reach out for tailored packages, onboarding, or quick support.",
    mapCta: "See location",
    salesCta: "Talk to sales",
  },
  [Language.FA]: {
    badge: "در کنار شما هستیم",
    title: "تماس با باربد",
    subtitle:
      "ما در دانشگاه علم و صنعت ایران، دانشکده مهندسی کامپیوتر مستقر هستیم. برای بسته اختصاصی، راه‌اندازی یا پشتیبانی سریع با ما در تماس باشید.",
    mapCta: "مشاهده روی نقشه",
    salesCta: "گفت‌وگو با فروش",
  },
};

const highlightCopy: Record<
  Language,
  { label: string; value: string; sub: string }[]
> = {
  [Language.EN]: [
    { label: "Campus", value: "IUST, School of Computer Engineering", sub: "Tehran, Resalat Hwy, Hengam St" },
    { label: "Hours", value: "Sat–Wed, 09:00–18:00", sub: "Local Tehran time" },
    { label: "Support", value: "support@barbod.ir", sub: "+98 21 7723 2560" },
  ],
  [Language.FA]: [
    { label: "محل استقرار", value: "دانشگاه علم و صنعت، دانشکده مهندسی کامپیوتر", sub: "تهران، رسالت، هنگام" },
    { label: "ساعات پاسخ‌گویی", value: "شنبه تا چهارشنبه، ۹ تا ۱۸", sub: "به وقت تهران" },
    { label: "پشتیبانی", value: "support@barbod.ir", sub: "۰۲۱-۷۷۲۳۲۵۶۰" },
  ],
};

export default function ContactUsPage() {
  const { language, dir } = useLanguage();
  const copy = heroCopy[language];
  const isFa = language === Language.FA;

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        <Section className="overflow-hidden" dir={dir}>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.08),transparent_35%)] blur-3xl" />
          <Container className="relative flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-cyan)]" />
              {copy.badge}
            </div>
            <Card
              variant="filled"
              className={`grid gap-8 border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)]/80 p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] ${
                isFa ? "text-right" : "text-left"
              }`}
            >
              <div className="space-y-4">
                <Typography variant="h2" className="leading-tight">
                  {copy.title}
                </Typography>
                <Typography
                  variant="body-lg"
                  className="max-w-3xl text-[color:var(--text-secondary)]"
                >
                  {copy.subtitle}
                </Typography>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="lg"
                    className="rounded-xl bg-gradient-to-r from-[color:var(--brand-azure)] to-[color:var(--brand-cyan)] px-6 text-white shadow-[var(--shadow-sm)] hover:brightness-110"
                    type="button"
                    onClick={() => window.open(MAP_LINK, "_blank", "noopener,noreferrer")}
                  >
                    {copy.mapCta}
                  </Button>
                  <Link href="/contact-sales">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="rounded-xl border border-[color:var(--border-subtle)] px-6"
                    >
                      {copy.salesCta}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </Container>
        </Section>

        <div id="contact-map">
          <ContactAccessSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
