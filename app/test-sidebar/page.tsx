"use client"

import { useState } from "react";
import { SidebarDashboard } from "../../components/sidebarDashboard";
import { Header } from "./header";

export default function Page() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <Header collapsed={collapsed} onToggleAction={() => setCollapsed((s) => !s)} />

      <SidebarDashboard collapsed={collapsed} onToggleAction={(next) => setCollapsed(next)} />
    </main>
  );
}
