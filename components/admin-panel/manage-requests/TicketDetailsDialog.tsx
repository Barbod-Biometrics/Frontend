"use client";

import { X, Download, Calendar, User, Mail, Phone, File } from "lucide-react";
import { Button } from "../../ui/Button";
import { Typography } from "../../ui/Typography";
import type { TicketDetail } from "../../../store//ticketsAdminSlice";

interface TicketDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  ticket: TicketDetail | null;
  onDownloadFile: () => void;
}

export default function TicketDetailsDialog({
  open,
  onClose,
  ticket,
  onDownloadFile,
}: TicketDetailsDialogProps) {
  if (!open || !ticket) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    
    const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    
    return formatter.format(date);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="w-[calc(100%-2rem)] max-w-2xl rounded-[28px] border border-[color:var(--md-sys-color-outline)] bg-[color:var(--md-sys-color-surface)] p-6 shadow-[var(--elevation-3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
              جزئیات تیکت
            </Typography>
            <Typography variant="body-sm" className="text-[color:var(--md-sys-color-on-surface-variant)] mt-1">
              ID: {ticket.id}
            </Typography>
          </div>
          <button
            type="button"
            aria-label="بستن"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface-variant)] transition hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--md-sys-color-primary)]/50"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Typography variant="h6" className="text-[#0f8bff] mb-2">
                {ticket.title}
              </Typography>
              <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface)]">
                {ticket.message}
              </Typography>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0f8bff]" />
                <span className="text-sm font-semibold text-[#0f8bff]">تاریخ ایجاد:</span>
                <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#0f8bff]" />
                <span className="text-sm font-semibold text-[#0f8bff]">آخرین به‌روزرسانی:</span>
                <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {formatDate(ticket.updatedAt)}
                </span>
              </div>
            </div>
          </div>

          {/* User Contact Info */}
          <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] p-4">
            <Typography variant="h6" className="text-[#0f8bff] mb-3">
              اطلاعات کاربر
            </Typography>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-[#0f8bff]" />
                <span className="text-sm font-semibold text-[#0f8bff]">شناسه کاربر:</span>
                <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {ticket.userId}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#0f8bff]" />
                <span className="text-sm font-semibold text-[#0f8bff]">ایمیل:</span>
                <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {ticket.userContact.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#0f8bff]" />
                <span className="text-sm font-semibold text-[#0f8bff]">تلفن:</span>
                <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {ticket.userContact.phone}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#0f8bff]">سرویس:</span>
                <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                  {ticket.service}
                </span>
              </div>
            </div>
          </div>

          {/* File Attachment */}
          {ticket.fileUrl && (
            <div className="rounded-xl border border-[color:var(--md-sys-color-outline-variant)] p-4">
              <Typography variant="h6" className="text-[#0f8bff] mb-3">
                فایل پیوست
              </Typography>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-[#0f8bff]" />
                  <span className="text-sm text-[color:var(--md-sys-color-on-surface)]">
                    فایل پیوست شده
                  </span>
                </div>
                <Button
                  variant="outline"
                  onClick={onDownloadFile}
                  className="rounded-xl"
                >
                  <Download className="ml-2 h-4 w-4" />
                  دانلود فایل
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl"
          >
            بستن
          </Button>
          <Button
            variant="primary"
            className="rounded-xl bg-[linear-gradient(135deg,#0f8bff,#2152ff)]"
            onClick={() => console.log("Navigate to chat for ticket:", ticket.id)}
          >
            رفتن به چت
          </Button>
        </div>
      </div>
    </div>
  );
}