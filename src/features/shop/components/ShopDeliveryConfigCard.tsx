'use client';

import React, { useState } from 'react';
import {
  FiTruck,
  FiEdit2,
  FiSave,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import { ShopInfo } from '../types/shopTypes';
import { useSellerShop } from '../hooks/useSellerShop';
import { formatCurrencyVND, formatVNDInput, parseVNDInput } from '@/utils/format';
import { cn } from '@/lib/utils';

interface ShopDeliveryConfigCardProps {
  shop: ShopInfo;
}

export function ShopDeliveryConfigCard({ shop }: ShopDeliveryConfigCardProps) {
  const { updateDeliverySettings, isUpdatingDeliverySettings } = useSellerShop();
  const [isEditing, setIsEditing] = useState(false);

  const [hasSelfDelivery, setHasSelfDelivery] = useState<boolean>(
    shop.hasSelfDelivery !== undefined ? shop.hasSelfDelivery : true,
  );
  const [intraFee, setIntraFee] = useState<number>(shop.selfDeliveryIntraFee ?? 20000);
  const [interFee, setInterFee] = useState<number>(shop.selfDeliveryInterFee ?? 35000);
  const [freeshipThreshold, setFreeshipThreshold] = useState<number | null>(
    shop.selfDeliveryFreeshipThreshold ?? null,
  );

  const handleOpenEdit = () => {
    setHasSelfDelivery(shop.hasSelfDelivery !== undefined ? shop.hasSelfDelivery : true);
    setIntraFee(shop.selfDeliveryIntraFee ?? 20000);
    setInterFee(shop.selfDeliveryInterFee ?? 35000);
    setFreeshipThreshold(shop.selfDeliveryFreeshipThreshold ?? null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDeliverySettings({
        hasSelfDelivery,
        selfDeliveryIntraFee: intraFee,
        selfDeliveryInterFee: interFee,
        selfDeliveryFreeshipThreshold:
          freeshipThreshold && freeshipThreshold > 0 ? freeshipThreshold : null,
      });
      setIsEditing(false);
    } catch {
      // Error handled by hook toast
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-stone-50 bg-stone-50/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-stone-700 flex items-center gap-2">
          <FiTruck size={16} className="text-green-600" /> Cấu hình Shop tự giao hàng
        </h3>
        {!isEditing && (
          <button
            type="button"
            onClick={handleOpenEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
          >
            <FiEdit2 size={13} /> Thiết lập
          </button>
        )}
      </div>

      <div className="p-5">
        {!isEditing ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm py-1 border-b border-stone-50">
              <span className="text-stone-500">Tự vận chuyển đơn hàng:</span>
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold',
                  shop.hasSelfDelivery !== false
                    ? 'bg-green-100 text-green-700'
                    : 'bg-stone-100 text-stone-500',
                )}
              >
                {shop.hasSelfDelivery !== false ? (
                  <>
                    <FiCheckCircle size={12} /> Đang bật
                  </>
                ) : (
                  <>
                    <FiX size={12} /> Đang tắt
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-1 border-b border-stone-50">
              <span className="text-stone-500">Cước phí nội tỉnh:</span>
              <span className="font-bold text-stone-800">
                {formatCurrencyVND(shop.selfDeliveryIntraFee ?? 20000)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-1 border-b border-stone-50">
              <span className="text-stone-500">Cước phí ngoại tỉnh (toàn quốc):</span>
              <span className="font-bold text-stone-800">
                {formatCurrencyVND(shop.selfDeliveryInterFee ?? 35000)}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm py-1">
              <span className="text-stone-500">Miễn phí ship (Freeship):</span>
              <span className="font-bold text-green-700">
                {shop.selfDeliveryFreeshipThreshold && shop.selfDeliveryFreeshipThreshold > 0
                  ? `Đơn từ ${formatCurrencyVND(shop.selfDeliveryFreeshipThreshold)}`
                  : 'Không áp dụng'}
              </span>
            </div>

            <p className="text-[11px] text-stone-400 mt-2 italic">
              * Khách hàng tại trang thanh toán sẽ thấy trước và thanh toán chính xác mức phí này
              khi chọn phương thức Shop tự giao hàng.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
              <div>
                <label className="text-sm font-bold text-stone-800 block">
                  Kích hoạt Shop tự giao hàng
                </label>
                <span className="text-xs text-stone-500">
                  Cho phép người mua chọn dịch vụ giao hàng trực tiếp của cửa hàng
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSelfDelivery}
                  onChange={(e) => setHasSelfDelivery(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {hasSelfDelivery && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Cước phí nội tỉnh (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formatVNDInput(intraFee)}
                      onChange={(e) => setIntraFee(parseVNDInput(e.target.value))}
                      placeholder="VD: 20.000"
                      className="w-full text-stone-800 font-semibold px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-green-600"
                    />
                    <span className="text-[11px] text-stone-400 mt-0.5 block">
                      Áp dụng khi địa chỉ nhận hàng cùng tỉnh/thành với Shop
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Cước phí ngoại tỉnh (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formatVNDInput(interFee)}
                      onChange={(e) => setInterFee(parseVNDInput(e.target.value))}
                      placeholder="VD: 35.000"
                      className="w-full text-stone-800 font-semibold px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-green-600"
                    />
                    <span className="text-[11px] text-stone-400 mt-0.5 block">
                      Áp dụng cho khách hàng ở các tỉnh/thành khác toàn quốc
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Miễn phí ship cho đơn hàng đạt giá trị từ (VNĐ)
                  </label>
                  <input
                    type="text"
                    value={formatVNDInput(freeshipThreshold ?? '')}
                    onChange={(e) => {
                      const val = parseVNDInput(e.target.value);
                      setFreeshipThreshold(val > 0 ? val : null);
                    }}
                    placeholder="VD: 300.000 (Để trống nếu không áp dụng freeship)"
                    className="w-full text-stone-800 font-semibold px-3 py-2 text-sm rounded-xl border border-stone-200 focus:outline-none focus:border-green-600"
                  />
                  <span className="text-[11px] text-stone-400 mt-0.5 block">
                    Đơn hàng của shop đạt giá trị này trở lên sẽ tự động được cước phí 0₫
                  </span>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs">
              <FiAlertCircle size={16} className="shrink-0 text-amber-600" />
              <span>
                Cập nhật cấu hình phí giao hàng sẽ có hiệu lực ngay lập tức và không cần chờ duyệt
                lại hồ sơ cửa hàng.
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdatingDeliverySettings}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <FiX size={14} /> Hủy
              </button>
              <button
                type="submit"
                disabled={isUpdatingDeliverySettings}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
              >
                {isUpdatingDeliverySettings ? (
                  <>
                    <FiLoader size={14} className="animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <FiSave size={14} /> Lưu cấu hình
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
