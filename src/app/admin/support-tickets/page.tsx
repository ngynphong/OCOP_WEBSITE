'use client';

import React, { useState } from 'react';
import { AdminTicketTable } from '@/features/support-tickets/components/AdminTicketTable';
import { useAdminTickets } from '@/features/support-tickets/hooks/useSupportTickets';
import { TicketStatus } from '@/features/support-tickets/types/supportTicketTypes';
import { ShieldCheck, MessageSquare, Filter, RefreshCcw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

export default function AdminSupportTicketsPage() {
  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 20,
    status: undefined as string | undefined,
    userId: undefined as string | undefined,
  });

  const { data, isLoading, refetch } = useAdminTickets(params);
  const [searchTerm, setSearchTerm] = useState('');

  const tickets = data?.data?.content || [];

  const STATUS_FILTERS: { label: string; value?: TicketStatus }[] = [
    { label: 'Tất cả' },
    { label: 'Yêu cầu mới', value: 'OPEN' },
    { label: 'Đang xử lý', value: 'IN_PROGRESS' },
    { label: 'Chờ khách trả lời', value: 'PENDING_USER' },
    { label: 'Đã giải quyết', value: 'RESOLVED' },
    { label: 'Đã đóng', value: 'CLOSED' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((prev) => ({ ...prev, userId: searchTerm || undefined, pageNo: 1 }));
  };

  return (
    <div className="space-y-8 pb-20 p-6 bg-stone-50/30 min-h-screen">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck size={20} className="fill-emerald-800 text-white shadow-lg" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Internal Portal
            </span>
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            Hệ thống Ticket Hỗ trợ
          </h1>
          <p className="text-stone-500 text-sm font-medium">
            Quản lý và giải quyết các vấn đề từ khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="p-4 bg-white border border-stone-100 rounded-2xl text-stone-400 hover:text-emerald-800 hover:border-emerald-100 transition-all shadow-sm active:scale-95"
          >
            <RefreshCcw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Yêu cầu chờ xử lý',
            value: tickets.filter((t) => t.status === 'OPEN').length,
            icon: MessageSquare,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'Đang làm việc',
            value: tickets.filter((t) => t.status === 'IN_PROGRESS').length,
            icon: RefreshCcw,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Đã giải quyết',
            value: tickets.filter((t) => t.status === 'RESOLVED').length,
            icon: ShieldCheck,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
          },
          {
            label: 'Tổng số liệu',
            value: data?.data?.totalElements || 0,
            icon: Search,
            color: 'text-stone-600',
            bg: 'bg-stone-50',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm flex items-center justify-between"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black text-stone-300 uppercase tracking-tight">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-stone-900">{stat.value}</p>
            </div>
            <div
              className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center',
                stat.bg,
                stat.color,
              )}
            >
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-[32px] border border-stone-100 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1 overflow-x-auto scroller-hide">
          <div className="flex items-center gap-2">
            <div className="p-3 bg-stone-50 rounded-xl text-stone-400 shrink-0">
              <Filter size={16} />
            </div>
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => setParams((prev) => ({ ...prev, status: f.value, pageNo: 1 }))}
                className={cn(
                  'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all shrink-0 border cursor-pointer',
                  params.status === f.value
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white text-stone-400 border-stone-100 hover:border-stone-300',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1 lg:min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
            <input
              type="text"
              placeholder="Tìm giao dịch theo User ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-stone-50 text-gray-700 border border-stone-50 rounded-2xl text-sm font-medium focus:bg-white focus:border-emerald-500 outline-none transition-all"
            />
          </div>
          <Button
            type="submit"
            className="px-6 bg-emerald-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-900/10 active:scale-95"
          >
            Tìm kiếm
          </Button>
        </form>
      </div>

      {/* Admin Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-800 rounded-lg shadow-lg">
              <ShieldCheck size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-widest italic tracking-tighter">
              Bảng điều phối Ticket
            </h2>
          </div>
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
            Chế độ: <span className="text-emerald-800">Admin Moderator</span>
          </div>
        </div>

        <AdminTicketTable tickets={tickets} isLoading={isLoading} />
      </div>
    </div>
  );
}
