// components/layout/DashboardLayout.tsx
"use client";

import React, { useEffect, useState } from "react";
import { SidebarDashboard } from "../components/sidebarDashboard";
import { Header } from "../app/test-sidebar/header";
import { fetchUserProfiles, type ProfileListItem } from "../lib/api/userProfiles";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
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

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Header collapsed={collapsed} onToggleAction={() => setCollapsed((s) => !s)} />

      <SidebarDashboard
        collapsed={collapsed}
        onToggleAction={(next) => setCollapsed(next)}
        businessProfiles={profiles}
      />

     
      <div
        className={`transition-all duration-300 pt-16 min-h-screen ${
          collapsed ? "mr-[76px] pr-4" : "mr-[210px] pr-6"
        }`}
      >
        {children}
      </div>
    </main>
  );
}
