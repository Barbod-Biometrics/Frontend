"use client";

import { Button } from "../../../components/ui/Button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        نمایش {startItem} تا {endItem} از {totalItems} مورد
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNumber: number;
            
          
            if (totalPages <= 5) {
              pageNumber = i + 1;
            } else if (currentPage <= 3) {
              pageNumber = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + i;
            } else {
              pageNumber = currentPage - 2 + i;
            }
            
            return (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNumber)}
                className="h-8 w-8"
              >
                {pageNumber}
              </Button>
            );
          })}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}