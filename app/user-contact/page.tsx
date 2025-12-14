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
           
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 mb-6">
                <svg className="w-8 h-8 text-[color:var(--brand-azure)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
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