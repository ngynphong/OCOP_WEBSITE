'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { useComplaintDetail, useAdminUpdateComplaint } from '../hooks/useComplaints';
import { ComplaintStatus } from '../types/complaintTypes';
import {
  LucideIcon,
  Loader2,
  Mail,
  Calendar,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Image as ImageIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AdminComplaintDetailModalProps {
  complaintId: number | null;
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

export const AdminComplaintDetailModal = ({
  complaintId,
  isOpen,
  onClose,
}: AdminComplaintDetailModalProps) => {
  const { data: resp, isLoading } = useComplaintDetail(complaintId || undefined);
  const { mutate: updateStatus, isPending: isUpdating } = useAdminUpdateComplaint();

  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | ''>('');

  const complaint = resp?.data;

  useEffect(() => {
    if (complaint) {
      const frame = requestAnimationFrame(() => {
        setSelectedStatus(complaint.status);
        setResolutionNote(complaint.resolutionNote || '');
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [complaint]);

  const handleResolve = () => {
    if (!complaintId || !selectedStatus) return;

    updateStatus(
      {
        id: complaintId,
        data: {
          status: selectedStatus as ComplaintStatus,
          resolutionNote: resolutionNote,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Khiếu nại" maxWidth="max-w-3xl">
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="animate-spin text-emerald-800" size={40} />
        </div>
      ) : complaint ? (
        <div className="space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
                    Email
                  </p>
                  <p className="text-sm font-bold text-stone-900">{complaint.userEmail}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">
                    Thời gian gửi
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    {format(new Date(complaint.createdAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">
                    Loại
                  </p>
                  <p className="text-sm font-bold text-emerald-800 uppercase">{complaint.type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-stone-50 rounded-xl p-6 border border-stone-100 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="text-stone-400 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-sm font-black text-stone-900 mb-2">{complaint.subject}</h4>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            </div>

            {/* Images handling */}
            {complaint.evidenceUrls && (
              <div className="pt-4 border-t border-stone-200">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <ImageIcon size={14} /> Hình ảnh bằng chứng
                </p>
                <div className="flex flex-wrap gap-3">
                  {(typeof complaint.evidenceUrls === 'string'
                    ? complaint.evidenceUrls
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    : []
                  ).map((img, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-200 shadow-sm transition-transform hover:scale-105 cursor-zoom-in"
                    >
                      <Image src={img} alt="Evidence" fill className="object-cover" sizes="96px" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <hr className="border-stone-100" />

          {/* Action Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-800" />
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-tight">
                Xử lý khiếu nại
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Cập nhật Trạng thái
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedStatus(key as ComplaintStatus)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[10px] font-black uppercase tracking-tight transition-all cursor-pointer',
                        selectedStatus === key
                          ? cn(
                              config.bgColor,
                              config.color,
                              'ring-2 ring-emerald-500 ring-offset-1',
                            )
                          : 'bg-white border-stone-100 text-stone-400 hover:border-stone-300',
                      )}
                    >
                      <config.icon
                        size={14}
                        className={cn(selectedStatus === key ? '' : 'opacity-30')}
                      />
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Ghi chú giải quyết (resolutionNote)
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Nhập nội dung phản hồi hoặc phương án xử lý..."
                  className="w-full h-[88px] px-4 py-3 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl text-sm font-medium outline-none focus:border-emerald-800 transition-all resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest"
                onClick={onClose}
              >
                Đóng
              </Button>
              <Button
                onClick={handleResolve}
                disabled={isUpdating || !selectedStatus}
                className="flex-2 py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShieldCheck size={16} />
                )}
                Xác nhận xử lý
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center text-stone-400">Không tìm thấy dữ liệu.</div>
      )}
    </Modal>
  );
};

const ShieldCheck = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
