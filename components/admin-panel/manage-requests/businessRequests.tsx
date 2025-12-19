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
  type AdminProfileSummary,
} from "../../../lib/api/adminProfiles";

type BusinessStatus = "verified" | "pending" | "rejected" | "draft";

type BusinessRequest = {
  id: string;
  name: string;
  type: string;
  address: string;
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

const mapAdminProfileToRequest = (profile: AdminProfileSummary): BusinessRequest => {
  const type = mapProfileType(profile.profile_type);
  const name = profile.profile_name || profile.owner_name || "";
  const initials = (name.trim() || "?").slice(0, 1);
  const status = mapStatus(profile.verification_status);

  return {
    id: profile.id.toString(),
    name,
    type: type === "legal" ? "حقوقی" : "حقیقی",
    address: "",
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

const businessRequests: BusinessRequest[] = [
  {
    id: "1",
    name: "شرکت آینده سازان",
    type: "شخص حقوقی",
    address: "تهران، سعادت‌آباد",
    status: "rejected",
    initials: "ش",
    profileDetails: {
      id: "req-1",
      name: "شرکت آینده سازان",
      type: "legal",
      verificationStatus: "rejected",
      personalInfo: {
        firstName: "حمید",
        lastName: "مظفری",
        nationalId: "0123456789",
        birthDate: "1985-03-14",
        phone: "09123456789",
      },
      businessInfo: {
        brandName: "آینده سازان",
        legalName: "شرکت توسعه آینده سازان",
        fieldOfWork: "راهکارهای ابری",
        websiteUrl: "https://ayandeh.co",
        businessNationalId: "10345678901",
      },
      locationInfo: {
        address: "تهران، سعادت‌آباد، خیابان سرو، پلاک ۱۲، واحد ۳",
        province: "تهران",
        city: "تهران",
        fixedPhone: "02122334455",
        postalCode: "1998712345",
        plateNumber: "12",
        unit: "3",
      },
    },
  },
  {
    id: "2",
    name: "بازرگانی صالح",
    type: "شخص حقیقی",
    address: "اصفهان، میدان نقش جهان",
    status: "pending",
    initials: "ب",
    profileDetails: {
      id: "req-2",
      name: "بازرگانی صالح",
      type: "real",
      verificationStatus: "pending",
      personalInfo: {
        firstName: "صالح",
        lastName: "موسوی",
        nationalId: "0654321987",
        birthDate: "1990-07-22",
        phone: "09135556677",
      },
      businessInfo: {
        brandName: "بازرگانی صالح",
        fieldOfWork: "توزیع مواد غذایی",
        websiteUrl: "https://salehtrade.ir",
        businessNationalId: "10223334455",
      },
      locationInfo: {
        address: "اصفهان، میدان نقش جهان، کوچه آذین، پلاک ۸، واحد ۱",
        province: "اصفهان",
        city: "اصفهان",
        fixedPhone: "03133778899",
        postalCode: "8156712345",
        plateNumber: "8",
        unit: "1",
      },
    },
  },
  {
    id: "3",
    name: "هولدینگ پارسا",
    type: "شخص حقوقی",
    address: "شیراز، بلوار چمران",
    status: "verified",
    initials: "ه",
    profileDetails: {
      id: "req-3",
      name: "هولدینگ پارسا",
      type: "legal",
      verificationStatus: "verified",
      personalInfo: {
        firstName: "فرشاد",
        lastName: "پارسایی",
        nationalId: "0789012345",
        birthDate: "1982-11-09",
        phone: "09172223344",
      },
      businessInfo: {
        brandName: "پارسا",
        legalName: "هولدینگ پارسا",
        fieldOfWork: "خدمات هوش مصنوعی",
        websiteUrl: "https://parsa.ai",
        businessNationalId: "10998887766",
      },
      locationInfo: {
        address: "شیراز، بلوار چمران، خیابان دنا، پلاک ۴۵، واحد ۶",
        province: "فارس",
        city: "شیراز",
        fixedPhone: "07132221100",
        postalCode: "7199812345",
        plateNumber: "45",
        unit: "6",
      },
    },
  },
  {
    id: "4",
    name: "گروه صنعتی نیکان",
    type: "شخص حقوقی",
    address: "تبریز، خیابان ولیعصر",
    status: "rejected",
    initials: "گ",
    profileDetails: {
      id: "req-4",
      name: "گروه صنعتی نیکان",
      type: "legal",
      verificationStatus: "rejected",
      personalInfo: {
        firstName: "نادر",
        lastName: "فرهادی",
        nationalId: "0332211456",
        birthDate: "1978-02-01",
        phone: "09149998877",
      },
      businessInfo: {
        brandName: "نیکان",
        legalName: "گروه صنعتی نیکان",
        fieldOfWork: "قطعات خودرو",
        websiteUrl: "https://nikanparts.com",
        businessNationalId: "10011223344",
      },
      locationInfo: {
        address: "تبریز، خیابان ولیعصر، کوچه یاس، پلاک ۹، واحد ۲",
        province: "آذربایجان شرقی",
        city: "تبریز",
        fixedPhone: "04135557788",
        postalCode: "5136812345",
        plateNumber: "9",
        unit: "2",
      },
    },
  },
  {
    id: "5",
    name: "موسسه مشاوره رهام",
    type: "شخص حقیقی",
    address: "مشهد، احمدآباد",
    status: "pending",
    initials: "م",
    profileDetails: {
      id: "req-5",
      name: "موسسه مشاوره رهام",
      type: "real",
      verificationStatus: "pending",
      personalInfo: {
        firstName: "رهام",
        lastName: "سالاری",
        nationalId: "0456321879",
        birthDate: "1995-09-17",
        phone: "09153054050",
      },
      businessInfo: {
        brandName: "رهام",
        fieldOfWork: "مشاوره مدیریت",
        websiteUrl: "https://rohamconsult.ir",
      },
      locationInfo: {
        address: "مشهد، احمدآباد، خیابان راهنمایی، پلاک ۱۲، واحد ۵",
        province: "خراسان رضوی",
        city: "مشهد",
        fixedPhone: "05137654321",
        postalCode: "9188812345",
        plateNumber: "12",
        unit: "5",
      },
    },
  },
];

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
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("");
  const [pageSizeInput, setPageSizeInput] = useState("1");
  const [requests, setRequests] = useState<BusinessRequest[]>(businessRequests);
  const [totalPages, setTotalPages] = useState<number>(Math.max(businessRequests.length, 1));
  const [toast, setToast] = useState<string | null>(null);
  const [approveToast, setApproveToast] = useState<string | null>(null);
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

        const total = response?.total_pages ?? Math.max(businessRequests.length, 1);
        if (total && pageNumber > total) {
          setToast("U,OúU?O UOUc O1O_O_ U^OOñO_ U.O®O\"O¦ U^OOñO_ UcU+UOO_");
          setRequests([]);
          setTotalPages(total);
          return;
        }

        const mapped = (response?.profiles ?? []).map(mapAdminProfileToRequest);
        setRequests(mapped.length ? mapped : businessRequests);
        setTotalPages(total);
      } catch (error) {
        if (cancelled) return;
        console.warn("businessRequests fetch failed", error);
        setRequests(businessRequests);
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

      {selectedProfile && (
        <DetailsDialog
          open={dialogOpen}
          onCloseAction={closeDialog}
          profile={selectedProfile}
          onApproved={handleApproved}
          footerActions={[
            { id: "reject", label: "رد کردن", tone: "danger", onClick: closeDialog },
            { id: "suspend", label: "معلق کردن", tone: "warning", onClick: closeDialog },
            { id: "approve", label: "قبول کردن", tone: "success", onClick: closeDialog },
          ]}
        />
      )}
    </section>
  );
}
