"use client";

import { Fragment, useMemo, useState } from "react";
import clsx from "clsx";
import { Typography } from "../ui/Typography";

type StepItem = {
  id: string;
  label: string;
  highlight?: boolean;
};

type Step = {
  id: string;
  index: number;
  title: string;
  items: StepItem[];
};

const steps: Step[] = [
  {
    id: "account-info",
    index: 1,
    title: "اطلاعات حساب",
    items: [
      { id: "account-type", label: "نوع حساب", highlight: true },
      { id: "personal-info", label: "اطلاعات فردی" },
      { id: "business-info", label: "اطلاعات کسب‌وکار" },
      { id: "location", label: "اطلاعات مکانی" },
      { id: "sign-owners", label: "امضاداران" },
    ],
  },
  {
    id: "documents",
    index: 2,
    title: "مدارک موردنیاز",
    items: [{ id: "docs-complete", label: "فهرست مدارک", highlight: true }],
  },
  {
    id: "services-request",
    index: 3,
    title: "درخواست سرویس‌ها",
    items: [
      { id: "services-intro", label: "انتخاب سرویس موردنیاز", highlight: true },
      { id: "face", label: "تشخیص چهره" },
      { id: "liveness", label: "سنجش زنده بودن" },
      { id: "smart-doc", label: "مدارک هوشمند" },
    ],
  },
  {
    id: "review",
    index: 4,
    title: "بازبینی نهایی",
    items: [{ id: "review-info", label: "تأیید و ارسال", highlight: true }],
  },
];

interface AuthSidebarProps {
  activeItemId?: string;
  onItemSelect?: (itemId: string) => void;
}

export function AuthSidebar({ activeItemId: controlledActiveId, onItemSelect }: AuthSidebarProps) {
  const [openSteps, setOpenSteps] = useState<Set<string>>(() => new Set([steps[0].id]));
  const [internalActiveId, setInternalActiveId] = useState<string>(steps[0].items[0].id);

  const activeItemId = controlledActiveId ?? internalActiveId;

  const activeStepId = useMemo(() => {
    const match = steps.find(
      (step) => step.id === activeItemId || step.items.some((item) => item.id === activeItemId),
    );
    return match?.id ?? steps[0].id;
  }, [activeItemId]);

  const toggleStep = (id: string) => {
    setOpenSteps((prev) => {
      if (prev.has(id)) return prev;
      return new Set([id]);
    });
  };

  const handleSelect = (id: string) => {
    if (!controlledActiveId) setInternalActiveId(id);
    onItemSelect?.(id);
  };

  return (
    <aside
      dir="rtl"
      className={clsx(
        "font-vazirmatn",
        "right-0",
        "w-full max-w-[320px] rounded-[28px] border bg-[color:var(--md-sys-color-surface)]",
        "border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--elevation-2)] px-6 py-8",
        "text-[color:var(--md-sys-color-on-surface)]",
        "overflow-hidden",
      )}
    >
      <div className="right-0 relative grid grid-cols-[64px_1fr] items-start gap-x-1 gap-y-4">
        {steps.map((step) => {
          const isOpen = openSteps.has(step.id);
          const isStepActive =
            step.id === activeStepId || step.items.some((item) => item.id === activeItemId);

          return (
            <Fragment key={step.id}>
              <div className="relative z-10 flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    toggleStep(step.id);
                    handleSelect(step.id);
                  }}
                  className={clsx(
                    "flex h-5 w-5 items-center justify-center rounded-full text-base font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] ring-4 ring-white/60 ring-offset-0 bg-[radial-gradient(circle_at_30%_30%,#5561e9,#2747d7_45%,#0f62d8)] dark:ring-[color:var(--md-sys-color-surface-container)] transition-opacity",
                    isStepActive ? "opacity-100" : "opacity-70",
                  )}
                  aria-label={step.title}
                >
                  {step.index}
                </button>
              </div>

              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    toggleStep(step.id);
                    handleSelect(step.id);
                  }}
                    className="flex w-full items-center justify-between gap-2 text-right"
                  aria-expanded={isOpen}
                >
                  <Typography
                    variant="body-md"
                    className={clsx(
                      "text-base font-bold leading-7 text-[color:var(--md-sys-color-on-surface)]",
                      isStepActive && "text-[color:var(--md-sys-color-primary)]",
                    )}
                  >
                    {step.title}
                  </Typography>
                </button>
              </div>

              {isOpen &&
                step.items.map((item) => {
                  const isActive = activeItemId === item.id;
                  return (
                    <Fragment key={item.id}>
                      <div className="relative z-10 flex items-center justify-center">
                        <span
                          className={clsx(
                            "flex h-4 w-4 items-center justify-center rounded-full border bg-[color:var(--md-sys-color-surface-container-high)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200",
                            isActive
                              ? "border-[color:var(--md-sys-color-primary)]"
                              : "border-[color:var(--md-sys-color-outline-variant)]",
                          )}
                          aria-hidden
                        >
                          <span
                            className={clsx(
                              "h-2 w-2 rounded-full transition-all",
                              isActive
                                ? "bg-[color:var(--md-sys-color-primary)] shadow-[0_0_0_3px_rgba(37,99,235,0.25)]"
                                : "bg-[color:var(--md-sys-color-primary)]/70 shadow-[0_0_0_2px_rgba(37,99,235,0.15)]",
                            )}
                          />
                        </span>
                      </div>
                      <div className="relative z-10">
                        <button
                          type="button"
                          onClick={() => handleSelect(item.id)}
                          className="block w-full pr-4 text-right"
                        >
                          <Typography
                            variant="body-sm"
                            className={clsx(
                              "text-sm leading-6 transition-colors",
                              isActive
                                ? "font-semibold text-[color:var(--md-sys-color-primary)]"
                                : "text-[color:var(--md-sys-color-on-surface)]",
                              item.highlight && !isActive && "font-semibold",
                            )}
                          >
                            {item.label}
                          </Typography>
                        </button>
                      </div>
                    </Fragment>
                  );
                })}
            </Fragment>
          );
        })}
      </div>
    </aside>
  );
}
