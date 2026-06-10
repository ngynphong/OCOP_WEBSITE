'use client';

import React, { useState } from 'react';
import {
  useAdminOrdersQuery,
  useAdminDashboardQuery,
  useAdminRefundsQuery,
  useAdminOrderMutations,
  useAdminPayoutsQuery,
} from '@/features/admin/hooks/useAdminOrders';
import { AdminOrderTable } from '@/features/admin/components/orders/AdminOrderTable';
import { AdminOrderStats } from '@/features/admin/components/orders/AdminOrderStats';
import { AdminRefundTable } from '@/features/admin/components/orders/AdminRefundTable';
import { AdminPayoutTable } from '@/features/admin/components/payouts/AdminPayoutTable';
import {
  IAdminOrderParams,
  IAdminRefundParams,
  IAdminPayoutParams,
} from '@/features/admin/types/adminTypes';
import { cn } from '@/lib/utils';

const AdminOrdersPage = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'refunds' | 'payouts'>('orders');

  const [orderParams, setOrderParams] = useState<IAdminOrderParams>({
    pageNo: 1,
    pageSize: 10,
    status: undefined,
    keyword: '',
  });

  const [refundParams, setRefundParams] = useState<IAdminRefundParams>({
    pageNo: 1,
    pageSize: 10,
    status: undefined,
  });

  const [payoutParams, setPayoutParams] = useState<IAdminPayoutParams>({
    pageNo: 1,
    pageSize: 10,
    status: undefined,
  });

  const { data: dashboardData, isLoading: isDashboardLoading } = useAdminDashboardQuery();
  const { data: ordersData, isLoading: isOrdersLoading } = useAdminOrdersQuery(orderParams);
  const { data: refundsData, isLoading: isRefundsLoading } = useAdminRefundsQuery(refundParams);
  const { data: payoutsData, isLoading: isPayoutsLoading } = useAdminPayoutsQuery(payoutParams);
  const {
    approveRefund,
    isApprovingRefund,
    processPayout,
    isProcessingPayout,
    generatePayouts,
    isGeneratingPayouts,
  } = useAdminOrderMutations();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-[#00490E] tracking-tight mb-2">
            Quản trị Đơn hàng & Tài chính
          </h2>
          <p className="text-stone-500 font-medium">
            Theo dõi luồng tiền, đơn hàng và xử lý các yêu cầu hoàn tiền toàn hệ thống OCOP.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-stone-100 rounded-xl w-fit border border-stone-200 shadow-inner">
          <button
            onClick={() => setActiveTab('orders')}
            className={cn(
              'px-6 py-2 rounded-xl text-sm font-black transition-all duration-300',
              activeTab === 'orders'
                ? 'bg-white text-[#00490E] shadow-sm'
                : 'text-stone-400 hover:text-stone-600',
            )}
          >
            Đơn hàng
          </button>
          <button
            onClick={() => setActiveTab('refunds')}
            className={cn(
              'px-6 py-2 rounded-xl text-sm font-black transition-all duration-300',
              activeTab === 'refunds'
                ? 'bg-white text-rose-600 shadow-sm'
                : 'text-stone-400 hover:text-stone-600',
            )}
          >
            Hoàn tiền
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={cn(
              'px-6 py-2 rounded-xl text-sm font-black transition-all duration-300',
              activeTab === 'payouts'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-stone-400 hover:text-stone-600',
            )}
          >
            Đối soát
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <AdminOrderStats data={dashboardData?.data} isLoading={isDashboardLoading} />

      {/* Content Section */}
      {activeTab === 'orders' && (
        <AdminOrderTable
          orders={ordersData?.data?.content || []}
          isLoading={isOrdersLoading}
          totalPage={ordersData?.data?.totalPages || 0}
          totalElement={ordersData?.data?.totalElements || 0}
          params={orderParams}
          setParams={setOrderParams}
        />
      )}

      {activeTab === 'refunds' && (
        <AdminRefundTable
          refunds={refundsData?.data?.content || []}
          isLoading={isRefundsLoading}
          totalPage={refundsData?.data?.totalPages || 0}
          totalElement={refundsData?.data?.totalElements || 0}
          params={refundParams}
          setParams={setRefundParams}
          onApproveRefund={approveRefund}
          isApproving={isApprovingRefund}
        />
      )}

      {activeTab === 'payouts' && (
        <AdminPayoutTable
          payouts={payoutsData?.data?.content || []}
          isLoading={isPayoutsLoading}
          totalPage={payoutsData?.data?.totalPages || 0}
          totalElement={payoutsData?.data?.totalElements || 0}
          params={payoutParams}
          setParams={setPayoutParams}
          onProcessPayout={processPayout}
          isProcessing={isProcessingPayout}
          onGeneratePayouts={generatePayouts}
          isGenerating={isGeneratingPayouts}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
