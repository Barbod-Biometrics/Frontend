"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store/store";
import { hydrateFromStorage } from "../store/loginSlice";

export function AuthHydrator({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}


