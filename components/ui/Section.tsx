"use client";

import React from 'react';
import { cn } from './Button';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({ className, spacing = 'lg', ...props }: SectionProps) {
    const spacings = {
        none: 'py-0',
        sm: 'py-12 md:py-16',
        md: 'py-20 md:py-24',
        lg: 'py-32', // Standard section spacing
        xl: 'py-32 lg:py-48', // Hero spacing
    };

    return (
        <section
            className={cn(
                'relative w-full',
                spacings[spacing],
                className
            )}
            {...props}
        />
    );
}
