"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "../..//components/DashboardLayout";
import { Section } from "../../components/ui/Section";
import { Container } from "../..//components/ui/Container";
import { Button } from "../..//components/ui/Button";
import { Typography } from "../..//components/ui/Typography";
import { TicketList } from "./components/TicketList";
import { NewTicketModal } from "./components/NewTicketModal";
import { Pagination } from "./components/Pagination";
import { Notification } from "../..//components/Notification";
import { useAppDispatch, useAppSelector } from "../..//store/hooks";
import { fetchTickets, setPage, setStatusFilter, clearError } from "../../store/ticketsUserSlice";
import { Plus, RefreshCw } from "lucide-react";

export default function SupportPage() {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error';
  }>({ show: false, message: "", type: 'success' });
  
  const {
    items: tickets,
    loading,
    error,
    pagination,
    filters,
  } = useAppSelector((state) => state.tickets);

  useEffect(() => {
    dispatch(fetchTickets({ status: filters.status }));
  }, [dispatch, filters.status]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
  };

  const handleStatusChange = (status: string) => {
    dispatch(setStatusFilter(status));
  };

  const handleRefresh = () => {
    dispatch(clearError());
    dispatch(fetchTickets({ status: filters.status }));
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleTicketCreated = () => {
    handleRefresh(); 
  };

  const handleShowNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    
   
    setTimeout(() => {
      setNotification({ show: false, message: "", type: 'success' });
    }, 3000);
  };

  return (
    <>
      <DashboardLayout>
        <Section spacing="md">
          <Container size="xl">
           
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <Typography variant="h3" className="mb-2">
                  تیکت‌های پشتیبانی
                </Typography>
                <Typography variant="body-md" tone="muted">
                  مدیریت ارتباط با پشتیبانی
                </Typography>
              </div>

              <div className="flex items-center gap-3">

               
                <Button 
                  onClick={() => setOpenModal(true)}
                  variant="primary"
                  iconLeading={<Plus size={18} />}
                  className="h-11"
                  disabled={loading}
                >
                  تیکت جدید
                </Button>
              </div>
            </div>

           
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "all", label: "همه" },
                  { value: "pending", label: "در انتظار" },
                  { value: "answered", label: "پاسخ داده شده" },
                  { value: "closed", label: "بسته شده" },
                ].map((filter) => (
                  <Button
                    key={filter.value}
                    variant={filters.status === filter.value ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(filter.value)}
                    className="h-9"
                    disabled={loading}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <Typography variant="body-md" className="text-red-600">
                  {error}
                </Typography>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="mt-2 h-8"
                >
                  تلاش مجدد
                </Button>
              </div>
            )}

            
            <div className="bg-card rounded-2xl border border-border/20 overflow-hidden mb-6">
              {loading && pagination.page === 1 ? (
                <div className="py-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <Typography variant="body-md" className="mt-4 text-muted-foreground">
                    در حال بارگذاری تیکت‌ها...
                  </Typography>
                </div>
              ) : tickets.length === 0 ? (
                <div className="py-12 text-center">
                  <Typography variant="h5" className="mb-2">
                    تیکتی یافت نشد
                  </Typography>
                  <Typography tone="muted">
                    {filters.status === "all" 
                      ? "هنوز هیچ تیکتی ایجاد نکرده‌اید"
                      : `تیکتی با وضعیت "${filters.status}" یافت نشد`}
                  </Typography>
                </div>
              ) : (
                <TicketList tickets={tickets} />
              )}
              
              
              {loading && pagination.page > 1 && (
                <div className="py-6 text-center border-t border-border/30">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              )}
            </div>

           
            {tickets.length > 0 && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                pageSize={pagination.limit}
                onPageChange={handlePageChange}
              />
            )}
          </Container>
        </Section>

        
        <NewTicketModal 
          open={openModal} 
          onClose={handleModalClose}
          onTicketCreated={handleTicketCreated}
          onShowNotification={handleShowNotification}
        />
      </DashboardLayout>

     
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={3000}
          onClose={() => setNotification({ show: false, message: "", type: 'success' })}
        />
      )}
    </>
  );
}