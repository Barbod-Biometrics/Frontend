"use client";

import React from 'react';
import { cn } from '../../lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({ className, spacing = 'lg', ...props }: SectionProps) {
    const spacings = {
        none: 'py-0',
        sm: 'py-6 md:py-10 lg:py-12',
        md: 'py-10 md:py-12 lg:py-16',
        lg: 'py-12 md:py-16 lg:py-20', // Aggressively reduced
        xl: 'py-16 md:py-20 lg:py-32', // Hero spacing reduced
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
