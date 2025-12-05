"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { resetLogin, selectMaskedPhone } from "../../store/loginSlice";
import LoginForm from "./login-form";
import OTPForm from "./otp-form";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const step = useSelector((state: RootState) => state.login.step);
  const maskedPhone = useSelector(selectMaskedPhone);

  useEffect(() => {
    dispatch(resetLogin());
  }, [dispatch]);

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
