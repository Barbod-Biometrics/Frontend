"use client";

import { Mail, Phone, Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "../../ui/Button";
import clsx from "clsx";

type BusinessStatus = "approved" | "pending" | "rejected";

type BusinessRequest = {
  id: string;
  name: string;
  type: "حقیقی" | "حقوقی";
  address: "دارد" | "ندارد";
  status: BusinessStatus;
  initials: string;
};

const statusMeta: Record<
  BusinessStatus,
  { label: string; dotClass: string; textClass: string; bgClass: string }
> = {
  approved: {
    label: "تایید",
    dotClass: "bg-green-500",
    textClass: "text-green-700",
    bgClass: "bg-green-50 border-green-200",
  },
  pending: {
    label: "در انتظار تایید",
    dotClass: "bg-amber-400",
    textClass: "text-amber-700",
    bgClass: "bg-amber-50 border-amber-200",
  },
  rejected: {
    label: "رد شده",
    dotClass: "bg-red-500",
    textClass: "text-red-700",
    bgClass: "bg-red-50 border-red-200",
  },
};

const businessRequests: BusinessRequest[] = [
  { id: "1", name: "تجارتی لاج و برادران", type: "حقوقی", address: "دارد", status: "rejected", initials: "ا" },
  { id: "2", name: "تجارتی صالح و برادران", type: "حقیقی", address: "دارد", status: "pending", initials: "ص" },
  { id: "3", name: "تجارتی رضا و برادران", type: "حقوقی", address: "دارد", status: "approved", initials: "ر" },
  { id: "4", name: "تجارتی پاسا و برادران", type: "حقوقی", address: "دارد", status: "rejected", initials: "س" },
  { id: "5", name: "تجارتی وحید و برادران", type: "حقوقی", address: "دارد", status: "pending", initials: "و" },
];

const FilterPill = ({ label, icon }: { label?: string; icon?: React.ReactNode }) => (
  <button
    type="button"
    className="flex items-center gap-2 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-3.5 py-2 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] hover:border-[color:var(--md-sys-color-primary)] transition"
  >
    {icon}
    {label}
    <ChevronDown className="h-4 w-4 text-[color:var(--md-sys-color-on-surface-variant)]" />
  </button>
);

export default function BusinessRequests() {
  return (
    <section
      dir="rtl"
      className="font-vazirmatn flex-1 overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)] px-4 pb-10 pt-8 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)] md:flex-row md:items-center md:justify-start md:gap-3 md:flex-nowrap">
          <div className="flex flex-1 items-center gap-3 md:gap-3 min-w-[300px] md:min-w-[320px] md:max-w-[420px]">
            <h2 className="text-lg font-bold text-[#0f8bff]">لیست کسب و کارها</h2>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-1.5 text-sm text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)] min-w-[220px] md:min-w-[260px]">
              <Search className="h-4 w-4 text-[color:var(--md-sys-color-primary)]" />
              <input
                type="text"
                placeholder="...جستجو"
                className="w-full bg-transparent text-right outline-none placeholder:text-[color:var(--md-sys-color-on-surface-variant)] text-[color:var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-start md:gap-5 md:flex-[1.2]">
            <FilterPill label="وضعیت کسب و کار" />
            <FilterPill label="نتایج هر صفحه" />
            <FilterPill label="مرتب سازی بر اساس" />
            <FilterPill label="فیلتر" icon={<Filter className="h-4 w-4 text-[color:var(--md-sys-color-primary)]" />} />
          </div>
        </div>

        <div className="space-y-5">
          {businessRequests.map((request) => {
            const meta = statusMeta[request.status];
            return (
              <div
                key={request.id}
                className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-5 py-4 shadow-[var(--elevation-1)] transition hover:shadow-[var(--elevation-2)]"
              >
                <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8 md:flex-nowrap">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline)] bg-white text-lg font-bold text-[color:var(--md-sys-color-primary)]">
                      {request.initials}
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      
                      <div className="flex flex-wrap md:flex-nowrap items-center gap-7 md:gap-20 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                        <p className="text-base font-semibold text-[color:var(--md-sys-color-on-surface)]">
                          {request.name}
                        </p>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          نوع کسب و کار:{" "}
                          <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.type}</span>
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          آدرس:{" "}
                          <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.address}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
                    <div
                      className={clsx(
                        "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold",
                        meta.bgClass,
                        meta.textClass,
                      )}
                    >
                      <span className={clsx("h-2.5 w-2.5 rounded-full", meta.dotClass)} />
                      {meta.label}
                    </div>
                    <Button
                      variant="primary"
                      className="min-w-[120px] rounded-xl bg-[linear-gradient(135deg,#0f8bff,#2152ff)] text-base font-semibold shadow-[var(--elevation-2)] hover:brightness-110"
                    >
                      مشاهده جزئیات
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
