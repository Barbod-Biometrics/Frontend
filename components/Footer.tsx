"use client";

import React from 'react';
import { Logo } from './Logo';
import { useLanguage } from '../lib/useLanguage';
import { Language } from '../types';
import { MapPin, Phone, Mail, Linkedin, Instagram, Send } from 'lucide-react';
import { Section } from './ui/Section';
import { Container } from './ui/Container';
import { Typography } from './ui/Typography';
import { Button } from './ui/Button';

const footerCopy: Record<Language, { address: string; contact: string; copyright: string }> = {
  [Language.EN]: {
    address: 'Tehran, Innovation District, Tech Ave, No 12',
    contact: 'Contact',
    copyright: 'All rights reserved for Barbod.',
  },
  [Language.FA]: {
    address: 'تهران، رسالت، هنگام، خیابان دانشگاه، دانشگاه علم و صنعت ایران',
    contact: 'ارتباط با ما',
    copyright: 'کلیه حقوق متعلق به باربد می‌باشد.',
  },
};

export function Footer() {
  const { language, dir } = useLanguage();
  const copy = footerCopy[language];

  return (
    <footer className="bg-[color:var(--md-sys-color-surface-container)] pt-24 pb-12 border-t border-[color:var(--md-sys-color-outline-variant)]" dir={dir}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-1 flex flex-col gap-6 items-start">
            <div className="flex items-center gap-3">
              <Logo size="medium" />
              <Typography variant="h5" className="font-bold">Barbod</Typography>
            </div>
            <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)]">
              {language === Language.FA
                ? 'ارائه‌دهنده راهکارهای هوشمند احراز هویت دیجیتال و بیومتریک برای کسب‌وکارهای مدرن.'
                : 'Provider of intelligent digital identity verification and biometric solutions for modern businesses.'}
            </Typography>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-[color:var(--md-sys-color-surface-container-high)] hover:bg-[color:var(--md-sys-color-surface-container-highest)]">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block"></div>

          {/* Contact Info */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <Typography variant="h4" className="font-bold">{copy.contact}</Typography>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-[color:var(--md-sys-color-primary)] shrink-0" />
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)]">
                  {copy.address}
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[color:var(--md-sys-color-primary)] shrink-0" />
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)]" dir="ltr">
                  +98 21 1234 5678
                </Typography>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[color:var(--md-sys-color-primary)] shrink-0" />
                <Typography variant="body-lg" className="text-[color:var(--md-sys-color-on-surface-variant)]" dir="ltr">
                  info@barbod.ai
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[color:var(--md-sys-color-outline-variant)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography variant="body-md" className="text-[color:var(--md-sys-color-on-surface-variant)]">
            {copy.copyright}
          </Typography>
          <div className="flex gap-6">
            <Button variant="link" className="text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)]">
              Privacy Policy
            </Button>
            <Button variant="link" className="text-[color:var(--md-sys-color-on-surface-variant)] hover:text-[color:var(--md-sys-color-on-surface)]">
              Terms of Service
            </Button>
          </div>
        </div>
      </Container>
    </footer>
  );
}
