"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";
import { AdminSidebar } from "./admin-panel/sideBar";
import { SidebarDashboard } from "./sidebarDashboard";
import { fetchUserProfiles, type ProfileListItem } from "../lib/api/userProfiles";
import { Header } from "../app/test-admin-panel/header";
import BusinessRequests from "./admin-panel/manage-requests/businessRequests";
import ContactSalesRequests from "./admin-panel/manage-requests/contactSalesRequests";
import { usePathname } from "next/navigation";
import { ContactInfo } from "../app/user-contact/components/ContactInfo";
import { Typography } from "./ui/Typography";

type PanelView = "admin" | "business";

const ADMIN_PANEL_RETURN_KEY = "admin-panel-return-view";
const ADMIN_PANEL_BUSINESS_VIEW = "business";
const MOBILE_QUERY = "(max-width: 639px)";
let persistedAdminSidebarCollapsed = false;
let persistedAdminSidebarMobileOpen = false;

type AdminPanelLayoutProps = {
  children?: ReactNode;
};

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const pathname = usePathname();
  const [panelView, setPanelView] = useState<PanelView>("admin");
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedDesktop, setCollapsedDesktop] = useState(
    () => persistedAdminSidebarCollapsed,
  );
  const [mobileOpen, setMobileOpen] = useState(
    () => persistedAdminSidebarMobileOpen,
  );
  const [activeItem, setActiveItem] = useState<"manageBusinessRequests" | "manageContactUsRequests">(
    "manageBusinessRequests",
  );
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const normalizedPath = (pathname ?? "").replace(/\/$/, "");
  const showDefaultAdminView = normalizedPath === "/admin";

  useEffect(() => {
    try {
      const preferredView =
        typeof window !== "undefined" ? window.localStorage.getItem(ADMIN_PANEL_RETURN_KEY) : null;
      if (preferredView === ADMIN_PANEL_BUSINESS_VIEW) {
        setPanelView("business");
        window.localStorage.removeItem(ADMIN_PANEL_RETURN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (panelView !== "business" || profiles.length) return;
    let mounted = true;

    const load = async () => {
      try {
        const result = await fetchUserProfiles();
        if (mounted) setProfiles(result);
      } catch (error) {
        console.error("Failed to load profiles", error);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [panelView, profiles.length]);

  useEffect(() => {
    if (panelView !== "business" && isSettingsOpen) {
      setIsSettingsOpen(false);
    }
  }, [panelView, isSettingsOpen]);

  const headerIsInAdminPanel = useMemo(() => panelView === "admin", [panelView]);
  const collapsed = isMobile ? !mobileOpen : collapsedDesktop;
  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((open) => {
        const next = !open;
        persistedAdminSidebarMobileOpen = next;
        return next;
      });
    } else {
      setCollapsedDesktop((state) => {
        const next = !state;
        persistedAdminSidebarCollapsed = next;
        return next;
      });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = (event?: MediaQueryListEvent) => {
      setIsMobile(event ? event.matches : media.matches);
    };
    handleChange();
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }
    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)] pt-16 md:pt-20">
      <Header
        collapsed={collapsed}
        onToggleAction={handleToggle}
        isAdmin
        isInAdminPanel={headerIsInAdminPanel}
        onAvatarClickAction={panelView === "business" ? () => setIsSettingsOpen(true) : undefined}
        onPanelSwitchAction={() =>
          setPanelView((current) => (current === "admin" ? "business" : "admin"))
        }
      />

      {panelView === "admin" ? (
        <>
          <AdminSidebar
            collapsed={collapsed}
            activeItemId={activeItem}
            onSelectItemAction={(id) => setActiveItem(id)}
          />
          <div
            className={clsx(
              "min-h-screen transition-all duration-300",
              collapsed
                ? "mr-0 pr-4 sm:mr-[76px] sm:pr-4"
                : "mr-0 pr-4 sm:mr-[210px] sm:pr-6",
            )}
          >
            {showDefaultAdminView ? (
              <>
                {activeItem === "manageBusinessRequests" && <BusinessRequests />}
                {activeItem === "manageContactUsRequests" && <ContactSalesRequests />}
              </>
            ) : (
              children
            )}
          </div>
        </>
      ) : (
        <SidebarDashboard
          collapsed={collapsed}
          onToggleAction={(next) => {
            if (isMobile) {
              const open = !next;
              persistedAdminSidebarMobileOpen = open;
              setMobileOpen(open);
            } else {
              persistedAdminSidebarCollapsed = next;
              setCollapsedDesktop(next);
            }
          }}
          businessProfiles={profiles}
          isAdminView
        />
      )}

      {panelView === "business" && isSettingsOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div
            dir="rtl"
            className="w-[calc(100%-2rem)] max-w-3xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] p-6 shadow-[var(--elevation-3)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
                Account settings
              </Typography>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setIsSettingsOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface-variant)] transition hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            <ContactInfo />
          </div>
        </div>
      )}
    </main>
  );
}
