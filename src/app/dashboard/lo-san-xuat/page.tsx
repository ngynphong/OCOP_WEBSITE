'use client';

import React, { useState } from 'react';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { Button } from '@/components/ui/AppButton';
import {
  Plus,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Filter,
  MapPin,
  Calendar,
  User,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  ISupplyChainLot,
  TLotStatus,
  ILotListReq,
} from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';

type TFilterTab = 'ALL' | 'FLAGGED' | 'PROCESSING' | 'ACTIVE';

export default function ProductionBatchPage() {
  const [activeTab, setActiveTab] = useState<TFilterTab>('ALL');
  const [params, setParams] = useState<ILotListReq>({ page: 1, size: 12 });
  const { useGetProductionBatches } = useProductionBatch();
  const { data, isLoading } = useGetProductionBatches(params);

  const handleTabChange = (tab: TFilterTab) => {
    setActiveTab(tab);
    if (tab === 'ALL') {
      setParams({ page: 1, size: 12 });
    } else if (tab === 'FLAGGED') {
      setParams({ page: 1, size: 12, flaggedByAi: true });
    } else if (tab === 'PROCESSING') {
      setParams({ page: 1, size: 12, status: 'PROCESSING' });
    } else if (tab === 'ACTIVE') {
      setParams({ page: 1, size: 12, status: 'ACTIVE' });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-20 md:pb-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-center bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            Quản lý Lô sản xuất
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi quy trình canh tác, chế biến và giám sát an toàn chất lượng sản phẩm OCOP
          </p>
        </div>
        <Link href="/dashboard/lo-san-xuat/tao-moi" className="w-full md:w-auto block">
          <Button
            id="tour-add-lot"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-xl h-11 md:h-10 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Bắt đầu Lô Mới
          </Button>
        </Link>
      </div>

      {/* TABS LỌC THEO DÕI & GIÁM SÁT */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-xl border border-slate-200">
        <button
          type="button"
          onClick={() => handleTabChange('ALL')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'ALL'
              ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Filter className="w-4 h-4" />
          Tất cả lô
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('FLAGGED')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'FLAGGED'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Cảnh báo (Cần kiểm tra)
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('PROCESSING')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'PROCESSING'
              ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Đang chế biến
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('ACTIVE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'ACTIVE'
              ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          Đã hoàn tất (Active)
        </button>
      </div>

      {/* DANH SÁCH LÔ - DẠNG CARD */}
      <div className="bg-transparent md:bg-white md:rounded-xl md:shadow-sm md:border md:border-slate-200">
        {isLoading ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải danh sách lô sản xuất...</span>
          </div>
        ) : !data?.data?.content || data.data.content.length === 0 ? (
          <div className="text-center py-16 bg-white md:bg-slate-50 m-0 md:m-4 rounded-xl md:rounded-lg shadow-sm md:shadow-none border border-slate-200 md:border-dashed md:border-slate-300">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                activeTab === 'FLAGGED' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'
              }`}
            >
              {activeTab === 'FLAGGED' ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              ) : (
                <Package className="w-8 h-8" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              {activeTab === 'FLAGGED'
                ? 'Không có lô nào bị gắn cờ cảnh báo.'
                : 'Chưa có lô sản xuất nào'}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm px-4">
              {activeTab === 'FLAGGED'
                ? 'Tuyệt vời! Toàn bộ quy trình và liều lượng vật tư của các lô sản xuất đều tuân thủ đúng khuyến nghị của trợ lý AI.'
                : 'Bạn chưa tạo lô sản xuất nào. Bấm vào nút bên dưới để bắt đầu lô mới.'}
            </p>
            {activeTab === 'ALL' && (
              <Link href="/dashboard/lo-san-xuat/tao-moi">
                <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  <Plus className="w-4 h-4 mr-2" /> Tạo Lô Sản Xuất Đầu Tiên
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:p-4">
            {data.data.content.map((lot: ISupplyChainLot) => (
              <div
                key={lot.id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md ${
                  lot.isFlaggedByAi ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              >
                {/* Header Card */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-500 mb-1 flex items-center flex-wrap gap-1">
                      Mã lô:{' '}
                      <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded truncate">
                        {lot.lotCode}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-800 line-clamp-1">
                      {lot.productName}
                    </h3>
                  </div>
                  <div className="shrink-0">
                    <LotStatusBadge status={lot.status as TLotStatus} />
                  </div>
                </div>

                {/* Huy hiệu Giám sát Chất lượng AI */}
                <div className="px-4 pt-3 pb-1">
                  {lot.isFlaggedByAi ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-lg text-xs font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span className="line-clamp-1">Cảnh báo AI: Phát hiện sai lệch</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Đạt chuẩn kỹ thuật OCOP</span>
                    </div>
                  )}
                </div>

                {/* Body Card */}
                <div className="p-4 flex-1 space-y-2.5">
                  {/* Thông tin đời thường nhận diện */}
                  <div className="bg-slate-50/90 p-2.5 rounded-lg border border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Vùng trồng:
                      </span>
                      <span
                        className="font-semibold text-slate-800 truncate max-w-[160px]"
                        title={lot.farmName || 'Cơ sở OCOP'}
                      >
                        {lot.farmName || 'Cơ sở OCOP'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Vụ mùa:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {lot.sourceCycleName || 'Đông Xuân 2026'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Phụ trách:
                      </span>
                      <span
                        className="font-semibold text-slate-800 truncate max-w-[160px]"
                        title={lot.responsiblePerson || 'Chủ hộ (Seller)'}
                      >
                        {lot.responsiblePerson || 'Chủ hộ (Seller)'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Sản lượng:
                      </span>
                      <span className="font-bold text-slate-800">
                        {lot.quantity} {lot.unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-0.5">
                    <span>Ngày tạo:</span>
                    <span className="text-slate-700">
                      {lot.createdAt
                        ? format(new Date(lot.createdAt), 'dd/MM/yyyy', { locale: vi })
                        : 'N/A'}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="pt-1">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Tiến độ</span>
                      <span>
                        {lot.eventCount ?? lot.events?.length ?? 0}/{lot.templateSteps?.length || 0}{' '}
                        công đoạn
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          lot.isFlaggedByAi ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{
                          width: `${(lot.templateSteps?.length || 0) > 0 ? ((lot.eventCount ?? lot.events?.length ?? 0) / (lot.templateSteps?.length || 1)) * 100 : 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 grid grid-cols-1 gap-2">
                  <Link href={`/dashboard/lo-san-xuat/${lot.id}`} className="block">
                    <Button
                      variant="outline"
                      className="w-full bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 h-9 rounded-lg px-2 text-xs font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      Chi tiết
                    </Button>
                  </Link>
                  {/* Tạm thời ẩn nút Ghi nhật ký trên web
                  <Link href={`/dashboard/lo-san-xuat/${lot.id}?action=log`} className="block">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-9 rounded-lg px-2 text-xs font-semibold">
                      <Camera className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                      Ghi nhật ký
                    </Button>
                  </Link>
                  */}
                </div>
              </div>
            ))}

            <div className="col-span-full pt-4 border-t border-slate-200">
              <Pagination
                currentPage={params.page}
                totalPages={
                  data?.data?.totalPages ||
                  Math.ceil((data?.data?.totalElements || 0) / params.size)
                }
                pageSize={params.size}
                totalElements={data?.data?.totalElements}
                onPageChange={(page) => setParams((p) => ({ ...p, page }))}
                onPageSizeChange={(size) => setParams({ page: 1, size })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
