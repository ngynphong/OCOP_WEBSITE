'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Ticket, Search, Filter, RefreshCw, ChevronRight, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import {
  useSellerVouchers,
  useSellerVoucherMutations,
  useSavedVouchers,
} from '@/features/vouchers/hooks/useVouchers';
import { VoucherList } from '@/features/vouchers/components/VoucherList';
import { VoucherFormDrawer } from '@/features/vouchers/components/VoucherFormDrawer';
import { Voucher, VoucherFormValues } from '@/features/vouchers/types';
import { Pagination } from '@/components/ui/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

export default function VoucherDashboardPage() {
  const [page, setPage] = useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const { dashboardMode } = useAppSelector((state) => state.auth);
  const isSeller = dashboardMode === 'SELLER';

  useEffect(() => {
    // A small timeout to ensure the role and profile are fully synced from store (Standard Pattern)
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // API Hooks based on mode
  const sellerVouchers = useSellerVouchers(page, 10);
  const savedVouchers = useSavedVouchers(page, 10);

  const {
    data: voucherRes,
    isLoading,
    refetch,
    isFetching,
  } = isSeller ? sellerVouchers : savedVouchers;
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

  if (!isMounted) return null;

  return (
    <div className="p-6 md:p-10 space-y-10 min-h-screen bg-stone-50/30">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-linear-to-br from-green-50 to-white p-10 rounded-[40px] border border-green-100/50 shadow-xl shadow-green-900/5"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center text-emerald-600 shadow-lg shadow-green-900/5 border border-green-50">
              {isSeller ? (
                <Ticket size={40} className="text-emerald-600" />
              ) : (
                <Wallet size={40} className="text-amber-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-green-900 tracking-tighter uppercase">
                  {isSeller ? 'Quản lý Voucher' : 'Ví Voucher của tôi'}
                </h1>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                  {isSeller ? 'Seller Center' : 'Hội viên OCOP'}
                </span>
              </div>
              <p className="text-green-800/60 font-medium mt-2 max-w-md">
                {isSeller
                  ? 'Tạo và quản lý các chương trình khuyến mãi để thúc đẩy doanh số bán hàng của bạn.'
                  : 'Sử dụng các mã giảm giá bạn đã lưu để tiết kiệm chi phí khi mua sắm đặc sản Việt.'}
              </p>
            </div>
          </div>

          {isSeller && (
            <Button
              onClick={handleOpenCreate}
              variant="primary"
              leftIcon={<Plus size={24} />}
              className="rounded-[24px] px-10 py-8 shadow-2xl shadow-emerald-500/30 text-base h-16"
            >
              Tạo Voucher mới
            </Button>
          )}
        </div>
      </motion.div>

      {/* Modern Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 relative group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Search
              size={20}
              className="text-stone-400 group-focus-within:text-emerald-500 transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder={
              isSeller ? 'Tìm kiếm mã hoặc tên voucher...' : 'Tìm kiếm voucher trong ví...'
            }
            className="w-full bg-white border border-stone-200 rounded-3xl pl-16 pr-6 py-5 outline-none text-stone-800 font-bold placeholder:text-stone-300 focus:border-emerald-500/50 focus:ring-8 focus:ring-emerald-500/5 transition-all shadow-sm shadow-stone-200/50"
          />
        </div>
        <div className="lg:col-span-5 flex items-center gap-4">
          <div className="flex-1 flex items-center gap-4 bg-white border border-stone-200 rounded-3xl px-6 py-5 shadow-sm shadow-stone-200/50">
            <Filter size={20} className="text-stone-400" />
            <select className="flex-1 bg-transparent outline-none text-sm font-black text-stone-800 appearance-none cursor-pointer">
              <option>Tất cả trạng thái</option>
              <option>Có thể sử dụng</option>
              <option>Đã sử dụng</option>
              <option>Đã hết hạn</option>
            </select>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-5 bg-white border border-stone-200 rounded-3xl text-stone-500 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm shadow-stone-200/50 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={22} className={isFetching ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Voucher List Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${dashboardMode}-${page}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[500px]"
        >
          <VoucherList
            vouchers={(voucherData?.content as Voucher[]) || []}
            onEdit={isSeller ? handleOpenEdit : () => {}}
            isLoading={isLoading}
            hideActions={!isSeller}
          />

          {/* Luxury Pagination */}
          {voucherData && voucherData.totalPages > 1 && (
            <div className="mt-16 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                Trang {page} / {voucherData.totalPages}
                <ChevronRight size={12} className="text-stone-300" />
              </div>
              <Pagination
                currentPage={page}
                totalPages={voucherData.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Form Drawer */}
      {isSeller && (
        <VoucherFormDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          onSubmit={handleSubmit}
          initialData={editingVoucher}
          isLoading={createVoucher.isPending || updateVoucher.isPending}
        />
      )}
    </div>
  );
}
