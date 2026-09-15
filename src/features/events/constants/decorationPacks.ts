import type { ConceptPackId, AtmosphereEffectType } from '../types/eventTypes';

export interface ConceptPack {
  id: ConceptPackId;
  name: string;
  subtitle: string;
  icon: string;
  badge: string;
  suggestedThemePresetId: string;
  atmosphereType: AtmosphereEffectType;
  atmosphereLabel: string;
  cornerLabel: string;
}

export const CONCEPT_PACKS: ConceptPack[] = [
  {
    id: 'TET_NGUYEN_DAN',
    name: 'Tết Cổ Truyền - Xuân Sum Vầy',
    subtitle: 'Cành mai vàng, cặp bánh chưng, bao lì xì đỏ',
    icon: '🧧',
    badge: 'Tết Nguyên Đán',
    suggestedThemePresetId: 'tet_xuan',
    atmosphereType: 'apricot_petals',
    atmosphereLabel: 'Cánh hoa mai vàng rơi lất phất',
    cornerLabel: 'Cành mai rủ góc & Bánh chưng xanh',
  },
  {
    id: 'TRUNG_THU',
    name: 'Đêm Hội Trăng Rằm',
    subtitle: 'Vầng trăng rằm, lồng đèn ông sao, mây lành',
    icon: '🥮',
    badge: 'Tết Trung Thu',
    suggestedThemePresetId: 'trung_thu',
    atmosphereType: 'starlight',
    atmosphereLabel: 'Ánh sao đêm thu & Đom đóm lung linh',
    cornerLabel: 'Lồng đèn ông sao treo góc',
  },
  {
    id: 'MUA_VANG',
    name: 'Mùa Vàng Nông Sản Bội Thu',
    subtitle: 'Bông lúa trĩu hạt, giỏ ngũ quả, nón lá Việt',
    icon: '🌾',
    badge: 'Mùa Bội Thu',
    suggestedThemePresetId: 'mua_vang',
    atmosphereType: 'golden_leaves',
    atmosphereLabel: 'Lá lúa vàng bay nhẹ nhàng',
    cornerLabel: 'Bông lúa vàng óng ả & Lá mạ non',
  },
  {
    id: 'DAI_LE',
    name: 'Tự Hào Nông Sản Việt',
    subtitle: 'Dải lụa cờ đỏ sao vàng, dải hoa sen, trống đồng',
    icon: '🇻🇳',
    badge: '2/9 • 30/4',
    suggestedThemePresetId: 'le_hoi_viet',
    atmosphereType: 'confetti',
    atmosphereLabel: 'Pháo giấy chào mừng lễ lớn',
    cornerLabel: 'Dải lụa cờ hoa & Trống đồng',
  },
  {
    id: 'MEGA_SALE',
    name: 'Siêu Sale & Kích Cầu Bùng Nổ',
    subtitle: 'Tia chớp Neon 3D, hộp quà mở tung, nhãn giảm giá',
    icon: '⚡',
    badge: '9.9 • 11.11 • Sale Sốc',
    suggestedThemePresetId: 'sieu_sale',
    atmosphereType: 'confetti',
    atmosphereLabel: 'Pháo giấy kim tuyến bùng nổ',
    cornerLabel: 'Tia chớp phát sáng & Hộp quà',
  },
  {
    id: 'GIANG_SINH',
    name: 'Lễ Hội Mùa Đông & Năm Mới',
    subtitle: 'Chuông vàng, dải quả thông, cây thông Noel',
    icon: '❄️',
    badge: 'Noel & New Year',
    suggestedThemePresetId: 'tet_xuan',
    atmosphereType: 'snowflakes',
    atmosphereLabel: 'Bông tuyết trắng bay nhẹ',
    cornerLabel: 'Chuông vàng & Quả thông Noel',
  },
  {
    id: 'NONE',
    name: 'Tiêu Chuẩn / Tối Giản',
    subtitle: 'Chỉ áp dụng màu sắc theme, không có họa tiết động',
    icon: '🚫',
    badge: 'Mặc định',
    suggestedThemePresetId: 'ocop_xanh',
    atmosphereType: 'none',
    atmosphereLabel: 'Không có hiệu ứng khí quyển',
    cornerLabel: 'Không sử dụng họa tiết góc',
  },
];
