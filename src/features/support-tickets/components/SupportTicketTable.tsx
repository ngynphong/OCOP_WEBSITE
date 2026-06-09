'use client';

import React from 'react';
import { SupportTicket } from '../types/supportTicketTypes';
import { Loader2, MessageSquare, ExternalLink, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';

interface SupportTicketTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  onViewDetail: (ticket: SupportTicket) => void;
}

export const SupportTicketTable = ({
  tickets,
  isLoading,
  onViewDetail,
}: SupportTicketTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-stone-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
        <p className="text-stone-400 text-sm mt-4 font-medium italic">
          Đang tải danh sách yêu cầu...
        </p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-stone-50/50 rounded-4xl border border-dashed border-stone-200 py-24 text-center">
        <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center mx-auto mb-6 border border-stone-100 shadow-sm text-stone-300">
          <MessageSquare size={40} />
        </div>
        <h3 className="text-xl font-bold text-stone-900">Bạn chưa có yêu cầu hỗ trợ nào</h3>
        <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto leading-relaxed font-medium">
          Mọi thắc mắc về đơn hàng, thanh toán hay kỹ thuật, chúng tôi luôn sẵn sàng lắng nghe bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 italic">
                Thông tin Ticket
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center italic">
                Phân loại
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center italic">
                Mức ưu tiên
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center italic">
                Trạng thái
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-right italic">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {tickets.map((item) => (
              <tr key={item.id} className="group hover:bg-emerald-50/20 transition-all">
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100 shadow-xs">
                        #{item.id}
                      </span>
                      <span className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-900 transition-colors">
                        {item.subject}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 line-clamp-1 leading-relaxed max-w-sm ml-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 opacity-60">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400">
                        <Calendar size={12} />
                        {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </div>
                      {item.replies?.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                          <MessageSquare size={10} />
                          {item.replies.length} phản hồi
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-xl border border-stone-200 shadow-sm transition-all group-hover:bg-white group-hover:border-emerald-100">
                      <Tag size={12} className="text-stone-400" />
                      <span className="text-[10px] font-black text-stone-600 uppercase tracking-tighter">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex items-center gap-1.5',
                        PRIORITY_CONFIG[item.priority].color,
                      )}
                    >
                      <ShieldAlert size={14} className="opacity-70" />
                      <span className="text-[11px] font-bold uppercase tracking-tight">
                        {PRIORITY_CONFIG[item.priority].label}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        'px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xs transition-all',
                        STATUS_CONFIG[item.status].bgColor,
                        STATUS_CONFIG[item.status].color,
                        'group-hover:scale-105',
                      )}
                    >
                      {STATUS_CONFIG[item.status].label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <button
                    onClick={() => onViewDetail(item)}
                    className="p-3 bg-stone-100 hover:bg-emerald-800 text-stone-500 hover:text-white rounded-xl transition-all cursor-pointer shadow-sm active:scale-90"
                    title="Xem chi tiết"
                  >
                    <ExternalLink size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
