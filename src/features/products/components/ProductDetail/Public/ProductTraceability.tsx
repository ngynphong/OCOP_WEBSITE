'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  MapPin,
  QrCode,
  Package,
  ArrowRight,
  X,
  ExternalLink,
  Copy,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductJournal, ProductQrCode } from '@/features/products/types/productTypes';
import {
  useRecordScanMutation,
  useTraceDetailQuery,
} from '@/features/products/hooks/usePublicProducts';
import { useAppSelector } from '@/store/hooks';
import { useQuery } from '@tanstack/react-query';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import toast from 'react-hot-toast';

interface ProductTraceabilityProps {
  journals: ProductJournal[];
  qrCode?: ProductQrCode | null;
  productId?: number;
}

export function ProductTraceability({
  journals = [],
  qrCode,
  productId,
}: ProductTraceabilityProps) {
  const [selectedLotForQr, setSelectedLotForQr] = useState<ISupplyChainLot | null>(null);
  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);
  const code = qrCode?.qrCode;

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Track scan
  const { mutate: recordScan } = useRecordScanMutation();
  const { data: traceData } = useTraceDetailQuery(code, {
    enabled: !!code && isAuthenticated,
  });

  // Query real production lots for this product
  const { data: lotsResp, isLoading: isLoadingLots } = useQuery({
    queryKey: ['public-product-lots', productId],
    queryFn: () => supplyChainApi.getPublicLots({ productId: productId!, page: 0, size: 6 }),
    enabled: !!productId,
    staleTime: 60 * 1000,
  });

  const lots: ISupplyChainLot[] = lotsResp?.data?.content || [];

  React.useEffect(() => {
    if (code && isAuthenticated) {
      recordScan(code);
    }
  }, [code, recordScan, isAuthenticated]);

  const scanCount = traceData?.data?.scanCount ?? qrCode?.scanCount ?? 0;

  const handleCopyLotUrl = (lotCode: string) => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/truy-xuat/${lotCode}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success('Đã sao chép liên kết truy xuất lô!');
    }
  };

  return (
    <div className="flex flex-col gap-8 py-6 border-t border-stone-100">
      {/* Header & QR Verification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-700 shadow-sm">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight">
                Niềm tin từ nguồn gốc
              </h2>
            </div>
            <p className="text-stone-500 font-medium text-sm leading-relaxed">
              Minh bạch hành trình trang trại đến bàn ăn thông qua mã QR.
            </p>
          </div>

          {/* Certification Badges */}
          {/* <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-wider">
                VietGAP
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-wider">
                VSATTP
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-100">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-black text-stone-900 uppercase tracking-wider">
                GlobalGAP
              </span>
            </div>
          </div> */}
        </div>

        {/* QR Scanner Mock UI */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-4xl opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
          <div className="relative bg-white p-4 rounded-xl shadow-xl border border-stone-100 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                  Kiểm chứng trực tiếp
                </span>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">Mã QR Blockchain</h4>
              </div>
              <QrCode className="w-5 h-5 text-green-700" />
            </div>

            <div className="aspect-square w-full max-w-[130px] mx-auto p-3 bg-white rounded-xl border border-stone-200 flex items-center justify-center">
              {qrCode?.qrUrl ? (
                <QRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}${qrCode.qrUrl}`}
                  size={104}
                  level="M"
                />
              ) : (
                <QrCode className="w-16 h-16 text-stone-300" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div
                className={cn(
                  'p-2.5 rounded-lg flex items-center justify-between gap-4 border',
                  qrCode?.isVerified
                    ? 'bg-green-50/80 border-green-200'
                    : qrCode
                      ? 'bg-amber-50/80 border-amber-200'
                      : 'bg-stone-50 border-stone-200',
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-xs">
                    {qrCode?.isVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        'text-[8px] font-black uppercase tracking-wider leading-none mb-0.5',
                        qrCode?.isVerified
                          ? 'text-green-800'
                          : qrCode
                            ? 'text-amber-800'
                            : 'text-stone-500',
                      )}
                    >
                      Trạng thái
                    </p>
                    <p
                      className={cn(
                        'text-[11px] font-bold',
                        qrCode?.isVerified
                          ? 'text-green-900'
                          : qrCode
                            ? 'text-amber-900'
                            : 'text-stone-700',
                      )}
                    >
                      {qrCode?.isVerified
                        ? 'Đã xác minh'
                        : qrCode
                          ? 'Chờ kiểm chứng'
                          : 'Chưa kích hoạt'}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    'flex flex-col items-end border-l pl-4',
                    qrCode?.isVerified ? 'border-green-200' : 'border-stone-200',
                  )}
                >
                  <p className="text-[8px] font-black text-stone-400 uppercase tracking-wider leading-none mb-0.5">
                    Số lượt quét
                  </p>
                  <p className="text-[11px] font-bold text-stone-900">{scanCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Production Lots Section */}
      <div className="flex flex-col gap-6 pt-8 border-t border-stone-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <Package className="w-5 h-5 text-emerald-700" />
              </span>
              <h3 className="text-xl font-black text-stone-900 tracking-tight">
                Lô sản xuất thực tế đang lưu hành
              </h3>
            </div>
            <p className="text-stone-500 text-xs mt-1.5 leading-relaxed">
              Mỗi lô hàng được gắn mã định danh độc bản GS1, ghi nhận ngày đóng gói, thời gian mùa
              vụ và nhật ký kiểm định thực tế.
            </p>
          </div>
          {lots.length > 0 && (
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              {lots.length} lô sản xuất đã kích hoạt
            </span>
          )}
        </div>

        {isLoadingLots ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-stone-50 rounded-2xl animate-pulse border border-stone-100"
              />
            ))}
          </div>
        ) : lots.length === 0 ? (
          <div className="p-8 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 text-center space-y-2">
            <Package className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-sm font-bold text-stone-700">
              Chưa có lô sản xuất nào được phát hành
            </p>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Nhà vườn hiện đang chuẩn bị mẻ thu hoạch và đóng gói mới. Quý khách có thể xem quy
              trình sản xuất chuẩn mực ở hành trình bên dưới.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-mono text-xs font-black text-stone-800 bg-stone-100 px-2.5 py-1 rounded-lg">
                      <Package size={13} className="text-stone-500" />
                      {lot.lotCode}
                    </div>
                    <LotStatusBadge status={lot.status as TLotStatus} />
                  </div>

                  {lot.variantName && (
                    <p className="text-xs font-bold text-stone-800 line-clamp-1">
                      {lot.variantName}
                    </p>
                  )}

                  <div className="space-y-1.5 text-xs text-stone-500">
                    {lot.productionDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-stone-400 shrink-0" />
                        <span>
                          Ngày SX:{' '}
                          <strong className="text-stone-700">
                            {new Date(lot.productionDate).toLocaleDateString('vi-VN')}
                          </strong>
                        </span>
                      </div>
                    )}
                    {lot.expiryDate && (
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-stone-400 shrink-0" />
                        <span>
                          HSD:{' '}
                          <strong className="text-stone-700">
                            {new Date(lot.expiryDate).toLocaleDateString('vi-VN')}
                          </strong>
                        </span>
                      </div>
                    )}
                    {(lot.farmName || lot.sourceCycleName) && (
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-stone-400 shrink-0" />
                        <span className="line-clamp-1">
                          Nguồn:{' '}
                          <strong className="text-stone-700">
                            {lot.farmName || lot.sourceCycleName}
                          </strong>
                        </span>
                      </div>
                    )}
                    {lot.responsiblePerson && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={13} className="text-stone-400 shrink-0" />
                        <span className="line-clamp-1">
                          Phụ trách:{' '}
                          <strong className="text-stone-700">{lot.responsiblePerson}</strong>
                        </span>
                      </div>
                    )}
                    {lot.rawYieldUsed && (
                      <div className="flex items-center gap-2 text-stone-600 bg-amber-50/70 p-2 rounded-lg border border-amber-100/80 text-[11px]">
                        <Sparkles size={12} className="text-amber-600 shrink-0" />
                        <span className="line-clamp-2">
                          Mẻ thu hoạch:{' '}
                          <strong>
                            {lot.rawYieldUsed} {lot.rawYieldUnit || 'kg'} thô
                          </strong>{' '}
                          &rarr; đóng gói{' '}
                          <strong>
                            {lot.quantity?.toLocaleString('vi-VN')} {lot.unit || 'thành phẩm'}
                          </strong>
                        </span>
                      </div>
                    )}
                  </div>

                  {lot.eventCount !== undefined && lot.eventCount > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-100">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>
                        Đã xác minh <strong>{lot.eventCount}</strong> sự kiện chuỗi cung ứng
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                  <Link
                    href={`/truy-xuat/${lot.lotCode}`}
                    className="flex-1 text-center py-2 px-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>Hồ sơ truy xuất lô</span>
                    <ArrowRight size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedLotForQr(lot)}
                    className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-stone-200 transition cursor-pointer"
                    title="Xem mã QR của lô này"
                  >
                    <QrCode size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Section: Storytelling (Giữ nguyên vẹn) */}
      <div className="flex flex-col gap-8 pt-8 border-t border-stone-100">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold mb-2">
            ✨ Hành trình sản phẩm OCOP
          </div>
          <h3 className="text-xl font-black text-stone-900 tracking-tight mb-1">
            Quy trình & Nhật ký sản xuất
          </h3>
          <p className="text-stone-500 text-xs font-medium max-w-xl mx-auto">
            Hành trình câu chuyện từ khâu tuyển chọn nguyên liệu, chăm sóc gieo trồng đến quy chuẩn
            đóng gói hoàn thiện
          </p>
        </div>

        <div className="relative pt-6">
          {/* Timeline vertical bar */}
          <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-stone-100 md:left-1/2 md:-ml-0.5" />

          <div className="flex flex-col gap-8 relative">
            {sortedJournals.map((journal, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={journal.id}
                  className={cn(
                    'flex flex-col relative md:flex-row md:items-center',
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse',
                  )}
                >
                  {/* Dot */}
                  <div className="absolute left-[15px] top-0 w-5 h-5 bg-white border-4 border-green-600 rounded-full z-10 md:left-1/2 md:-ml-2.5 md:top-1/2 md:-mt-2.5 shadow-[0_0_0_8px_white]" />

                  {/* Content side */}
                  <div
                    className={cn(
                      'pl-10 md:pl-0 md:w-1/2',
                      isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left',
                    )}
                  >
                    <div
                      className={cn(
                        'flex flex-col gap-3 group',
                        isEven ? 'md:items-end' : 'md:items-start',
                      )}
                    >
                      <div className="flex items-center gap-2 px-2 py-0.5 bg-green-50 text-green-700 rounded text-[9px] font-black uppercase tracking-wider w-fit">
                        B. {journal.stepOrder}
                        {journal.blockchainStatus === 'CONFIRMED' && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                      </div>

                      <h3 className="text-base font-black text-stone-900 group-hover:text-green-700 transition-colors leading-tight">
                        {journal.title}
                      </h3>

                      <div
                        className={cn(
                          'flex flex-wrap gap-3 text-[9px] text-stone-400 font-black uppercase tracking-[0.2em]',
                          isEven ? 'justify-end' : 'justify-start',
                        )}
                      >
                        <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 rounded-sm">
                          <Calendar className="w-2.5 h-2.5 text-stone-300" />
                          {new Date(journal.activityDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-1.5 bg-stone-50 px-2 py-0.5 rounded-sm">
                          <MapPin className="w-2.5 h-2.5 text-stone-300" />
                          {journal.location}
                        </div>
                      </div>

                      <p className="text-stone-600 leading-relaxed font-medium text-sm">
                        {journal.description}
                      </p>

                      {journal.images && journal.images.length > 0 && (
                        <div
                          className={cn(
                            'flex flex-wrap gap-2 mt-3',
                            isEven ? 'justify-end' : 'justify-start',
                          )}
                        >
                          {journal.images
                            .filter((img) =>
                              Boolean(img && typeof img === 'string' && img.trim() !== ''),
                            )
                            .map((img, idx) => (
                              <div
                                key={idx}
                                className="relative w-14 h-14 rounded-lg overflow-hidden shadow-md border border-stone-100 hover:scale-110 transition-all cursor-pointer"
                              >
                                <Image
                                  src={img}
                                  alt={`${journal.title} ${idx}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Empty side for layout on desktop */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal QR Code Lô sản xuất */}
      {selectedLotForQr && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-stone-100 flex flex-col gap-5 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedLotForQr(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <QrCode size={20} />
              </div>
              <div>
                <h4 className="text-base font-black text-stone-900 leading-tight">
                  Mã QR Lô sản xuất
                </h4>
                <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
                  #{selectedLotForQr.lotCode}
                </p>
              </div>
            </div>

            {/* QR Box */}
            <div className="p-5 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center gap-3">
              <div className="bg-white p-3.5 rounded-xl shadow-xs border border-stone-100">
                <QRCode
                  value={`${typeof window !== 'undefined' ? window.location.origin : ''}/truy-xuat/${selectedLotForQr.lotCode}`}
                  size={168}
                  level="Q"
                />
              </div>
              <p className="text-[11px] text-stone-500 text-center max-w-[220px]">
                Quét bằng camera điện thoại để kiểm chứng nhật ký chuỗi cung ứng thực tế
              </p>
            </div>

            {/* Lot details */}
            <div className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-100 text-xs space-y-1.5 text-stone-600">
              {selectedLotForQr.variantName && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Phân loại:</span>
                  <span className="font-bold text-stone-800">{selectedLotForQr.variantName}</span>
                </div>
              )}
              {selectedLotForQr.productionDate && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Ngày sản xuất:</span>
                  <span className="font-bold text-stone-800">
                    {new Date(selectedLotForQr.productionDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              {selectedLotForQr.expiryDate && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Hạn sử dụng:</span>
                  <span className="font-bold text-stone-800">
                    {new Date(selectedLotForQr.expiryDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
              {selectedLotForQr.farmName && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Nông trại / Cơ sở:</span>
                  <span className="font-bold text-stone-800">{selectedLotForQr.farmName}</span>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => handleCopyLotUrl(selectedLotForQr.lotCode)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} />
                <span>Sao chép link</span>
              </button>
              <Link
                href={`/truy-xuat/${selectedLotForQr.lotCode}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-200"
              >
                <span>Hồ sơ chi tiết</span>
                <ExternalLink size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
