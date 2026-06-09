import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiActivity } from 'react-icons/fi';
import { format } from 'date-fns';
import {
  IAdminDashboardOrderOverview,
  IAdminDashboardActivity,
} from '@/features/dashboard/types/dashboard';

interface AdminSidePanelProps {
  orderOverview: IAdminDashboardOrderOverview;
  recentActivities: IAdminDashboardActivity[];
}

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const AdminSidePanel = ({ orderOverview, recentActivities }: AdminSidePanelProps) => {
  const totalOrders = (orderOverview.processed || 0) + (orderOverview.pending || 0);

  return (
    <div className="col-span-12 lg:col-span-4 space-y-6">
      <div className="bg-white text-gray-900 p-8 rounded-xl shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
        <FiShoppingBag className="absolute -right-8 -bottom-8 text-[160px] text-emerald-900/5 group-hover:rotate-12 transition-transform duration-700" />
        <h4 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-70">
          Tổng quan đơn hàng
        </h4>
        <div className="space-y-6 relative z-10">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-black">{formatNumber(orderOverview.processed)}</span>
              <span className="text-[10px] font-black uppercase opacity-60">Đã xử lý</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${totalOrders ? (orderOverview.processed / totalOrders) * 100 : 0}%`,
                }}
                className="h-full bg-blue-400 rounded-full"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-black">{formatNumber(orderOverview.pending)}</span>
              <span className="text-[10px] font-black uppercase opacity-60">Đang chờ</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${totalOrders ? (orderOverview.pending / totalOrders) * 100 : 0}%`,
                }}
                className="h-full bg-emerald-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100">
        <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-widest mb-6">
          Hoạt động gần đây
        </h4>
        <div className="space-y-5">
          {recentActivities.map((act) => (
            <div key={act.id} className="flex gap-4 group cursor-pointer">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                  act.status === 'success'
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                    : act.status === 'warning'
                      ? 'bg-amber-50 border-amber-100 text-amber-600'
                      : act.status === 'error'
                        ? 'bg-red-50 border-red-100 text-red-600'
                        : 'bg-blue-50 border-blue-100 text-blue-600'
                }`}
              >
                <FiActivity className="text-xs" />
              </div>
              <div>
                <p className="text-xs font-black text-stone-800 line-clamp-1">{act.title}</p>
                <p className="text-[10px] text-stone-400 font-bold">
                  {act.action} • {format(new Date(act.createdAt), 'HH:mm dd/MM')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
