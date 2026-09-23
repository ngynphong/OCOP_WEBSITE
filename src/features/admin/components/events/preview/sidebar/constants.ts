import {
  Flower2,
  Wheat,
  Leaf,
  Award,
  Zap,
  Mountain,
  Waves,
  Moon,
  PartyPopper,
  Snowflake,
} from 'lucide-react';
import type { AtmosphereEffectType } from '@/features/events/types/eventTypes';

export const PRESET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  tet_xuan: Flower2,
  mua_vang: Wheat,
  ocop_xanh: Leaf,
  le_hoi_viet: Award,
  sieu_sale: Zap,
  tay_bac: Mountain,
  miet_vuon: Waves,
  trung_thu: Moon,
};

export const ATMOSPHERE_OPTIONS: Array<{
  type: AtmosphereEffectType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    type: 'apricot_petals',
    label: 'Hoa Mai Vàng',
    desc: 'Cánh hoa mai rơi lất phất',
    icon: Flower2,
  },
  { type: 'peach_petals', label: 'Hoa Đào Hồng', desc: 'Cánh hoa đào mùa xuân', icon: Flower2 },
  { type: 'golden_leaves', label: 'Lá Lúa Vàng', desc: 'Lá lúa thu hoạch bay nhẹ', icon: Wheat },
  { type: 'starlight', label: 'Ánh Sao Đêm Thu', desc: 'Đom đóm & sao lung linh', icon: Moon },
  {
    type: 'confetti',
    label: 'Pháo Giấy Siêu Sale',
    desc: 'Kim tuyến & giấy màu rực rỡ',
    icon: PartyPopper,
  },
  { type: 'snowflakes', label: 'Bông Tuyết', desc: 'Tuyết rơi mùa lễ hội', icon: Snowflake },
];
