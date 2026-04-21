'use client';

import React from 'react';
import { MyComplaintsTable } from '@/features/complaints/components/MyComplaintsTable';
import { useMyComplaints } from '@/features/complaints/hooks/useComplaints';
import { Pagination } from '@/components/ui/Pagination';

export default function UserComplaintsPage() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const { data, isLoading } = useMyComplaints({
    pageNo: page,
    pageSize: pageSize,
  });

  const complaints = data?.data?.content || [];
  const pagination = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Khiếu nại của tôi</h1>
        <p className="text-sm text-stone-500 mt-1">
          Xem và theo dõi trạng thái các khiếu nại của bạn gửi tới OCOP hoặc các cửa hàng.
        </p>
      </div>

      <MyComplaintsTable complaints={complaints} isLoading={isLoading} />

      {pagination && pagination.totalPages > 0 && (
        <div className="mt-8 bg-white p-4 rounded-3xl border border-stone-100 shadow-sm">
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages}
            pageSize={pageSize}
            totalElements={pagination.totalElements}
            onPageChange={setPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
