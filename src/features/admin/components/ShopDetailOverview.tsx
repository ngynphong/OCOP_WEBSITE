'use client';

import React from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiActivity, FiCalendar } from 'react-icons/fi';
import { ShopListItem } from '../types/adminTypes';

interface ShopDetailOverviewProps {
  shop: ShopListItem;
}

const ShopDetailOverview: React.FC<ShopDetailOverviewProps> = React.memo(({ shop }) => {
  return (
    <div className="space-y-10">
      <section>
        <h4 className="text-lg font-black text-stone-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          Giới thiệu cửa hàng
        </h4>
        <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 text-stone-600 text-sm leading-relaxed italic">
          &ldquo;{shop.description}&rdquo;
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-black uppercase">Loại hình</p>
            <p className="text-sm font-bold text-stone-800">Doanh nghiệp Tư nhân</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <FiCalendar size={24} />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-black uppercase">Ngày gia nhập</p>
            <p className="text-sm font-bold text-stone-800">
              {format(new Date(shop.createdAt), 'dd MMMM, yyyy', { locale: vi })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

ShopDetailOverview.displayName = 'ShopDetailOverview';

export default ShopDetailOverview;
