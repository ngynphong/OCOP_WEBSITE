'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiEye, FiCheckCircle, FiXCircle, FiClock, FiSearch } from 'react-icons/fi';
import { adminSupplyChainApi } from '@/features/admin/api/adminSupplyChainApi';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import { Button } from '@/components/ui/AppButton';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function AdminLotsPage() {
  const router = useRouter();
  const [page] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('SUBMITTED_FOR_VERIFICATION'); // Default filter to SUBMITTED_FOR_VERIFICATION

  const { data: lotsRes, isLoading } = useQuery({
    queryKey: ['admin_lots', page, filterStatus],
    queryFn: () =>
      adminSupplyChainApi.getLots({
        page,
        size: 10,
        verificationStatus: filterStatus === 'ALL' ? undefined : filterStatus,
      }),
  });

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED_FOR_VERIFICATION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <FiClock className="mr-1" /> Chờ duyệt
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
            <FiCheckCircle className="mr-1" /> Đã duyệt
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <FiXCircle className="mr-1" /> Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 border border-stone-200">
            {status}
          </span>
        );
    }
  };

  const lotsList =
    lotsRes?.data?.items ||
    (lotsRes?.data as unknown as { content?: ISupplyChainLot[] })?.content ||
    [];
  const filteredLots = lotsList.filter((lot: ISupplyChainLot) =>
    lot.lotCode.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Kiểm duyệt Lô hàng</h1>
          <p className="text-stone-500 mt-1">
            Quản lý và xét duyệt các lô hàng được tạo bởi Nhà bán hàng
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <select
              className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={filterStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterStatus(e.target.value)
              }
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SUBMITTED_FOR_VERIFICATION">Chờ duyệt</option>
              <option value="VERIFIED">Đã duyệt</option>
              <option value="REJECTED">Bị từ chối</option>
            </select>
          </div>
          <div className="relative w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Tìm mã lô hàng..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-9 w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-stone-50 text-stone-500 text-left text-sm uppercase">
              <tr>
                <th className="p-4 font-medium">Mã lô</th>
                <th className="p-4 font-medium">Cửa hàng</th>
                <th className="p-4 font-medium">Số lượng</th>
                <th className="p-4 font-medium">Ngày tạo</th>
                <th className="p-4 font-medium">Trạng thái duyệt</th>
                <th className="p-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredLots?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-stone-500">
                    Không tìm thấy lô hàng nào
                  </td>
                </tr>
              ) : (
                filteredLots?.map((lot: ISupplyChainLot) => (
                  <tr
                    key={lot.id}
                    className="border-b border-stone-100 hover:bg-stone-50 text-stone-700"
                  >
                    <td className="p-4 align-middle font-medium text-emerald-700">{lot.lotCode}</td>
                    <td className="p-4 align-middle">{lot.shopName || '---'}</td>
                    <td className="p-4 align-middle">
                      {lot.quantity} {lot.unit}
                    </td>
                    <td className="p-4 align-middle">
                      {format(new Date(lot.createdAt), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="p-4 align-middle">
                      {getVerificationBadge(lot.verificationStatus || '')}
                    </td>
                    <td className="p-4 align-middle text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/supply-chain/lots/${lot.id}`)}
                      >
                        <FiEye className="mr-2" /> Xem chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
