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
} from 'react-icons/fi';
import { ShopInfo } from '@/features/shop/types/shopTypes';
import { Button } from '@/components/ui/AppButton';
import { useChatMutations } from '@/features/chat/hooks/useChatRooms';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { ComplaintFormModal } from '@/features/complaints/components/ComplaintFormModal';

interface ShopProfileHeaderProps {
  shop: ShopInfo;
}

export const ShopProfileHeader = ({ shop }: ShopProfileHeaderProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { createRoom, isCreatingRoom } = useChatMutations();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, 150]);

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

  const joinedDate = new Date(shop.createdAt).toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white border-b border-stone-200">
      {/* Banner */}
      <div className="relative w-full h-48 sm:h-64 md:h-80 bg-stone-100 overflow-hidden">
        <motion.div style={{ y: yParallax }} className="absolute inset-0 -top-20 -bottom-20">
          {shop.bannerUrl ? (
            <Image
              src={shop.bannerUrl}
              alt={`Banner của ${shop.name}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <Image
              src={'/images/background.jpg'}
              alt={`Banner của ${shop.name}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
        </motion.div>
      </div>

      {/* Profile Info overlaps banner */}
      <div className="container mx-auto px-4 sm:px-6 relative pb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-6 sm:gap-8 -mt-16 md:-mt-20">
          {/* Logo / Avatar */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white bg-white shadow-md overflow-hidden shrink-0 z-10">
            {shop.logoUrl ? (
              <Image
                src={shop.logoUrl}
                alt={shop.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, 160px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-600 text-4xl font-bold uppercase">
                {shop.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Shop Details */}
          <div className="flex-1 w-full pt-1 md:pt-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 flex items-center gap-2">
                  {shop.name}
                  {shop.status === 'ACTIVE' && (
                    <FiCheckCircle
                      className="text-emerald-500 shrink-0"
                      size={24}
                      title="Đã xác thực"
                    />
                  )}
                </h1>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm text-stone-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <FiStar className="text-amber-500" fill="currentColor" />
                    {shop.ratingAvg > 0 ? shop.ratingAvg.toFixed(1) : 'Chưa có'}
                    <span className="text-stone-400">({shop.totalReviews} đánh giá)</span>
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FiMapPin className="text-stone-400" />
                    {shop.provinceName || 'Đang cập nhật'}
                  </span>

                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="text-stone-400" />
                    Tham gia {joinedDate}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  className="flex-1 md:flex-auto gap-2"
                  onClick={handleStartChat}
                  isLoading={isCreatingRoom}
                >
                  <FiMessageCircle size={18} />
                  Nhắn tin
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 md:flex-auto gap-2 text-stone-600 border-stone-200 hover:bg-stone-50"
                  onClick={() => setIsComplaintModalOpen(true)}
                >
                  <FiAlertTriangle size={18} />
                  Khiếu nại
                </Button>
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
