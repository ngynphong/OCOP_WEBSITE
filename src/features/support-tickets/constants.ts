import { HelpCircle, CreditCard, ShoppingCart, User, Settings, AlertTriangle } from 'lucide-react';
import { TicketCategory, TicketPriority, TicketStatus } from './types/supportTicketTypes';

export const CATEGORY_OPTIONS: {
  value: TicketCategory;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  { value: 'PRODUCT', label: 'Sản phẩm', icon: ShoppingCart, desc: 'Chất lượng, bảo hành' },
  { value: 'PAYMENT', label: 'Thanh toán', icon: CreditCard, desc: 'Lỗi nạp tiền, thanh toán' },
  { value: 'REFUND', label: 'Hoàn tiền', icon: HelpCircle, desc: 'Yêu cầu hoàn trả, hủy đơn' },
  { value: 'ACCOUNT', label: 'Tài khoản', icon: User, desc: 'Đăng nhập, bảo mật' },
  {
    value: 'SHIPPING',
    label: 'Vận chuyển',
    icon: AlertTriangle,
    desc: 'Liên hệ đơn vị vận chuyển',
  },
  { value: 'OTHER', label: 'Khác', icon: Settings, desc: 'Góp ý hoặc vấn đề đổi trả' },
];

export const PRIORITY_OPTIONS: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'LOW', label: 'Thấp', color: 'bg-stone-100 text-stone-600' },
  { value: 'NORMAL', label: 'Bình thường', color: 'bg-blue-50 text-blue-600' },
  { value: 'HIGH', label: 'Cao', color: 'bg-amber-50 text-amber-600' },
  { value: 'URGENT', label: 'Khẩn cấp', color: 'bg-red-50 text-red-600' },
];

export const STATUS_OPTIONS: {
  label: string;
  value: TicketStatus;
  color: string;
  bgColor: string;
}[] = [
  { label: 'Đang mở (Mới)', value: 'OPEN', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { label: 'Đang xử lý', value: 'IN_PROGRESS', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  {
    label: 'Chờ khách trả lời',
    value: 'PENDING_USER',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
  {
    label: 'Đã giải quyết',
    value: 'RESOLVED',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  { label: 'Đóng ticket', value: 'CLOSED', color: 'text-stone-500', bgColor: 'bg-stone-50' },
];

export const STATUS_CONFIG: Record<
  TicketStatus,
  { label: string; color: string; bgColor: string }
> = {
  OPEN: { label: 'Đang mở', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-100' },
  IN_PROGRESS: {
    label: 'Đang xử lý',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-100',
  },
  PENDING_USER: {
    label: 'Chờ phản hồi',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-100',
  },
  RESOLVED: {
    label: 'Đã giải quyết',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-100',
  },
  CLOSED: { label: 'Đã đóng', color: 'text-stone-500', bgColor: 'bg-stone-50 border-stone-100' },
};

export const PRIORITY_CONFIG: Record<
  TicketPriority,
  { label: string; color: string; bgColor?: string }
> = {
  LOW: { label: 'Thấp', color: 'text-stone-500', bgColor: 'bg-stone-50' },
  NORMAL: { label: 'Bình thường', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  HIGH: { label: 'Cao', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  URGENT: { label: 'Khẩn cấp', color: 'text-red-600 font-black', bgColor: 'bg-red-50' },
};
