"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
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
  const [openSteps, setOpenSteps] = useState<Set<string>>(
    () => new Set(steps.map((step) => step.id)),
  );
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
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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
      <div className="relative flex flex-row items-start gap-5">
        <div className="relative flex w-[64px] flex-col items-center">
          <div className="absolute inset-y-1 left-1/2 w-[46px] -translate-x-1/2 rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-gradient-to-b from-[color:var(--md-sys-color-surface-container-highest)] via-[color:var(--md-sys-color-surface-container-high)] to-[color:var(--md-sys-color-surface-container)] shadow-[var(--elevation-2)]" />

          <div className="relative flex flex-col items-center gap-5 py-1">
            {steps.map((step) => {
              const isStepActive = step.id === activeStepId;

              return (
                <div key={step.id} className="flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      toggleStep(step.id);
                      handleSelect(step.id);
                    }}
                    className={clsx(
                      "flex h-10 w-10 items-center justify-center rounded-full text-base font-extrabold text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] ring-4 ring-white/60 ring-offset-0 bg-[radial-gradient(circle_at_30%_30%,#5561e9,#2747d7_45%,#0f62d8)] dark:ring-[color:var(--md-sys-color-surface-container)] transition-opacity",
                      isStepActive ? "opacity-100" : "opacity-70",
                    )}
                    aria-label={step.title}
                  >
                    {step.index}
                  </button>

                  <div className="flex flex-col items-center gap-3">
                    {step.items.map((item) => {
                      const isActiveDot = activeItemId === item.id;
                      return (
                        <span
                          key={item.id}
                          className={clsx(
                            "flex h-4 w-4 items-center justify-center rounded-full border bg-[color:var(--md-sys-color-surface-container-high)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all duration-200",
                            isActiveDot
                              ? "border-[color:var(--md-sys-color-primary)]"
                              : "border-[color:var(--md-sys-color-outline-variant)]",
                          )}
                          aria-hidden
                        >
                          <span
                            className={clsx(
                              "h-2 w-2 rounded-full transition-all",
                              isActiveDot
                                ? "bg-[color:var(--md-sys-color-primary)] shadow-[0_0_0_3px_rgba(37,99,235,0.25)]"
                                : "bg-[color:var(--md-sys-color-primary)]/70 shadow-[0_0_0_2px_rgba(37,99,235,0.15)]",
                            )}
                          />
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-7">
          {steps.map((step) => {
            const isOpen = openSteps.has(step.id);
            const isStepActive =
              step.id === activeStepId || step.items.some((item) => item.id === activeItemId);

            return (
              <div key={step.id} className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleStep(step.id);
                    handleSelect(step.id);
                  }}
                  className="flex w-full items-center justify-between text-right"
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
                  <ChevronDown
                    className={clsx(
                      "h-5 w-5 text-[color:var(--md-sys-color-on-surface-variant)] transition-transform duration-200",
                      isOpen ? "rotate-180" : "rotate-0",
                    )}
                    aria-hidden
                  />
                </button>

                <div
                  className={clsx(
                    "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="min-h-0 overflow-hidden space-y-1.5 pr-4">
                    {step.items.map((item) => {
                      const isActive = activeItemId === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelect(item.id)}
                          className="block w-full text-right"
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
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
