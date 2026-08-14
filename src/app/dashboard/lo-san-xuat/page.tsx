'use client';

import React from 'react';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { Button } from '@/components/ui/AppButton';
import { Plus, Package, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import Link from 'next/link';

export default function ProductionBatchPage() {
  const { useGetProductionBatches } = useProductionBatch();
  const { data, isLoading } = useGetProductionBatches({ page: 0, size: 20 });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Lô sản xuất</h1>
          <p className="text-slate-500 mt-1">
            Theo dõi quá trình sản xuất và chế biến từ nguyên liệu thành phẩm
          </p>
        </div>
        <Link href="/dashboard/lo-san-xuat/tao-moi">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Tạo Lô Sản Xuất Mới
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-lg">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-500" />
            Danh sách Lô sản xuất hiện tại
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : !data?.data?.content || data.data.content.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 m-4 rounded-lg border border-dashed border-slate-300">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Chưa có lô sản xuất nào</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-2">
              Bạn chưa tạo lô sản xuất nào. Bấm vào nút bên trên để tạo lô mới và phân bổ nguyên
              liệu cho quá trình sản xuất.
            </p>
            <Link href="/dashboard/lo-san-xuat/tao-moi">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" /> Tạo Lô Sản Xuất Đầu Tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Mã lô</th>
                  <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                  <th className="px-6 py-4 font-semibold">Sản lượng</th>
                  <th className="px-6 py-4 font-semibold">Trạng thái</th>
                  <th className="px-6 py-4 font-semibold">Ngày tạo</th>
                  <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.data.content.map((lot: ISupplyChainLot) => (
                  <tr key={lot.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-blue-700">{lot.lotCode}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{lot.productName}</td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="font-semibold">{lot.quantity}</span> {lot.unit}
                    </td>
                    <td className="px-6 py-4">
                      <LotStatusBadge status={lot.status as TLotStatus} />
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {lot.createdAt
                        ? format(new Date(lot.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                        : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/dashboard/lo-san-xuat/${lot.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <FileText className="w-4 h-4 mr-1" /> Chi tiết
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
