import React from 'react';
import { usePublicShopPolicyQuery } from '@/features/shop/hooks/usePublicShop';
import { FiAlertCircle, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';

interface ShopPolicyTabProps {
  shopSlug: string;
}

export const ShopPolicyTab = ({ shopSlug }: ShopPolicyTabProps) => {
  const { data, isPending, isError } = usePublicShopPolicyQuery(shopSlug);

  if (isPending) {
    return (
      <div className="space-y-6 mt-6 animate-pulse pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-stone-200/70 h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 rounded-2xl border border-rose-100 mt-6 text-center">
        <FiAlertCircle className="text-rose-400 mb-2" size={32} />
        <p className="text-rose-700 font-bold text-sm">
          Không thể tải thông tin chính sách của cửa hàng
        </p>
      </div>
    );
  }

  const policy = data?.data;

  return (
    <div className="mt-4 sm:mt-6 pb-12">
      {/* 3 Core Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Vận chuyển */}
        <div className="bg-white p-4 sm:p-6 md:p-7 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3.5 sm:mb-5 border border-blue-100 shrink-0">
            <FiTruck size={20} />
          </div>
          <h3 className="text-sm sm:text-base font-black text-stone-900 mb-2 sm:mb-3">
            Chính sách vận chuyển
          </h3>
          {policy?.shippingPolicy ? (
            <div className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {policy.shippingPolicy}
            </div>
          ) : (
            <p className="text-stone-400 italic text-xs">
              Cửa hàng chưa cập nhật chính sách vận chuyển.
            </p>
          )}
        </div>

        {/* Đổi trả */}
        <div className="bg-white p-4 sm:p-6 md:p-7 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3.5 sm:mb-5 border border-amber-100 shrink-0">
            <FiRefreshCw size={20} />
          </div>
          <h3 className="text-sm sm:text-base font-black text-stone-900 mb-2 sm:mb-3">
            Chính sách đổi trả
          </h3>
          {policy?.returnPolicy ? (
            <div className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {policy.returnPolicy}
            </div>
          ) : (
            <p className="text-stone-400 italic text-xs">
              Cửa hàng chưa cập nhật chính sách đổi trả.
            </p>
          )}
        </div>

        {/* Bảo hành & Chất lượng */}
        <div className="bg-white p-4 sm:p-6 md:p-7 rounded-2xl border border-stone-200/80 shadow-2xs">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3.5 sm:mb-5 border border-emerald-100 shrink-0">
            <FiShield size={20} />
          </div>
          <h3 className="text-sm sm:text-base font-black text-stone-900 mb-2 sm:mb-3">
            Chính sách bảo hành
          </h3>
          {policy?.warrantyPolicy ? (
            <div className="text-stone-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {policy.warrantyPolicy}
            </div>
          ) : (
            <p className="text-stone-400 italic text-xs">
              Cửa hàng chưa cập nhật chính sách bảo hành.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
