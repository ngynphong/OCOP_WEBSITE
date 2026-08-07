'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import {
  ISupplyChainLot,
  TLotStatus,
  ICreateLotReq,
} from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { CreateLotModal } from '@/features/supply-chain/components/CreateLotModal';
import { Button } from '@/components/ui/AppButton';
import { Pagination } from '@/components/ui/Pagination';
import { FiPlus, FiSearch, FiPackage, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const LotListPage = () => {
  const [lots, setLots] = useState<ISupplyChainLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TLotStatus | undefined>(undefined);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchLots = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await supplyChainApi.getSellerLots({
        page: page,
        size: 10,
        status: statusFilter,
      });
      setLots(resp.data.content);
      setTotalPage(resp.data.totalPages);
    } catch (error) {
      console.error('Fetch lots error', error);
      toast.error('Không thể tải danh sách lô hàng');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchLots();
  }, [page, statusFilter, fetchLots]);

  const handleCreateLot = async (data: ICreateLotReq) => {
    await supplyChainApi.createLot(data);
    fetchLots();
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Truy xuất nguồn gốc</h1>
          <p className="text-stone-500 text-sm mt-1">
            Quản lý lô hàng và các bước chuỗi cung ứng của shop.
          </p>
        </div>
        <Button
          variant="primary"
          className="rounded-xl shadow-lg shadow-emerald-500/20"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FiPlus className="mr-2" /> Tạo lô hàng mới
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm theo mã lô hàng hoặc tên sản phẩm..."
            className="w-full pl-11 pr-4 py-3 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all"
          />
        </div>
        <select
          className="w-full md:w-48 px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all appearance-none font-medium text-stone-600"
          value={statusFilter || ''}
          onChange={(e) => setStatusFilter((e.target.value as TLotStatus) || undefined)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="CREATED">Mới tạo</option>
          <option value="PRODUCTION_STARTED">Đang sản xuất</option>
          <option value="PROCESSING">Đang chế biến</option>
          <option value="STORAGE">Đang lưu kho</option>
          <option value="IN_TRANSIT">Đang vận chuyển</option>
          <option value="DISTRIBUTED">Đã phân phối</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {/* Lots Table/Card List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-stone-100 animate-pulse rounded-xl" />
          ))
        ) : lots?.length > 0 ? (
          lots.map((lot) => (
            <Link
              key={lot.id}
              href={`/dashboard/truy-xuat/${lot.id}`}
              className="group bg-white rounded-xl p-5 border border-stone-50 shadow-lg shadow-stone-200/40 hover:border-emerald-200 hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col md:flex-row md:items-center gap-6"
            >
              <div className="w-14 h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform">
                <FiPackage size={24} />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                    {lot.lotCode}
                  </span>
                  <LotStatusBadge status={lot.status} />
                </div>
                <h3 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  {lot.productName}{' '}
                  {lot.variantName && (
                    <span className="text-stone-500 font-normal">- {lot.variantName}</span>
                  )}
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-stone-500">
                  <span className="flex items-center gap-1.5">
                    <FiPackage className="text-stone-300" /> {lot.quantity} {lot.unit}
                  </span>
                  {lot.productionDate && (
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="text-stone-300" />
                      SX: {format(new Date(lot.productionDate), 'dd/MM/yyyy', { locale: vi })}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <div className="hidden md:block text-right">
                  <p className="text-xs text-stone-400 font-medium">Khởi tạo</p>
                  <p className="text-sm font-semibold text-stone-600">
                    {format(new Date(lot.createdAt), 'dd/MM/yyyy')}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FiArrowRight />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-xl border border-dashed border-stone-200">
            <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-stone-300" size={32} />
            </div>
            <h3 className="font-bold text-stone-900">Không tìm thấy lô hàng nào</h3>
            <p className="text-stone-500 text-sm mt-1">
              Bắt đầu bằng cách tạo lô hàng đầu tiên của bạn.
            </p>
            <Button
              variant="outline"
              className="mt-6 rounded-xl"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <FiPlus className="mr-2" /> Tạo ngay
            </Button>
          </div>
        )}
      </div>

      {totalPage > 1 && (
        <div className="flex justify-center pt-8">
          <Pagination currentPage={page} totalPages={totalPage} onPageChange={setPage} />
        </div>
      )}

      <CreateLotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchLots()}
        onSubmit={handleCreateLot}
      />
    </div>
  );
};

export default LotListPage;
