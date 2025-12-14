"use client";

import React, { useMemo } from "react";
import clsx from "clsx";
import { Moon, Sun, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Theme } from "../../../types";
import { setTheme } from "../../../store/themeSlice";

type HeaderProps = {
  collapsed: boolean;
  onToggleAction: () => void;
  isAdmin?: boolean;
  isInAdminPanel?: boolean;
  onPanelSwitchAction?: () => void;
  onAvatarClickAction?: () => void;
};

const CollapseIcon = ({ collapsed }: { collapsed: boolean }) =>
  collapsed ? (
    <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none">
      <defs>
        <linearGradient id="openGradient" x1="0" x2="0" y1="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f8bff" />
          <stop offset="1" stopColor="#2152ff" />
        </linearGradient>
      </defs>
      <rect x="10" y="12" width="44" height="8" rx="4" fill="url(#openGradient)" />
      <rect x="10" y="28" width="44" height="8" rx="4" fill="url(#openGradient)" />
      <rect x="10" y="44" width="44" height="8" rx="4" fill="url(#openGradient)" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 64" className="h-6 w-6" fill="none">
      <defs>
        <linearGradient id="collapseGradient" x1="0" x2="0" y1="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f8bff" />
          <stop offset="1" stopColor="#2152ff" />
        </linearGradient>
      </defs>
      <path d="M12 16L12 48L28 32Z" fill="url(#collapseGradient)" />
      <rect x="32" y="12" width="22" height="8" rx="4" fill="url(#collapseGradient)" />
      <rect x="32" y="28" width="22" height="8" rx="4" fill="url(#collapseGradient)" />
      <rect x="32" y="44" width="22" height="8" rx="4" fill="url(#collapseGradient)" />
    </svg>
  );

const AdminSwitchIcon = ({ isInAdmin }: { isInAdmin: boolean }) =>
  isInAdmin ? (
    <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
      <defs>
        <linearGradient id="businessGradient" x1="0" x2="0" y1="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f8bff" />
          <stop offset="1" stopColor="#2152ff" />
        </linearGradient>
      </defs>
      <rect x="12" y="20" width="40" height="28" rx="6" fill="url(#businessGradient)" />
      <rect x="24" y="14" width="16" height="8" rx="3" fill="url(#businessGradient)" />
      <rect x="12" y="30" width="40" height="4" fill="rgba(255,255,255,0.4)" />
      <circle cx="32" cy="32" r="3" fill="#fff" />
    </svg>
  ) : (
    <svg viewBox="0 0 64 64" className="h-7 w-7" fill="none">
      <defs>
        <linearGradient id="adminGradient" x1="0" x2="0" y1="0" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f8bff" />
          <stop offset="1" stopColor="#2152ff" />
        </linearGradient>
      </defs>
      <path
        d="M32 6 12 14v16c0 11 7.6 21 20 26 12.4-5 20-15 20-26V14L32 6Z"
        fill="url(#adminGradient)"
      />
      <circle cx="32" cy="30" r="8" fill="#fff" />
      <rect x="26" y="38" width="12" height="8" rx="3" fill="#fff" />
    </svg>
  );

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
    () => (isLight ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-blue-200" />),
    [isLight],
  );

  const toggleTheme = () => {
    dispatch(setTheme(isLight ? Theme.DARK : Theme.LIGHT));
  };

  return (
    <header
      dir="ltr"
      className={clsx(
        "fixed top-0 right-0 left-0 h-15 z-40 flex items-center justify-between gap-4 border-b px-4 py-3",
        "bg-[color:var(--md-sys-color-surface)] border-[color:var(--md-sys-color-outline-variant)]",
      )}
    >
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onAvatarClickAction}
          aria-label="???? ??????"
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
          aria-label="تغییر حالت نمایش"
          className={clsx(
            "flex h-10 w-10 items-center justify-center rounded-full border transition",
            "border-[color:var(--md-sys-color-outline-variant)]",
            "bg-[color:var(--md-sys-color-surface-container-high)]",
            "hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)]",
          )}
        >
          {themeIcon}
        </button>

        {isAdmin && (
          <button
            type="button"
            onClick={onPanelSwitchAction}
            aria-label={isInAdminPanel ? "رفتن به پنل کسب‌ و کار" : "رفتن به پنل ادمین"}
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-2xl border transition",
              "border-[color:var(--md-sys-color-outline-variant)]",
              "bg-[color:var(--md-sys-color-surface-container-high)]",
              "hover:border-[color:var(--md-sys-color-primary)]",
            )}
          >
            <AdminSwitchIcon isInAdmin={isInAdminPanel} />
          </button>
        )}
      </div>

      <button
        type="button"
        aria-label={collapsed ? "باز کردن منو" : "بستن منو"}
        onClick={onToggleAction}
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-2xl border transition",
          "border-[color:var(--md-sys-color-outline-variant)]",
          "bg-[color:var(--md-sys-color-surface-container-high)]",
          "hover:border-[color:var(--md-sys-color-primary)]",
        )}
      >
        <CollapseIcon collapsed={collapsed} />
      </button>
    </header>
  );
}
