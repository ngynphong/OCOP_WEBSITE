'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Eye,
  RefreshCw,
  X,
  PauseCircle,
  PlayCircle,
  Store,
  Bot,
} from 'lucide-react';
import {
  useAdminLotsQuery,
  useSuspendLotMutation,
  useReactivateLotMutation,
} from '@/features/admin/hooks/useAdminSupplyChain';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { Pagination } from '@/components/ui/Pagination';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';

export default function AdminLotsPage() {
  const router = useRouter();

  // Query states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [flaggedFilter, setFlaggedFilter] = useState<string>('ALL');

  // Quick Action Modal states
  const [suspendingLot, setSuspendingLot] = useState<ISupplyChainLot | null>(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [reactivatingLot, setReactivatingLot] = useState<ISupplyChainLot | null>(null);

  // Mutations
  const suspendMutation = useSuspendLotMutation();
  const reactivateMutation = useReactivateLotMutation();

  // API Call
  const {
    data: lotsRes,
    isLoading,
    isFetching,
    refetch,
  } = useAdminLotsQuery({
    page,
    size: pageSize,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    flaggedByAi: flaggedFilter === 'ALL' ? undefined : flaggedFilter === 'FLAGGED',
  });

  const responseData = lotsRes?.data;
  const lotsList: ISupplyChainLot[] = responseData?.content || [];

  const totalElements = responseData?.totalElements ?? lotsList.length;
  const totalPages =
    responseData?.totalPages ?? (totalElements > 0 ? Math.ceil(totalElements / pageSize) : 1);

  // Client-side text filter for instant search responsiveness
  const filteredLots = lotsList.filter((lot: ISupplyChainLot) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const matchCode = lot.lotCode?.toLowerCase().includes(term);
    const matchProduct = lot.productName?.toLowerCase().includes(term);
    const matchShop = lot.shopName?.toLowerCase().includes(term);
    return matchCode || matchProduct || matchShop;
  });

  // KPI Calculations from current page data or overall
  const activeCount = lotsList.filter((l) => l.status === 'ACTIVE').length;
  const flaggedCount = lotsList.filter((l) => l.isFlaggedByAi).length;
  const suspendedOrRecalledCount = lotsList.filter(
    (l) => l.status === 'SUSPENDED' || l.status === 'RECALLED',
  ).length;

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setFlaggedFilter('ALL');
    setPage(1);
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingLot) return;
    await suspendMutation.mutateAsync({
      id: suspendingLot.id,
      reason: suspendReason.trim() || undefined,
    });
    setSuspendingLot(null);
    setSuspendReason('');
  };

  const handleConfirmReactivate = async () => {
    if (!reactivatingLot) return;
    await reactivateMutation.mutateAsync(reactivatingLot.id);
    setReactivatingLot(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
            <span>Chuỗi cung ứng & Truy xuất</span>
            <span>/</span>
            <span className="text-stone-500">Giám sát Lô hàng</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">
            Quản trị & Hậu kiểm Lô hàng
          </h1>
          <p className="text-stone-500 text-sm font-medium mt-1 max-w-2xl">
            Giám sát chất lượng chuỗi cung ứng, cảnh báo vi phạm từ AI và thực hiện chế tài tạm dừng
            hoặc thu hồi đối với các lô sản phẩm OCOP trên toàn hệ thống.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center gap-1.5 text-stone-600 bg-white hover:bg-stone-50 border-stone-200 font-medium"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-600' : ''}`}
            />
            <span>Làm mới</span>
          </Button>
        </div>
      </div>

      {/* ── KPI Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng số lô */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Tổng Lô hàng
            </p>
            <p className="text-2xl font-black text-stone-900 mt-1">{totalElements}</p>
            <p className="text-xs text-stone-400 mt-0.5">Trên sàn OCOP</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center text-stone-600">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Đang hoạt động */}
        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-emerald-50/30">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Đang lưu hành
            </p>
            <p className="text-2xl font-black text-emerald-900 mt-1">{activeCount}</p>
            <p className="text-xs text-emerald-600/80 mt-0.5">Trạng thái ACTIVE</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-100/70 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: AI Cảnh báo */}
        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-amber-50/40">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">AI Cảnh báo</p>
            <p className="text-2xl font-black text-amber-900 mt-1">{flaggedCount}</p>
            <p className="text-xs text-amber-600/90 mt-0.5">Cần thanh tra rủi ro</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Tạm dừng / Thu hồi */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs flex items-center justify-between bg-gradient-to-br from-white to-rose-50/40">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">
              Tạm dừng / Thu hồi
            </p>
            <p className="text-2xl font-black text-rose-900 mt-1">{suspendedOrRecalledCount}</p>
            <p className="text-xs text-rose-600/90 mt-0.5">Chế tài hiệu lực</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ── Main Content Container ── */}
      <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 overflow-hidden">
        {/* ── Filter Toolbar ── */}
        <div className="p-4 border-b border-stone-200/80 bg-stone-50/50 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] md:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm mã lô, tên sản phẩm, shop..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-xs md:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Trạng thái Lô hàng (LotStatus) */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs md:text-sm text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
              >
                <option value="ALL">Tất cả trạng thái lô</option>
                <option value="ACTIVE">Hoạt động (ACTIVE)</option>
                <option value="CREATED">Đã tạo (CREATED)</option>
                <option value="PROCESSING">Đang chế biến (PROCESSING)</option>
                <option value="PRODUCTION_STARTED">Đang sản xuất (PRODUCTION)</option>
                <option value="STORAGE">Đang lưu kho (STORAGE)</option>
                <option value="SUSPENDED">Tạm ngưng (SUSPENDED)</option>
                <option value="RECALLED">Đã thu hồi (RECALLED)</option>
                <option value="EXPIRED">Hết hạn (EXPIRED)</option>
                <option value="SOLD_OUT">Hết hàng (SOLD_OUT)</option>
                <option value="DRAFT">Bản nháp (DRAFT)</option>
              </select>
            </div>

            {/* Cờ cảnh báo AI */}
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-amber-600" />
              <select
                value={flaggedFilter}
                onChange={(e) => {
                  setFlaggedFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-white border border-stone-200 rounded-lg px-3 py-2 text-xs md:text-sm text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
              >
                <option value="ALL">Tất cả đánh giá AI</option>
                <option value="FLAGGED">Chỉ lô AI cảnh báo rủi ro</option>
              </select>
            </div>

            {(statusFilter !== 'ALL' || flaggedFilter !== 'ALL' || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 underline underline-offset-2 flex items-center gap-1 px-1 cursor-pointer"
              >
                <X className="w-3 h-3" /> Đặt lại lọc
              </button>
            )}
          </div>

          <div className="text-xs text-stone-500 font-medium self-end md:self-center">
            Hiển thị <span className="font-bold text-stone-800">{filteredLots.length}</span> /{' '}
            {totalElements} lô
          </div>
        </div>

        {/* ── Table Container ── */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-stone-50/90 border-b border-stone-200/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                <th className="py-3 px-4">Mã lô / GTIN</th>
                <th className="py-3 px-4">Sản phẩm & Cửa hàng</th>
                <th className="py-3 px-4">Số lượng</th>
                <th className="py-3 px-4">Độ tin cậy & AI</th>
                <th className="py-3 px-4">Ngày SX / HSD</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs md:text-sm">
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-stone-200 rounded w-28 mb-1" />
                      <div className="h-3 bg-stone-100 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-stone-200 rounded w-48 mb-1" />
                      <div className="h-3 bg-stone-100 rounded w-32" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-stone-200 rounded w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-stone-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-stone-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-6 bg-stone-200 rounded-full w-20" />
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-8 bg-stone-200 rounded-lg w-24 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                        <Package className="w-6 h-6" />
                      </div>
                      <p className="font-bold text-stone-800 text-base">
                        Không tìm thấy lô hàng nào
                      </p>
                      <p className="text-xs text-stone-500">
                        Thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc trạng thái để xem dữ
                        liệu.
                      </p>
                      {(statusFilter !== 'ALL' || flaggedFilter !== 'ALL' || searchTerm) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-2 text-xs"
                        >
                          Xóa bộ lọc
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => {
                  const trustScore = lot.trustScore ?? 0;
                  const isSuspended = lot.status === 'SUSPENDED';
                  const isActive = lot.status === 'ACTIVE';

                  return (
                    <tr
                      key={lot.id}
                      className="hover:bg-stone-50/80 transition-colors group text-stone-700"
                    >
                      {/* Mã lô & GTIN */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 tracking-tight">
                            {lot.lotCode}
                          </span>
                          {lot.gtinCode && (
                            <span className="font-mono text-[11px] text-stone-400 tracking-tight">
                              GTIN: {lot.gtinCode}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Tên sản phẩm & Cửa hàng */}
                      <td className="py-3.5 px-4 align-top max-w-[260px]">
                        <p className="font-semibold text-stone-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                          {lot.productName || 'Chưa đặt tên'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                          <Store className="w-3 h-3 shrink-0 text-stone-400" />
                          <span className="truncate">{lot.shopName || 'Cửa hàng không rõ'}</span>
                        </div>
                      </td>

                      {/* Số lượng */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <div className="font-medium text-stone-900">
                          {lot.remainingQuantity != null
                            ? `${lot.remainingQuantity.toLocaleString()} / ${lot.quantity?.toLocaleString()}`
                            : lot.quantity?.toLocaleString()}{' '}
                          <span className="text-xs text-stone-500 font-normal">{lot.unit}</span>
                        </div>
                        {lot.availableQuantity != null && (
                          <p className="text-[11px] text-stone-400">
                            Khả dụng: {lot.availableQuantity.toLocaleString()} {lot.unit}
                          </p>
                        )}
                      </td>

                      {/* Điểm tin cậy & AI Flag */}
                      <td className="py-3.5 px-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  trustScore >= 80
                                    ? 'bg-emerald-500'
                                    : trustScore >= 50
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(0, trustScore))}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-stone-700">
                              {trustScore}/100
                            </span>
                          </div>

                          {lot.isFlaggedByAi && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-2.5 h-2.5" /> AI Cảnh báo
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Ngày sản xuất / Hạn sử dụng */}
                      <td className="py-3.5 px-4 align-top text-xs text-stone-600 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <p>
                            <span className="text-stone-400">NSX:</span>{' '}
                            {lot.productionDate
                              ? format(new Date(lot.productionDate), 'dd/MM/yyyy')
                              : '---'}
                          </p>
                          <p>
                            <span className="text-stone-400">HSD:</span>{' '}
                            {lot.expiryDate
                              ? format(new Date(lot.expiryDate), 'dd/MM/yyyy')
                              : '---'}
                          </p>
                        </div>
                      </td>

                      {/* Trạng thái Lô */}
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <LotStatusBadge status={(lot.status as TLotStatus) || 'CREATED'} />
                      </td>

                      {/* Thao tác */}
                      <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút Xem chi tiết */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/admin/supply-chain/lots/${lot.id}`)}
                            className="h-8 px-2.5 text-xs text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900 font-semibold"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1 text-stone-500" /> Chi tiết
                          </Button>

                          {/* Nút Thao tác nhanh Chế tài */}
                          {isActive && (
                            <button
                              onClick={() => {
                                setSuspendingLot(lot);
                                setSuspendReason('');
                              }}
                              title="Tạm dừng lưu hành lô hàng này"
                              className="p-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
                            >
                              <PauseCircle className="w-4 h-4" />
                            </button>
                          )}

                          {isSuspended && (
                            <button
                              onClick={() => setReactivatingLot(lot)}
                              title="Kích hoạt lại lô hàng"
                              className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="p-4 border-t border-stone-200/80 bg-white">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize);
              setPage(1);
            }}
            pageSizeOptions={[10, 20, 50]}
          />
        </div>
      </div>

      {/* ── Modal Tạm dừng Lô hàng ── */}
      <Modal
        isOpen={Boolean(suspendingLot)}
        onClose={() => setSuspendingLot(null)}
        title="Tạm dừng lưu hành Lô hàng"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Lưu ý về Chế tài Tạm dừng:
            </p>
            <p>
              Khi tạm dừng, toàn bộ mã tem QR truy xuất của lô{' '}
              <strong>{suspendingLot?.lotCode}</strong> sẽ bị vô hiệu hóa tạm thời. Khách hàng quét
              mã sẽ nhận thông báo lô hàng đang được cơ quan quản lý thẩm tra.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Lý do tạm dừng lưu hành
            </label>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="VD: Nhận phản ánh nghi ngờ mẫu kiểm nghiệm chưa đạt chuẩn, đang thẩm tra..."
              rows={3}
              className="w-full border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSuspendingLot(null)}
              disabled={suspendMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmSuspend}
              isLoading={suspendMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
              Xác nhận Tạm dừng
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Kích hoạt lại Lô hàng ── */}
      <Modal
        isOpen={Boolean(reactivatingLot)}
        onClose={() => setReactivatingLot(null)}
        title="Khôi phục lưu hành Lô hàng"
      >
        <div className="space-y-4">
          <p className="text-xs md:text-sm text-stone-600">
            Bạn có chắc chắn muốn khôi phục trạng thái hoạt động cho lô hàng{' '}
            <strong className="text-emerald-800 font-mono font-bold">
              {reactivatingLot?.lotCode}
            </strong>{' '}
            (Sản phẩm: {reactivatingLot?.productName})?
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
            Mã QR truy xuất và các sản phẩm thuộc lô hàng sẽ được mở bán và tra cứu nguồn gốc bình
            thường trở lại.
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReactivatingLot(null)}
              disabled={reactivateMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmReactivate}
              isLoading={reactivateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Xác nhận Kích hoạt lại
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
