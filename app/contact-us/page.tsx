"use client";

import Link from "next/link";
import { MapPin, PhoneCall, Sparkles } from "lucide-react";

import { ContactAccessSection } from "../../components/ContactAccessSection";
import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

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
  const { language } = useLanguage();
  const copy = heroCopy[language];
  const isFa = language === Language.FA;

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(6,182,212,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.08),transparent_35%)] blur-3xl" />
          <div className="relative mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-14 sm:px-6 lg:px-12">
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-cyan)]" />
              {copy.badge}
            </div>
            <div
              className={`grid gap-8 rounded-[28px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)]/80 p-6 shadow-[var(--shadow-lg)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] ${isFa ? "text-right" : "text-left"
                }`}
            >
              <div className="space-y-4">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl">{copy.title}</h1>
                <p className="max-w-3xl text-lg leading-relaxed text-[color:var(--text-secondary)]">{copy.subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact-us">
                    <Button
                      size="lg"
                      className="rounded-xl bg-gradient-to-r from-[color:var(--brand-azure)] to-[color:var(--brand-cyan)] px-6 text-white shadow-[var(--shadow-sm)] hover:brightness-110"
                      iconLeading={<MapPin className="h-5 w-5" />}
                    >
                      {copy.mapCta}
                    </Button>
                  </Link>
                  <Link href="/contact-sales">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="rounded-xl border border-[color:var(--border-subtle)] px-6"
                      iconLeading={<PhoneCall className="h-5 w-5" />}
                    >
                      {copy.salesCta}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div id="contact-map">
          <ContactAccessSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
