'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCheckSquare, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import { ILotTaskResponse } from '@/features/supply-chain/types/supplyChainTypes';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function UpcomingTasksWidget() {
  const [tasks, setTasks] = useState<ILotTaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await supplyChainApi.getUpcomingTasks();
        // Cần đảm bảo response có data
        if (response && response.data) {
          setTasks(response.data.slice(0, 5)); // Just show top 5 upcoming
        } else {
          setTasks([]);
        }
      } catch (error) {
        console.error('Failed to fetch upcoming tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 animate-pulse h-[350px]">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center min-h-[350px]">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <FiCheckSquare className="text-blue-500 text-3xl" />
        </div>
        <h3 className="text-lg font-bold text-gray-800">Không có việc sắp tới</h3>
        <p className="text-gray-500 text-sm mt-1 text-center">
          Tuyệt vời! Bạn không có lô sản xuất nào bị trễ hạn hoặc cần cập nhật nhật ký trong thời
          gian ngắn tới.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[350px]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <FiCheckSquare size={18} />
          </div>
          <h3 className="font-bold text-gray-800 text-base">Việc cần làm</h3>
        </div>
        <span className="text-xs font-semibold bg-red-100 text-red-600 px-2 py-1 rounded-full">
          {tasks.length} Việc
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {tasks.map((task) => (
          <Link
            key={task.id}
            href={`/dashboard/lo-san-xuat/${task.lotId}`}
            className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0 group"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    task.isOverdue
                      ? 'bg-red-100 text-red-700'
                      : task.daysRemaining <= 2
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-green-100 text-green-700'
                  }`}
                >
                  {task.isOverdue
                    ? `TRỄ ${Math.abs(task.daysRemaining)} NGÀY`
                    : task.daysRemaining === 0
                      ? 'HÔM NAY'
                      : `CÒN ${task.daysRemaining} NGÀY`}
                </span>
                <span className="text-xs text-gray-500 truncate">{task.lotCode}</span>
              </div>
              <p className="text-sm font-medium text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {task.stepTitle}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 flex-shrink-0 pt-1">
              <div className="flex items-center text-xs text-gray-500 gap-1">
                <FiCalendar />
                <span>
                  {task.dueDate ? format(new Date(task.dueDate), 'dd/MM', { locale: vi }) : ''}
                </span>
              </div>
              <FiArrowRight className="text-gray-300 group-hover:text-blue-500 transition-colors mt-2" />
            </div>
          </Link>
        ))}
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
        <Link
          href="/dashboard/lo-san-xuat"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Xem tất cả lô sản xuất
        </Link>
      </div>
    </div>
  );
}
