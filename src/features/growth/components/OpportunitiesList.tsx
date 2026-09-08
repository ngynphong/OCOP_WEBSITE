'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Tag,
  Package,
  FileText,
  MessageSquare,
  Flame,
  ArrowRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { GrowthOpportunity, GrowthOpportunityType, GrowthPriority } from '../types';

interface Props {
  opportunities: GrowthOpportunity[];
  isLoading?: boolean;
  onDismiss: (id: number) => void;
  onExecute?: (opp: GrowthOpportunity) => void;
}

export const OpportunitiesList: React.FC<Props> = ({
  opportunities,
  isLoading = false,
  onDismiss,
  onExecute,
}) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const getPriorityBadge = (priority: GrowthPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/60">
            Khẩn cấp
          </span>
        );
      case 'HIGH':
        return (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/60">
            Ưu tiên cao
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
            Khuyến nghị
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200/60">
            Tiêu chuẩn
          </span>
        );
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CONVERSION') return opp.type === 'LOW_CONVERSION' || opp.type === 'VOUCHER';
    if (activeTab === 'INVENTORY') return opp.type === 'LOW_STOCK' || opp.type === 'HIGH_STOCK';
    if (activeTab === 'LISTING') return opp.type === 'PRODUCT_IMPROVEMENT';
    if (activeTab === 'B2B') return opp.type === 'B2B_REQUEST';
    return true;
  });

  const getTabCount = (tabKey: string) => {
    if (tabKey === 'ALL') return opportunities.length;
    if (tabKey === 'CONVERSION') {
      return opportunities.filter((o) => o.type === 'LOW_CONVERSION' || o.type === 'VOUCHER')
        .length;
    }
    if (tabKey === 'INVENTORY') {
      return opportunities.filter((o) => o.type === 'LOW_STOCK' || o.type === 'HIGH_STOCK').length;
    }
    if (tabKey === 'LISTING') {
      return opportunities.filter((o) => o.type === 'PRODUCT_IMPROVEMENT').length;
    }
    if (tabKey === 'B2B') {
      return opportunities.filter((o) => o.type === 'B2B_REQUEST').length;
    }
    return 0;
  };

  const tabs = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'CONVERSION', label: 'Chuyển đổi & Voucher' },
    { key: 'INVENTORY', label: 'Kho hàng & Tồn' },
    { key: 'LISTING', label: 'Hồ sơ & Bản sắc OCOP' },
    { key: 'B2B', label: 'Đơn sỉ B2B' },
  ];

  const getTypeIcon = (type: GrowthOpportunityType) => {
    switch (type) {
      case 'LOW_CONVERSION':
      case 'VOUCHER':
        return <Tag className="w-4 h-4 text-emerald-600" />;
      case 'LOW_STOCK':
      case 'HIGH_STOCK':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'PRODUCT_IMPROVEMENT':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'B2B_REQUEST':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'FLASH_SALE':
        return <Flame className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-80 bg-gray-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="opportunities-section" className="space-y-4">
      {/* Category filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((t) => {
          const count = getTabCount(t.key);
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-emerald-700 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid of opportunities */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
          <Filter className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">
            Không có cơ hội nào thuộc danh mục này
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white border border-gray-100 hover:border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-100">
                      {getTypeIcon(opp.type)}
                    </div>
                    <span className="font-bold text-gray-900 text-xs line-clamp-1">
                      {opp.title}
                    </span>
                  </div>

                  {getPriorityBadge(opp.priority)}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                  {opp.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {opp.metric && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {opp.metric}
                    </span>
                  )}
                  {opp.estimatedLift && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <TrendingUp className="w-3 h-3" /> {opp.estimatedLift}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
                <button
                  onClick={() => onDismiss(opp.id)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Bỏ qua
                </button>

                {onExecute ? (
                  <button
                    type="button"
                    onClick={() => onExecute(opp)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    <span>Thực hiện</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Link
                    href={opp.actionUrl}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <span>Thực hiện</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
