"use client";

import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', iconLeading, iconTrailing, children, ...props }, ref) => {

    const variants = {
      primary: 'bg-[color:var(--brand-azure)] text-white hover:brightness-110 border-transparent shadow-[var(--elevation-1)] hover:shadow-[var(--elevation-2)]',
      secondary: 'bg-transparent border border-[color:var(--md-sys-color-outline)] text-[color:var(--md-sys-color-primary)] hover:bg-[color:var(--md-sys-color-primary)]/10 hover:border-[color:var(--md-sys-color-primary)]',
      ghost: 'bg-transparent text-[color:var(--text-primary)] hover:bg-[color:var(--surface-card)] border-transparent',
      outline: 'bg-transparent border border-[color:var(--md-sys-color-outline-variant)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] hover:bg-[color:var(--surface-card)]',
      link: 'bg-transparent text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)] underline-offset-4 hover:underline border-transparent p-0 h-auto',
    };

    const sizes = {
      sm: 'h-10 px-5 text-sm min-w-[90px]',
      md: 'h-12 px-7 py-2.5 text-base min-w-[110px]',
      lg: 'h-14 px-9 text-base min-w-[140px]',
      icon: 'h-12 w-12 p-0 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center text-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variants[variant],
          size !== 'icon' && sizes[size], // Apply size classes only if not icon (icon has its own fixed size)
          size === 'icon' && sizes.icon,
          className
        )}
        {...props}
      >
        {iconLeading}
        {children}
        {iconTrailing}
      </button>
    );
  }
);

Button.displayName = 'Button';
