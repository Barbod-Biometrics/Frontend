"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import { Moon, Sun, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Theme } from "../../types";
import { setTheme } from "../../store/themeSlice";

type HeaderProps = {
  collapsed: boolean;
  onToggleAction: () => void;
  isAdmin?: boolean;
  isInAdminPanel?: boolean;
  onPanelSwitchAction?: () => void;
  onAvatarClickAction?: () => void;
};

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={clsx(
      "h-6 w-6 origin-center transition-transform duration-300",
      collapsed ? "rotate-180" : "rotate-0",
    )}
    fill="currentColor"
  >
    <path d="M8 5L18 12L8 19Z" />
  </svg>
);

const BusinessBadgeIcon = () => (
  <svg viewBox="0 0 32 32" className="h-8 w-8 text-[color:var(--md-sys-color-primary)]" fill="none">
    <rect x="4" y="4" width="24" height="24" rx="8" fill="currentColor" opacity="0.12" />
    <rect x="9.5" y="10.5" width="13" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M13.5 9.5C13.5 8.67157 14.1716 8 15 8H17C17.8284 8 18.5 8.67157 18.5 9.5V11.5H13.5V9.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M13 16.25H19M13 19H17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const AdminShieldIcon = () => (
  <svg viewBox="0 0 72 72" className="h-7 w-7" fill="none">
    <defs>
      <linearGradient id="adminShieldGradient" x1="0" x2="0" y1="0" y2="72" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0f8bff" />
        <stop offset="1" stopColor="#2152ff" />
      </linearGradient>
    </defs>
    <path
      d="M36 5.5 10 16.5v18.5C10 50 20 61.5 36 67c16-5.5 26-17 26-32V16.5L36 5.5Z"
      fill="url(#adminShieldGradient)"
    />
  </svg>
);

const AdminSwitchIcon = ({ isInAdmin }: { isInAdmin: boolean }) =>
  isInAdmin ? <BusinessBadgeIcon /> : <AdminShieldIcon />;

export function Header({
  collapsed,
  onToggleAction,
  isAdmin = false,
  isInAdminPanel = false,
  onPanelSwitchAction,
  onAvatarClickAction,
}: HeaderProps) {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isLight = theme === Theme.LIGHT;

  const themeIcon = useMemo(
    () =>
      isLight ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5 text-white" />
      ),
    [isLight],
  );

  const toggleTheme = () => {
    dispatch(setTheme(isLight ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <header
      dir="ltr"
      className={clsx(
        "fixed top-0 right-0 left-0 h-16 z-40 flex items-center justify-between gap-4 border-b px-4 py-3",
        "bg-[color:var(--md-sys-color-surface)] border-[color:var(--md-sys-color-outline-variant)]",
      )}
    >
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onAvatarClickAction}
          aria-label="???? ??????"
          title="تنظیمات شخصی"
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-full border transition",
            "border-[color:var(--md-sys-color-outline-variant)]",
            "bg-[color:var(--md-sys-color-surface-container-high)]",
            "text-[color:var(--md-sys-color-primary)]",
            "hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)]",
            "shadow-[var(--elevation-1)]",
          )}
        >
          <User className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="O¦O§UOUOOñ O-OU,O¦ U+U.OUOO'"
          title="حالت نمایش"
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-full border transition",
            "border-[color:var(--md-sys-color-outline-variant)]",
            "bg-[color:var(--md-sys-color-surface-container-high)]",
            "text-[color:var(--md-sys-color-on-surface-variant)]",
            "hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)]",
          )}
        >
          {themeIcon}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={onPanelSwitchAction}
            aria-label={isInAdminPanel ? "OñU?O¦U+ O\"UØ U_U+U, UcO3O\"ƒ?O U^ UcOOñ" : "OñU?O¦U+ O\"UØ U_U+U, OO_U.UOU+"}
            title={isInAdminPanel ? "پنل کسب و کار" : "پنل ادمین"}
            className={clsx(
              "group flex h-10 w-10 items-center justify-center rounded-2xl border text-[color:var(--md-sys-color-primary)] transition-transform duration-300",
              "border-[color:var(--md-sys-color-outline-variant)]",
              "bg-[color:var(--md-sys-color-surface-container-high)]",
              "hover:border-[color:var(--md-sys-color-primary)] hover:scale-[1.05] active:scale-95",
            )}
          >
            <AdminSwitchIcon isInAdmin={isInAdminPanel} />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label={collapsed ? "O\"OOý UcOñO_U+ U.U+U^" : "O\"O3O¦U+ U.U+U^"}
        onClick={onToggleAction}
        className={clsx(
          "group flex h-10 w-10 items-center justify-center rounded-2xl border text-[color:var(--md-sys-color-primary)] transition-transform duration-300",
          "border-[color:var(--md-sys-color-outline-variant)]",
          "bg-[color:var(--md-sys-color-surface-container-high)]",
          "hover:border-[color:var(--md-sys-color-primary)] hover:scale-[1.05] active:scale-95",
        )}
      >
        <CollapseIcon collapsed={collapsed} />
      </button>
    </header>
  );
}
