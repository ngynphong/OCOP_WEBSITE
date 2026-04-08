'use client';

import React from 'react';
import { FiInfo, FiFileText, FiPackage, FiClock } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { ShopDetailTabType } from '../types/adminTypes';

interface ShopDetailTabsProps {
  activeTab: ShopDetailTabType;
  setActiveTab: (tab: ShopDetailTabType) => void;
}

const TABS: { id: ShopDetailTabType; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Tổng quan', icon: FiInfo },
  { id: 'legality', label: 'Hồ sơ pháp lý', icon: FiFileText },
  { id: 'subscription', label: 'Gói dịch vụ', icon: FiPackage },
  { id: 'history', label: 'Lịch sử hoạt động', icon: FiClock },
];

const ShopDetailTabs: React.FC<ShopDetailTabsProps> = React.memo(({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-white p-2 rounded-[24px] shadow-sm border border-stone-100 flex gap-1 overflow-x-auto no-scrollbar">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap',
              isActive
                ? 'bg-[#00490E] text-white shadow-lg shadow-emerald-900/20'
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50',
            )}
          >
            <Icon size={16} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});

ShopDetailTabs.displayName = 'ShopDetailTabs';

export default ShopDetailTabs;
