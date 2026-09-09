'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGrowthOverview } from '@/features/growth/hooks/useGrowth';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import {
  useSellerPayoutsQuery,
  useSellerRefundsQuery,
  useSellerRevenueQuery,
} from '@/features/seller-orders/hooks/useSellerOrders';
import {
  IPayoutListRes,
  IRefundListRes,
  IPayoutItem,
  IRefundItem,
  IRevenueRes,
} from '@/features/seller-orders/types/sellerOrderTypes';
import { SellerWalletHeader } from '@/features/seller-wallet/components/SellerWalletHeader';
import { SellerWalletMetrics } from '@/features/seller-wallet/components/SellerWalletMetrics';
import { SellerBankAccountCard } from '@/features/seller-wallet/components/SellerBankAccountCard';
import { SellerPayoutHistoryTable } from '@/features/seller-wallet/components/SellerPayoutHistoryTable';
import { SellerRefundsTable } from '@/features/seller-wallet/components/SellerRefundsTable';
import { DisbursementPolicyModal } from '@/features/seller-wallet/components/DisbursementPolicyModal';
import { Calendar, RotateCcw } from 'lucide-react';

function SellerWalletContent() {
  const searchParams = useSearchParams();
  const initialB2B = searchParams.get('mode') === 'B2B';
  const [isB2B, setIsB2B] = useState<boolean>(initialB2B);
  const [activeTab, setActiveTab] = useState<'PAYOUTS' | 'REFUNDS'>('PAYOUTS');
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);

  // Pagination states
  const [payoutPage, setPayoutPage] = useState<number>(1);
  const [payoutPageSize, setPayoutPageSize] = useState<number>(10);
  const [refundPage, setRefundPage] = useState<number>(1);
  const [refundPageSize, setRefundPageSize] = useState<number>(10);

  const handleToggleB2B = (val: boolean) => {
    setIsB2B(val);
    setPayoutPage(1);
    setRefundPage(1);
  };

  // 1. Fetch wallet overall metrics
  const { data: overviewData, isLoading: isOverviewLoading } = useGrowthOverview();
  const wallet = overviewData?.wallet;

  // 2. Fetch linked bank account
  const { useBankAccountQuery } = useSellerShop();
  const { data: bankData, isLoading: isBankLoading } = useBankAccountQuery();
  const bankAccount = bankData?.data;

  // 3. Fetch monthly revenue
  const { data: revenueData, isLoading: isRevenueLoading } = useSellerRevenueQuery(
    { period: 'month' },
    isB2B,
  );
  const revenue = revenueData?.data as unknown as IRevenueRes;

  // 4. Fetch payouts list
  const { data: payoutsData, isLoading: isPayoutsLoading } = useSellerPayoutsQuery(
    { pageNo: payoutPage, pageSize: payoutPageSize },
    isB2B,
  );
  const payouts = ((payoutsData?.data as unknown as IPayoutListRes)?.content ||
    (payoutsData?.data as unknown as { items?: IPayoutItem[] })?.items ||
    []) as IPayoutItem[];

  const payoutTotalElements =
    (payoutsData?.data as unknown as IPayoutListRes)?.totalElements ??
    (payoutsData?.data as unknown as { totalOrders?: number })?.totalOrders ??
    payouts.length;
  const payoutTotalPages =
    (payoutsData?.data as unknown as IPayoutListRes)?.totalPages ??
    Math.max(1, Math.ceil(payoutTotalElements / payoutPageSize));

  // 5. Fetch refunds list
  const { data: refundsData, isLoading: isRefundsLoading } = useSellerRefundsQuery(
    { pageNo: refundPage, pageSize: refundPageSize },
    isB2B,
  );
  const refunds = ((refundsData?.data as unknown as IRefundListRes)?.content ||
    (refundsData?.data as unknown as { items?: IRefundItem[] })?.items ||
    []) as IRefundItem[];

  const refundTotalElements =
    (refundsData?.data as unknown as IRefundListRes)?.totalElements ?? refunds.length;
  const refundTotalPages =
    (refundsData?.data as unknown as IRefundListRes)?.totalPages ??
    Math.max(1, Math.ceil(refundTotalElements / refundPageSize));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header */}
      <SellerWalletHeader
        isB2B={isB2B}
        onToggleB2B={handleToggleB2B}
        onOpenPolicy={() => setIsPolicyOpen(true)}
      />

      {/* 2. Hero 4-card Balance Metrics */}
      <SellerWalletMetrics
        wallet={wallet}
        revenue={revenue}
        isLoading={isOverviewLoading || isRevenueLoading}
      />

      {/* 3. Bank Account Information / Warning Banner */}
      <SellerBankAccountCard bankAccount={bankAccount} isLoading={isBankLoading} />

      {/* 4. Tab selection: Payouts vs Refunds */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('PAYOUTS')}
          className={`inline-flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'PAYOUTS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Lịch sử các kỳ đối soát & Quyết toán</span>
          {payoutTotalElements > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {payoutTotalElements}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('REFUNDS')}
          className={`inline-flex items-center gap-2 pb-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'REFUNDS'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Khấu trừ & Hoàn tiền</span>
          {refundTotalElements > 0 && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold">
              {refundTotalElements}
            </span>
          )}
        </button>
      </div>

      {/* 5. Tab Content */}
      {activeTab === 'PAYOUTS' ? (
        <SellerPayoutHistoryTable
          payouts={payouts}
          isLoading={isPayoutsLoading}
          currentPage={payoutPage}
          totalPages={payoutTotalPages}
          pageSize={payoutPageSize}
          totalElements={payoutTotalElements}
          onPageChange={setPayoutPage}
          onPageSizeChange={(newSize) => {
            setPayoutPageSize(newSize);
            setPayoutPage(1);
          }}
        />
      ) : (
        <SellerRefundsTable
          refunds={refunds}
          isLoading={isRefundsLoading}
          currentPage={refundPage}
          totalPages={refundTotalPages}
          pageSize={refundPageSize}
          totalElements={refundTotalElements}
          onPageChange={setRefundPage}
          onPageSizeChange={(newSize) => {
            setRefundPageSize(newSize);
            setRefundPage(1);
          }}
        />
      )}

      {/* 6. Policy Modal */}
      <DisbursementPolicyModal isOpen={isPolicyOpen} onClose={() => setIsPolicyOpen(false)} />
    </div>
  );
}

export default function SellerWalletPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 max-w-7xl mx-auto animate-pulse p-4">
          <div className="h-24 bg-gray-100 rounded-3xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-36 bg-gray-100 rounded-3xl" />
            ))}
          </div>
        </div>
      }
    >
      <SellerWalletContent />
    </Suspense>
  );
}
