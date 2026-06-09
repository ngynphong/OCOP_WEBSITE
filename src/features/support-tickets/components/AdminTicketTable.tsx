'use client';

import React from 'react';
import { SupportTicket } from '../types/supportTicketTypes';
import { Loader2, ExternalLink, User, Clock, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import { STATUS_CONFIG, PRIORITY_CONFIG } from '../constants';
import { Button } from '@/components/ui/AppButton';

interface AdminTicketTableProps {
  tickets: SupportTicket[];
  isLoading: boolean;
}

export const AdminTicketTable = ({ tickets, isLoading }: AdminTicketTableProps) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-stone-100 shadow-sm">
        <Loader2 className="w-10 h-10 text-stone-300 animate-spin" />
        <p className="text-stone-400 text-xs mt-4 font-black uppercase tracking-widest">
          Đang tải dữ liệu hệ thống...
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
                Khách hàng & Tiêu đề
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center italic">
                Phân loại
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center italic">
                Mức ưu tiên
              </th>
              <th className="px-6 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center italic">
                Người phụ trách
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
              <tr key={item.id} className="group hover:bg-stone-50/50 transition-all">
                <td className="px-6 py-6">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-stone-400">#{item.id}</span>
                      <span className="text-sm font-extrabold text-stone-900 group-hover:text-emerald-900 transition-colors">
                        {item.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium text-stone-500">
                      <User size={12} className="text-stone-300" />
                      <span className="truncate max-w-[180px]">{item.userEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400">
                        <Clock size={10} />
                        {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 rounded-xl border border-stone-200">
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
                        'px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tight',
                        PRIORITY_CONFIG[item.priority].bgColor,
                        PRIORITY_CONFIG[item.priority].color,
                        'border-current opacity-80',
                      )}
                    >
                      {PRIORITY_CONFIG[item.priority].label}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex flex-col items-center">
                    {item.assignedToEmail ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {item.assignedToEmail}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-stone-400 italic">
                        Chưa phân công
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        'px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-xs',
                        STATUS_CONFIG[item.status].bgColor,
                        STATUS_CONFIG[item.status].color,
                      )}
                    >
                      {STATUS_CONFIG[item.status].label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                  <Button
                    onClick={() => router.push(`/admin/support-tickets/${item.id}`)}
                    className="p-3 bg-stone-900 hover:bg-emerald-800 text-white rounded-xl transition-all cursor-pointer shadow-lg shadow-stone-900/10 active:scale-90"
                    title="Xử lý hỗ trợ"
                  >
                    <ExternalLink size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
