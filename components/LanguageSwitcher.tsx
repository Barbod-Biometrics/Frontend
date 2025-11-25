"use client";

import React, { useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { Button } from './ui/Button';
import { useLanguage } from '../lib/useLanguage';
import { Language } from '../types';

const languageOptions: Array<{ value: Language; label: string; helper: string }> = [
  { value: Language.FA, label: '\u0641\u0627\u0631\u0633\u06cc', helper: 'Persian' },
  { value: Language.EN, label: 'English', helper: 'International' },
];

export function LanguageSwitcher() {
  const { language, dir, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="relative inline-block text-left">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12"
        onClick={toggleOpen}
        aria-label="Change language"
      >
        <Globe className="w-6 h-6" />
      </Button>

      {isOpen && (
        <div 
          className={`absolute mt-2 w-52 rounded-xl bg-[color:var(--bg-base)] border border-[color:var(--border-subtle)] shadow-[var(--shadow-md)] backdrop-blur-none focus:outline-none z-50 ${dir === 'rtl' ? 'left-0 origin-top-left' : 'right-0 origin-top-right'}`}
        >
          <div className="py-1">
            <div className={`px-4 py-2 text-sm text-[color:var(--text-secondary)] border-b border-[color:var(--border-hairline)] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
              {'\u0632\u0628\u0627\u0646'} / Language
            </div>
            {languageOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                    setLanguage(option.value);
                    setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-[color:var(--text-primary)] hover:bg-[color:var(--surface-elevated)] ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`flex flex-col ${dir === 'rtl' ? 'items-end' : 'items-start'}`}>
                  <span className="font-medium">{option.label}</span>
                  <span className="text-xs text-[color:var(--text-secondary)]">{option.helper}</span>
                </div>
                {language === option.value && <Check className="h-4 w-4 text-[color:var(--brand-azure)]" />}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Backdrop to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
