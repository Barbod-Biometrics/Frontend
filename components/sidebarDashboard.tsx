"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type ReactElement,
} from "react";
import clsx from "clsx";
import { Typography } from "./ui/Typography";
import { Button } from "./ui/Button";
import {
  ChevronDown,
  ChevronLeft,
  FileText,
  Fingerprint,
  LogOut,
  PlusCircle,
  ScanFace,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type { ProfileListItem } from "../lib/api/userProfiles";
import { useDispatch, useSelector } from "react-redux"; 
import { selectProfileById, setCurrentProfile } from "../store/selectedProfileSlice";
import { resetWalletForProfileChange } from "../store/walletSlice";
import { clearClientStorage } from "../lib/auth-storage";
import { clearAuthState } from "../store/loginSlice";

type NavSubItem = {
  id: string;
  label: string;
  muted?: boolean;
};

type NavItem = {
  id: string;
  label: string;
  icon: ReactElement;
  children?: NavSubItem[];
  onClick?: () => void;
};

type NavSection = {
  id: string;
  title: string;
  headerIcon?: ReactElement;
  items: NavItem[];
};

type IconProps = {
  className?: string;
};

type BusinessStatus = "in-progress" | "pending" | "approved" | "rejected";

const ADMIN_PANEL_RETURN_KEY = "admin-panel-return-view";
const ADMIN_PANEL_BUSINESS_VIEW = "business";

type BusinessProfileSummary = {
  id: string;
  title: string;
  subtitle: string;
  status: BusinessStatus;
};

const businessStatusStyles: Record<
  BusinessStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  "in-progress": {
    label: "در حال تکمیل اطلاعات",
    badgeClass:
      "bg-[color:var(--md-sys-color-primary)]/12 text-[color:var(--md-sys-color-primary)] border-[color:var(--md-sys-color-primary)]/30",
    dotClass: "bg-[color:var(--md-sys-color-primary)]",
  },
  pending: {
    label: "در انتظار تایید",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  approved: {
    label: "تایید شده",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    dotClass: "bg-green-600",
  },
  rejected: {
    label: "رد شده",
    badgeClass:
      "bg-[color:var(--md-sys-color-error)]/10 text-[color:var(--md-sys-color-error)] border-[color:var(--md-sys-color-error)]/30",
    dotClass: "bg-[color:var(--md-sys-color-error)]",
  },
};

function BusinessStatusBadge({ status }: { status: BusinessStatus }) {
  const meta = businessStatusStyles[status] ?? businessStatusStyles.pending;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        meta.badgeClass,
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", meta.dotClass)} />
      {meta.label}
    </span>
  );
}

const normalizeBusinessStatus = (value?: string): BusinessStatus => {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("progress") || normalized.includes("draft")) return "in-progress";
  if (normalized.includes("pending") || normalized.includes("wait") || normalized.includes("review"))
    return "pending";
  if (
    normalized.includes("approved") ||
    normalized.includes("accept") ||
    normalized.includes("verified")
  )
    return "approved";
  if (normalized.includes("reject")) return "rejected";
  return "pending";
};

const mapTypeLabel = (value?: string) => {
  const t = (value ?? "").toLowerCase();
  if (t.includes("real") || t.includes("personal") || t.includes("haghighi")) return "حساب حقیقی";
  if (t.includes("legal") || t.includes("business") || t.includes("hoghooghi")) return "حساب حقوقی";
  return value ?? "";
};

const BadgeIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 32 32"
    className={clsx("h-10 w-10 text-[color:var(--md-sys-color-primary)]", className)}
    fill="none"
  >
    <rect x="4" y="4" width="24" height="24" rx="8" fill="currentColor" opacity="0.12" />
    <rect
      x="9.5"
      y="10.5"
      width="13"
      height="11"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M13.5 9.5C13.5 8.67157 14.1716 8 15 8H17C17.8284 8 18.5 8.67157 18.5 9.5V11.5H13.5V9.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M13 16.25H19M13 19H17.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const HomeIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={clsx("h-6 w-6", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M5 11.5L12 5L19 11.5V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V11.5Z" />
    <path d="M9.5 20V14.5H14.5V20" strokeLinecap="round" />
  </svg>
);

const TransferIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={clsx("h-6 w-6", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path
      d="M7 8L10 5V11L7 8Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17 16L14 19V13L17 16Z"
      fill="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 8H17" strokeLinecap="round" />
    <path d="M7 16H14" strokeLinecap="round" />
  </svg>
);

const BiometricIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={clsx("h-5 w-5", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <rect x="5" y="5" width="14" height="14" rx="4" />
    <path d="M9.5 10C9.5 8.61929 10.6193 7.5 12 7.5C13.3807 7.5 14.5 8.61929 14.5 10" />
    <path
      d="M8.5 16.5C9.5 15.1 10.8 14.25 12 14.25C13.2 14.25 14.5 15.1 15.5 16.5"
      strokeLinecap="round"
    />
    <path d="M12 12.25V13" strokeLinecap="round" />
  </svg>
);

const SupportIcon = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    className={clsx("h-6 w-6", className)}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M7.5 10C7.5 6.96243 9.96243 4.5 13 4.5C16.0376 4.5 18.5 6.96243 18.5 10V13.5C18.5 15.9853 16.4853 18 14 18H11.5L9 19.5V15.5" />
    <circle cx="8" cy="12" r="2.25" />
    <path d="M15.5 9.75H11.75" strokeLinecap="round" />
  </svg>
);

const ItemIconFrame = ({ children, active }: { children: ReactNode; active?: boolean }) => (
  <span
    className={clsx(
      "flex h-10 w-10 items-center justify-center rounded-2xl border shadow-[var(--elevation-1)] transition-all duration-200",
      "border-[color:var(--md-sys-color-outline-variant)]",
      active
        ? "bg-[color:var(--md-sys-color-primary)]/12 text-[color:var(--md-sys-color-primary)]"
        : "bg-[color:var(--md-sys-color-surface-container-lowest)] text-[color:var(--md-sys-color-on-surface-variant)]",
    )}
  >
    {children}
  </span>
);

export function SidebarDashboard({
  collapsed: collapsedProp,
  onToggleAction,
  businessProfiles: businessProfilesProp,
  isAdminView = false,
}: {
  collapsed?: boolean;
  onToggleAction?: (next: boolean) => void;
  businessProfiles?: ProfileListItem[];
  isAdminView?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = typeof collapsedProp === "boolean" ? collapsedProp : internalCollapsed;
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["requests"]));
  const [activeItemId, setActiveItemId] = useState<string>("requests-business");
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
   const currentProfile = useSelector((state: any) => state.selectedProfile?.currentProfile);
  const profileLookup = useMemo(
    () => new Map((businessProfilesProp ?? []).map((profile) => [profile.id, profile])),
    [businessProfilesProp],
  );
  const businessProfiles = useMemo<BusinessProfileSummary[]>(() => {
    if (businessProfilesProp?.length) {
      return businessProfilesProp.map((item) => ({
        id: item.id,
        title: item.name,
        subtitle: mapTypeLabel(item.type),
        status: normalizeBusinessStatus(item.verification_status),
      }));
    }
    return [];
  }, [businessProfilesProp]);
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(
    businessProfiles[0]?.id ?? null,
  );
  const handleLogout = async () => {
    try {
      await clearClientStorage();
    } finally {
      dispatch(clearAuthState());
      if (typeof window !== "undefined") {
        window.location.replace("/");
      } else {
        router.replace("/");
      }
    }
  };
  const activeBusiness = useMemo(
    () => businessProfiles.find((profile) => profile.id === activeBusinessId) ?? null,
    [activeBusinessId, businessProfiles],
  );
  const resolvedProfile = useMemo(() => {
    if (!currentProfile?.id) return activeBusiness;
    const resolvedStatus = currentProfile.verification_status
      ? normalizeBusinessStatus(currentProfile.verification_status)
      : activeBusiness?.status ?? "pending";
    return {
      id: currentProfile.id,
      title: currentProfile.name ?? activeBusiness?.title ?? "",
      subtitle: currentProfile.type ? mapTypeLabel(currentProfile.type) : activeBusiness?.subtitle ?? "",
      status: resolvedStatus,
    };
  }, [activeBusiness, currentProfile]);
  const isApprovedProfile = resolvedProfile?.status === "approved";
  const headerTitle =
    isApprovedProfile && resolvedProfile?.title ? resolvedProfile.title : "کسب‌وکار";
   useEffect(() => {
    if (!businessProfiles.length) return;
    
    
    if (currentProfile?.id) {
      setActiveBusinessId(currentProfile.id);
    } else {
      
      setActiveBusinessId(businessProfiles[0]?.id ?? null);
    }
  }, [businessProfiles, currentProfile]);

  useEffect(() => {
    if (!businessProfiles.length) return;
    setActiveBusinessId((prev) => prev ?? businessProfiles[0]?.id ?? null);
  }, [businessProfiles]);

  useEffect(() => {
    if (!pathname) return;
    const normalizedPath = pathname.replace(/\/$/, "");
    if (normalizedPath === "/business-info") {
      setActiveItemId("business-info");
      return;
    }
    if (normalizedPath === "/wallet") {
      setActiveItemId("transactions");
      return;
    }
    if (normalizedPath.startsWith("/services/face-recognition")) {
      setActiveItemId("face");
      return;
    }
    if (normalizedPath.startsWith("/services/liveness")) {
      setActiveItemId("liveness");
      return;
    }
    if (normalizedPath.startsWith("/services/ocr")) {
      setActiveItemId("ocr");
    }
  }, [pathname]);
  const switcherRef = useRef<HTMLDivElement | null>(null);

  const sections = useMemo<NavSection[]>(
    () => [
      {
        id: "business",
        title: "کسب‌وکار",
        headerIcon: <BadgeIcon />,
        items: [
          {
            id: "business-info",
            label: "اطلاعات کسب‌وکار",
            icon: <HomeIcon />,
             onClick: () => router.push('/business-info')
          },
          {
            id: "transactions",
            label: "کیف‌پول",
            icon: <TransferIcon />,
             onClick: () => router.push('/wallet')
          },
        ],
      },
      {
        id: "services",
        title: "",
        items: [
          { id: "face", label: "احراز هویت چهره", icon: <ScanFace className="h-5 w-5" /> },
          { id: "liveness", label: "تشخیص زنده‌بودن", icon: <Fingerprint className="h-5 w-5" /> },
          { id: "ocr", label: "OCR مدارک", icon: <FileText className="h-5 w-5" /> },
        ],
      },
      {
        id: "support",
        title: "ارتباط با پشتیبانی",
        items: [{ id: "support", label: "پشتیبانی", icon: <SupportIcon />, onClick: () => router.push('/user-support') }],
      },
    ],
    [router],
  );


  useEffect(() => {
    if (!isSwitcherOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!switcherRef.current) return;
      if (!switcherRef.current.contains(event.target as Node)) {
        setIsSwitcherOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSwitcherOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isSwitcherOpen]);

  useEffect(() => {
    if (isCollapsed && isSwitcherOpen) {
      setIsSwitcherOpen(false);
    }
  }, [isCollapsed, isSwitcherOpen]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
      <aside
      dir="rtl"
      className={clsx(
        "fixed right-0 top-14 bottom-0 z-30 border bg-[color:var(--md-sys-color-surface-container)] shadow-[var(--elevation-2)] transition-[width,transform] duration-300 flex flex-col",
        "border-[color:var(--md-sys-color-outline-variant)]",
        isCollapsed
          ? "w-[min(85vw,320px)] overflow-hidden translate-x-full pointer-events-none sm:pointer-events-auto sm:translate-x-0 sm:w-[62px]"
          : "w-[min(85vw,320px)] translate-x-0 overflow-visible sm:w-[200px]",
      )}
    >
      <div className="relative flex flex-col h-full">
        
        {/* Header row */}
        <div className="relative flex flex-col flex-shrink-0" ref={switcherRef}>
          <div
            className={clsx(
              "relative flex items-center gap-3 py-7.5 justify-center transition-colors",
              isCollapsed ? "px-4" : "pr-4 pl-16",
              "border-[color:var(--md-sys-color-outline-variant)]",
              !isCollapsed &&
                "cursor-pointer rounded-xl before:absolute before:inset-x-0 before:inset-y-7.5 before:rounded-xl before:bg-transparent before:pointer-events-none before:transition-colors before:content-[''] hover:before:bg-[color:var(--md-sys-color-surface-container-highest)]/60",
            )}
            onClick={() => {
              if (isCollapsed) return;
              setIsSwitcherOpen((open) => !open);
            }}
          >
            {!isCollapsed && (
              <button
                type="button"
                aria-label="مشاهده فهرست کسب‌وکارها"
                aria-expanded={isSwitcherOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsSwitcherOpen((open) => !open);
                }}
                className={clsx(
                  "absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl border text-[color:var(--md-sys-color-on-surface-variant)] transition",
                  "border-[color:var(--md-sys-color-outline-variant)]",
                  "bg-[color:var(--md-sys-color-surface-container-high)]",
                  "hover:text-[color:var(--md-sys-color-primary)] hover:border-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50",
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1 justify-start">
              <ItemIconFrame active>{sections[0].headerIcon}</ItemIconFrame>
              <div
                className={clsx(
                  "min-w-0 transition-all duration-200 text-right",
                  isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto",
                )}
              >
                <Typography
                  variant="caption"
                  className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]"
                >
                  {headerTitle}
                </Typography>
              </div>
            </div>
          </div>

          {/* Divider below the header row */}
          <div className="border-b border-[color:var(--md-sys-color-outline-variant)]" />

          {isSwitcherOpen && (
            <div
              className={clsx(
                "absolute z-40 w-[min(290px,calc(100vw-2rem))] rounded-[18px] border bg-[color:var(--md-sys-color-surface)] shadow-[var(--elevation-3)] overflow-hidden",
                "border-[color:var(--md-sys-color-outline-variant)]",
                "right-3 left-3 top-3 sm:right-[calc(100%+12px)] sm:left-auto",
              )}
            >
              <div
                className={clsx(
                  "max-h-80 overflow-y-auto space-y-2 px-3 py-3",
                  "[&::-webkit-scrollbar]:w-3",
                  "[&::-webkit-scrollbar-track]:bg-transparent",
                  "[&::-webkit-scrollbar-thumb]:bg-[color:var(--md-sys-color-outline-variant)]",
                  "[&::-webkit-scrollbar-thumb]:rounded-[7px]",
                  "[&::-webkit-scrollbar-thumb]:border-2",
                  "[&::-webkit-scrollbar-thumb]:border-[color:var(--md-sys-color-surface)]",
                )}
              >
                {businessProfiles.length === 0 && (
                  <div className="w-full rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)] px-4 py-3 text-sm text-[color:var(--md-sys-color-on-surface-variant)] text-right">
                    هیچ کسب‌وکاری یافت نشد.
                  </div>
                )}
                {businessProfiles.map((profile) => {
                  const isActive = profile.id === activeBusinessId;
                  const canContinue = profile.status === "in-progress";
                  return (
                    <div key={profile.id} className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          const fullProfile = profileLookup.get(profile.id);
                          if (fullProfile) {
                            dispatch(setCurrentProfile(fullProfile));
                          } else {
                            dispatch(selectProfileById(profile.id));
                          }

                          dispatch(resetWalletForProfileChange());

                          setActiveBusinessId(profile.id);
                          setIsSwitcherOpen(false);

                          const event = new CustomEvent("profile-changed", {
                            detail: {
                              profileId: profile.id,
                              profileName: profile.title,
                            },
                          });
                          window.dispatchEvent(event);
                        }}
                        className={clsx(
                          "w-full rounded-2xl border px-4 py-3 text-right transition text-[color:var(--md-sys-color-on-surface)]",
                          canContinue && "pl-12 sm:pl-14",
                          isActive
                            ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary)]/8 shadow-[var(--elevation-1)]"
                            : "border-[color:var(--md-sys-color-outline-variant)] hover:border-[color:var(--md-sys-color-primary)]/50 hover:bg-[color:var(--md-sys-color-surface-container-high)]",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-col items-end text-right">
                            <span className="pr-0 text-base font-semibold leading-6">
                              {profile.title}
                            </span>
                            <span className="block text-right text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                              {profile.subtitle}
                            </span>
                          </div>
                          <BusinessStatusBadge status={profile.status} />
                        </div>
                      </button>
                      {canContinue && (
                        <button
                          type="button"
                          title="تکمیل کسب‌وکار"
                          aria-label="تکمیل کسب‌وکار"
                          onClick={() => {
                            if (isAdminView && typeof window !== "undefined") {
                              window.localStorage.setItem(
                                ADMIN_PANEL_RETURN_KEY,
                                ADMIN_PANEL_BUSINESS_VIEW,
                              );
                            }
                            setIsSwitcherOpen(false);
                            router.push(`/business-auth?id=${encodeURIComponent(profile.id)}`);
                          }}
                          className={clsx(
                            "absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl border text-[color:var(--md-sys-color-on-surface-variant)] transition",
                            "border-[color:var(--md-sys-color-outline-variant)]",
                            "bg-[color:var(--md-sys-color-surface-container-high)]",
                            "hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)]",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50",
                          )}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface-container-high)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitcherOpen(false);
                    try {
                      if (isAdminView && typeof window !== "undefined") {
                        window.localStorage.setItem(ADMIN_PANEL_RETURN_KEY, ADMIN_PANEL_BUSINESS_VIEW);
                      }
                    } catch {}
                    router.push("/business-auth?new=1");
                  }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[color:var(--md-sys-color-primary)] transition hover:bg-[color:var(--md-sys-color-primary)]/8"
                >
                  <PlusCircle className="h-5 w-5" />
                  ساخت کسب‌وکار جدید
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Items list scrollable with rounded scrollbar */}
        <div
          className={clsx(
            "flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-4", // 👈 no horizontal scroll ever
            "[&::-webkit-scrollbar]:w-3",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:bg-[color:var(--md-sys-color-outline-variant)]",
            "[&::-webkit-scrollbar-thumb]:rounded-[7px]",
            "[&::-webkit-scrollbar-thumb]:border-2",
            "[&::-webkit-scrollbar-thumb]:border-[color:var(--md-sys-color-surface-container)]",
          )}
        >
          {sections.map((section, index) => {
            const hasTitle = Boolean(section.title);
            const nextHasTitle = Boolean(sections[index + 1]?.title);
            const isSectionLocked =
              !isApprovedProfile && (section.id === "business" || section.id === "services");
            const isSectionActive = section.items.some(
              (item) =>
                item.id === activeItemId ||
                (item.children?.some((child) => child.id === activeItemId) ?? false),
            );
            const showSectionActive = isSectionActive && !isSectionLocked;
            const sectionGap = "mb-1.5";
            return (
              <div
                key={section.id}
                className={clsx(sectionGap, "last:mb-0")}
              >
              {!isCollapsed && section.title && (
                <Typography
                  variant="caption"
                  className={clsx(
                    "mb-1 px-2 text-sm font-semibold",
                    showSectionActive
                      ? "text-[color:var(--md-sys-color-primary)]"
                      : "text-[color:var(--md-sys-color-on-surface)]",
                  )}
                >
                  {section.title}
                </Typography>
              )}

              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const hasChildren = !!item.children?.length;
                  const isItemDisabled = isSectionLocked;
                  const isGroupOpen = hasChildren ? openGroups.has(item.id) : false;
                  const isItemActive =
                    activeItemId === item.id ||
                    (hasChildren && item.children!.some((sub) => sub.id === activeItemId));
                  const isItemActiveAndEnabled = isItemActive && !isItemDisabled;

                  return (
                    <div key={item.id} title={isCollapsed ? item.label : undefined}>
                      {/* Main item row */}
                      <Button
                        variant="ghost"
                        disabled={isItemDisabled}
                        title={isCollapsed ? item.label : undefined}
                        onClick={() => {
                         if (isItemDisabled) return;
                         if (item.onClick) {
                            setActiveItemId(item.id);
                            item.onClick();
                          } else if (hasChildren) {
                            toggleGroup(item.id);
                            setActiveItemId(item.id);
                          } else {
                            setActiveItemId(item.id);
                          }
                        }}
                        className={clsx(
                          "group flex w-full items-center rounded-[10px] px-3 py-2.5 text-sm transition-colors transition-shadow duration-200 justify-between gap-2",
                          isItemActiveAndEnabled
                            ? "text-[color:var(--md-sys-color-primary)]"
                            : "text-[color:var(--md-sys-color-on-surface)]",
                          isItemDisabled && "cursor-not-allowed opacity-50",
                          !isItemDisabled && "hover:shadow-[var(--elevation-1)]",
                          !isItemDisabled &&
                            "hover:bg-[color:var(--md-sys-color-surface-container-highest)]/70",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <ItemIconFrame active={isItemActiveAndEnabled}>{item.icon}</ItemIconFrame>
                          <div
                            className={clsx(
                              "min-w-0 truncate text-right font-medium transition-all duration-150",
                              isCollapsed
                                ? "opacity-0 w-0 pointer-events-none"
                                : "opacity-100 w-auto",
                            )}
                          >
                            {item.label}
                          </div>
                        </div>

                        {hasChildren && !isCollapsed && (
                          <ChevronDown
                            className={clsx(
                              "h-4 w-4 text-[color:var(--md-sys-color-on-surface-variant)] transition-transform duration-200",
                              isGroupOpen && "rotate-180",
                            )}
                          />
                        )}
                      </Button>

                      {/* Sub-items */}
                      {hasChildren && !isCollapsed && (
                        <div
                          className={clsx(
                            "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                            isGroupOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0",
                          )}
                        >
                          <div className="min-h-0 overflow-hidden pr-4">
                            {item.children!.map((child) => {
                              const isChildActive = activeItemId === child.id;
                              return (
                                <Button
                                  key={child.id}
                                  variant="ghost"
                                  onClick={() => setActiveItemId(child.id)}
                                  className="flex w-full items-center gap-2 py-1.5 pr-3 text-right text-sm"
                                >
                                  <span
                                    className={clsx(
                                      "flex h-4 w-4 items-center justify-center rounded-full border",
                                      isChildActive
                                        ? "border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-primary)]/20"
                                        : "border-[color:var(--md-sys-color-outline-variant)]",
                                    )}
                                  >
                                    <span
                                      className={clsx(
                                        "h-1.5 w-1.5 rounded-full",
                                        isChildActive
                                          ? "bg-[color:var(--md-sys-color-primary)]"
                                          : child.muted
                                            ? "bg-[color:var(--md-sys-color-on-surface-variant)]/70"
                                            : "bg-[color:var(--md-sys-color-outline-variant)]",
                                      )}
                                    />
                                  </span>
                                  <span
                                    className={clsx(
                                      "transition-colors",
                                      isChildActive &&
                                        "font-semibold text-[color:var(--md-sys-color-primary)]",
                                      child.muted &&
                                        !isChildActive &&
                                        "text-[color:var(--md-sys-color-on-surface-variant)]/80",
                                    )}
                                  >
                                    {child.label}
                                  </span>
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[color:var(--md-sys-color-outline-variant)] px-2 py-3">
          <Button
            variant="ghost"
            onClick={handleLogout}
            aria-label="خروج"
            title={isCollapsed ? "خروج" : undefined}
            className={clsx(
              "group flex w-full items-center rounded-[10px] px-3 py-2.5 text-sm transition-colors transition-shadow duration-200 justify-between gap-2",
              "text-[color:var(--md-sys-color-error)]",
              "hover:shadow-[var(--elevation-1)]",
              "hover:bg-[color:var(--md-sys-color-error)]/10",
            )}
          >
            <div className="flex items-center gap-2">
              <ItemIconFrame>
                <LogOut className="h-5 w-5 text-[color:var(--md-sys-color-error)]" />
              </ItemIconFrame>
              <div
                className={clsx(
                  "min-w-0 truncate text-right font-medium transition-all duration-150",
                  isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto",
                )}
              >
                خروج
              </div>
            </div>
          </Button>
        </div>
      </div>
    </aside>
  );
}



