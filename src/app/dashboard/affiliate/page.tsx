'use client';

import React, { useState, useEffect } from 'react';
import { UserAffiliateOverview } from '@/features/affiliate/components/UserAffiliateOverview';
import { UserWithdrawalList } from '@/features/affiliate/components/UserWithdrawalList';
import { UserCommissionList } from '@/features/affiliate/components/UserCommissionList';
import { WithdrawalRequestModal } from '@/features/affiliate/components/WithdrawalRequestModal';
import { useAffiliateAccount, useUserWithdrawals } from '@/features/affiliate/hooks/useAffiliate';
import { Button } from '@/components/ui/AppButton';
import { FiPlus, FiRefreshCcw, FiList, FiDollarSign } from 'react-icons/fi';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { cn } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';

export default function UserAffiliatePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'commissions' | 'withdrawals'>('commissions');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { account, isLoadingAccount, refetchAccount } = useAffiliateAccount();

  const { withdrawals, pagination, isLoadingWithdrawals, refetchWithdrawals } = useUserWithdrawals({
    pageNo: page,
    pageSize: pageSize,
  });

  const handleRefresh = () => {
    refetchAccount();
    refetchWithdrawals();
  };

  if (!isMounted) return <LoadingOverlay />;

  if (isLoadingAccount || (activeTab === 'withdrawals' && isLoadingWithdrawals)) {
    return <LoadingOverlay />;
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-stone-100 shadow-xl">
        <p className="text-stone-500 font-medium">Bạn chưa đăng ký chương trình Affiliate.</p>
        <Button variant="primary" className="mt-4 rounded-xl">
          Đăng ký ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 tracking-tight">Tiếp thị liên kết</h1>
          <p className="text-stone-500 mt-1">Quản lý thu nhập và giới thiệu sản phẩm của bạn.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="rounded-xl w-12 h-12 p-0 flex items-center justify-center border-stone-200"
          >
            <FiRefreshCcw className="text-stone-500" />
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl flex items-center gap-2 px-6 h-12 shadow-lg shadow-emerald-500/25"
          >
            <FiPlus />
            Rút tiền ngay
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <UserAffiliateOverview account={account} />

      {/* Main Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 p-1.5 bg-stone-100 w-fit rounded-xl">
          <button
            onClick={() => setActiveTab('commissions')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all',
              activeTab === 'commissions'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-700',
            )}
          >
            <FiList />
            Lịch sử Hoa hồng
          </button>
          <button
            onClick={() => setActiveTab('withdrawals')}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all',
              activeTab === 'withdrawals'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-stone-500 hover:text-stone-700',
            )}
          >
            <FiDollarSign />
            Lịch sử Rút tiền
          </button>
        </div>

        {activeTab === 'commissions' ? (
          <UserCommissionList />
        ) : (
          <div className="space-y-6">
            <UserWithdrawalList withdrawals={withdrawals} />

            {pagination.totalPages > 1 && (
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <Pagination
                  currentPage={page}
                  totalPages={pagination.totalPages}
                  pageSize={pageSize}
                  totalElements={pagination.totalElements}
                  onPageChange={setPage}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      <WithdrawalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={account.availableBalance}
      />
    </div>
  );
}
