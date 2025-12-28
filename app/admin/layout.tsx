"use client";

import AdminPanelLayout from "../../components/adminPanelLayout";
import AdminRoute from "../../components/RequireRole";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminRoute>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </AdminRoute>
  );
}
