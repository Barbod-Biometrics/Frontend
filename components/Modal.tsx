// components/ui/Modal.tsx
"use client";

import React, { useEffect } from 'react';
import { cn } from './ui/Button';
import { Button } from './ui/Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md w-full mx-4',
    md: 'max-w-lg w-full mx-4',
    lg: 'max-w-2xl w-full mx-4',
    xl: 'max-w-4xl w-full mx-4',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-200",
          isOpen ? "opacity-100" : "opacity-0"
        )}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative z-50 w-full rounded-2xl',
        'bg-[color:var(--md-sys-color-surface-container-high)]',
        'shadow-[0_20px_60px_rgba(0,0,0,0.3)]',
        'animate-in fade-in zoom-in-95 duration-200',
        'border border-[color:var(--md-sys-color-outline-variant)]/30',
        'min-h-[200px]', 
        sizes[size],
        isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-7 border-b border-[color:var(--md-sys-color-outline-variant)]/30">
          <h3 className="text-xl md:text-2xl font-bold text-[color:var(--md-sys-color-on-surface)]">
            {title}
          </h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-10 w-10 hover:bg-[color:var(--md-sys-color-on-surface)]/5 rounded-full"
            aria-label="بستن"
          >
            <svg 
              className="w-5 h-5 text-[color:var(--md-sys-color-on-surface-variant)]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        
        <div className="p-7 md:p-8"> 
          {children}
        </div>
      </div>
    </div>
  );
}