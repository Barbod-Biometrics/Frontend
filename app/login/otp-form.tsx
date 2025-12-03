"use client";

import { useRef, useState } from "react";
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
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
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

      <div className="flex w-full max-w-md flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center gap-3">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => {
                inputsRef.current[idx] = el;
              }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(-1);
                const next = [...digits];
                next[idx] = val;
                setDigits(next);
                if (val && inputsRef.current[idx + 1]) {
                  inputsRef.current[idx + 1]?.focus();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[idx]) {
                  inputsRef.current[idx - 1]?.focus();
                }
              }}
              onPaste={(e) => {
                e.preventDefault();
                const pasted = e.clipboardData
                  .getData("text")
                  .replace(/\D/g, "")
                  .slice(0, 6)
                  .split("");
                const next = [...digits];
                for (let i = 0; i < 6; i++) {
                  next[i] = pasted[i] ?? next[i];
                }
                setDigits(next);
                const lastFilled = Math.min(pasted.length, 5);
                inputsRef.current[lastFilled]?.focus();
              }}
              className={`h-12 w-12 rounded-lg border border-[color:var(--border-subtle)] bg-[color:var(--surface-elevated)] text-center text-lg font-semibold text-[color:var(--text-primary)] focus:border-[color:var(--brand-azure)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-azure)]/50 ${
                isFa ? "font-vazirmatn" : ""
              }`}
            />
          ))}
        </div>

        <Button size="lg" className="h-11 min-w-[160px] rounded-xl px-6">
          {isFa ? "ارسال" : "Submit"}
        </Button>
      </div>
    </Container>
  );
}
