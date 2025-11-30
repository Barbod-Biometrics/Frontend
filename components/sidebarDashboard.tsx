"use client";

import { useMemo, useState, type ReactNode, type ReactElement } from "react";
import clsx from "clsx";
import { Typography } from "./ui/Typography";
import { Button } from "./ui/Button";
import { ChevronDown, ScanFace, Fingerprint, FileText } from "lucide-react";

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
    className={clsx("h-5 w-5", className)}
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
    className={clsx("h-5 w-5", className)}
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
    className={clsx("h-5 w-5", className)}
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
      "flex h-9 w-9 items-center justify-center rounded-2xl border shadow-[var(--elevation-1)] transition-all duration-200",
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
}: {
  collapsed?: boolean;
  onToggleAction?: (next: boolean) => void;
}) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = typeof collapsedProp === "boolean" ? collapsedProp : internalCollapsed;
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["requests"]));
  const [activeItemId, setActiveItemId] = useState<string>("requests-business");

  const sections = useMemo<NavSection[]>(
    () => [
      {
        id: "business",
        title: "کسب و کار",
        headerIcon: <BadgeIcon />,
        items: [
          {
            id: "business-info",
            label: "اطلاعات کسب و کار",
            icon: <HomeIcon />,
          },
          {
            id: "transactions",
            label: "کیف پول",
            icon: <TransferIcon />,
          },
        ],
      },
      {
        id: "services",
        title: "سرویس ها",
        items: [
          { id: "face", label: "احراز هویت چهره", icon: <ScanFace className="h-5 w-5" /> },
          { id: "liveness", label: "تشخیص زنده بودن", icon: <Fingerprint className="h-5 w-5" /> },
          { id: "ocr", label: "OCR مدارک", icon: <FileText className="h-5 w-5" /> },
        ],
      },
      {
        id: "support",
        title: "ارتباط با پشتیبانی",
        items: [{ id: "support", label: "پشتیبانی", icon: <SupportIcon /> }],
      },
    ],
    [],
  );

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
        "fixed right-0 top-14 z-30 h-[calc(110vh-8rem)] border bg-[color:var(--md-sys-color-surface-container)] shadow-[var(--elevation-2)] transition-all duration-300 flex flex-col overflow-hidden",
        "border-[color:var(--md-sys-color-outline-variant)]",
        isCollapsed ? "w-[70px]" : "w-[230px]",
      )}
    >
      <div className="relative flex flex-col h-full">
        {/* Header row */}
        <div
          className={clsx(
            "flex items-center gap-3 border-b px-4 pb-4 pt-5 justify-start flex-shrink-0",
            "border-[color:var(--md-sys-color-outline-variant)]",
          )}
        >
          <ItemIconFrame active>{sections[0].headerIcon}</ItemIconFrame>
          <div
            className={clsx(
              "min-w-0 transition-all duration-200",
              isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100 w-auto",
            )}
          >
            <Typography
              variant="caption"
              className="text-xs font-semibold text-[color:var(--md-sys-color-on-surface)]"
            >
              کسب و کار
            </Typography>
          </div>
        </div>

        {/* Items – scrollable with rounded scrollbar */}
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
          {sections.map((section) => (
            <div key={section.id} className="mb-6 last:mb-0">
              {!isCollapsed && (
                <Typography
                  variant="caption"
                  className="mb-2 px-2 text-xs font-semibold text-[color:var(--md-sys-color-on-surface)]"
                >
                  {section.title}
                </Typography>
              )}

              <div className="space-y-1.5">
                {section.items.map((item) => {
                  const hasChildren = !!item.children?.length;
                  const isGroupOpen = hasChildren ? openGroups.has(item.id) : false;
                  const isItemActive =
                    activeItemId === item.id ||
                    (hasChildren && item.children!.some((sub) => sub.id === activeItemId));

                  return (
                    <div key={item.id}>
                      {/* Main item row */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          if (hasChildren) {
                            toggleGroup(item.id);
                            setActiveItemId(item.id);
                          } else {
                            setActiveItemId(item.id);
                          }
                        }}
                        className={clsx(
                          "group flex w-full items-center rounded-[10px] px-2 py-2 text-xs transition-colors duration-200 justify-between gap-2",
                          isItemActive
                            ? "text-[color:var(--md-sys-color-primary)]"
                            : "text-[color:var(--md-sys-color-on-surface)]",
                          !isCollapsed &&
                            "hover:bg-[color:var(--md-sys-color-surface-container-highest)]/70",
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <ItemIconFrame active={isItemActive}>{item.icon}</ItemIconFrame>
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
                                  className="flex w-full items-center gap-2 py-1.5 pr-3 text-right text-xs"
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
          ))}
        </div>
      </div>
    </aside>
  );
}
