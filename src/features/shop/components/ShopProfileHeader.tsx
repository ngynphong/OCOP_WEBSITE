import React from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  FiMapPin,
  FiStar,
  FiCalendar,
  FiCheckCircle,
  FiMessageCircle,
  FiAlertTriangle,
  FiShare2,
  FiAward,
  FiPackage,
  FiUsers,
  FiPlus,
  FiCheck,
  FiLoader,
} from 'react-icons/fi';
import { ShopInfo } from '@/features/shop/types/shopTypes';
import { useChatMutations } from '@/features/chat/hooks/useChatRooms';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { ComplaintFormModal } from '@/features/complaints/components/ComplaintFormModal';
import {
  useShopFollowStatusQuery,
  useToggleShopFollowMutation,
} from '@/features/shop/hooks/useShopFollow';
import { cn } from '@/lib/utils';

interface ShopProfileHeaderProps {
  shop: ShopInfo;
  totalProductsCount?: number;
}

export const ShopProfileHeader = ({ shop, totalProductsCount }: ShopProfileHeaderProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { createRoom, isCreatingRoom } = useChatMutations();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 80]);

  const { data: followStatusData } = useShopFollowStatusQuery(shop.id);
  const toggleFollowMutation = useToggleShopFollowMutation(shop.id);

  const isFollowing = followStatusData?.data?.isFollowing ?? false;
  const followerCount = followStatusData?.data?.followerCount ?? shop.followerCount ?? 0;

  const handleToggleFollow = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để theo dõi cửa hàng');
      router.push(`/dang-nhap?redirect=/cua-hang/${shop.slug}`);
      return;
    }
    toggleFollowMutation.mutate(isFollowing);
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để nhắn tin cho cửa hàng');
      router.push('/dang-nhap');
      return;
    }

    try {
      const resp = await createRoom(shop.id);
      if (resp.data?.id) {
        router.push(`/dashboard/chat?roomId=${resp.data.id}`);
      }
    } catch (error) {
      console.error('Failed to create chat room:', error);
    }
  };

  const handleShareShop = async () => {
    try {
      if (typeof window !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Đã sao chép liên kết cửa hàng');
      }
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const joinedDate = shop.createdAt
    ? new Date(shop.createdAt).toLocaleDateString('vi-VN', {
        month: '2-digit',
        year: 'numeric',
      })
    : 'Gần đây';

  return (
    <div className="relative bg-stone-100">
      {/* Cover Banner */}
      <div className="relative w-full h-40 sm:h-52 md:h-64 lg:h-72 bg-stone-900 overflow-hidden">
        <motion.div style={{ y: yParallax }} className="absolute inset-0 -top-12 -bottom-12">
          <Image
            src={shop.bannerUrl || '/images/background.jpg'}
            alt={`Banner của ${shop.name}`}
            fill
            className="object-cover opacity-90"
            priority
            sizes="100vw"
          />
        </motion.div>
        {/* Multi-layer gradient overlays for smooth depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-stone-950/30 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-stone-950/80 to-transparent pointer-events-none" />
      </div>

      {/* Main Profile Card Container */}
      <div className="container mx-auto px-3 sm:px-6">
        <div className="relative -mt-12 sm:-mt-16 md:-mt-20 pb-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xl shadow-stone-900/5 p-4 sm:p-6 md:p-7">
            {/* Top row: Avatar + Info + Actions */}
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 sm:gap-6">
              {/* Left group: Avatar & Shop Details */}
              <div className="flex items-start gap-3.5 sm:gap-5 min-w-0 flex-1">
                {/* Logo / Avatar with active indicator */}
                <div className="relative shrink-0">
                  <div className="relative w-18 h-18 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl border-3 border-white bg-white shadow-md overflow-hidden ring-1 ring-stone-200/70">
                    {shop.logoUrl ? (
                      <Image
                        src={shop.logoUrl}
                        alt={shop.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 72px, (max-width: 768px) 96px, 112px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800 text-2xl sm:text-3xl md:text-4xl font-black uppercase">
                        {shop.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {shop.status === 'ACTIVE' && (
                    <span
                      title="Gian hàng đang hoạt động"
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-xs flex items-center justify-center"
                    >
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </span>
                  )}
                </div>

                {/* Info & Metrics */}
                <div className="min-w-0 flex-1 pt-0.5 sm:pt-1">
                  {/* Shop Name & Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-stone-900 tracking-tight leading-snug line-clamp-2">
                      {shop.name}
                    </h1>

                    {shop.status === 'ACTIVE' && (
                      <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs">
                        <FiCheckCircle className="text-emerald-600" size={12} />
                        Đã xác thực
                      </span>
                    )}

                    {shop.planName && (
                      <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-0.5 rounded-full text-[11px] sm:text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/90 shadow-2xs">
                        <FiAward className="text-amber-600" size={12} />
                        {shop.planName}
                      </span>
                    )}
                  </div>

                  {/* Clean, Structured Stat Chips */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-3">
                    {/* Rating Chip */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs sm:text-sm font-semibold shadow-2xs">
                      <FiStar className="text-amber-500 fill-amber-400" size={13} />
                      <span className="text-stone-800">
                        {shop.ratingAvg > 0 ? shop.ratingAvg.toFixed(1) : '5.0'}
                      </span>
                      <span className="text-stone-400 font-normal text-[11px] sm:text-xs">
                        ({shop.totalReviews || 0} đánh giá)
                      </span>
                    </div>

                    {/* Followers Chip */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm font-medium shadow-2xs">
                      <FiUsers className="text-emerald-600" size={13} />
                      <span className="font-bold text-stone-900">
                        {followerCount > 999
                          ? `${(followerCount / 1000).toFixed(1)}k`
                          : followerCount}
                      </span>
                      <span className="text-stone-500 text-[11px] sm:text-xs">người theo dõi</span>
                    </div>

                    {/* Products Count Chip */}
                    {totalProductsCount !== undefined && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm font-medium shadow-2xs">
                        <FiPackage className="text-stone-500" size={13} />
                        <span className="font-bold text-stone-900">{totalProductsCount}</span>
                        <span className="text-stone-500 text-[11px] sm:text-xs">sản phẩm</span>
                      </div>
                    )}

                    {/* Location Chip */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-stone-50 border border-stone-200/70 text-xs sm:text-sm font-medium shadow-2xs">
                      <FiMapPin className="text-rose-500" size={13} />
                      <span className="text-stone-700 text-[11px] sm:text-xs font-semibold">
                        {shop.provinceName || 'Toàn quốc'}
                      </span>
                    </div>

                    {/* Joined Date */}
                    <div className="hidden sm:inline-flex items-center gap-1 text-stone-400 text-xs font-normal pl-1">
                      <FiCalendar size={12} />
                      <span>Gia nhập {joinedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right group: Modern Action Buttons */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 pt-3 sm:pt-1 border-t sm:border-t-0 border-stone-100 w-full lg:w-auto">
                {/* 1. Follow Button */}
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  disabled={toggleFollowMutation.isPending}
                  className={cn(
                    'flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm h-10 px-4 sm:px-5 rounded-xl transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]',
                    isFollowing
                      ? 'bg-stone-100 text-stone-700 hover:bg-rose-50 hover:text-rose-600 border border-stone-200 hover:border-rose-200 group'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md hover:shadow-emerald-600/25',
                  )}
                >
                  {toggleFollowMutation.isPending ? (
                    <FiLoader className="animate-spin" size={15} />
                  ) : isFollowing ? (
                    <>
                      <FiCheck size={16} className="text-emerald-600 group-hover:hidden" />
                      <span className="group-hover:hidden">Đang theo dõi</span>
                      <span className="hidden group-hover:inline">Bỏ theo dõi</span>
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      <span>Theo dõi</span>
                    </>
                  )}
                </button>

                {/* 2. Message / Chat Button */}
                <button
                  type="button"
                  onClick={handleStartChat}
                  disabled={isCreatingRoom}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-emerald-50/50 text-stone-800 hover:text-emerald-700 border border-stone-200/90 hover:border-emerald-300 font-bold text-xs sm:text-sm h-10 px-4 sm:px-5 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-xs active:scale-[0.98]"
                >
                  {isCreatingRoom ? (
                    <FiLoader className="animate-spin text-emerald-600" size={15} />
                  ) : (
                    <FiMessageCircle size={16} className="text-emerald-600" />
                  )}
                  <span>Nhắn tin</span>
                </button>

                {/* 3. Share Button */}
                <button
                  type="button"
                  onClick={handleShareShop}
                  className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-stone-100/80 text-stone-700 hover:text-stone-900 border border-stone-200/90 font-bold text-xs sm:text-sm h-10 px-3.5 sm:px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]"
                  title="Chia sẻ đường dẫn gian hàng"
                >
                  <FiShare2 size={15} className="text-stone-500" />
                  <span className="hidden sm:inline">Chia sẻ</span>
                </button>

                {/* 4. Report Button */}
                <button
                  type="button"
                  onClick={() => setIsComplaintModalOpen(true)}
                  className="inline-flex items-center justify-center h-10 w-10 shrink-0 text-stone-400 hover:text-rose-600 bg-white hover:bg-rose-50 border border-stone-200/90 hover:border-rose-200 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs active:scale-[0.98]"
                  title="Báo cáo / Khiếu nại gian hàng"
                >
                  <FiAlertTriangle size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComplaintFormModal
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
        initialType="SELLER_BEHAVIOR"
        shopId={shop.id}
      />
    </div>
  );
};
