"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { setLanguage } from "../store/languageSlice";
import { Language } from "../types";
import { RTL_LANGUAGES } from "../lib/translations";

const STORAGE_KEY = "barbod-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const language = useSelector((state: RootState) => state.language.language);
  const hasHydrated = useRef(false);

  // 1. Hydrate from LocalStorage ONCE on mount
  useEffect(() => {
    if (typeof window === "undefined" || hasHydrated.current) return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;

    // Validate and Dispatch
    if (stored && Object.values(Language).includes(stored)) {
      // We only dispatch if it differs from default state to avoid unnecessary updates
      // However, reducers usually handle equality checks too.
      dispatch(setLanguage(stored));
    }

    hasHydrated.current = true;
  }, [dispatch]);

  // 2. Sync to LocalStorage and DOM whenever language changes
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    // Update LocalStorage
    window.localStorage.setItem(STORAGE_KEY, language);

    // Update DOM Attributes
    const dir = RTL_LANGUAGES.includes(language) ? "rtl" : "ltr";

    document.documentElement.lang = language;
    document.documentElement.dir = dir;

    if (document.body) {
      document.body.setAttribute("dir", dir);
      document.body.setAttribute("data-language", language);
      document.body.classList.toggle(
        "font-vazirmatn",
        language === Language.FA
      );
    }

    if (document.documentElement) {
      document.documentElement.classList.toggle(
        "font-vazirmatn",
        language === Language.FA
      );
    }
  }, [language]);

  return <>{children}</>;
}
