'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { TicketStatus } from '../types/supportTicketTypes';
import { useTicketDetail, useReplyTicket, useCloseTicket } from '../hooks/useSupportTickets';
import {
  Loader2,
  Send,
  XCircle,
  CheckCircle2,
  MessageSquare,
  User,
  ShieldCheck,
  Clock,
  ArrowDownCircle,
  Paperclip,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface UserTicketDetailModalProps {
  ticketId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_MAP: Record<
  TicketStatus,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  OPEN: {
    label: 'Đang mở',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-100',
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-100',
    icon: Loader2,
  },
  PENDING_USER: {
    label: 'Chờ bạn phản hồi',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-100',
    icon: MessageSquare,
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-100',
    icon: CheckCircle2,
  },
  CLOSED: {
    label: 'Đã đóng',
    color: 'text-stone-500',
    bgColor: 'bg-stone-50 border-stone-100',
    icon: XCircle,
  },
};

export const UserTicketDetailModal = ({
  ticketId,
  isOpen,
  onClose,
}: UserTicketDetailModalProps) => {
  const { data: resp, isLoading } = useTicketDetail(ticketId || undefined);
  const { mutate: sendReply, isPending: isReplying } = useReplyTicket();
  const { mutate: closeTicket, isPending: isClosing } = useCloseTicket();

  const [replyContent, setReplyContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const ticket = resp?.data;

  // Tự động cuộn xuống khi có tin nhắn mới
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

  const handleCloseTicket = () => {
    if (!ticketId) return;
    if (window.confirm('Bạn có chắc chắn muốn đóng yêu cầu hỗ trợ này?')) {
      closeTicket(ticketId, {
        onSuccess: () => onClose(),
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chi tiết Yêu cầu Hỗ trợ" maxWidth="max-w-3xl">
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-emerald-800" size={40} />
          <p className="text-stone-400 text-xs mt-4 font-bold uppercase tracking-widest">
            Đang tải cuộc hội thoại...
          </p>
        </div>
      ) : ticket ? (
        <div className="flex flex-col h-[70vh]">
          {/* Header Info Bar */}
          <div className="bg-stone-50/80 backdrop-blur-md p-4 rounded-xl border border-stone-100 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl border flex items-center justify-center',
                  STATUS_MAP[ticket.status].bgColor,
                  STATUS_MAP[ticket.status].color,
                )}
              >
                <Tag size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Mã Ticket: #{ticket.id}
                </h4>
                <p className="text-sm font-extrabold text-stone-900 line-clamp-1">
                  {ticket.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border',
                  STATUS_MAP[ticket.status].bgColor,
                  STATUS_MAP[ticket.status].color,
                )}
              >
                {STATUS_MAP[ticket.status].label}
              </span>
              {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && (
                <button
                  onClick={handleCloseTicket}
                  disabled={isClosing}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Đóng yêu cầu"
                >
                  {isClosing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <XCircle size={18} />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Conversation Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-2 space-y-6 scroll-smooth pb-4">
            {/* Original Ticket Description */}
            <div className="flex flex-col items-center py-4">
              <div className="bg-stone-50 border border-stone-100 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold text-stone-400 mb-6 uppercase tracking-widest">
                <Clock size={12} /> Bắt đầu yêu cầu lúc{' '}
                {format(new Date(ticket.createdAt), 'HH:mm dd/MM/yyyy', { locale: vi })}
              </div>

              <div className="w-full flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/20">
                  <User size={14} />
                </div>
                <div className="flex-1 space-y-2 max-w-[85%]">
                  <div className="bg-white border border-stone-100 p-4 rounded-xl rounded-tl-none shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-stone-50 pb-2">
                      <span className="text-[10px] font-black text-stone-400 uppercase">
                        Bạn (Người yêu cầu)
                      </span>
                      <span className="text-[10px] text-stone-300 italic">
                        {format(new Date(ticket.createdAt), 'HH:mm', { locale: vi })}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-stone-800">{ticket.subject}</p>
                    <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Replies List */}
            {(ticket.replies || []).map((reply) => {
              const isAdmin = reply.senderType === 'ADMIN' || reply.senderType === 'STAFF';
              return (
                <div key={reply.id} className={cn('flex gap-3', isAdmin ? 'flex-row-reverse' : '')}>
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0 shadow-lg',
                      isAdmin
                        ? 'bg-amber-600 shadow-amber-900/20'
                        : 'bg-emerald-800 shadow-emerald-900/20',
                    )}
                  >
                    {isAdmin ? <ShieldCheck size={14} /> : <User size={14} />}
                  </div>
                  <div className={cn('flex-1 space-y-1 max-w-[85%]', isAdmin ? 'items-end' : '')}>
                    <div
                      className={cn(
                        'p-4 rounded-xl shadow-sm space-y-2',
                        isAdmin
                          ? 'bg-green-700 text-white rounded-tr-none'
                          : 'bg-white border border-stone-100 text-stone-800 rounded-tl-none',
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center justify-between border-b pb-2 mb-2',
                          isAdmin ? 'border-white/10' : 'border-stone-50',
                        )}
                      >
                        <span
                          className={cn(
                            'text-[9px] font-black uppercase tracking-widest',
                            isAdmin ? 'text-white' : 'text-stone-400',
                          )}
                        >
                          {isAdmin ? `Nhân viên hỗ trợ` : 'Bạn'}
                        </span>
                        <span
                          className={cn(
                            'text-[9px] italic',
                            isAdmin ? 'text-white' : 'text-stone-400',
                          )}
                        >
                          {format(new Date(reply.createdAt), 'HH:mm', { locale: vi })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reply Input Area */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            {ticket.status === 'CLOSED' || ticket.status === 'RESOLVED' ? (
              <div className="bg-stone-50 p-4 rounded-xl border border-dashed border-stone-200 text-center">
                <p className="text-xs text-stone-400 font-bold uppercase tracking-widest italic flex items-center justify-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" /> Cuộc hội thoại đã kết thúc
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-3 text-stone-400 hover:text-stone-600 hover:bg-stone-50 rounded-xl transition-all cursor-pointer"
                >
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Nhập tin nhắn phản hồi của bạn..."
                    className="w-full px-4 py-3 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none max-h-32 min-h-12"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply(e);
                      }
                    }}
                  />
                  <div className="absolute right-3 bottom-3 flex items-center gap-2">
                    <span
                      className={cn(
                        'text-[9px] font-bold uppercase',
                        replyContent.length > 900 ? 'text-red-500' : 'text-stone-300',
                      )}
                    >
                      {replyContent.length}/1000
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isReplying || !replyContent.trim()}
                  className="p-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl shadow-xl shadow-emerald-500/20 disabled:bg-stone-100 disabled:text-stone-300 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center cursor-pointer"
                >
                  {isReplying ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
              </form>
            )}
            <p className="text-[9px] text-stone-400 text-center mt-3 font-medium uppercase tracking-normal">
              Bằng việc gửi tin nhắn, bạn đồng ý với Quy trình hỗ trợ khách hàng của OCOP.
            </p>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <ArrowDownCircle size={40} className="mx-auto text-stone-100 mb-4" />
          <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
            Không tìm thấy Ticket yêu cầu
          </p>
        </div>
      )}
    </Modal>
  );
};
