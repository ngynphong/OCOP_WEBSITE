'use client';

import React from 'react';
import Image from 'next/image';
import { formatCurrencyVND, formatDate } from '@/utils/format';
import { IAdminOrderListItem, IAdminOrderParams } from '@/features/admin/types/adminTypes';
import { Pagination } from '@/components/ui/Pagination';
import { AdminOrderFilterBar } from './AdminOrderFilterBar';

interface AdminOrderTableProps {
  orders: IAdminOrderListItem[];
  isLoading: boolean;
  totalPage: number;
  totalElement: number;
  params: IAdminOrderParams;
  setParams: React.Dispatch<React.SetStateAction<IAdminOrderParams>>;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING_PAYMENT: { label: 'Chờ thanh toán', color: 'text-stone-600' },
  PENDING_CONFIRM: { label: 'Chờ xác nhận', color: 'text-amber-600' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'text-blue-600' },
  PROCESSING: { label: 'Đang xử lý', color: 'text-indigo-600' },
  SHIPPED: { label: 'Đang giao', color: 'text-orange-600' },
  DELIVERED: { label: 'Đã giao', color: 'text-emerald-600' },
  COMPLETED: { label: 'Hoàn thành', color: 'text-green-600' },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600' },
  REFUNDING: { label: 'Đang hoàn tiền', color: 'text-rose-600' },
  REFUNDED: { label: 'Đã hoàn tiền', color: 'text-rose-600' },
};

export const AdminOrderTable = ({
  orders,
  isLoading,
  totalPage,
  totalElement,
  params,
  setParams,
}: AdminOrderTableProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mt-8">
      {/* Filters */}
      <AdminOrderFilterBar
        totalElement={totalElement}
        params={params}
        setParams={setParams}
        statusMap={statusMap}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50/50 text-stone-400 text-[10px] uppercase tracking-widest font-black border-b border-stone-50">
              <th className="py-4 px-8">Đơn hàng</th>
              <th className="py-4 px-8">Cửa hàng</th>
              <th className="py-4 px-8 text-right">Tổng thanh toán</th>
              <th className="py-4 px-8">Phương thức</th>
              <th className="py-4 px-8 text-center">Trạng thái</th>
              <th className="py-4 px-8">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-6 h-20 bg-stone-50/50" />
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-20 text-center text-stone-400 font-bold uppercase text-xs"
                >
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50 transition-all group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-stone-100 overflow-hidden relative shrink-0">
                        {order.thumbnail ? (
                          <Image
                            src={order.thumbnail}
                            alt={order.orderCode}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400 font-bold">
                            #
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-[#00490E] tracking-tight">
                          {order.orderCode}
                        </div>
                        <div className="text-[10px] text-stone-400 font-bold uppercase truncate max-w-[150px]">
                          {order.firstItemName} {order.itemCount > 1 && `+ ${order.itemCount - 1}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="font-bold text-stone-700 text-sm line-clamp-1">
                      {order.shopName}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <div className="font-black text-stone-900">
                      {formatCurrencyVND(order.totalAmount)}
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="text-xs font-bold text-stone-500 uppercase tracking-tighter">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[order.status]?.color || 'bg-stone-100 text-stone-600'}`}
                    >
                      {statusMap[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="py-5 px-8">
                    <div className="text-[11px] text-stone-500 font-bold">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-8 py-5 border-t border-stone-50 bg-stone-50/30 flex items-center justify-between">
        <Pagination
          currentPage={params.pageNo || 1}
          totalPages={totalPage}
          pageSize={params.pageSize}
          totalElements={totalElement}
          onPageChange={(page) => setParams({ ...params, pageNo: page })}
          onPageSizeChange={(size) => setParams({ ...params, pageSize: size, pageNo: 1 })}
        />
      </div>
    </div>
  );
};
