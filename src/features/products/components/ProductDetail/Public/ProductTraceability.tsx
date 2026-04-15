'use client';

import React from 'react';
import Image from 'next/image';
import QRCode from 'react-qr-code';
import { CheckCircle2, ShieldCheck, Calendar, MapPin, QrCode, Award, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductJournal, ProductQrCode } from '@/features/products/types/productTypes';
import {
  useRecordScanMutation,
  useTraceDetailQuery,
} from '@/features/products/hooks/usePublicProducts';

interface ProductTraceabilityProps {
  journals: ProductJournal[];
  qrCode?: ProductQrCode | null;
}

export function ProductTraceability({ journals = [], qrCode }: ProductTraceabilityProps) {
  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);
  const code = qrCode?.qrCode;

  // Track scan
  const { mutate: recordScan } = useRecordScanMutation();
  const { data: traceData } = useTraceDetailQuery(code);

  React.useEffect(() => {
    if (code) {
      recordScan(code);
    }
  }, [code, recordScan]);

  const scanCount = traceData?.data?.scanCount ?? qrCode?.scanCount ?? 0;

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
              Minh bạch hành trình trang trại đến bàn ăn thông qua công nghệ Blockchain.
            </p>
          </div>

          {/* Certification Badges */}
          <div className="flex flex-wrap gap-3">
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
          </div>
        </div>

        {/* QR Scanner Mock UI */}
        <div className="relative group">
          <div className="absolute -inset-4 bg-linear-to-r from-green-600 to-emerald-600 rounded-4xl opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />
          <div className="relative bg-white p-4 rounded-2xl shadow-xl border border-stone-100 flex flex-col gap-3 overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                  Kiểm chứng trực tiếp
                </span>
                <h4 className="text-sm font-bold text-stone-900 leading-tight">Mã QR Blockchain</h4>
              </div>
              <QrCode className="w-5 h-5 text-green-700" />
            </div>

            <div className="aspect-square w-full max-w-[130px] mx-auto p-3 bg-white rounded-2xl border border-stone-200 flex items-center justify-center">
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
              <div className="p-2.5 bg-green-50 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 bg-white rounded flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-green-800 uppercase tracking-wider leading-none mb-0.5">
                      Trạng thái
                    </p>
                    <p className="text-[11px] font-bold text-green-900">Đã xác minh</p>
                  </div>
                </div>
                <div className="flex flex-col items-end border-l border-green-200 pl-4">
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

      {/* Timeline Section */}
      <div className="flex flex-col gap-8">
        <div className="text-center">
          <h3 className="text-lg font-black text-stone-900 tracking-tight mb-0.5">
            Nhật ký sản xuất
          </h3>
          <p className="text-stone-500 text-[11px] font-medium">
            Ghi chép chi tiết từng công đoạn tại nhà xưởng
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
                          {journal.images.filter(Boolean).map((img, idx) => (
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
    </div>
  );
}
