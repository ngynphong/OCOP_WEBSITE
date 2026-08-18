'use client';

import React from 'react';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { Button } from '@/components/ui/AppButton';
import { Plus, Package, FileText, Camera } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import Link from 'next/link';

export default function ProductionBatchPage() {
  const { useGetProductionBatches } = useProductionBatch();
  const { data, isLoading } = useGetProductionBatches({ page: 0, size: 20 });

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-4 md:p-6 rounded-lg shadow-sm gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">Quản lý Lô sản xuất</h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi quá trình sản xuất và chế biến từ nguyên liệu thành phẩm
          </p>
        </div>
        <Link href="/dashboard/lo-san-xuat/tao-moi" className="w-full md:w-auto">
          <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl py-6 md:py-2 text-base md:text-sm font-semibold">
            <Plus className="w-5 h-5 mr-2" />
            Bắt đầu Lô Mới
          </Button>
        </Link>
      </div>

      {/* DANH SÁCH LÔ - DẠNG CARD */}
      <div className="bg-transparent md:bg-white md:rounded-lg md:shadow-sm md:border md:border-slate-200">
        <div className="hidden md:flex p-4 border-b border-slate-200 justify-between items-center bg-slate-50 rounded-t-lg">
          <h2 className="font-semibold text-slate-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-500" />
            Danh sách Lô sản xuất hiện tại
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Đang tải dữ liệu...</div>
        ) : !data?.data?.content || data.data.content.length === 0 ? (
          <div className="text-center py-16 bg-white md:bg-slate-50 m-0 md:m-4 rounded-xl md:rounded-lg shadow-sm md:shadow-none border border-slate-200 md:border-dashed md:border-slate-300">
            <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">Chưa có lô sản xuất nào</h3>
            <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm px-4">
              Bạn chưa tạo lô sản xuất nào. Bấm vào nút bên trên để tạo lô mới và phân bổ nguyên
              liệu cho quá trình sản xuất.
            </p>
            <Link href="/dashboard/lo-san-xuat/tao-moi">
              <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Tạo Lô Sản Xuất Đầu Tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:p-4">
            {data.data.content.map((lot: ISupplyChainLot) => (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-start">
                  <div className="mr-2">
                    <div className="text-sm text-slate-500 mb-1 flex items-center">
                      Mã lô:{' '}
                      <span className="font-mono font-medium text-slate-700 ml-1 bg-slate-100 px-1.5 py-0.5 rounded">
                        {lot.lotCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1">
                      {lot.productName}
                    </h3>
                  </div>
                  <LotStatusBadge status={lot.status as TLotStatus} />
                </div>

                <div className="p-4 flex-1 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Sản lượng:</span>
                    <span className="font-semibold text-slate-800">
                      {lot.quantity} {lot.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Ngày tạo:</span>
                    <span className="text-slate-700">
                      {lot.createdAt
                        ? format(new Date(lot.createdAt), 'dd/MM/yyyy', { locale: vi })
                        : 'N/A'}
                    </span>
                  </div>
                  {/* Progress bar minh hoạ (Nên lấy từ ProcessTemplate trong tương lai) */}
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Tiến độ</span>
                      <span>Đang sản xuất</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: '45%' }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Link href={`/dashboard/lo-san-xuat/${lot.id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-10 rounded-lg"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Chi tiết
                    </Button>
                  </Link>
                  <Link href={`/dashboard/lo-san-xuat/${lot.id}?action=log`} className="block">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-10 rounded-lg">
                      <Camera className="w-4 h-4 mr-2" />
                      Ghi nhật ký
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
