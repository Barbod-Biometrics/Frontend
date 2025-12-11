"use client";

import { useEffect, useState } from "react";
import { SidebarDashboard } from "../../components/sidebarDashboard";
import { Header } from "./header";
import { fetchUserProfiles, type ProfileListItem } from "../../lib/api/userProfiles";

const TEMP_APPROVED_PROFILE: ProfileListItem = {
  id: "temp-approved-profile",
  name: "Temporary Approved Profile",
  type: "legal",
  verification_status: "approved",
};

export default function Page() {
  const [collapsed, setCollapsed] = useState(false);
  const [profiles, setProfiles] = useState<ProfileListItem[]>([TEMP_APPROVED_PROFILE]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const result = await fetchUserProfiles();
        if (mounted) setProfiles([...result, TEMP_APPROVED_PROFILE]);
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
    </main>
  );
}
