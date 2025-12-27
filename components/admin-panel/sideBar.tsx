"use client";

import clsx from "clsx";
import { Briefcase, LogOut, PhoneCall } from "lucide-react";
import { useState, type ReactElement, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";
import { clearClientStorage } from "../../lib/auth-storage";
import { clearAuthState } from "../../store/loginSlice";

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
  <svg viewBox="0 0 72 72" className={clsx("h-7.5 w-7.5", className)} fill="none">
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
  </svg>
);

export function AdminSidebar({ collapsed = false, activeItemId, onSelectItemAction }: AdminSidebarProps) {
  const [internalActive, setInternalActive] = useState<AdminNavItem["id"]>("manageBusinessRequests");
  const dispatch = useDispatch();
  const router = useRouter();
  const isCollapsed = Boolean(collapsed);
  const resolvedActive = activeItemId ?? internalActive;

  const handleSelect = (id: AdminNavItem["id"]) => {
    if (!activeItemId) setInternalActive(id);
    onSelectItemAction?.(id);
  };

  const handleLogout = async () => {
    try {
      await clearClientStorage();
    } finally {
      dispatch(clearAuthState());
      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <aside
      dir="rtl"
      aria-label="ناوبری ادمین"
      className={clsx(
        "fixed right-0 top-14 bottom-0 z-30 border bg-[color:var(--md-sys-color-surface-container)] shadow-[var(--elevation-2)] transition-[width,transform] duration-300 flex flex-col",
        "border-[color:var(--md-sys-color-outline-variant)]",
        isCollapsed
          ? "w-[min(85vw,320px)] overflow-hidden translate-x-full pointer-events-none sm:pointer-events-auto sm:translate-x-0 sm:w-[57px]"
          : "w-[min(85vw,320px)] translate-x-0 overflow-visible sm:w-[200px]",
      )}
    >
      <div className="relative flex flex-col h-full">
        <div
          className={clsx(
            "flex flex-col px-4 items-stretch gap-3 border-b border-[color:var(--md-sys-color-outline-variant)] pb-4 pt-6",
          )}
        >
        <div
          className={clsx(
            "flex items-center min-w-0 flex-1 justify-start",
            isCollapsed ? "gap-2" : "gap-3",
          )}
        >
            <span className="flex-shrink-0">
              <ItemIconFrame active>
              <AdminShieldIcon />
            </ItemIconFrame>
            </span>
            <div
              className={clsx(
                "min-w-0 transition-all duration-200 text-right",
                isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto",
              )}
            >
              {!isCollapsed && (
                <Typography
                  variant="caption"
                  className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]"
                >
                ادمین
              </Typography>
              )}
            </div>
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
          <div className="mb-6 gap-3 flex flex-col">
            {!isCollapsed && (
              <p className="mb-2 px-2 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
                مدیریت درخواست ها
              </p>
            )}

            <div className="space-y-0">
              {navItems.map((item) => {
                const isActive = resolvedActive === item.id;
                return (
                  <div key={item.id} title={isCollapsed ? item.label : undefined}>
                    <Button
                      variant="ghost"
                      onClick={() => handleSelect(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={clsx(
                      "group flex w-full items-center rounded-[10px] text-sm transition-colors transition-shadow duration-200",
                      isCollapsed
                        ? "justify-start gap-0 px-2 py-1.5 h-[47px]"
                        : "justify-between gap-2 px-3.5 py-2 min-h-[47px]",
                      isActive
                        ? "text-[color:var(--md-sys-color-primary)]"
                        : "text-[color:var(--md-sys-color-on-surface)]",
                      "hover:shadow-[var(--elevation-1)]",
                      "hover:bg-[color:var(--md-sys-color-surface-container-highest)]/70",
                    )}
                    >
                      <div className="flex items-center gap-2">
                        <ItemIconFrame active={isActive}>{item.icon}</ItemIconFrame>
                        <div
                          className={clsx(
                            "min-w-0 truncate text-right font-medium transition-all duration-150",
                            isCollapsed ? "opacity-0 w-auto pointer-events-none" : "opacity-100 w-auto",
                          )}
                        >
                          {item.label}
                        </div>
                      </div>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--md-sys-color-outline-variant)] px-2 py-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            aria-label="خروج"
            title={isCollapsed ? "خروج" : undefined}
            className={clsx(
              "group flex w-full items-center rounded-[10px] text-sm transition-colors transition-shadow duration-200",
              isCollapsed
                ? "justify-start gap-0 px-2 py-1.5 h-[47px]"
                : "justify-between gap-2 px-3.5 py-2 min-h-[47px]",
              "text-[color:var(--md-sys-color-error)]",
              "hover:shadow-[var(--elevation-1)]",
              "hover:bg-[color:var(--md-sys-color-error)]/10",
            )}
          >
            <div className="flex items-center gap-2">
              <ItemIconFrame>
                <LogOut className="h-5 w-5 text-[color:var(--md-sys-color-error)]" strokeWidth={1.8} />
              </ItemIconFrame>
              <div
                className={clsx(
                  "min-w-0 truncate text-right font-medium transition-all duration-150",
                  isCollapsed ? "opacity-0 w-auto pointer-events-none" : "opacity-100 w-auto",
                )}
              >
                خروج
              </div>
            </div>
          </Button>
        </div>
      </div>
    </aside>
  );
}
