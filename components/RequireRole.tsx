"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { selectIsAdmin } from "../store/loginSlice";

type Props = { children: ReactNode };

export function AdminRoute({ children }: Props) {
  const router = useRouter();
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const loginStep = useSelector((state: RootState) => state.login.step);

  useEffect(() => {
    // if not login, ensure they login
    if (loginStep === "login") {
      router.push("/login");
      return;
    }

    // wait until we know status
    if (typeof isAdmin === "undefined") return;

    if (!isAdmin) {
      // not admin -> send to user area
      router.push("/user");
    }
  }, [isAdmin, loginStep, router]);

  if (loginStep === "login" || typeof isAdmin === "undefined") return null;
  if (!isAdmin) return null;
  return <>{children}</>;
}

export function UserRoute({ children }: Props) {
  const router = useRouter();
  const isAdmin = useSelector((state: RootState) => selectIsAdmin(state));
  const loginStep = useSelector((state: RootState) => state.login.step);

  useEffect(() => {
    if (loginStep === "login") {
      router.push("/login");
      return;
    }

    if (typeof isAdmin === "undefined") return;

    if (isAdmin) {
      router.push("/admin");
    }
  }, [isAdmin, loginStep, router]);

  if (loginStep === "login" || typeof isAdmin === "undefined") return null;
  if (isAdmin) return null;
  return <>{children}</>;
}

export default AdminRoute;
