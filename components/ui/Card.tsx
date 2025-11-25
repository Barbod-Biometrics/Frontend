"use client";

import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'elevated' | 'filled' | 'outlined';
    hover?: boolean;
}

export function Card({ className, variant = 'filled', hover = false, ...props }: CardProps) {
    const variants = {
        elevated: 'bg-[color:var(--md-sys-color-surface-container-low)] shadow-[var(--elevation-1)]',
        filled: 'bg-[color:var(--md-sys-color-surface-container)] border border-[color:var(--md-sys-color-outline-variant)]/20',
        outlined: 'bg-transparent border border-[color:var(--md-sys-color-outline-variant)]',
    };

    return (
        <div
            className={cn(
                'rounded-[var(--radius-xl)] overflow-hidden transition-all duration-300',
                variants[variant],
                hover && 'hover:shadow-[var(--elevation-2)] hover:-translate-y-1',
                className
            )}
            {...props}
        />
    );
}
