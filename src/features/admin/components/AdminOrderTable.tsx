'use client';

import React from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiSearch } from 'react-icons/fi';
import { formatCurrencyVND } from '@/utils/format';
import { IAdminOrderListItem, IAdminOrderParams } from '../types/adminTypes';
import { Pagination } from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';

interface AdminOrderTableProps {
  orders: IAdminOrderListItem[];
  isLoading: boolean;
  totalPage: number;
  totalElement: number;
  params: IAdminOrderParams;
  setParams: (params: IAdminOrderParams) => void;
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
  const [searchTerm, setSearchTerm] = useState(params.keyword || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setParams({ ...params, keyword: debouncedSearchTerm, pageNo: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Synchronize searchTerm if params.keyword is changed from outside (e.g. reset)
  useEffect(() => {
    if (params.keyword !== searchTerm) {
      setSearchTerm(params.keyword || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.keyword]);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden mt-8">
      {/* Filters */}
      <div className="p-6 border-b border-stone-50 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-black text-[#00490E] uppercase tracking-wider">
            Danh sách Đơn hàng
          </h3>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
            {totalElement} đơn hàng
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm mã đơn, shop..."
              className="w-full pl-9 pr-4 py-2 bg-stone-50 text-gray-700 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
              value={params.startDate || ''}
              onChange={(e) =>
                setParams({ ...params, startDate: e.target.value || undefined, pageNo: 1 })
              }
            />
            <span className="text-stone-400 text-xs font-bold uppercase">đến</span>
            <input
              type="date"
              className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
              value={params.endDate || ''}
              onChange={(e) =>
                setParams({ ...params, endDate: e.target.value || undefined, pageNo: 1 })
              }
            />
          </div>

          <select
            className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
            value={params.status || ''}
            onChange={(e) =>
              setParams({ ...params, status: e.target.value || undefined, pageNo: 1 })
            }
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(statusMap).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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
                  <td colSpan={7} className="px-8 py-6 h-20 bg-stone-50/50" />
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                      {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
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
