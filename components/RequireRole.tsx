"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  selectIsAdmin,
  selectIsAuthenticated,
  selectIsHydrated,
} from "../store/loginSlice";

type Props = { children: ReactNode };

export function AdminRoute({ children }: Props) {
  const router = useRouter();
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const hydrated = useSelector((state: RootState) => selectIsHydrated(state));

  useEffect(() => {
    // wait for storage hydration first
    if (!hydrated) return;

    // not authenticated -> ensure they login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // wait until we know admin status
    if (typeof isAdmin === "undefined") return;

    if (!isAdmin) {
      // not admin -> send to user area
      router.push("/user");
    }
  }, [isAdmin, isAuthenticated, hydrated, router]);

  if (!hydrated || !isAuthenticated || typeof isAdmin === "undefined")
    return null;
  if (!isAdmin) return null;
  return <>{children}</>;
}

export function UserRoute({ children }: Props) {
  const router = useRouter();
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const isAuthenticated = useSelector((state: RootState) =>
    selectIsAuthenticated(state)
  );
  const hydrated = useSelector((state: RootState) => selectIsHydrated(state));

  useEffect(() => {
    // wait for storage hydration first
    if (!hydrated) return;

    // not authenticated -> ensure they login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (typeof isAdmin === "undefined") return;

    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, isAuthenticated, hydrated, router]);

  if (!hydrated || !isAuthenticated || typeof isAdmin === "undefined")
    return null;
  if (isAdmin) return null;
  return <>{children}</>;
}

export default AdminRoute;
