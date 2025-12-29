
"use client";

import { Card } from '../../..//components/ui/Card';
import { Typography } from '../../..//components/ui/Typography';
import { Briefcase, Globe, Hash, Building, Target } from 'lucide-react';

interface BusinessDetailsCardProps {
  brandName: string;
  fieldOfWork: string;
  websiteUrl?: string;
  businessNationalId?: string;
}

export function BusinessDetailsCard({
  brandName,
  fieldOfWork,
  websiteUrl,
  businessNationalId
}: BusinessDetailsCardProps) {
  return (
    <Card variant="filled" hover className="p-5 h-full">
    
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[color:var(--outline-variant)]">
        <div className="p-2 rounded-lg bg-amber-500/10">
          <Briefcase className="w-5 h-5 text-amber-500" />
        </div>
        <Typography variant="h6" className="text-[color:var(--text-primary)] font-semibold">
          اطلاعات کسب‌وکار
        </Typography>
      </div>
      
     
      <div className="space-y-4">
       
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-4 h-4 text-amber-500" />
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              نام برند / شرکت
            </Typography>
          </div>
          <Typography variant="body-lg" className="text-amber-500 font-medium">
            {brandName}
          </Typography>
        </div>
        
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-[color:var(--text-secondary)]" />
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              زمینه فعالیت
            </Typography>
          </div>
          <Typography variant="body-md" className="text-[color:var(--text-primary)] font-medium">
            {fieldOfWork}
          </Typography>
        </div>
        
       
        {businessNationalId && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="w-4 h-4 text-[color:var(--text-secondary)]" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                شناسه ملی
              </Typography>
            </div>
            <Typography variant="body-md" className="font-mono text-[color:var(--text-primary)] font-medium">
              {businessNationalId}
            </Typography>
          </div>
        )}
        
      
        {websiteUrl && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                وب‌سایت رسمی
              </Typography>
            </div>
            <a 
              href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block"
            >
              <Typography variant="body-md" className="text-blue-500 font-medium group-hover:text-blue-600 transition-colors">
                {websiteUrl}
              </Typography>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
