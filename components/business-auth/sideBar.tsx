"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Typography } from "../ui/Typography";
import { AccountKind } from "../../types/businessProfile";

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

const buildSteps = (accountType: AccountKind): Step[] => {
  const personalLabel =
    accountType === "legal"
      ? "\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0646\u0645\u0627\u06cc\u0646\u062f\u0647"
      : "\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0634\u062e\u0635\u06cc";

  return [
    {
      id: "account-info",
      index: 1,
      title: "\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u062d\u0633\u0627\u0628",
      items: [
        { id: "account-type", label: "\u0646\u0648\u0639 \u062d\u0633\u0627\u0628", highlight: true },
        { id: "personal-info", label: personalLabel },
        { id: "business-info", label: "\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u06a9\u0633\u0628 \u0648\u06a9\u0627\u0631" },
        { id: "location", label: "\u0645\u0634\u062e\u0635\u0627\u062a \u0645\u06a9\u0627\u0646" },
      ],
    },
    {
      id: "services-request",
      index: 2,
      title: "\u062f\u0631\u062e\u0648\u0627\u0633\u062a \u062e\u062f\u0645\u0627\u062a",
      items: [
        { id: "services-intro", label: "\u0645\u0639\u0631\u0641\u06cc \u062e\u062f\u0645\u0627\u062a", highlight: true },
      ],
    },
    {
      id: "review",
      index: 4,
      title: "\u0645\u0631\u0648\u0631 \u0648 \u062a\u0623\u06cc\u06cc\u062f",
      items: [{ id: "review-info", label: "\u0628\u0631\u0631\u0633\u06cc \u0646\u0647\u0627\u06cc\u06cc", highlight: true }],
    },
  ];
};

interface AuthSidebarProps {
  activeItemId?: string;
  onItemSelect?: (itemId: string) => void;
  accountType?: AccountKind;
}

export function AuthSidebar({
  activeItemId: controlledActiveId,
  onItemSelect,
  accountType = "legal",
}: AuthSidebarProps) {
  const steps = useMemo(() => buildSteps(accountType), [accountType]);
  const [openSteps, setOpenSteps] = useState<Set<string>>(() => new Set([steps[0].id]));
  const [internalActiveId, setInternalActiveId] = useState<string>(steps[0].items[0].id);

  const activeItemId = controlledActiveId ?? internalActiveId;

  const activeStepId = useMemo(() => {
    const match = steps.find(
      (step) => step.id === activeItemId || step.items.some((item) => item.id === activeItemId),
    );
    return match?.id ?? steps[0].id;
  }, [activeItemId, steps]);

  // Keep the open accordion section in sync with the current active item
  useEffect(() => {
    setOpenSteps(new Set([activeStepId]));
  }, [activeStepId]);

  const toggleStep = (id: string) => {
    setOpenSteps((prev) => {
      if (prev.has(id)) return prev;
      return new Set([id]);
    });
  };

  const getFirstItemId = (step: Step) => step.items[0]?.id ?? step.id;

  const handleSelect = (id: string) => {
    if (!controlledActiveId) setInternalActiveId(id);
    onItemSelect?.(id);
  };

  return (
    <aside
      dir="rtl"
      className={clsx(
        "font-vazirmatn",
        "pr-0",
        "w-full max-w-[320px] rounded-[28px] border bg-[color:var(--md-sys-color-surface)]",
        "border-[color:var(--md-sys-color-outline-variant)] shadow-[var(--elevation-2)] px-6 py-8",
        "text-[color:var(--md-sys-color-on-surface)]",
        "overflow-hidden",
      )}
    >
      <div className="relative grid grid-cols-[64px_1fr] items-start gap-x-1 gap-y-4">
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
                    handleSelect(getFirstItemId(step));
                  }}
                  className={clsx(
                    "flex h-5 w-5 items-center justify-center rounded-full text-base font-bold text-white shadow-[0_8px_20px_rgba(0,0,0,0.18)] ring-4 ring-white/60 ring-offset-0 bg-[radial-gradient(circle_at_30%_30%,#5561e9,#2747d7_45%,#0f62d8)] dark:ring-[color:var(--md-sys-color-surface-container)] transition-opacity",
                    isStepActive ? "opacity-100" : "opacity-70",
                  )}
                  aria-label={step.title}
                >
                  
                </button>
              </div>

              <div className="relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    toggleStep(step.id);
                    handleSelect(getFirstItemId(step));
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
                      <div className="relative top-1 z-10 flex items-center justify-end pr-1">
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
                          className="block w-full pr-3 text-right"
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
