"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store/store";
import { setAuthEventHandler } from "../lib/auth-events";
import { clearAuthState, hydrateFromStorage } from "../store/loginSlice";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  useEffect(() => {
    setAuthEventHandler((event) => {
      if (event === "unauthorized") {
        dispatch(clearAuthState());
      }
    });

    return () => setAuthEventHandler(null);
  }, [dispatch]);

  return <>{children}</>;
}


