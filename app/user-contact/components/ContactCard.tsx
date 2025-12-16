"use client";

import React from 'react';
import { Button } from '../../../components/ui/Button';
import { Typography } from '../../../components/ui/Typography';

interface ContactCardProps {
  label: string;
  value: string;
  onEdit: () => void;
  isLoading: boolean;
  notSetText: string;
}

export function ContactCard({ 
  label, 
  value, 
  onEdit, 
  isLoading,
  notSetText 
}: ContactCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-[color:var(--md-sys-color-surface-container-low)] border border-[color:var(--md-sys-color-outline-variant)]/20 hover:border-[color:var(--md-sys-color-outline-variant)]/40 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex-1 space-y-1.5">
        <Typography variant="body-sm" className="text-[color:var(--md-sys-color-on-surface-variant)] font-medium">
          {label}
        </Typography>
        <Typography 
          variant="body-md" 
          className={`text-[color:var(--md-sys-color-on-surface)] font-semibold ${!value ? 'opacity-70' : ''}`}
        >
          {value || notSetText}
        </Typography>
      </div>
      <Button
        variant="secondary"
        size="md"
        onClick={onEdit}
        disabled={isLoading}
        className="transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-w-[100px]"
        iconLeading={
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        }
      >
        ویرایش
      </Button>
    </div>
  );
}