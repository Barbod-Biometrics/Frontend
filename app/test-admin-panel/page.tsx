"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "../../components/admin-panel/sideBar";
import { Header } from "./header";

export default function Page() {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<"manageBusinessRequests" | "manageContactUsRequests">(
    "manageBusinessRequests",
  );

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Header
        collapsed={collapsed}
        onToggleAction={() => setCollapsed((state) => !state)}
        isAdmin
        isInAdminPanel
        onPanelSwitchAction={() => router.push("/test-sidebar")}
      />

      <AdminSidebar
        collapsed={collapsed}
        activeItemId={activeItem}
        onSelectItemAction={(id) => setActiveItem(id)}
      />
    </main>
  );
}
