import React from 'react';
import { ShopInfo } from '@/features/shop/types/shopTypes';
import { FiInfo, FiMapPin, FiFileText, FiCopy, FiExternalLink, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface ShopInfoTabProps {
  shop: ShopInfo;
}

export const ShopInfoTab = ({ shop }: ShopInfoTabProps) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const handleCopy = (text: string, key: string, label: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(`Đã sao chép ${label}`);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const fullAddress = [shop.addressLine, shop.wardName, shop.districtName, shop.provinceName]
    .filter(Boolean)
    .join(', ');

  const googleMapsUrl = fullAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`
    : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 pb-12">
      {/* Cột trái: Mô tả cửa hàng */}
      <div className="lg:col-span-2 space-y-4 sm:space-y-6">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-stone-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <FiInfo size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-black text-stone-900">
                Về chủ thể {shop.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500">
                Mô tả và thông tin do cửa hàng cung cấp
              </p>
            </div>
          </div>

          <div className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
            {shop.description ? (
              shop.description
            ) : (
              <p className="text-stone-400 italic text-xs">Cửa hàng chưa cập nhật mô tả.</p>
            )}
          </div>
        </div>
      </div>

      {/* Cột phải: Liên hệ & Pháp lý */}
      <div className="space-y-4 sm:space-y-6">
        {/* Thông tin liên hệ */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-4 sm:mb-5 pb-3 border-b border-stone-100">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <FiMapPin size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-stone-900">Địa chỉ & Cơ sở</h3>
              <p className="text-[11px] sm:text-xs text-stone-500">Vị trí địa lý chủ thể</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-stone-500 text-[11px] uppercase">
                Tỉnh / Thành phố
              </span>
              <span className="text-stone-900 font-semibold">
                {shop.provinceName || 'Đang cập nhật'}
              </span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-stone-500 text-[11px] uppercase">Quận / Huyện</span>
              <span className="text-stone-800">{shop.districtName || 'Đang cập nhật'}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-stone-500 text-[11px] uppercase">Phường / Xã</span>
              <span className="text-stone-800">{shop.wardName || 'Đang cập nhật'}</span>
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="font-bold text-stone-500 text-[11px] uppercase">Địa chỉ cụ thể</span>
              <span className="text-stone-800 leading-relaxed font-medium break-words">
                {shop.addressLine || 'Đang cập nhật'}
              </span>
            </div>

            {googleMapsUrl && (
              <div className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  <FiExternalLink size={14} />
                  Xem trên Google Maps
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Thông tin pháp lý */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
              <FiFileText size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-stone-900">Pháp lý & Đăng ký</h3>
              <p className="text-xs text-stone-500">Giấy phép đăng ký kinh doanh</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-stone-500 text-[11px] uppercase">Mã số thuế</span>
              <div className="flex items-center justify-between gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="font-mono font-bold text-stone-800 text-xs sm:text-sm">
                  {shop.taxCode || '---'}
                </span>
                {shop.taxCode && (
                  <button
                    onClick={() => handleCopy(shop.taxCode, 'taxCode', 'Mã số thuế')}
                    className="text-stone-400 hover:text-emerald-700 p-1 transition-colors"
                    title="Sao chép mã số thuế"
                  >
                    {copiedKey === 'taxCode' ? (
                      <FiCheck className="text-emerald-600" size={15} />
                    ) : (
                      <FiCopy size={15} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-stone-500 text-[11px] uppercase">
                Số đăng ký kinh doanh
              </span>
              <div className="flex items-center justify-between gap-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200/70">
                <span className="font-mono font-bold text-stone-800 text-xs sm:text-sm">
                  {shop.businessRegNo || '---'}
                </span>
                {shop.businessRegNo && (
                  <button
                    onClick={() => handleCopy(shop.businessRegNo, 'businessRegNo', 'Số ĐKKD')}
                    className="text-stone-400 hover:text-emerald-700 p-1 transition-colors"
                    title="Sao chép số đăng ký kinh doanh"
                  >
                    {copiedKey === 'businessRegNo' ? (
                      <FiCheck className="text-emerald-600" size={15} />
                    ) : (
                      <FiCopy size={15} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
