'use client';

import React from 'react';
import { ContentFlag, ContentFlagStatus } from '../types/reviewTypes';
import { Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface FlagParams {
  status: ContentFlagStatus | 'ALL';
  pageNo: number;
  pageSize: number;
}

interface AdminFlagTableProps {
  flags: ContentFlag[];
  isLoading: boolean;
  isResolving: boolean;
  onResolve: (flagId: number, action: 'KEEP' | 'REMOVE') => void;
  params: FlagParams;
  setParams: React.Dispatch<React.SetStateAction<FlagParams>>;
  totalPages: number;
}

export const AdminFlagTable = ({
  flags,
  isLoading,
  isResolving,
  onResolve,
  params,
  setParams,
  totalPages,
}: AdminFlagTableProps) => {
  return (
    <div className="space-y-6">
      {/* Tabs / Filter Status */}
      <div className="flex gap-2 p-1 bg-stone-100 rounded-xl w-fit">
        {['PENDING', 'RESOLVED_KEPT', 'RESOLVED_REMOVED', 'ALL'].map((s) => (
          <button
            key={s}
            onClick={() =>
              setParams((prev) => ({ ...prev, status: s as ContentFlagStatus | 'ALL', pageNo: 1 }))
            }
            className={cn(
              'px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all',
              params.status === s
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-stone-400 hover:text-stone-600',
            )}
          >
            {s === 'PENDING'
              ? 'Chờ xử lý'
              : s === 'RESOLVED_KEPT'
                ? 'Đã giữ lại'
                : s === 'RESOLVED_REMOVED'
                  ? 'Đã gỡ bỏ'
                  : 'Tất cả'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
        </div>
      ) : flags.length > 0 ? (
        <div className="space-y-4">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden group"
            >
              <div className="p-6 flex flex-col md:flex-row gap-6">
                {/* Reporter Info */}
                <div className="md:w-1/4 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500" />
                    <span className="text-xs font-black text-red-600 uppercase tracking-widest">
                      Báo cáo vi phạm
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                      Người báo cáo
                    </p>
                    <p className="font-bold text-stone-900">{flag.reporterName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                      Lý do
                    </p>
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg uppercase tracking-tighter">
                      {flag.reason}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-bold">
                    {format(new Date(flag.createdAt), 'HH:mm • dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>

                {/* Targeted Content Context */}
                <div className="flex-1 p-6 bg-stone-50 rounded-xl border border-stone-100 relative">
                  <div className="absolute -top-3 left-6 px-2 bg-stone-50 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    Nội dung bị báo cáo
                  </div>
                  {flag.review ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-stone-800">
                          Đánh giá của {flag.review.userName}
                        </span>
                        <span className="text-[10px] font-bold text-stone-400">
                          ID: #{flag.reviewId}
                        </span>
                      </div>
                      <p className="text-sm text-stone-600 font-medium italic">
                        {flag.review.content}
                      </p>
                      {flag.detail && (
                        <div className="mt-4 pt-4 border-t border-stone-200">
                          <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">
                            Mô tả chi tiết báo cáo
                          </p>
                          <p className="text-sm text-stone-800 font-medium">{flag.detail}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-stone-400 italic">
                      Nội dung gốc không còn tồn tại hoặc đã bị ẩn.
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="md:w-1/4 flex flex-col justify-center gap-3">
                  {flag.status === 'PENDING' ? (
                    <>
                      <button
                        disabled={isResolving}
                        onClick={() => onResolve(flag.id, 'REMOVE')}
                        className="w-full py-4 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} />
                        Gỡ bỏ nội dung
                      </button>
                      <button
                        disabled={isResolving}
                        onClick={() => onResolve(flag.id, 'KEEP')}
                        className="w-full py-4 rounded-xl border border-stone-200 text-stone-600 text-xs font-black uppercase tracking-widest hover:bg-stone-50 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} />
                        Giữ lại (Hợp lệ)
                      </button>
                    </>
                  ) : (
                    <div
                      className={cn(
                        'p-4 rounded-xl border flex flex-col items-center gap-2 text-center',
                        flag.status === 'RESOLVED_KEPT'
                          ? 'bg-green-50 border-green-100 text-green-700'
                          : 'bg-stone-100 border-stone-200 text-stone-500',
                      )}
                    >
                      {flag.status === 'RESOLVED_KEPT' ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <XCircle size={24} />
                      )}
                      <span className="text-xs font-black uppercase tracking-widest">
                        {flag.status === 'RESOLVED_KEPT' ? 'Đã duyệt hợp lệ' : 'Đã gỡ bỏ'}
                      </span>
                      <p className="text-[10px] font-bold opacity-60">
                        Xử lý:{' '}
                        {flag.resolvedAt ? format(new Date(flag.resolvedAt), 'dd/MM/yyyy') : '---'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setParams((prev) => ({ ...prev, pageNo: idx + 1 }))}
                  className={cn(
                    'w-10 h-10 rounded-xl font-bold transition-all',
                    params.pageNo === idx + 1
                      ? 'bg-emerald-800 text-white'
                      : 'bg-white text-stone-400 border border-stone-100',
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-stone-50/50 rounded-4xl border border-dashed border-stone-200 py-20 text-center">
          <CheckCircle2 className="mx-auto text-stone-200 mb-4" size={48} />
          <h3 className="text-lg font-bold text-stone-900">Mọi thứ đều ổn</h3>
          <p className="text-stone-500 text-sm mt-1">
            Không có báo cáo vi phạm nội dung nào cần xử trị.
          </p>
        </div>
      )}
    </div>
  );
};
