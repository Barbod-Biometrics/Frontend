"use client";

import React from 'react';
import { cn } from './Button';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Container({ className, size = 'xl', ...props }: ContainerProps) {
    const sizes = {
        sm: 'max-w-3xl',
        md: 'max-w-5xl',
        lg: 'max-w-7xl',
        xl: 'max-w-[1536px]', // Matches the navbar max-width
        full: 'max-w-full',
    };

    return (
        <div
            className={cn(
                'mx-auto w-full px-6 sm:px-8 lg:px-12',
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
