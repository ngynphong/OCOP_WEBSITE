import { Complaint, ComplaintStatus } from '../types/complaintTypes';
import {
  Loader2,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Store,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { UserComplaintDetailModal } from './UserComplaintDetailModal';
import React from 'react';

interface MyComplaintsTableProps {
  complaints: Complaint[];
  isLoading: boolean;
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

export const MyComplaintsTable = ({ complaints, isLoading }: MyComplaintsTableProps) => {
  const [selectedComplaint, setSelectedComplaint] = React.useState<Complaint | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-emerald-800 animate-spin" />
      </div>
    );
  }

  if (complaints.length === 0) {
    return (
      <div className="bg-stone-50/50 rounded-4xl border border-dashed border-stone-200 py-20 text-center">
        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 border border-stone-100 shadow-sm text-stone-400">
          <MessageSquare size={32} />
        </div>
        <h3 className="text-lg font-bold text-stone-900">Bạn chưa gửi khiếu nại nào</h3>
        <p className="text-stone-500 text-sm mt-1">
          Các ý kiến phản hồi của bạn sẽ giúp hệ thống OCOP ngày càng hoàn thiện hơn.
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
                Thông tin khiếu nại
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                Đối tượng
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-100">
                Phản hồi từ OCOP
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
            {complaints.map((item, idx) => (
              <tr key={`${item.id}-${idx}`} className="hover:bg-stone-50/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-stone-400 uppercase">
                        #{item.id}
                      </span>
                      <span className="text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-tight">
                        {item.type}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-stone-900 line-clamp-1">
                      {item.subject}
                    </span>
                    <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-stone-400 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle size={10} />
                      Gửi lúc:{' '}
                      {format(new Date(item.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    {item.shopName ? (
                      <div className="flex items-center gap-2">
                        <Store size={14} className="text-blue-500" />
                        <span className="text-xs font-bold text-stone-700">{item.shopName}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-stone-400 italic">Dịch vụ chung</span>
                    )}
                    {item.orderId && (
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={14} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
                          Đơn: #{item.orderId}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 max-w-xs">
                  {item.resolutionNote ? (
                    <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                      <p className="text-[11px] text-emerald-800 leading-relaxed italic line-clamp-2">
                        {item.resolutionNote}
                      </p>
                    </div>
                  ) : (
                    <span className="text-[10px] text-stone-500 italic font-medium">
                      Đang chờ xử lý...
                    </span>
                  )}
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
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => setSelectedComplaint(item)}
                    className="p-2 bg-stone-50 hover:bg-emerald-50 text-stone-400 hover:text-emerald-600 rounded-lg transition-all cursor-pointer"
                    title="Xem chi tiết"
                  >
                    <ExternalLink size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserComplaintDetailModal
        complaint={selectedComplaint}
        isOpen={selectedComplaint !== null}
        onClose={() => setSelectedComplaint(null)}
      />
    </div>
  );
};
