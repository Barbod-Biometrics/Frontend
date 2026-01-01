"use client";

import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { closeTicket } from "../../../store/ticketsUserSlice";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Typography } from "../../../components/ui/Typography";
import { Button } from "../../../components/ui/Button";
import { cn } from "../../../lib/utils";
import { Notification } from "../../../components//Notification";
import { Send, X } from "lucide-react";
import { fetchTicketMessages, sendMessageAPI } from "../../../lib/ticketsUser-api";

interface Message {
  id: string;
  ticketId: string;
  sender: 'user' | 'admin';
  message: string;
  createdAt: string;
}

interface TicketChatPanelProps {
  ticketId: string;
  ticketTitle: string;
  ticketStatus: 'pending' | 'answered' | 'closed';
  onClose: () => void;
  onCloseTicket: () => void;
}

export default function TicketChatPanel({ 
  ticketId, 
  ticketTitle, 
  ticketStatus,
  onClose, 
  onCloseTicket 
}: TicketChatPanelProps) {
  const dispatch = useAppDispatch();
  const { loading: ticketsLoading } = useAppSelector((state) => state.tickets);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNotification, setShowNotification] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ show: false, message: "", type: 'info' });
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

 
  useEffect(() => {
    loadMessages();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const data = await fetchTicketMessages(ticketId);
      setMessages(data);
    } catch (error: any) {
      console.error("Error loading messages:", error);
      
      let errorMessage = "خطا در دریافت پیام‌ها";
      
      if (error.status === 404) {
        errorMessage = "تیکت مورد نظر یافت نشد";
      } else if (error.status === 403) {
        errorMessage = "شما دسترسی به این تیکت ندارید";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotificationMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      showNotificationMessage("لطفا پیام خود را بنویسید", "error");
      return;
    }

    setIsSending(true);
    
    try {
      const sentMessage = await sendMessageAPI(ticketId, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage("");
      showNotificationMessage("پیام شما ارسال شد", "success");
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      let errorMessage = "خطا در ارسال پیام";
      
      if (error.status === 404) {
        errorMessage = "تیکت مورد نظر یافت نشد";
      } else if (error.status === 403) {
        errorMessage = "شما دسترسی به ارسال پیام در این تیکت را ندارید";
      } else if (error.status === 400) {
        errorMessage = "پیام شما معتبر نیست";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotificationMessage(errorMessage, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleCloseTicket = async () => {
    try {
     
      const result = await dispatch(closeTicket(ticketId)).unwrap();
      
      showNotificationMessage("تیکت با موفقیت بسته شد", "success");
      
      
      if (onCloseTicket) {
        onCloseTicket();
      }
      
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (error: any) {
      console.error("Error closing ticket:", error);
      
      let errorMessage = "خطا در بستن تیکت";
      
      if (error.status === 404) {
        errorMessage = "تیکت مورد نظر یافت نشد";
      } else if (error.status === 403) {
        errorMessage = "شما دسترسی به بستن این تیکت را ندارید";
      } else if (error.status === 400) {
        errorMessage = "تیکت قبلاً بسته شده است";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showNotificationMessage(errorMessage, "error");
    }
  };

  const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setShowNotification({ show: true, message, type });
    setTimeout(() => {
      setShowNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <Card className="w-full max-w-2xl h-[75vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-3 px-4 py-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full h-7 w-7"
              >
                <X size={16} />
              </Button>
              <div>
                <CardTitle className="text-base font-medium truncate max-w-[200px]">
                  {ticketTitle}
                </CardTitle>
              </div>
            </div>
            
            {ticketStatus !== 'closed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCloseTicket}
                disabled={isSending || isLoading || ticketsLoading}
                className="h-8 text-xs px-3"
              >
                {ticketsLoading ? 'در حال بستن...' : 'بستن تیکت'}
              </Button>
            )}
          </CardHeader>

          <CardContent className="flex-1 overflow-hidden p-0">
            <div className="h-full flex flex-col">
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    هیچ پیامی وجود ندارد. اولین پیام را ارسال کنید!
                  </div>
                ) : (
                  messages.map((message, index) => {
                    const showDate = index === 0 || 
                      formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);
                    
                    return (
                      <div key={message.id} className="space-y-1">
                       
                        {showDate && (
                          <div className="flex justify-center my-2">
                            <Typography 
                              variant="body-sm" 
                              tone="muted"
                              className="text-gray-500 dark:text-gray-400"
                            >
                              {formatDate(message.createdAt)}
                            </Typography>
                          </div>
                        )}
                        
                       
                        {message.sender === 'user' ? (
                           <div className="flex justify-start">
                            <div className="max-w-[80%]">
                              <div className={cn(
                                "rounded-2xl p-3",
                                "bg-blue-500 text-white",
                                "rounded-tr-none"
                              )}>
                                <Typography variant="body-sm">
                                  {message.message}
                                </Typography>
                              </div>
                            </div>
                          </div>
                          
                        ) : (
                         
                         <div className="flex justify-end">
                            <div className="max-w-[80%]">
                              <div className={cn(
                                
                                "rounded-2xl p-3",
                                "bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900 border border-gray-300 dark:border-gray-700",
                                "rounded-tl-none"
                              )}>
                                <Typography variant="body-sm" className="text-white">
                                  {message.message}
                                </Typography>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {ticketStatus !== 'closed' && (
                <div className="border-t border-border/30 p-3">
                  <div className="flex gap-2">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTextareaHeight();
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="پیام خود را بنویسید..."
                      className={cn(
                        "flex-1 rounded-lg bg-card border border-border/30 px-3 py-2",
                        "text-sm placeholder:text-muted-foreground focus:outline-none",
                        "focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20",
                        "resize-none min-h-[40px] max-h-[96px]",
                        "transition-all duration-200"
                      )}
                      rows={1}
                      disabled={isSending || isLoading || ticketsLoading}
                    />

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={isSending || !newMessage.trim() || isLoading || ticketsLoading}
                      className="h-10 w-10 flex-shrink-0 p-0"
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <Send size={16} />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showNotification.show && (
        <Notification
          message={showNotification.message}
          type={showNotification.type}
          onClose={() => setShowNotification(prev => ({ ...prev, show: false }))}
        />
      )}
      
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
}