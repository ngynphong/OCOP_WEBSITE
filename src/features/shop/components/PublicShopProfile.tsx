'use client';

import React, { useState } from 'react';
import { usePublicShopDetailQuery } from '@/features/shop/hooks/usePublicShop';
import { ShopProfileHeader } from './ShopProfileHeader';
import { ShopProductsTab } from './ShopProductsTab';
import { ShopPolicyTab } from './ShopPolicyTab';
import { ShopInfoTab } from './ShopInfoTab';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

type TabType = 'PRODUCTS' | 'POLICY' | 'INFO';

interface PublicShopProfileProps {
  shopSlug: string;
}

export const PublicShopProfile = ({ shopSlug }: PublicShopProfileProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('PRODUCTS');
  const { data, isPending, isError, refetch } = usePublicShopDetailQuery(shopSlug);

  if (isPending) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4 text-emerald-600">
          <FiLoader className="animate-spin" size={32} />
          <p className="font-semibold">Đang tải thông tin cửa hàng...</p>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="w-full flex justify-center items-center py-32 px-4">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 text-red-500 rounded-3xl max-w-md text-center">
          <FiAlertCircle size={48} />
          <h2 className="text-xl font-bold">Không tìm thấy cửa hàng</h2>
          <p className="text-sm">
            Cửa hàng không tồn tại hoặc đã bị ẩn. Vui lòng kiểm tra lại đường dẫn.
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4 border-red-200 hover:bg-red-100"
          >
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  const shop = data.data;

  const tabClasses = (tab: TabType) =>
    cn(
      'px-6 py-4 text-sm sm:text-base font-bold transition-all border-b-2 whitespace-nowrap',
      activeTab === tab
        ? 'border-emerald-500 text-emerald-600'
        : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300',
    );

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      <ShopProfileHeader shop={shop} />

      <div className="container mx-auto px-4 sm:px-6 mt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center overflow-x-auto hide-scrollbar border-b border-stone-200">
          <button onClick={() => setActiveTab('PRODUCTS')} className={tabClasses('PRODUCTS')}>
            Tất cả sản phẩm
          </button>
          <button onClick={() => setActiveTab('POLICY')} className={tabClasses('POLICY')}>
            Chính sách cửa hàng
          </button>
          <button onClick={() => setActiveTab('INFO')} className={tabClasses('INFO')}>
            Hồ sơ & Thông tin
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'PRODUCTS' && <ShopProductsTab shopSlug={shopSlug} />}
          {activeTab === 'POLICY' && <ShopPolicyTab shopSlug={shopSlug} />}
          {activeTab === 'INFO' && <ShopInfoTab shop={shop} />}
        </div>
      </div>
    </div>
  );
};
