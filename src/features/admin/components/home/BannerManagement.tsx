'use client';

import { useState, memo, useCallback } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiCalendar,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  useAdminBannersQuery,
  useDeleteBannerMutation,
  useToggleBannerStatusMutation,
} from '../../hooks/useAdminHome';
import { AdminBanner } from '../../types/adminHomeTypes';
import { BannerFormModal } from './BannerFormModal';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Button } from '@/components/ui/AppButton';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export const BannerManagement = memo(function BannerManagement() {
  const { data: bannersResp, isLoading } = useAdminBannersQuery();
  const deleteMutation = useDeleteBannerMutation();
  const toggleStatusMutation = useToggleBannerStatusMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<AdminBanner | undefined>(undefined);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bannerIdToDelete, setBannerIdToDelete] = useState<number | null>(null);

  const banners = bannersResp?.data || [];

  const handleCreate = useCallback(() => {
    setSelectedBanner(undefined);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((banner: AdminBanner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setBannerIdToDelete(id);
    setIsConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (bannerIdToDelete) {
      await deleteMutation.mutateAsync(bannerIdToDelete);
      setIsConfirmOpen(false);
      setBannerIdToDelete(null);
    }
  }, [bannerIdToDelete, deleteMutation]);

  const handleToggleStatus = useCallback(
    (id: number) => {
      toggleStatusMutation.mutate(id);
    },
    [toggleStatusMutation],
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 w-full bg-stone-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Quản lý Banners</h2>
          <p className="text-sm text-stone-500">Tùy chỉnh các banner hiển thị trên trang chủ</p>
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-[#0D631B] text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
        >
          <FiPlus /> Thêm Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {banners.length === 0 ? (
          <div className="py-20 text-center bg-stone-50 rounded-xl border-2 border-dashed border-stone-200">
            <p className="text-stone-400 font-medium">
              Chưa có banner nào. Hãy thêm banner đầu tiên!
            </p>
          </div>
        ) : (
          banners.map((banner) => (
            <motion.div
              key={banner.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all duration-300 flex flex-col md:flex-row"
            >
              <div className="relative w-full md:w-80 h-48 md:h-auto shrink-0 bg-stone-100">
                <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                      banner.type === 'MAIN'
                        ? 'bg-emerald-500/80 text-white border-emerald-400/50'
                        : 'bg-amber-500/80 text-white border-amber-400/50'
                    }`}
                  >
                    {banner.type === 'MAIN' ? 'Chính' : 'Phụ'}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-stone-900 line-clamp-1">
                      {banner.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(banner.id)}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          banner.isActive !== false
                            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-stone-400 bg-stone-50 hover:bg-stone-100'
                        }`}
                        title={banner.isActive !== false ? 'Ẩn banner' : 'Hiển thị banner'}
                      >
                        {banner.isActive !== false ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => handleEdit(banner)}
                        className="p-2 text-stone-600 bg-stone-50 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4">{banner.description}</p>

                  <div className="flex flex-wrap gap-4 text-xs text-stone-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <FiCalendar className="text-stone-300" />
                      <span>
                        {banner.startDate
                          ? format(new Date(banner.startDate), 'dd/MM/yyyy', { locale: vi })
                          : 'N/A'}
                      </span>
                      <span>-</span>
                      <span>
                        {banner.endDate
                          ? format(new Date(banner.endDate), 'dd/MM/yyyy', { locale: vi })
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiExternalLink className="text-stone-300" />
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-emerald-600 transition-colors"
                      >
                        Link đích
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                      <span>Thứ tự: {banner.displayOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${banner.isActive !== false ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'}`}
                    />
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest ${banner.isActive !== false ? 'text-emerald-600' : 'text-stone-400'}`}
                    >
                      {banner.isActive !== false ? 'Đang hiển thị' : 'Đang ẩn'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-300 uppercase font-bold tracking-widest">
                    ID: {banner.id}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <BannerFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={selectedBanner}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xóa Banner"
        message="Bạn có chắc chắn muốn xóa banner này? Hành động này không thể hoàn tác."
        confirmText="Xóa ngay"
        cancelText="Để sau"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsConfirmOpen(false);
          setBannerIdToDelete(null);
        }}
        type="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
});
