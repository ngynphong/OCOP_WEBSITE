export type EventType = 'SEASONAL' | 'CULTURAL' | 'COMMERCE' | 'REGIONAL' | 'COMMUNITY';

export interface EventTypeConfig {
  id: EventType;
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
}

export const EVENT_TYPE_CONFIG: Record<EventType, EventTypeConfig> = {
  SEASONAL: {
    id: 'SEASONAL',
    label: 'Theo mùa',
    shortLabel: 'Theo mùa',
    description: 'Theo mùa (Tết, Trung Thu, Noel...)',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
  },
  CULTURAL: {
    id: 'CULTURAL',
    label: 'Lễ hội / Văn hóa',
    shortLabel: 'Văn hóa',
    description: 'Lễ hội / Văn hóa (2/9, 30/4, Giỗ Tổ...)',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
  },
  COMMERCE: {
    id: 'COMMERCE',
    label: 'Thương mại số',
    shortLabel: 'Thương mại',
    description: 'Thương mại số (Mega Sale, 11.11, Flash Sale...)',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
  },
  REGIONAL: {
    id: 'REGIONAL',
    label: 'Tuần lễ vùng miền',
    shortLabel: 'Vùng miền',
    description: 'Tuần lễ vùng miền (Tây Bắc, Miền Tây, Tây Nguyên...)',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  },
  COMMUNITY: {
    id: 'COMMUNITY',
    label: 'Cộng đồng',
    shortLabel: 'Cộng đồng',
    description: 'Cộng đồng (Nông sản xanh, Sống khỏe...)',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200/80',
  },
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  SEASONAL: 'Theo mùa',
  CULTURAL: 'Lễ hội / Văn hóa',
  COMMERCE: 'Thương mại số',
  REGIONAL: 'Tuần lễ vùng miền',
  COMMUNITY: 'Cộng đồng',
};

export function getEventTypeLabel(type?: string | null): string {
  if (!type) return 'Chưa phân loại';
  return EVENT_TYPE_LABELS[type as EventType] || type;
}

export function getEventTypeBadgeClass(type?: string | null): string {
  if (!type) return 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    EVENT_TYPE_CONFIG[type as EventType]?.badgeClass || 'bg-gray-100 text-gray-600 border-gray-200'
  );
}

export type CampaignEventStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'LIVE'
  | 'ENDING'
  | 'ENDED'
  | 'ARCHIVED'
  | 'PAUSED';

export type EventRegistrationStatus = 'HIDDEN' | 'UPCOMING' | 'OPEN' | 'CLOSED';

export type EventSectionType =
  | 'HERO'
  | 'COUNTDOWN'
  | 'PRODUCT_GRID'
  | 'COLLECTION'
  | 'FLASH_SALE'
  | 'VOUCHER'
  | 'STORY'
  | 'CUSTOM';

export type ConceptPackId =
  | 'TET_NGUYEN_DAN'
  | 'TRUNG_THU'
  | 'MUA_VANG'
  | 'DAI_LE'
  | 'MEGA_SALE'
  | 'GIANG_SINH'
  | 'CUSTOM'
  | 'NONE';

export type AtmosphereEffectType =
  | 'apricot_petals'
  | 'peach_petals'
  | 'golden_leaves'
  | 'starlight'
  | 'confetti'
  | 'snowflakes'
  | 'none';

export interface EventThemeDecorations {
  conceptId: ConceptPackId;
  enableAtmosphere: boolean;
  atmosphereType?: AtmosphereEffectType;
  enableCornerStickers: boolean;
  customStickerLeftUrl?: string;
  customStickerRightUrl?: string;
}

export interface EventTheme {
  id?: number;
  name: string;
  code: string;
  colorsJson?: string;
  typographyJson?: string;
  decorationsJson?: string;
  assetsJson?: string;
  cssVariablesJson?: string;
}

export interface EventSection {
  id?: number;
  type: EventSectionType;
  sortOrder: number;
  title?: string;
  configJson?: string;
  isVisible: boolean;
}

export interface EventResponse {
  id: number;
  code: string;
  name: string;
  slug: string;
  description?: string;
  type: EventType;
  status: CampaignEventStatus;
  startAt: string;
  endAt: string;
  sellerPortalVisible: boolean;
  registrationStartAt?: string;
  registrationEndAt?: string;
  minOcopStar: number;
  minDiscountPercent: number;
  maxProductsPerShop: number;
  sellerRegistrationStatus: EventRegistrationStatus;
  isHomeFeatured: boolean;
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
  backgroundUrl?: string;
  themeName?: string;
  themeId?: number;
  sectionCount: number;
  createdAt: string;
  updatedAt: string;
}

import type {
  MysteryPickConceptId,
  MysteryPickItem,
  MysteryPickConceptConfig,
} from './eventMinigameTypes';

export interface EventMinigameConfigInput {
  gameType?: 'WHEEL_SPIN' | 'LUCKY_ENVELOPE';
  isActive?: boolean;
  freeSpinsPerDay?: number;
  minOrderValueForBonusSpin?: number;
  spinsPerOrder?: number;
  budgetLimit?: number;
  rewardsJson?: string;
  mysteryPickConcept?: MysteryPickConceptId;
  customPickTitle?: string;
  customPickSubtitle?: string;
  customPickItemsJson?: string;
}

export interface EventMinigameConfigDetail {
  id?: number;
  eventId?: number;
  eventSlug?: string;
  gameType: 'WHEEL_SPIN' | 'LUCKY_ENVELOPE';
  isActive: boolean;
  freeSpinsPerDay: number;
  minOrderValueForBonusSpin: number;
  spinsPerOrder: number;
  budgetLimit?: number;
  totalClaimedValue?: number;
  rewardsJson?: string;
  mysteryPickConcept?: MysteryPickConceptId;
  customPickTitle?: string;
  customPickSubtitle?: string;
  customPickItemsJson?: string;
  pickItems?: MysteryPickItem[];
  conceptConfig?: MysteryPickConceptConfig;
}

export interface EventDetailResponse {
  id: number;
  code: string;
  name: string;
  slug: string;
  description?: string;
  type: EventType;
  status: CampaignEventStatus;
  startAt: string;
  endAt: string;
  sellerPortalVisible: boolean;
  registrationStartAt?: string;
  registrationEndAt?: string;
  minOcopStar: number;
  minDiscountPercent: number;
  maxProductsPerShop: number;
  sellerRegistrationStatus: EventRegistrationStatus;
  isHomeFeatured: boolean;
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
  backgroundUrl?: string;
  theme?: EventTheme;
  sections?: EventSection[];
  minigameConfig?: EventMinigameConfigDetail;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveEventResponse {
  id: number;
  code: string;
  name: string;
  slug: string;
  description?: string;
  type: EventType;
  status: CampaignEventStatus;
  startAt: string;
  endAt: string;
  sellerPortalVisible?: boolean;
  registrationStartAt?: string;
  registrationEndAt?: string;
  minOcopStar?: number;
  minDiscountPercent?: number;
  maxProductsPerShop?: number;
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
  backgroundUrl?: string;
  theme?: EventTheme;
  sections?: EventSection[];
}

export interface CreateEventInput {
  code: string;
  name: string;
  slug: string;
  description?: string;
  type: EventType;
  startAt: string;
  endAt: string;
  sellerPortalVisible?: boolean;
  registrationStartAt?: string;
  registrationEndAt?: string;
  minOcopStar?: number;
  minDiscountPercent?: number;
  maxProductsPerShop?: number;
  themeId?: number;
  theme?: {
    name: string;
    code: string;
    colorsJson?: string;
    typographyJson?: string;
    decorationsJson?: string;
    assetsJson?: string;
    cssVariablesJson?: string;
  };
  isHomeFeatured?: boolean;
  bannerDesktopUrl?: string;
  bannerMobileUrl?: string;
  backgroundUrl?: string;
  sections?: Array<{
    type: EventSectionType;
    sortOrder: number;
    title?: string;
    configJson?: string;
    isVisible?: boolean;
  }>;
  minigameConfig?: EventMinigameConfigInput;
}

export type UpdateEventInput = CreateEventInput;

export interface MinigameAnalyticsDto {
  isActive: boolean;
  budgetLimit: number;
  totalClaimedValue: number;
  budgetBurnRate: number;
  totalSpins: number;
  totalWinners: number;
  freeSpinsPerDay?: number;
}

export interface EventTopProductDto {
  productId: number;
  productName: string;
  shopName: string;
  soldQty: number;
  totalRevenue: number;
}

export interface EventTopShopDto {
  shopId?: number;
  shopName: string;
  orderCount: number;
  totalRevenue: number;
}

export interface EventAnalyticsResponse {
  eventId: number;
  eventName: string;
  eventCode: string;
  status: CampaignEventStatus;
  totalGmv: number;
  totalOrders: number;
  totalParticipatingProducts: number;
  totalParticipatingShops: number;
  minigameStats?: MinigameAnalyticsDto | null;
  topProducts: EventTopProductDto[];
  topShops: EventTopShopDto[];
}
