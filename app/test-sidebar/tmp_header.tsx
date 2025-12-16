"use client";

import React from "react";
import clsx from "clsx";
import { Menu } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function TmpHeader({ collapsed, onToggleAction }: { collapsed: boolean; onToggleAction: () => void }) {
  return (
    <header
      className={clsx(
        "fixed top-1 right-1 z-40 flex items-center gap-3 rounded-lg border px-3 py-1",
        "bg-[color:var(--md-sys-color-surface-container)] border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--elevation-1)]",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label={collapsed ? "باز کردن سایدبار" : "بستن سایدبار"}
        onClick={onToggleAction}
        className="h-8 w-8 rounded-md p-0 text-[color:var(--md-sys-color-on-surface-variant)]"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="text-sm font-medium">نوار ابزار تست</div>
    </header>
  );
}
