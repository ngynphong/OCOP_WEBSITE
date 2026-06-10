'use client';

import { useState, memo } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  useAdminQuickLinksQuery,
  useDeleteQuickLinkMutation,
  useToggleQuickLinkStatusMutation,
} from '@/features/admin/hooks/useAdminHome';
import { AdminQuickLink } from '@/features/admin/types/adminHomeTypes';
import { QuickLinkFormModal } from './QuickLinkFormModal';
import { Button } from '@/components/ui/AppButton';

export const QuickLinkManagement = memo(function QuickLinkManagement() {
  const { data: qlResp, isLoading } = useAdminQuickLinksQuery();
  const deleteMutation = useDeleteQuickLinkMutation();
  const toggleStatusMutation = useToggleQuickLinkStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQL, setSelectedQL] = useState<AdminQuickLink | undefined>(undefined);

  const quickLinks = qlResp?.data || [];

  const handleCreate = () => {
    setSelectedQL(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (ql: AdminQuickLink) => {
    setSelectedQL(ql);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa liên kết này?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleStatus = (id: number) => {
    toggleStatusMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-40 w-full bg-stone-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Quản lý Liên kết nhanh</h2>
          <p className="text-sm text-stone-500">Quản lý các icon truy cập nhanh trên trang chủ</p>
        </div>
        <Button
          onClick={handleCreate}
          type="button"
          className="flex items-center gap-2 px-4 py-2 bg-[#0D631B] text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
        >
          <FiPlus /> Thêm Liên kết
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {quickLinks.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
            <p className="text-stone-400 font-medium">Chưa có liên kết nào.</p>
          </div>
        ) : (
          quickLinks
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((ql) => (
              <motion.div
                key={ql.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-stone-100 rounded-xl p-4 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col items-center text-center group relative"
              >
                <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(ql)}
                    className="p-1.5 bg-white shadow-md text-stone-600 rounded-lg hover:text-emerald-600 transition-colors"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(ql.id)}
                    className="p-1.5 bg-white shadow-md text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>

                <div className="w-16 h-16 rounded-xl bg-stone-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden border border-stone-100">
                  <Image src={ql.iconUrl} alt={ql.label} fill className="object-contain p-2" />
                </div>

                <h4 className="text-sm font-bold text-stone-800 line-clamp-1 mb-1">{ql.label}</h4>
                <p className="text-[10px] text-stone-400 font-medium mb-3">
                  Thứ tự: {ql.displayOrder}
                </p>

                <Button
                  onClick={() => handleToggleStatus(ql.id)}
                  className={`mt-auto px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
                    ql.isActive
                      ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                      : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
                  }`}
                >
                  {ql.isActive ? 'Đang bật' : 'Đang tắt'}
                </Button>
              </motion.div>
            ))
        )}
      </div>

      <QuickLinkFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        quickLink={selectedQL}
      />
    </div>
  );
});
