'use client';

import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
  useGrowthOverview,
  useProductGrowth,
  useGrowthMutations,
} from '@/features/growth/hooks/useGrowth';
import { GrowthOverviewHeader } from '@/features/growth/components/GrowthOverviewHeader';
import { GrowthKpiCards } from '@/features/growth/components/GrowthKpiCards';
import { GrowthScoreCard } from '@/features/growth/components/GrowthScoreCard';
import { SellerWalletSummaryCard } from '@/features/growth/components/SellerWalletSummaryCard';
import { TodayActionsSection } from '@/features/growth/components/TodayActionsSection';
import { OpportunitiesList } from '@/features/growth/components/OpportunitiesList';
import { ProductGrowthSection } from '@/features/growth/components/ProductGrowthSection';
import { GrowthQuickActionModal } from '@/features/growth/components/GrowthQuickActionModal';
import { GrowthOpportunity } from '@/features/growth/types';

export default function GrowthCenterPage() {
  const [actionOpportunity, setActionOpportunity] = useState<GrowthOpportunity | null>(null);

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
    isFetching: isOverviewFetching,
  } = useGrowthOverview();

  const {
    data: productData,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
    isFetching: isProductsFetching,
  } = useProductGrowth();

  const { dismissOpportunity } = useGrowthMutations();

  const isRefreshing = isOverviewFetching || isProductsFetching;

  const handleRefresh = () => {
    refetchOverview();
    refetchProducts();
  };

  const handleDismiss = (id: number) => {
    dismissOpportunity.mutate(id);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 min-h-screen bg-stone-50/40">
      {/* 1. Header with Refresh */}
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}
            />
            <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}</span>
          </button>
        </div>

        <GrowthOverviewHeader
          growthScore={overviewData?.kpis?.growthScore}
          growthTier={overviewData?.kpis?.growthTier}
          totalOpportunities={overviewData?.kpis?.totalOpportunities}
        />
      </div>

      {/* 2. Top-level KPI Cards */}
      <GrowthKpiCards kpis={overviewData?.kpis} isLoading={isOverviewLoading} />

      {/* 3. Growth Score & Seller Wallet in 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GrowthScoreCard
          score={overviewData?.kpis?.growthScore}
          tier={overviewData?.kpis?.growthTier}
          isLoading={isOverviewLoading}
        />
        <SellerWalletSummaryCard wallet={overviewData?.wallet} isLoading={isOverviewLoading} />
      </div>

      {/* 4. Today's Recommended Actions (Top Priority) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Hành động khuyến nghị hôm nay</h2>
            <p className="text-xs text-gray-500">
              Các cơ hội có tác động lớn nhất đến doanh số và thứ hạng của shop
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {overviewData?.todayActions?.length ?? 0} đề xuất quan trọng
          </span>
        </div>

        <TodayActionsSection
          actions={overviewData?.todayActions ?? []}
          isLoading={isOverviewLoading}
          onDismiss={handleDismiss}
          onExecute={setActionOpportunity}
          isDismissing={dismissOpportunity.isPending}
        />
      </div>

      {/* 5. All Active Growth Opportunities */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Kho cơ hội tăng trưởng</h2>
          <p className="text-xs text-gray-500">
            Khám phá các gợi ý tối ưu theo từng nhóm mục tiêu kinh doanh
          </p>
        </div>

        <OpportunitiesList
          opportunities={overviewData?.opportunities ?? []}
          isLoading={isOverviewLoading}
          onDismiss={handleDismiss}
          onExecute={setActionOpportunity}
        />
      </div>

      {/* 6. Product Growth & Health Section */}
      <ProductGrowthSection products={productData ?? []} isLoading={isProductsLoading} />

      {/* 7. 1-Click Action Modal */}
      <GrowthQuickActionModal
        isOpen={!!actionOpportunity}
        opportunity={actionOpportunity}
        onClose={() => setActionOpportunity(null)}
      />
    </div>
  );
}
