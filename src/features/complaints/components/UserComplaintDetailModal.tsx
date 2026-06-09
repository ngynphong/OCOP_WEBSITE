'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Complaint, ComplaintStatus } from '../types/complaintTypes';
import {
  LucideIcon,
  Loader2,
  Calendar,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Store,
  Hash,
  User,
  ShieldCheck,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

interface UserComplaintDetailModalProps {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  ComplaintStatus,
  { label: string; color: string; bgColor: string; icon: LucideIcon }
> = {
  OPEN: {
    label: 'Mở',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-100',
    icon: AlertCircle,
  },
  INVESTIGATING: {
    label: 'Đang điều tra',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-100',
    icon: Loader2,
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-100',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Từ chối',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-100',
    icon: XCircle,
  },
};

export const UserComplaintDetailModal = ({
  complaint,
  isOpen,
  onClose,
}: UserComplaintDetailModalProps) => {
  if (!complaint) return null;

  const status = STATUS_CONFIG[complaint.status];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết Khiếu nại của bạn"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Status Header */}
        <div
          className={cn(
            'p-4 rounded-xl border flex items-center justify-between',
            status.bgColor,
            status.color,
          )}
        >
          <div className="flex items-center gap-3">
            <status.icon
              size={24}
              className={cn(complaint.status === 'INVESTIGATING' ? 'animate-spin' : '')}
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Trạng thái hiện tại
              </p>
              <p className="text-sm font-black uppercase">{status.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
              Cập nhật lúc
            </p>
            <p className="text-xs font-bold">
              {format(new Date(complaint.updatedAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-3">
            <div className="flex items-center gap-2 text-stone-500">
              <Hash size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Mã khiếu nại: #{complaint.id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-emerald-600" />
              <span className="text-xs font-bold text-stone-900 uppercase">
                Loại: {complaint.type}
              </span>
            </div>
            {complaint.shopName && (
              <div className="flex items-center gap-2">
                <Store size={16} className="text-blue-600" />
                <span className="text-xs font-bold text-stone-900">
                  Cửa hàng: {complaint.shopName}
                </span>
              </div>
            )}
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 space-y-3">
            <div className="flex items-center gap-2 text-stone-500">
              <Calendar size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Ngày gửi:</span>
            </div>
            <div className="text-xs font-bold text-stone-900">
              {format(new Date(complaint.createdAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <User size={14} />
              <span className="text-xs font-medium">{complaint.userEmail}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 ml-1">
            <FileText size={16} className="text-stone-400" />
            <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Nội dung bạn đã gửi
            </h4>
          </div>
          <div className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm">
            <h3 className="font-bold text-stone-900 mb-2">{complaint.subject}</h3>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>
        </div>

        {/* Resolution Note Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 ml-1">
            <ShieldCheck size={16} className="text-emerald-600" />
            <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              Phản hồi từ OCOP
            </h4>
          </div>
          <div
            className={cn(
              'p-5 rounded-xl border min-h-[100px]',
              complaint.resolutionNote
                ? 'bg-emerald-50/50 border-emerald-100'
                : 'bg-stone-50 border-dashed border-stone-200 flex items-center justify-center',
            )}
          >
            {complaint.resolutionNote ? (
              <div className="space-y-3">
                <p className="text-sm text-stone-700 leading-relaxed italic">
                  {complaint.resolutionNote}
                </p>
                {complaint.handledByEmail && (
                  <div className="flex items-center gap-2 pt-3 border-t border-emerald-100 text-[10px] font-bold text-emerald-700 opacity-60">
                    <span className="uppercase tracking-widest">Xử lý bởi:</span>
                    <span>{complaint.handledByEmail}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center space-y-2">
                <MessageSquare size={24} className="mx-auto text-stone-300" />
                <p className="text-xs text-stone-400 font-medium">
                  Hiện chưa có phản hồi chính thức. Chúng tôi đang xử lý yêu cầu của bạn.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={onClose}
            className="w-full py-4 text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-stone-200"
          >
            Đóng cửa sổ
          </Button>
        </div>
      </div>
    </Modal>
  );
};
