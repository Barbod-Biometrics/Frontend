"use client";

import { useState } from "react";
import LoginForm from "./login-form";
import OTPForm from "./otp-form";

export default function LoginPage() {
  const [step, setStep] = useState<"login" | "otp">("login");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneSubmit = (formattedPhone: string) => {
    setPhoneNumber(formattedPhone);
    setStep("otp");
  };

  return (
    <>
      {step === "login" ? (
        <LoginForm onSubmit={handlePhoneSubmit} />
      ) : (
        <OTPForm masked={phoneNumber} />
      )}
    </>
  );
}
