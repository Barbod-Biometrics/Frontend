"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SidebarDashboard } from "../../components/sidebarDashboard";
import { Header } from "./header";
import { fetchUserProfiles, type ProfileListItem } from "../../lib/api/userProfiles";

function PageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adminFromQuery = searchParams.get("admin") === "1";
  const adminFlag =
    typeof window !== "undefined" && window.localStorage.getItem("admin-return-to-business") === "1";
  const isAdmin = useMemo(() => adminFromQuery || adminFlag, [adminFromQuery, adminFlag]);

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

  useEffect(() => {
    if (!adminFromQuery && typeof window !== "undefined") {
      window.localStorage.removeItem("admin-return-to-business");
    }
  }, [adminFromQuery]);

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
        isAdminView={isAdmin}
      />
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
