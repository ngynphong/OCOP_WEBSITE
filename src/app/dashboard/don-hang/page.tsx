'use client';

import React, { Suspense } from 'react';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, PackageX, LifeBuoy } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { IOrderItemList } from '@/features/orders/types/orderTypes';
import { useInView } from 'react-intersection-observer';
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
  const { ref, inView } = useInView();

  const handleTabChange = (status: string) => {
    if (status === 'ALL') {
      router.push('/dashboard/don-hang');
    } else {
      router.push(`/dashboard/don-hang?status=${status}`);
    }
  };

  const statusParam = currentStatus === 'ALL' ? undefined : currentStatus;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteOrders({
      status: statusParam,
      pageSize: 10,
    });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const orders = data?.pages.flatMap((page) => page.data.content) || [];

  return (
    <div className="space-y-6">
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
        <div className="flex justify-center text-gray-700 py-20">Đang tải...</div>
      ) : isError ? (
        <div className="text-center py-20 text-red-500 font-bold p-10 bg-red-50 rounded-3xl border border-red-100">
          <LifeBuoy className="mx-auto mb-4 text-red-400" size={40} />
          Đã có lỗi xảy ra khi tải dữ liệu đơn hàng. Vui lòng thử lại.
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: IOrderItemList, idx: number) => (
            <OrderCard key={`${order.id}-${idx}`} order={order} />
          ))}

          {/* Load more trigger */}
          <div ref={ref} className="py-8 flex justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
                <Loader2 className="animate-spin" size={16} />
                Đang tải thêm...
              </div>
            ) : hasNextPage ? (
              <div className="h-4" />
            ) : (
              <div className="text-[10px] font-black text-stone-300 uppercase tracking-widest bg-stone-50 px-4 py-2 rounded-full border border-stone-100">
                Bạn đã xem hết danh sách
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-stone-50 rounded-3xl border border-stone-100">
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
