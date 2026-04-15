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
} from 'lucide-react';
import { cn } from '@/lib/utils';
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

  const { product, qr, journals, scanCount } = data.data;
  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header bar */}
      <div className="bg-green-700 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">
            Truy xuất nguồn gốc OCOP
          </span>
        </div>
        <span className="text-[10px] font-mono bg-green-800 px-2 py-1 rounded opacity-80">
          {code}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Product card */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="flex gap-4 p-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
              <Image src={product.thumbnailUrl} alt={product.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-base font-black text-stone-900 leading-tight line-clamp-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-1.5 text-amber-500">
                {Array.from({ length: Number(product.ocopStar) || 0 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider ml-1">
                  OCOP {product.ocopStar} sao
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {product.shop.logoUrl && (
                  <div className="relative w-4 h-4 rounded-full overflow-hidden border border-stone-100">
                    <Image
                      src={product.shop.logoUrl}
                      alt={product.shop.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <Store className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs text-stone-500 font-medium truncate">
                  {product.shop.name}
                </span>
              </div>
              {product.certificationNumber && (
                <div className="flex items-center gap-1 mt-1">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span className="text-[10px] font-mono text-stone-400">
                    Chứng nhận: {product.certificationNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Blockchain status */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-5 flex flex-col gap-4">
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            Trạng thái xác minh
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                'flex items-center gap-2.5 px-3 py-3 rounded-2xl',
                qr.isCertified ? 'bg-green-50' : 'bg-red-50',
              )}
            >
              {qr.isCertified ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">
                  Xác minh
                </p>
                <p
                  className={cn(
                    'text-xs font-bold',
                    qr.isCertified ? 'text-green-700' : 'text-red-600',
                  )}
                >
                  {qr.isCertified ? 'Đã xác minh' : 'Chưa xác minh'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-3 rounded-2xl bg-stone-50">
              <ShieldCheck className="w-5 h-5 text-stone-400 shrink-0" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-wider text-stone-400">
                  Blockchain
                </p>
                <p className="text-xs font-bold text-stone-700">{qr.blockchainStatus}</p>
              </div>
            </div>
          </div>
          {qr.blockchainRootHash && (
            <div className="bg-stone-50 rounded-xl px-3 py-2.5">
              <p className="text-[9px] font-black uppercase tracking-wider text-stone-400 mb-1">
                Root Hash
              </p>
              <p className="text-[10px] font-mono text-stone-600 break-all">
                {qr.blockchainRootHash}
              </p>
            </div>
          )}
          <div className="flex items-center justify-between pt-1 border-t border-stone-100">
            <span className="text-xs text-stone-400 font-medium">Tổng lượt quét</span>
            <span className="text-sm font-black text-stone-900">{scanCount}</span>
          </div>
        </div>

        {/* Production journal timeline */}
        {sortedJournals.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-5 flex flex-col gap-5">
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Nhật ký sản xuất
            </h2>
            <div className="relative">
              {/* Vertical bar */}
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-stone-100" />
              <div className="flex flex-col gap-6">
                {sortedJournals.map((journal: ProductJournal) => (
                  <div key={journal.id} className="flex gap-4 relative">
                    {/* Dot */}
                    <div className="w-6 h-6 rounded-full bg-white border-[3px] border-green-600 shrink-0 z-10 mt-0.5 shadow-[0_0_0_4px_white]" />
                    <div className="flex flex-col gap-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-green-50 text-green-700 rounded">
                          Bước {journal.stepOrder}
                        </span>
                        {journal.blockchainStatus === 'CONFIRMED' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                        )}
                      </div>
                      <h3 className="text-sm font-black text-stone-900 leading-tight">
                        {journal.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                          <Calendar className="w-3 h-3" />
                          {new Date(journal.activityDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-stone-400 font-medium">
                          <MapPin className="w-3 h-3" />
                          {journal.location}
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {journal.description}
                      </p>
                      {journal.images && journal.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-1">
                          {journal.images.filter(Boolean).map((img, idx) => (
                            <div
                              key={idx}
                              className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-100"
                            >
                              <Image
                                src={img}
                                alt={`${journal.title} ${idx + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-stone-400 font-medium pb-4">
          Thông tin được xác thực bởi hệ thống OCOP Blockchain •{' '}
          <Link href="/" className="text-green-700 font-bold hover:underline">
            ocop.vn
          </Link>
        </p>
      </div>
    </div>
  );
}
