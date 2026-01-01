"use client";
import { useState } from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";
import { SupportTicket } from "./types";
import { cn } from "../../../lib/utils";
import { MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import TicketChatPanel from "./TicketChatPanel";

interface Props {
  ticket: SupportTicket;
}

export function TicketItem({ ticket }: Props) {
  const statusConfig = {
    pending: {
      label: "در انتظار",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
    },
    answered: {
      label: "پاسخ داده‌شده",
      icon: MessageSquare,
      className: "bg-green-500/10 text-green-600 border border-green-500/20",
    },
    closed: {
      label: "بسته شده",
      icon: CheckCircle2,
      className: "bg-gray-500/10 text-gray-600 border border-gray-500/20",
    },
  };

  const status = statusConfig[ticket.status];
  const [openChat, setOpenChat] = useState(false);
  const StatusIcon = status.icon;

  const handleTicketClosed = () => {
    setOpenChat(false);
   
  };

  return (
    <>
      <Card variant="filled" className="border border-border/20 rounded-lg hover:bg-muted/30 transition-colors">
        <CardContent className="p-4 md:px-6">
          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Typography variant="body-md" className="font-medium mb-2">
                  {ticket.title}
                </Typography>
                <div className="flex items-center gap-3 mb-2">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                    status.className
                  )}>
                    <StatusIcon size={12} />
                    {status.label}
                  </span>
                  <Typography variant="body-sm" tone="muted">
                    {ticket.service}
                  </Typography>
                </div>
                <Typography variant="body-sm" tone="muted">
                  {ticket.createdAt}
                </Typography>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 min-w-[70px] ml-3"
                onClick={() => setOpenChat(true)}
                disabled={ticket.status === 'closed'}
              >
                <MessageSquare size={16} className="ml-1" />
                چت
              </Button>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:grid md:grid-cols-12 items-center gap-4">
            {/* Title */}
            <div className="col-span-4 pl-2">
              <Typography variant="body-md" className="font-medium truncate">
                {ticket.title}
              </Typography>
            </div>

            {/* Service */}
            <div className="col-span-3">
              <Typography variant="body-sm">{ticket.service}</Typography>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium",
                status.className
              )}>
                <StatusIcon size={14} />
                {status.label}
              </span>
            </div>

            {/* Date */}
            <div className="col-span-1">
              <Typography variant="body-sm">{ticket.createdAt}</Typography>
            </div>

            {/* Chat Button */}
            <div className="col-span-1 pr-16">
              <Button 
                variant="outline" 
                size="sm"
                className="h-9 w-full"
                onClick={() => setOpenChat(true)}
                disabled={ticket.status === 'closed'}
              >
                <MessageSquare size={16} className="ml-2" />
                چت
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Chat Panel */}
      {openChat && (
        <TicketChatPanel
          ticketId={ticket.id}
          ticketTitle={ticket.title}
          ticketStatus={ticket.status}
          onClose={() => setOpenChat(false)}
          onCloseTicket={handleTicketClosed}
        />
      )}
    </>
  );
}