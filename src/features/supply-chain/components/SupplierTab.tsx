import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Truck } from 'lucide-react';
import { format } from 'date-fns';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSupplierList } from '../hooks/useSupplier';

export default function SupplierTab() {
  const { suppliers, isLoading } = useSupplierList();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
        Đang tải danh sách nhà cung cấp...
      </div>
    );
  }

  if (suppliers.length === 0) {
    return (
      <EmptyState
        icon={Truck}
        title="Chưa có Nhà cung cấp"
        description="Bạn chưa thêm bất kỳ nhà cung cấp (nguồn mua ngoài) nào. Hãy bấm 'Thêm mới' ở góc trên để bắt đầu."
      />
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-stone-800">Danh sách nhà cung cấp (Mua ngoài)</h2>
      </div>

      <div className="overflow-x-auto border border-stone-200 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm text-stone-600">
          <thead className="bg-stone-50/80 text-stone-500 uppercase text-xs tracking-wider border-b border-stone-200">
            <tr>
              <th className="px-5 py-4 font-semibold">Tên NCC</th>
              <th className="px-5 py-4 font-semibold">Mã số thuế</th>
              <th className="px-5 py-4 font-semibold">SĐT</th>
              <th className="px-5 py-4 font-semibold">Ngày tạo</th>
              <th className="px-5 py-4 font-semibold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 bg-white">
            {suppliers.map((sup) => (
              <tr key={sup.id} className="hover:bg-emerald-50/30 transition-colors">
                <td className="px-5 py-4 font-semibold text-emerald-800">{sup.name}</td>
                <td className="px-5 py-4">
                  {sup.taxCode || <span className="text-stone-300 italic">Trống</span>}
                </td>
                <td className="px-5 py-4">
                  {sup.phoneNumber || <span className="text-stone-300 italic">Trống</span>}
                </td>
                <td className="px-5 py-4">{format(new Date(sup.createdAt), 'dd/MM/yyyy')}</td>
                <td className="px-5 py-4 text-right">
                  <button
                    className="p-2 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Chỉnh sửa"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all ml-1"
                    title="Xóa"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
