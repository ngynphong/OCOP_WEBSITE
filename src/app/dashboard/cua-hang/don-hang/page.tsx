'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, PackageX, TrendingUp, DollarSign, RotateCcw } from 'lucide-react';
import {
  useSellerOrdersQuery,
  useSellerRevenueQuery,
  useSellerRefundsQuery,
  useSellerPayoutsQuery,
} from '@/features/seller-orders/hooks/useSellerOrders';
import { SellerOrderCard } from '@/features/seller-orders/components/SellerOrderCard';
import { formatCurrencyVND } from '@/utils/format';
import {
  RefundsTable,
  PayoutsTable,
} from '@/features/seller-orders/components/SellerFinanceTables';
import { ISellerOrderItem } from '@/features/seller-orders/types/sellerOrderTypes';

const STATUS_TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING_CONFIRM', label: 'Cần Duyệt' },
  { value: 'PROCESSING', label: 'Đang Xử Lý' },
  { value: 'SHIPPED', label: 'Đang Giao' },
  { value: 'DELIVERED', label: 'Đã Giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

function RevenueSummary() {
  const { data, isLoading } = useSellerRevenueQuery({ period: 'month' });
  const rev = data?.data;

  if (isLoading) return <div className="h-24 animate-pulse bg-stone-100 rounded-3xl" />;
  if (!rev) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-green-50 rounded-3xl p-6 border border-green-100">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <TrendingUp size={18} /> <span className="font-bold text-sm">Doanh thu gộp (Tháng)</span>
        </div>
        <p className="text-3xl font-black text-green-800">{formatCurrencyVND(rev.grossRevenue)}</p>
        <p className="text-sm text-green-600 mt-2 font-medium">{rev.totalOrders} đơn hàng</p>
      </div>
      <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
        <div className="flex items-center gap-2 text-stone-500 mb-2">
          <DollarSign size={18} /> <span className="font-bold text-sm">Số dư nhận thực (Net)</span>
        </div>
        <p className="text-3xl font-black text-stone-900">{formatCurrencyVND(rev.netRevenue)}</p>
        <p className="text-sm text-stone-400 mt-2 font-medium">
          Chiết khấu sàn: -{formatCurrencyVND(rev.commissionFee)}
        </p>
      </div>
      <div className="bg-red-50 rounded-3xl p-6 border border-red-100">
        <div className="flex items-center gap-2 text-red-700 mb-2">
          <RotateCcw size={18} /> <span className="font-bold text-sm">Tỉ lệ hoàn trả</span>
        </div>
        <p className="text-3xl font-black text-red-800">{rev.refundedOrders}</p>
        <p className="text-sm text-red-600 mt-2 font-medium">Đơn bị hoàn/hủy</p>
      </div>
    </div>
  );
}

function OrdersManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Tabs lớn: Orders | Refunds | Payouts
  const [activeMainTab, setActiveMainTab] = useState<'orders' | 'refunds' | 'payouts'>('orders');

  // Quản lý status Orders
  const currentStatus = searchParams.get('status') || 'ALL';
  const pageNo = parseInt(searchParams.get('page') || '1');

  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useSellerOrdersQuery({
    status: currentStatus === 'ALL' ? undefined : currentStatus,
    pageNo,
    pageSize: 10,
  });

  const { data: refundsData, isLoading: isRefundsLoading } = useSellerRefundsQuery({
    pageNo,
    pageSize: 10,
  });
  const { data: payoutsData, isLoading: isPayoutsLoading } = useSellerPayoutsQuery({
    pageNo,
    pageSize: 10,
  });

  const orders = ordersData?.data?.content || [];
  const refunds = refundsData?.data?.content || [];
  const payouts = payoutsData?.data?.content || [];

  const handleStatusChange = (status: string) => {
    if (status === 'ALL') {
      router.push('/dashboard/cua-hang/don-hang');
    } else {
      router.push(`/dashboard/cua-hang/don-hang?status=${status}`);
    }
  };

  return (
    <div className="space-y-6">
      <RevenueSummary />

      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">
        {/* Main Tabs */}
        <div className="border-b border-stone-100 bg-stone-50 flex px-2 pt-2">
          <button
            onClick={() => setActiveMainTab('orders')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-colors ${activeMainTab === 'orders' ? 'bg-white text-green-700 border-t border-x border-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Quản lý Đơn hàng
          </button>
          <button
            onClick={() => setActiveMainTab('refunds')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-colors ${activeMainTab === 'refunds' ? 'bg-white text-green-700 border-t border-x border-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Hoàn Tiền / Trả Hàng
          </button>
          <button
            onClick={() => setActiveMainTab('payouts')}
            className={`px-6 py-3 font-bold text-sm rounded-t-xl transition-colors ${activeMainTab === 'payouts' ? 'bg-white text-green-700 border-t border-x border-stone-100 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            Quyết Toán (Payouts)
          </button>
        </div>

        <div className="p-6">
          {activeMainTab === 'orders' && (
            <>
              {/* Filter Trạng thái của Orders */}
              <div className="mb-6 border-b border-stone-100">
                <ul className="flex flex-nowrap overflow-x-auto gap-6 -mb-px px-2 no-scrollbar">
                  {STATUS_TABS.map((tab) => (
                    <li key={tab.value} className="shrink-0">
                      <button
                        onClick={() => handleStatusChange(tab.value)}
                        className={`pb-4 text-sm font-bold transition-colors border-b-2 whitespace-nowrap ${
                          currentStatus === tab.value
                            ? 'border-green-600 text-green-700'
                            : 'border-transparent text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {isOrdersLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
                </div>
              ) : isOrdersError ? (
                <div className="text-center py-20 text-red-500">
                  Đã có lỗi xảy ra khi tải dữ liệu đơn hàng.
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order: ISellerOrderItem) => (
                    <SellerOrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-stone-50 rounded-2xl border border-stone-100">
                  <PackageX className="w-12 h-12 text-stone-300 mb-4" />
                  <h3 className="text-lg font-bold text-stone-800 mb-1">Không có đơn hàng nào</h3>
                  <p className="text-stone-500 max-w-sm">
                    Hiện tại chưa có dữ liệu giao dịch nào thỏa mãn trạng thái tìm kiếm này.
                  </p>
                </div>
              )}
            </>
          )}

          {activeMainTab === 'refunds' && (
            <RefundsTable refunds={refunds} isLoading={isRefundsLoading} />
          )}
          {activeMainTab === 'payouts' && (
            <PayoutsTable payouts={payouts} isLoading={isPayoutsLoading} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 flex justify-center">
          <Loader2 className="animate-spin text-green-600" />
        </div>
      }
    >
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-6">Quản trị Đơn Hàng & Doanh Thu</h1>
        <OrdersManagementContent />
      </div>
    </Suspense>
  );
}
