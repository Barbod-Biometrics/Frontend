// components/layout/DashboardLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { SidebarDashboard } from "../components/sidebarDashboard";
import { Header } from "../app/test-sidebar/header";
import { fetchUserProfiles, type ProfileListItem } from "../lib/api/userProfiles";
import type { RootState } from "../store/store";
import { selectIsAdmin } from "../store/loginSlice";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const LOCKED_ROUTES = new Set(["/business-info", "/wallet"]);
const MOBILE_QUERY = "(max-width: 639px)";
let persistedSidebarCollapsed = false;
let persistedSidebarMobileOpen = false;

const isApprovedStatus = (value?: string | null) => {
  const normalized = (value ?? "").toLowerCase();
  return (
    normalized.includes("approved") ||
    normalized.includes("verified") ||
    normalized.includes("accept")
  );
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const isAdminUser = Boolean(isAdmin);
  const currentProfile = useSelector(
    (state: RootState) => state.selectedProfile.currentProfile
  );
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedDesktop, setCollapsedDesktop] = useState(
    () => persistedSidebarCollapsed
  );
  const [mobileOpen, setMobileOpen] = useState(
    () => persistedSidebarMobileOpen
  );
  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const theme = useSelector((state: RootState) => state.theme.theme);
  const isLight = theme === Theme.LIGHT;

  useEffect(() => {
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
  }, []);

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

  const normalizedPath = (pathname ?? "").replace(/\/$/, "");
  const shouldHideContent =
    Boolean(currentProfile) &&
    !isApprovedStatus(currentProfile?.verification_status) &&
    LOCKED_ROUTES.has(normalizedPath);
  const collapsed = isMobile ? !mobileOpen : collapsedDesktop;
  const handleToggle = () => {
    if (isMobile) {
      setMobileOpen((open) => {
        const next = !open;
        persistedSidebarMobileOpen = next;
        return next;
      });
    } else {
      setCollapsedDesktop((state) => {
        const next = !state;
        persistedSidebarCollapsed = next;
        return next;
      });
    }
  };

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Header
        collapsed={collapsed}
        onToggleAction={handleToggle}
        isAdmin={isAdminUser}
        isInAdminPanel={false}
        onPanelSwitchAction={() => router.push("/admin")}
      />

      <SidebarDashboard
        collapsed={collapsed}
        onToggleAction={(next) => {
          if (isMobile) {
            const open = !next;
            persistedSidebarMobileOpen = open;
            setMobileOpen(open);
          } else {
            persistedSidebarCollapsed = next;
            setCollapsedDesktop(next);
          }
        }}
        businessProfiles={profiles}
        isAdminView={isAdminUser}
      />

      <div 
        className={`transition-all duration-300 pt-16 min-h-screen ${
          collapsed ? 'pr-0 sm:pr-20' : 'pr-0 sm:pr-64'
        }`}
      >
        {shouldHideContent ? null : children}
      </div>
    </main>
  );
}
