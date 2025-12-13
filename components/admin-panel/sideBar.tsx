"use client";

import clsx from "clsx";
import { Briefcase, PhoneCall } from "lucide-react";
import { useState, type ReactElement, type ReactNode } from "react";
import { Button } from "../ui/Button";

type AdminNavItem = {
  id: "manageBusinessRequests" | "manageContactUsRequests";
  label: string;
  icon: ReactElement;
};

type AdminSidebarProps = {
  collapsed?: boolean;
  activeItemId?: AdminNavItem["id"];
  onSelectItemAction?: (id: AdminNavItem["id"]) => void;
};

const navItems: AdminNavItem[] = [
  {
    id: "manageBusinessRequests",
    label: "کسب و کار",
    icon: <Briefcase className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    id: "manageContactUsRequests",
    label: "تماس با تیم فروش",
    icon: <PhoneCall className="h-5 w-5" strokeWidth={1.8} />,
  },
];

const ItemIconFrame = ({ children, active }: { children: ReactNode; active?: boolean }) => (
  <span
    className={clsx(
      "flex h-10 w-10 items-center justify-center rounded-2xl border shadow-[var(--elevation-1)] transition-all duration-200",
      "border-[color:var(--md-sys-color-outline-variant)]",
      active
        ? "bg-[color:var(--md-sys-color-primary)]/12 text-[color:var(--md-sys-color-primary)]"
        : "bg-[color:var(--md-sys-color-surface-container-lowest)] text-[color:var(--md-sys-color-on-surface-variant)]",
    )}
  >
    {children}
  </span>
);

const AdminShieldIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 72 72" className={clsx("h-9 w-9", className)} fill="none">
    <defs>
      <linearGradient id="adminShieldGradient" x1="0" x2="0" y1="0" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f8bff" />
        <stop offset="1" stopColor="#2152ff" />
      </linearGradient>
      <linearGradient id="adminShieldAccent" x1="0" x2="0" y1="0" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3fa4ff" />
        <stop offset="1" stopColor="#2a6dff" />
      </linearGradient>
    </defs>
    <path
      d="M36 5.5 10 16.5v18.5C10 50 20 61.5 36 67c16-5.5 26-17 26-32V16.5L36 5.5Z"
      fill="url(#adminShieldGradient)"
    />
    <circle cx="46" cy="46" r="11" fill="url(#adminShieldAccent)" />
    <circle cx="46" cy="42" r="4.2" fill="url(#adminShieldGradient)" />
    <rect x="39.5" y="47" width="13" height="6.5" rx="3.25" fill="url(#adminShieldGradient)" />
  </svg>
);

export function AdminSidebar({ collapsed = false, activeItemId, onSelectItemAction }: AdminSidebarProps) {
  const [internalActive, setInternalActive] = useState<AdminNavItem["id"]>("manageBusinessRequests");
  const isCollapsed = Boolean(collapsed);
  const resolvedActive = activeItemId ?? internalActive;

  const handleSelect = (id: AdminNavItem["id"]) => {
    if (!activeItemId) setInternalActive(id);
    onSelectItemAction?.(id);
  };

  return (
    <aside
      dir="rtl"
      aria-label="ناوبری ادمین"
      className={clsx(
        "fixed right-0 top-14 z-30 h-[calc(108vh-8rem)] border bg-[color:var(--md-sys-color-surface-container)] shadow-[var(--elevation-2)] transition-all duration-300 flex flex-col overflow-visible",
        "border-[color:var(--md-sys-color-outline-variant)]",
        isCollapsed ? "w-[62px]" : "w-[200px]",
      )}
    >
      <div className="relative flex flex-col h-full">
        <div className="flex flex-col items-stretch gap-3 border-b border-[color:var(--md-sys-color-outline-variant)] px-4 pb-4 pt-6">
          <div dir="ltr" className="flex flex-row-reverse items-center justify-start gap-3">
            <ItemIconFrame active>
              <AdminShieldIcon />
            </ItemIconFrame>

            <span
              className={clsx(
                "text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] transition-all duration-200",
                isCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100",
              )}
            >
              ادمین
            </span>
          </div>
        </div>

        <div
          className={clsx(
            "flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-4",
            "[&::-webkit-scrollbar]:w-3",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:bg-[color:var(--md-sys-color-outline-variant)]",
            "[&::-webkit-scrollbar-thumb]:rounded-[7px]",
            "[&::-webkit-scrollbar-thumb]:border-2",
            "[&::-webkit-scrollbar-thumb]:border-[color:var(--md-sys-color-surface-container)]",
          )}
        >
          <div className="mb-6">
            {!isCollapsed && (
              <p className="mb-2 px-2 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
                مدیریت درخواست ها
              </p>
            )}

            <div className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = resolvedActive === item.id;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={() => handleSelect(item.id)}
                    className={clsx(
                      "group flex w-full items-center rounded-[10px] text-sm transition-colors duration-200",
                      isCollapsed
                        ? "justify-center gap-0 px-0 py-2 h-[52px]"
                        : "justify-between gap-2 px-3 py-2.5 min-h-[56px]",
                      isActive
                        ? "text-[color:var(--md-sys-color-primary)]"
                        : "text-[color:var(--md-sys-color-on-surface)]",
                      !isCollapsed &&
                        "hover:bg-[color:var(--md-sys-color-surface-container-highest)]/70",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ItemIconFrame active={isActive}>{item.icon}</ItemIconFrame>
                      <div
                        className={clsx(
                          "min-w-0 truncate text-right font-medium transition-all duration-150",
                          isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto",
                        )}
                      >
                        {item.label}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
