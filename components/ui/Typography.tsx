"use client";

import React from 'react';
import { cn } from '../../lib/utils';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body-lg' | 'body-md' | 'body-sm' | 'caption';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
    variant?: Variant;
    component?: React.ElementType;
    gradient?: boolean;
}

export function Typography({
    variant = 'body-md',
    component,
    className,
    children,
    gradient = false,
    ...props
}: TypographyProps) {
    const Component = component ||
        (variant.startsWith('h') ? (variant as React.ElementType) : 'p');

    const styles = {
        h1: 'text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]',
        h2: 'text-4xl md:text-5xl font-bold tracking-tight',
        h3: 'text-3xl md:text-4xl font-bold tracking-tight',
        h4: 'text-2xl md:text-3xl font-bold tracking-tight',
        h5: 'text-xl md:text-2xl font-semibold tracking-tight',
        h6: 'text-lg md:text-xl font-semibold tracking-tight',
        'body-lg': 'text-lg sm:text-xl leading-relaxed',
        'body-md': 'text-base leading-relaxed',
        'body-sm': 'text-sm leading-relaxed',
        caption: 'text-xs leading-relaxed',
    };

    const colors = {
        default: 'text-foreground',
        muted: 'text-muted-foreground',
    };

    // Default color logic: Headings are default, body is often muted but let's stick to default for now and let className override
    const defaultColor = variant.startsWith('h') ? colors.default : colors.muted;

    return (
        <Component
            className={cn(
                styles[variant],
                !gradient && defaultColor,
                gradient && 'text-brand-gradient',
                className
            )}
            {...props}
        >
            {children}
        </Component>
    );
}
