"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowUpLeft,
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
import { submitContactSales } from "../../lib/api/contactSales";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import { normalizeNumericInput, toPersianDigits } from "../../lib/numberFormat";

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
    submitLoading: string;
    captchaLabel: string;
    captchaHelper: string;
    response: string;
    highlight: string;
    note: string;
    messages: {
      success: string;
      error: string;
      captchaRequired: string;
      captchaUnavailable: string;
    };
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
    submitLoading: "Submitting...",
    captchaLabel: "Security check",
    captchaHelper: "Verify that you are human.",
    response: "Avg. first response under 1 hour",
    highlight: "Enterprise-grade security by design",
    note: "Your info stays private and is only used to schedule your session.",
    messages: {
      success: "Thanks! Our team will reach out shortly.",
      error: "We couldn't send your request. Please try again.",
      captchaRequired: "Complete the captcha to continue.",
      captchaUnavailable: "Captcha is unavailable. Please try again later.",
    },
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
    submitLoading: "Submitting...",
    captchaLabel: "Security check",
    captchaHelper: "Verify that you are human.",
    response: "میانگین پاسخ‌گویی کمتر از ۱ ساعت",
    highlight: "امنیت در سطح سازمانی",
    note: "اطلاعات شما فقط برای هماهنگی جلسه استفاده می‌شود.",
    messages: {
      success: "Thanks! Our team will reach out shortly.",
      error: "We couldn't send your request. Please try again.",
      captchaRequired: "Complete the captcha to continue.",
      captchaUnavailable: "Captcha is unavailable. Please try again later.",
    },
  },
};

type RecaptchaCallback = (token: string) => void;

type RecaptchaWidgetParams = {
  sitekey: string;
  callback?: RecaptchaCallback;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type RecaptchaApi = {
  render: (container: HTMLElement, parameters: RecaptchaWidgetParams) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

const RECAPTCHA_SCRIPT_ID = "recaptcha-v2-script";

const loadRecaptchaScript = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is not available."));
  }

  if (window.grecaptcha) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID) as
      | HTMLScriptElement
      | null;

    if (existingScript) {
      if (existingScript.dataset.loaded === "true" && window.grecaptcha) {
        resolve();
        return;
      }
      if (existingScript.dataset.error === "true") {
        existingScript.remove();
        window.grecaptcha = undefined;
      } else {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Failed to load reCAPTCHA.")),
          { once: true }
        );
        return;
      }
    }

    const script = document.createElement("script");
    script.id = RECAPTCHA_SCRIPT_ID;
    script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => {
      script.dataset.error = "true";
      reject(new Error("Failed to load reCAPTCHA."));
    };
    document.body.appendChild(script);
  });
};

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  company: string;
  email: string;
  notes: string;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  company: "",
  email: "",
  notes: "",
};

export default function SalesContactPage() {
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const c = copy[language];
  const phonePlaceholder = isFa ? "9xx xxx xxxx +98" : "+98 9xx xxx xxxx";
  const SlaIcon = dir === "rtl" ? ArrowUpLeft : ArrowUpRight;
  const sendIconClass = dir === "rtl" ? "h-4 w-4 -scale-x-100" : "h-4 w-4";
  const envRecaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(envRecaptchaSiteKey);
  const [siteKeyStatus, setSiteKeyStatus] = useState<"loading" | "ready" | "error">(
    envRecaptchaSiteKey ? "ready" : "loading"
  );
  const [formValues, setFormValues] = useState<FormState>(initialFormState);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle"
  );
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaStatus, setCaptchaStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");
  const [captchaLoadAttempt, setCaptchaLoadAttempt] = useState(0);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);
  const isSubmitting = submitStatus === "submitting";
  const phoneValue = isFa ? toPersianDigits(formValues.phone) : formValues.phone;
  const isDev = process.env.NODE_ENV !== "production";
  const isSiteKeyMissing = !recaptchaSiteKey && siteKeyStatus !== "loading";
  const isCaptchaUnavailable = isSiteKeyMissing || captchaStatus === "error";
  const captchaUnavailableMessage =
    isSiteKeyMissing && isDev
      ? "Missing reCAPTCHA site key. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY (build-time) or RECAPTCHA_SITE_KEY (runtime) and restart."
      : c.messages.captchaUnavailable;

  useEffect(() => {
    if (envRecaptchaSiteKey) {
      setRecaptchaSiteKey(envRecaptchaSiteKey);
      setSiteKeyStatus("ready");
      return;
    }

    let isActive = true;
    setSiteKeyStatus("loading");

    fetch("/api/public-config", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return null;
        try {
          return await response.json();
        } catch {
          return null;
        }
      })
      .then((payload) => {
        if (!isActive) return;
        const key =
          payload && typeof payload === "object"
            ? (payload as { recaptchaSiteKey?: string }).recaptchaSiteKey
            : null;
        if (typeof key === "string" && key.trim()) {
          setRecaptchaSiteKey(key.trim());
          setSiteKeyStatus("ready");
        } else {
          setRecaptchaSiteKey("");
          setSiteKeyStatus("error");
        }
      })
      .catch(() => {
        if (!isActive) return;
        setRecaptchaSiteKey("");
        setSiteKeyStatus("error");
      });

    return () => {
      isActive = false;
    };
  }, [envRecaptchaSiteKey, captchaLoadAttempt]);

  useEffect(() => {
    if (!recaptchaSiteKey) {
      setCaptchaStatus("idle");
      return;
    }

    let isActive = true;
    setCaptchaStatus("loading");
    setCaptchaError(null);

    loadRecaptchaScript()
      .then(() => {
        if (!isActive) return;
        if (!window.grecaptcha || !recaptchaRef.current) return;
        if (recaptchaWidgetId.current !== null) {
          setCaptchaStatus("ready");
          return;
        }

        recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
          sitekey: recaptchaSiteKey,
          callback: (token: string) => {
            setCaptchaToken(token);
            setCaptchaError(null);
          },
          "expired-callback": () => {
            setCaptchaToken("");
          },
          "error-callback": () => {
            setCaptchaToken("");
          },
        });
        setCaptchaStatus("ready");
      })
      .catch(() => {
        if (isActive) {
          setCaptchaStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, [recaptchaSiteKey, captchaLoadAttempt]);

  const resetCaptcha = () => {
    setCaptchaToken("");
    setCaptchaError(null);
    if (window.grecaptcha && recaptchaWidgetId.current !== null) {
      window.grecaptcha.reset(recaptchaWidgetId.current);
    }
  };

  const handleCaptchaRetry = () => {
    setCaptchaToken("");
    setCaptchaError(null);
    recaptchaWidgetId.current = null;
    setCaptchaLoadAttempt((prev) => prev + 1);
  };

  const handleValueChange = (field: keyof FormState) => (value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage(null);

    if (isCaptchaUnavailable) {
      setSubmitStatus("error");
      setSubmitMessage(captchaUnavailableMessage);
      return;
    }

    if (!captchaToken) {
      setCaptchaError(c.messages.captchaRequired);
      return;
    }

    const payload = {
      first_name: formValues.firstName.trim(),
      last_name: formValues.lastName.trim(),
      phone: formValues.phone.trim(),
      business_name: formValues.company.trim(),
      description: formValues.notes.trim(),
      captcha_token: captchaToken,
      ...(formValues.email.trim() ? { email: formValues.email.trim() } : {}),
    };

    try {
      setSubmitStatus("submitting");
      const response = await submitContactSales(payload);
      setSubmitStatus("success");
      setSubmitMessage(response?.message || c.messages.success);
      setFormValues(initialFormState);
      resetCaptcha();
    } catch (error) {
      const message = error instanceof Error ? error.message : c.messages.error;
      setSubmitStatus("error");
      setSubmitMessage(message || c.messages.error);
      resetCaptcha();
    }
  };

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
                  <SlaIcon className="mr-1 inline h-3.5 w-3.5 align-middle" />
                  SLA
                </div>
              </div>

              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label={c.labels.firstName}
                    placeholder={c.labels.firstName}
                    value={formValues.firstName}
                    onValueChange={handleValueChange("firstName")}
                    required
                    autoComplete="given-name"
                    maxLength={100}
                    disabled={isSubmitting}
                  />
                  <Field
                    label={c.labels.lastName}
                    placeholder={c.labels.lastName}
                    value={formValues.lastName}
                    onValueChange={handleValueChange("lastName")}
                    required
                    autoComplete="family-name"
                    maxLength={100}
                    disabled={isSubmitting}
                  />
                </div>
                <Field
                  label={c.labels.phone}
                  placeholder={phonePlaceholder}
                  value={phoneValue}
                  onValueChange={handleValueChange("phone")}
                  numeric
                  maxLength={11}
                  required
                  autoComplete="tel"
                  disabled={isSubmitting}
                />
                <Field
                  label={c.labels.company}
                  placeholder={c.labels.company}
                  value={formValues.company}
                  onValueChange={handleValueChange("company")}
                  required
                  autoComplete="organization"
                  maxLength={150}
                  disabled={isSubmitting}
                />
                <Field
                  label={c.labels.email}
                  placeholder="you@company.com"
                  optionalTag={c.optionalTag}
                  value={formValues.email}
                  onValueChange={handleValueChange("email")}
                  type="email"
                  autoComplete="email"
                  maxLength={150}
                  disabled={isSubmitting}
                />
                <Field
                  label={c.labels.notes}
                  placeholder={c.labels.notes}
                  multiline
                  value={formValues.notes}
                  onValueChange={handleValueChange("notes")}
                  required
                  minLength={5}
                  maxLength={2000}
                  disabled={isSubmitting}
                />
                <div className="grid gap-2">
                  <label className="text-sm font-semibold text-[color:var(--text-primary)]">
                    {c.captchaLabel}
                  </label>
                  <p className="text-xs text-[color:var(--text-secondary)]">{c.captchaHelper}</p>
                  <div ref={recaptchaRef} dir="ltr" className="min-h-[78px]" />
                  {isCaptchaUnavailable ? (
                    <p className="text-xs font-semibold text-rose-500">
                      {captchaUnavailableMessage}
                    </p>
                  ) : null}
                  {captchaStatus === "error" || siteKeyStatus === "error" ? (
                    <button
                      type="button"
                      onClick={handleCaptchaRetry}
                      className="w-fit text-xs font-semibold text-[color:var(--brand-cyan)] hover:underline"
                    >
                      Retry loading captcha
                    </button>
                  ) : null}
                  {captchaError ? (
                    <p className="text-xs font-semibold text-rose-500">{captchaError}</p>
                  ) : null}
                </div>
                {submitMessage ? (
                  <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      submitStatus === "success"
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700"
                        : "border-rose-500/40 bg-rose-500/10 text-rose-700"
                    }`}
                    role="status"
                  >
                    {submitMessage}
                  </div>
                ) : null}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--text-secondary)]">
                    <MessageSquare className="h-4 w-4 text-[color:var(--brand-cyan)]" />
                    {c.response}
                  </div>
                  <Button
                    size="lg"
                    type="submit"
                    disabled={isSubmitting || isCaptchaUnavailable}
                    className="rounded-xl px-6 bg-black text-white hover:bg-black hover:brightness-110"
                    iconLeading={<Send className={sendIconClass} />}
                  >
                    {isSubmitting ? c.submitLoading : c.submit}
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
  numeric,
  maxLength,
  minLength,
  value,
  onValueChange,
  required,
  type = "text",
  autoComplete,
  disabled,
}: {
  label: string;
  placeholder: string;
  optionalTag?: string;
  multiline?: boolean;
  numeric?: boolean;
  maxLength?: number;
  minLength?: number;
  value?: string;
  onValueChange?: (value: string) => void;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const nextValue = event.currentTarget.value;
    if (numeric) {
      onValueChange?.(normalizeNumericInput(nextValue, maxLength));
      return;
    }
    onValueChange?.(nextValue);
  };

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
          value={value ?? ""}
          onChange={handleChange}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-4 py-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50 disabled:cursor-not-allowed disabled:opacity-70"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleChange}
          required={required}
          maxLength={maxLength}
          minLength={minLength}
          inputMode={numeric ? "numeric" : undefined}
          dir={numeric ? "ltr" : undefined}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-12 w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-4 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50 disabled:cursor-not-allowed disabled:opacity-70"
        />
      )}
    </div>
  );
}
