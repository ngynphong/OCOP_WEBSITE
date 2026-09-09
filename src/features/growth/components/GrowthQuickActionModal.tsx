'use client';

import React, { useState } from 'react';
import { X, Sparkles, Tag, CheckCircle2, ExternalLink, Clock, Loader2, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { voucherApi } from '@/features/vouchers/api/voucherApi';
import { useGrowthMutations } from '../hooks/useGrowth';
import { GrowthOpportunity } from '../types';

interface Props {
  isOpen: boolean;
  opportunity: GrowthOpportunity | null;
  onClose: () => void;
}

export const GrowthQuickActionModal: React.FC<Props> = ({ isOpen, opportunity, onClose }) => {
  const router = useRouter();
  const { executeOpportunity } = useGrowthMutations();
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const payload = (opportunity.actionPayload || {}) as Record<string, unknown>;
  const discountPercent = Number(payload.discountPercent || 10);
  const durationHours = Number(payload.durationHours || 48);
  const prefix = String(payload.voucherCodePrefix || 'OCOP' + discountPercent);

  // Auto-generate voucher code e.g. OCOP10-ABCD
  const autoCode = `${prefix}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const voucherTitle = prefix.toUpperCase().includes('TRIAN')
    ? 'Voucher Tri Ân'
    : 'Ưu Đãi Đặc Biệt';
  const voucherName = `${voucherTitle} - Giảm ${discountPercent}% (${opportunity.productName || 'Toàn shop'})`;

  const handle1ClickVoucher = async () => {
    setIsExecuting(true);
    try {
      const now = new Date();
      const expiry = new Date(now.getTime() + durationHours * 60 * 60 * 1000);

      const startDateStr = now.toISOString().split('T')[0];
      const expiryDateStr = expiry.toISOString().split('T')[0];

      await voucherApi.createSellerVoucher({
        code: autoCode,
        name: voucherName,
        type: 'PERCENT',
        discountValue: discountPercent,
        maxDiscount: 50000,
        minOrderValue: 100000,
        usageLimit: 100,
        perUserLimit: 1,
        startAt: `${startDateStr}T00:00:00`,
        expiredAt: `${expiryDateStr}T23:59:59`,
      });

      await executeOpportunity.mutateAsync({ id: opportunity.id, silent: true });
      onClose();
    } catch (error) {
      console.error('Error creating voucher:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getActionNavigationLabel = () => {
    switch (opportunity.actionType) {
      case 'RESTOCK':
        return 'Đến trang Tạo Lô Sản Xuất';
      case 'REPLY_RFQ':
        return 'Đến trang Báo giá sỉ B2B';
      case 'LINK_BANK_ACCOUNT':
        return 'Đến trang Tài khoản ngân hàng';
      case 'UPDATE_PRODUCT_MEDIA':
        return 'Đến trang Chi tiết sản phẩm';
      case 'JOIN_FLASH_SALE':
        return 'Mở form Đăng ký Flash Sale ngay';
      default:
        return 'Mở trang xử lý';
    }
  };

  const handleNavigate = () => {
    onClose();
    if (opportunity.actionType === 'JOIN_FLASH_SALE') {
      const pid = opportunity.productId || (payload.productId as number | undefined);
      router.push(
        `/dashboard/san-pham?tab=FLASH_SALE&openCreate=true${pid ? `&productId=${pid}` : ''}`,
      );
    } else {
      router.push(opportunity.actionUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Thực thi Cơ hội Tăng trưởng</h3>
              <p className="text-[11px] text-gray-500">1-Click Actionable Growth Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-gray-900">{opportunity.title}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{opportunity.description}</p>
          </div>

          {opportunity.actionType === 'CREATE_VOUCHER' ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800">
                  <Tag className="w-3.5 h-3.5" /> Đề xuất Voucher Tối ưu
                </span>
                <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-700">
                  {autoCode}
                </span>
              </div>

              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-xs">
                <span className="text-gray-500 text-[10px] block">
                  Tên voucher hiển thị cho khách
                </span>
                <span className="font-semibold text-emerald-900 text-xs">{voucherName}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-gray-500 text-[10px] block">Mức giảm giá</span>
                  <span className="font-bold text-emerald-700 text-sm">{discountPercent}%</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-gray-500 text-[10px] block">Thời hạn áp dụng</span>
                  <span className="font-bold text-gray-800 text-sm">{durationHours} Giờ</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-gray-500 text-[10px] block">Đơn tối thiểu</span>
                  <span className="font-semibold text-gray-700">100.000 ₫</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-gray-500 text-[10px] block">Giảm tối đa</span>
                  <span className="font-semibold text-gray-700">50.000 ₫</span>
                </div>
              </div>

              {opportunity.estimatedLift && (
                <p className="text-[11px] text-emerald-800 font-medium">
                  🚀 Tác động dự kiến: <strong>{opportunity.estimatedLift}</strong>
                </p>
              )}
            </div>
          ) : opportunity.actionType === 'JOIN_FLASH_SALE' ? (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-200/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <Flame className="w-4 h-4 text-rose-600 fill-rose-500" /> Đăng ký tham gia Flash
                  Sale
                </span>
                <span className="text-[11px] font-medium bg-white px-2.5 py-0.5 rounded-lg border border-rose-200 text-rose-700">
                  Chiến dịch Flash Sale
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-gray-500 text-[10px] block">Sản phẩm áp dụng</span>
                  <span
                    className="font-bold text-gray-800 text-xs truncate block"
                    title={opportunity.productName || ''}
                  >
                    {opportunity.productName || 'Sản phẩm tồn cao'}
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-gray-500 text-[10px] block">Tồn kho hiện tại</span>
                  <span className="font-bold text-rose-700 text-sm">
                    {String(payload.stock || 0)} sản phẩm
                  </span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-gray-500 text-[10px] block">Mức giảm giá</span>
                  <span className="font-semibold text-gray-800">Shop tự thiết lập khi tạo</span>
                </div>
                <div className="bg-white/80 p-2.5 rounded-xl border border-rose-100">
                  <span className="text-gray-500 text-[10px] block">Mục tiêu</span>
                  <span className="font-semibold text-rose-700">
                    {opportunity.estimatedLift || 'Hỗ trợ giải phóng tồn kho'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-rose-900 leading-relaxed font-medium">
                Nhấn nút bên dưới để mở ngay biểu mẫu đăng ký Flash Sale. Hệ thống sẽ tự động ghi
                nhận và cộng điểm Tăng trưởng ngay khi bạn hoàn tất đăng ký!
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Hành động liên kết mô-đun sàn OCOP</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nhấn vào nút bên dưới để mở trang xử lý chuyên biệt cho cơ hội này.
              </p>
              <div className="pt-1 flex items-start gap-1.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  Hệ thống sẽ tự động ghi nhận hoàn thành và cộng điểm Tăng trưởng ngay sau khi bạn
                  hoàn tất thao tác tại trang liên kết.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isExecuting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          {opportunity.actionType === 'CREATE_VOUCHER' ? (
            <button
              onClick={handle1ClickVoucher}
              disabled={isExecuting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isExecuting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{isExecuting ? 'Đang kích hoạt...' : 'Kích hoạt Voucher ngay (1-Click)'}</span>
            </button>
          ) : opportunity.actionType === 'JOIN_FLASH_SALE' ? (
            <button
              onClick={handleNavigate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all active:scale-95 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{getActionNavigationLabel()}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </button>
          ) : (
            <button
              onClick={handleNavigate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-colors cursor-pointer"
            >
              <span>{getActionNavigationLabel()}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
