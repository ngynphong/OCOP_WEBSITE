export type EventType = 'SEASONAL' | 'CULTURAL' | 'COMMERCE' | 'REGIONAL' | 'COMMUNITY';

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
}

export type UpdateEventInput = CreateEventInput;
