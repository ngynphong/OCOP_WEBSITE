import { JournalStepType } from '../types/productTypes';

export const JOURNAL_STEP_LABELS: Record<JournalStepType, string> = {
  RAW_MATERIAL: 'Nhập nguyên liệu / Thu mua',
  PLANTING: 'Gieo trồng',
  CARE: 'Chăm sóc',
  HARVESTING: 'Thu hoạch',
  PROCESSING: 'Chế biến',
  QUALITY_CHECK: 'Kiểm tra chất lượng',
  PACKAGING: 'Đóng gói',
  CERTIFICATION: 'Chứng nhận OCOP',
  OTHER: 'Khác',
};

export const BLOCKCHAIN_COLORS: Record<string, string> = {
  NOT_SUBMITTED: 'text-stone-400',
  PENDING: 'text-amber-500',
  CONFIRMED: 'text-emerald-600',
  FAILED: 'text-red-500',
};

export const BLOCKCHAIN_LABELS: Record<string, string> = {
  NOT_SUBMITTED: 'Chưa gửi',
  PENDING: 'Đang xử lý',
  CONFIRMED: 'Đã xác nhận',
  FAILED: 'Thất bại',
};

export const PRODUCT_UNITS = [
  'kilogam',
  'gam',
  'lít',
  'mililit',
  'cái',
  'hộp',
  'gói',
  'chai',
  'lọ',
  'túi',
  'vỉ',
  'cặp',
  'bộ',
  'cuộn',
  'mét',
];
