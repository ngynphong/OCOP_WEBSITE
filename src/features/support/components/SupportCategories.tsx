import React from 'react';
import { Package, Truck, CreditCard, UserCircle, RefreshCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  {
    id: 'orders',
    title: 'Đơn hàng & Vận chuyển',
    description: 'Theo dõi đơn, thời gian giao hàng, phí vận chuyển.',
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'group-hover:border-blue-200',
  },
  {
    id: 'returns',
    title: 'Đổi trả & Hoàn tiền',
    description: 'Chính sách đổi trả, thời gian xử lý hoàn tiền.',
    icon: RefreshCcw,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'group-hover:border-orange-200',
  },
  {
    id: 'payment',
    title: 'Thanh toán & Hóa đơn',
    description: 'Phương thức thanh toán, lỗi trừ tiền, xuất hóa đơn.',
    icon: CreditCard,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'group-hover:border-green-200',
  },
  {
    id: 'account',
    title: 'Tài khoản & Bảo mật',
    description: 'Quản lý thông tin cá nhân, lấy lại mật khẩu.',
    icon: UserCircle,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'group-hover:border-purple-200',
  },
  {
    id: 'products',
    title: 'Sản phẩm OCOP',
    description: 'Thông tin sản phẩm, chứng nhận chất lượng.',
    icon: Package,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'group-hover:border-amber-200',
  },
  {
    id: 'policies',
    title: 'Chính sách',
    description: 'Điều khoản dịch vụ, chính sách bảo mật.',
    icon: ShieldCheck,
    color: 'text-stone-600',
    bgColor: 'bg-stone-100',
    borderColor: 'group-hover:border-stone-300',
  },
];

export const SupportCategories = () => {
  return (
    <div className="py-12 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Khám phá theo chủ đề</h2>
          <p className="mt-2 text-stone-500">
            Chọn một chủ đề bên dưới để tìm câu trả lời chi tiết
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`#`}
              className="group flex flex-col bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={cn(
                  'w-14 h-14 flex items-center justify-center rounded-xl mb-4 transition-colors',
                  category.bgColor,
                  category.color,
                )}
              >
                <category.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-green-700 transition-colors">
                {category.title}
              </h3>
              <p className="text-stone-500 line-clamp-2">{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
