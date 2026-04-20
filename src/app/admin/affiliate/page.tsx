'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AdminWithdrawalManager } from '@/features/affiliate/components/AdminWithdrawalManager';
import { ProcessWithdrawalModal } from '@/features/affiliate/components/ProcessWithdrawalModal';
import { useAdminAffiliate } from '@/features/affiliate/hooks/useAffiliate';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { FiRefreshCcw, FiExternalLink } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';

export default function AdminAffiliatePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { withdrawals, isLoading, refetch } = useAdminAffiliate({ pageNo: 1, pageSize: 50 });

  const handleProcess = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const stats = useMemo(() => {
    const total = withdrawals.length;
    const pending = withdrawals.filter((w) => w.status === 'PENDING').length;
    const approved = withdrawals.filter((w) => w.status === 'APPROVED').length;
    const completionRate = total > 0 ? Math.round(((total - pending) / total) * 100) : 0;

    return { pending, approved, completionRate };
  }, [withdrawals]);

  if (!isMounted) return <LoadingOverlay />;

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-emerald-950 tracking-tight">
            Kiểm duyệt Affiliate
          </h1>
          <p className="text-emerald-900/40 text-sm font-medium mt-1 uppercase tracking-widest">
            Quản trị & Thanh toán hoa hồng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="rounded-2xl w-12 h-12 p-0 flex items-center justify-center bg-white border-stone-200 shadow-sm"
          >
            <FiRefreshCcw className="text-stone-500" />
          </Button>
          <Button
            variant="primary"
            className="rounded-2xl flex items-center gap-2 px-6 h-12 bg-emerald-700 hover:bg-emerald-800 shadow-xl shadow-emerald-900/20"
          >
            <FiExternalLink />
            Xuất báo cáo tài chính
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <AdminWithdrawalManager
        withdrawals={withdrawals}
        onProcess={handleProcess}
        filter={filter}
        onFilterChange={setFilter}
      />

      {/* Footer Stats / Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white backdrop-blur-md p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
            Tổng yêu cầu chờ
          </p>
          <p className="text-2xl font-black text-emerald-900">{stats.pending}</p>
        </div>
        <div className="bg-white backdrop-blur-md p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
            Số lượng đã duyệt
          </p>
          <p className="text-2xl font-black text-emerald-800">{stats.approved}</p>
        </div>
        <div className="bg-white backdrop-blur-md p-6 rounded-3xl border border-stone-100 shadow-sm">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
            Tỉ lệ hoàn thành
          </p>
          <p className="text-2xl font-black text-blue-900">{stats.completionRate}%</p>
        </div>
      </div>

      {/* Process Modal */}
      <ProcessWithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        withdrawalId={selectedId}
      />
    </div>
  );
}
