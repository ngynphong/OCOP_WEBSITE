import React from 'react';
import Link from 'next/link';
import { Ticket, PlusCircle, Check } from 'lucide-react';
import type { EventVoucher } from '@/features/events/types/eventCommerceTypes';

export interface EventLandingVoucherSectionProps {
  eventId: number;
  vouchers: EventVoucher[];
  savedVoucherIds: Set<number>;
  onSaveVoucher: (voucher: EventVoucher) => void;
  isMobile: boolean;
  device?: 'desktop' | 'tablet' | 'mobile';
  isCustomerView?: boolean;
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(val);
};

export const EventLandingVoucherSection: React.FC<EventLandingVoucherSectionProps> = ({
  eventId,
  vouchers,
  savedVoucherIds,
  onSaveVoucher,
  isMobile,
  device = 'desktop',
  isCustomerView = true,
}) => {
  if (!vouchers || vouchers.length === 0) {
    if (!isCustomerView) {
      return (
        <section
          id="vouchers"
          className={`w-full max-w-7xl mx-auto scroll-mt-24 ${
            isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className="rounded-3xl p-6 sm:p-8 border-2 border-dashed text-center bg-white"
            style={{
              borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.12))',
            }}
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <Ticket className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Chưa gán Voucher cho sự kiện</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Thêm các voucher để kích thích người mua hàng đặt đơn.
            </p>
            <Link
              href={`/admin/events/${eventId}/commerce`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-amber-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm Voucher</span>
            </Link>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section
      id="vouchers"
      className={`w-full max-w-7xl mx-auto scroll-mt-24 ${
        isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'
      }`}
    >
      <div
        className={`border backdrop-blur-md shadow-md transition-all duration-300 ${
          isMobile ? 'rounded-2xl p-3' : 'rounded-3xl p-4 sm:p-8'
        }`}
        style={{
          backgroundColor: 'var(--event-card-bg, #FFFFFF)',
          borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
              style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
            >
              <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2
                className={`${
                  isMobile ? 'text-base' : 'text-lg sm:text-2xl'
                } font-black text-slate-900 uppercase tracking-wider`}
              >
                Mã Giảm Giá
              </h2>
              <p className="text-xs text-slate-500">
                Lưu voucher độc quyền áp dụng cho toàn bộ sản phẩm OCOP
              </p>
            </div>
          </div>
        </div>

        <div
          className={`grid ${
            isMobile
              ? 'grid-cols-1 gap-2.5'
              : device === 'tablet'
                ? 'grid-cols-2 gap-3'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          }`}
        >
          {vouchers.map((v) => {
            const isSaved =
              savedVoucherIds.has(v.id) || (v.voucherId ? savedVoucherIds.has(v.voucherId) : false);
            const isExpired = v.status === 'EXPIRED';
            const isExhausted = v.usageLimit != null && v.usedCount >= v.usageLimit;
            const isUnavailable =
              v.isUsable === false || v.status !== 'ACTIVE' || isExpired || isExhausted;
            const unavailableLabel = isExpired
              ? 'Hết hạn'
              : isExhausted
                ? 'Đã hết lượt'
                : 'Không khả dụng';

            return (
              <div
                key={v.id}
                className="rounded-2xl border border-dashed p-3.5 flex flex-col justify-between transition-all shadow-2xs"
                style={{
                  backgroundColor: 'var(--event-surface, #FFFBEB)',
                  borderColor: 'var(--event-primary, #DC2626)',
                }}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: 'var(--event-glow, rgba(220, 38, 38, 0.15))',
                        color: 'var(--event-primary, #DC2626)',
                      }}
                    >
                      {v.code}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {v.type === 'PERCENT' ? `Giảm ${v.discountValue}%` : 'Giảm tiền mặt'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-2">{v.name}</h4>

                  <p className="text-xs text-slate-600 mt-1">
                    Đơn tối thiểu {formatCurrency(v.minOrderValue)}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {v.usedCount} lượt dùng
                  </span>
                  <button
                    type="button"
                    onClick={() => onSaveVoucher(v)}
                    disabled={isSaved || isUnavailable}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                      isUnavailable
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : isSaved
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-900 font-bold hover:opacity-90 shadow-2xs cursor-pointer'
                    }`}
                    style={
                      !isSaved && !isUnavailable
                        ? { backgroundColor: 'var(--event-secondary, #F59E0B)' }
                        : undefined
                    }
                  >
                    {isUnavailable ? (
                      <span>{unavailableLabel}</span>
                    ) : isSaved ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Đã lưu</span>
                      </>
                    ) : (
                      <span>Lưu mã</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
