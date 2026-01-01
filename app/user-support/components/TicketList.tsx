"use client";

import { SupportTicket } from "./types";
import { TicketItem } from "./TicketItem";
import { Typography } from "../../../components/ui/Typography";
import { MessageSquare } from "lucide-react";

interface Props {
  tickets: SupportTicket[];
}

export function TicketList({ tickets }: Props) {
  if (!tickets.length) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <Typography variant="h5" className="mb-2">
          تیکتی یافت نشد
        </Typography>
        <Typography tone="muted">
          هنوز هیچ تیکتی ایجاد نکرده‌اید
        </Typography>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
     
      <div className="hidden md:grid md:grid-cols-12 gap-6 p-4 bg-muted/30 border-b border-border/30 px-6">
        <div className="col-span-4 pl-2">
          <Typography variant="body-sm" className="font-medium">تیکت</Typography>
        </div>
        <div className="col-span-3">
          <Typography variant="body-sm" className="font-medium">سرویس</Typography>
        </div>
        <div className="col-span-2">
          <Typography variant="body-sm" className="font-medium">وضعیت</Typography>
        </div>
        <div className="col-span-1">
          <Typography variant="body-sm" className="font-medium">تاریخ</Typography>
        </div>
        <div className="col-span-1 pr-16">
          <Typography variant="body-sm" className="font-medium">عملیات</Typography>
        </div>
      </div>

     
      {tickets.map((ticket) => (
        <TicketItem 
          key={ticket.id} 
          ticket={ticket}
        />
      ))}
    </div>
  );
}