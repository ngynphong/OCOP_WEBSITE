'use client';

import React from 'react';
import {
  Flame,
  ArrowRight,
  X,
  TrendingUp,
  Tag,
  Package,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import { GrowthActionType, GrowthOpportunity, GrowthPriority } from '../types';

interface Props {
  actions: GrowthOpportunity[];
  isLoading?: boolean;
  onDismiss: (id: number) => void;
  onExecute?: (opp: GrowthOpportunity) => void;
  isDismissing?: boolean;
}

export const TodayActionsSection: React.FC<Props> = ({
  actions,
  isLoading = false,
  onDismiss,
  onExecute,
  isDismissing = false,
}) => {
  const getPriorityBadge = (priority: GrowthPriority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600" /> Khẩn cấp
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Ưu tiên cao
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Khuyến nghị
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700">
            Tiêu chuẩn
          </span>
        );
    }
  };

  const getActionIcon = (actionType: GrowthActionType) => {
    switch (actionType) {
      case 'CREATE_VOUCHER':
        return <Tag className="w-4 h-4 text-emerald-600" />;
      case 'RESTOCK':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'UPDATE_PRODUCT_MEDIA':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'REPLY_RFQ':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'JOIN_FLASH_SALE':
        return <Flame className="w-4 h-4 text-rose-600" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
    }
  };

  const getActionLabel = (actionType: GrowthActionType) => {
    switch (actionType) {
      case 'CREATE_VOUCHER':
        return 'Tạo voucher kích cầu';
      case 'RESTOCK':
        return 'Tạo lô sản xuất mới';
      case 'UPDATE_PRODUCT_MEDIA':
        return 'Cập nhật hồ sơ & câu chuyện OCOP';
      case 'REPLY_RFQ':
        return 'Phản hồi báo giá sỉ B2B';
      case 'JOIN_FLASH_SALE':
        return 'Đăng ký Flash Sale';
      default:
        return 'Thực hiện ngay';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!actions || actions.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="inline-flex p-3 rounded-full bg-emerald-50 text-emerald-600 mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-gray-900">Không có hành động khẩn cấp hôm nay</h4>
        <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
          Tuyệt vời! Bạn đã xử lý hết các cơ hội tăng trưởng cần ưu tiên. Hệ thống sẽ tự động quét
          và gợi ý ngay khi phát hiện tín hiệu mới.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actions.map((act) => (
        <div
          key={act.id}
          className="group relative bg-white border border-gray-100 hover:border-emerald-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {getPriorityBadge(act.priority)}
              <span className="text-xs font-semibold text-gray-700">{act.title}</span>
            </div>

            <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{act.description}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {act.metric && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {act.metric}
                </span>
              )}
              {act.estimatedLift && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  <TrendingUp className="w-3 h-3" /> Dự kiến: {act.estimatedLift}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 md:pt-0 shrink-0 border-t md:border-t-0 border-gray-50">
            {onExecute ? (
              <button
                type="button"
                onClick={() => onExecute(act)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-colors active:scale-95 cursor-pointer"
              >
                {getActionIcon(act.actionType)}
                <span>{getActionLabel(act.actionType)}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            ) : (
              <Link
                href={act.actionUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-200 transition-colors"
              >
                {getActionIcon(act.actionType)}
                <span>{getActionLabel(act.actionType)}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            )}

            <button
              onClick={() => onDismiss(act.id)}
              disabled={isDismissing}
              title="Bỏ qua đề xuất này"
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
