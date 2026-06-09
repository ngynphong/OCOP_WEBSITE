'use client';

import React, { useEffect, useState } from 'react';
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
  MessageSquare,
  User,
  ShieldCheck,
  Clock,
  ArrowDownCircle,
  UserPlus,
  Mail,
  AlertCircle,
  ChevronLeft,
  ArrowLeft,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { STATUS_OPTIONS, STATUS_CONFIG } from '../constants';

interface AdminTicketDetailProps {
  ticketId: number;
}

export const AdminTicketDetail = ({ ticketId }: AdminTicketDetailProps) => {
  const { data: resp, isLoading } = useAdminTicketDetail(ticketId);
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
  }, [ticket?.replies?.length]);

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

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-stone-300" size={48} />
        <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.2em] mt-6 italic">
          Truy xuất dữ liệu hội thoại...
        </p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="py-24 text-center">
        <ArrowDownCircle size={48} className="mx-auto text-stone-100 mb-6" />
        <p className="text-stone-400 font-bold uppercase text-xs tracking-widest italic">
          Hệ thống: Không tìm thấy dữ liệu Ticket
        </p>
        <Link
          href="/admin/support-tickets"
          className="mt-6 inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 font-bold text-xs uppercase tracking-tight transition-colors"
        >
          <ArrowLeft size={16} /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/support-tickets"
            className="p-3 bg-white border border-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <ChevronLeft size={20} />
          </Link>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                TICKET #{ticket.id}
              </span>
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest italic">
                {ticket.category}
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight leading-none truncate max-w-xl">
              {ticket.subject}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={cn(
              'px-5 py-2.5 rounded-xl flex items-center gap-2.5 text-[11px] font-black uppercase tracking-widest border shadow-sm transition-all duration-300',
              STATUS_CONFIG[ticket.status].bgColor,
              STATUS_CONFIG[ticket.status].color,
            )}
          >
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                ticket.status === 'OPEN'
                  ? 'bg-blue-600'
                  : ticket.status === 'IN_PROGRESS'
                    ? 'bg-amber-600'
                    : ticket.status === 'PENDING_USER'
                      ? 'bg-purple-600'
                      : ticket.status === 'RESOLVED'
                        ? 'bg-emerald-600'
                        : 'bg-stone-400',
              )}
            />
            {STATUS_CONFIG[ticket.status].label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Conversation (8 cols) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col h-[calc(100vh-280px)] min-h-[550px]">
          <div
            className="flex-1 overflow-y-auto pr-2 space-y-8 scroller-hide scroll-smooth"
            ref={scrollRef}
          >
            {/* User Original Request */}
            <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-lg shadow-stone-200/10 relative overflow-hidden group">
              <div className="absolute -top-6 -right-6 p-4 opacity-[0.02] -rotate-12 transition-transform duration-700 group-hover:scale-110">
                <MessageSquare size={160} />
              </div>
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-900 border-2 border-emerald-50 flex items-center justify-center text-white shadow-lg">
                    <User size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-0.5">
                      Yêu cầu từ khách hàng
                    </span>
                    <span className="text-xs font-bold text-stone-900">{ticket.userEmail}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-stone-300 flex items-center gap-1.5 uppercase tracking-tighter">
                    <Clock size={12} className="text-emerald-500" /> THỜI GIAN
                  </span>
                  <span className="text-[10px] font-bold text-stone-500">
                    {format(new Date(ticket.createdAt), 'HH:mm • dd/MM/yyyy', { locale: vi })}
                  </span>
                </div>
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-lg font-black text-stone-900 tracking-tight leading-tight border-l-4 border-emerald-500 pl-4 uppercase">
                  {ticket.subject}
                </h3>
                <div className="text-sm text-stone-600 leading-relaxed font-medium bg-stone-50/80 p-5 rounded-xl border border-stone-100/50 shadow-inner italic">
                  {ticket.description}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-10">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="text-[9px] font-black text-stone-300 uppercase tracking-[0.3em] italic">
                Hành trình hỗ trợ
              </span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>

            {/* Replies List */}
            <div className="space-y-6">
              {(ticket.replies || []).map((reply) => {
                const isAdmin = reply.senderType === 'ADMIN' || reply.senderType === 'STAFF';
                return (
                  <div
                    key={reply.id}
                    className={cn(
                      'flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500',
                      isAdmin ? 'items-end pl-16' : 'items-start pr-16',
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-full p-5 rounded-xl shadow-md relative group transition-all duration-300 hover:shadow-lg',
                        isAdmin
                          ? 'bg-emerald-900 text-white rounded-tr-none shadow-emerald-900/5 hover:-translate-x-1'
                          : 'bg-white border border-stone-100 text-stone-800 rounded-tl-none shadow-stone-200/10 hover:translate-x-1',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-between gap-10 border-b pb-3 mb-3',
                          isAdmin ? 'border-white/10' : 'border-stone-50',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-5 h-5 rounded-md flex items-center justify-center',
                              isAdmin
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-stone-100 text-stone-400',
                            )}
                          >
                            {isAdmin ? <ShieldCheck size={12} /> : <User size={12} />}
                          </div>
                          <span
                            className={cn(
                              'text-[9px] font-black uppercase tracking-widest',
                              isAdmin ? 'text-emerald-400' : 'text-stone-500',
                            )}
                          >
                            {isAdmin ? `QUẢN TRỊ VIÊN` : 'KHÁCH HÀNG'}
                          </span>
                        </div>
                        <span
                          className={cn(
                            'text-[9px] font-bold italic',
                            isAdmin ? 'text-emerald-400/30' : 'text-stone-300',
                          )}
                        >
                          {format(new Date(reply.createdAt), 'HH:mm • dd/MM/yyyy', { locale: vi })}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap tracking-tight">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reply Area */}
          <div className="bg-white p-4 rounded-[28px] border border-stone-100 shadow-2xl shadow-stone-200/30 mt-auto relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0" />
            <form onSubmit={handleSendReply} className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply(e);
                    }
                  }}
                  rows={3}
                  placeholder="Viết phản hồi cho khách hàng..."
                  className="w-full p-2 bg-stone-50 text-stone-900 border border-stone-100 rounded-[20px] text-xs font-medium focus:bg-white focus:border-green-600 outline-none transition-all resize-none shadow-inner placeholder:text-stone-300"
                />
              </div>
              <Button
                type="submit"
                disabled={isReplying || !replyContent.trim()}
                className="group relative rounded-xl flex flex-col items-center justify-center cursor-pointer disabled:opacity-30 transition-all active:scale-95 space-y-1"
              >
                {isReplying ? (
                  <Loader2 className="animate-spin text-emerald-400" />
                ) : (
                  <Send size={22} />
                )}
                <span className="text-[9px] font-black uppercase tracking-widest">Gửi</span>
              </Button>
            </form>
          </div>
        </div>

        {/* Right Panel: Internal Tools (4 cols) - Sticky */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Assignment & Status Control */}
          <div className="bg-white rounded-xl p-8 border border-stone-100 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-800 rounded-xl shadow-lg shadow-emerald-900/20">
                  <ShieldCheck size={16} className="text-white" />
                </div>
                <h4 className="text-[11px] font-black text-stone-900 uppercase tracking-[0.2em] italic">
                  Điều phối & Trạng thái
                </h4>
              </div>

              <div className="space-y-4">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">
                    Phụ trách xử lý
                  </p>
                  {ticket.assignedToEmail ? (
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-white border border-stone-100 flex items-center justify-center text-stone-400">
                        <User size={16} />
                      </div>
                      <div>
                        <span className="text-[11px] font-black text-stone-800 block leading-tight">
                          {ticket.assignedToEmail}
                        </span>
                        <span className="text-[8px] font-bold text-emerald-600 uppercase italic">
                          Admin Moderator
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => assignTicket(ticket.id)}
                      disabled={isAssigning}
                      className="w-full py-3 rounded-lg text-[9px] uppercase font-black tracking-widest border-dashed border-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all"
                    >
                      {isAssigning ? (
                        <Loader2 className="animate-spin mr-2" />
                      ) : (
                        <UserPlus size={14} className="mr-2" />
                      )}
                      Xác nhận Ticket
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-stone-400 uppercase tracking-widest ml-1">
                    Đổi trạng thái
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleUpdateStatus(opt.value)}
                        disabled={isUpdatingStatus}
                        className={cn(
                          'w-full px-4 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-left transition-all border flex items-center justify-between group cursor-pointer',
                          ticket.status === opt.value
                            ? `ring-2 ring-emerald-500/10 border-emerald-500 ${opt.bgColor} ${opt.color}`
                            : 'bg-white border-stone-100 text-stone-400 hover:bg-stone-50 hover:text-stone-600',
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {isUpdatingStatus && ticket.status === opt.value ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <div
                              className={cn(
                                'w-1.5 h-1.5 rounded-full bg-current opacity-40',
                                ticket.status === opt.value && 'opacity-100',
                              )}
                            />
                          )}
                          {opt.label}
                        </span>
                        {ticket.status === opt.value && (
                          <ShieldCheck size={12} className="opacity-100" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="pt-8 border-t border-stone-50 space-y-4">
              <div className="flex items-center gap-3">
                <AlertCircle size={16} className="text-stone-300" />
                <h4 className="text-[11px] font-black text-stone-900 uppercase tracking-widest">
                  Chi tiết khách hàng
                </h4>
              </div>
              <div className="bg-green-700 p-6 rounded-xl space-y-4 shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white/40">
                    <Mail size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-white truncate">{ticket.userEmail}</p>
                    <p className="text-[9px] font-black text-emerald-400/60 uppercase tracking-tighter">
                      UID: {ticket.userId}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white uppercase italic">Gửi yêu cầu:</span>
                    <span className="font-black text-white">
                      {format(new Date(ticket.createdAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-white uppercase italic">Cập nhật:</span>
                    <span className="font-black text-white">
                      {format(new Date(ticket.updatedAt), 'dd/MM/yyyy HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              {ticket.relatedOrderId && (
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 border-dashed">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1 italic">
                    Đơn hàng liên quan
                  </p>
                  <span className="text-xs font-black text-amber-900">
                    #ORD-{ticket.relatedOrderId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
