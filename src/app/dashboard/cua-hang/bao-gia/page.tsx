'use client';

import React from 'react';
import { useSellerQuotations } from '@/features/quotations/hooks/useQuotations';
import { ReplyQuotationModal } from '@/features/quotations/components/ReplyQuotationModal';
import { Quotation } from '@/features/quotations/types/quotationTypes';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/AppButton';
import { Loader2, MessageSquareQuote, Inbox, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ xử lý',
    className: 'bg-amber-100 text-amber-700 animate-pulse border border-amber-200',
  },
  REPLIED: { label: 'Đã báo giá', className: 'bg-green-100 text-green-700' },
  ACCEPTED: { label: 'Khách đã mua', className: 'bg-blue-100 text-blue-700 font-black' },
  REJECTED: { label: 'Đã từ chối', className: 'bg-stone-100 text-stone-500' },
  EXPIRED: { label: 'Hết hạn', className: 'bg-stone-200 text-stone-500' },
};

export default function SellerQuotationPage() {
  const { data: res, isLoading } = useSellerQuotations();
  const [selectedQuotation, setSelectedQuotation] = React.useState<Quotation | null>(null);
  const quotations = res?.data?.items || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-stone-500 font-bold">Đang tải yêu cầu báo giá sỉ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Yêu cầu báo giá sỉ (B2B)
          </h1>
          <p className="text-stone-500 text-sm font-medium">
            Xử lý các yêu cầu số lượng lớn từ khách hàng đối tác
          </p>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
          <Clock className="text-amber-600" size={20} />
          <div>
            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none">
              Chờ xử lý
            </p>
            <p className="text-lg font-black text-amber-900 leading-none mt-1">
              {quotations.filter((q: Quotation) => q.status === 'PENDING').length} yêu cầu
            </p>
          </div>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-stone-200 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4">
            <Inbox size={40} />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Chưa có yêu cầu nào</h3>
          <p className="text-stone-500 text-sm max-w-xs mt-1">
            Các yêu cầu báo giá sỉ từ người mua sẽ xuất hiện tại đây. Hãy tối ưu giá sỉ để thu hút
            khách hàng lớn.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {quotations.map((q: Quotation) => (
            <SellerQuotationCard key={q.id} quotation={q} onReply={() => setSelectedQuotation(q)} />
          ))}
        </div>
      )}

      {selectedQuotation && (
        <ReplyQuotationModal
          isOpen={!!selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
          quotation={selectedQuotation}
        />
      )}
    </div>
  );
}

function SellerQuotationCard({
  quotation,
  onReply,
}: {
  quotation: Quotation;
  onReply: () => void;
}) {
  const status = STATUS_MAP[quotation.status] || { label: quotation.status, className: '' };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl border transition-all hover:border-green-200 hover:shadow-lg overflow-hidden',
        quotation.status === 'PENDING'
          ? 'border-amber-200 shadow-sm shadow-amber-50'
          : 'border-stone-100',
      )}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-5">
          {/* Buyer Info & Status */}
          <div className="w-full sm:w-48 shrink-0 space-y-3">
            <div className="flex items-center justify-between sm:block">
              <span
                className={cn(
                  'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                  status.className,
                )}
              >
                {status.label}
              </span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                Người mua
              </p>
              <h5 className="font-bold text-stone-900 truncate">{quotation.buyerName}</h5>
              <p className="text-[10px] text-stone-500 truncate">{quotation.buyerEmail}</p>
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-black text-stone-900 text-lg leading-tight">
                    {quotation.productName}
                  </h4>
                  <p className="text-xs text-stone-600 font-bold bg-stone-100 px-2 py-0.5 rounded inline-block mt-1">
                    {quotation.variantName || 'Mặc định'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 mt-2">
                <div>
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">
                    Số lượng
                  </p>
                  <p className="text-lg font-black text-stone-900">{quotation.quantity}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">
                    Khách kỳ vọng
                  </p>
                  <p className="text-lg font-black text-stone-900">
                    {quotation.expectedPrice?.toLocaleString('vi-VN')}₫
                  </p>
                </div>
                {quotation.quotedPrice && (
                  <div>
                    <p className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">
                      Giá đã báo
                    </p>
                    <p className="text-lg font-black text-green-700">
                      {quotation.quotedPrice.toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">
                    Ngày gửi
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    {format(new Date(quotation.createdAt as string | number), 'dd/MM/yyyy', {
                      locale: vi,
                    })}
                  </p>
                </div>
              </div>
            </div>

            {quotation.note && (
              <div className="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-1">
                  <MessageSquareQuote size={12} /> Lời nhắn từ khách
                </p>
                <p className="text-sm text-blue-900 italic font-medium">
                  &quot;{quotation.note}&quot;
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {quotation.status === 'PENDING' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onReply}
                  className="rounded-xl h-10 px-6 font-black shadow-lg shadow-green-600/20"
                >
                  Xử lý báo giá ngay
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
