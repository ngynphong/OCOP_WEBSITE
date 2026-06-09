'use client';

import React, { useState } from 'react';
import { SupportTicketTable } from '@/features/support-tickets/components/SupportTicketTable';
import { CreateTicketModal } from '@/features/support-tickets/components/CreateTicketModal';
import { UserTicketDetailModal } from '@/features/support-tickets/components/UserTicketDetailModal';
import { useMyTickets } from '@/features/support-tickets/hooks/useSupportTickets';
import { SupportTicket } from '@/features/support-tickets/types/supportTicketTypes';
import { Plus, HelpCircle, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

export default function UserSupportTicketsPage() {
  const [params] = useState({ pageNo: 1, pageSize: 20 });
  const { data, isLoading } = useMyTickets(params);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const tickets = data?.data?.content || [];

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Hỗ trợ khách hàng</h1>
          <p className="text-stone-500 text-sm font-medium">
            Trung tâm giải đáp thắc mắc và hỗ trợ người dùng OCOP
          </p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all hover:-translate-y-1 cursor-pointer active:scale-95"
        >
          <Plus size={18} /> Gửi yêu cầu mới
        </Button>
      </div>

      {/* Hero Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-green-700 to-green-800 p-6 rounded-xl text-white shadow-2xl shadow-emerald-950/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
            <MessageSquare size={120} />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-black uppercase tracking-tight">Trung tâm Trợ giúp</h3>
              <p className="text-emerald-100/70 text-xs mt-1 font-medium leading-relaxed">
                Phản hồi nhanh chóng trong vòng 24h làm việc.
              </p>
            </div>
            <div className="pt-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full">
                Support 24/7
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-2 rounded-xl border border-stone-100 shadow-sm flex flex-col sm:flex-row gap-2">
          {[
            {
              icon: ShieldCheck,
              title: 'Bảo mật thông tin',
              desc: 'Mọi trao đổi đều được mã hóa an toàn',
            },
            {
              icon: ArrowRight,
              title: 'Quy trình xử lý',
              desc: 'Minh bạch và theo dõi tiến độ dễ dàng',
            },
          ].map((card, i) => (
            <div
              key={i}
              className="flex-1 bg-stone-50/50 p-6 rounded-xl border border-stone-50 flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-800 shrink-0">
                <card.icon size={24} />
              </div>
              <div>
                <h4 className="text-sm font-black text-stone-900 uppercase tracking-tight">
                  {card.title}
                </h4>
                <p className="text-xs text-stone-500 mt-1 font-medium leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest">
              Danh sách yêu cầu của bạn
            </h2>
          </div>
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Tổng số: <span className="text-emerald-800">{tickets.length}</span>
          </div>
        </div>

        <SupportTicketTable
          tickets={tickets}
          isLoading={isLoading}
          onViewDetail={(ticket) => setSelectedTicket(ticket)}
        />
      </div>

      <CreateTicketModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      <UserTicketDetailModal
        ticketId={selectedTicket?.id || null}
        isOpen={selectedTicket !== null}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
}
