"use client";

import React from "react";
import { Provider } from "react-redux";

import { LanguageProvider } from "../components/LanguageProvider";
import { ThemeProvider } from "../components/ThemeProvider";
import { store } from "../store/store";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}
