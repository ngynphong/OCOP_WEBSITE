'use client';

import React, { useState } from 'react';
import { useAdminSubscribers } from '../../hooks/useNewsletter';
import { NewsletterStatus, NewsletterSubscription } from '../../types/newsletterTypes';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiSearch, FiFilter, FiMail, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Pagination } from '@/components/ui/Pagination';

export const SubscriberTable = () => {
  const [params, setParams] = useState({
    pageNo: 1,
    pageSize: 10,
    status: undefined as NewsletterStatus | undefined,
  });
  const [search, setSearch] = useState('');

  const { data, isLoading } = useAdminSubscribers(params);

  const subscribers = data?.data?.content || [];
  const totalElements = data?.data?.totalElements || 0;
  const totalPages = data?.data?.totalPages || 0;
  const currentPage = params.pageNo;

  const getStatusIcon = (status: NewsletterStatus) => {
    switch (status) {
      case 'ACTIVE':
        return <FiCheckCircle className="text-emerald-500" />;
      case 'PENDING':
        return <FiClock className="text-amber-500" />;
      case 'UNSUBSCRIBED':
        return <FiXCircle className="text-stone-400" />;
    }
  };

  const getStatusLabel = (status: NewsletterStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang hoạt động';
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'UNSUBSCRIBED':
        return 'Đã hủy';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl shadow-sm border border-stone-100">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm kiếm email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-stone-50 text-gray-700 border border-stone-100 rounded-2xl outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 px-4 py-2 bg-stone-50 rounded-xl border border-stone-100">
            <FiFilter className="text-stone-400 text-xs" />
            <select
              value={params.status || ''}
              onChange={(e) =>
                setParams({ ...params, status: (e.target.value || undefined) as NewsletterStatus })
              }
              className="bg-transparent text-xs font-black uppercase tracking-widest text-stone-600 outline-none cursor-pointer"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="PENDING">Chờ xác nhận</option>
              <option value="UNSUBSCRIBED">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50/50 border-b border-stone-100">
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Subscriber
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Trạng thái
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Ngày đăng ký
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Ngày xác nhận
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="px-8 py-6 h-16 bg-stone-50/20" />
                  </tr>
                ))
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-300">
                      <FiMail size={32} />
                    </div>
                    <p className="text-stone-400 font-bold text-sm">
                      Không tìm thấy người đăng ký nào
                    </p>
                  </td>
                </tr>
              ) : (
                subscribers.map((item: NewsletterSubscription) => (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs">
                          {item.email[0].toUpperCase()}
                        </div>
                        <span className="text-sm font-black text-stone-800">{item.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100 w-fit">
                        {getStatusIcon(item.status)}
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
                          {getStatusLabel(item.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-500 font-medium">
                      {format(new Date(item.subscribedAt), 'dd/MM/yyyy HH:mm', { locale: vi })}
                    </td>
                    <td className="px-8 py-6 text-sm text-stone-500 font-medium">
                      {item.confirmedAt
                        ? format(new Date(item.confirmedAt), 'dd/MM/yyyy HH:mm', { locale: vi })
                        : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 border-t border-stone-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={params.pageSize}
            totalElements={totalElements}
            onPageChange={(page) => setParams({ ...params, pageNo: page })}
            onPageSizeChange={(size) => setParams({ ...params, pageSize: size, pageNo: 1 })}
          />
        </div>
      </div>
    </div>
  );
};
