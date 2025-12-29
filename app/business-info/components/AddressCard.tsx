
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
  
  const fullAddress = `${province}، ${city}، ${address}،پلاک ${plate_number}،واحد${unit}`;

  return (
    <Card variant="filled" hover className="p-5 h-full">
      
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[color:var(--outline-variant)]">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <MapPin className="w-5 h-5 text-emerald-500" />
        </div>
        <Typography variant="h6" className="text-[color:var(--text-primary)] font-semibold">
          آدرس کسب‌وکار
        </Typography>
      </div>
      
    
      <div className="space-y-4">
       
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-emerald-500" />
            <Typography variant="caption" className="text-[color:var(--text-secondary)]">
              آدرس کامل
            </Typography>
          </div>
          <Typography variant="body-md" className="text-emerald-500 font-medium leading-6">
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
              <Phone className="w-4 h-4 text-blue-500" />
              <Typography variant="caption" className="text-[color:var(--text-secondary)]">
                تلفن ثابت
              </Typography>
            </div>
            <Typography variant="body-md" className="text-blue-500 font-medium">
              {fixedPhone}
            </Typography>
          </div>
        </div>
      </div>
    </Card>
  );
}
