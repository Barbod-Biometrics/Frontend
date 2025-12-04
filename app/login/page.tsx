"use client";

import LoginForm from "./login-form";
import OTPForm from "./otp-form";
import { useLoginContext } from "./login-context";

export default function LoginPage() {
  const { step, maskedPhone } = useLoginContext();

  return (
    <>
      {step === "login" ? (
        <LoginForm />
      ) : (
        <OTPForm masked={maskedPhone} />
      )}
    </>
  );
}
