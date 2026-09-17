import { publicAxiosClient, axiosClient } from '@/lib/axios';
import type { ResponseBase } from '@/features/auth/types';
import type {
  MinigameType,
  MinigameReward,
  MinigameHistoryEntry,
  MysteryPickConceptId,
  MysteryPickItem,
  MysteryPickConceptConfig,
} from '../types/eventMinigameTypes';

export interface EventMinigameConfigResponse {
  id: number;
  eventId: number;
  eventSlug: string;
  gameType: MinigameType;
  mysteryPickConcept?: MysteryPickConceptId;
  isActive: boolean;
  freeSpinsPerDay: number;
  minOrderValueForBonusSpin: number;
  spinsPerOrder: number;
  budgetLimit?: number;
  totalClaimedValue?: number;
  rewardsJson?: string;
  customPickTitle?: string;
  customPickSubtitle?: string;
  customPickItemsJson?: string;
  pickItems?: MysteryPickItem[];
  conceptConfig?: MysteryPickConceptConfig;
  rewards: MinigameReward[];
}

export interface EventMinigameConfigInput {
  gameType?: MinigameType;
  mysteryPickConcept?: MysteryPickConceptId;
  isActive?: boolean;
  freeSpinsPerDay?: number;
  minOrderValueForBonusSpin?: number;
  spinsPerOrder?: number;
  budgetLimit?: number;
  rewardsJson?: string;
  customPickTitle?: string;
  customPickSubtitle?: string;
  customPickItemsJson?: string;
}

export interface UserMinigameStatusResponse {
  spinsLeft: number;
  totalSpinsUsed: number;
  canClaimDaily: boolean;
  lastDailyClaimDate: string | null;
  recentHistory: MinigameHistoryEntry[];
}

export interface PlayMinigameResponse {
  reward: MinigameReward;
  sliceIndex: number;
  spinsLeft: number;
  wonAt: string;
  message: string;
}

export interface MinigameRecentWinner {
  maskedUser: string;
  rewardTitle: string;
  rewardType: string;
  wonAt: string;
}

export const eventMinigameApi = {
  // Public
  getConfig: async (slug: string, gameType: MinigameType): Promise<EventMinigameConfigResponse> => {
    const res = (await publicAxiosClient.get<ResponseBase<EventMinigameConfigResponse>>(
      `/events/${slug}/minigame/config`,
      {
        params: { gameType },
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<EventMinigameConfigResponse>;
    return res.data;
  },

  getRecentWinners: async (slug: string): Promise<MinigameRecentWinner[]> => {
    const res = (await publicAxiosClient.get<ResponseBase<MinigameRecentWinner[]>>(
      `/events/${slug}/minigame/recent-winners`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<MinigameRecentWinner[]>;
    return res.data;
  },

  // Authenticated (User)
  getUserStatus: async (slug: string): Promise<UserMinigameStatusResponse> => {
    const res = (await axiosClient.get<ResponseBase<UserMinigameStatusResponse>>(
      `/users/events/${slug}/minigame/status`,
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<UserMinigameStatusResponse>;
    return res.data;
  },

  claimDailySpin: async (slug: string): Promise<UserMinigameStatusResponse> => {
    const res = (await axiosClient.post<ResponseBase<UserMinigameStatusResponse>>(
      `/users/events/${slug}/minigame/daily-checkin`,
      {},
      {
        headers: { 'X-Silent-Loading': 'true' },
      },
    )) as unknown as ResponseBase<UserMinigameStatusResponse>;
    return res.data;
  },

  play: async (slug: string, gameType: MinigameType): Promise<PlayMinigameResponse> => {
    const res = (await axiosClient.post<ResponseBase<PlayMinigameResponse>>(
      `/users/events/${slug}/minigame/play`,
      { gameType },
    )) as unknown as ResponseBase<PlayMinigameResponse>;
    return res.data;
  },

  // Authenticated (Admin)
  getAdminConfig: async (eventId: number): Promise<EventMinigameConfigResponse> => {
    const res = (await axiosClient.get<ResponseBase<EventMinigameConfigResponse>>(
      `/admin/events/${eventId}/minigame-config`,
    )) as unknown as ResponseBase<EventMinigameConfigResponse>;
    return res.data;
  },

  saveAdminConfig: async (
    eventId: number,
    data: EventMinigameConfigInput,
  ): Promise<EventMinigameConfigResponse> => {
    const res = (await axiosClient.put<ResponseBase<EventMinigameConfigResponse>>(
      `/admin/events/${eventId}/minigame-config`,
      data,
    )) as unknown as ResponseBase<EventMinigameConfigResponse>;
    return res.data;
  },
};
