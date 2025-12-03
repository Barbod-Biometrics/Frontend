"use client";

import { useState } from "react";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";

import { useLoginContext } from "./login-context";

export default function OTPForm({
  masked = "۰۹۱۲۳۴۵۶۷۸۹",
}: {
  masked?: string;
}) {
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const [otp, setOtp] = useState("");
  const { setIsHovered } = useLoginContext();

  const messageFa = `کد ارسال شده به شماره تلفن همراه ${masked} وارد کنید:`;
  const messageEn = `Enter the code sent to ${masked}:`;

  return (
    <Container
      size="full"
      className="absolute top-1/2 right-[5%] w-full max-w-[480px] -translate-y-1/2 rounded-3xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-card)] px-12 py-[100px] flex flex-col items-center gap-6 shadow-[var(--shadow-lg)] transition-colors duration-300"
      dir={dir}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsHovered(true)}
      onMouseUp={() => setIsHovered(false)}
    >
      <Logo />

      <p
        className={`text-2xl font-semibold text-[color:var(--text-primary)] ${
          isFa ? "font-vazirmatn" : ""
        }`}
      >
        Barbod
      </p>

      <p
        className={`text-3xl font-bold text-[color:var(--text-primary)] ${
          isFa ? "font-vazirmatn" : ""
        }`}
      >
        {isFa ? "کد عبور" : "Verify"}
      </p>

      <p
        className={`text-sm text-[color:var(--text-primary)] ${
          isFa ? "font-vazirmatn" : ""
        } text-center`}
      >
        {isFa ? messageFa : messageEn}
      </p>

      <div className="flex w-full max-w-md items-center justify-center gap-8">
        <input
          type="text"
          inputMode="numeric"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder={"* * * * * *"}
          className={`h-11 w-40 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] px-3 text-center text-sm text-[color:var(--text-primary)] placeholder:text-[color:var(--text-secondary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50 ${
            isFa ? "font-vazirmatn" : ""
          }`}
        />

        <Button size="lg" className="h-11 rounded-xl px-6">
          {isFa ? "ارسال" : "Submit"}
        </Button>
      </div>
    </Container>
  );
}
