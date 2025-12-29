"use client";

import React from 'react';

export function Logo({
  size = 'medium',
}: {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
}) {
  const dimensions = {
    small: 'h-8 w-8',
    medium: 'h-10 w-10',
    large: 'h-12 w-12',
    xlarge: 'h-16 w-16',
  };

  return (
    <div className={`${dimensions[size]} flex items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--brand-cyan)] to-[color:var(--brand-azure)] shadow-lg`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white w-2/3 h-2/3"
      >
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M9 12a3 3 0 1 0 6 0" />
        <path d="M12 16v.01" />
      </svg>
    </div>
  );
}
