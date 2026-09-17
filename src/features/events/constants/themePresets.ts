import type { ComponentType } from 'react';
import {
  Flower2,
  Wheat,
  Leaf,
  Award,
  Zap,
  Mountain,
  Waves,
  Moon,
  Snowflake,
  Ban,
} from 'lucide-react';

export interface ThemePreset {
  id: string;
  name: string;
  subtitle: string;
  primary: string;
  secondary: string;
  surface: string;
  icon: string;
  badge: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'tet_xuan',
    name: 'Tết & Xuân Sum Vầy',
    subtitle: 'Đỏ son may mắn & Vàng kim tài lộc',
    primary: '#DC2626',
    secondary: '#F59E0B',
    surface: '#FEF2F2',
    icon: '🧧',
    badge: 'Tết Nguyên Đán',
  },
  {
    id: 'mua_vang',
    name: 'Mùa Vàng Bội Thu',
    subtitle: 'Vàng rơm óng ả & Xanh lá lúa non',
    primary: '#D97706',
    secondary: '#16A34A',
    surface: '#FFFBEB',
    icon: '🌾',
    badge: 'Nông Sản Vàng',
  },
  {
    id: 'ocop_xanh',
    name: 'Nông Sản Xanh / Eco',
    subtitle: 'Xanh ngọc đại ngàn & Xanh đọt chuối',
    primary: '#15803D',
    secondary: '#84CC16',
    surface: '#F0FDF4',
    icon: '🍃',
    badge: 'Hữu Cơ Sinh Thái',
  },
  {
    id: 'le_hoi_viet',
    name: 'Đại Lễ & Tự Hào Bản Sắc',
    subtitle: 'Đỏ cờ trang nghiêm & Vàng sao rực rỡ',
    primary: '#B91C1C',
    secondary: '#D97706',
    surface: '#FFF1F2',
    icon: '🇻🇳',
    badge: '2/9 • 30/4',
  },
  {
    id: 'sieu_sale',
    name: 'Mega Sale & Flash Sale',
    subtitle: 'Tím Neon hiện đại & Hồng rực kích cầu',
    primary: '#7C3AED',
    secondary: '#E11D48',
    surface: '#FAF5FF',
    icon: '⚡',
    badge: '9.9 • 11.11 • Sale',
  },
  {
    id: 'tay_bac',
    name: 'Hương Rừng Vùng Cao',
    subtitle: 'Nâu đất bazan ấm & Xanh chàm thổ cẩm',
    primary: '#C2410C',
    secondary: '#0284C7',
    surface: '#FFF7ED',
    icon: '🏔️',
    badge: 'Tây Bắc • Tây Nguyên',
  },
  {
    id: 'miet_vuon',
    name: 'Phù Sa Miệt Vườn',
    subtitle: 'Xanh sông nước & Cam chín mọng miền Tây',
    primary: '#0F766E',
    secondary: '#EA580C',
    surface: '#F0FDFA',
    icon: '🍊',
    badge: 'Đặc Sản Miền Tây',
  },
  {
    id: 'trung_thu',
    name: 'Đêm Hội Trăng Rằm',
    subtitle: 'Xanh chàm đêm thu & Vàng ánh trăng rằm',
    primary: '#4F46E5',
    secondary: '#D97706',
    surface: '#FEFCE8',
    icon: '🥮',
    badge: 'Tết Trung Thu',
  },
];

export const PRESET_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  tet_xuan: Flower2,
  mua_vang: Wheat,
  ocop_xanh: Leaf,
  le_hoi_viet: Award,
  sieu_sale: Zap,
  tay_bac: Mountain,
  miet_vuon: Waves,
  trung_thu: Moon,
};

export const CONCEPT_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  TET_NGUYEN_DAN: Flower2,
  TRUNG_THU: Moon,
  MUA_VANG: Wheat,
  DAI_LE: Award,
  MEGA_SALE: Zap,
  GIANG_SINH: Snowflake,
  NONE: Ban,
};
