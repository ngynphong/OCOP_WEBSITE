import React from 'react';
import { InventoryItem } from '../types/inventoryTypes';
import { FiEdit3, FiPackage, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface AdminInventoryTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  onAdjust: (item: InventoryItem) => void;
}

export const AdminInventoryTable = ({ items, isLoading, onAdjust }: AdminInventoryTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-stone-100 overflow-hidden shadow-sm">
        <div className="p-8 flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-100 p-12 text-center shadow-sm">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiPackage className="text-stone-300 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-stone-900">Không tìm thấy dữ liệu tồn kho</h3>
        <p className="text-stone-500 mt-2">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50/50 border-b border-stone-100">
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest">
                Sản phẩm / Biến thể
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">
                SKU
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">
                Tồn kho
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">
                Khả dụng
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-center">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-500 uppercase tracking-widest text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-stone-50/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center shrink-0 border border-stone-100 overflow-hidden relative">
                      {/* Giả sử có thumbnailUrl, nếu không dùng icon */}
                      <FiPackage className="text-stone-300 text-xl" />
                    </div>
                    <div>
                      <p className="font-bold text-stone-900 line-clamp-1 group-hover:text-green-700 transition-colors">
                        {item.variantName}
                      </p>
                      <p className="text-[10px] font-bold text-stone-400 mt-0.5 uppercase tracking-tighter">
                        ID: {item.variantId}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="px-2 py-1 bg-stone-100 rounded text-[11px] font-mono font-bold text-stone-600 border border-stone-200 uppercase tracking-tighter">
                    {item.sku}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <p className="text-base font-black text-stone-900">{item.stockQty}</p>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter mt-0.5">
                    Đã bán: {item.soldQty}
                  </p>
                </td>
                <td className="px-6 py-5 text-center">
                  <p
                    className={cn(
                      'text-base font-black',
                      item.availableQty <= 0 ? 'text-red-500' : 'text-green-600',
                    )}
                  >
                    {item.availableQty}
                  </p>
                  {item.reservedQty > 0 && (
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-tighter mt-0.5">
                      Giữ chỗ: {item.reservedQty}
                    </p>
                  )}
                </td>
                <td className="px-6 py-5 text-center">
                  {item.outOfStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      Hết hàng
                    </span>
                  ) : item.lowStock ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider border border-amber-100">
                      <FiAlertCircle size={12} />
                      Sắp hết hàng
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                      Ổn định
                    </span>
                  )}
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    onClick={() => onAdjust(item)}
                    title="Điều chỉnh kho"
                    className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-green-600 hover:border-green-200 hover:bg-green-50/30 transition-all hover:shadow-lg shadow-green-900/10 cursor-pointer"
                  >
                    <FiEdit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
