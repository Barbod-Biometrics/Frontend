
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

const FIELD_OF_WORK_LABELS: Record<string, string> = {
  "online-store": "\u0641\u0631\u0648\u0634\u06af\u0627\u0647 \u0622\u0646\u0644\u0627\u06cc\u0646",
  services: "\u062e\u062f\u0645\u0627\u062a",
  "content-media": "\u0645\u062d\u062a\u0648\u0627 / \u0631\u0633\u0627\u0646\u0647",
  education: "\u0622\u0645\u0648\u0632\u0634",
  other: "\u0633\u0627\u06cc\u0631",
};

const normalizeFieldOfWork = (value: string) => {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  const normalized = trimmed.toLowerCase();
  if (FIELD_OF_WORK_LABELS[normalized]) return FIELD_OF_WORK_LABELS[normalized];
  const hyphenated = normalized.replace(/\s+/g, "-");
  return FIELD_OF_WORK_LABELS[hyphenated] ?? trimmed;
};

export function BusinessDetailsCard({
  brandName,
  fieldOfWork,
  websiteUrl,
  businessNationalId
}: BusinessDetailsCardProps) {
  const fieldOfWorkLabel = normalizeFieldOfWork(fieldOfWork);
  return (
    <Card variant="filled" hover className="p-5 h-full text-right" dir="rtl">
    
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <div className="p-2 rounded-lg bg-[color:var(--md-sys-color-primary-container)]">
          <Briefcase className="w-5 h-5 text-[color:var(--md-sys-color-on-primary-container)]" />
        </div>
        <Typography variant="h6" className="text-[color:var(--text-primary)] font-semibold">
          اطلاعات کسب‌وکار
        </Typography>
      </div>
      
     
      <div className="space-y-4">
       
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building className="w-4 h-4 text-[color:var(--md-sys-color-on-surface-variant)]" />
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              نام برند / شرکت
            </Typography>
          </div>
          <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface)] font-medium">
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
            {fieldOfWorkLabel || "-"}
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
              <Globe className="w-4 h-4 text-[color:var(--md-sys-color-primary)]" />
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
              <Typography variant="body-md" className="text-[color:var(--md-sys-color-primary)] font-medium group-hover:opacity-80 transition-opacity">
                {websiteUrl}
              </Typography>
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
