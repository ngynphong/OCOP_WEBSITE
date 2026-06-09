'use client';

import React, { useState } from 'react';
import { Ticket } from 'lucide-react';
import { useAdminVouchers, useAdminVoucherMutations } from '@/features/vouchers/hooks/useVouchers';
import { VoucherList } from '@/features/vouchers/components/VoucherList';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/AppButton';
import { IoTicket } from 'react-icons/io5';
import { VoucherFormDrawer } from '@/features/vouchers/components/VoucherFormDrawer';
import { VoucherFormValues } from '@/features/vouchers/types';

export default function AdminVouchersPage() {
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: voucherRes, isLoading } = useAdminVouchers(page);
  const { createVoucher } = useAdminVoucherMutations();
  const voucherData = voucherRes?.data;

  const handleSubmit = (data: VoucherFormValues) => {
    createVoucher.mutate(data, {
      onSuccess: () => setIsDrawerOpen(false),
    });
  };

  return (
    <div className="p-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-green-700 text-white p-8 rounded-xl shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center text-white">
            <IoTicket size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Hệ thống Voucher</h1>
            <p className="text-stone-300 font-medium mt-1">
              Giám sát và quản lý toàn bộ mã giảm giá trên nền tảng OCOP
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => setIsDrawerOpen(true)}
            variant="primary"
            className="rounded-xl bg-white text-white hover:bg-stone-100 border-none px-8 py-7 shadow-lg shadow-black/10"
          >
            Tạo Voucher hệ thống
          </Button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
            Tổng số Voucher
          </p>
          <p className="text-3xl font-black text-stone-900">{voucherData?.totalElements || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
            Đang hoạt động
          </p>
          <p className="text-3xl font-black text-emerald-600">
            {voucherData?.content?.filter((v) => v.status === 'ACTIVE').length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
            Lượt sử dụng toàn sàn
          </p>
          <p className="text-3xl font-black text-stone-900">--</p>
        </div>
      </div>

      <div className="h-px bg-stone-100" />

      {/* Main List */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Ticket className="text-stone-400" size={20} />
          <h2 className="text-xl font-black text-stone-800">Danh sách Voucher hệ thống</h2>
        </div>

        <VoucherList
          vouchers={voucherData?.content || []}
          onEdit={() => {}} // Admin có thể chỉ xem hoặc edit sau
          isLoading={isLoading}
        />

        {voucherData && voucherData.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={voucherData.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Form Drawer */}
      <VoucherFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        isLoading={createVoucher.isPending}
      />
    </div>
  );
}
