'use client';

import React, { useEffect, Suspense } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MapPin,
  Store,
  Star,
  FileText,
  XCircle,
  Loader2,
  Package,
  AlertTriangle,
  AlertCircle,
  Clock,
  Sprout,
  UserCheck,
  CalendarRange,
  Boxes,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import {
  useTraceDetailQuery,
  useRecordScanMutation,
} from '@/features/products/hooks/usePublicProducts';
import { ProductJournal, TraceQrInfo } from '@/features/products/types/productTypes';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';
import { StandardProcessWorkflow } from '@/features/supply-chain/components/StandardProcessWorkflow';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

interface PageProps {
  params: Promise<{ code: string }>;
}

function getCodeStatus(lot?: ISupplyChainLot, qr?: TraceQrInfo) {
  // 1. Khi quét mã của Lô sản xuất thực tế
  if (lot) {
    const isExpired = lot.expiryDate ? new Date(lot.expiryDate).getTime() < Date.now() : false;

    if (lot.status === 'RECALLED') {
      return {
        label: 'Cảnh báo thu hồi',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
      };
    }
    if (lot.status === 'SUSPENDED') {
      return {
        label: 'Tạm ngưng lưu hành',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
      };
    }
    if (lot.status === 'EXPIRED' || isExpired) {
      return {
        label: 'Hết hạn sử dụng',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <Clock className="w-4 h-4 text-red-500" />,
      };
    }
    if (lot.status === 'CANCELLED') {
      return {
        label: 'Mã đã bị hủy',
        color: 'text-stone-700',
        bg: 'bg-stone-100',
        border: 'border-stone-200',
        icon: <XCircle className="w-4 h-4 text-stone-500" />,
      };
    }
    if (lot.status === 'ACTIVE' || lot.status === 'DISTRIBUTED') {
      return {
        label: 'Hợp lệ (Đang lưu hành)',
        color: 'text-emerald-800',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      };
    }
    if (lot.status === 'SOLD_OUT') {
      return {
        label: 'Lô đã bán hết',
        color: 'text-stone-700',
        bg: 'bg-stone-100',
        border: 'border-stone-200',
        icon: <Package className="w-4 h-4 text-stone-500" />,
      };
    }
    return {
      label: 'Đang sản xuất (Chưa kích hoạt)',
      color: 'text-stone-700',
      bg: 'bg-stone-100',
      border: 'border-stone-200',
      icon: <Clock className="w-4 h-4 text-stone-500" />,
    };
  }

  // 2. Khi quét mã QR Sản phẩm (không gắn với lô)
  const statusStr = qr?.status?.toUpperCase() || qr?.certificationStatus?.toUpperCase();
  if (qr?.isCertified || statusStr === 'CERTIFIED' || statusStr === 'ACTIVE') {
    return {
      label: 'Hợp lệ (Đã chứng thực OCOP)',
      color: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    };
  }
  if (statusStr === 'REJECTED' || statusStr === 'CANCELLED') {
    return {
      label: 'Không hợp lệ / Đã hủy',
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="w-4 h-4 text-red-600" />,
    };
  }
  if (statusStr === 'SUSPENDED') {
    return {
      label: 'Mã đang tạm khóa',
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
    };
  }

  return {
    label: 'Chưa xác minh hồ sơ',
    color: 'text-stone-700',
    bg: 'bg-stone-100',
    border: 'border-stone-200',
    icon: <Clock className="w-4 h-4 text-stone-500" />,
  };
}

function TraceContent({ code }: { code: string }) {
  const searchParams = useSearchParams();
  const serial = searchParams.get('serial');
  const { data, isLoading, isError } = useTraceDetailQuery(code);
  const { mutate: recordScan } = useRecordScanMutation();

  useEffect(() => {
    if (code) recordScan(code);
  }, [code, recordScan]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm font-medium">Đang tải thông tin truy xuất...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <XCircle className="w-12 h-12 text-red-400" />
          <h1 className="text-xl font-black text-stone-900">Không tìm thấy thông tin</h1>
          <p className="text-stone-500 text-sm">
            Mã QR <span className="font-mono font-bold text-stone-700">{code}</span> không hợp lệ
            hoặc chưa được đăng ký trên hệ thống.
          </p>
          <Link
            href="/"
            className="mt-2 px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { product, qr, journals, scanCount, lot } = data.data;
  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);
  const codeStatus = getCodeStatus(lot, qr);
  const isRecalled = lot?.status === 'RECALLED';

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header bar */}
      <div
        className={cn(
          'text-white px-4 py-3 flex items-center justify-center shadow-xs relative z-10 transition-colors',
          isRecalled ? 'bg-red-700' : 'bg-emerald-800',
        )}
      >
        <span className="text-sm font-black uppercase tracking-widest flex items-center gap-1.5">
          {isRecalled ? (
            <>
              <AlertTriangle className="w-4 h-4 text-yellow-300" /> CẢNH BÁO THU HỒI • TRUY XUẤT
              NGUỒN GỐC
            </>
          ) : (
            'TRUY XUẤT NGUỒN GỐC'
          )}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col gap-6">
        {/* Banner cảnh báo thu hồi nếu có */}
        {isRecalled && (
          <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-left shadow-xs">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-black text-sm">CẢNH BÁO: LÔ SẢN PHẨM BỊ THU HỒI</h4>
            </div>
            <p className="text-xs text-red-600 font-medium leading-relaxed">
              Lô sản phẩm này đang nằm trong diện thu hồi của cơ sở sản xuất hoặc cơ quan quản lý.
              Vui lòng không tiếp tục sử dụng sản phẩm.
            </p>
          </div>
        )}

        {/* Bố cục Grid 2 cột: Cột trái (Sticky Sidebar: 4 cols) - Cột phải (Dòng sự kiện & Quy trình: 8 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= CỘT TRÁI (Sticky Sidebar trên Desktop) ================= */}
          <div className="lg:col-span-4 lg:sticky lg:top-6 flex flex-col gap-5">
            {/* Khối 1: Xác minh sản phẩm */}
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                      Xác minh sản phẩm
                    </h2>
                    <p className="text-[11px] text-stone-400">Chứng thực nguồn gốc số OCOP</p>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-500">Trạng thái mã</span>
                  <span
                    className={cn(
                      'text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5',
                      codeStatus.color,
                      codeStatus.bg,
                      codeStatus.border,
                    )}
                  >
                    {codeStatus.icon}
                    <span>{codeStatus.label}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-500">Lượt quét mã</span>
                  <span className="text-sm font-bold text-stone-900">{scanCount} lần</span>
                </div>
                {serial && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-500">Số Serial tem</span>
                    <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                      #{serial}
                    </span>
                  </div>
                )}
                {/* <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                  <span className="text-stone-400">Tiêu chuẩn định danh</span>
                  <span className="font-semibold text-stone-700">GS1 Digital Link</span>
                </div> */}
              </div>
            </div>

            {/* Khối 2: Thông tin OCOP & Sản phẩm */}
            <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
              <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                    <Star className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                      Thông tin OCOP
                    </h2>
                    <p className="text-[11px] text-stone-400">Hồ sơ nông sản & chủ thể</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-full border border-amber-200/80 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{product.ocopStar} sao</span>
                </span>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="relative w-full aspect-4/3 sm:aspect-video lg:aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center">
                  {product.thumbnailUrl && product.thumbnailUrl.trim() !== '' ? (
                    <Image
                      src={product.thumbnailUrl}
                      alt={product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100 p-4">
                      <Package className="w-12 h-12 opacity-40 mb-2" />
                      <span className="text-xs text-stone-500 font-medium">
                        Sản phẩm chứng nhận OCOP
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                    {product.name}
                  </h3>
                  <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500 flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-stone-400" /> Chủ thể
                      </span>
                      <span className="font-bold text-stone-900 truncate max-w-[180px]">
                        {product.shop.name}
                      </span>
                    </div>
                    {product.shop.province && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-stone-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" /> Địa bàn
                        </span>
                        <span className="font-semibold text-stone-700">
                          {product.shop.province}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-stone-500 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-stone-400" /> Số chứng nhận
                      </span>
                      <span className="font-bold text-stone-900">
                        {product.certificationNumber || 'Đang cập nhật'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Khối 3: Vùng Trồng & Mùa Vụ Canh Tác (Tách sang cột trái) */}
            {(lot?.farmName || lot?.responsiblePerson || lot?.sourceCycleName) && (
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                    <Sprout className="w-4.5 h-4.5 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                      Vùng Trồng & Mùa Vụ
                    </h2>
                    <p className="text-[11px] text-stone-400">Nơi canh tác & phụ trách sản xuất</p>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-2.5 text-xs">
                  {lot.farmName && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                        <Sprout className="w-3.5 h-3.5 text-stone-400" />
                        Vườn / Trang trại
                      </span>
                      <span className="font-bold text-stone-900 text-right">{lot.farmName}</span>
                    </div>
                  )}

                  {lot.responsiblePerson && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                        Người phụ trách
                      </span>
                      <span className="font-bold text-stone-900 text-right">
                        {lot.responsiblePerson}
                      </span>
                    </div>
                  )}

                  {lot.sourceCycleName && (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                        <CalendarRange className="w-3.5 h-3.5 text-stone-400" />
                        Vụ mùa
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-stone-900">{lot.sourceCycleName}</span>
                        {lot.sourceCycleStatus && (
                          <span
                            className={cn(
                              'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                              lot.sourceCycleStatus === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 text-stone-600 border-stone-200',
                            )}
                          >
                            {lot.sourceCycleStatus === 'COMPLETED'
                              ? 'Đã hoàn tất vụ'
                              : 'Đang canh tác'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Khối 4: Thông tin sản phẩm bổ sung */}
            {(product.ingredients ||
              product.packagingMaterial ||
              product.appliedStandards ||
              product.complianceDocuments) && (
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                    <FileText className="w-4.5 h-4.5 text-stone-600" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                      Thông tin bổ sung
                    </h2>
                    <p className="text-[11px] text-stone-400">Tiêu chuẩn & tài liệu công bố</p>
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {product.ingredients && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        Thành phần
                      </span>
                      <span className="text-xs text-stone-800">{product.ingredients}</span>
                    </div>
                  )}
                  {product.packagingMaterial && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        Chất liệu bao bì
                      </span>
                      <span className="text-xs text-stone-800">{product.packagingMaterial}</span>
                    </div>
                  )}
                  {product.appliedStandards && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        Tiêu chuẩn áp dụng
                      </span>
                      <span className="text-xs text-stone-800">{product.appliedStandards}</span>
                    </div>
                  )}
                  {product.complianceDocuments && (
                    <div className="flex flex-col gap-1 mt-1">
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        Tài liệu công bố
                      </span>
                      <div className="flex flex-col gap-2 mt-1">
                        {product.complianceDocuments.split(',').map((docLink, idx) => (
                          <a
                            key={idx}
                            href={docLink.trim()}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-medium"
                          >
                            <FileText className="w-3.5 h-3.5" /> Xem tài liệu {idx + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= CỘT PHẢI (Nội dung chính: Lô, Quy trình, Timeline) ================= */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Khối 1: Thông tin Lô Hàng & Quy cách xuất xưởng */}
            {lot && (
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                      <Package className="w-4.5 h-4.5 text-stone-700" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                        Thông tin Lô Hàng & Quy Cách Xuất Xưởng
                      </h2>
                      <p className="text-[11px] text-stone-400">
                        Định danh lô sản xuất độc bản GS1
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {lot.variantName && (
                      <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                        {lot.variantName}
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      {lot.lotCode}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex flex-col gap-4">
                  {/* Grid 4 chỉ số sản xuất */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" /> Ngày sản xuất
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {lot.productionDate
                          ? new Date(lot.productionDate).toLocaleDateString('vi-VN')
                          : 'Đang cập nhật'}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" /> Hạn sử dụng
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {lot.expiryDate
                          ? new Date(lot.expiryDate).toLocaleDateString('vi-VN')
                          : 'Theo NSX'}
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col gap-1">
                      <span className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                        <Boxes className="w-3.5 h-3.5 text-stone-400" /> Quy mô mẻ xuất
                      </span>
                      <span className="text-sm font-bold text-stone-900">
                        {lot.quantity
                          ? `${lot.quantity} ${lot.unit || 'sản phẩm'}`
                          : 'Đang cập nhật'}
                      </span>
                    </div>
                  </div>

                  {lot.verificationLevel && (
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                      <span className="text-stone-500 flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" /> Cấp độ chứng thực
                      </span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {lot.verificationLevel.replace('_', ' ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Khối 2: Vật tư & Nguyên liệu đầu vào (Nếu có) */}
            {lot?.materialsUsed && lot.materialsUsed.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                      <Boxes className="w-4.5 h-4.5 text-stone-700" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                        Vật tư & Nguyên liệu đầu vào
                      </h2>
                      <p className="text-[11px] text-stone-400">
                        Giống cây, phân bón & chế phẩm sinh học
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                    {lot.materialsUsed.length} vật tư
                  </span>
                </div>
                <div className="p-4 flex flex-col gap-2.5">
                  {lot.materialsUsed.map((m, mIdx) => (
                    <div
                      key={m.materialLotId || mIdx}
                      className="p-3 bg-stone-50/60 rounded-xl border border-stone-200/70 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-stone-900 text-sm">{m.materialName}</span>
                        <span className="text-[11px] text-stone-500">
                          Mã lô vật tư:{' '}
                          <strong className="text-stone-700 font-mono">{m.materialLotCode}</strong>
                        </span>
                        {m.supplierName && (
                          <span className="text-[11px] text-stone-500">
                            Nhà cung cấp:{' '}
                            <strong className="text-stone-700">{m.supplierName}</strong>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-stone-700 bg-stone-100 px-2 py-1 rounded border border-stone-200 shrink-0">
                        {m.quantityUsed} {m.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Khối 3: Quy trình sản xuất chuẩn OCOP */}
            {lot?.templateSteps && lot.templateSteps.length > 0 && (
              <StandardProcessWorkflow
                processTemplateName={lot.processTemplateName}
                templateSteps={lot.templateSteps}
                events={lot.events || []}
              />
            )}

            {/* Khối 4: Hành trình Lô sản xuất thực tế (Khi quét QR của Lô) */}
            {lot ? (
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                      <MapPin className="w-4.5 h-4.5 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                        Nhật ký chuỗi cung ứng thực tế của Lô
                      </h2>
                      <p className="text-[11px] text-stone-400">
                        Dữ liệu ghi nhận hiện trường & chứng thực số
                      </p>
                    </div>
                  </div>
                  {lot.events && lot.events.length > 0 && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      {lot.events.length} sự kiện thực tế
                    </span>
                  )}
                </div>

                <div className="p-5">
                  {lot.events && lot.events.length > 0 ? (
                    <BatchEventTimeline
                      events={lot.events}
                      templateSteps={lot.templateSteps || []}
                    />
                  ) : lot.steps && lot.steps.length > 0 ? (
                    <div className="relative">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200" />
                      <div className="flex flex-col gap-6">
                        {lot.steps.map((step, index) => (
                          <div key={index} className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-white border-[3px] border-emerald-700 shrink-0 z-10 mt-0.5" />
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0 last:pb-0">
                              <h3 className="text-sm font-bold text-stone-900">{step.stepType}</h3>
                              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(step.recordedAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-2">
                      <Package className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="text-sm font-bold text-stone-700">
                        Chưa có nhật ký sự kiện thực tế cho lô này
                      </p>
                      <p className="text-xs text-stone-400 max-w-sm mx-auto">
                        Mẻ sản xuất này hiện đang trong quá trình chuẩn bị các công đoạn canh tác /
                        chế biến tiếp theo.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Khi quét mã QR chung của Sản phẩm (không gắn với lô) */
              sortedJournals.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
                  <div className="p-4 border-b border-stone-100 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                      <MapPin className="w-4.5 h-4.5 text-emerald-700" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                        Quy trình sản xuất tiêu chuẩn
                      </h2>
                      <p className="text-[11px] text-stone-400">
                        Hành trình quy chuẩn theo hồ sơ công bố OCOP của sản phẩm
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="relative">
                      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200" />
                      <div className="flex flex-col gap-6">
                        {sortedJournals.map((journal: ProductJournal) => (
                          <div key={journal.id} className="flex gap-4 relative">
                            <div className="w-6 h-6 rounded-full bg-white border-[3px] border-emerald-700 shrink-0 z-10 mt-0.5" />
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Bước {journal.stepOrder}
                                </span>
                                <h3 className="text-sm font-bold text-stone-900">
                                  {journal.title}
                                </h3>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-stone-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(journal.activityDate).toLocaleDateString('vi-VN')}
                                </span>
                                {journal.location && (
                                  <span className="flex items-center gap-1 truncate">
                                    <Store className="w-3.5 h-3.5" />
                                    {journal.location}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-stone-600 mt-1">{journal.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}

            {/* Khối 5: Câu chuyện sản phẩm OCOP (Tham khảo chung khi xem Lô) */}
            {lot && sortedJournals.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
                <div className="p-4 border-b border-stone-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
                    <Star className="w-4.5 h-4.5 text-stone-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                      Hành trình câu chuyện OCOP (Tham khảo)
                    </h2>
                    <p className="text-[11px] text-stone-400">
                      Câu chuyện văn hóa và giá trị bản địa định danh của dòng sản phẩm
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  <div className="relative">
                    <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200" />
                    <div className="flex flex-col gap-6">
                      {sortedJournals.map((journal: ProductJournal) => (
                        <div key={journal.id} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-white border-[3px] border-stone-400 shrink-0 z-10 mt-0.5" />
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0 last:pb-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                                Bước {journal.stepOrder}
                              </span>
                              <h3 className="text-sm font-bold text-stone-900">{journal.title}</h3>
                            </div>
                            <p className="text-sm text-stone-600 mt-1">{journal.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 font-medium mt-4 pt-4 border-t border-stone-200/60">
          Thông tin được xác thực bởi Hệ thống OCOP •{' '}
          <Link href="/" className="text-emerald-800 font-bold hover:underline">
            ocop.vn
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function TracePage({ params }: PageProps) {
  const { code } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="flex flex-col items-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Đang tải thông tin truy xuất...</p>
          </div>
        </div>
      }
    >
      <TraceContent code={code} />
    </Suspense>
  );
}
