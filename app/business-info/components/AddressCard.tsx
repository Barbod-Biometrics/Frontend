
"use client";

import { Card } from '../../..//components/ui/Card';
import { Typography } from '..//../../components/ui/Typography';
import { MapPin, Mailbox, Phone, Navigation } from 'lucide-react';

interface AddressCardProps {
  address: string;
  city: string;
  province: string;
  postalCode: string;
  fixedPhone: string;
  unit:string;
  plate_number:string;
}

export function AddressCard({
  address,
  city,
  province,
  postalCode,
  fixedPhone,
  unit,
  plate_number
}: AddressCardProps) {
  
  const addressParts = [province, city, address].filter(Boolean);
  const extraParts: string[] = [];
  if (plate_number) extraParts.push(`پلاک ${plate_number}`);
  if (unit) extraParts.push(`واحد ${unit}`);
  const fullAddress = [...addressParts, ...extraParts].join("، ");

  return (
    <Card variant="filled" hover className="p-5 h-full text-right" dir="rtl">
      
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[color:var(--md-sys-color-outline-variant)]">
        <div className="p-2 rounded-lg bg-[color:var(--md-sys-color-primary-container)]">
          <MapPin className="w-5 h-5 text-[color:var(--md-sys-color-on-primary-container)]" />
        </div>
        <Typography variant="h6" className="text-[color:var(--text-primary)] font-semibold">
          آدرس کسب‌وکار
        </Typography>
      </div>
      
    
      <div className="space-y-4">
       
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-[color:var(--md-sys-color-primary)]" />
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              آدرس کامل
            </Typography>
          </div>
          <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface)] font-medium leading-6">
            {fullAddress}
          </Typography>
        </div>
        
       
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Mailbox className="w-4 h-4 text-[color:var(--text-secondary)]" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                کد پستی
              </Typography>
            </div>
            <Typography variant="body-md" className="font-mono text-[color:var(--text-primary)] font-medium">
              {postalCode}
            </Typography>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-[color:var(--md-sys-color-primary)]" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                تلفن ثابت
              </Typography>
            </div>
            <Typography variant="body-md" className="text-[color:var(--md-sys-color-primary)] font-medium">
              {fixedPhone}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}
