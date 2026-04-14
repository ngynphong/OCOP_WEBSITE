'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

interface StickyBottomCTAProps {
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  price: number;
}

export function StickyBottomCTA({ onAddToCart, onBuyNow, price }: StickyBottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-100 p-4 z-50 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="flex flex-col shrink-0 min-w-[100px]">
          <span className="text-[10px] font-black uppercase text-stone-400">Tổng cộng</span>
          <span className="text-xl font-black text-green-700 leading-none">
            {price.toLocaleString('vi-VN')}₫
          </span>
        </div>

        <div className="flex-1 flex gap-2">
          <Button
            variant="outline"
            className="flex-1 px-4 h-14 rounded-2xl border-stone-200"
            onClick={onAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
          <Button variant="primary" className="flex-2 h-14 rounded-2xl" onClick={onBuyNow}>
            Mua ngay
          </Button>
        </div>
      </div>

      {/* Safe Area Padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </div>
  );
}
