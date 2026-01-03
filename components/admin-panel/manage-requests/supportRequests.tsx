"use client";

import { useEffect, useState, useRef } from "react";
import { Search, MessageSquare, FileText, Phone, Tag, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../../ui/Button";
import clsx from "clsx";
import { Typography } from "../../ui/Typography";
import { useAdminTickets } from "../../../store/useAdminTickets";
import TicketDetailsDialog from "./TicketDetailsDialog";


const statusOptions = [
  { value: "", label: "همه وضعیت‌ها", icon: null },
  { value: "pending", label: "در حال بررسی", icon: AlertCircle },
  { value: "answered", label: "پاسخ داده شده", icon: CheckCircle },
  { value: "closed", label: "بسته شده", icon: XCircle },
];


const serviceMap: Record<string, string> = {
  'face_auth': 'احراز هویت چهره',
  'liveness': 'تشخیص زنده بودن',
  'ocr': 'خواندن مدارک',
  'other': 'سایر',
};


const statusMeta: Record<string, { 
  label: string; 
  icon: any;
  textClass: string;
}> = {
  pending: {
    label: "در حال بررسی",
    icon: AlertCircle,
    textClass: "text-amber-600",
  },
  answered : {
    label: "پاسخ داده شده",
    icon: CheckCircle,
    textClass: "text-green-600",
  },
  closed: {
    label: "بسته شده",
    icon: XCircle,
    textClass: "text-gray-600",
  },
};


const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
  
  return formatter.format(date);
};

export default function SupportRequests() {
  const {
    displayedTickets: tickets,
    loading,
    error,
    filters,
    pagination,
    currentTicket,
    currentFileUrl,
    fetchTickets,
    fetchTicketDetail,
    fetchTicketFileUrl,
    setStatusFilter,
    setSearchTerm,
    setCurrentPage,
    clearCurrentTicket,
    clearError,
    resetFilters,
  } = useAdminTickets();

  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const isInitialMount = useRef(true);

 
  useEffect(() => {
    if (isInitialMount.current) {
      fetchTickets();
      isInitialMount.current = false;
    }
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearchTerm !== filters.search) {
        setSearchTerm(localSearchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearchTerm]);

 
  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };


  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handleViewDetails = async (ticketId: string) => {
    setSelectedTicketId(ticketId);
    try {
      await fetchTicketDetail(ticketId);
      setDetailsDialogOpen(true);
    } catch (error) {
      console.error("Failed to fetch ticket details:", error);
    }
  };


  const handleChat = (ticketId: string) => {
    console.log("Navigate to chat for ticket:", ticketId);
  };

  
  const handleDownloadFile = async (ticketId: string) => {
    try {
      await fetchTicketFileUrl(ticketId);
      if (currentFileUrl) {
        window.open(currentFileUrl, '_blank');
      }
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  
  const handleCloseDialog = () => {
    setDetailsDialogOpen(false);
    setSelectedTicketId(null);
    clearCurrentTicket();
  };

  return (
    <section
      dir="rtl"
      className="font-vazirmatn flex-1 overflow-hidden bg-[color:var(--md-sys-color-surface-container-lowest)] px-4 pb-10 pt-8 md:px-10"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      
        <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)]">
          <Typography variant="h5" className="text-[color:var(--md-sys-color-on-surface)]">
            مدیریت تیکت‌های پشتیبانی
          </Typography>
          <Typography
            variant="body-md"
            className="mt-2 text-[color:var(--md-sys-color-on-surface-variant)]"
          >
            مشاهده و مدیریت تمامی درخواست‌های پشتیبانی کاربران
          </Typography>
        </div>

        
        {error && (
          <div className="rounded-2xl border border-red-500 bg-red-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <Typography variant="body-md" className="text-red-700">
                {error}
              </Typography>
              <button
                onClick={clearError}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

       
        <div className="flex flex-col gap-3 rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-4 shadow-[var(--elevation-2)] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-2">
            <h2 className="text-lg font-bold text-[#0f8bff] whitespace-nowrap">لیست تیکت‌ها</h2>
            <div className="flex flex-1 items-center gap-2 rounded-full border border-[color:var(--md-sys-color-primary)] bg-[color:var(--md-sys-color-surface)] px-3 py-2 text-sm text-[color:var(--md-sys-color-on-surface-variant)] shadow-[var(--elevation-1)]">
              <Search className="h-4 w-4 text-[color:var(--md-sys-color-primary)]" />
              <input
                type="text"
                placeholder="جستجو در عنوان، سرویس یا شماره تماس"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                className="w-full bg-transparent text-right outline-none placeholder:text-[color:var(--md-sys-color-on-surface-variant)] text-[color:var(--md-sys-color-on-surface)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap">
           
            <div className="flex gap-2">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isActive = filters.status === option.value;
                
                return (
                  <Button
                    key={option.value}
                    variant={isActive ? "primary" : "ghost"}
                    onClick={() => handleStatusChange(option.value)}
                    className={clsx(
                      "rounded-xl px-4 py-2 text-sm font-semibold transition-all",
                      !isActive && "border border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--md-sys-color-on-surface)] hover:border-[color:var(--md-sys-color-primary)] hover:text-[color:var(--md-sys-color-primary)]",
                      isActive && option.value === "pending" && "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200",
                      isActive && option.value === "resolved" && "bg-green-100 text-green-700 border-green-300 hover:bg-green-200",
                      isActive && option.value === "closed" && "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200",
                      isActive && option.value === "" && "bg-[linear-gradient(135deg,#0f8bff,#2152ff)] text-white"
                    )}
                  >
                    {Icon && <Icon className="ml-2 h-4 w-4" />}
                    {option.label}
                  </Button>
                );
              })}
            </div>

            {(filters.status || localSearchTerm) && (
              <Button
                variant="ghost"
                onClick={() => {
                  resetFilters();
                  setLocalSearchTerm("");
                }}
                className="min-w-[100px] rounded-xl border border-[color:var(--md-sys-color-outline-variant)]"
              >
                بازنشانی فیلترها
              </Button>
            )}
          </div>
        </div>

       
        {loading && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0f8bff] border-t-transparent"></div>
          </div>
        )}

       
        {!loading && (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <div className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-8 text-center">
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)]">
                  {filters.status || localSearchTerm
                    ? "تیکتی با این فیلترها یافت نشد"
                    : "هیچ تیکتی یافت نشد"}
                </Typography>
              </div>
            ) : (
              tickets.map((ticket) => {
                const meta = statusMeta[ticket.status] || {
                  label: ticket.status,
                  icon: AlertCircle,
                  bgClass: "bg-gray-50",
                  textClass: "text-gray-700",
                  borderClass: "border-gray-200",
                };
                const StatusIcon = meta.icon;

                const persianService = serviceMap[ticket.service] || ticket.service;

                return (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] p-5 shadow-[var(--elevation-1)] transition hover:shadow-[var(--elevation-2)]"
                  >
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    
                      <div className="flex-1 min-w-0">
                        <Typography variant="h6" className="text-[#0f8bff] truncate mb-1">
                          {ticket.title}
                        </Typography>
                        <div className="flex items-center gap-2 text-sm text-[color:var(--md-sys-color-on-surface-variant)]">
                          <Tag className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{persianService}</span>
                        </div>
                      </div>

                      
                      <div className="flex items-center gap-2 text-sm min-w-[140px]">
                        <Phone className="h-4 w-4 text-[#0f8bff] flex-shrink-0" />
                        <span className="font-medium text-[color:var(--md-sys-color-on-surface)] truncate">
                          {ticket.userContact.phone}
                        </span>
                      </div>

                    
                        <div className={clsx(
                        "flex items-center gap-2 text-sm font-semibold min-w-[140px]",
                        meta.textClass
                      )}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span>{meta.label}</span>
                      </div>

                     
                      <div className="flex gap-2 min-w-[240px]">
                        <Button
                          variant="primary"
                          className="flex-1 rounded-xl bg-[linear-gradient(135deg,#0f8bff,#2152ff)] text-sm"
                          onClick={() => handleViewDetails(ticket.id)}
                        >
                          <FileText className="ml-2 h-4 w-4" />
                          جزئیات
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 rounded-xl border-[color:var(--md-sys-color-primary)] text-[color:var(--md-sys-color-primary)] text-sm hover:bg-[color:var(--md-sys-color-primary)]/10"
                          onClick={() => handleChat(ticket.id)}
                        >
                          <MessageSquare className="ml-2 h-4 w-4" />
                          چت
                        </Button>
                      </div>
                    </div>

                   
                    <div className="mt-3 pt-3 border-t border-[color:var(--md-sys-color-outline-variant)]/30 text-xs text-[color:var(--md-sys-color-on-surface-variant)]">
                      آخرین پیام: {formatDate(ticket.lastMessageAt)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      
        {!loading && tickets.length > 0 && (
          <div className="flex justify-center">
            <div className="flex flex-wrap items-center gap-3 rounded-full border border-[color:var(--md-sys-color-outline-variant)] bg-[color:var(--md-sys-color-surface)] px-4 py-2 shadow-[var(--elevation-1)]">
              <Button
                variant="ghost"
                disabled={pagination.currentPage <= 1}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="min-w-[86px] text-[#0f8bff] hover:bg-[color:var(--md-sys-color-primary)]/10"
              >
                قبلی
              </Button>
              <span className="text-sm font-semibold text-[#0f8bff]">
                صفحه {pagination.currentPage} از {pagination.totalPages}
              </span>
              <Button
                variant="ghost"
                disabled={pagination.currentPage >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="min-w-[86px] text-[#0f8bff] hover:bg-[color:var(--md-sys-color-primary)]/10"
              >
                بعدی
              </Button>
            </div>
          </div>
        )}
      </div>

     
      <TicketDetailsDialog
        open={detailsDialogOpen}
        onClose={handleCloseDialog}
        ticket={currentTicket}
        onDownloadFile={() => selectedTicketId && handleDownloadFile(selectedTicketId)}
      />
    </section>
  );
}
