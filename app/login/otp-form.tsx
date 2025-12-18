"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "../../store/store";
import { Theme } from "../../types";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import {
  resendOtpThunk,
  selectMaskedPhone,
  setIsHovered,
  verifyOtpThunk,
} from "../../store/loginSlice";
import { saveAuth } from "../../lib/auth-storage";

export default function OTPForm({ masked }: { masked?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const { authError, isSubmitting } = useSelector(
    (state: RootState) => state.login
  );
  const maskedPhone = useSelector(selectMaskedPhone);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isLight = theme === Theme.LIGHT;

  const displayPhone = masked ?? maskedPhone ?? "";
  const code = digits.join("");
  const canSubmit = code.length === 6;

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) {
      setLocalError(
        isFa
          ? "کد شش رقمی را وارد کنید."
          : "Enter the 6-digit code to continue."
      );
      return;
    }

    setLocalError(null);
    try {
      const tokens = await dispatch(verifyOtpThunk(code)).unwrap();
      saveAuth(tokens);
      // Redirect based on role after successful verification
      if (tokens?.is_admin) {
        router.push("/admin/test-admin-panel");
      } else {
        router.push("/user/test-sidebar");
      }
    } catch {
      // handled by authError
    }
  };

  const handleResend = async () => {
    setLocalError(null);
    try {
      await dispatch(resendOtpThunk()).unwrap();
    } catch {
      // handled by authError
    }
  };

  return (
    <Container
      size="full"
      className={`absolute top-1/2 left-1/2 sm:left-auto sm:right-[8%] -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 w-[calc(100%-2rem)] max-w-[560px] sm:w-full rounded-[2rem] sm:rounded-[2.5rem] transition-all duration-500 ${
        isLight
          ? "border-2 border-gray-300 bg-gradient-to-br from-white/95 to-gray-50/95 backdrop-blur-xl shadow-2xl hover:border-gray-400 hover:shadow-[0_0_40px_rgba(37,99,235,0.2)]"
          : "border-2 border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-xl shadow-2xl hover:border-white/20 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
      } px-6 py-12 sm:px-12 sm:py-20 flex flex-col items-center gap-6 sm:gap-8`}
      dir={dir}
      onMouseEnter={() => dispatch(setIsHovered(true))}
      onMouseLeave={() => dispatch(setIsHovered(false))}
      style={
        isLight
          ? {
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)",
              boxShadow:
                "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 0 0 rgba(255,255,255,0.5)",
            }
          : {
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
              boxShadow:
                "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255,255,255,0.1)",
            }
      }
    >
      {/* Logo with subtle animation */}
      <div className="transform transition-transform duration-300 hover:scale-110">
        <Logo />
      </div>

      {/* Brand name with gradient */}
      <p
        className={`text-3xl sm:text-4xl font-bold ${
          isLight
            ? "bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
        } ${isFa ? "font-vazirmatn" : ""}`}
      >
        Barbod
      </p>

      {/* Title with emphasis */}
      <p
        className={`text-4xl sm:text-5xl font-extrabold drop-shadow-lg ${
          isLight ? "text-gray-900" : "text-white"
        } ${isFa ? "font-vazirmatn" : ""}`}
      >
        {isFa ? "تایید کد" : "Verify"}
      </p>

      {/* Message with better readability */}
      <p
        className={`text-base sm:text-lg ${
          isLight ? "text-gray-700" : "text-white/90"
        } ${isFa ? "font-vazirmatn" : ""} text-center max-w-md leading-relaxed`}
      >
        {isFa ? (
          <>
            کد ارسال‌شده به{" "}
            <span dir="ltr" className="inline-block">
              {displayPhone}
            </span>{" "}
            را وارد کنید:
          </>
        ) : (
          <>
            Enter the code sent to{" "}
            <span dir="ltr" className="inline-block">
              {displayPhone}
            </span>
            :
          </>
        )}
      </p>

      {/* Input section with enhanced styling - Force LTR for consistent left-to-right progression */}
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-5 sm:gap-6 mt-2">
        <div
          className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap"
          dir="ltr"
        >
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
              className={`h-16 w-12 sm:h-20 sm:w-14 bg-transparent border-0 border-b-2 text-center text-2xl sm:text-3xl font-medium transition-all duration-300 outline-none ${
                isLight
                  ? `${
                      digit
                        ? "border-blue-600 text-gray-900"
                        : "border-gray-300 text-gray-900"
                    } focus:border-blue-600 focus:scale-110`
                  : `${
                      digit
                        ? "border-blue-400 text-white"
                        : "border-white/30 text-white"
                    } focus:border-blue-400 focus:scale-110`
              } ${isFa ? "font-vazirmatn" : ""}`}
              style={{
                caretColor: isLight ? "#2563eb" : "#60a5fa",
              }}
            />
          ))}
        </div>

        <Button
          size="lg"
          className="h-12 sm:h-14 w-full max-w-[200px] rounded-xl sm:rounded-2xl px-8 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting
            ? isFa
              ? "لطفا صبر کنید..."
              : "Please wait..."
            : isFa
            ? "تایید"
            : "Submit"}
        </Button>

        <div className="flex flex-col items-center gap-2">
          {(localError || authError) && (
            <p
              className={`text-sm text-center ${
                isLight ? "text-red-600" : "text-red-400"
              } ${isFa ? "font-vazirmatn" : ""}`}
            >
              {localError || authError}
            </p>
          )}

          <button
            type="button"
            onClick={handleResend}
            className={`text-sm underline ${
              isLight ? "text-blue-700" : "text-blue-200"
            }`}
            disabled={isSubmitting}
          >
            {isFa ? "ارسال مجدد کد" : "Resend code"}
          </button>
        </div>
      </div>
    </Container>
  );
}
