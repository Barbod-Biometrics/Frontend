"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Search,
  ChevronDown,
  Filter,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";
import { Button } from "../../ui/Button";
import clsx from "clsx";
import type { BusinessProfile } from "../../../types/businessProfile";
import { DetailsDialog } from "./detailsDialogue";
import {
  fetchAdminProfiles,
  fetchAdminProfileDetails,
  type AdminProfilesQuery,
  type AdminProfileSummary,
} from "../../../lib/api/adminProfiles";

type BusinessStatus = "verified" | "pending" | "rejected" | "draft";
type SortBy = Exclude<AdminProfilesQuery["sortBy"], undefined> | "";
type SortOrder = Exclude<AdminProfilesQuery["sortOrder"], undefined> | "";

type BusinessRequest = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: BusinessStatus;
  initials: string;
  profileDetails: BusinessProfile;
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

const mapProfileType = (raw?: string): BusinessProfile["type"] => {
  const normalized = (raw ?? "").toLowerCase();
  if (normalized === "business") return "legal";
  if (normalized === "personal") return "real";
  return "real";
};

const mapStatus = (raw?: string): BusinessStatus => {
  const normalized = (raw ?? "").toLowerCase();
  if (normalized === "verified") return "verified";
  if (normalized === "rejected") return "rejected";
  if (normalized === "draft") return "draft";
  return "pending";
};

const formatCreatedAt = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  if (!year || !month || !day || !hour || !minute) return formatter.format(date);
  return `${year}-${month}-${day}/${hour}:${minute}`;
};

const mapAdminProfileToRequest = (profile: AdminProfileSummary): BusinessRequest => {
  const type = mapProfileType(profile.profile_type);
  const name = profile.profile_name || profile.owner_name || "";
  const initials = (name.trim() || "?").slice(0, 1);
  const status = mapStatus(profile.verification_status);

  return {
    id: profile.id.toString(),
    name,
    type: type === "legal" ? "حقوقی" : "حقیقی",
    createdAt: formatCreatedAt(profile.created_at),
    status,
    initials,
    profileDetails: {
      id: profile.id.toString(),
      name,
      type,
      verificationStatus: profile.verification_status,
      isActive: profile.is_active,
      createdAt: profile.created_at,
      personalInfo: {
        firstName: profile.owner_name || "",
        lastName: "",
        nationalId: profile.national_id || "",
        birthDate: "",
        phone: profile.mobile_number || "",
      },
      businessInfo:
        type === "legal"
          ? {
              brandName: name,
              legalName: name,
              fieldOfWork: "",
              websiteUrl: "",
              businessNationalId: "",
            }
          : {
              brandName: name,
              fieldOfWork: "",
              websiteUrl: "",
            },
      locationInfo: {
        address: "",
        province: "",
        city: "",
        fixedPhone: "",
        postalCode: "",
        plateNumber: "",
        unit: "",
      },
    },
  };
};

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
      "relative flex w-full flex-1 min-w-0 max-w-full items-center gap-2 rounded-xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] hover:border-[color:var(--md-sys-color-primary)] transition",
      minWidth,
    )}
  >
    {icon}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full min-w-0 max-w-full appearance-none bg-[color:var(--md-sys-color-surface)] pr-6 text-right text-[color:var(--md-sys-color-on-surface)] outline-none"
      style={{ colorScheme: "light", width: "100%" }}
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
            maxWidth: "100%",
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
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | "">("");
  const [sortBy, setSortBy] = useState<SortBy>("");
  const [sortDir, setSortDir] = useState<SortOrder>("desc");
  const [pageSizeInput, setPageSizeInput] = useState("1");
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [toast, setToast] = useState<string | null>(null);
  const [approveToast, setApproveToast] = useState<string | null>(null);
  const [rejectToast, setRejectToast] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);
  const isSortAsc = sortDir === "asc";
  const toggleSortDir = () => {
    setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
  };
  const currentPage = useMemo(() => {
    const parsed = Number(pageSizeInput);
    if (!Number.isFinite(parsed) || parsed <= 0) return 1;
    return Math.floor(parsed);
  }, [pageSizeInput]);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const handlePageChange = (next: number) => {
    if (!Number.isFinite(next) || next <= 0) return;
    setPageSizeInput(String(next));
  };
  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedProfile(null);
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!approveToast) return;
    const t = setTimeout(() => setApproveToast(null), 3000);
    return () => clearTimeout(t);
  }, [approveToast]);

  useEffect(() => {
    if (!rejectToast) return;
    const t = setTimeout(() => setRejectToast(null), 3000);
    return () => clearTimeout(t);
  }, [rejectToast]);

  const handleApproved = (profileId: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === profileId
          ? {
              ...item,
              status: "verified",
              profileDetails: {
                ...item.profileDetails,
                verificationStatus: "verified",
              },
            }
          : item,
      ),
    );
    setSelectedProfile((prev) =>
      prev && prev.id === profileId ? { ...prev, verificationStatus: "verified" } : prev,
    );
    setApproveToast("تایید شد");
  };

  const handleRejected = (profileId: string) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === profileId
          ? {
              ...item,
              status: "rejected",
              profileDetails: {
                ...item.profileDetails,
                verificationStatus: "rejected",
              },
            }
          : item,
      ),
    );
    setSelectedProfile((prev) =>
      prev && prev.id === profileId ? { ...prev, verificationStatus: "rejected" } : prev,
    );
    setRejectToast("رد شد");
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const pageNumber = currentPage;

      if (!Number.isFinite(Number(pageSizeInput)) || pageNumber <= 0) {
        setToast("صفحه مورد نظر وجود ندارد");
        setRequests([]);
        return;
      }

      try {
        const response = await fetchAdminProfiles({
          page: pageNumber,
          status: statusFilter || undefined,
          search: searchTerm.trim() || undefined,
          sortBy: sortBy || undefined,
          sortOrder: sortDir || undefined,
        });

        if (cancelled) return;

        const total = Math.max(response?.total_pages ?? 0, 1);
        if (total && pageNumber > total) {
          setToast("صفحه مورد نظر وجود ندارد");
          setRequests([]);
          setTotalPages(total);
          return;
        }

        const mapped = (response?.profiles ?? []).map(mapAdminProfileToRequest);
        setRequests(mapped);
        setTotalPages(total);
      } catch (error) {
        if (cancelled) return;
        console.warn("businessRequests fetch failed", error);
        setRequests([]);
        setTotalPages(1);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [searchTerm, statusFilter, sortBy, sortDir, pageSizeInput, currentPage]);

  const filteredRequests = useMemo(() => requests, [requests]);

  const pageSizeOptions = useMemo(
    () =>
      Array.from({ length: Math.max(totalPages, 1) }, (_, idx) => ({
        label: String(idx + 1),
        value: String(idx + 1),
      })),
    [totalPages],
  );

  return (
    <section
      dir="rtl"
      className="font-vazirmatn flex-1 overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)] px-4 pb-10 pt-8 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)] md:flex-row md:items-center md:justify-start md:gap-2 md:flex-nowrap">
          <div className="flex w-full flex-1 items-center gap-2 md:gap-2 min-w-[260px] md:min-w-[280px]">
            <h2 className="text-lg font-bold text-[#0f8bff] whitespace-nowrap">لیست کسب‌وکارها</h2>
            <div className="flex w-full flex-1 items-center gap-2 rounded-full border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-1.5 text-sm text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)] min-w-[150px] md:min-w-[170px]">
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

          <div className="flex w-full flex-wrap items-center gap-2 md:flex-nowrap md:justify-start md:gap-2 md:flex-1">
            <SelectPill
              placeholder="وضعیت کسب‌وکار"
              value={statusFilter}
              onChange={(val) => setStatusFilter(val as BusinessStatus | "")}
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
              onChange={(val) => setSortBy(val as SortBy)}
              options={[
                { label: "تاریخ ایجاد حساب", value: "created_at" },
                { label: "نام حساب", value: "profile_name" },
                { label: "وضعیت تایید", value: "verification_status" },
                { label: "نوع حساب", value: "profile_type" },
              ]}
              minWidth="min-w-[152px]"
            />
            <button
              type="button"
              onClick={toggleSortDir}
              className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] text-[#0f8bff] shadow-[var(--elevation-1)] transition hover:border-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-primary)]/10"
              aria-label={
                isSortAsc
                  ? "\u0645\u0631\u062a\u0628 \u0633\u0627\u0632\u06cc \u0635\u0639\u0648\u062f\u06cc"
                  : "\u0645\u0631\u062a\u0628 \u0633\u0627\u0632\u06cc \u0646\u0632\u0648\u0644\u06cc"
              }
              title={isSortAsc ? "\u0635\u0639\u0648\u062f\u06cc" : "\u0646\u0632\u0648\u0644\u06cc"}
            >
              {isSortAsc ? (
                <ArrowUpNarrowWide className="h-5 w-5" aria-hidden />
              ) : (
                <ArrowDownWideNarrow className="h-5 w-5" aria-hidden />
              )}
            </button>
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
                  <div className="flex w-full min-w-0 flex-1 items-center gap-4 md:w-auto md:gap-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline)] bg-white text-lg font-bold text-[color:var(--md-sys-color-primary)]">
                      {request.initials}
                    </div>
                    <div className="grid w-full min-w-0 grid-cols-1 items-center gap-2 text-right text-sm text-[color:var(--md-sys-color-on-surface-variant)] md:grid-cols-[minmax(180px,2fr)_minmax(160px,1fr)_minmax(200px,1fr)] md:gap-6">
                      <p className="min-w-0 break-words text-base font-bold text-[#0f8bff]">
                        {request.name}
                      </p>
                      <span className="min-w-0 break-words text-[#0f8bff] font-semibold">
                        نوع کسب‌وکار:{" "}
                        <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.type}</span>
                      </span>
                      <span className="min-w-0 break-words text-[#0f8bff] font-semibold">
                        تاریخ ایجاد حساب:{" "}
                        <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.createdAt}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full flex-col items-start gap-3 md:w-auto md:flex-row md:items-center md:gap-4 md:justify-end md:shrink-0">
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
                      onClick={async () => {
                        try {
                          const details = await fetchAdminProfileDetails(request.id);
                          const profile = details ?? request.profileDetails;
                          setSelectedProfile(profile);
                          setDialogOpen(Boolean(profile));
                        } catch (error) {
                          console.warn("fetchAdminProfileDetails failed", error);
                          setSelectedProfile(request.profileDetails);
                          setDialogOpen(true);
                        }
                      }}
                    >
                      مشاهده جزئیات
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center">
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-2 shadow-[var(--elevation-1)]">
          <Button
            variant="ghost"
            disabled={!canGoPrev}
            onClick={() => handlePageChange(currentPage - 1)}
            className="min-w-[86px] text-[#0f8bff]"
          >
            {"\u0642\u0628\u0644\u06cc"}
          </Button>
          <span className="text-sm font-semibold text-[#0f8bff]">
            {"\u0635\u0641\u062d\u0647"} {currentPage} {"\u0627\u0632"} {totalPages}
          </span>
          <Button
            variant="ghost"
            disabled={!canGoNext}
            onClick={() => handlePageChange(currentPage + 1)}
            className="min-w-[86px] text-[#0f8bff]"
          >
            {"\u0628\u0639\u062f\u06cc"}
          </Button>
        </div>
        </div>

      </div>

      {toast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-md border border-red-600 bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}

      {approveToast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-md border border-green-600 bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {approveToast}
        </div>
      )}

      {rejectToast && (
        <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 rounded-md border border-red-600 bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          {rejectToast}
        </div>
      )}

      {selectedProfile && (
        <DetailsDialog
          open={dialogOpen}
          onCloseAction={closeDialog}
          profile={selectedProfile}
          footerActions={[
            { id: "reject", label: "رد کردن", tone: "danger", onClick: () => { handleRejected(selectedProfile.id); closeDialog(); } },
            { id: "approve", label: "تایید کردن", tone: "success", onClick: () => { handleApproved(selectedProfile.id); closeDialog(); } },
          ]}
        />
      )}
    </section>
  );
}
