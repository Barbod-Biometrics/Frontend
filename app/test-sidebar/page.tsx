"use client"

import { useState } from "react";
import { SidebarDashboard } from "../../components/sidebarDashboard";
import { TmpHeader } from "./tmp_header";

export default function Page() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <TmpHeader collapsed={collapsed} onToggleAction={() => setCollapsed((s) => !s)} />

      <SidebarDashboard collapsed={collapsed} onToggleAction={(next) => setCollapsed(next)} />
    </main>
  );
}

