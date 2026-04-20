'use client';

import React, { useState, useEffect } from 'react';
import { UserAffiliateOverview } from '@/features/affiliate/components/UserAffiliateOverview';
import { UserWithdrawalList } from '@/features/affiliate/components/UserWithdrawalList';
import { WithdrawalRequestModal } from '@/features/affiliate/components/WithdrawalRequestModal';
import { useAffiliateAccount, useUserWithdrawals } from '@/features/affiliate/hooks/useAffiliate';
import { Button } from '@/components/ui/AppButton';
import { FiPlus, FiRefreshCcw } from 'react-icons/fi';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

export default function UserAffiliatePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { account, isLoadingAccount, refetchAccount } = useAffiliateAccount();

  const { withdrawals, isLoadingWithdrawals, refetchWithdrawals } = useUserWithdrawals({
    pageNo: 1,
    pageSize: 20,
  });

  const handleRefresh = () => {
    refetchAccount();
    refetchWithdrawals();
  };

  if (!isMounted) return <LoadingOverlay />;

  if (isLoadingAccount || isLoadingWithdrawals) {
    return <LoadingOverlay />;
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-100 shadow-xl">
        <p className="text-stone-500 font-medium">Bạn chưa đăng ký chương trình Affiliate.</p>
        <Button variant="primary" className="mt-4 rounded-2xl">
          Đăng ký ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
            className="rounded-2xl w-12 h-12 p-0 flex items-center justify-center border-stone-200"
          >
            <FiRefreshCcw className="text-stone-500" />
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            className="rounded-2xl flex items-center gap-2 px-6 h-12 shadow-lg shadow-emerald-500/25"
          >
            <FiPlus />
            Rút tiền ngay
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <UserAffiliateOverview account={account} />

      {/* History Table */}
      <UserWithdrawalList withdrawals={withdrawals} />

      {/* Request Modal */}
      <WithdrawalRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        availableBalance={account.availableBalance}
      />
    </div>
  );
}
