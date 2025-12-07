"use client";

import AdminRoute from "../../components/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminRoute>{children}</AdminRoute>;
}
