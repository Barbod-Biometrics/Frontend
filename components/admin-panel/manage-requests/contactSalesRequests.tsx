"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  Calendar,
  ChevronDown,
  Mail,
  MessageSquare,
  Phone,
  Search,
  UserRound,
  X,
} from "lucide-react";
import clsx from "clsx";
import { Button } from "../../ui/Button";

type SortOption = "" | "name" | "date" | "email";
type SortOrder = "" | "asc" | "desc";

type ContactItem = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  createdAt: string;
  notes?: string;
};

const mockContacts: ContactItem[] = [
  {
    id: "1",
    fullName: "آرمان رضایی",
    phone: "09121234567",
    email: "amir@example.com",
    businessName: "تجاری خلیج و برادران",
    createdAt: "2025-02-10T10:35:00Z",
    notes: "درخواست مشاوره برای راه‌اندازی سیستم فروش.",
  },
  {
    id: "2",
    fullName: "مهسا کاظمی",
    phone: "09123334455",
    email: "saleh.etemadi@example.com",
    businessName: "تجارت نوین",
    createdAt: "2025-02-05T08:10:00Z",
  },
  {
    id: "3",
    fullName: "پویان حسینی",
    phone: "09124445566",
    email: "rez.a@example.com",
    businessName: "راهکارهای هوشمند",
    createdAt: "2025-01-28T14:15:00Z",
    notes: "درخواست تماس برای توضیحات بیشتر.",
  },
  {
    id: "4",
    fullName: "نگار احمدی",
    phone: "09125556677",
    email: "saeed.parsa@example.com",
    businessName: "پارس تلکام",
    createdAt: "2025-01-22T09:05:00Z",
  },
  {
    id: "5",
    fullName: "کیان صالحی",
    phone: "09126667788",
    email: "vahid.zahir@example.com",
    businessName: "فناوران سپهر",
    createdAt: "2025-01-15T12:45:00Z",
  },
];

const ITEMS_PER_PAGE = 5;

const formatContactDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  if (!year || !month || !day) return formatter.format(date);
  return `${year}/${month}/${day}`;
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
  icon?: ReactNode;
  minWidth?: string;
}) => (
  <label
    className={clsx(
      "relative flex items-center gap-2 rounded-xl border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--md-sys-color-on-surface)] shadow-[var(--elevation-1)] hover:border-[color:var(--md-sys-color-primary)] transition",
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

const FieldRow = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex flex-wrap items-center justify-start gap-2 text-right">
    <span className="flex items-center gap-2 text-sm font-semibold text-[#0f8bff]">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f8bff]/10 text-[#0f8bff]">
        {icon}
      </span>
      {`${label} :`}
    </span>
    <span className="text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]">
      {value}
    </span>
  </div>
);

const ContactDetailsDialog = ({
  open,
  onClose,
  item,
}: {
  open: boolean;
  onClose: () => void;
  item: ContactItem | null;
}) => {
  if (!open || !item) return null;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      className="font-vazirmatn fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container-low)] px-6 py-6 shadow-[var(--elevation-3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 rounded-full p-2 text-[color:var(--md-sys-color-on-surface-variant)] transition hover:bg-[#0f8bff]/10 hover:text-[#0f8bff]"
          aria-label="بستن"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="mb-6 text-center text-xl font-bold text-[color:var(--md-sys-color-on-surface)]">
          جزئیات اطلاعات تماس
        </h2>
        <div className="space-y-4 text-right">
          <FieldRow icon={<UserRound className="h-4 w-4" />} label="نام و نام خانوادگی" value={item.fullName} />
          <FieldRow icon={<Calendar className="h-4 w-4" />} label="تاریخ تماس" value={formatContactDate(item.createdAt)} />
          <FieldRow icon={<Phone className="h-4 w-4" />} label="تلفن تماس" value={item.phone} />
          <FieldRow icon={<Mail className="h-4 w-4" />} label="پست الکترونیک" value={item.email} />
          <FieldRow icon={<Building2 className="h-4 w-4" />} label="نام کسب‌وکار" value={item.businessName} />
          <FieldRow
            icon={<MessageSquare className="h-4 w-4" />}
            label="توضیحات بیشتر (اختیاری)"
            value={item.notes?.trim() || "—"}
          />
        </div>
      </div>
    </div>
  );
};

export default function ContactSalesRequests() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");
  const [pageSize, setPageSize] = useState("1");
  const [selectedItem, setSelectedItem] = useState<ContactItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredContacts = useMemo(() => {
    let data = [...mockContacts];
    const query = searchTerm.trim().toLowerCase();

    if (query) {
      data = data.filter(
        (item) =>
          item.fullName.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.businessName.toLowerCase().includes(query),
      );
    }

    if (sortBy && sortOrder) {
      const direction = sortOrder === "desc" ? -1 : 1;
      if (sortBy === "name") {
        data.sort((a, b) => a.fullName.localeCompare(b.fullName) * direction);
      } else if (sortBy === "email") {
        data.sort((a, b) => a.email.localeCompare(b.email) * direction);
      } else if (sortBy === "date") {
        data.sort(
          (a, b) => (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction,
        );
      }
    }

    return data;
  }, [searchTerm, sortBy, sortOrder]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredContacts.length / ITEMS_PER_PAGE)),
    [filteredContacts.length],
  );

  const pageOptions = useMemo(
    () =>
      Array.from({ length: totalPages }, (_, idx) => ({
        label: String(idx + 1),
        value: String(idx + 1),
      })),
    [totalPages],
  );

  useEffect(() => {
    const currentPage = Number(pageSize);
    if (!Number.isFinite(currentPage) || currentPage < 1) {
      if (pageSize !== "1") setPageSize("1");
      return;
    }
    if (currentPage > totalPages) {
      setPageSize(String(totalPages));
    }
  }, [pageSize, totalPages]);

  const pagedContacts = useMemo(() => {
    const currentPage = Number.isFinite(Number(pageSize)) ? Math.max(Number(pageSize), 1) : 1;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContacts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredContacts, pageSize]);

  return (
    <section
      dir="rtl"
      className="font-vazirmatn flex-1 overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)] px-4 pb-10 pt-8 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)] md:flex-row md:items-center md:justify-start md:gap-2 md:flex-nowrap">
          <div className="flex flex-1 items-center gap-2 md:gap-2 min-w-[260px] md:min-w-[280px] md:max-w-[360px]">
            <h2 className="text-lg font-bold text-[#0f8bff] whitespace-nowrap">لیست تماس ها</h2>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-1.5 text-sm text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)] min-w-[150px] md:min-w-[170px]">
              <Search className="h-4 w-4 text-[color:var(--md-sys-color-primary)]" />
              <input
                type="text"
                placeholder="جستجو در نام، تلفن، پست الکترونیک و نام کسب‌وکار"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-right outline-none placeholder:text-[color:var(--md-sys-color-on-surface-variant)] text-[color:var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:justify-start md:gap-2 md:flex-[1.05]">
            <SelectPill
              placeholder="نتایج هر صفحه"
              value={pageSize}
              onChange={setPageSize}
              options={pageOptions}
              minWidth="min-w-[128px]"
            />
            <SelectPill
              placeholder="مرتب سازی بر اساس"
              value={sortBy}
              onChange={(val) => setSortBy(val as SortOption)}
              options={[
                { label: "نام و نام خانوادگی", value: "name" },
                { label: "تاریخ تماس", value: "date" },
                { label: "پست الکترونیک", value: "email" },
              ]}
              minWidth="min-w-[145px]"
            />
            <SelectPill
              placeholder="نحوه مرتب سازی"
              value={sortOrder}
              onChange={(val) => setSortOrder(val as SortOrder)}
              options={[
                { label: "صعودی", value: "asc" },
                { label: "نزولی", value: "desc" },
              ]}
              minWidth="min-w-[134px]"
            />
          </div>
        </div>

        <div className="space-y-5">
          {pagedContacts.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-5 py-4 shadow-[var(--elevation-1)] transition hover:shadow-[var(--elevation-2)]"
            >
              <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between md:gap-8 md:flex-nowrap">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--md-sys-color-outline)] bg-white text-lg font-bold text-[color:var(--md-sys-color-primary)]">
                    {item.fullName.slice(0, 1)}
                  </div>
                  <div className="flex flex-col gap-2 text-right">
                    <div className="flex flex-wrap md:flex-nowrap items-center gap-7 md:gap-20 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                      <p className="text-base font-bold text-[#0f8bff]">{item.fullName}</p>
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-[#0f8bff] font-semibold">
                        <Phone className="h-4 w-4" />
                        اطلاعات تماس:{" "}
                        <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">دارد</span>
                      </span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap text-[#0f8bff] font-semibold">
                        <Mail className="h-4 w-4" />
                        پست الکترونیک:{" "}
                        <span className="font-semibold text-[color:var(--md-sys-color-on-surface)]">دارد</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4 md:justify-end">
                  <Button
                    variant="primary"
                    className="min-w-[140px] rounded-xl bg-[linear-gradient(135deg,#0f8bff,#2152ff)] text-base font-semibold shadow-[var(--elevation-2)] hover:brightness-110"
                    onClick={() => {
                      setSelectedItem(item);
                      setDialogOpen(true);
                    }}
                  >
                    مشاهده جزئیات
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ContactDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        item={selectedItem}
      />
    </section>
  );
}
