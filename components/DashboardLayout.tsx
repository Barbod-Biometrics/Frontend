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
let persistedSidebarCollapsed = false;

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
  const [collapsed, setCollapsed] = useState(() => persistedSidebarCollapsed);
  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);

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

  const normalizedPath = (pathname ?? "").replace(/\/$/, "");
  const shouldHideContent =
    Boolean(currentProfile) &&
    !isApprovedStatus(currentProfile?.verification_status) &&
    LOCKED_ROUTES.has(normalizedPath);

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Header
        collapsed={collapsed}
        onToggleAction={() =>
          setCollapsed((state) => {
            const next = !state;
            persistedSidebarCollapsed = next;
            return next;
          })
        }
        isAdmin={isAdminUser}
        isInAdminPanel={false}
        onPanelSwitchAction={() => router.push("/admin")}
      />

      <SidebarDashboard
        collapsed={collapsed}
        onToggleAction={(next) => {
          persistedSidebarCollapsed = next;
          setCollapsed(next);
        }}
        businessProfiles={profiles}
        isAdminView={isAdminUser}
      />

      <div 
        className={`transition-all duration-300 pt-16 min-h-screen ${
          collapsed ? 'pr-20' : 'pr-64'
        }`}
      >
        {shouldHideContent ? null : children}
      </div>
    </main>
  );
}
