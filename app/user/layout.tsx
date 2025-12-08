"use client";

import { UserRoute } from "../../components/RequireRole";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <UserRoute>{children}</UserRoute>;
}
