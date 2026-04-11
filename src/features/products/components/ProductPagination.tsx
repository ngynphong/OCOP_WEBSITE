'use client';

import { Pagination } from '@/components/ui/Pagination';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  return (
    <div className="mt-20">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
