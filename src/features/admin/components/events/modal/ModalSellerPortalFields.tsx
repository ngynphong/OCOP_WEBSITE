'use client';

import React from 'react';

export interface ModalSellerPortalFieldsProps {
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

export function ModalSellerPortalFields({
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
}: ModalSellerPortalFieldsProps) {
  return (
    <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={sellerPortalVisible}
          onChange={(e) => onSellerPortalVisibleChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
        />
        <span>
          <span className="block text-sm font-bold text-gray-900">Công bố trên Seller Portal</span>
          <span className="block text-xs text-gray-500">
            Cho nhà bán hàng xem sự kiện và đăng ký vào các khung giờ Flash Sale.
          </span>
        </span>
      </label>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="text-xs font-semibold text-gray-700 lg:col-span-1">
          Mở đăng ký
          <input
            type="datetime-local"
            value={registrationStartAt}
            onChange={(e) => onRegistrationStartAtChange(e.target.value)}
            disabled={!sellerPortalVisible}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs disabled:opacity-50"
          />
        </label>
        <label className="text-xs font-semibold text-gray-700 lg:col-span-1">
          Đóng đăng ký
          <input
            type="datetime-local"
            value={registrationEndAt}
            max={startAt}
            onChange={(e) => onRegistrationEndAtChange(e.target.value)}
            disabled={!sellerPortalVisible}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs disabled:opacity-50"
          />
        </label>
        <label className="text-xs font-semibold text-gray-700">
          OCOP tối thiểu
          <select
            value={minOcopStar}
            onChange={(e) => onMinOcopStarChange(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs cursor-pointer"
          >
            <option value={3}>3 sao</option>
            <option value={4}>4 sao</option>
            <option value={5}>5 sao</option>
          </select>
        </label>
        <label className="text-xs font-semibold text-gray-700">
          Giảm tối thiểu (%)
          <input
            type="number"
            min={1}
            max={99}
            value={minDiscountPercent}
            onChange={(e) => onMinDiscountPercentChange(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs"
          />
        </label>
        <label className="text-xs font-semibold text-gray-700">
          Sản phẩm/shop
          <input
            type="number"
            min={1}
            value={maxProductsPerShop}
            onChange={(e) => onMaxProductsPerShopChange(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs"
          />
        </label>
      </div>
    </div>
  );
}

export default ModalSellerPortalFields;
