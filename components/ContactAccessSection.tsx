"use client";

import Link from "next/link";
import { type ComponentType, useState } from "react";
import { Mail, MapPin, Navigation, Phone, Send, Sparkles, MessageCircle } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { Language } from "../types";
import { Button } from "./ui/Button";

const MAP_EMBED_SRC =
  "https://www.google.com/maps?q=School+of+Computer+Engineering,+Iran+University+of+Science+and+Technology,+Tehran&hl=en&z=17&output=embed";
const MAP_LINK =
  "https://www.google.com/maps/place/School+of+Computer+Engineering,+Iran+University+of+Science+and+Technology,+Tehran";
const TELEGRAM_LINK = "https://t.me/barbod_support";
const EMAIL = "support@barbod.ir";
const PHONE = "021-77232560";

const copy: Record<
  Language,
  {
    badge: string;
    title: string;
    addressLabel: string;
    address: string;
    postal: string;
    contactTitle: string;
    phoneLabel: string;
    emailLabel: string;
    telegramLabel: string;
    response: string;
    directions: string;
    contactPage: string;
    salesButton: string;
    formTitle: string;
    nameLabel: string;
    emailInput: string;
    messageLabel: string;
    submit: string;
    copyText: string;
    copied: string;
  }
> = {
  [Language.EN]: {
    badge: "Contact routes",
    title: "Barbod contact center",
    addressLabel: "Address",
    address:
      "Tehran, Resalat Hwy, Hengam St, Daneshgah St, Iran University of Science and Technology, School of Computer Engineering",
    postal: "Postal code: 16846-13114",
    contactTitle: "Customer care",
    phoneLabel: "Phone",
    emailLabel: "Email",
    telegramLabel: "Telegram",
    response: "Sun–Thu, 09:00 to 18:00",
    directions: "Open directions",
    contactPage: "Contact page",
    salesButton: "Contact sales",
    formTitle: "Feedback & suggestions",
    nameLabel: "Full name",
    emailInput: "Email",
    messageLabel: "Your message",
    submit: "Send",
    copyText: "Copy",
    copied: "Copied",
  },
  [Language.FA]: {
    badge: "راه‌های ارتباط با باربد",
    title: "مرکز تماس باربد",
    addressLabel: "آدرس",
    address:
      "تهران، بزرگراه رسالت، خیابان هنگام، خیابان دانشگاه، دانشگاه علم و صنعت ایران، دانشکده مهندسی کامپیوتر",
    postal: "کد پستی: ۱۳۱۱۴-۱۶۸۴۶",
    contactTitle: "امور مشتریان",
    phoneLabel: "تلفن",
    emailLabel: "ایمیل",
    telegramLabel: "تلگرام",
    response: "شنبه تا چهارشنبه، ۹ تا ۱۸",
    directions: "مسیر‌یابی",
    contactPage: "صفحه تماس",
    salesButton: "تماس با تیم فروش",
    formTitle: "انتقادات و پیشنهادات",
    nameLabel: "نام و نام خانوادگی",
    emailInput: "ایمیل",
    messageLabel: "پیام شما",
    submit: "ارسال",
    copyText: "کپی",
    copied: "کپی شد",
  },
};

export function ContactAccessSection() {
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const c = copy[language];
  const mapOrder = dir === "rtl" ? "order-2 lg:order-2" : "order-1";
  const infoOrder = dir === "rtl" ? "order-1 lg:order-1" : "order-2";

  return (
    <section className="relative mx-auto max-w-[1440px] px-4 py-16 sm:px-6 lg:px-12" dir={dir}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(6,182,212,0.1),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(37,99,235,0.08),transparent_35%)] opacity-70 blur-3xl" />

      <div className="relative mb-10 flex flex-col gap-3 text-center lg:text-start">
        <div
          className={`inline-flex ${dir === "rtl" ? "self-end" : "self-start"} items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--text-secondary)]`}
        >
          <Sparkles className="h-4 w-4 text-[color:var(--brand-cyan)]" />
          {c.badge}
        </div>
        <h2 className="text-3xl font-bold text-[color:var(--text-primary)]">{c.title}</h2>
      </div>

      <div className="relative grid items-stretch gap-6 lg:grid-cols-2">
        <div
          className={`overflow-hidden rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] shadow-[var(--shadow-lg)] ${mapOrder}`}
        >
          <div className="relative w-full overflow-hidden lg:min-h-full" style={{ minHeight: "100%" }}>
            <iframe
              src={MAP_EMBED_SRC}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 min-h-[720px] lg:min-h-[1100px]"
              title="School of Computer Engineering map"
            ></iframe>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[color:var(--bg-base)]/18" />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--border-subtle)] bg-[color:var(--surface-card)]/80 px-4 py-4">
            <div className="flex flex-col gap-1 text-[color:var(--text-secondary)] text-sm">
              <span className="font-semibold text-[color:var(--text-primary)] flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                {c.address}
              </span>
              <span>{c.postal}</span>
            </div>
            <div className="flex flex-col gap-1 text-sm text-[color:var(--text-secondary)]">
              <span className="flex items-center gap-2 font-semibold text-[color:var(--text-primary)]">
                <Phone className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                {PHONE}
              </span>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                {EMAIL}
              </span>
            </div>
          </div>
        </div>

        <div className={`flex h-full flex-col gap-4 ${infoOrder}`}>
          <div className="rounded-3xl border border-[color:var(--border-subtle)] bg-gradient-to-br from-[color:var(--surface-card)] via-[color:var(--surface-elevated)] to-[color:var(--surface-card)] px-5 py-6 shadow-[var(--shadow-md)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-[color:var(--text-primary)]">{c.addressLabel}</h2>
                <p className="text-[color:var(--text-primary)]">{c.address}</p>
                <p className="text-sm text-[color:var(--text-secondary)]">{c.postal}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-5 py-6 shadow-[var(--shadow-md)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{c.contactTitle}</h3>
              <span className="text-xs font-semibold text-[color:var(--text-secondary)]">{c.response}</span>
            </div>
            <div className="space-y-3 text-sm">
              <ContactRow label={c.emailLabel} value={EMAIL} icon={Mail} copyable />
              <ContactRow label={c.phoneLabel} value={PHONE} icon={Phone} />
              <ContactRow label={c.telegramLabel} value="@barbod_support" icon={MessageCircle} href={TELEGRAM_LINK} />
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-5 py-6 shadow-[var(--shadow-md)]">
            <h3 className="mb-4 text-lg font-semibold text-[color:var(--text-primary)]">{c.formTitle}</h3>
            <div className="flex h-full flex-col gap-3">
              <LabeledInput label={c.nameLabel} placeholder={c.nameLabel} />
              <LabeledInput label={c.emailInput} placeholder={c.emailInput} />
              <LabeledTextArea label={c.messageLabel} placeholder={c.messageLabel} />
              <div className="mt-auto">
                <Button size="lg" className="w-full justify-center rounded-xl h-14">
                  {c.submit}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Chip({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)]">
      <Icon className="h-4 w-4 text-[color:var(--brand-cyan)]" />
      {label}
    </span>
  );
}

function ContactRow({
  label,
  value,
  icon: Icon,
  href,
  copyable,
}: {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  copyable?: boolean;
}) {
  const { language } = useLanguage();
  const c = copy[language];
  const [copied, setCopied] = useState(false);

  const content = (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-elevated)] text-[color:var(--brand-cyan)]">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-[color:var(--text-secondary)]">{label}</span>
          <span className="text-sm font-semibold text-[color:var(--text-primary)]">{value}</span>
        </div>
      </div>
      {copyable ? (
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            } catch (e) {
              setCopied(false);
            }
          }}
          className="text-xs font-semibold text-[color:var(--brand-cyan)]"
        >
          {copied ? c.copied : c.copyText}
        </button>
      ) : null}
    </>
  );

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)]/60 px-4 py-3">
      {href && !copyable ? (
        <a href={href} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between gap-3">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
}

function LabeledInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[color:var(--text-primary)]">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50"
      />
    </div>
  );
}

function LabeledTextArea({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-[color:var(--text-primary)]">{label}</label>
      <textarea
        rows={4}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 py-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50"
      ></textarea>
    </div>
  );
}
