'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  FiEdit2,
  FiMapPin,
  FiStar,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiPlus,
  FiLoader,
  FiImage,
  FiUpload,
  FiTag,
} from 'react-icons/fi';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { useAuthProfile } from '@/features/auth/hooks/useAuth';
import { ShopEditForm } from '@/features/shop/components/ShopEditForm';
import { ShopStatus } from '@/features/shop/types/shopTypes';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const STATUS_CONFIG: Record<ShopStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'Chờ duyệt',
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: <FiClock size={13} />,
  },
  ACTIVE: {
    label: 'Đang hoạt động',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: <FiCheckCircle size={13} />,
  },
  LOCKED: {
    label: 'Bị khóa',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: <FiXCircle size={13} />,
  },
  REJECTED: {
    label: 'Bị từ chối',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: <FiXCircle size={13} />,
  },
};

const ShopStatusBadge = ({ status }: { status: ShopStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold',
        cfg.color,
      )}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-3 border-b border-stone-50 last:border-0">
    <span className="text-sm text-stone-500 shrink-0">{label}</span>
    <span className="text-sm font-semibold text-stone-700 text-right">{value}</span>
  </div>
);

export default function SellerShopPage() {
  const {
    useMyShopQuery,
    uploadLogo,
    uploadBanner,
    isUploadingLogo,
    isUploadingBanner,
    resubmitShop,
    isResubmittingShop,
  } = useSellerShop();

  const { profile, isLoadingProfile } = useAuthProfile();
  const { data: shopData, isPending, isError } = useMyShopQuery();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoadingProfile || (isPending && profile?.isOwnerShop)) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-stone-400">
        <FiLoader size={28} className="animate-spin text-green-500" />
        <p className="text-sm">Đang tải thông tin cửa hàng...</p>
      </div>
    );
  }

  // Check for registration draft
  const hasDraft =
    typeof window !== 'undefined' && !!localStorage.getItem('shop_registration_draft');

  if (!profile?.isOwnerShop || isError || !shopData?.data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 gap-6 max-w-md mx-auto text-center"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
          <FiTag size={40} className="text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-stone-900">
            {hasDraft ? 'Bạn đang trong quá trình đăng ký shop' : 'Bạn chưa có cửa hàng'}
          </h2>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">
            {hasDraft
              ? 'Hệ thống nhận thấy bạn đang thực hiện quy trình đăng ký shop. Hãy tiếp tục để sớm đưa sản phẩm lên OCOP!'
              : 'Trở thành Nhà bán hàng OCOP để tiếp cận hàng triệu khách hàng yêu thích sản phẩm đặc sản Việt Nam.'}
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/dashboard/cua-hang/dang-ky"
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 shadow-xl shadow-green-500/25 transition-all hover:-translate-y-0.5"
          >
            {hasDraft ? (
              <>
                <FiEdit2 size={18} /> Tiếp tục đăng ký
              </>
            ) : (
              <>
                <FiPlus size={18} /> Đăng ký mở shop ngay
              </>
            )}
          </Link>
          <p className="text-xs text-stone-400">Xét duyệt trong vòng 1-3 ngày làm việc</p>
        </div>

        {/* Benefits list */}
        <div className="w-full grid grid-cols-3 gap-3 mt-2">
          {[
            { icon: FiShoppingBag, label: 'Đăng sản phẩm', sub: 'OCOP đặc sản' },
            { icon: FiStar, label: 'Đánh giá', sub: 'Tăng uy tín' },
            { icon: FiMapPin, label: 'Tiếp cận', sub: 'Toàn quốc' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <item.icon size={18} className="text-green-600" />
              </div>
              <p className="text-xs font-bold text-stone-700">{item.label}</p>
              <p className="text-[11px] text-stone-400">{item.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  const { shopResponse: shop, missingRequiredDocuments, missingFields } = shopData.data;

  // ─── Has shop ──────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Shop Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border border-stone-100 shadow-sm bg-white"
      >
        {/* Banner */}
        <div className="relative h-36 bg-linear-to-r from-green-600 to-emerald-500 overflow-hidden group">
          {shop.bannerUrl && (
            <Image src={shop.bannerUrl} fill alt="Banner" className="w-full h-full object-cover" />
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <div className="flex flex-col items-center gap-1 text-white">
              {isUploadingBanner ? (
                <FiLoader size={20} className="animate-spin" />
              ) : (
                <FiUpload size={20} />
              )}
              <span className="text-xs font-semibold">Cập nhật banner</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await uploadBanner(file);
              }}
            />
          </label>
        </div>

        {/* Logo */}
        <div className="absolute left-6 top-20 w-20 h-20 rounded-2xl border-4 border-white shadow-xl bg-white overflow-hidden group">
          {shop.logoUrl ? (
            <Image src={shop.logoUrl} fill alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-50">
              <FiImage size={24} className="text-green-300" />
            </div>
          )}
          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl">
            {isUploadingLogo ? (
              <FiLoader size={16} className="animate-spin text-white" />
            ) : (
              <FiUpload size={16} className="text-white" />
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await uploadLogo(file);
              }}
            />
          </label>
        </div>

        {/* Shop meta */}
        <div className="pt-14 pb-5 px-6 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-0 justify-between">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl font-extrabold text-stone-900">{shop.name}</h2>
              <ShopStatusBadge status={shop.status} />
            </div>
            <p className="text-sm text-stone-500 mt-1 flex items-center gap-1.5">
              <FiMapPin size={13} />
              {shop.provinceName}, {shop.districtName}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-sm text-amber-600 font-bold">
                <FiStar size={13} /> {(shop?.ratingAvg ?? 0).toFixed(1)}
              </span>
              <span className="text-xs text-stone-400">({shop.totalReviews} đánh giá)</span>
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">
                {shop.planName}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1 flex items-center gap-1.5 italic">
              URL cửa hàng:{' '}
              <span className="text-green-600">ocop.iesconnect.vn/cua-hang/{shop.slug}</span>
            </p>
          </div>
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all shrink-0',
              isEditing
                ? 'border-stone-200 text-stone-600 hover:bg-stone-50'
                : 'border-green-600 text-green-600 hover:bg-green-50',
            )}
          >
            <FiEdit2 size={15} />
            {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa shop'}
          </button>
        </div>
      </motion.div>

      {/* Resubmit Notice (When Rejected) */}
      {shop.status === 'REJECTED' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-rose-50 border border-rose-100 rounded-[28px] shadow-sm">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
              <FiXCircle size={20} className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-black text-rose-900 mb-1">Cửa hàng bị từ chối phê duyệt</p>
              <p className="text-xs text-rose-600 font-medium leading-relaxed">
                Vui lòng kiểm tra các tài liệu còn thiếu bên dưới, cập nhật đầy đủ thông tin và tài
                liệu theo yêu cầu trước khi nộp lại hồ sơ xét duyệt.
              </p>
            </div>
          </div>
          <button
            onClick={() => resubmitShop()}
            disabled={isResubmittingShop || missingRequiredDocuments}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-rose-900/20 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isResubmittingShop ? (
              <>
                <FiLoader size={14} className="animate-spin" /> Đang xử lý...
              </>
            ) : (
              <>
                <FiCheckCircle size={14} /> Nộp lại hồ sơ ngay
              </>
            )}
          </button>
        </div>
      )}

      {/* Status Notice (General) */}
      {shop.status === 'PENDING' && (
        <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <FiAlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-800">Shop đang chờ xét duyệt</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Đội ngũ OCOP sẽ xem xét và phản hồi trong vòng 1-3 ngày làm việc.
            </p>
          </div>
        </div>
      )}

      {/* Missing Documents Warning */}
      {missingRequiredDocuments && (
        <div className="flex gap-3 p-5 bg-rose-50 border border-rose-100 rounded-[24px] shadow-sm">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
            <FiAlertCircle size={20} className="text-rose-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-black text-rose-900 mb-1">Thiếu tài liệu hồ sơ</p>
            <ul className="space-y-1">
              {missingFields.map((field, idx) => (
                <li key={idx} className="text-xs text-rose-600 font-medium list-disc ml-4">
                  {field}
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/cua-hang/ho-so-phap-ly"
              className="inline-flex items-center gap-2 mt-4 text-[11px] font-bold text-rose-700 bg-white px-4 py-2 rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
            >
              Cập nhật hồ sơ ngay
            </Link>
          </div>
        </div>
      )}

      {/* Edit Section */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6"
          >
            <ShopEditForm shop={shop} onCancel={() => setIsEditing(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
          <FiTag size={15} className="text-green-600" /> Mô tả
        </h3>
        <p className="text-sm text-stone-500 whitespace-pre-wrap">{shop.description || '—'}</p>
      </div>

      {/* Shop Detail Info */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
              <FiTag size={15} className="text-green-600" /> Thông tin shop
            </h3>
            {/* <InfoRow label="Mô tả" value={shop.description || '—'} /> */}
            <InfoRow label="Địa chỉ" value={shop.addressLine || '—'} />
            <InfoRow label="Phường/Xã" value={shop.wardName || '—'} />
            <InfoRow label="Quận/Huyện" value={shop.districtName} />
            <InfoRow label="Tỉnh/TP" value={shop.provinceName} />
          </div>
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-stone-700 mb-3 flex items-center gap-2">
              <FiShoppingBag size={15} className="text-green-600" /> Hoạt động
            </h3>
            <InfoRow label="Gói dịch vụ" value={shop.planName} />
            <InfoRow label="Đánh giá TB" value={`${(shop?.ratingAvg ?? 0).toFixed(1)} / 5`} />
            <InfoRow label="Tổng đánh giá" value={`${shop.totalReviews} lượt`} />
            <InfoRow
              label="Duyệt lúc"
              value={
                shop.approvedAt
                  ? new Date(shop.approvedAt).toLocaleDateString('vi-VN')
                  : 'Chưa duyệt'
              }
            />
            <InfoRow
              label="Tạo ngày"
              value={new Date(shop.createdAt).toLocaleDateString('vi-VN')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
