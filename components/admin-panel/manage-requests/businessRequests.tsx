"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Search, ChevronDown, Filter } from "lucide-react";
import { Button } from "../../ui/Button";
import clsx from "clsx";

type BusinessStatus = "verified" | "pending" | "rejected" | "draft";

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
  { label: string; dotClass: string; textClass: string }
> = {
  pending: {
    label: "در انتظار تایید",
    dotClass: "bg-amber-400",
    textClass: "text-amber-700",
  },
  rejected: {
    label: "رد شده",
    dotClass: "bg-red-500",
    textClass: "text-red-700",
  },
  verified: {
    label: "تایید شده",
    dotClass: "bg-green-500",
    textClass: "text-green-700",
  },
  draft: {
    label: "پیش نویس",
    dotClass: "bg-[#0f8bff]",
    textClass: "text-[#0f8bff]",
  },
};

const businessRequests: BusinessRequest[] = [
  { id: "1", name: "تجارتی لاج و برادران", type: "حقوقی", address: "دارد", status: "rejected", initials: "ا" },
  { id: "2", name: "تجارتی صالح و برادران", type: "حقیقی", address: "دارد", status: "pending", initials: "ص" },
  { id: "3", name: "تجارتی رضا و برادران", type: "حقوقی", address: "دارد", status: "verified", initials: "ر" },
  { id: "4", name: "تجارتی پاسا و برادران", type: "حقوقی", address: "دارد", status: "rejected", initials: "س" },
  { id: "5", name: "تجارتی وحید و برادران", type: "حقوقی", address: "دارد", status: "pending", initials: "و" },
];

const total_pages = businessRequests.length;

const SelectPill = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
  minWidth = "min-w-[170px]",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  icon?: React.ReactNode;
  minWidth?: string;
}) => (
  <label
    className={clsx(
      "relative flex items-center gap-2 rounded-xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] hover:border-[color:var(--md-sys-color-primary)] transition",
      minWidth,
    )}
  >
    {icon}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none bg-[color:var(--md-sys-color-surface)] pr-6 text-right text-[color:var(--md-sys-color-on-surface)] outline-none"
      style={{ colorScheme: "light" }}
    >
      <option
        value=""
        style={{
          backgroundColor: "var(--md-sys-color-surface)",
          color: "var(--md-sys-color-on-surface)",
        }}
      >
        {placeholder}
      </option>
      {options.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          style={{
            backgroundColor: "var(--md-sys-color-surface)",
            color: "var(--md-sys-color-on-surface)",
            minWidth: "100%",
            paddingInline: "12px",
          }}
        >
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]" />
  </label>
);

export default function BusinessRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [pageSizeInput, setPageSizeInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filteredRequests = useMemo(() => {
    let data = [...businessRequests];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      data = data.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q),
      );
    }

    if (statusFilter) {
      data = data.filter((item) => item.status === statusFilter);
    }

    if (sortBy) {
      const dir = sortDir === "desc" ? -1 : 1;
      data.sort((a, b) => {
        const nameCompare = a.name.localeCompare(b.name);
        return nameCompare * dir;
      });
    }

    const pageSizeNumber = pageSizeInput.trim() ? Number(pageSizeInput) : null;
    if (pageSizeNumber !== null) {
      if (!Number.isFinite(pageSizeNumber) || pageSizeNumber <= 0 || pageSizeNumber > total_pages) {
        setToast("لطفا یک عدد وارد مثبت وارد کنید");
        return [];
      }
      data = data.slice(0, pageSizeNumber);
    }

    return data;
  }, [searchTerm, statusFilter, sortBy, sortDir, pageSizeInput]);

  const pageSizeOptions = useMemo(
    () => Array.from({ length: total_pages }, (_, idx) => ({ label: String(idx + 1), value: String(idx + 1) })),
    [],
  );

  return (
    <section
      dir="rtl"
      className="font-vazirmatn flex-1 overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)] px-4 pb-10 pt-8 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)] md:flex-row md:items-center md:justify-start md:gap-2 md:flex-nowrap">
          <div className="flex flex-1 items-center gap-2 md:gap-2 min-w-[260px] md:min-w-[280px] md:max-w-[360px]">
            <h2 className="text-lg font-bold text-[#0f8bff] whitespace-nowrap">لیست کسب و کارها</h2>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-1.5 text-sm text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)] min-w-[150px] md:min-w-[170px]">
              <Search className="h-4 w-4 text-[color:var(--md-sys-color-primary)]" />
              <input
                type="text"
                placeholder="جستجو در نام، کد ملی و شماره موبایل"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-right outline-none placeholder:text-[color:var(--md-sys-color-on-surface-variant)] text-[color:var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-start md:gap-2 md:flex-[1.05]">
            <SelectPill
              placeholder="وضعیت کسب و کار"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: "رد شده", value: "rejected" },
                { label: "در انتظار تایید", value: "pending" },
                { label: "تایید شده", value: "verified" },
                { label: "پیش نویس", value: "draft" },
              ]}
              minWidth="min-w-[145px]"
            />
            <SelectPill
              placeholder="نتایج هر صفحه"
              value={pageSizeInput}
              onChange={setPageSizeInput}
              options={pageSizeOptions}
              minWidth="min-w-[128px]"
            />
            <SelectPill
              placeholder="مرتب سازی بر اساس"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: "تاریخ ایجاد حساب", value: "created_at" },
                { label: "نام حساب", value: "profile_name" },
                { label: "وضعیت تایید", value: "verification_status" },
                { label: "نوع حساب", value: "profile_type" },
              ]}
              minWidth="min-w-[152px]"
            />
            <SelectPill
              placeholder="نحوه مرتب سازی"
              value={sortDir}
              onChange={setSortDir}
              options={[
                { label: "صعودی", value: "asc" },
                { label: "نزولی", value: "desc" },
              ]}
              minWidth="min-w-[134px]"
            />
          </div>
        </div>

        <div className="space-y-5">
          {filteredRequests.map((request) => {
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
                        <p className="text-base font-bold text-[#0f8bff]">
                          {request.name}
                        </p>
                        <span className="flex items-center gap-1 whitespace-nowrap text-[#0f8bff] font-semibold">
                          نوع کسب و کار:{" "}
                          <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.type}</span>
                        </span>
                        <span className="flex items-center gap-1 whitespace-nowrap text-[#0f8bff] font-semibold">
                          نام صاحب:{" "}
                          <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.address}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4 md:justify-end">
                    <div
                      className={clsx(
                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold bg-transparent justify-start w-[150px]",
                        meta.textClass,
                      )}
                    >
                      <span className={clsx("h-2.5 w-2.5 rounded-full", meta.dotClass)} />
                      {meta.label}
                    </div>
                    <Button
                      variant="primary"
                      className="min-w-[140px] rounded-xl bg-[linear-gradient(135deg,#0f8bff,#2152ff)] text-base font-semibold shadow-[var(--elevation-2)] hover:brightness-110"
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

      {toast && (
        <div className="fixed left-4 bottom-6 z-50 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
