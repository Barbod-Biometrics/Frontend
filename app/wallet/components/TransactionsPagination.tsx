
"use client";

import React from 'react';
import { Typography } from '../../../components/ui/Typography';
import { Button } from '../../../components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Language } from '../../../types';

interface TransactionsPaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  language: Language;
}

export default function TransactionsPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange,
  onPrevPage,
  onNextPage,
  language
}: TransactionsPaginationProps) {
  const translations = {
    previous: {
      en: 'Previous',
      fa: 'قبلی'
    },
    next: {
      en: 'Next',
      fa: 'بعدی'
    },
    page: {
      en: 'Page',
      fa: 'صفحه'
    },
    of: {
      en: 'of',
      fa: 'از'
    },
    showing: {
      en: 'Showing',
      fa: 'نمایش'
    },
    to: {
      en: '-',
      fa: '-'
    },
    ofItems: {
      en: 'of',
      fa: 'از'
    },
    items: {
      en: 'items',
      fa: 'مورد'
    }
  };

  return (
    <div className="p-6 border-t border-[color:var(--md-sys-color-outline-variant)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Showing info */}
        <div>
          <Typography variant="body-sm" className="text-muted">
            {translations.showing[language]} {startIndex + 1} {translations.to[language]} {Math.min(endIndex, totalItems)} {translations.ofItems[language]} {totalItems} {translations.items[language]}
          </Typography>
        </div>
        
        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <Button
            variant="ghost"
            size="sm"
            iconLeading={language === Language.FA ? undefined : <ChevronLeft className="w-4 h-4" />}
            onClick={onPrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            {language === Language.FA ? (
              <>
                <ChevronRight className="w-4 h-4" />
                {translations.previous[language]}
              </>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                {translations.previous[language]}
              </>
            )}
          </Button>
          
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show limited page numbers
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "primary" : "ghost"}
                    size="icon"
                    className="w-10 h-10"
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              } else if (
                (pageNumber === currentPage - 2 && currentPage > 3) ||
                (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
              ) {
                return (
                  <span key={pageNumber} className="px-2 text-muted">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          {/* Next button */}
          <Button
            variant="ghost"
            size="sm"
            iconTrailing={language === Language.FA ? undefined : <ChevronRight className="w-4 h-4" />}
            onClick={onNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            {language === Language.FA ? (
              <>
                {translations.next[language]}
                <ChevronLeft className="w-4 h-4" />
              </>
            ) : (
              <>
                {translations.next[language]}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        
        {/* Page info */}
        <div>
          <Typography variant="body-sm" className="text-muted">
            {translations.page[language]} {currentPage} {translations.of[language]} {totalPages}
          </Typography>
        </div>
      </div>
    </div>
  );
}