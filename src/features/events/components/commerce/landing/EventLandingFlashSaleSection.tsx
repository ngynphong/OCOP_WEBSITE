import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShoppingBag, PlusCircle } from 'lucide-react';
import type { EventFlashSale } from '@/features/events/types/eventCommerceTypes';

export interface EventLandingFlashSaleSectionProps {
  eventId: number;
  flashSales: EventFlashSale[];
  activeSale: EventFlashSale | null;
  onSelectSlot: (slotId: number) => void;
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

export const EventLandingFlashSaleSection: React.FC<EventLandingFlashSaleSectionProps> = ({
  eventId,
  flashSales,
  activeSale,
  onSelectSlot,
  isMobile,
  device = 'desktop',
  isCustomerView = true,
}) => {
  if (!flashSales || flashSales.length === 0) {
    if (!isCustomerView) {
      return (
        <section
          id="flash-sale"
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
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Chưa kích hoạt khung giờ Flash Sale
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Sự kiện chưa có khung giờ Flash Sale hoặc chưa có sản phẩm tham gia được phê duyệt.
            </p>
            <Link
              href={`/admin/events/${eventId}/commerce`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-amber-200"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Quản lý Khung Giờ Flash Sale</span>
            </Link>
          </div>
        </section>
      );
    }
    return null;
  }

  if (!activeSale) return null;

  return (
    <section
      id="flash-sale"
      className={`w-full max-w-7xl mx-auto scroll-mt-24 ${
        isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'
      }`}
    >
      <div
        className={`relative overflow-hidden shadow-lg border backdrop-blur-md transition-all duration-300 ${
          isMobile ? 'rounded-2xl p-3' : 'rounded-3xl p-4 sm:p-8'
        }`}
        style={{
          backgroundColor: 'var(--event-card-bg, #FFFFFF)',
          borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
          boxShadow: '0 20px 40px -15px var(--event-glow, rgba(220, 38, 38, 0.12))',
        }}
      >
        <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
              >
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2
                    className={`${
                      isMobile ? 'text-base' : 'text-lg sm:text-2xl'
                    } font-black text-slate-900 uppercase tracking-wider`}
                  >
                    {activeSale.name || 'Flash Sale Giờ Vàng'}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                    Live
                  </span>
                </div>
                <p className="text-xs text-slate-500">Ưu đãi giảm giá sốc số lượng có hạn</p>
              </div>
            </div>

            <div className="text-xs text-slate-500">
              <span>{flashSales.length} khung giờ</span>
            </div>
          </div>

          {flashSales.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 no-scrollbar">
              {flashSales.map((slot) => {
                const isSelected = slot.id === activeSale.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => onSelectSlot(slot.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSelected
                        ? 'text-white shadow-md font-extrabold border-transparent'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                    }`}
                    style={
                      isSelected
                        ? {
                            backgroundColor: 'var(--event-primary, #DC2626)',
                            boxShadow: '0 4px 12px var(--event-glow, rgba(220, 38, 38, 0.3))',
                          }
                        : undefined
                    }
                  >
                    <span>{slot.name}</span>
                    <span className="ml-1 text-[10px] opacity-80">({slot.items?.length || 0})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {activeSale.items && activeSale.items.length > 0 ? (
          <div
            className={`mt-4 sm:mt-6 grid ${
              isMobile
                ? 'grid-cols-2 gap-2.5'
                : device === 'tablet'
                  ? 'grid-cols-3 gap-4'
                  : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'
            }`}
          >
            {activeSale.items.map((item) => {
              const cardContent = (
                <div
                  className="group relative rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col bg-white h-full"
                  style={{
                    borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
                  }}
                >
                  <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                    {item.productImageUrl ? (
                      <Image
                        src={item.productImageUrl}
                        alt={item.productName}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-8 h-8 opacity-40" />
                      </div>
                    )}

                    <div className="absolute top-2 right-2 bg-red-600 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-lg shadow-md">
                      -{item.discountPercent}%
                    </div>
                  </div>

                  <div className={`${isMobile ? 'p-2.5' : 'p-3 sm:p-4'} flex flex-col flex-1`}>
                    <h3
                      className={`${
                        isMobile
                          ? 'text-xs min-h-[30px]'
                          : 'text-xs sm:text-sm min-h-[32px] sm:min-h-[40px]'
                      } font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors`}
                    >
                      {item.productName}
                    </h3>

                    <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                      <span
                        className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} font-extrabold`}
                        style={{ color: 'var(--event-secondary, #D97706)' }}
                      >
                        {formatCurrency(item.flashPrice)}
                      </span>
                      {item.originalPrice > item.flashPrice && (
                        <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                          {formatCurrency(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5">
                      <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                        <span>Đã bán {item.soldQuantity}</span>
                        <span>{item.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 border border-slate-200/50 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(item.progressPercent, 100)}%`,
                            background:
                              'linear-gradient(to right, var(--event-secondary, #D97706), var(--event-primary, #DC2626))',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (isCustomerView && item.productId) {
                return (
                  <Link key={item.id} href={`/products/${item.productId}`}>
                    {cardContent}
                  </Link>
                );
              }

              return <div key={item.id}>{cardContent}</div>;
            })}
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <p className="text-sm">Khung giờ này chưa có sản phẩm nào được duyệt.</p>
          </div>
        )}
      </div>
    </section>
  );
};
