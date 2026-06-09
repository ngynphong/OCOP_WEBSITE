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
      <div className="space-y-6 mt-8 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-stone-50 p-6 rounded-xl">
            <div className="h-6 bg-stone-200 rounded w-1/4 mb-4" />
            <div className="space-y-2">
              <div className="h-4 bg-stone-200 rounded w-full" />
              <div className="h-4 bg-stone-200 rounded w-5/6" />
              <div className="h-4 bg-stone-200 rounded w-4/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50/50 rounded-xl border border-red-100 mt-8">
        <FiAlertCircle className="text-red-400 mb-2" size={32} />
        <p className="text-red-600 font-medium">
          Không thể tải chính sách cửa hàng. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  const policy = data?.data;

  // Render whitespace gracefully
  const renderText = (text?: string) => {
    if (!text) return <p className="text-stone-500 italic text-sm">Chưa cập nhật</p>;
    return <div className="text-stone-700 text-sm leading-relaxed whitespace-pre-wrap">{text}</div>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {/* Vận chuyển */}
      <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-xs hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-5">
          <FiTruck size={24} />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-3">Chính sách vận chuyển</h3>
        {renderText(policy?.shippingPolicy)}
      </div>

      {/* Đổi trả */}
      <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-xs hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center mb-5">
          <FiRefreshCw size={24} />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-3">Chính sách đổi trả</h3>
        {renderText(policy?.returnPolicy)}
      </div>

      {/* Bảo hành */}
      <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-xs hover:shadow-md transition-shadow">
        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-5">
          <FiShield size={24} />
        </div>
        <h3 className="text-lg font-bold text-stone-900 mb-3">Chính sách bảo hành</h3>
        {renderText(policy?.warrantyPolicy)}
      </div>
    </div>
  );
};
