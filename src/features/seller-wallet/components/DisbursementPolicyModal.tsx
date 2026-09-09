'use client';

import React, { useEffect } from 'react';
import { X, ShieldCheck, Calendar, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DisbursementPolicyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Quy Chế Đối Soát & Giải Ngân OCOP
              </h3>
              <p className="text-xs text-gray-500">
                Minh bạch tài chính & cơ chế thanh toán tự động
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-gray-600 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              1. Lịch đối soát & Giải ngân tự động
            </h4>
            <p>
              Hệ thống sàn OCOP tự động chốt sổ và giải ngân doanh thu bán hàng{' '}
              <strong>2 kỳ mỗi tháng</strong> trực tiếp về tài khoản ngân hàng của bạn:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="font-bold text-emerald-800 text-xs block">
                  Kỳ 1 (Nửa đầu tháng)
                </span>
                <p className="mt-1 text-gray-600">
                  Chốt các đơn hoàn tất từ <strong>01 đến 15</strong> hàng tháng.
                </p>
                <p className="font-semibold text-emerald-700 mt-1">
                  🗓️ Giải ngân: Ngày 18 cùng tháng
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                <span className="font-bold text-blue-800 text-xs block">Kỳ 2 (Nửa cuối tháng)</span>
                <p className="mt-1 text-gray-600">
                  Chốt các đơn hoàn tất từ <strong>16 đến ngày cuối tháng</strong>.
                </p>
                <p className="font-semibold text-blue-700 mt-1">
                  🗓️ Giải ngân: Ngày 03 tháng kế tiếp
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              2. Công thức tính thực nhận (Net Payout)
            </h4>
            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 font-mono text-[11px] text-gray-800 space-y-1">
              <div>Thực nhận = Doanh thu gộp (COMPLETED)</div>
              <div className="text-red-600">- Phí hoa hồng OCOP (Theo gói thuê bao)</div>
              <div className="text-red-600">- Phí thanh toán cổng VNPay/VietQR (1.5%)</div>
              <div className="text-emerald-600">
                + Thưởng Cashback hoa hồng (nếu đạt mốc doanh số)
              </div>
              <div className="text-red-600">- Khấu trừ hoàn trả / hủy hàng trong kỳ (nếu có)</div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Điều kiện đơn hàng được vào kỳ quyết toán
            </h4>
            <ul className="list-disc list-inside space-y-1 pl-1 text-gray-600">
              <li>
                Đơn hàng đã được người mua xác nhận nhận hàng hoặc hệ thống tự động hoàn thành (sau
                7 ngày giao thành công).
              </li>
              <li>
                Đơn hàng không có khiếu nại, tranh chấp hoặc yêu cầu trả hàng/hoàn tiền đang mở.
              </li>
              <li>
                Shop đã liên kết tài khoản ngân hàng chính chủ VietQR tại mục Cài đặt ngân hàng.
              </li>
            </ul>
          </div>

          {/* Warning */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-normal">
              <strong>Lưu ý quan trọng:</strong> Nếu đến kỳ giải ngân mà shop chưa cập nhật thông
              tin tài khoản ngân hàng thụ hưởng, tiền quyết toán sẽ tiếp tục được giữ an toàn ở
              trạng thái <em>&quot;Đang chờ giải ngân&quot;</em> và tự động chuyển khoản ngay khi
              bạn hoàn tất liên kết tài khoản.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
          >
            Đã hiểu quy chế
          </button>
        </div>
      </div>
    </div>
  );
};
