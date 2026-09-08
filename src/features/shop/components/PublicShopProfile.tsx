'use client';

import React, { useState } from 'react';
import { usePublicShopDetailQuery } from '@/features/shop/hooks/usePublicShop';
import { ShopProfileHeader } from './ShopProfileHeader';
import { ShopProductsTab } from './ShopProductsTab';
import { ShopInfoTab } from './ShopInfoTab';
import { FiAlertCircle, FiLoader, FiPackage, FiInfo } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

type TabType = 'PRODUCTS' | 'INFO';

interface PublicShopProfileProps {
  shopSlug: string;
}

export const PublicShopProfile = ({ shopSlug }: PublicShopProfileProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('PRODUCTS');
  const [totalProductsCount, setTotalProductsCount] = useState<number | undefined>(undefined);
  const { data, isPending, isError, refetch } = usePublicShopDetailQuery(shopSlug);

  if (isPending) {
    return (
      <div className="w-full flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-3 text-emerald-600">
          <FiLoader className="animate-spin" size={32} />
          <p className="font-bold text-sm text-stone-600">Đang tải thông tin gian hàng OCOP...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="w-full flex justify-center items-center py-28 px-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-white border border-rose-100 shadow-sm rounded-2xl max-w-md text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center">
            <FiAlertCircle size={28} />
          </div>
          <h2 className="text-lg font-black text-stone-900">Không tìm thấy cửa hàng</h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            Cửa hàng không tồn tại hoặc đã tạm dừng hoạt động. Vui lòng kiểm tra lại đường dẫn.
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-2 border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs"
          >
            Tải lại trang
          </Button>
        </div>
      </div>
    );
  }

  const shop = data.data;

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Cửa hàng', href: '/shops' },
    { label: shop.name },
  ];

  return (
    <div className="min-h-screen bg-stone-50/70 pb-24">
      {/* Breadcrumb Container */}
      <div className="bg-white border-b border-stone-100">
        <div className="container mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Profile Header */}
      <ShopProfileHeader shop={shop} totalProductsCount={totalProductsCount} />

      {/* Navigation Tabs Bar */}
      <div className="container mx-auto px-3 sm:px-6 mt-2.5 sm:mt-4">
        <div className="sticky top-0 z-20 bg-stone-50/95 backdrop-blur-md py-2 sm:py-2.5 border-b border-stone-200">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto hide-scrollbar scrollbar-none pb-0.5">
            <button
              onClick={() => setActiveTab('PRODUCTS')}
              className={cn(
                'flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 shadow-2xs whitespace-nowrap',
                activeTab === 'PRODUCTS'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80',
              )}
            >
              <FiPackage size={15} />
              <span>Tất cả sản phẩm</span>
              {totalProductsCount !== undefined && (
                <span
                  className={cn(
                    'px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-black',
                    activeTab === 'PRODUCTS'
                      ? 'bg-emerald-700/70 text-white'
                      : 'bg-stone-100 text-stone-600',
                  )}
                >
                  {totalProductsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('INFO')}
              className={cn(
                'flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 shadow-2xs whitespace-nowrap',
                activeTab === 'INFO'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80',
              )}
            >
              <FiInfo size={15} />
              <span>Hồ sơ & Giới thiệu</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'PRODUCTS' && (
            <ShopProductsTab shopSlug={shopSlug} onTotalCountChange={setTotalProductsCount} />
          )}
          {activeTab === 'INFO' && <ShopInfoTab shop={shop} />}
        </div>
      </div>
    </div>
  );
};
