
"use client";

import { Card } from '../../..//components/ui/Card';
import { Typography } from '../../..//components/ui/Typography';
import { Building2, CircleCheck, AlertCircle, XCircle } from 'lucide-react';

interface AccountInfoCardProps {
  accountName: string;
  accountType: string; 
  isActive: boolean;
  verificationStatus: string;
}

export function AccountInfoCard({
  accountName,
  accountType,
  isActive,
  verificationStatus
}: AccountInfoCardProps) {
  
  const getStatusConfig = () => {
    const status = verificationStatus.toLowerCase();
    
    if (status.includes('تأیید') || status.includes('verified') || status === 'approved') {
      return {
        color: 'text-[color:var(--md-sys-color-primary)]',
        icon: <CircleCheck className="w-4 h-4" />,
        text: 'تأیید شده'
      };
    } 
    
    if (status.includes('بررسی') || status.includes('pending') || status === 'pending') {
      return {
        color: 'text-[color:var(--md-sys-color-tertiary)]',
        icon: <AlertCircle className="w-4 h-4" />,
        text: 'در انتظار تایید'
      };
    }
    
    if (status.includes('رد') || status.includes('rejected') || status === 'rejected') {
      return {
        color: 'text-[color:var(--md-sys-color-error)]',
        icon: <XCircle className="w-4 h-4" />,
        text: 'رد شده'
      };
    }
    
    return {
      color: 'text-[color:var(--md-sys-color-on-surface-variant)]',
      icon: <AlertCircle className="w-4 h-4" />,
      text: verificationStatus
    };
  };

  const statusConfig = getStatusConfig();
  const isBusiness = accountType === 'حقوقی';

  return (
    <Card variant="filled" hover className="p-5 h-full text-right" dir="rtl">
     
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[color:var(--md-sys-color-primary-container)]">
            <Building2 className="w-5 h-5 text-[color:var(--md-sys-color-on-primary-container)]" />
          </div>
          <Typography variant="h6" className="text-[color:var(--text-primary)] font-semibold">
            اطلاعات حساب
          </Typography>
        </div>
        
       
        <div className={`text-sm ${isActive ? 'text-[color:var(--md-sys-color-primary)]' : 'text-[color:var(--md-sys-color-on-surface-variant)]'}`}>
          {isActive ? 'فعال' : 'غیرفعال'}
        </div>
      </div>
      
    
      <div className="space-y-4">
      
        <div>
          <Typography variant="caption" className="text-[color:var(--text-secondary)] block mb-2">
            نام حساب
          </Typography>
          <Typography variant="body-lg" className="text-[color:var(--text-primary)] font-medium">
            {accountName}
          </Typography>
        </div>
        
       
        <div>
          <Typography variant="caption" className="text-[color:var(--text-secondary)] block mb-2">
            نوع حساب
          </Typography>
          <div className="flex items-center gap-2">
            <Typography variant="body-md" className={`font-medium ${isBusiness ? 'text-[color:var(--md-sys-color-primary)]' : 'text-[color:var(--md-sys-color-on-surface)]'}`}>
              {accountType}
            </Typography>
          </div>
        </div>
        
       
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex ${statusConfig.color}`}>
              {statusConfig.icon}
            </span>
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              وضعیت تأیید
            </Typography>
          </div>
          <Typography variant="body-md" className={`font-medium ${statusConfig.color}`}>
            {statusConfig.text}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
