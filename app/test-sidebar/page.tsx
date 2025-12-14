"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarDashboard } from "../../components/sidebarDashboard";
import { Header } from "./header";
import { fetchUserProfiles, type ProfileListItem } from "../../lib/api/userProfiles";

export default function Page() {
  const router = useRouter();

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
      <Header
        collapsed={collapsed}
        onToggleAction={() => setCollapsed((s) => !s)}
      />

      <SidebarDashboard
        collapsed={collapsed}
        onToggleAction={(next) => setCollapsed(next)}
        businessProfiles={profiles}
      />
    </main>
  );
}
