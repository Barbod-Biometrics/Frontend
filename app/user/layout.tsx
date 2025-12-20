"use client";

import { UserRoute } from "../../components/RequireRole";
import { DashboardLayout } from "../../components/DashboardLayout";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </UserRoute>
  );
}
