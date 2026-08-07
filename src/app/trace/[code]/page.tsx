'use client';

import React, { useEffect } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
} from 'lucide-react';

import {
  useTraceDetailQuery,
  useRecordScanMutation,
} from '@/features/products/hooks/usePublicProducts';
import { ProductJournal } from '@/features/products/types/productTypes';

interface PageProps {
  params: Promise<{ code: string }>;
}

export default function TracePage({ params }: PageProps) {
  const { code } = use(params);
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
            className="mt-2 px-6 py-2.5 bg-green-700 text-white rounded-xl text-sm font-bold hover:bg-green-800 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { product, qr, journals, scanCount, lot } = data.data;
  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header bar */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-center shadow-sm relative z-10">
        <span className="text-sm font-black uppercase tracking-widest">TRUY XUẤT NGUỒN GỐC</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Khối Xác minh Sản phẩm */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Xác minh sản phẩm
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Trạng thái mã</span>
              <span className="text-sm font-bold text-green-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Hợp lệ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Mức độ xác minh</span>
              <span className="text-sm font-bold text-stone-900">
                {qr.isCertified ? 'Đã được sàn đối chiếu hồ sơ' : 'Chưa xác minh hồ sơ'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Blockchain</span>
              <span className="text-sm font-bold text-stone-900">{qr.blockchainStatus}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Lượt quét mã</span>
              <span className="text-sm font-bold text-stone-900">{scanCount} lần</span>
            </div>
          </div>
        </div>

        {/* Khối Thông tin OCOP */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Thông tin OCOP
            </h2>
          </div>
          <div className="p-4">
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-stone-200">
                <Image
                  src={product.thumbnailUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="text-base font-black text-stone-900 leading-tight">
                  {product.name}
                </h3>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Chủ thể</span>
                    <span className="text-xs font-bold text-stone-900 truncate max-w-[150px]">
                      {product.shop.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Hạng sao</span>
                    <span className="text-xs font-bold text-amber-600">{product.ocopStar} sao</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-500">Số chứng nhận</span>
                    <span className="text-xs font-bold text-stone-900">
                      {product.certificationNumber || 'Đang cập nhật'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Khối Thông tin Lô hàng (Nếu có) */}
        {lot && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center gap-3">
              <Package className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Thông tin Lô Hàng
              </h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-500">Mã lô</span>
                <span className="text-sm font-bold text-stone-900">{lot.lotCode}</span>
              </div>
              {lot.variantName && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-500">Quy cách</span>
                  <span className="text-sm font-bold text-stone-900">{lot.variantName}</span>
                </div>
              )}
              {lot.productionDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-500">Ngày sản xuất</span>
                  <span className="text-sm font-bold text-stone-900">
                    {new Date(lot.productionDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              {lot.expiryDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-500">Hạn sử dụng</span>
                  <span className="text-sm font-bold text-stone-900">
                    {new Date(lot.expiryDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Khối Thông tin chi tiết truy xuất (Mới) */}
        {(product.ingredients ||
          product.packagingMaterial ||
          product.appliedStandards ||
          product.complianceDocuments) && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Thông tin sản phẩm bổ sung
              </h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {product.ingredients && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-stone-500 uppercase">Thành phần</span>
                  <span className="text-sm text-stone-800">{product.ingredients}</span>
                </div>
              )}
              {product.packagingMaterial && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    Chất liệu bao bì
                  </span>
                  <span className="text-sm text-stone-800">{product.packagingMaterial}</span>
                </div>
              )}
              {product.appliedStandards && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    Tiêu chuẩn áp dụng
                  </span>
                  <span className="text-sm text-stone-800">{product.appliedStandards}</span>
                </div>
              )}
              {product.complianceDocuments && (
                <div className="flex flex-col gap-1 mt-1">
                  <span className="text-xs font-bold text-stone-500 uppercase">
                    Tài liệu công bố
                  </span>
                  <div className="flex flex-col gap-2 mt-1">
                    {product.complianceDocuments.split(',').map((docLink, idx) => (
                      <a
                        key={idx}
                        href={docLink.trim()}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-4 h-4" /> Xem tài liệu {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Khối Hành trình sản phẩm / Hành trình lô */}
        {(lot?.steps?.length ? lot.steps.length > 0 : sortedJournals.length > 0) && (
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
            <div className="p-4 border-b border-stone-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                {lot?.steps?.length ? 'Hành trình Lô hàng' : 'Hành trình sản phẩm'}
              </h2>
            </div>
            <div className="p-5">
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-200" />
                <div className="flex flex-col gap-6">
                  {lot?.steps?.length
                    ? lot.steps.map((step, index) => (
                        <div key={index} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-white border-[3px] border-indigo-600 shrink-0 z-10 mt-0.5" />
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0 last:pb-0">
                            <h3 className="text-sm font-bold text-stone-900">{step.stepType}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(step.recordedAt).toLocaleDateString('vi-VN')}
                            </div>
                            {/* Parse JSON string data if it is stringified, else assume object */}
                            {(() => {
                              try {
                                const dataObj =
                                  typeof step.data === 'string'
                                    ? JSON.parse(step.data as unknown as string)
                                    : step.data;
                                return (
                                  <div className="text-xs text-stone-600 mt-1 bg-stone-50 p-2 rounded-md">
                                    {Object.entries(dataObj).map(([k, v]) => (
                                      <div key={k} className="mb-1">
                                        <span className="font-semibold text-stone-700 capitalize">
                                          {k.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                                        </span>
                                        {String(v)}
                                      </div>
                                    ))}
                                  </div>
                                );
                              } catch {
                                return null;
                              }
                            })()}
                          </div>
                        </div>
                      ))
                    : sortedJournals.map((journal: ProductJournal) => (
                        <div key={journal.id} className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-white border-[3px] border-green-600 shrink-0 z-10 mt-0.5" />
                          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pb-2 border-b border-stone-50 last:border-0 last:pb-0">
                            <h3 className="text-sm font-bold text-stone-900">{journal.title}</h3>
                            <div className="flex items-center gap-1.5 text-xs text-stone-500">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(journal.activityDate).toLocaleDateString('vi-VN')}
                            </div>
                            {journal.location && (
                              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                <Store className="w-3.5 h-3.5" />
                                <span className="truncate">{journal.location}</span>
                              </div>
                            )}
                            <p className="text-sm text-stone-600 mt-1">{journal.description}</p>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Khối Tài liệu chứng minh */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Tài liệu chứng minh
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100">
              <span className="text-sm font-medium text-stone-700">Chứng nhận OCOP</span>
              <span className="text-xs font-bold text-green-700 px-2 py-1 bg-green-100 rounded-md">
                Đã xác minh
              </span>
            </div>
            {/* Có thể thêm Phiếu kiểm nghiệm, Giấy VSATTP nếu Backend trả về trong tương lai */}
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg border border-stone-100 opacity-60">
              <span className="text-sm font-medium text-stone-700">Phiếu kiểm nghiệm</span>
              <span className="text-xs font-bold text-stone-500">Chưa có dữ liệu</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 font-medium mt-4">
          Thông tin được xác thực bởi Hệ thống OCOP •{' '}
          <Link href="/" className="text-green-700 font-bold hover:underline">
            ocop.vn
          </Link>
        </p>
      </div>
    </div>
  );
}
