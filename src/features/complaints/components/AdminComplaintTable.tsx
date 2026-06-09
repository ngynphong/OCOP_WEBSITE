'use client';

import React from 'react';
import { Complaint, ComplaintStatus } from '../types/complaintTypes';
import { Loader2, ExternalLink, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface AdminComplaintTableProps {
  complaints: Complaint[];
  isLoading: boolean;
  isUpdating: boolean;
  onUpdateStatus: (id: number, status: ComplaintStatus) => void;
  onViewDetail: (id: number) => void;
}

const STATUS_CONFIG: Record<ComplaintStatus, { label: string; color: string; bgColor: string }> = {
  OPEN: { label: 'Mở', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-100' },
  INVESTIGATING: {
    label: 'Đang điều tra',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-100',
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-100',
  },
  REJECTED: { label: 'Từ chối', color: 'text-red-700', bgColor: 'bg-red-50 border-red-100' },
};

export const AdminComplaintTable = ({
  complaints,
  isLoading,
  isUpdating,
  onUpdateStatus,
  onViewDetail,
}: AdminComplaintTableProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-emerald-50/30 rounded-4xl border border-dashed border-emerald-100 py-20 text-center">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm text-emerald-800">
          <MessageCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Chưa có khiếu nại nào</h3>
        <p className="text-stone-500 text-sm mt-1">
          Hệ thống hiện tại sạch sẽ, không có khiếu nại từ khách hàng.
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
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                Khách hàng
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                Nội dung khiếu nại
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100 text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {complaints.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-stone-400 font-medium">{item.userEmail}</span>
                    <span className="text-[9px] mt-1 text-emerald-700 bg-emerald-50 self-start px-1.5 py-0.5 rounded-md font-bold">
                      {item.type}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 max-w-md">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-stone-800 line-clamp-1">
                      {item.subject}
                    </span>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 italic">
                      Gửi lúc:{' '}
                      {format(new Date(item.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border',
                        STATUS_CONFIG[item.status].bgColor,
                        STATUS_CONFIG[item.status].color,
                      )}
                    >
                      {STATUS_CONFIG[item.status].label}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex gap-1">
                      <select
                        disabled={isUpdating}
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as ComplaintStatus)}
                        className="text-[10px] font-black bg-stone-50 text-gray-700 border border-stone-100 rounded-lg px-2 py-1 outline-none focus:border-emerald-800 transition-all"
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 rounded-lg hover:bg-stone-100 text-stone-400"
                        title="Xem chi tiết"
                        onClick={() => onViewDetail(item.id)}
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
