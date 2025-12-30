
"use client";

import { Container } from '../../../components/ui/Container';
import { Section } from '../../../components/ui/Section';
import { Typography } from '../../../components/ui/Typography';
import { Building2, AlertCircle } from 'lucide-react';

export function NoProfileCard() {
  return (
    <Container size="xl">
      <Section spacing="md">
       
        <div className="mb-8 mt-14">
          <div className="flex items-center gap-4 mb-5">
            <Building2 className="w-8 h-8 text-[color:var(--text-primary)]" />
            <Typography variant="h2" component="h1" className="font-bold text-[color:var(--text-primary)]">
              اطلاعات کسب‌وکار
            </Typography>
          </div>
        </div>
        
       
        <div className="bg-[color:var(--md-sys-color-surface-container-high)] border border-[color:var(--md-sys-color-outline-variant)] rounded-xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-[color:var(--md-sys-color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <Typography variant="h6" className="text-[color:var(--md-sys-color-on-surface)] mb-2">
                هیچ کسب‌وکاری یافت نشد
              </Typography>
              <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)] mb-4">
                برای مشاهده اطلاعات کسب‌وکار، ابتدا باید یک کسب‌وکار ایجاد کنید.
              </Typography>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}
