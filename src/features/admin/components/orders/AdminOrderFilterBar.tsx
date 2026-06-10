import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IAdminOrderParams } from '@/features/admin/types/adminTypes';
import { useDebounce } from '@/hooks/useDebounce';

interface AdminOrderFilterBarProps {
  totalElement: number;
  params: IAdminOrderParams;
  setParams: React.Dispatch<React.SetStateAction<IAdminOrderParams>>;
  statusMap: Record<string, { label: string; color: string }>;
}

export const AdminOrderFilterBar = ({
  totalElement,
  params,
  setParams,
  statusMap,
}: AdminOrderFilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState(params.keyword || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setParams((prev) => ({ ...prev, keyword: debouncedSearchTerm, pageNo: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  // Synchronize searchTerm if params.keyword is changed from outside
  useEffect(() => {
    if (params.keyword !== searchTerm) {
      setSearchTerm(params.keyword || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.keyword]);

  return (
    <div className="p-6 border-b border-stone-50 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-black text-[#00490E] uppercase tracking-wider">
          Danh sách Đơn hàng
        </h3>
        <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
          {totalElement} đơn hàng
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Tìm mã đơn, shop..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 text-gray-700 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
            value={params.startDate || ''}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, startDate: e.target.value || undefined, pageNo: 1 }))
            }
          />
          <span className="text-stone-400 text-xs font-bold uppercase">đến</span>
          <input
            type="date"
            className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
            value={params.endDate || ''}
            onChange={(e) =>
              setParams((prev) => ({ ...prev, endDate: e.target.value || undefined, pageNo: 1 }))
            }
          />
        </div>

        <select
          className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
          value={params.status || ''}
          onChange={(e) =>
            setParams((prev) => ({ ...prev, status: e.target.value || undefined, pageNo: 1 }))
          }
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
