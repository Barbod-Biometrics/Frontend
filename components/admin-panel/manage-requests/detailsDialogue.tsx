"use client";

import { Fragment } from "react";
import {
  Building2,
  Calendar,
  Globe,
  IdCard,
  MapPin,
  Phone,
  UserRound,
  X,
  BriefcaseBusiness,
} from "lucide-react";
import clsx from "clsx";
import { AccountKind, BusinessProfile } from "../../../types/businessProfile";
import { Button } from "../../ui/Button";

type ProfileDetailsDialogProps = {
  open: boolean;
  onCloseAction: () => void;
  profile: BusinessProfile;
  footerActions?: Array<{
    id: string;
    label: string;
    tone?: "primary" | "danger" | "success" | "warning" | "neutral";
    onClick: () => void;
  }>;
};

const toneStyles: Record<
  Exclude<NonNullable<ProfileDetailsDialogProps["footerActions"]>[number]["tone"], undefined>,
  string
> = {
  primary: "bg-[color:var(--md-sys-color-primary)] text-white",
  danger: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-amber-400 text-[color:var(--md-sys-color-on-primary-container)]",
  neutral: "bg-[color:var(--md-sys-color-surface-container-high)] text-[color:var(--md-sys-color-on-surface)]",
};

const Divider = () => (
  <div className="h-px w-full bg-[color:var(--md-sys-color-outline-variant)]/70" />
);

const infoLabel = "text-sm font-semibold text-[#0f8bff]";
const infoValue = "text-sm font-semibold text-[color:var(--md-sys-color-on-surface)]";

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-[22px] border border-[#0f8bff30] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[0_12px_30px_rgba(15,139,255,0.03)]">
    <header className="mb-3 text-right">
      <p className="inline-flex items-center gap-2 text-base font-black text-[#0f8bff]">
        {title}
        <span className="h-[3px] w-6 rounded-full bg-[#0f8bff]" aria-hidden />
      </p>
    </header>
    <div className="space-y-3 text-right">{children}</div>
  </section>
);

const FieldRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) => {
  if (!value) return null;

  return (
    <div dir="rtl" className="flex flex-wrap items-center justify-start gap-2 text-right">
        <span className={clsx(infoLabel, "flex items-center gap-2")}>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0f8bff]/10 text-[#0f8bff]">
          {icon}
        </span>
        {`${label} :`}
      </span>
      <span className={infoValue}>{value}</span>
      
    </div>
  );
};

const humanizeAccountType = (type: AccountKind) =>
  type === "legal" ? "شخص حقوقی" : "شخص حقیقی";

const fieldOfWorkLabelMap: Record<string, string> = {
  "online-store": "فروشگاه آنلاین",
  services: "خدمات",
  "content-media": "محتوا / رسانه",
  education: "آموزش",
  other: "سایر",
};

const formatFieldOfWork = (value?: string | null) => {
  if (!value) return "";
  return fieldOfWorkLabelMap[value] ?? value;
};

const formatDate = (input?: string | null) => {
  if (!input) return "";
  return input;
};

export function DetailsDialog({ open, onCloseAction, profile, footerActions }: ProfileDetailsDialogProps) {
  if (!open) return null;

  const personal = profile.personalInfo;
  const business = profile.businessInfo;
  const location = profile.locationInfo;
  const isBusinessAccount = profile.type === "legal";
  const ownerStatus =
    personal && typeof (personal as Record<string, unknown>)["isBusinessOwner"] === "boolean"
      ? (((personal as unknown) as Record<string, boolean>).isBusinessOwner ? "بله" : "خیر")
      : undefined;

  return (
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      className="font-vazirmatn fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-3 py-6"
      onClick={onCloseAction}
    >
      <div
        className="relative flex h-full max-h-[92vh] w-full max-w-3xl flex-col rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface-container-low)] shadow-[var(--elevation-3)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-[color:var(--md-sys-color-outline-variant)] px-6 py-4">
          <h2 className="text-lg font-bold text-[color:var(--md-sys-color-on-surface)]">
            مرور درخواست کسب و کار
          </h2>
          <button
            type="button"
            onClick={onCloseAction}
            className="rounded-full p-2 text-[color:var(--md-sys-color-on-surface-variant)] transition hover:bg-[#0f8bff]/10 hover:text-[#0f8bff]"
            aria-label="بستن"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 pb-6 pt-4">
          <SectionCard title="اطلاعات حساب">
            <FieldRow icon={<UserRound className="h-4 w-4" />} label="نام حساب" value={profile.name} />
            <FieldRow icon={<IdCard className="h-4 w-4" />} label="نوع حساب" value={humanizeAccountType(profile.type)} />
          </SectionCard>

          <SectionCard title="اطلاعات شخصی">
            <FieldRow icon={<BriefcaseBusiness className="h-4 w-4" />} label="صاحب کسب و کار هست؟" value={ownerStatus} />
            <FieldRow
              icon={<UserRound className="h-4 w-4" />}
              label="نام و نام خانوادگی"
              value={personal ? `${personal.firstName} ${personal.lastName}`.trim() : ""}
            />
            <FieldRow icon={<IdCard className="h-4 w-4" />} label="کد ملی" value={personal?.nationalId} />
            <FieldRow icon={<Calendar className="h-4 w-4" />} label="تاریخ تولد" value={formatDate(personal?.birthDate)} />
            <FieldRow icon={<Phone className="h-4 w-4" />} label="شماره موبایل" value={personal?.phone} />
          </SectionCard>

          {business && (
            <SectionCard title="اطلاعات کسب و کار">
              <FieldRow icon={<Building2 className="h-4 w-4" />} label="نام برند" value={business.brandName ?? business.legalName} />
              <FieldRow
                icon={<IdCard className="h-4 w-4" />}
                label="شناسه ملی کسب و کار"
                value={profile.type === "legal" ? business.businessNationalId ?? "-" : undefined}
              />
              <FieldRow
                icon={<BriefcaseBusiness className="h-4 w-4" />}
                label="زمینه فعالیت"
                value={formatFieldOfWork(business.fieldOfWork)}
              />
              <FieldRow icon={<Globe className="h-4 w-4" />} label="آدرس وب‌سایت" value={business.websiteUrl} />
            </SectionCard>
          )}

          <SectionCard title={isBusinessAccount ? "موقعیت مکانی کسب و کار" : "نشانی محل سکونت"}>
            {location ? (
              <Fragment>
                <FieldRow icon={<MapPin className="h-4 w-4" />} label="استان" value={location.province} />
                <FieldRow icon={<MapPin className="h-4 w-4" />} label="شهر" value={location.city} />
                <FieldRow icon={<MapPin className="h-4 w-4" />} label="آدرس کامل" value={location.address} />
                <FieldRow icon={<Phone className="h-4 w-4" />} label={isBusinessAccount ? "تلفن ثابت" : "شماره تماس" } value={location.fixedPhone} />
                <FieldRow icon={<MapPin className="h-4 w-4" />} label="کد پستی" value={location.postalCode} />
                {(isBusinessAccount || profile.type === "real") && (
                  <>
                    <FieldRow icon={<MapPin className="h-4 w-4" />} label="پلاک" value={location.plateNumber} />
                    <FieldRow icon={<MapPin className="h-4 w-4" />} label="واحد" value={location.unit} />
                  </>
                )}
              </Fragment>
            ) : (
              <p className="text-sm text-[color:var(--md-sys-color-on-surface-variant)]">اطلاعات مکانی ثبت نشده است.</p>
            )}
          </SectionCard>
        </div>

        {footerActions && footerActions.length > 0 && (
          <>
            <Divider />
            <footer className="flex flex-wrap items-center justify-end gap-2 px-6 py-4">
              {footerActions.map((action) => (
                <Button
                  key={action.id}
                  type="button"
                  onClick={action.onClick}
                  variant="primary"
                  className={clsx(
                    "rounded-full px-4 py-2 text-sm font-semibold shadow-[var(--elevation-1)] transition hover:brightness-105",
                    toneStyles[action.tone ?? "neutral"],
                  )}
                >
                  {action.label}
                </Button>
              ))}
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
