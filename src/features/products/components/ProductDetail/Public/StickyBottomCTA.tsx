'use client';

import React, { useCallback } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { useAddToCart } from '@/features/cart/hooks/useCart';

interface StickyBottomCTAProps {
  variantId: number;
  price: number;
  inStock?: boolean;
  onBuyNow?: () => void;
}

export function StickyBottomCTA({
  variantId,
  price,
  inStock = true,
  onBuyNow,
}: StickyBottomCTAProps) {
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = useCallback(() => {
    addToCart({ variantId, qty: 1 });
  }, [addToCart, variantId]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-stone-100 p-4 z-50 md:hidden shadow-[0_-20px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex flex-col shrink-0 min-w-[100px]">
          <span className="text-[10px] font-black uppercase text-stone-400">Tổng cộng</span>
          <span className="text-xl font-black text-green-700 leading-none">
            {price.toLocaleString('vi-VN')}₫
          </span>
        </div>

        <div className="flex-1 flex gap-2">
          {/* Thêm vào giỏ */}
          <Button
            variant="outline"
            className="flex-1 px-4 h-14 rounded-xl border-stone-200 relative active:scale-95 transition-transform"
            onClick={handleAddToCart}
            disabled={isPending || inStock === false}
            aria-label="Thêm vào giỏ hàng"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-green-700" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </Button>

          {/* Mua ngay */}
          <Button
            variant="primary"
            className="flex-2 h-14 rounded-xl active:scale-95 transition-transform shadow-lg shadow-emerald-700/20"
            onClick={onBuyNow}
            disabled={inStock === false}
          >
            {inStock === false ? 'Hết hàng' : 'Mua ngay'}
          </Button>
        </div>
      </div>

      {/* Safe Area Padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
