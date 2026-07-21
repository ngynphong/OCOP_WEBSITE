'use client';

import React, { Suspense } from 'react';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { PackageX, LifeBuoy, Plus } from 'lucide-react';
import { OrderCardSkeleton } from '@/features/orders/components/OrderCardSkeleton';
import { Button } from '@/components/ui/AppButton';
import { IOrderItemList } from '@/features/orders/types/orderTypes';
import { useInfiniteOrders } from '@/features/orders/hooks/useOrders';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

const STATUS_TABS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'PENDING_CONFIRM', label: 'Chờ xác nhận' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'SHIPPED', label: 'Đang giao' },
  { value: 'DELIVERED', label: 'Đã giao' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

function OrderListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentStatus = searchParams.get('status') || 'ALL';
  const currentType = searchParams.get('type') || 'retail';
  const isB2B = currentType === 'b2b';

  const handleTabChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', status);
    }
    router.push(`/dashboard/don-hang?${params.toString()}`);
  };

  const handleTypeChange = (type: 'retail' | 'b2b') => {
    const params = new URLSearchParams();
    if (type === 'b2b') {
      params.set('type', 'b2b');
    }
    router.push(`/dashboard/don-hang?${params.toString()}`);
  };

  const statusParam = currentStatus === 'ALL' ? undefined : currentStatus;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteOrders(
      {
        status: statusParam,
        pageSize: 10,
      },
      isB2B,
    );

  const orders =
    data?.pages.flatMap((page) => {
      if (!page?.data) return [];
      const d = page.data as unknown as Record<string, unknown> | unknown[];
      if (Array.isArray(d)) return d;
      if (d && typeof d === 'object') {
        const obj = d as Record<string, unknown>;
        if (Array.isArray(obj.content)) return obj.content;
        if (Array.isArray(obj.items)) return obj.items;
      }
      return [];
    }) || [];

  return (
    <div className="space-y-6">
      {/* Switcher Mua lẻ / Mua sỉ B2B */}
      <div className="flex gap-4 p-1.5 bg-stone-100/80 border border-stone-200/50 rounded-xl w-fit">
        <button
          onClick={() => handleTypeChange('retail')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            !isB2B ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Đơn mua lẻ
        </button>
        <button
          onClick={() => handleTypeChange('b2b')}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            isB2B
              ? 'bg-green-700 text-white shadow-md shadow-green-700/10'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          Đơn mua sỉ B2B
        </button>
      </div>

      <div className="mb-6 border-b border-stone-200">
        <ul className="flex flex-nowrap overflow-x-auto gap-6 -mb-px px-2 no-scrollbar">
          {STATUS_TABS.map((tab) => (
            <li key={tab.value} className="shrink-0">
              <button
                onClick={() => handleTabChange(tab.value)}
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

      {isLoading ? (
        <div className="space-y-6">
          <OrderCardSkeleton />
          <OrderCardSkeleton />
          <OrderCardSkeleton />
        </div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500 font-bold p-10 bg-red-50 rounded-xl border border-red-100">
          <LifeBuoy className="mx-auto mb-4 text-red-400" size={40} />
          Đã có lỗi xảy ra khi tải dữ liệu đơn hàng. Vui lòng thử lại.
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: IOrderItemList, idx: number) => (
            <OrderCard key={`${order.id}-${idx}`} order={order} isB2B={isB2B} />
          ))}

          {/* Load more trigger - Switched to Button for stability */}
          <div className="py-12 flex flex-col items-center gap-4">
            {hasNextPage ? (
              <Button
                variant="outline"
                size="lg"
                onClick={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
                className="min-w-[200px] rounded-xl border-2 border-stone-200 hover:border-green-600 hover:text-green-700 font-black tracking-widest uppercase text-xs transition-all shadow-sm"
              >
                <Plus className="mr-2" size={16} />
                Xem thêm đơn hàng
              </Button>
            ) : (
              orders.length > 0 && (
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-stone-50 px-6 py-3 rounded-full border border-stone-100 shadow-inner">
                  ✨ Bạn đã xem hết danh sách đơn hàng
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-stone-50 rounded-xl border border-stone-100">
          <div className="w-24 h-24 bg-stone-200/50 rounded-full flex items-center justify-center mb-6">
            <PackageX className="w-12 h-12 text-stone-400" />
          </div>
          <h3 className="text-xl font-bold text-stone-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-stone-500 max-w-sm mx-auto mb-8">
            Có vẻ như bạn chưa đặt đơn hàng nào cho trạng thái này. Khám phá các sản phẩm OCOP ngay
            nhé!
          </p>
          <Button onClick={() => router.push('/san-pham')}>Khám phá sản phẩm</Button>
        </div>
      )}
    </div>
  );
}

export default function OrderListPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <div>
        <h1 className="text-2xl font-bold text-stone-900 mb-6">Đơn hàng của tôi</h1>
        <OrderListContent />
      </div>
    </Suspense>
  );
}
