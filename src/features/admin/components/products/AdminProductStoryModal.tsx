import React from 'react';
import { FiX, FiBookOpen } from 'react-icons/fi';
import { Product, UpdateProductStoryRequest } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';

interface StoryModalProps {
  isOpen: boolean;
  product: Product | null;
  storyFormData: UpdateProductStoryRequest;
  setStoryFormData: React.Dispatch<React.SetStateAction<UpdateProductStoryRequest>>;
  isFetchingDetail: boolean;
  isUpdatingStory: boolean;
  onClose: () => void;
  onSave: () => void;
}

export const AdminProductStoryModal: React.FC<StoryModalProps> = ({
  isOpen,
  product,
  storyFormData,
  setStoryFormData,
  isFetchingDetail,
  isUpdatingStory,
  onClose,
  onSave,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-green-700 px-10 py-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <FiBookOpen size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight uppercase">Quản lý câu chuyện</h3>
              <p className="text-stone-200 text-[10px] font-bold tracking-widest uppercase mt-0.5">
                {product.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white/50 hover:text-white cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar relative">
          {isFetchingDetail && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                  Đang tải dữ liệu...
                </p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                Tiêu đề câu chuyện
              </label>
              <input
                type="text"
                value={storyFormData.storyTitle}
                onChange={(e) =>
                  setStoryFormData((prev) => ({ ...prev, storyTitle: e.target.value }))
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 text-sm font-bold text-stone-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                placeholder="Mật ong rừng – Tinh túy ngọt lành từ đại ngàn..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                URL Hình ảnh câu chuyện
              </label>
              <input
                type="text"
                value={storyFormData.storyImage}
                onChange={(e) =>
                  setStoryFormData((prev) => ({ ...prev, storyImage: e.target.value }))
                }
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 text-sm font-medium text-stone-600 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                placeholder="https://images.unsplash.com/photo-1586106901017-b2d588f9c458..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
              Chỉ số tác động (Impact Stats)
            </label>
            <textarea
              value={storyFormData.impactStats}
              onChange={(e) =>
                setStoryFormData((prev) => ({ ...prev, impactStats: e.target.value }))
              }
              rows={4}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-6 py-4 text-sm font-medium text-stone-600 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
              placeholder="Ví dụ: 500+ nông dân tham gia, 1000ha vùng nguyên liệu..."
            />
            <p className="text-[10px] text-stone-400 italic mt-2 ml-1">
              * Nhập các chỉ số tác động dưới dạng văn bản.
            </p>
          </div>
        </div>

        <div className="p-10 bg-stone-50 border-t border-stone-100 flex justify-end gap-4">
          <Button onClick={onClose} variant="outline">
            Đóng
          </Button>
          <Button onClick={onSave} disabled={isUpdatingStory}>
            {isUpdatingStory ? 'Đang lưu...' : 'Lưu câu chuyện'}
          </Button>
        </div>
      </div>
    </div>
  );
};
