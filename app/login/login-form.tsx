"use client";

import { useState } from "react";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui/Button";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  dir: "rtl" | "ltr";
  isFa: boolean;
}

function TextInput({ value, onChange, dir, isFa }: TextInputProps) {
  return (
    <div
      className="w-full flex items-center rounded-md border-2 border-blue-500 bg-white p-[13px] transition-all duration-200 
      focus-within:border-[#007fff] focus-within:shadow-[0_0_0_3px_rgba(0,127,255,0.1)] 
      focus-within:ring-2 focus-within:ring-[#007fff]/20"
    >
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className={`w-full bg-transparent text-[18px] outline-none ${
          isFa ? "font-vazirmatn" : ""
        }`}
      />
    </div>
  );
}

interface LabeledInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  dir: "rtl" | "ltr";
  isFa: boolean;
}

function LabeledInput({
  value,
  onChange,
  label,
  dir,
  isFa,
}: LabeledInputProps) {
  return (
    <div className="flex w-full flex-col gap-3 items-end">
      <p
        dir={dir}
        className={`text-[20px] text-gray-700 ${isFa ? "font-vazirmatn" : ""}`}
      >
        {label}
      </p>
      <TextInput value={value} onChange={onChange} dir={dir} isFa={isFa} />
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
    <div
      className="absolute top-1/2 left-1/2 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2
      bg-white px-12 py-[100px] flex flex-col items-center gap-6 shadow-lg"
      dir={dir}
    >
      <Logo />

      <p
        className={`text-2xl font-semibold text-gray-800 ${
          isFa ? "font-vazirmatn" : ""
        }`}
      >
        {copy.brandName}
      </p>

      <p className={`text-3xl font-bold ${isFa ? "font-vazirmatn" : ""}`}>
        {copy.title}
      </p>

      <LabeledInput
        value={phone}
        onChange={setPhone}
        label={copy.phoneLabel}
        dir={dir}
        isFa={isFa}
      />

      <SubmitButton label={copy.submitButton} isFa={isFa} />
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
