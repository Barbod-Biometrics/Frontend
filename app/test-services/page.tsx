"use client";

import React from "react";

import { Footer } from "../../components/Footer";
import { Navbar } from "../../components/Navbar";
import { TestServicesFlow } from "../../components/test-services/TestServicesFlow";
import { useLanguage } from "../../lib/useLanguage";
import { cn } from "../../lib/utils";

export default function TestServicesPage() {
  const { dir } = useLanguage();
  const isRtl = dir === "rtl";

  return (
    <div
      className={cn(
        "min-h-screen bg-[color:var(--md-sys-color-surface)] text-[color:var(--md-sys-color-on-surface)]",
        isRtl && "font-vazirmatn",
      )}
      dir={dir}
    >
      <Navbar />

      <main className="pr-2 sm:pr-4 lg:pr-8 xl:pr-12">
        <TestServicesFlow variant="page" />
      </main>

      <Footer />
    </div>
  );
}
