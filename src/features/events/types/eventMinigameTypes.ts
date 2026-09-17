export type MinigameType = 'LUCKY_ENVELOPE' | 'WHEEL_SPIN';

export type MinigameRewardType = 'VOUCHER' | 'FREESHIP' | 'POINTS' | 'WISH';

export interface MinigameReward {
  id: string;
  type: MinigameRewardType;
  name: string;
  badge: string;
  description: string;
  value: number;
  voucherCode?: string;
  minOrderValue?: number;
  points?: number;
  iconName: 'ticket' | 'truck' | 'coins' | 'sparkles' | 'gift';
  themeColor: string;
  weight: number; // Tỷ lệ rơi (trọng số xác suất trúng)
}

export interface MinigameHistoryEntry {
  id: string;
  gameType: MinigameType;
  reward: MinigameReward;
  wonAt: string;
  copied?: boolean;
}

export interface MinigameUserState {
  spinsLeft: number;
  lastDailyClaim: string | null; // Format YYYY-MM-DD
  history: MinigameHistoryEntry[];
}

export type MysteryPickConceptId =
  | 'AUTO'
  | 'TRUNG_THU'
  | 'TET_NGUYEN_DAN'
  | 'MUA_VANG'
  | 'MEGA_SALE'
  | 'GIANG_SINH'
  | 'DAI_LE'
  | 'CUSTOM';

export interface MysteryPickItem {
  id: number;
  name: string;
  subTitle: string;
  badge?: string;
  character?: string;
  iconType?: 'moon' | 'envelope' | 'wheat' | 'gift' | 'snowflake' | 'award';
}

export interface MysteryPickConceptConfig {
  id: MysteryPickConceptId;
  tabLabel: string;
  gameTitle: string;
  gameSubtitle: string;
  actionLabel: string;
  spinningLabel: string;
  randomButtonLabel: string;
  summaryText: string;
  badgeText: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  surfaceBgClass: string;
  cardActiveBorderClass: string;
  cardGradientClass: string;
  defaultItems: MysteryPickItem[];
  defaultRewards?: MinigameReward[];
}
