'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/features/products/types/productTypes';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { useSellerJournalsQuery } from '@/features/products/hooks/useSellerJournals';
import {
  CheckCircle,
  Image as ImageIcon,
  Box,
  Layers,
  Package,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { TabId } from '../page';

interface Props {
  product?: Product;
  onNavigateTab?: (tabId: TabId) => void;
}

export function ProductSetupProgress({ product, onNavigateTab }: Props) {
  const router = useRouter();
  const { useGetProcessTemplates, useGetProductionBatches } = useProductionBatch();

  const { data: templatesData, isLoading: isLoadingTemplates } = useGetProcessTemplates(
    product?.id ?? 0,
  );
  const { data: lotsData, isLoading: isLoadingLots } = useGetProductionBatches({
    productId: product?.id ?? 0,
    page: 1,
    size: 1,
  });
  const { data: journalsResponse, isPending: isLoadingJournals } = useSellerJournalsQuery(
    product?.id ?? 0,
  );

  const templates = templatesData || [];
  const lotsCount = lotsData?.data?.totalElements || 0;
  const journals = journalsResponse?.data || [];

  if (product && (isLoadingTemplates || isLoadingLots || isLoadingJournals)) {
    return <div className="h-28 bg-stone-100 rounded-2xl animate-pulse mb-6" />;
  }

  // Calculate progress
  let completedCount = 0;

  const hasBasicInfo = !!product;
  if (hasBasicInfo) completedCount++;

  const hasVariants = product?.variants && product.variants.length > 0;
  if (hasVariants) completedCount++;

  const hasImages = product?.images && product.images.length > 0;
  if (hasImages) completedCount++;

  const hasJournals = journals.length > 0;
  if (hasJournals) completedCount++;

  const hasTemplates = templates.length > 0;
  if (hasTemplates) completedCount++;

  const hasLots = lotsCount > 0;
  if (hasLots) completedCount++;

  const progress = Math.round((completedCount / 6) * 100);

  const steps = [
    {
      id: 'info',
      label: 'Thông tin chung',
      isCompleted: hasBasicInfo,
      icon: Box,
      actionText: 'Xem',
      onClick: () => onNavigateTab?.('info'),
    },
    {
      id: 'variants',
      label: 'Biến thể',
      isCompleted: !!hasVariants,
      icon: Layers,
      actionText: 'Xem',
      onClick: () => onNavigateTab?.('variants'),
    },
    {
      id: 'images',
      label: 'Hình ảnh',
      isCompleted: !!hasImages,
      icon: ImageIcon,
      actionText: 'Tải ảnh lên',
      onClick: () => onNavigateTab?.('images'),
    },

    {
      id: 'templates',
      label: 'Quy trình chuẩn',
      isCompleted: !!hasTemplates,
      icon: CheckCircle,
      actionText: 'Thiết lập ngay',
      onClick: () => onNavigateTab?.('process_templates'),
    },
    {
      id: 'lots',
      label: 'Đợt sản xuất',
      isCompleted: !!hasLots,
      icon: Package,
      actionText: 'Tạo lô mới',
      onClick: () =>
        product && router.push(`/dashboard/lo-san-xuat/tao-moi?productId=${product.id}`),
    },
    {
      id: 'journals',
      label: 'Câu chuyện',
      isCompleted: !!hasJournals,
      icon: BookOpen,
      actionText: 'Kể ngay',
      onClick: () => onNavigateTab?.('journals'),
    },
  ];

  if (progress === 100) return null; // Hide if fully completed

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div>
          <h3 className="font-black text-stone-900 text-lg">Tiến độ thiết lập sản phẩm</h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Hoàn thành các bước dưới đây để bắt đầu kinh doanh và truy xuất
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 w-fit shrink-0">
          <span className="text-blue-700 font-black">{progress}%</span>
          <span className="text-blue-600/80 text-[10px] font-bold uppercase tracking-wider">
            Hoàn thành
          </span>
        </div>
      </div>

      <div className="relative h-2 bg-stone-100 rounded-full overflow-hidden mb-5">
        <div
          className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              id={`tour-progress-${step.id}`}
              className={`flex flex-col p-3 rounded-xl border transition-colors ${
                step.isCompleted
                  ? 'bg-emerald-50/40 border-emerald-100/60'
                  : product
                    ? 'bg-stone-50 border-dashed border-stone-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer group'
                    : 'bg-stone-50 border-dashed border-stone-200 opacity-70 cursor-not-allowed group'
              }`}
              onClick={!step.isCompleted && product ? step.onClick : undefined}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg transition-colors ${step.isCompleted ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-200 text-stone-500 group-hover:bg-blue-100 group-hover:text-blue-600'}`}
                >
                  <Icon size={16} strokeWidth={2.5} />
                </div>
                {step.isCompleted && <CheckCircle size={14} className="text-emerald-500" />}
              </div>

              <span
                className={`text-sm font-bold mt-1 ${step.isCompleted ? 'text-stone-800' : 'text-stone-700'}`}
              >
                {step.label}
              </span>

              {!step.isCompleted && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                  {step.actionText}{' '}
                  <ArrowRight
                    size={10}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
