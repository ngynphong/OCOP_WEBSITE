import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { FiActivity, FiCalendar, FiEdit3, FiSave, FiX, FiUser } from 'react-icons/fi';
import { ShopListItem, UpdateShopOwnerRequest } from '../types/adminTypes';
import { useAdminShopMutations } from '../hooks/useAdminShops';

interface ShopDetailOverviewProps {
  shop: ShopListItem;
}

const ShopDetailOverview: React.FC<ShopDetailOverviewProps> = React.memo(({ shop }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateShopOwnerRequest>({
    ownerName: shop.ownerName || '',
    ownerRole: '', // Backend response in cau-chuyen.md shows ownerRole
    ownerQuote: '',
    ownerImageUrl: '',
  });

  const { updateShopOwner, isUpdatingOwner } = useAdminShopMutations();

  // Update formData when shop data changes or when starting to edit
  React.useEffect(() => {
    if (shop) {
      setFormData({
        ownerName: shop.ownerName || '',
        ownerRole: shop.ownerRole || '',
        ownerQuote: shop.ownerQuote || '',
        ownerImageUrl: shop.ownerImageUrl || '',
      });
    }
  }, [shop]);

  const handleSave = async () => {
    await updateShopOwner({ shopId: shop.id, data: formData });
    setIsEditing(false);
  };

  return (
    <div className="space-y-10">
      {/* Shop Introduction */}
      <section>
        <h4 className="text-lg font-black text-stone-800 mb-6 flex items-center gap-3">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
          Giới thiệu cửa hàng
        </h4>
        <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100 text-stone-600 text-sm leading-relaxed italic">
          &ldquo;{shop.description}&rdquo;
        </div>
      </section>

      {/* Owner Info Section */}
      <section className="bg-white rounded-[32px] border border-stone-100 overflow-hidden">
        <div className="px-8 py-6 bg-stone-50/50 border-b border-stone-100 flex justify-between items-center">
          <h4 className="text-sm font-black text-stone-800 uppercase tracking-widest flex items-center gap-2">
            <FiUser className="text-emerald-600" />
            Thông tin chủ cơ sở
          </h4>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-600 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-95"
            >
              <FiEdit3 /> Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-400 hover:text-stone-600 transition-all"
              >
                <FiX /> Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdatingOwner}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 rounded-xl text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-900/10 disabled:opacity-50"
              >
                <FiSave /> {isUpdatingOwner ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}
        </div>

        <div className="p-8">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Họ tên chủ cơ sở
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3 text-sm font-bold text-stone-800 outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Chức danh
                </label>
                <input
                  type="text"
                  value={formData.ownerRole}
                  onChange={(e) => setFormData({ ...formData, ownerRole: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3 text-sm font-bold text-stone-800 outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="Giám đốc / Chủ hộ kinh doanh"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  URL Ảnh đại diện
                </label>
                <input
                  type="text"
                  value={formData.ownerImageUrl}
                  onChange={(e) => setFormData({ ...formData, ownerImageUrl: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3 text-sm font-medium text-stone-600 outline-none focus:border-emerald-500/50 transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Châm ngôn / Lời ngỏ
                </label>
                <textarea
                  value={formData.ownerQuote}
                  onChange={(e) => setFormData({ ...formData, ownerQuote: e.target.value })}
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-3 text-sm font-medium text-stone-600 outline-none focus:border-emerald-500/50 transition-all resize-none"
                  placeholder="Chia sẻ tâm huyết về sản phẩm OCOP..."
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-24 h-24 rounded-3xl bg-stone-100 overflow-hidden border border-stone-200 shrink-0 relative">
                {shop.ownerImageUrl ? (
                  <Image src={shop.ownerImageUrl} alt="Owner" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <FiUser size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h5 className="text-xl font-black text-stone-900">
                    {shop.ownerName || 'Chưa cập nhật'}
                  </h5>
                  <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mt-1">
                    {shop.ownerRole || 'Chủ cơ sở'}
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-4 -top-2 text-4xl text-stone-200 ">&ldquo;</span>
                  <p className="text-stone-500 text-sm leading-relaxed italic">
                    {shop.ownerQuote || 'Chưa có lời ngỏ từ chủ cơ sở.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Basic Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <FiActivity size={24} />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-black uppercase">Loại hình</p>
            <p className="text-sm font-bold text-stone-800">Cơ sở sản xuất OCOP</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-stone-100 flex items-center gap-5">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <FiCalendar size={24} />
          </div>
          <div>
            <p className="text-[10px] text-stone-400 font-black uppercase">Ngày gia nhập</p>
            <p className="text-sm font-bold text-stone-800">
              {format(new Date(shop.createdAt), 'dd MMMM, yyyy', { locale: vi })}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

ShopDetailOverview.displayName = 'ShopDetailOverview';

export default ShopDetailOverview;
