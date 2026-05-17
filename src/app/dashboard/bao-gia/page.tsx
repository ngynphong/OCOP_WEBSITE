'use client';

import React from 'react';
import { useMyQuotations, useAcceptQuotation } from '@/features/quotations/hooks/useQuotations';
import { Quotation } from '@/features/quotations/types/quotationTypes';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/AppButton';
import { Loader2, MessageSquareQuote, Filter, ShoppingBag, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Chờ phản hồi', className: 'bg-stone-100 text-stone-600' },
  REPLIED: {
    label: 'Đã báo giá',
    className: 'bg-green-100 text-green-700 animate-pulse border border-green-200',
  },
  ACCEPTED: { label: 'Đã đồng ý', className: 'bg-blue-100 text-blue-700' },
  REJECTED: { label: 'Đã từ chối', className: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Hết hạn', className: 'bg-stone-200 text-stone-500' },
};

export default function BuyerQuotationPage() {
  const { data: res, isLoading } = useMyQuotations();
  const quotations = res?.data?.items || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
        <p className="text-stone-500 font-bold">Đang tải danh sách báo giá...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">
            Yêu cầu báo giá của tôi
          </h1>
          <p className="text-stone-500 text-sm font-medium">
            Theo dõi các yêu cầu mua sỉ và báo giá từ chủ thể
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter size={16} />}
            className="rounded-xl border-stone-200"
          >
            Lọc
          </Button>
        </div>
      </div>

      {quotations.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-dashed border-stone-200 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-300 mb-4">
            <MessageSquareQuote size={40} />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Chưa có yêu cầu báo giá nào</h3>
          <p className="text-stone-500 text-sm max-w-xs mt-1">
            Bạn có thể gửi yêu cầu báo giá sỉ cho sản phẩm bất kỳ để nhận giá ưu đãi cho số lượng
            lớn.
          </p>
          <Button
            variant="primary"
            className="mt-6 rounded-xl"
            onClick={() => (window.location.href = '/san-pham')}
          >
            Khám phá sản phẩm
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {quotations.map((q: Quotation) => (
            <QuotationCard key={q.id} quotation={q} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuotationCard({ quotation }: { quotation: Quotation }) {
  const status = STATUS_MAP[quotation.status] || { label: quotation.status, className: '' };
  const { mutate: acceptQuotation, isPending } = useAcceptQuotation();

  const handleAccept = () => {
    acceptQuotation(quotation.id);
  };

  return (
    <div
      className={cn(
        'bg-white rounded-3xl border transition-all hover:shadow-xl hover:border-green-200 overflow-hidden',
        quotation.status === 'REPLIED'
          ? 'border-green-200 shadow-sm shadow-green-100 ring-1 ring-green-100'
          : 'border-stone-100',
      )}
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Shop & Status - Mobile */}
          <div className="flex items-center justify-between lg:hidden border-b border-stone-50 pb-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Shop:
              </span>
              <span className="text-xs font-black text-stone-900">{quotation.shopName}</span>
            </div>
            <span
              className={cn(
                'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                status.className,
              )}
            >
              {status.label}
            </span>
          </div>

          {/* Left Column: Product Info */}
          <div className="flex gap-4 lg:w-1/3">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-50 shrink-0 border border-stone-100 shadow-inner">
              <div className="absolute inset-0 flex items-center justify-center text-stone-300">
                <MessageSquareQuote size={32} />
              </div>
            </div>
            <div className="min-w-0">
              <span className="hidden lg:inline-block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                Shop: {quotation.shopName}
              </span>
              <h4 className="font-black text-stone-900 text-lg leading-tight mb-1 line-clamp-2">
                {quotation.productName}
              </h4>
              <p className="text-xs text-stone-500 font-bold bg-stone-50 px-2 py-1 rounded-lg inline-block">
                {quotation.variantName || 'Mặc định'}
              </p>
            </div>
          </div>

          {/* Middle Column: Specs & Pricing */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 lg:py-0 border-y lg:border-none border-stone-50">
              <div className="min-w-fit">
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1">
                  Số lượng
                </p>
                <p className="text-base font-black text-stone-900 whitespace-nowrap">
                  {quotation.quantity.toLocaleString('vi-VN')}
                </p>
              </div>
              <div className="min-w-fit">
                <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">
                  Giá kỳ vọng
                </p>
                <p className="text-base font-black text-stone-900 whitespace-nowrap">
                  {quotation.expectedPrice?.toLocaleString('vi-VN')}₫
                </p>
              </div>

              {quotation.quotedPrice ? (
                <div className="min-w-fit">
                  <p className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">
                    Giá Shop báo
                  </p>
                  <p className="text-base font-black text-green-700 whitespace-nowrap">
                    {quotation.quotedPrice.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              ) : (
                <div className="p-2 min-w-fit">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">
                    Giá Shop báo
                  </p>
                  <p className="text-sm font-bold text-stone-300 italic whitespace-nowrap">
                    Đang chờ...
                  </p>
                </div>
              )}

              {quotation.shippingFee !== null && (
                <div className="min-w-fit">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">
                    Phí ship
                  </p>
                  <p className="text-base font-black text-stone-900 whitespace-nowrap">
                    {quotation.shippingFee.toLocaleString('vi-VN')}₫
                  </p>
                </div>
              )}
            </div>

            {/* Reply / Note Area */}
            {(quotation.replyMessage || quotation.note) && (
              <div className="mt-4 space-y-3">
                {quotation.note && (
                  <div className="flex gap-2">
                    <span className="text-[10px] font-black text-stone-400 uppercase shrink-0 mt-1">
                      Ghi chú:
                    </span>
                    <p className="text-xs text-stone-600 italic break-words">
                      &quot;{quotation.note}&quot;
                    </p>
                  </div>
                )}
                {quotation.replyMessage && (
                  <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50 flex gap-3">
                    <MessageSquareQuote className="text-blue-400 shrink-0" size={16} />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                        Phản hồi từ Shop
                      </p>
                      <p className="text-sm text-blue-900 font-medium break-words leading-relaxed">
                        {quotation.replyMessage}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Actions & Time */}
          <div className="lg:w-1/6 flex flex-col justify-between items-end border-t lg:border-none border-stone-50 pt-4 lg:pt-0">
            <div className="hidden lg:block text-right mb-4">
              <span
                className={cn(
                  'px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider',
                  status.className,
                )}
              >
                {status.label}
              </span>
              {quotation.validUntil && (
                <p className="text-[10px] text-red-500 font-bold mt-2 flex items-center justify-end gap-1">
                  Hết hạn: {format(new Date(quotation.validUntil), 'dd/MM/yyyy')}
                </p>
              )}
            </div>

            <div className="w-full space-y-3">
              {quotation.status === 'REPLIED' && (
                <Button
                  variant="primary"
                  className="w-full rounded-2xl h-12 font-black shadow-xl shadow-green-600/20 text-sm gap-2"
                  leftIcon={<CheckCircle2 size={16} />}
                  onClick={handleAccept}
                  isLoading={isPending}
                  disabled={isPending}
                >
                  Chấp nhận báo giá
                </Button>
              )}

              {quotation.status === 'ACCEPTED' && quotation.checkoutToken && (
                <Link href={`/checkout/b2b/${quotation.checkoutToken}`}>
                  <Button
                    variant="primary"
                    className="w-full rounded-2xl h-12 font-black shadow-xl shadow-green-600/20 text-sm gap-2"
                    leftIcon={<ShoppingBag size={16} />}
                  >
                    Mua ngay
                  </Button>
                </Link>
              )}

              <p className="text-[10px] text-stone-400 font-medium text-right italic">
                Gửi lúc:{' '}
                {format(new Date(quotation.createdAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
