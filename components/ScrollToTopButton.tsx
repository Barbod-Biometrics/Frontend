"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

import { useLanguage } from "../lib/useLanguage";
import { cn } from "../lib/utils";
import { Button } from "./ui/Button";

const VISIBILITY_OFFSET = 420;

export function ScrollToTopButton() {
  const { dir } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > VISIBILITY_OFFSET);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const positionClass = dir === "rtl" ? "left-5 sm:left-8" : "right-5 sm:right-8";

  return (
    <div
      className={cn(
        "fixed bottom-6 z-40 transition-all duration-300",
        positionClass,
        isVisible ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
      )}
    >
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container)] text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-2)] hover:-translate-y-0.5"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
