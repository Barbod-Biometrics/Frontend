"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, Search, ChevronDown, Filter } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | "">("");
  const [sortBy, setSortBy] = useState<SortBy>("");
  const [sortDir, setSortDir] = useState<SortOrder>("");
  const [pageSizeInput, setPageSizeInput] = useState("1");
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [toast, setToast] = useState<string | null>(null);
  const [approveToast, setApproveToast] = useState<string | null>(null);
  const [rejectToast, setRejectToast] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<BusinessProfile | null>(null);
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
      const pageNumber = pageSizeInput.trim() ? Number(pageSizeInput) : 1;

      if (!Number.isFinite(pageNumber) || pageNumber <= 0) {
        setToast("U,OúU?Oŕ UOUc O1O_O_ U^OŕOñO_ U.O®O\"O¦ U^OŕOñO_ UcU+UOO_");
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
          setToast("U,OúU?O UOUc O1O_O_ U^OOñO_ U.O®O\"O¦ U^OOñO_ UcU+UOO_");
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
  }, [searchTerm, statusFilter, sortBy, sortDir, pageSizeInput]);

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
            <SelectPill
              placeholder="نحوه مرتب سازی"
              value={sortDir}
              onChange={(val) => setSortDir(val as SortOrder)}
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
                          تاریخ ایجاد حساب:{" "}
                          <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">{request.createdAt}</span>
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
      </div>

      {toast && (
        <div className="fixed left-4 bottom-6 z-50 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-lg">
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
