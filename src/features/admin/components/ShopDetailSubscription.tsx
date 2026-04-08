'use client';

import React from 'react';
import { FiCheck } from 'react-icons/fi';
import { ShopListItem } from '../types/adminTypes';

interface ShopDetailSubscriptionProps {
  shop: ShopListItem;
}

const ShopDetailSubscription: React.FC<ShopDetailSubscriptionProps> = React.memo(({ shop }) => {
  return (
    <div className="space-y-8">
      <div className="bg-emerald-900 text-white rounded-[40px] p-10 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 opacity-20 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <p className="text-emerald-300 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              Gói dịch vụ hiện tại
            </p>
            <h4 className="text-5xl font-black mb-4 tracking-tighter">
              {shop.planName || 'FREE PLAN'}
            </h4>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-emerald-800/50 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2">
                <FiCheck className="text-emerald-400" /> Tính năng cơ bản
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ShopDetailSubscription.displayName = 'ShopDetailSubscription';

export default ShopDetailSubscription;
