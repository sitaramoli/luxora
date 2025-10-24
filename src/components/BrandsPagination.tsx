'use client';

import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BrandsPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

const BrandsPagination: React.FC<BrandsPaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}) => {
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis');
      }

      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page (if it's different from first page)
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page: number, event: React.MouseEvent) => {
    event.preventDefault();
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handlePreviousClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (hasPrevious) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (hasNext) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious 
              href="#"
              onClick={handlePreviousClick}
              className={!hasPrevious ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {generatePageNumbers().map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => handlePageClick(pageNum as number, e)}
                  isActive={pageNum === currentPage}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={handleNextClick}
              className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default BrandsPagination;