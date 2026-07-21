'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter, useSearchParams, usePathname } from 'next/navigation';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import {
  useSellerProductDetailQuery,
  useSellerProductMutations,
} from '@/features/products/hooks/useSellerProducts';
import { Button } from '@/components/ui/AppButton';
import { ProductStatusBadge } from '@/features/products/components/ProductStatusBadge';
import { InfoTab } from '@/features/products/components/ProductDetail/InfoTab';
import { VariantsTab } from '@/features/products/components/ProductDetail/VariantsTab';
import { ImagesTab } from '@/features/products/components/ProductDetail/ImagesTab';
import { JournalsTab } from '@/features/products/components/ProductDetail/JournalsTab';
import {
  AiChatWidget,
  SuggestedJournalPayload,
} from '@/features/products/components/ProductDetail/AiChatWidget';

type TabId = 'info' | 'variants' | 'images' | 'journals';

const TABS: { id: TabId; label: string }[] = [
  { id: 'info', label: 'Thông tin' },
  { id: 'variants', label: 'Biến thể & Giá' },
  { id: 'images', label: 'Ảnh sản phẩm' },
  { id: 'journals', label: 'Nhật ký nguồn gốc' },
];

export default function SellerProductDetailPage() {
  return (
    <Suspense fallback={<div className="h-48 bg-stone-100 rounded-xl animate-pulse" />}>
      <SellerProductDetailContent />
    </Suspense>
  );
}

function SellerProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const productId = Number(id);

  const activeTab = (searchParams.get('tab') as TabId) || 'info';
  const [suggestedJournal, setSuggestedJournal] = useState<SuggestedJournalPayload | null>(null);

  const setActiveTab = (tab: TabId) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const { data, isPending } = useSellerProductDetailQuery(productId);
  const { submitProduct, isSubmitting, withdrawProduct, isWithdrawing } =
    useSellerProductMutations();

  const product = data?.data;

  if (isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-stone-100 rounded-xl" />
        <div className="h-64 bg-stone-100 rounded-xl" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-stone-400 text-sm font-semibold">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const canSubmit = product.status === 'DRAFT' || product.status === 'REJECTED';
  const canWithdraw = product.status === 'PENDING_REVIEW';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/san-pham')}
            className="p-2 rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition cursor-pointer"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-stone-900 leading-none">{product.name}</h2>
              <ProductStatusBadge status={product.status} />
            </div>
            <p className="text-xs text-stone-400 mt-1">{product.category?.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {canSubmit && (
            <Button
              onClick={() => submitProduct(product.id)}
              isLoading={isSubmitting}
              leftIcon={<FiSend size={14} />}
              variant="outline"
              className="border-amber-500! text-amber-500! hover:bg-amber-50! rounded-xl"
            >
              Gửi duyệt
            </Button>
          )}
          {canWithdraw && (
            <Button
              onClick={() => withdrawProduct(product.id)}
              isLoading={isWithdrawing}
              variant="outline"
            >
              Rút lại
            </Button>
          )}
        </div>
      </div>

      {/* Rejection note */}
      {product.status === 'REJECTED' && product.rejectionNote && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-black text-red-500 uppercase tracking-widest mb-1">
            Lý do từ chối
          </p>
          <p className="text-sm text-red-700">{product.rejectionNote}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-stone-100/50 rounded-xl w-fit border border-stone-100">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-emerald-600 shadow-sm border border-stone-100'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'info' && <InfoTab productId={productId} />}
        {activeTab === 'variants' && <VariantsTab productId={productId} />}
        {activeTab === 'images' && <ImagesTab productId={productId} />}
        {activeTab === 'journals' && (
          <JournalsTab
            productId={productId}
            productName={product.name}
            suggestedJournal={suggestedJournal}
            onSuggestionConsumed={() => setSuggestedJournal(null)}
          />
        )}
      </div>

      {/* Widget chat AI */}
      <AiChatWidget
        productId={product.id}
        productName={product.name}
        onJournalSuggested={(payload) => {
          setSuggestedJournal(payload);
          setActiveTab('journals');
        }}
      />
    </div>
  );
}
