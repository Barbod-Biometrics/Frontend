// components/ui/Input.tsx
"use client";

import React from 'react';
import { cn } from '../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-sm font-medium text-[color:var(--md-sys-color-on-surface-variant)]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--md-sys-color-on-surface-variant)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full h-12 px-4 rounded-lg border transition-colors duration-200',
              'bg-[color:var(--md-sys-color-surface-container-highest)]',
              'border-[color:var(--md-sys-color-outline-variant)]',
              'text-[color:var(--md-sys-color-on-surface)]',
              'placeholder:text-[color:var(--md-sys-color-on-surface-variant)]',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'focus:ring-[color:var(--brand-azure)]',
              icon && 'pl-10',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
