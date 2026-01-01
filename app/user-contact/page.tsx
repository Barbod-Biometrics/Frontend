"use client";

import React from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { Container } from '../../components/ui/Container';
import { Section } from '../../components/ui/Section';
import { Typography } from '../../components/ui/Typography';
import { ContactInfo } from './components/ContactInfo';

export default function UserContactPage() {
  return (
    <DashboardLayout>
      <Section spacing="lg">
        <Container size="lg">
          <div className="space-y-8 animate-in fade-in duration-700">
           
            <div className="text-center mb-12  mt-15">
              <Typography variant="h2" className="mb-4 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                تنظیمات حساب کاربری
              </Typography>
              <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)] max-w-2xl mx-auto">
                اطلاعات تماس و ایمیل حساب خود را در این بخش مدیریت کنید
              </Typography>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                <ContactInfo />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </DashboardLayout>
  );
}