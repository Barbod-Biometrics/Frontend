"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Theme } from "../../types";
import { Logo } from "../../components/Logo";
import { Button } from "../../components/ui/Button";
import { Container } from "../../components/ui/Container";
import { useLanguage } from "../../lib/useLanguage";
import { Language } from "../../types";
import { requestOtpThunk } from "../../store/loginSlice";

interface LabeledInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  dir: "rtl" | "ltr";
  isFa: boolean;
  error?: string;
  isLight: boolean;
}

function LabeledInput({
  value,
  onChange,
  label,
  placeholder,
  dir,
  isFa,
  error,
  isLight,
}: LabeledInputProps) {
  return (
    <div className="space-y-2 w-full">
      <label
        className={`text-base sm:text-lg font-semibold ${
          isLight ? "text-gray-700" : "text-white/90"
        } ${isFa ? "font-vazirmatn" : ""}`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          type="tel"
          value={value}
          onChange={(e) => {
            // Only allow digits and limit to 11 characters (09XXXXXXXXX)
            const val = e.target.value.replace(/\D/g, "").slice(0, 11);
            onChange(val);
          }}
          placeholder={placeholder}
          dir="ltr"
          className={`h-12 sm:h-14 w-full rounded-md sm:rounded-xl px-4 text-base sm:text-lg transition-all duration-300 ${
            error
              ? "border-2 border-red-500 focus:ring-red-500/30"
              : isLight
              ? "border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500/30"
              : "border-2 border-white/20 focus:border-blue-400 focus:ring-blue-400/30"
          } ${
            isLight
              ? "bg-white/80 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 hover:bg-white"
              : "bg-white/10 backdrop-blur-sm text-white placeholder:text-white/40 hover:bg-white/15"
          } focus:outline-none focus:ring-4 ${isFa ? "font-vazirmatn" : ""}`}
        />
      </div>
      {error && (
        <p
          className={`text-sm ${isLight ? "text-red-600" : "text-red-400"} ${
            isFa ? "font-vazirmatn" : ""
          }`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

interface SubmitButtonProps {
  label: string;
  isFa: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function SubmitButton({ label, isFa, onClick, disabled }: SubmitButtonProps) {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-12 sm:h-14 rounded-md sm:rounded-xl text-base sm:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className={`font-bold ${isFa ? "font-vazirmatn" : ""}`}>
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
    phonePlaceholder: string;
    errorInvalid: string;
    errorRequired: string;
  }
> = {
  [Language.EN]: {
    title: "Login",
    phoneLabel: "Phone Number",
    submitButton: "Send Code",
    brandName: "Barbod",
    phonePlaceholder: "09123456789",
    errorInvalid:
      "Please enter a valid Iranian phone number (11 digits starting with 09)",
    errorRequired: "Phone number is required",
  },
  [Language.FA]: {
    title: "ورود",
    phoneLabel: "شماره موبایل",
    submitButton: "ارسال کد",
    brandName: "باربد",
    phonePlaceholder: "09123456789",
    errorInvalid: "لطفا شماره موبایل معتبر وارد کنید (۱۱ رقم و شروع با ۰۹)",
    errorRequired: "شماره موبایل الزامی است",
  },
};

// Phone validation functions
const normalizePhone = (input: string): string => {
  // Keep only digits and cap at 11 (to allow 09xxxxxxxxx)
  return input.replace(/\D/g, "").slice(0, 11);
};

const validateIranianPhone = (phone: string): boolean => {
  // Must be exactly 11 digits and start with 09
  return /^09[0-9]{9}$/.test(phone);
};

const formatPhone = (phone: string): string => {
  // Backend expects the full 09xxxxxxxxx format
  return phone;
};

interface LoginFormProps {
  onSubmit?: (formattedPhone: string) => void;
}

function LoginForm({ onSubmit }: LoginFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const { language, dir } = useLanguage();
  const isFa = language === Language.FA;
  const copy = loginCopy[language];
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isLight = theme === Theme.LIGHT;
  const { authError, isSubmitting } = useSelector(
    (state: RootState) => state.login
  );

  const handleSubmit = async () => {
    // Clear previous error
    setError("");

    // Check if empty
    if (!phone.trim()) {
      setError(copy.errorRequired);
      return;
    }

    // Validate phone
    if (!validateIranianPhone(phone)) {
      setError(copy.errorInvalid);
      return;
    }

    // Format and submit
    const formattedPhone = formatPhone(phone);
    try {
      if (onSubmit) {
        onSubmit(formattedPhone);
      } else {
        await dispatch(requestOtpThunk(formattedPhone)).unwrap();
      }
    } catch {
      // errors handled via slice authError
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
        <Logo size="xlarge" />
      </div>

      {/* Brand name with gradient */}
      <p
        className={`text-4xl sm:text-5xl font-bold ${
          isLight
            ? "bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent"
            : "bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
        } ${isFa ? "font-vazirmatn" : ""}`}
      >
        {copy.brandName}
      </p>

      {/* Title with emphasis */}
      <p
        className={`text-3xl sm:text-4xl font-extrabold drop-shadow-lg ${
          isLight ? "text-gray-900" : "text-white"
        } ${isFa ? "font-vazirmatn" : ""}`}
      >
        {copy.title}
      </p>

      {/* Input with enhanced styling */}
      <LabeledInput
        value={phone}
        onChange={setPhone}
        label={copy.phoneLabel}
        placeholder={copy.phonePlaceholder}
        dir={dir}
        isFa={isFa}
        error={error}
        isLight={isLight}
      />

      <SubmitButton
        label={copy.submitButton}
        isFa={isFa}
        onClick={handleSubmit}
        disabled={!phone.trim() || isSubmitting}
      />
      {authError && (
        <p
          className={`text-sm text-center ${
            isLight ? "text-red-600" : "text-red-400"
          } ${isFa ? "font-vazirmatn" : ""}`}
        >
          {authError}
        </p>
      )}
    </Container>
  );
}

export default LoginForm;
