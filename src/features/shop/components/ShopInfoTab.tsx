import React from 'react';
import { ShopInfo } from '@/features/shop/types/shopTypes';
import { FiInfo, FiMapPin, FiFileText } from 'react-icons/fi';

interface ShopInfoTabProps {
  shop: ShopInfo;
}

export const ShopInfoTab = ({ shop }: ShopInfoTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      {/* Về chúng tôi (Mô tả) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-xl border border-stone-100 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FiInfo size={20} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Về cửa hàng</h3>
          </div>

          <div className="prose prose-stone max-w-none prose-p:text-sm prose-p:leading-loose text-stone-700 whitespace-pre-wrap">
            {shop.description || (
              <p className="italic text-stone-400">Cửa hàng chưa cập nhật mô tả.</p>
            )}
          </div>
        </div>
      </div>

      {/* Thông tin pháp lý & Liên hệ */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiMapPin size={20} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Thông tin liên hệ</h3>
          </div>

          <ul className="space-y-4">
            <li className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Tỉnh/Thành phố</span>
              <span className="text-stone-600">{shop.provinceName || 'Đang cập nhật'}</span>
            </li>
            <li className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Quận/Huyện</span>
              <span className="text-stone-600">{shop.districtName || 'Đang cập nhật'}</span>
            </li>
            <li className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Phường/Xã</span>
              <span className="text-stone-600">{shop.wardName || 'Đang cập nhật'}</span>
            </li>
            <li className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Địa chỉ cụ thể</span>
              <span className="text-stone-600 leading-relaxed">
                {shop.addressLine || 'Đang cập nhật'}
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <FiFileText size={20} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Pháp lý</h3>
          </div>

          <ul className="space-y-4">
            <li className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Mã số thuế</span>
              <span className="font-mono text-stone-600 bg-stone-50 px-2 py-1 rounded inline-block w-fit">
                {shop.taxCode || '---'}
              </span>
            </li>
            <li className="flex flex-col gap-1 text-sm">
              <span className="font-semibold text-stone-700">Số ĐKKD</span>
              <span className="font-mono text-stone-600 bg-stone-50 px-2 py-1 rounded inline-block w-fit">
                {shop.businessRegNo || '---'}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
