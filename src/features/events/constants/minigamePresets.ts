import type {
  MinigameReward,
  MysteryPickConceptId,
  MysteryPickConceptConfig,
} from '../types/eventMinigameTypes';

/**
 * Danh sách phần thưởng Bốc Lì Xì May Mắn
 * Thiết kế bảo toàn biên độ lợi nhuận với Min Order Value (MOV)
 */
export const LUCKY_ENVELOPE_REWARDS: MinigameReward[] = [
  {
    id: 'env_vch_20k',
    type: 'VOUCHER',
    name: 'Lộc Xuân 20.000đ',
    badge: 'Voucher 20K',
    description: 'Áp dụng cho đơn hàng từ 199.000đ',
    value: 20000,
    voucherCode: 'LIXI20K',
    minOrderValue: 199000,
    iconName: 'ticket',
    themeColor: '#DC2626',
    weight: 25,
  },
  {
    id: 'env_ship_15k',
    type: 'FREESHIP',
    name: 'Freeship Tết 15.000đ',
    badge: 'Freeship 15K',
    description: 'Hỗ trợ phí vận chuyển đơn từ 149.000đ',
    value: 15000,
    voucherCode: 'FREESHIPTET',
    minOrderValue: 149000,
    iconName: 'truck',
    themeColor: '#059669',
    weight: 25,
  },
  {
    id: 'env_pts_50',
    type: 'POINTS',
    name: '+50 Điểm Thưởng OCOP',
    badge: '+50 Điểm',
    description: 'Tích lũy điểm tiêu dùng OCOP Rewards',
    value: 50,
    points: 50,
    iconName: 'coins',
    themeColor: '#D97706',
    weight: 20,
  },
  {
    id: 'env_vch_50k',
    type: 'VOUCHER',
    name: 'Đại Cát Đại Lợi 50.000đ',
    badge: 'Voucher 50K',
    description: 'Áp dụng cho đơn hàng từ 499.000đ',
    value: 50000,
    voucherCode: 'DAICAT50K',
    minOrderValue: 499000,
    iconName: 'ticket',
    themeColor: '#E11D48',
    weight: 10,
  },
  {
    id: 'env_pts_100',
    type: 'POINTS',
    name: '+100 Điểm Thưởng OCOP',
    badge: '+100 Điểm',
    description: 'Nhân đôi may mắn vào ví điểm tích lũy',
    value: 100,
    points: 100,
    iconName: 'coins',
    themeColor: '#B45309',
    weight: 10,
  },
  {
    id: 'env_wish_loc',
    type: 'WISH',
    name: 'Lời Chúc An Khang Thịnh Vượng',
    badge: 'Lời Chúc Vàng',
    description: 'Kèm mã voucher an ủi 10.000đ cho đơn từ 99.000đ',
    value: 10000,
    voucherCode: 'LOCXUAN10K',
    minOrderValue: 99000,
    iconName: 'sparkles',
    themeColor: '#7C3AED',
    weight: 10,
  },
];

/**
 * Danh sách phần thưởng Bốc Bánh Trung Thu May Mắn
 */
export const TRUNG_THU_REWARDS: MinigameReward[] = [
  {
    id: 'tt_vch_20k',
    type: 'VOUCHER',
    name: 'Lộc Trăng Vàng 20.000đ',
    badge: 'Voucher 20K',
    description: 'Áp dụng cho đơn hàng từ 199.000đ',
    value: 20000,
    voucherCode: 'TRANGVANG20K',
    minOrderValue: 199000,
    iconName: 'ticket',
    themeColor: '#D97706',
    weight: 25,
  },
  {
    id: 'tt_ship_15k',
    type: 'FREESHIP',
    name: 'Freeship Đêm Trăng 15.000đ',
    badge: 'Freeship 15K',
    description: 'Hỗ trợ giao hàng đơn từ 149.000đ',
    value: 15000,
    voucherCode: 'FREESHIPTRANG',
    minOrderValue: 149000,
    iconName: 'truck',
    themeColor: '#059669',
    weight: 25,
  },
  {
    id: 'tt_pts_50',
    type: 'POINTS',
    name: '+50 Điểm Thưởng Phá Cỗ',
    badge: '+50 Điểm',
    description: 'Tích lũy điểm tiêu dùng OCOP Rewards',
    value: 50,
    points: 50,
    iconName: 'coins',
    themeColor: '#F59E0B',
    weight: 20,
  },
  {
    id: 'tt_vch_50k',
    type: 'VOUCHER',
    name: 'Mâm Cỗ Đoàn Viên 50.000đ',
    badge: 'Voucher 50K',
    description: 'Áp dụng cho đơn hàng từ 499.000đ',
    value: 50000,
    voucherCode: 'DOANVIEN50K',
    minOrderValue: 499000,
    iconName: 'ticket',
    themeColor: '#4F46E5',
    weight: 10,
  },
  {
    id: 'tt_pts_100',
    type: 'POINTS',
    name: '+100 Điểm Trăng Rằm OCOP',
    badge: '+100 Điểm',
    description: 'Nhân đôi may mắn vào ví điểm tích lũy',
    value: 100,
    points: 100,
    iconName: 'coins',
    themeColor: '#7C3AED',
    weight: 10,
  },
  {
    id: 'tt_wish_doanvien',
    type: 'WISH',
    name: 'Lời Chúc Tết Trung Thu Đoàn Viên',
    badge: 'Lời Chúc Ấm Áp',
    description: 'Kèm mã voucher an ủi 10.000đ cho đơn từ 99.000đ',
    value: 10000,
    voucherCode: 'TRUNGTHU10K',
    minOrderValue: 99000,
    iconName: 'sparkles',
    themeColor: '#F59E0B',
    weight: 10,
  },
];

/**
 * Danh sách 8 ô trên Vòng Quay OCOP
 * Mỗi lát cắt được thiết kế màu sắc tương phản sắc nét & trọng số tối ưu
 */
export const LUCKY_WHEEL_REWARDS: MinigameReward[] = [
  {
    id: 'whl_vch_30k',
    type: 'VOUCHER',
    name: 'Voucher OCOP 30.000đ',
    badge: '30K',
    description: 'Áp dụng cho đơn hàng từ 250.000đ',
    value: 30000,
    voucherCode: 'OCOP30K',
    minOrderValue: 250000,
    iconName: 'ticket',
    themeColor: '#EF4444',
    weight: 10, // Giảm từ 20 xuống 10%
  },
  {
    id: 'whl_ship_20k',
    type: 'FREESHIP',
    name: 'Freeship Toàn Quốc 20.000đ',
    badge: 'Ship 20K',
    description: 'Giảm phí giao hàng đơn từ 180.000đ',
    value: 20000,
    voucherCode: 'FREESHIP20',
    minOrderValue: 180000,
    iconName: 'truck',
    themeColor: '#10B981',
    weight: 20,
  },
  {
    id: 'whl_pts_30',
    type: 'POINTS',
    name: '+30 Điểm Thưởng OCOP',
    badge: '+30 Xu',
    description: 'Tích lũy vào tài khoản khách hàng thân thiết',
    value: 30,
    points: 30,
    iconName: 'coins',
    themeColor: '#F59E0B',
    weight: 20,
  },
  {
    id: 'whl_vch_15k',
    type: 'VOUCHER',
    name: 'Voucher Nông Sản 15.000đ',
    badge: '15K',
    description: 'Áp dụng cho đơn hàng từ 120.000đ',
    value: 15000,
    voucherCode: 'OCOP15K',
    minOrderValue: 120000,
    iconName: 'ticket',
    themeColor: '#3B82F6',
    weight: 15,
  },
  {
    id: 'whl_pts_88',
    type: 'POINTS',
    name: '+88 Điểm Phát Tài OCOP',
    badge: '+88 Xu',
    description: 'Con số may mắn tích điểm đổi quà',
    value: 88,
    points: 88,
    iconName: 'coins',
    themeColor: '#8B5CF6',
    weight: 12,
  },
  {
    id: 'whl_vch_70k',
    type: 'VOUCHER',
    name: 'Mega Voucher 70.000đ',
    badge: '70K',
    description: 'Đặc quyền đơn hàng từ 699.000đ',
    value: 70000,
    voucherCode: 'MEGA70K',
    minOrderValue: 699000,
    iconName: 'ticket',
    themeColor: '#EC4899',
    weight: 2, // Giảm từ 6 xuống 2%
  },
  {
    id: 'whl_wish_may_man',
    type: 'WISH',
    name: 'Chúc Bạn May Mắn Lần Sau',
    badge: 'Chúc May Mắn',
    description: 'Tặng mã voucher hỗ trợ 10K đơn từ 89K',
    value: 10000,
    voucherCode: 'MAYMAN10K',
    minOrderValue: 89000,
    iconName: 'sparkles',
    themeColor: '#6B7280',
    weight: 20, // Tăng mạnh từ 5 lên 20%
  },
  {
    id: 'whl_vch_100k',
    type: 'VOUCHER',
    name: 'Giải Độc Đắc OCOP 100.000đ',
    badge: 'VIP 100K',
    description: 'Voucher cao cấp nhất cho đơn từ 999.000đ',
    value: 100000,
    voucherCode: 'VIP100K',
    minOrderValue: 999000,
    iconName: 'gift',
    themeColor: '#EAB308',
    weight: 1, // Giảm từ 2 xuống 1%
  },
];

/**
 * Danh mục cấu hình Concept cho trò chơi Bốc Quà (Mystery Pick)
 * Thiết kế thích ứng với từng mùa lễ hội & chủ đề sự kiện
 */
export const MYSTERY_PICK_CONCEPTS: Record<
  Exclude<MysteryPickConceptId, 'AUTO'>,
  MysteryPickConceptConfig
> = {
  TRUNG_THU: {
    id: 'TRUNG_THU',
    tabLabel: 'Bánh Trung Thu',
    gameTitle: 'Bốc Bánh Trung Thu May Mắn',
    gameSubtitle:
      'Chọn 1 chiếc bánh trung thu để bẻ bánh khám phá nhân thơm ngon chứa voucher và điểm thưởng OCOP',
    actionLabel: 'Bốc bánh',
    spinningLabel: 'Đang mở bánh...',
    randomButtonLabel: 'Bốc ngẫu nhiên 1 chiếc bánh',
    summaryText: 'Cơ cấu quà: Voucher Trăng Vàng 20K, Freeship 15K, Đại Lộc Mâm Cỗ 50K, Điểm OCOP.',
    badgeText: 'Đêm Hội Trăng Rằm',
    primaryColor: '#4F46E5',
    secondaryColor: '#F59E0B',
    accentColor: '#FEFCE8',
    surfaceBgClass: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-amber-950 text-white',
    cardActiveBorderClass:
      'border-amber-300 ring-4 ring-amber-400/50 bg-gradient-to-b from-indigo-800 via-purple-900 to-amber-900',
    cardGradientClass:
      'border-amber-400/30 bg-gradient-to-b from-slate-900 via-indigo-950 to-amber-950/80 hover:border-amber-300',
    defaultItems: [
      {
        id: 0,
        name: 'Bánh Nướng Thập Cẩm',
        subTitle: 'Nhân Bát Bửu Trứng Muối',
        badge: 'Thập Cẩm',
        character: '月',
        iconType: 'moon',
      },
      {
        id: 1,
        name: 'Bánh Dẻo Hạt Sen',
        subTitle: 'Hạt Sen Trà Xanh Dẻo Thơm',
        badge: 'Hạt Sen',
        character: '圓',
        iconType: 'moon',
      },
      {
        id: 2,
        name: 'Bánh Nướng Đậu Xanh',
        subTitle: 'Đậu Xanh Hoàng Kim',
        badge: 'Đậu Xanh',
        character: '秋',
        iconType: 'moon',
      },
      {
        id: 3,
        name: 'Bánh Nướng Khoai Môn',
        subTitle: 'Khoai Môn Hạt Dưa Bùi Béo',
        badge: 'Khoai Môn',
        character: '和',
        iconType: 'moon',
      },
      {
        id: 4,
        name: 'Bánh Dẻo Cốm Non',
        subTitle: 'Cốm Làng Vòng Tinh Hoa',
        badge: 'Cốm Non',
        character: '美',
        iconType: 'moon',
      },
      {
        id: 5,
        name: 'Bánh Nướng Thượng Hạng',
        subTitle: 'Sò Điệp Vi Cá OCOP',
        badge: 'Đặc Biệt',
        character: '福',
        iconType: 'moon',
      },
    ],
    defaultRewards: TRUNG_THU_REWARDS,
  },
  TET_NGUYEN_DAN: {
    id: 'TET_NGUYEN_DAN',
    tabLabel: 'Bốc Lì Xì',
    gameTitle: 'Bốc Bao Lì Xì May Mắn',
    gameSubtitle: 'Chọn 1 phong bao lì xì đỏ thắm để mở ra voucher và điểm thưởng OCOP',
    actionLabel: 'Mở bao',
    spinningLabel: 'Đang mở bao...',
    randomButtonLabel: 'Bốc ngẫu nhiên 1 bao',
    summaryText: 'Cơ cấu quà: Voucher 20K, Freeship 15K, Lộc Phát 50K, Đại Lộc 100K và Điểm OCOP.',
    badgeText: 'Tết & Xuân Sum Vầy',
    primaryColor: '#DC2626',
    secondaryColor: '#F59E0B',
    accentColor: '#FEF2F2',
    surfaceBgClass: 'bg-gradient-to-b from-red-950 via-slate-900 to-amber-950 text-white',
    cardActiveBorderClass:
      'border-amber-300 ring-4 ring-amber-400/50 bg-gradient-to-b from-red-600 via-red-700 to-amber-800',
    cardGradientClass:
      'border-amber-500/40 bg-gradient-to-b from-red-700 via-red-800 to-red-900 hover:border-amber-300',
    defaultItems: [
      {
        id: 0,
        name: 'Bao Lộc Phát',
        subTitle: 'Bao số 1',
        badge: 'Phát Tài',
        character: '發',
        iconType: 'envelope',
      },
      {
        id: 1,
        name: 'Bao Tấn Tài',
        subTitle: 'Bao số 2',
        badge: 'Tấn Lộc',
        character: '財',
        iconType: 'envelope',
      },
      {
        id: 2,
        name: 'Bao Như Ý',
        subTitle: 'Bao số 3',
        badge: 'Vạn Sự',
        character: '祥',
        iconType: 'envelope',
      },
      {
        id: 3,
        name: 'Bao Cát Tường',
        subTitle: 'Bao số 4',
        badge: 'Cát Tường',
        character: '吉',
        iconType: 'envelope',
      },
      {
        id: 4,
        name: 'Bao Bình An',
        subTitle: 'Bao số 5',
        badge: 'Gia Đạo',
        character: '安',
        iconType: 'envelope',
      },
      {
        id: 5,
        name: 'Bao Thịnh Vượng',
        subTitle: 'Bao số 6',
        badge: 'Đại Cát',
        character: '福',
        iconType: 'envelope',
      },
    ],
    defaultRewards: LUCKY_ENVELOPE_REWARDS,
  },
  MUA_VANG: {
    id: 'MUA_VANG',
    tabLabel: 'Nông Sản Vàng',
    gameTitle: 'Thu Hoạch Nông Sản Vàng',
    gameSubtitle:
      'Chọn 1 thức quà nông sản đặc sản để thu hoạch lộc mùa vàng cùng voucher mua sắm OCOP',
    actionLabel: 'Thu hoạch',
    spinningLabel: 'Đang thu hoạch...',
    randomButtonLabel: 'Thu hoạch ngẫu nhiên 1 thức quà',
    summaryText:
      'Cơ cấu quà: Voucher Mùa Vàng 20K, Freeship Bội Thu 15K, Đại Lộc 50K và Điểm OCOP.',
    badgeText: 'Mùa Vàng Bội Thu',
    primaryColor: '#D97706',
    secondaryColor: '#16A34A',
    accentColor: '#FFFBEB',
    surfaceBgClass: 'bg-gradient-to-b from-amber-950 via-slate-900 to-emerald-950 text-white',
    cardActiveBorderClass:
      'border-amber-300 ring-4 ring-amber-400/50 bg-gradient-to-b from-amber-600 via-amber-700 to-emerald-800',
    cardGradientClass:
      'border-amber-500/30 bg-gradient-to-b from-amber-800 via-amber-900 to-slate-900 hover:border-amber-300',
    defaultItems: [
      {
        id: 0,
        name: 'Bó Lúa Vàng ST25',
        subTitle: 'Gạo Ngon Nhất Thế Giới',
        badge: 'Hạt Ngọc',
        character: '稻',
        iconType: 'wheat',
      },
      {
        id: 1,
        name: 'Mật Ong Rừng U Minh',
        subTitle: 'Hương Hoa Tràm Tinh Khiết',
        badge: 'Hổ Phách',
        character: '蜜',
        iconType: 'gift',
      },
      {
        id: 2,
        name: 'Trà Shan Tuyết Cổ Thụ',
        subTitle: 'Đỉnh Núi Cao Tây Bắc',
        badge: 'Tinh Hoa',
        character: '茶',
        iconType: 'gift',
      },
      {
        id: 3,
        name: 'Giỏ Trái Cây Miệt Vườn',
        subTitle: 'Chín Mọng Ngọt Lành Miền Tây',
        badge: 'Tươi Ngon',
        character: '果',
        iconType: 'gift',
      },
      {
        id: 4,
        name: 'Hạt Điều Rang Củi',
        subTitle: 'Đặc Sản Giòn Ngon Bình Phước',
        badge: 'Bùi Béo',
        character: '穀',
        iconType: 'gift',
      },
      {
        id: 5,
        name: 'Nước Mắm Cốt Nhĩ',
        subTitle: 'Đặc Sản Cốt Than Phú Quốc',
        badge: 'Đậm Đà',
        character: '香',
        iconType: 'gift',
      },
    ],
    defaultRewards: LUCKY_ENVELOPE_REWARDS,
  },
  MEGA_SALE: {
    id: 'MEGA_SALE',
    tabLabel: 'Hộp Quà Bí Ẩn',
    gameTitle: 'Mở Hộp Quà Bí Ẩn (Mystery Box)',
    gameSubtitle:
      'Khám phá 1 chiếc hộp quà thần bí để kích hoạt siêu voucher sale và freeship toàn sàn',
    actionLabel: 'Mở hộp',
    spinningLabel: 'Đang mở hộp...',
    randomButtonLabel: 'Mở ngẫu nhiên 1 hộp quà',
    summaryText: 'Cơ cấu quà: Siêu Voucher 70K, Deal Chớp Nhoáng 50K, Freeship 20K và Điểm OCOP.',
    badgeText: 'Mega Sale & Flash Sale',
    primaryColor: '#7C3AED',
    secondaryColor: '#E11D48',
    accentColor: '#FAF5FF',
    surfaceBgClass: 'bg-gradient-to-b from-purple-950 via-slate-900 to-rose-950 text-white',
    cardActiveBorderClass:
      'border-pink-400 ring-4 ring-purple-400/50 bg-gradient-to-b from-purple-600 via-pink-600 to-rose-700',
    cardGradientClass:
      'border-purple-500/30 bg-gradient-to-b from-slate-900 via-purple-950 to-rose-950 hover:border-pink-400',
    defaultItems: [
      {
        id: 0,
        name: 'Hộp Kim Cương Mega',
        subTitle: 'Bí Ẩn Cực Phẩm Độc Quyền',
        badge: 'VIP Mega',
        character: 'VIP',
        iconType: 'gift',
      },
      {
        id: 1,
        name: 'Hộp Hoàng Gia Săn Sale',
        subTitle: 'Voucher Siêu Khủng Chớp Nhoáng',
        badge: 'Hoàng Gia',
        character: 'PRO',
        iconType: 'gift',
      },
      {
        id: 2,
        name: 'Hộp Thần Tài Phát Lộc',
        subTitle: 'Tích Lũy Xu OCOP Khổng Lồ',
        badge: 'Tài Lộc',
        character: 'GOLD',
        iconType: 'gift',
      },
      {
        id: 3,
        name: 'Hộp Neon Bùng Nổ',
        subTitle: 'Freeship Toàn Quốc Không Giới Hạn',
        badge: 'Neon Deal',
        character: 'FLASH',
        iconType: 'gift',
      },
      {
        id: 4,
        name: 'Hộp May Mắn OCOP',
        subTitle: 'Ưu Đãi Đặc Sản Địa Phương',
        badge: 'May Mắn',
        character: 'TOP',
        iconType: 'gift',
      },
      {
        id: 5,
        name: 'Hộp Vô Cực Huyền Bí',
        subTitle: 'Bất Ngờ Giảm Giá Trực Tiếp',
        badge: 'Vô Cực',
        character: 'MAX',
        iconType: 'gift',
      },
    ],
    defaultRewards: LUCKY_ENVELOPE_REWARDS,
  },
  GIANG_SINH: {
    id: 'GIANG_SINH',
    tabLabel: 'Quà Giáng Sinh',
    gameTitle: 'Mở Quà Giáng Sinh Diệu Kỳ',
    gameSubtitle:
      'Chọn 1 món quà dưới cây thông noel để rinh về voucher ấm áp và điểm thưởng diệu kỳ',
    actionLabel: 'Mở quà',
    spinningLabel: 'Đang mở quà...',
    randomButtonLabel: 'Mở ngẫu nhiên 1 món quà',
    summaryText:
      'Cơ cấu quà: Voucher Giáng Sinh 20K, Freeship Mùa Đông 15K, Quà Noel 50K và Điểm OCOP.',
    badgeText: 'Giáng Sinh & Năm Mới',
    primaryColor: '#B91C1C',
    secondaryColor: '#047857',
    accentColor: '#F0FDF4',
    surfaceBgClass: 'bg-gradient-to-b from-red-950 via-slate-900 to-emerald-950 text-white',
    cardActiveBorderClass:
      'border-emerald-300 ring-4 ring-emerald-400/50 bg-gradient-to-b from-red-600 via-rose-700 to-emerald-800',
    cardGradientClass:
      'border-emerald-500/30 bg-gradient-to-b from-slate-900 via-red-950 to-emerald-950 hover:border-emerald-300',
    defaultItems: [
      {
        id: 0,
        name: 'Chiếc Tất Đỏ May Mắn',
        subTitle: 'Treo Lò Sưởi Đêm Giáng Sinh',
        badge: 'Tất Quà',
        character: 'XMAS',
        iconType: 'snowflake',
      },
      {
        id: 1,
        name: 'Hộp Quà Nơ Vàng',
        subTitle: 'Gói Ghém Yêu Thương Ấm Áp',
        badge: 'Hộp Nơ',
        character: 'GIFT',
        iconType: 'gift',
      },
      {
        id: 2,
        name: 'Quả Cầu Tuyết Pha Lê',
        subTitle: 'Bông Tuyết Rơi Diệu Kỳ',
        badge: 'Pha Lê',
        character: 'SNOW',
        iconType: 'snowflake',
      },
      {
        id: 3,
        name: 'Chuông Vàng Giáng Sinh',
        subTitle: 'Ngân Vang Giai Điệu An Lành',
        badge: 'Chuông Ngân',
        character: 'BELL',
        iconType: 'award',
      },
      {
        id: 4,
        name: 'Bánh Gừng Mật Ong',
        subTitle: 'Hương Thơm Nồng Lễ Hội Mùa Đông',
        badge: 'Bánh Gừng',
        character: 'SWEET',
        iconType: 'gift',
      },
      {
        id: 5,
        name: 'Ngôi Sao Đỉnh Thông',
        subTitle: 'Tỏa Sáng Hy Vọng & May Mắn',
        badge: 'Ngôi Sao',
        character: 'STAR',
        iconType: 'award',
      },
    ],
    defaultRewards: LUCKY_ENVELOPE_REWARDS,
  },
  DAI_LE: {
    id: 'DAI_LE',
    tabLabel: 'Hộp Quà Bản Sắc',
    gameTitle: 'Hộp Quà Tự Hào Non Sông',
    gameSubtitle: 'Chọn 1 biểu trưng văn hóa Việt Nam để nhận mã giảm giá tri ân ngày lễ lớn',
    actionLabel: 'Mở quà',
    spinningLabel: 'Đang mở...',
    randomButtonLabel: 'Mở ngẫu nhiên 1 biểu trưng',
    summaryText: 'Cơ cấu quà: Voucher Tri Ân 20K, Freeship Non Sông 15K, Đại Lộc 50K và Điểm OCOP.',
    badgeText: 'Đại Lễ & Tự Hào Bản Sắc',
    primaryColor: '#B91C1C',
    secondaryColor: '#D97706',
    accentColor: '#FFF1F2',
    surfaceBgClass: 'bg-gradient-to-b from-red-950 via-slate-900 to-amber-950 text-white',
    cardActiveBorderClass:
      'border-yellow-300 ring-4 ring-yellow-400/50 bg-gradient-to-b from-red-600 via-rose-700 to-amber-700',
    cardGradientClass:
      'border-amber-500/30 bg-gradient-to-b from-slate-900 via-red-950 to-amber-950 hover:border-yellow-300',
    defaultItems: [
      {
        id: 0,
        name: 'Trống Đồng Đông Sơn',
        subTitle: 'Hào Khí Bốn Nghìn Năm Lịch Sử',
        badge: 'Đông Sơn',
        character: '鼓',
        iconType: 'award',
      },
      {
        id: 1,
        name: 'Hoa Sen Tháp Mười',
        subTitle: 'Quốc Hoa Tinh Khiết Thanh Cao',
        badge: 'Hoa Sen',
        character: '蓮',
        iconType: 'award',
      },
      {
        id: 2,
        name: 'Cờ Đỏ Sao Vàng',
        subTitle: 'Tự Hào Non Sông Gấm Vóc',
        badge: 'Tự Hào',
        character: '星',
        iconType: 'award',
      },
      {
        id: 3,
        name: 'Nón Lá Quê Hương',
        subTitle: 'Duyên Dáng Nét Đẹp Việt Nam',
        badge: 'Nón Lá',
        character: '笠',
        iconType: 'award',
      },
      {
        id: 4,
        name: 'Khuê Văn Các',
        subTitle: 'Biểu Tượng Trí Tuệ Ngàn Năm',
        badge: 'Văn Hiến',
        character: '閣',
        iconType: 'award',
      },
      {
        id: 5,
        name: 'Cầu Rồng Đà Nẵng',
        subTitle: 'Khát Vọng Vươn Cao Thời Đại Mới',
        badge: 'Vươn Mình',
        character: '龍',
        iconType: 'award',
      },
    ],
    defaultRewards: LUCKY_ENVELOPE_REWARDS,
  },
  CUSTOM: {
    id: 'CUSTOM',
    tabLabel: 'Bốc Quà',
    gameTitle: 'Bốc Quà May Mắn OCOP',
    gameSubtitle: 'Chọn 1 phần quà để khám phá ưu đãi bất ngờ từ sự kiện',
    actionLabel: 'Mở quà',
    spinningLabel: 'Đang mở quà...',
    randomButtonLabel: 'Mở ngẫu nhiên 1 phần quà',
    summaryText: 'Cơ cấu quà: Voucher giảm giá, Freeship và Điểm thưởng tích lũy OCOP.',
    badgeText: 'Minigame Sự Kiện',
    primaryColor: '#059669',
    secondaryColor: '#D97706',
    accentColor: '#F0FDF4',
    surfaceBgClass: 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white',
    cardActiveBorderClass:
      'border-amber-300 ring-4 ring-amber-400/50 bg-gradient-to-b from-slate-800 via-amber-900 to-slate-900',
    cardGradientClass:
      'border-slate-700 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 hover:border-amber-400',
    defaultItems: [
      {
        id: 0,
        name: 'Hộp Quà Số 1',
        subTitle: 'Bí ẩn tài lộc',
        badge: 'Quà Tặng',
        character: '1',
        iconType: 'gift',
      },
      {
        id: 1,
        name: 'Hộp Quà Số 2',
        subTitle: 'Bí ẩn may mắn',
        badge: 'Quà Tặng',
        character: '2',
        iconType: 'gift',
      },
      {
        id: 2,
        name: 'Hộp Quà Số 3',
        subTitle: 'Bí ẩn hạnh phúc',
        badge: 'Quà Tặng',
        character: '3',
        iconType: 'gift',
      },
      {
        id: 3,
        name: 'Hộp Quà Số 4',
        subTitle: 'Bí ẩn thành công',
        badge: 'Quà Tặng',
        character: '4',
        iconType: 'gift',
      },
      {
        id: 4,
        name: 'Hộp Quà Số 5',
        subTitle: 'Bí ẩn thịnh vượng',
        badge: 'Quà Tặng',
        character: '5',
        iconType: 'gift',
      },
      {
        id: 5,
        name: 'Hộp Quà Số 6',
        subTitle: 'Bí ẩn an khang',
        badge: 'Quà Tặng',
        character: '6',
        iconType: 'gift',
      },
    ],
    defaultRewards: LUCKY_ENVELOPE_REWARDS,
  },
};

export interface ResolveMysteryPickOptions {
  minigameConcept?: MysteryPickConceptId | null;
  conceptId?: string | null;
  themeCode?: string | null;
  eventType?: string | null;
  slug?: string | null;
}

/**
 * Tự động phân giải Mystery Pick Concept dựa trên cấu hình ghi đè hoặc tự động suy luận theo Theme sự kiện
 */
export function resolveMysteryPickConcept({
  minigameConcept,
  conceptId,
  themeCode,
  eventType,
  slug,
}: ResolveMysteryPickOptions): MysteryPickConceptConfig {
  if (
    minigameConcept &&
    minigameConcept !== 'AUTO' &&
    MYSTERY_PICK_CONCEPTS[minigameConcept as Exclude<MysteryPickConceptId, 'AUTO'>]
  ) {
    return MYSTERY_PICK_CONCEPTS[minigameConcept as Exclude<MysteryPickConceptId, 'AUTO'>];
  }

  // Tự động suy luận theo Concept ID, Theme Code, Event Type, hoặc Slug
  const normalizedConcept = (conceptId || '').toUpperCase();
  const normalizedTheme = (themeCode || '').toLowerCase();
  const normalizedSlug = (slug || '').toLowerCase();

  if (
    normalizedConcept === 'TRUNG_THU' ||
    normalizedTheme.includes('trung_thu') ||
    normalizedSlug.includes('trung-thu') ||
    normalizedSlug.includes('trang-ram')
  ) {
    return MYSTERY_PICK_CONCEPTS.TRUNG_THU;
  }

  if (
    normalizedConcept === 'MUA_VANG' ||
    normalizedTheme.includes('mua_vang') ||
    normalizedTheme.includes('ocop_xanh') ||
    normalizedSlug.includes('mua-vang') ||
    normalizedSlug.includes('nong-san')
  ) {
    return MYSTERY_PICK_CONCEPTS.MUA_VANG;
  }

  if (
    normalizedConcept === 'MEGA_SALE' ||
    normalizedTheme.includes('sieu_sale') ||
    eventType === 'COMMERCE' ||
    normalizedSlug.includes('sale') ||
    normalizedSlug.includes('khuyen-mai')
  ) {
    return MYSTERY_PICK_CONCEPTS.MEGA_SALE;
  }

  if (
    normalizedConcept === 'GIANG_SINH' ||
    normalizedTheme.includes('giang_sinh') ||
    normalizedSlug.includes('noel') ||
    normalizedSlug.includes('giang-sinh')
  ) {
    return MYSTERY_PICK_CONCEPTS.GIANG_SINH;
  }

  if (
    normalizedConcept === 'DAI_LE' ||
    normalizedTheme.includes('le_hoi_viet') ||
    eventType === 'CULTURAL'
  ) {
    return MYSTERY_PICK_CONCEPTS.DAI_LE;
  }

  return MYSTERY_PICK_CONCEPTS.TET_NGUYEN_DAN;
}
