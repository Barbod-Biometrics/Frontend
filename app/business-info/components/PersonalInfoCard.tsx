
"use client";

import { Card } from '../../..//components/ui/Card';
import { Typography } from '../../..//components/ui/Typography';
import { User, Hash, Calendar, Phone } from 'lucide-react';

interface PersonalInfoCardProps {
  firstName: string;
  lastName: string;
  nationalId: string;
  dob: string;
  mobileNumber: string;
  isBusinessAccount?: boolean;
}

export function PersonalInfoCard({
  firstName,
  lastName,
  nationalId,
  dob,
  mobileNumber,
  isBusinessAccount = false
}: PersonalInfoCardProps) {
  const title = isBusinessAccount ? 'اطلاعات نماینده' : 'اطلاعات شخصی';

  return (
    <Card variant="filled" hover className="p-5 h-full">
     
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <div className="p-2 rounded-lg bg-[color:var(--md-sys-color-primary-container)]">
          <User className="w-5 h-5 text-[color:var(--md-sys-color-on-primary-container)]" />
        </div>
        <Typography variant="h6" className="text-[color:var(--text-primary)] font-semibold">
          {title}
        </Typography>
      </div>
      
      
      <div className="space-y-4">
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Typography variant="caption" className="text-[color:var(--text-secondary)] block mb-2">
              نام
            </Typography>
            <Typography variant="body-md" className="text-[color:var(--text-primary)] font-medium">
              {firstName}
            </Typography>
          </div>
          
          <div>
            <Typography variant="caption" className="text-[color:var(--text-secondary)] block mb-2">
              نام خانوادگی
            </Typography>
            <Typography variant="body-md" className="text-[color:var(--text-primary)] font-medium">
              {lastName}
            </Typography>
          </div>
        </div>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-[color:var(--text-secondary)]" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                کد ملی
              </Typography>
            </div>
            <Typography variant="body-md" className="font-mono text-[color:var(--text-primary)] font-medium">
              {nationalId}
            </Typography>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[color:var(--text-secondary)]" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                تاریخ تولد
            </Typography>
            </div>
            <Typography variant="body-md" className="text-[color:var(--text-primary)] font-medium">
              {dob}
            </Typography>
          </div>
        </div>
        
      
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4 text-[color:var(--md-sys-color-primary)]" />
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              شماره تماس
            </Typography>
          </div>
          <Typography variant="body-lg" className="text-[color:var(--md-sys-color-primary)] font-medium">
            {mobileNumber}
          </Typography>
        </div>
      </div>
    </Card>
  );
}
