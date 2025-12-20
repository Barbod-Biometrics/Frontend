"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import clsx from "clsx";
import { AdminSidebar } from "./admin-panel/sideBar";
import { SidebarDashboard } from "./sidebarDashboard";
import { fetchUserProfiles, type ProfileListItem } from "../lib/api/userProfiles";
import { Header } from "../app/test-admin-panel/header";
import BusinessRequests from "./admin-panel/manage-requests/businessRequests";
import ContactSalesRequests from "./admin-panel/manage-requests/contactSalesRequests";
import { usePathname } from "next/navigation";

type PanelView = "admin" | "business";

const ADMIN_PANEL_RETURN_KEY = "admin-panel-return-view";
const ADMIN_PANEL_BUSINESS_VIEW = "business";

type AdminPanelLayoutProps = {
  children?: ReactNode;
};

export default function AdminPanelLayout({ children }: AdminPanelLayoutProps) {
  const pathname = usePathname();
  const [panelView, setPanelView] = useState<PanelView>("admin");
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<"manageBusinessRequests" | "manageContactUsRequests">(
    "manageBusinessRequests",
  );
  const [profiles, setProfiles] = useState<ProfileListItem[]>([]);
  const normalizedPath = (pathname ?? "").replace(/\/$/, "");
  const showDefaultAdminView = normalizedPath === "/admin";

  useEffect(() => {
    try {
      const preferredView =
        typeof window !== "undefined" ? window.localStorage.getItem(ADMIN_PANEL_RETURN_KEY) : null;
      if (preferredView === ADMIN_PANEL_BUSINESS_VIEW) {
        setPanelView("business");
        window.localStorage.removeItem(ADMIN_PANEL_RETURN_KEY);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    if (panelView !== "business" || profiles.length) return;
    let mounted = true;

    const load = async () => {
      try {
        const result = await fetchUserProfiles();
        if (mounted) setProfiles(result);
      } catch (error) {
        console.error("Failed to load profiles", error);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [panelView, profiles.length]);

  const headerIsInAdminPanel = useMemo(() => panelView === "admin", [panelView]);

  return (
    <main className="relative min-h-screen w-full bg-[color:var(--bg-base)] text-[color:var(--text-primary)] pt-16 md:pt-20">
      <Header
        collapsed={collapsed}
        onToggleAction={() => setCollapsed((state) => !state)}
        isAdmin
        isInAdminPanel={headerIsInAdminPanel}
        onPanelSwitchAction={() =>
          setPanelView((current) => (current === "admin" ? "business" : "admin"))
        }
      />

      {panelView === "admin" ? (
        <>
          <AdminSidebar
            collapsed={collapsed}
            activeItemId={activeItem}
            onSelectItemAction={(id) => setActiveItem(id)}
          />
          <div
            className={clsx(
              "min-h-screen transition-all duration-300",
              collapsed ? "mr-[76px] pr-4" : "mr-[210px] pr-6",
            )}
          >
            {showDefaultAdminView ? (
              <>
                {activeItem === "manageBusinessRequests" && <BusinessRequests />}
                {activeItem === "manageContactUsRequests" && <ContactSalesRequests />}
              </>
            ) : (
              children
            )}
          </div>
        </>
      ) : (
        <SidebarDashboard
          collapsed={collapsed}
          onToggleAction={(next) => setCollapsed(next)}
          businessProfiles={profiles}
          isAdminView
        />
      )}
    </main>
  );
}
