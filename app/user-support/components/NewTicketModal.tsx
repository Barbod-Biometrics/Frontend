"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Typography } from "../../../components/ui/Typography";
import { createPortal } from "react-dom";
import { X, Upload, FileText, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import { SupportTicket } from "./types";
import { createTicketAPI, getUploadUrlAPI, uploadFileToS3 } from '../../../lib/ticketsUser-api';

interface Props {
  open: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: SupportTicket) => void;
  onShowNotification?: (message: string, type: 'success' | 'error') => void;
}

interface FormErrors {
  service?: string;
  title?: string;
  content?: string;
  file?: string;
  submit?: string;
}

export function NewTicketModal({ 
  open, 
  onClose, 
  onTicketCreated,
  onShowNotification 
}: Props) {
  const [service, setService] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

 
  useEffect(() => {
    if (!open) {
     
      setTimeout(() => {
        setService("");
        setTitle("");
        setContent("");
        setFile(null);
        setErrors({});
        setIsUploading(false);
      }, 300);
    }
  }, [open]);

  if (!open) return null;

  const serviceOptions = [
    { value: "ocr", label: "OCR مدارک" },
    { value: "face_auth", label: "احراز هویت چهره" },
    { value: "liveness", label: "تشخیص زنده بودن" },
    { value: "other", label: "سایر موارد" },
  ];

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!service.trim()) {
      newErrors.service = "لطفا سرویس را انتخاب کنید";
    }
    if (!title.trim()) {
      newErrors.title = "لطفا عنوان را وارد کنید";
    }
    if (!content.trim()) {
      newErrors.content = "لطفا متن پیام را وارد کنید";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setErrors(prev => ({ ...prev, file: undefined, submit: undefined }));
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, file: "حجم فایل باید کمتر از ۱۰ مگابایت باشد" }));
        return;
      }
      
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(selectedFile.type)) {
        setErrors(prev => ({ ...prev, file: "فرمت فایل مجاز نیست. فقط png, jpeg, jpg, pdf مجاز است" }));
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setErrors(prev => ({ ...prev, file: undefined }));
  };

  const uploadFile = async (file: File): Promise<string | undefined> => {
    try {
      const fileExtension = file.name.split('.').pop() || '';
      const uploadUrlResponse = await getUploadUrlAPI(fileExtension);
      
      if (!uploadUrlResponse.upload_url) {
        throw new Error('آدرس آپلود معتبر دریافت نشد');
      }

      await uploadFileToS3(uploadUrlResponse.upload_url, file);
      
      return uploadUrlResponse.object_key;
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setErrors(prev => ({ 
        ...prev, 
        file: error.message || 'خطا در آپلود فایل' 
      }));
      return undefined;
    }
  }; 

  const extractErrorMessage = (error: any): string => {
    console.log('Full error object:', error);
    
    if (error.message) {
      return error.message;
    }
    
    if (error.data) {
      if (typeof error.data === 'string') {
        return error.data;
      }
      
      if (typeof error.data === 'object') {
        if (error.data.message) {
          return error.data.message;
        }
        if (error.data.error) {
          return error.data.error;
        }
        
        const entries = Object.entries(error.data);
        if (entries.length > 0) {
          const firstError = entries[0];
          if (Array.isArray(firstError[1])) {
            return `${firstError[0]}: ${firstError[1][0]}`;
          }
          return `${firstError[0]}: ${firstError[1]}`;
        }
      }
    }
    
    return 'خطای ناشناخته در سرور رخ داده است';
  };

  const handleSubmit = async () => {
   
    setErrors({});
    
    if (!validateForm()) {
      return;
    }

    setIsUploading(true);
    
    try {
      let attachmentKey: string | undefined;
      
   
      if (file) {
        attachmentKey = await uploadFile(file);
        if (!attachmentKey) {
          setIsUploading(false);
          return;
        }
      }

      const ticketData = {
        service,
        title,
        description: content,
        attachment: attachmentKey,
      };

      console.log('Sending ticket data:', ticketData);
      
      const response = await createTicketAPI(ticketData);
      
      if (response.success) {
        
        if (onShowNotification) {
          onShowNotification("تیکت جدید با موفقیت ثبت شد!", "success");
        }
        
        if (onTicketCreated) {
          onTicketCreated(response.data);
        }
        
      
        onClose();
      }
      
    } catch (error: any) {
      console.error('Submit error:', error);
      setIsUploading(false);
      
     
      const errorMessage = extractErrorMessage(error);
      console.log('Extracted error message:', errorMessage);
      
     
      setErrors(prev => ({ 
        ...prev, 
        submit: errorMessage
      }));
      
      
      if (onShowNotification) {
        onShowNotification(errorMessage, "error");
      }
    }
  };

  const isSubmitDisabled = !service.trim() || !title.trim() || !content.trim() || isUploading;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={() => !isUploading && onClose()}
    >
      <Card 
        className="w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-4">
          <CardTitle>ایجاد تیکت جدید</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-8 w-8"
            disabled={isUploading}
          >
            <X size={18} />
          </Button>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
        
          {errors.submit && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle size={16} />
                <span>{errors.submit}</span>
              </div>
            </div>
          )}

          {/* Service */}
          <div>
            <label className="block text-sm font-medium mb-2">
              سرویس *
            </label>
            <select
              className={cn(
                "w-full p-3 rounded-lg bg-card border text-sm",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                errors.service ? "border-red-500" : "border-border/30"
              )}
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                if (errors.service) {
                  setErrors(prev => ({ ...prev, service: undefined, submit: undefined }));
                }
              }}
              disabled={isUploading}
            >
              <option value="">انتخاب کنید</option>
              {serviceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.service && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{errors.service}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              عنوان *
            </label>
            <input
              className={cn(
                "w-full p-3 rounded-lg bg-card border text-sm",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                errors.title ? "border-red-500" : "border-border/30"
              )}
              placeholder="عنوان مشکل یا درخواست"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined, submit: undefined }));
                }
              }}
              disabled={isUploading}
            />
            {errors.title && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-2">
              متن پیام *
            </label>
            <textarea
              rows={4}
              className={cn(
                "w-full p-3 rounded-lg bg-card border text-sm resize-none",
                "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20",
                errors.content ? "border-red-500" : "border-border/30"
              )}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errors.content) {
                  setErrors(prev => ({ ...prev, content: undefined, submit: undefined }));
                }
              }}
              disabled={isUploading}
              placeholder="توضیحات کامل مشکل یا درخواست خود را بنویسید"
            />
            {errors.content && (
              <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                <AlertCircle size={12} />
                <span>{errors.content}</span>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              فایل پیوست (اختیاری)
            </label>
            
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all",
                "border-border/30 hover:border-primary/50",
                isUploading && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => !isUploading && fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <Typography variant="body-sm" className="mb-2">
                فایل را اینجا رها کنید یا کلیک کنید
              </Typography>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpeg,.jpg,.pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1"
                disabled={isUploading}
              >
                انتخاب فایل
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              <Typography variant="body-sm" tone="muted">
                فرمت‌های مجاز: PNG, JPEG, JPG, PDF • حداکثر حجم: ۱۰ مگابایت
              </Typography>
              
              {file && (
                <div className="flex items-center justify-between p-2 bg-muted/20 rounded-lg mt-2">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-muted-foreground" />
                    <Typography variant="body-sm">
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </Typography>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="h-6 px-2"
                    disabled={isUploading}
                  >
                    حذف
                  </Button>
                </div>
              )}
              
              {errors.file && (
                <div className="flex items-center gap-1 mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} />
                  <span>{errors.file}</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10"
              disabled={isUploading}
            >
              انصراف
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="h-10 min-w-[100px]"
              disabled={isSubmitDisabled}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {file ? 'در حال آپلود...' : 'در حال ارسال...'}
                </div>
              ) : (
                "ثبت تیکت"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return createPortal(modalContent, document.body);
}