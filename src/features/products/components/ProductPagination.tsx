'use client';

import { useState } from 'react';
import { Pagination } from '@/components/ui/Pagination';

export function ProductPagination() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  return (
    <div className="mt-20">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
