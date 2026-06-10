'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiList, FiType, FiPlus, FiChevronRight } from 'react-icons/fi';
import { Category } from '@/features/admin/types/adminTypes';
import Image from 'next/image';

interface DetailModeProps {
  freshCategory: Category;
  activeTab: 'info' | 'children';
  setActiveTab: (tab: 'info' | 'children') => void;
  onAddSub?: (parentId: number) => void;
  onNavigateToChild?: (id: number) => void;
}

const DetailMode = ({ freshCategory, activeTab, setActiveTab, onAddSub }: DetailModeProps) => {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
      {/* Banner & Brand Card */}
      <div className="relative h-48 bg-stone-100 shrink-0">
        {freshCategory.bannerUrl ? (
          <Image
            src={freshCategory.bannerUrl}
            alt="banner"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-50">
            <FiImage size={48} />
          </div>
        )}

        {/* Floating Info Card */}
        <div className="absolute -bottom-12 left-8 right-8 bg-white rounded-xl p-6 shadow-xl shadow-stone-200 border border-stone-50 flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-stone-50 border-4 border-white shadow-md overflow-hidden shrink-0">
            {freshCategory.iconUrl ? (
              <Image
                src={freshCategory.iconUrl}
                alt="icon"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-200">
                <FiImage size={24} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-black text-stone-800 truncate">{freshCategory.name}</h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                  freshCategory.isActive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-500'
                }`}
              >
                {freshCategory.isActive ? 'Active' : 'Hidden'}
              </span>
            </div>
            <p className="text-xs font-bold text-stone-400 truncate">/{freshCategory.slug}</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-16 px-8 flex items-center gap-8 border-b border-stone-100 bg-white sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
            activeTab === 'info' ? 'text-emerald-600' : 'text-stone-400'
          }`}
        >
          Tổng quan
          {activeTab === 'info' && (
            <motion.div
              layoutId="detail-tab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
            />
          )}
        </button>
        <button
          onClick={() => setActiveTab('children')}
          className={`py-4 text-[10px] font-black uppercase tracking-widest transition-all relative ${
            activeTab === 'children' ? 'text-emerald-600' : 'text-stone-400'
          }`}
        >
          Danh mục con ({freshCategory.children?.length || 0})
          {activeTab === 'children' && (
            <motion.div
              layoutId="detail-tab"
              className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-full"
            />
          )}
        </button>
      </div>

      <div className="p-8 flex-1 bg-stone-50/30">
        <AnimatePresence mode="wait">
          {activeTab === 'info' ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Description */}
              <div className="bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">
                  Mô tả chi tiết
                </label>
                <p className="text-sm text-stone-600 leading-relaxed font-medium whitespace-pre-line">
                  {freshCategory.description || 'Chưa có mô tả cho danh mục này.'}
                </p>
              </div>

              {/* Stats/Meta */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-stone-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                    <FiList />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
                      Số thứ tự
                    </p>
                    <p className="text-sm font-black text-stone-800">{freshCategory.sortOrder}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-stone-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
                    <FiType />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-tighter">
                      ID Hệ thống
                    </p>
                    <p className="text-sm font-black text-stone-800">#{freshCategory.id}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="children"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest">
                  Danh sách phân cấp
                </label>
                <button
                  onClick={() => onAddSub?.(freshCategory.id)}
                  className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:underline active:opacity-70"
                >
                  <FiPlus /> Thêm danh mục con
                </button>
              </div>

              {freshCategory.children && freshCategory.children.length > 0 ? (
                <div className="space-y-3">
                  {freshCategory.children.map((child: Category) => (
                    <div
                      key={child.id}
                      className="bg-white p-4 rounded-xl border border-stone-100 shadow-sm flex items-center gap-4 group hover:border-emerald-200 transition-all font-sans"
                    >
                      <div className="relative w-10 h-10 rounded-xl bg-stone-50 border border-stone-100 overflow-hidden shrink-0">
                        {child.iconUrl && (
                          <Image
                            src={child.iconUrl}
                            alt={child.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-black text-stone-800 truncate">{child.name}</p>
                        <p className="text-[10px] text-stone-400 font-bold truncate">
                          /{child.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2 text-stone-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                          title="Xem chi tiết"
                        >
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 border-2 border-dashed border-stone-100 rounded-xl flex flex-col items-center justify-center">
                  <FiList className="text-stone-200 mb-2" size={32} />
                  <p className="text-xs font-bold text-stone-300 uppercase tracking-widest">
                    Không có danh mục con
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DetailMode;
