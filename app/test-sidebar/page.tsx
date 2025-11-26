"use client"

import { SidebarDashboard } from "../../components/sidebarDashboard";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <SidebarDashboard />
    </main>
  );
}

