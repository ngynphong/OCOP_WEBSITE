'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { TicketStatus } from '../types/supportTicketTypes';
import {
  useAdminTicketDetail,
  useAdminReplyTicket,
  useAdminUpdateStatus,
  useAdminAssignTicket,
} from '../hooks/useSupportTickets';
import {
  Loader2,
  Send,
  User,
  ShieldCheck,
  ArrowDownCircle,
  UserPlus,
  Mail,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AdminTicketDetailModalProps {
  ticketId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: { label: string; value: TicketStatus; color: string; bgColor: string }[] = [
  { label: 'Đang mở (Mới)', value: 'OPEN', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { label: 'Đang xử lý', value: 'IN_PROGRESS', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  {
    label: 'Chờ khách trả lời',
    value: 'PENDING_USER',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    label: 'Đã giải quyết',
    value: 'RESOLVED',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  { label: 'Đóng ticket', value: 'CLOSED', color: 'text-stone-500', bgColor: 'bg-stone-50' },
];

export const AdminTicketDetailModal = ({
  ticketId,
  isOpen,
  onClose,
}: AdminTicketDetailModalProps) => {
  const { data: resp, isLoading } = useAdminTicketDetail(ticketId || undefined);
  const { mutate: sendReply, isPending: isReplying } = useAdminReplyTicket();
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useAdminUpdateStatus();
  const { mutate: assignTicket, isPending: isAssigning } = useAdminAssignTicket();

  const [replyContent, setReplyContent] = useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const ticket = resp?.data;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.replies?.length, isOpen]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !replyContent.trim()) return;

    sendReply(
      {
        id: ticketId,
        data: { content: replyContent },
      },
      {
        onSuccess: () => setReplyContent(''),
      },
    );
  };

  const handleUpdateStatus = (status: TicketStatus) => {
    if (!ticketId) return;
    updateStatus({ id: ticketId, status });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hệ thống Quản trị Hỗ trợ (Internal)"
      maxWidth="max-w-4xl"
    >
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-stone-300" size={48} />
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-6">
            Truy xuất dữ liệu hội thoại...
          </p>
        </div>
      ) : ticket ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[75vh]">
          {/* Left Panel: Conversation (8 cols) */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-4 space-y-6 scroll-smooth">
              {/* User Original Request */}
              <div className="bg-stone-50 rounded-xl p-6 border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white">
                      <User size={14} />
                    </div>
                    <span className="text-xs font-black text-stone-900 uppercase">
                      Yêu cầu từ khách hàng
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 italic">
                    {format(new Date(ticket.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
                <h3 className="text-sm font-black text-stone-900 mb-2">{ticket.subject}</h3>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="flex-1 h-px bg-stone-100" />
                <span className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">
                  Lịch sử phản hồi
                </span>
                <div className="flex-1 h-px bg-stone-100" />
              </div>

              {/* Replies List */}
              {(ticket.replies || []).map((reply) => {
                const isAdmin = reply.senderType === 'ADMIN' || reply.senderType === 'STAFF';
                return (
                  <div
                    key={reply.id}
                    className={cn('flex flex-col', isAdmin ? 'items-end' : 'items-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[90%] p-5 rounded-xl shadow-xs',
                        isAdmin
                          ? 'bg-stone-900 text-white rounded-tr-none'
                          : 'bg-white border border-stone-100 text-stone-800 rounded-tl-none',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-between gap-10 border-b pb-2 mb-2',
                          isAdmin ? 'border-white/10' : 'border-stone-50',
                        )}
                      >
                        <span
                          className={cn(
                            'text-[9px] font-bold uppercase',
                            isAdmin ? 'text-amber-400' : 'text-stone-400',
                          )}
                        >
                          {isAdmin ? `Staff: ${reply.senderEmail}` : 'User (Khách hàng)'}
                        </span>
                        <span className="text-[9px] opacity-40">
                          {format(new Date(reply.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            {/* Reply Area */}
            <div className="mt-4 pt-4 border-t border-stone-100">
              <form onSubmit={handleSendReply} className="flex gap-2">
                <div className="flex-1 relative">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập nội dung phản hồi cho khách hàng..."
                    className="w-full h-24 px-5 py-4 bg-stone-50 border border-stone-100 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all resize-none shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="w-16 h-24 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xl shadow-emerald-900/20 flex items-center justify-center cursor-pointer disabled:opacity-30 transition-all active:scale-95"
                >
                  {isReplying ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Operations (4 cols) */}
          <div className="lg:col-span-4 bg-stone-50/50 rounded-xl p-6 border border-stone-100 flex flex-col gap-8">
            {/* General Info */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-800" /> Quản trị nội bộ
              </h4>

              <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-xs">
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-tight mb-1">
                    Xử lý bởi
                  </p>
                  {ticket.assignedToEmail ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-xs font-extrabold text-stone-800">
                        {ticket.assignedToEmail}
                      </span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => assignTicket(ticket.id)}
                      className="w-full py-2 rounded-xl text-[10px] uppercase font-black tracking-widest mt-2 border-dashed"
                    >
                      {isAssigning ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <UserPlus size={14} className="mr-2" />
                      )}
                      Nhận xử lý ngay
                    </Button>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-xs">
                  <p className="text-[10px] font-black text-stone-300 uppercase tracking-tight mb-2">
                    Trạng thái hệ thống
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleUpdateStatus(opt.value)}
                        disabled={isUpdatingStatus}
                        className={cn(
                          'w-full px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tight text-left transition-all border',
                          ticket.status === opt.value
                            ? `ring-2 ring-emerald-500/20 border-current ${opt.bgColor} ${opt.color}`
                            : 'bg-white border-transparent text-stone-400 hover:bg-stone-50 hover:text-stone-600',
                        )}
                      >
                        {isUpdatingStatus && ticket.status === opt.value ? (
                          <Loader2 size={12} className="animate-spin inline mr-2" />
                        ) : null}
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="mt-auto space-y-4">
              <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={14} /> Thông tin khách hàng
              </h4>
              <div className="bg-white rounded-xl p-4 border border-stone-100 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400">
                    <Mail size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-black text-stone-900 truncate">{ticket.userEmail}</p>
                    <p className="text-[10px] text-stone-400 truncate">ID: {ticket.userId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-50">
                  <Calendar size={14} className="text-stone-300" />
                  <span className="text-[10px] font-bold text-stone-500">
                    Gửi lúc: {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center">
          <ArrowDownCircle size={48} className="mx-auto text-stone-100 mb-6" />
          <p className="text-stone-400 font-bold uppercase text-xs tracking-widest italic">
            Hệ thống: Không tìm thấy dữ liệu Ticket
          </p>
        </div>
      )}
    </Modal>
  );
};
