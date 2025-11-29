"use client";
import { AuthSidebar } from "../../components/auth/sideBar";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)]">
      <div className="flex min-h-screen items-start justify-end px-6 py-10">
        <AuthSidebar />
      </div>
    </main>
  );
}
