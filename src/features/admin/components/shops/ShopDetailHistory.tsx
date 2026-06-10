'use client';

import React from 'react';
import { FiActivity, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ShopStatusLog } from '@/features/admin/types/adminTypes';

interface ShopDetailHistoryProps {
  logs: ShopStatusLog[];
}

const ShopDetailHistory: React.FC<ShopDetailHistoryProps> = React.memo(({ logs }) => {
  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-stone-200 before:to-transparent">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-stone-100 group-[.is-active]:bg-emerald-500 text-stone-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors duration-300">
                <FiActivity size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <div className="font-black text-[#00490E] text-xs uppercase">{log.toStatus}</div>
                  <time className="font-bold text-[9px] text-stone-400 uppercase tracking-tighter">
                    {(() => {
                      if (!log.changedAt) return '---';
                      const d = new Date(log.changedAt);
                      return isNaN(d.getTime()) ? '---' : format(d, 'dd/MM/yyyy HH:mm');
                    })()}
                  </time>
                </div>
                <div className="text-xs text-stone-500 mb-4 font-medium">{log.reason}</div>
                <div className="flex items-center gap-2 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                  Admin: <span className="text-emerald-600">{log.changedByEmail}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center space-y-2 opacity-30">
            <FiClock size={32} className="mx-auto" />
            <p className="text-[10px] font-black uppercase">Chưa có lịch sử hoạt động</p>
          </div>
        )}
      </div>
    </div>
  );
});

ShopDetailHistory.displayName = 'ShopDetailHistory';

export default ShopDetailHistory;
