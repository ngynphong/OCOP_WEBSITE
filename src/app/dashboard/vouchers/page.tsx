'use client';

import React, { useState } from 'react';
import { Plus, Ticket, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import {
  useSellerVouchers,
  useSellerVoucherMutations,
} from '@/features/vouchers/hooks/useVouchers';
import { VoucherList } from '@/features/vouchers/components/VoucherList';
import { VoucherFormDrawer } from '@/features/vouchers/components/VoucherFormDrawer';
import { Voucher, VoucherFormValues } from '@/features/vouchers/types';
import { Pagination } from '@/components/ui/Pagination';

export default function SellerVouchersPage() {
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);

  const { data: voucherRes, isLoading } = useSellerVouchers(page);
  const { createVoucher, updateVoucher } = useSellerVoucherMutations();

  const voucherData = voucherRes?.data;

  const handleOpenCreate = () => {
    setEditingVoucher(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    setIsDrawerOpen(true);
  };

  const handleSubmit = (data: VoucherFormValues) => {
    if (editingVoucher) {
      updateVoucher.mutate(
        { id: editingVoucher.id, data },
        { onSuccess: () => setIsDrawerOpen(false) },
      );
    } else {
      createVoucher.mutate(data, {
        onSuccess: () => setIsDrawerOpen(false),
      });
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm shadow-stone-200/50">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
            <Ticket size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Mã giảm giá</h1>
            <p className="text-stone-500 font-medium mt-1">
              Quản lý các chương trình ưu đãi cho gian hàng của bạn
            </p>
          </div>
        </div>
        <Button
          onClick={handleOpenCreate}
          variant="primary"
          leftIcon={<Plus size={20} />}
          className="rounded-2xl px-8 py-7 shadow-lg shadow-emerald-500/20"
        >
          Tạo Voucher mới
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full flex items-center gap-3 bg-white border border-stone-100 rounded-2xl px-5 py-3.5 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all">
          <Search size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên voucher..."
            className="flex-1 bg-transparent outline-none text-stone-800 font-medium placeholder:text-stone-300"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white border border-stone-100 rounded-2xl px-5 py-3.5">
            <Filter size={18} className="text-stone-400" />
            <select className="bg-transparent outline-none text-sm font-bold text-stone-800 pr-2">
              <option>Tất cả trạng thái</option>
              <option>Đang hoạt động</option>
              <option>Đã tạm dừng</option>
              <option>Đã hết hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="min-h-[400px]">
        <VoucherList
          vouchers={voucherData?.content || []}
          onEdit={handleOpenEdit}
          isLoading={isLoading}
        />

        {/* Pagination Integration */}
        {voucherData && voucherData.totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={page + 1}
              totalPages={voucherData.totalPages}
              onPageChange={(p) => setPage(p - 1)}
            />
          </div>
        )}
      </div>

      {/* Form Drawer */}
      <VoucherFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingVoucher}
        isLoading={createVoucher.isPending || updateVoucher.isPending}
      />
    </div>
  );
}
