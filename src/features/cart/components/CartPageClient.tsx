'use client';

import React, { useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2, CheckSquare, Square } from 'lucide-react';
import {
  useCart,
  useClearCart,
  useRemoveCartItems,
  useSyncCartPrices,
} from '@/features/cart/hooks/useCart';
import { CartItemCard } from '@/features/cart/components/CartItemCard';
import { CartSummary } from '@/features/cart/components/CartSummary';
import { CartSkeleton } from '@/features/cart/components/CartSkeleton';
import { CartEmptyState } from '@/features/cart/components/CartEmptyState';
import { PriceChangedBanner } from '@/features/cart/components/PriceChangedBanner';
import type { CartItem, CartIssueType, CartShopGroup } from '@/features/cart/types/cartTypes';
import { CiShop } from 'react-icons/ci';

function groupItemsByShop(items: CartItem[]): CartShopGroup[] {
  const map = new Map<number, CartShopGroup>();

  items.forEach((item) => {
    const existing = map.get(item.shopId);
    if (existing) {
      existing.items.push(item);
      existing.shopSubtotal += item.subtotal;
    } else {
      map.set(item.shopId, {
        shopId: item.shopId,
        shopName: item.shopName,
        shopSlug: item.shopSlug,
        items: [item],
        shopSubtotal: item.subtotal,
      });
    }
  });

  return Array.from(map.values());
}

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearSelection,
  setSelection,
  syncWithActualCart,
  toggleItemSelection,
} from '@/store/features/cartSlice';

export function CartPageClient() {
  const dispatch = useAppDispatch();
  const { selectedItemIds } = useAppSelector((state) => state.cart);

  const { data: cartResponse, isPending, isError } = useCart();
  const { mutate: clearCart, isPending: isClearing } = useClearCart();
  const { mutate: removeItems } = useRemoveCartItems();
  const { mutate: syncPrices, isPending: isSyncing } = useSyncCartPrices();

  const cartData = cartResponse?.data;
  const items = useMemo(() => cartData?.items ?? [], [cartData?.items]);

  // Đồng bộ selection với các items thực tế trong giỏ hàng (phòng trường hợp bị xóa bên khác)
  useEffect(() => {
    if (items.length > 0) {
      const actualIds = items.map((i) => i.id);
      dispatch(syncWithActualCart(actualIds));
    }
  }, [items, dispatch]);

  const issueMap = useMemo(() => {
    const map = new Map<number, CartIssueType>();
    items.forEach((item) => {
      if (!item.inStock) map.set(item.id, 'OUT_OF_STOCK');
      else if (!item.active) map.set(item.id, 'VARIANT_INACTIVE');
      else if (item.priceChanged) map.set(item.id, 'PRICE_CHANGED');
    });
    return map;
  }, [items]);

  const priceChangedIssues = useMemo(
    () =>
      items
        .filter((item) => item.priceChanged)
        .map((item) => ({
          itemId: item.id,
          variantId: item.variantId,
          type: 'PRICE_CHANGED' as CartIssueType,
          message: `${item.productName} (${item.variantName}): ${item.priceSnapshot.toLocaleString('vi-VN')}₫ → ${item.currentPrice.toLocaleString('vi-VN')}₫`,
          oldPrice: item.priceSnapshot,
          newPrice: item.currentPrice,
        })),
    [items],
  );

  const selectableIds = useMemo(
    () => items.filter((item) => item.inStock && item.active).map((item) => item.id),
    [items],
  );

  const isAllSelected =
    selectableIds.length > 0 && selectableIds.every((id) => selectedItemIds.includes(id));

  const shopGroups = useMemo(() => groupItemsByShop(items), [items]);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.includes(item.id)),
    [items, selectedItemIds],
  );

  const hasIssues = items.some((item) => issueMap.has(item.id));

  const handleToggleSelect = useCallback(
    (itemId: number) => {
      dispatch(toggleItemSelection(itemId));
    },
    [dispatch],
  );

  const handleToggleAll = useCallback(() => {
    if (isAllSelected) {
      dispatch(setSelection([]));
    } else {
      dispatch(setSelection(selectableIds));
    }
  }, [isAllSelected, selectableIds, dispatch]);

  const handleDeleteSelected = useCallback(() => {
    if (selectedItemIds.length === 0) return;
    removeItems(
      { itemIds: selectedItemIds },
      {
        onSuccess: () => dispatch(setSelection([])),
      },
    );
  }, [selectedItemIds, removeItems, dispatch]);

  const handleClearCart = useCallback(() => {
    clearCart(undefined, {
      onSuccess: () => dispatch(clearSelection()),
    });
  }, [clearCart, dispatch]);

  if (isPending) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <CartSkeleton count={3} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center">
        <p className="text-stone-500 text-sm">Không thể tải giỏ hàng. Vui lòng thử lại.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        <CartEmptyState />
      </div>
    );
  }

  // ---- Main render ----

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-28">
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
        {/* ======== LEFT COLUMN ======== */}
        <div className="lg:col-span-8 space-y-6">
          {/* Page title + back */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-stone-800 tracking-tight">Giỏ hàng</h1>
              <span className="text-sm font-semibold text-stone-400 bg-stone-100 px-2.5 py-1 rounded-full">
                {cartData?.totalItems ?? 0} sản phẩm
              </span>
            </div>
            <Link
              href="/san-pham"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-green-700 hover:text-green-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Tiếp tục mua sắm
            </Link>
          </div>

          {/* Price changed banner */}
          {priceChangedIssues.length > 0 && (
            <PriceChangedBanner
              issues={priceChangedIssues}
              onSync={() => syncPrices()}
              isSyncing={isSyncing}
            />
          )}

          {/* Bulk action bar */}
          <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-stone-100">
            {/* Select all */}
            <button
              onClick={handleToggleAll}
              className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-green-700 transition-colors"
            >
              {isAllSelected ? (
                <CheckSquare className="w-5 h-5 text-green-700" />
              ) : (
                <Square className="w-5 h-5 text-stone-400" />
              )}
              Chọn tất cả ({selectableIds.length})
            </button>

            <div className="flex items-center gap-3">
              {selectedItemIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2.5 sm:py-1.5 rounded-full transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa đã chọn ({selectedItemIds.length})
                </button>
              )}
              <button
                onClick={handleClearCart}
                disabled={isClearing}
                className="text-xs font-medium text-stone-400 hover:text-red-500 transition-colors"
              >
                {isClearing ? 'Đang xóa...' : 'Xóa tất cả'}
              </button>
            </div>
          </div>

          {/* Items grouped by shop */}
          <div className="space-y-6">
            {shopGroups.map((group) => (
              <div key={group.shopId} className="space-y-3">
                {/* Shop header */}
                <div className="flex items-center justify-between px-1">
                  <Link
                    href={`/cua-hang/${group.shopSlug}`}
                    className="flex items-center gap-1.5 text-sm font-bold text-stone-700 hover:text-green-700 transition-colors"
                  >
                    <span>
                      <CiShop size={18} className="text-green-700" />
                    </span>
                    {group.shopName}
                  </Link>
                  <span className="text-xs text-stone-400 font-medium">
                    Tạm tính: {group.shopSubtotal.toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      issueType={issueMap.get(item.id)}
                      isSelected={selectedItemIds.includes(item.id)}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: back link */}
          <Link
            href="/san-pham"
            className="sm:hidden inline-flex items-center gap-1.5 text-sm font-semibold text-green-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* ======== RIGHT COLUMN: Summary ======== */}
        <aside className="lg:col-span-4">
          <CartSummary selectedItems={selectedItems} hasIssues={hasIssues} />
        </aside>
      </div>
    </div>
  );
}
