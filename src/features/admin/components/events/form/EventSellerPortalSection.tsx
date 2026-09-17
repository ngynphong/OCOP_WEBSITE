'use client';

import React from 'react';
import { Store } from 'lucide-react';

export interface EventSellerPortalSectionProps {
  sellerPortalVisible: boolean;
  onSellerPortalVisibleChange: (val: boolean) => void;
  registrationStartAt: string;
  onRegistrationStartAtChange: (val: string) => void;
  registrationEndAt: string;
  onRegistrationEndAtChange: (val: string) => void;
  startAt: string;
  minOcopStar: number;
  onMinOcopStarChange: (val: number) => void;
  minDiscountPercent: number;
  onMinDiscountPercentChange: (val: number) => void;
  maxProductsPerShop: number;
  onMaxProductsPerShopChange: (val: number) => void;
}

export function EventSellerPortalSection({
  sellerPortalVisible,
  onSellerPortalVisibleChange,
  registrationStartAt,
  onRegistrationStartAtChange,
  registrationEndAt,
  onRegistrationEndAtChange,
  startAt,
  minOcopStar,
  onMinOcopStarChange,
  minDiscountPercent,
  onMinDiscountPercentChange,
  maxProductsPerShop,
  onMaxProductsPerShopChange,
}: EventSellerPortalSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              5. Cổng Đăng Ký Cho Nhà Bán (Seller Portal)
            </h2>
            <p className="text-xs text-gray-500">
              Quy định mở cổng cho chủ thể OCOP nộp sản phẩm tham gia sự kiện
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={sellerPortalVisible}
            onChange={(e) => onSellerPortalVisibleChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span className="text-xs font-bold text-gray-800">Mở cổng đăng ký</span>
        </label>
      </div>

      {sellerPortalVisible ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          {/* Thời gian mở đăng ký */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Bắt Đầu Nhận Đăng Ký <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={registrationStartAt}
              onChange={(e) => onRegistrationStartAtChange(e.target.value)}
              className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              required={sellerPortalVisible}
            />
          </div>

          {/* Thời gian đóng đăng ký */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Đóng Cổng Đăng Ký <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={registrationEndAt}
              onChange={(e) => onRegistrationEndAtChange(e.target.value)}
              className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
              required={sellerPortalVisible}
            />
            <p className="mt-1 text-[11px] text-emerald-600 font-medium">
              Phải đóng cổng trước hoặc trùng với giờ sự kiện bắt đầu ({startAt}).
            </p>
          </div>

          {/* Sao OCOP tối thiểu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Xếp Hạng OCOP Tối Thiểu
            </label>
            <select
              value={minOcopStar}
              onChange={(e) => onMinOcopStarChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl text-gray-800 border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-sm bg-white font-medium"
            >
              <option value={3}>⭐ ⭐ ⭐ 3 Sao trở lên</option>
              <option value={4}>⭐ ⭐ ⭐ ⭐ 4 Sao trở lên</option>
              <option value={5}>⭐ ⭐ ⭐ ⭐ ⭐ 5 Sao Quốc gia</option>
            </select>
          </div>

          {/* Mức giảm giá tối thiểu */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              % Giảm Giá Tối Thiểu (%)
            </label>
            <input
              type="number"
              min={0}
              max={90}
              value={minDiscountPercent}
              onChange={(e) => onMinDiscountPercentChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              Sản phẩm tham gia phải có mức chiết khấu tối thiểu này.
            </p>
          </div>

          {/* Số lượng sản phẩm tối đa */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Sản Phẩm Tối Đa Mỗi Gian Hàng
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={maxProductsPerShop}
              onChange={(e) => onMaxProductsPerShopChange(Number(e.target.value))}
              className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            />
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/60 text-xs text-gray-500 text-center">
          Cổng đăng ký Seller đang đóng. Chỉ Ban quản trị mới có thể gán sản phẩm vào sự kiện.
        </div>
      )}
    </section>
  );
}
