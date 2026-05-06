'use client';

import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CartItem, CartIssueType } from '../types/cartTypes';
import { useUpdateCartItem, useRemoveCartItem } from '../hooks/useCart';
import { CiShop } from 'react-icons/ci';

// -------------------- Badge Component (dumb) ---------------------

interface StatusBadgeProps {
  type: CartIssueType;
}

const STATUS_BADGE_MAP: Record<CartIssueType, { label: string; className: string }> = {
  OUT_OF_STOCK: {
    label: 'Hết hàng, chọn sản phẩm khác',
    className: 'bg-red-100 text-red-700',
  },
  VARIANT_INACTIVE: {
    label: 'Ngừng kinh doanh',
    className: 'bg-stone-100 text-stone-500',
  },
  PRICE_CHANGED: {
    label: 'Giá thay đổi',
    className: 'bg-amber-100 text-amber-700',
  },
  QTY_EXCEEDED: {
    label: 'Vượt tồn kho',
    className: 'bg-orange-100 text-orange-700',
  },
  SHOP_LOCKED: {
    label: 'Shop tạm khóa',
    className: 'bg-red-100 text-red-700',
  },
};

function StatusBadge({ type }: StatusBadgeProps) {
  const config = STATUS_BADGE_MAP[type];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
        config.className,
      )}
    >
      <AlertCircle className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
}

// -------------------- OCOP Star Badge (dumb) ---------------------

function OcopStarBadge({ star }: { star: number }) {
  if (!star || star < 1) return null;
  return (
    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full border border-amber-200">
      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
      OCOP {star}★
    </span>
  );
}

// -------------------- Quantity Stepper (dumb) ---------------------

interface QtyStepperProps {
  qty: number;
  max: number;
  disabled?: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
  isPending?: boolean;
}

function QtyStepper({ qty, max, disabled, onDecrease, onIncrease, isPending }: QtyStepperProps) {
  const isDecDisabled = qty <= 1 || disabled || isPending;
  const isIncDisabled = qty >= max || disabled || isPending;

  return (
    <div
      className={cn(
        'inline-flex items-center bg-stone-100 rounded-full px-1.5 py-1 gap-1',
        disabled && 'opacity-50',
      )}
    >
      {/* Nút Giảm */}
      <button
        onClick={onDecrease}
        disabled={isDecDisabled}
        title={qty <= 1 ? 'Số lượng tối thiểu là 1' : undefined}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-full transition-colors text-stone-600',
          isDecDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm',
        )}
        aria-label="Giảm số lượng"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      {/* Số lượng + loading */}
      <span
        className={cn(
          'w-8 text-center text-sm font-bold text-stone-800 tabular-nums',
          isPending && 'animate-pulse text-stone-400',
        )}
      >
        {qty}
      </span>

      {/* Nút Tăng */}
      <button
        onClick={onIncrease}
        disabled={isIncDisabled}
        title={qty >= max ? `Đã đạt số lượng tối đa (${max} sản phẩm)` : undefined}
        className={cn(
          'w-7 h-7 flex items-center justify-center rounded-full transition-colors text-stone-600',
          isIncDisabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white hover:shadow-sm',
        )}
        aria-label="Tăng số lượng"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ================================================================
// CartItemCard — Main Component
// ================================================================

interface CartItemCardProps {
  item: CartItem;
  issueType?: CartIssueType;
  isSelected: boolean;
  onToggleSelect: (itemId: number) => void;
}

export const CartItemCard = React.memo(function CartItemCard({
  item,
  issueType,
  isSelected,
  onToggleSelect,
}: CartItemCardProps) {
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  // Local qty: optimistic UI — cập nhật ngay khi click, debounce API 400ms
  const [localQty, setLocalQty] = useState(item.qty);
  const [prevQty, setPrevQty] = useState(item.qty);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync với server value khi data refetch xong (sau khi API response)
  // Sử dụng pattern reset state trong render để tránh cascading renders (Lighthouse/Lint error)
  if (item.qty !== prevQty) {
    setLocalQty(item.qty);
    setPrevQty(item.qty);
  }

  const isDisabled = !item.inStock || !item.active || issueType === 'SHOP_LOCKED';

  const handleQtyChange = useCallback(
    (newQty: number) => {
      if (newQty < 1 || newQty > item.maxQty) return;

      // Optimistic: cập nhật UI ngay
      setLocalQty(newQty);

      // Debounce API call 400ms — tránh gọi liên tục khi bấm nhanh
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateItem(
          { itemId: item.id, data: { qty: newQty } },
          {
            onError: () => {
              // Rollback về server value nếu API lỗi
              setLocalQty(item.qty);
            },
          },
        );
      }, 400);
    },
    [item.id, item.maxQty, item.qty, updateItem],
  );

  const handleRemove = useCallback(() => {
    removeItem(item.id);
  }, [item.id, removeItem]);

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-5 transition-all duration-200',
        'border border-transparent hover:border-stone-100 hover:shadow-sm',
        isDisabled && 'opacity-60',
        isRemoving && 'opacity-30 scale-95',
      )}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected && !isDisabled}
        disabled={isDisabled}
        onChange={() => onToggleSelect(item.id)}
        className="w-4 h-4 rounded accent-green-700 mt-1 sm:mt-0 shrink-0 cursor-pointer"
        aria-label={`Chọn ${item.productName}`}
      />

      {/* Thumbnail */}
      <Link
        href={`/san-pham/${item.productSlug}`}
        className="shrink-0 w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 block relative"
        aria-label={item.productName}
      >
        <Image
          src={item.thumbnailUrl || '/images/placeholder.png'}
          alt={item.productName}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>

      {/* Info + Controls */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {/* Product info */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-1.5">
            <OcopStarBadge star={item.ocopStar} />
            {issueType && <StatusBadge type={issueType} />}
          </div>

          {/* Product name */}
          <Link
            href={`/san-pham/${item.productSlug}`}
            className="block text-sm font-bold text-stone-800 hover:text-green-700 transition-colors line-clamp-2 leading-snug"
          >
            {item.productName}
          </Link>

          {/* Variant */}
          <p className="text-xs text-stone-500">{item.variantName}</p>

          {/* Shop */}
          <Link
            href={`/cua-hang/${item.shopSlug}`}
            className="flex items-center gap-1 text-[10px] text-stone-400 hover:text-green-700 transition-colors font-medium"
          >
            <CiShop size={18} className="text-green-700" /> {item.shopName}
          </Link>
        </div>

        {/* Quantity + Price */}
        <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 shrink-0">
          {/* Qty Stepper — dùng localQty (optimistic) */}
          <QtyStepper
            qty={localQty}
            max={item.maxQty}
            disabled={isDisabled}
            isPending={isUpdating}
            onDecrease={() => handleQtyChange(localQty - 1)}
            onIncrease={() => handleQtyChange(localQty + 1)}
          />

          {/* Price block */}
          <div className="text-right min-w-[80px]">
            <div className="text-base font-black text-green-700">
              {item.subtotal.toLocaleString('vi-VN')}₫
            </div>
            {item.qty > 1 && (
              <div className="text-[10px] text-stone-400 mt-0.5">
                {item.priceSnapshot.toLocaleString('vi-VN')}₫ / sp
              </div>
            )}
            {item.priceChanged && (
              <div className="text-[10px] text-amber-600 line-through mt-0.5">
                Cũ: {item.currentPrice.toLocaleString('vi-VN')}₫
              </div>
            )}
          </div>

          {/* Remove */}
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0"
            aria-label="Xóa sản phẩm"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
});
