"use client";

import { useState } from "react";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

interface LabeledInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  dir: "rtl" | "ltr";
  isFa: boolean;
}

function LabeledInput({
  value,
  onChange,
  label,
  placeholder,
  dir,
  isFa,
}: LabeledInputProps) {
  return (
    <div className="space-y-2 w-full">
      <label
        className={`text-sm font-medium text-[color:var(--text-primary)] ${
          isFa ? "font-vazirmatn" : ""
        }`}
      >
        {label}
      </label>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        dir={dir}
        className={`h-11 w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50 ${
          isFa ? "font-vazirmatn" : ""
        }`}
      />
    </div>
  );
}

interface SubmitButtonProps {
  label: string;
  isFa: boolean;
}

function SubmitButton({ label, isFa }: SubmitButtonProps) {
  return (
    <Button variant="primary" size="lg" className="w-full">
      <span className={`text-lg font-bold ${isFa ? "font-vazirmatn" : ""}`}>
        {label}
      </span>
    </Button>
  );
}

const loginCopy: Record<
  Language,
  {
    title: string;
    phoneLabel: string;
    submitButton: string;
    brandName: string;
  }
> = {
  [Language.EN]: {
    title: "Login",
    phoneLabel: "Phone Number",
    submitButton: "Submit",
    brandName: "Barbod",
  },
  [Language.FA]: {
    title: "ورود",
    phoneLabel: "شماره تلفن همراه",
    submitButton: "ارسال",
    brandName: "Barbod",
  },
};

function LoginForm() {
  const [phone, setPhone] = useState("");
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const copy = loginCopy[language];

  return (
    <Container
      size="full"
      className="absolute top-1/2 right-[5%] w-full max-w-[480px] -translate-y-1/2 rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-12 py-[100px] flex flex-col items-center gap-6 shadow-[var(--shadow-lg)]"
      dir={dir}
    >
      <Logo />

      <p
        className={`text-2xl font-semibold text-[color:var(--text-primary)] ${
          isFa ? "font-vazirmatn" : ""
        }`}
      >
        {copy.brandName}
      </p>

      <p
        className={`text-3xl font-bold text-[color:var(--text-primary)] ${
          isFa ? "font-vazirmatn" : ""
        }`}
      >
        {copy.title}
      </p>

      <LabeledInput
        value={phone}
        onChange={setPhone}
        label={copy.phoneLabel}
        placeholder="09123456789"
        dir={dir}
        isFa={isFa}
      />

      <SubmitButton label={copy.submitButton} isFa={isFa} />
    </Container>
  );
}

export default LoginForm;
