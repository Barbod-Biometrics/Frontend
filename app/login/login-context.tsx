"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { requestOtp, verifyOtp } from "../../lib/auth-api";
import { saveAuth } from "../../lib/auth-storage";

type Step = "login" | "otp";

interface LoginContextType {
  isHovered: boolean;
  setIsHovered: (value: boolean) => void;
  step: Step;
  phoneNumber: string;
  maskedPhone: string;
  authError: string | null;
  isSubmitting: boolean;
  requestOtp: (formattedPhone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  reset: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

const maskPhoneNumber = (phone: string) => {
  if (!phone) return "";
  const normalized = phone.replace(/\s/g, "");
  const lastDigits = normalized.slice(-4);
  const masked = normalized.slice(0, -4).replace(/\d/g, "*");
  return `${masked}${lastDigits}`;
};

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [step, setStep] = useState<Step>("login");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maskedPhone = useMemo(() => maskPhoneNumber(phoneNumber), [phoneNumber]);

  const handleRequestOtp = async (formattedPhone: string) => {
    console.log("[login] sending OTP request", formattedPhone);
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await requestOtp(formattedPhone);
      console.log("[login] OTP request succeeded");
      setPhoneNumber(formattedPhone);
      setStep("otp");
    } catch (error) {
      console.log("[login] OTP request failed", error);
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send the code right now. Please try again.";
      setAuthError(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    if (!phoneNumber) {
      setAuthError("Missing phone number. Please start again.");
      setStep("login");
      return;
    }

    setIsSubmitting(true);
    setAuthError(null);

    try {
      const tokens = await verifyOtp(phoneNumber, otp);
      saveAuth(tokens);
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Verification failed. Please try again.";
      setAuthError(message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) return;
    await handleRequestOtp(phoneNumber);
  };

  const reset = () => {
    setStep("login");
    setPhoneNumber("");
    setAuthError(null);
  };

  return (
    <LoginContext.Provider
      value={{
        isHovered,
        setIsHovered,
        step,
        phoneNumber,
        maskedPhone,
        authError,
        isSubmitting,
        requestOtp: handleRequestOtp,
        verifyOtp: handleVerifyOtp,
        resendOtp: handleResendOtp,
        reset,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export function useLoginContext() {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLoginContext must be used within a LoginProvider");
  }
  return context;
}
