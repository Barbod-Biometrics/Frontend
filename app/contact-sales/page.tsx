"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

const copy: Record<
  Language,
  {
    badge: string;
    title: string;
    subtitle: string;
    formTitle: string;
    labels: {
      firstName: string;
      lastName: string;
      phone: string;
      company: string;
      email: string;
      notes: string;
    };
    optionalTag: string;
    submit: string;
    response: string;
    highlight: string;
    note: string;
  }
> = {
  [Language.EN]: {
    badge: "Sales contact",
    title: "Ask our sales team for a custom package",
    subtitle:
      "Share your company details and one of our specialists will call you back with tailored recommendations.",
    formTitle: "Sales request form",
    labels: {
      firstName: "First name",
      lastName: "Last name",
      phone: "Mobile number",
      company: "Company",
      email: "Email",
      notes: "More details",
    },
    optionalTag: "(optional)",
    submit: "Request a call",
    response: "Avg. first response under 1 hour",
    highlight: "Enterprise-grade security by design",
    note: "Your info stays private and is only used to schedule your session.",
  },
  [Language.FA]: {
    badge: "درخواست واحد فروش",
    title: "درخواست بسته اختصاصی از تیم فروش",
    subtitle:
      "اطلاعات کسب‌وکار را ثبت کنید تا یکی از کارشناسان با پیشنهاد متناسب با نیاز شما تماس بگیرد.",
    formTitle: "فرم درخواست ارتباط",
    labels: {
      firstName: "نام",
      lastName: "نام خانوادگی",
      phone: "شماره تلفن همراه",
      company: "نام کسب و کار",
      email: "ایمیل",
      notes: "توضیحات بیشتر",
    },
    optionalTag: "(اختیاری)",
    submit: "درخواست تماس",
    response: "میانگین پاسخ‌گویی کمتر از ۱ ساعت",
    highlight: "امنیت در سطح سازمانی",
    note: "اطلاعات شما فقط برای هماهنگی جلسه استفاده می‌شود.",
  },
};

export default function SalesContactPage() {
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const c = copy[language];
  const phonePlaceholder = isFa ? "9xx xxx xxxx +98" : "+98 9xx xxx xxxx";

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Navbar />

      <main className="relative flex-1 overflow-hidden" dir={dir}>
        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute left-[-10%] top-[-5%] h-72 w-72 rounded-full bg-[color:var(--brand-azure)]/14 blur-[110px]" />
          <div className="absolute right-[-5%] top-[20%] h-72 w-72 rounded-full bg-[color:var(--brand-cyan)]/12 blur-[110px]" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
          <div className={`flex flex-col gap-6 rounded-[28px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] p-6 shadow-[var(--shadow-lg)] ${isFa ? "text-right" : "text-left"}`}>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-cyan)]" />
              {c.badge}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">{c.title}</h1>
              <p className="max-w-2xl text-lg text-[color:var(--text-secondary)]">{c.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-[color:var(--text-secondary)]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-card)] px-3 py-1.5">
                <BadgeCheck className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                {c.response}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--surface-card)] px-3 py-1.5">
                <Shield className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                {c.highlight}
              </span>
            </div>

            <div className="grid gap-6 rounded-[24px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)]/40 p-6 shadow-[var(--shadow-xl)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-[color:var(--text-secondary)]">
                    {c.formTitle}
                  </p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
                    <Users className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                    {c.note}
                  </div>
                </div>
                <div className="hidden rounded-full bg-[color:var(--surface-elevated)] px-3 py-1.5 text-xs font-semibold text-[color:var(--brand-cyan)] sm:block">
                  <ArrowUpRight className="mr-1 inline h-3.5 w-3.5 align-middle" />
                  SLA
                </div>
              </div>

              <form className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={c.labels.firstName} placeholder={c.labels.firstName} />
                  <Field label={c.labels.lastName} placeholder={c.labels.lastName} />
                </div>
                <Field label={c.labels.phone} placeholder={phonePlaceholder} />
                <Field label={c.labels.company} placeholder={c.labels.company} />
                <Field
                  label={c.labels.email}
                  placeholder="you@company.com"
                  optionalTag={c.optionalTag}
                />
                <Field
                  label={c.labels.notes}
                  placeholder={c.labels.notes}
                  multiline
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--text-secondary)]">
                    <MessageSquare className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                    {c.response}
                  </div>
                  <Button
                    size="lg"
                    className="rounded-xl px-6 bg-black text-white hover:bg-black hover:brightness-110"
                    iconLeading={<Send className="h-4 w-4" />}
                  >
                    {c.submit}
                  </Button>
                </div>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { icon: Phone, label: "021-77232560", href: "tel:+982177232560" },
                { icon: Mail, label: "sales@barbod.ir", href: "mailto:sales@barbod.ir" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-4 py-3 text-sm transition-colors hover:border-[color:var(--brand-cyan)]/50 hover:bg-[color:var(--surface-elevated)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--surface-elevated)] text-[color:var(--brand-cyan)]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-[color:var(--text-primary)] group-hover:text-[color:var(--brand-cyan)]">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  label,
  placeholder,
  optionalTag,
  multiline,
}: {
  label: string;
  placeholder: string;
  optionalTag?: string;
  multiline?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[color:var(--text-primary)]">
        {label}{" "}
        {optionalTag ? (
          <span className="text-[color:var(--text-secondary)]">{optionalTag}</span>
        ) : null}
      </label>
      {multiline ? (
        <textarea
          rows={4}
          placeholder={placeholder}
          className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50"
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-4 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50"
        />
      )}
    </div>
  );
}
