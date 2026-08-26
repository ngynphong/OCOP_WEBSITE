'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuthProfile } from '@/features/auth/hooks/useAuthProfile';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import {
  FiShoppingBag,
  FiTruck,
  FiRepeat,
  FiStar,
  FiArrowRight,
  FiUser,
  FiShield,
  FiTag,
  FiPackage,
  FiBarChart2,
  FiDollarSign,
  FiClock,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/features/uiSlice';
import { useSellerDashboard, useUserDashboard } from '@/features/dashboard/hooks/useDashboard';
import UpcomingTasksWidget from '@/features/dashboard/components/UpcomingTasksWidget';
import Image from 'next/image';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { useSellerRevenueQuery } from '@/features/seller-orders/hooks/useSellerOrders';
import { useLowStockAlertsQuery } from '@/features/inventory/hooks/useSellerInventory';
import { FiAlertTriangle } from 'react-icons/fi';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const DashboardPage = () => {
  const { profile } = useAuthProfile();
  const { dashboardMode } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isMounted, setIsMounted] = React.useState(false);

  const isSellerMode = dashboardMode === 'SELLER';

  const {
    data: sellerData,
    isPending: isSellerPending,
    isError: isSellerError,
  } = useSellerDashboard(isMounted && isSellerMode);

  const [revenuePeriod, setRevenuePeriod] = React.useState<'day' | 'week' | 'month'>('month');
  const { data: revenueData } = useSellerRevenueQuery({ period: revenuePeriod });
  const { data: lowStockAlerts } = useLowStockAlertsQuery();

  const {
    data: userData,
    isPending: isUserPending,
    isError: isUserError,
  } = useUserDashboard(isMounted && !isSellerMode);

  React.useEffect(() => {
    // Only dispatch global loading on first mount, react-query will handle subsequent loads silently
    if (!isMounted) {
      dispatch(setLoading({ isLoading: true, message: 'Đang khởi tạo Dashboard...' }));
      const timer = setTimeout(() => {
        setIsMounted(true);
        dispatch(setLoading({ isLoading: false }));
      }, 400);

      return () => {
        clearTimeout(timer);
        dispatch(setLoading({ isLoading: false }));
      };
    }
  }, [dispatch, isMounted]);

  if (!isMounted) return null;

  const isPending = isSellerMode ? isSellerPending : isUserPending;
  const isError = isSellerMode ? isSellerError : isUserError;

  if (isPending) {
    return (
      <div className="space-y-8 p-6 md:p-10 animate-pulse">
        <div className="h-24 bg-stone-100 rounded-xl w-full"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-stone-100 rounded-xl w-full"></div>
          ))}
        </div>
        <div className="h-40 bg-stone-100 rounded-xl w-full"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl m-6">
        <p className="font-bold">Không thể tải dữ liệu Dashboard. Vui lòng thử lại sau.</p>
      </div>
    );
  }

  const consumerStats = [
    {
      label: 'Đơn hàng',
      value: userData?.userStats?.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
    },
    {
      label: 'Đang vận chuyển',
      value: userData?.userStats?.shippingOrders || 0,
      icon: FiTruck,
      color: 'bg-amber-500',
    },
    {
      label: 'Hoàn tất',
      value: userData?.userStats?.completedOrders || 0,
      icon: FiStar,
      color: 'bg-green-500',
    },
    {
      label: 'Điểm tích lũy',
      value: userData?.userStats?.loyaltyPoints || 0,
      icon: FiRepeat,
      color: 'bg-purple-500',
    },
  ];

  const sellerStats = [
    {
      label:
        'Doanh thu (' +
        (revenuePeriod === 'day'
          ? 'Hôm nay'
          : revenuePeriod === 'week'
            ? 'Tuần này'
            : 'Tháng này') +
        ')',
      value: formatCurrency(revenueData?.data?.netRevenue || 0),
      icon: FiDollarSign,
      color: 'bg-emerald-600',
    },
    {
      label: 'Đơn chờ xử lý',
      value: sellerData?.sellerStats?.newOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-600',
    },
    {
      label: 'Sản phẩm',
      value: sellerData?.sellerStats?.totalProducts || 0,
      icon: FiPackage,
      color: 'bg-orange-500',
    },
    {
      label: 'Đánh giá shop',
      value: sellerData?.sellerStats?.shopRating || '5.0',
      icon: FiStar,
      color: 'bg-amber-400',
    },
  ];

  const stats = isSellerMode ? sellerStats : consumerStats;
  const recentOrders = isSellerMode ? sellerData?.recentOrders : userData?.recentOrders;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Section */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border transition-colors bg-green-50 border-green-100',
        )}
      >
        <div>
          <h2 className={cn('text-xl font-bold text-green-900')}>
            {isSellerMode ? 'Seller Center' : 'Chào mừng trở lại'}, {profile?.firstName}! 👋
          </h2>
          <p className={cn('text-sm mt-1', isSellerMode ? 'text-stone-400' : 'text-green-700')}>
            {isSellerMode
              ? 'Hôm nay tình hình kinh doanh của shop thế nào?'
              : 'Hôm nay bạn muốn thưởng thức tinh hoa OCOP nào?'}
          </p>
        </div>
        <Link
          href={isSellerMode ? '/dashboard/san-pham/tao-moi' : '/san-pham'}
          className={cn(
            'px-6 py-3 text-sm font-bold rounded-full transition-all shadow-lg w-fit bg-green-600 text-white hover:bg-green-700 shadow-green-600/20',
          )}
        >
          {isSellerMode ? '+ Thêm sản phẩm' : 'Khám phá ngay'}
        </Link>
      </div>

      {/* Revenue Filter for Seller */}
      {isSellerMode && (
        <div className="flex justify-end -mb-2">
          <div className="inline-flex bg-stone-100 p-1 rounded-lg">
            {(['day', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setRevenuePeriod(period)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-md transition-all',
                  revenuePeriod === period
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700',
                )}
              >
                {period === 'day' ? 'Hôm nay' : period === 'week' ? 'Tuần này' : 'Tháng này'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-5 bg-white border border-stone-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div
              className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}
            >
              <stat.icon size={20} />
            </div>
            <p className="text-stone-500 text-xs font-semibold uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {isSellerMode && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <UpcomingTasksWidget />

          <div className="flex flex-col gap-4 lg:h-[350px]">
            <div className="p-5 rounded-xl bg-white border border-stone-100 flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <FiTag size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">
                  Sản phẩm chờ duyệt
                </p>
                <p className="text-xl font-black text-stone-900">
                  {sellerData?.overview?.pendingProducts || 0}
                </p>
              </div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-stone-100 flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <FiBarChart2 size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-tighter">
                  Lượt xem shop
                </p>
                <p className="text-xl font-black text-stone-900">
                  {sellerData?.overview?.shopViews || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditional Banner */}
      {!isSellerMode && (
        <Link
          href="/dashboard/cua-hang"
          className="group flex items-center gap-5 p-5 rounded-xl bg-linear-to-r from-green-700 to-emerald-600 text-white shadow-xl shadow-green-700/25 hover:shadow-green-600/40 transition-all hover:-translate-y-0.5"
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <FiTag size={22} />
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-base">Trở thành Nhà bán hàng OCOP</p>
            <p className="text-xs text-green-100 mt-0.5">
              Mở shop và tiếp cận hàng triệu khách hàng yêu thích đặc sản Việt Nam.
            </p>
          </div>
          <FiArrowRight
            size={20}
            className="shrink-0 opacity-70 group-hover:translate-x-1 transition-transform"
          />
        </Link>
      )}

      {isSellerMode &&
        sellerData?.actionRequiredProducts &&
        sellerData.actionRequiredProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Sản phẩm thiếu Nhật ký nguồn gốc
              </h3>
            </div>
            <div className="bg-white border border-red-100 rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y divide-red-50">
                {sellerData.actionRequiredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-red-50/50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden relative shrink-0 border border-stone-200">
                        {product.thumbnailUrl ? (
                          <Image
                            src={product.thumbnailUrl}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <FiPackage className="w-5 h-5 text-stone-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800">{product.name}</p>
                        <p className="text-xs text-red-500 font-medium mt-0.5">
                          Thiếu: {product.missingGroups.join(', ')}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/san-pham`}
                      className="shrink-0 px-3 py-2.5 bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 rounded-lg text-xs font-bold transition-colors"
                    >
                      Bổ sung ngay
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      {isSellerMode && lowStockAlerts && lowStockAlerts.data.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiAlertTriangle className="text-amber-500" size={20} />
            <h3 className="text-lg font-bold text-stone-900">Sản phẩm sắp hết hàng</h3>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-xl overflow-hidden shadow-sm">
            <div className="divide-y divide-amber-100/50">
              {lowStockAlerts.data.map((alert) => (
                <div
                  key={alert.variantId}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden relative shrink-0 border border-amber-200 flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-stone-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-stone-800">{alert.variantName}</p>
                      <p className="text-xs text-amber-700 font-medium mt-0.5">SKU: {alert.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between sm:justify-end w-full sm:w-auto">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-stone-500 mb-0.5">Tồn kho hiện tại</p>
                      <p className="text-sm font-bold text-amber-600">{alert.stockQty}</p>
                    </div>
                    <Link
                      href={`/dashboard/kho-hang`}
                      className="shrink-0 px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-xs font-bold transition-colors shadow-sm shadow-amber-500/20"
                    >
                      Nhập thêm
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-stone-900">
              {isSellerMode ? 'Đơn hàng mới' : 'Đơn hàng gần đây'}
            </h3>
            <Link
              href={isSellerMode ? '/dashboard/cua-hang/don-hang' : '/dashboard/don-hang'}
              className="text-sm text-green-600 hover:text-green-700 font-semibold flex items-center gap-1 group p-2 -mr-2"
            >
              Xem tất cả <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentOrders && recentOrders.length > 0 ? (
            <div className="bg-white border border-stone-100 rounded-xl overflow-hidden shadow-sm">
              <div className="divide-y divide-stone-100">
                {recentOrders.slice(0, 4).map((order) => (
                  <div
                    key={order.orderId}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center shrink-0">
                        <FiShoppingBag size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-800">{order.orderId}</p>
                        <p className="text-xs text-stone-500">
                          {isSellerMode ? order.customerName : order.shopName}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right flex flex-col items-start sm:items-end justify-center">
                      <p className="text-sm font-black text-stone-900 mb-1">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-stone-50 rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <FiClock size={20} className="text-stone-300" />
              </div>
              <p className="text-sm text-stone-500">
                {isSellerMode ? 'Chưa có đơn hàng nào cần xử lý.' : 'Bạn chưa có đơn hàng nào.'}
              </p>
            </div>
          )}
        </div>

        {/* Account News/Tips */}
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900">
            {isSellerMode ? 'Công cụ bán hàng' : 'Thông tin tài khoản'}
          </h3>
          <div className="bg-white border border-stone-100 rounded-xl p-6 space-y-4 shadow-sm">
            <Link
              href={isSellerMode ? '/dashboard/cua-hang' : '/dashboard/ho-so'}
              className="flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-stone-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                <FiUser size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-800 group-hover:text-green-700 transition-colors">
                  {isSellerMode ? 'Cài đặt Shop' : 'Cập nhật hồ sơ'}
                </p>
                <p className="text-xs text-stone-500">
                  {isSellerMode
                    ? 'Quản lý thông tin hiển thị của shop.'
                    : 'Hoàn thiện thông tin để nhận ưu đãi cá nhân.'}
                </p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-stone-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all">
                <FiArrowRight size={16} />
              </div>
            </Link>
            <Link
              href={isSellerMode ? '/dashboard/cua-hang/chinh-sach' : '/dashboard/bao-mat'}
              className="flex items-center gap-4 p-2 -mx-2 rounded-xl hover:bg-stone-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                <FiShield size={18} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-stone-800 group-hover:text-blue-700 transition-colors">
                  {isSellerMode ? 'Chính sách bán hàng' : 'Bảo mật'}
                </p>
                <p className="text-xs text-stone-500">
                  {isSellerMode
                    ? 'Cập nhật các quy định bảo hành, đổi trả.'
                    : 'Thay đổi mật khẩu định kỳ để bảo vệ tài khoản.'}
                </p>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-stone-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                <FiArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
