'use client';

import { useState, useCallback, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { EventType, EventTheme, EventMinigameConfigDetail } from '../types/eventTypes';
import type {
  MinigameType,
  MinigameReward,
  MinigameHistoryEntry,
  MinigameUserState,
  MysteryPickConceptConfig,
} from '../types/eventMinigameTypes';
import {
  LUCKY_ENVELOPE_REWARDS,
  LUCKY_WHEEL_REWARDS,
  resolveMysteryPickConcept,
} from '../constants/minigamePresets';
import { eventMinigameApi, type UserMinigameStatusResponse } from '../api/eventMinigameApi';
import type { MinigameHistoryResponse } from '../api/eventMinigameApi';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';

function normalizeReward(
  raw: MinigameReward | (MinigameReward & { title?: string }),
): MinigameReward {
  const title = raw.name || (raw as { title?: string }).title || 'Phần thưởng may mắn';
  const type = raw.type || 'VOUCHER';
  const defaultColor =
    type === 'VOUCHER'
      ? '#EA580C'
      : type === 'FREESHIP'
        ? '#0284C7'
        : type === 'POINTS'
          ? '#059669'
          : '#7C3AED';

  return {
    ...raw,
    name: title,
    themeColor: raw.themeColor || defaultColor,
  };
}

interface UseEventMinigameOptions {
  eventId: number | string;
  eventSlug?: string;
  eventType?: EventType;
  theme?: EventTheme;
  minigameConfig?: EventMinigameConfigDetail;
}

const STORAGE_KEY_PREFIX = 'ocop_event_minigame_';
const MINIGAME_UPDATE_EVENT = 'ocop_minigame_storage_update';

function notifyMinigameUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(MINIGAME_UPDATE_EVENT));
  }
}

function subscribeMinigameStorage(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', onStoreChange);
  window.addEventListener(MINIGAME_UPDATE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener('storage', onStoreChange);
    window.removeEventListener(MINIGAME_UPDATE_EVENT, onStoreChange);
  };
}

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

function mapHistoryEntry(item: MinigameHistoryResponse): MinigameHistoryEntry {
  const isPoint = item.rewardType === 'POINT';
  const rewardType: MinigameReward['type'] = isPoint
    ? 'POINTS'
    : (item.rewardType as Exclude<MinigameReward['type'], 'POINTS'>);
  const value = Number(item.rewardValue || 0);

  return {
    id: String(item.id),
    gameType: item.gameType || 'WHEEL_SPIN',
    reward: {
      id: `h_${item.id}`,
      type: rewardType,
      name: item.rewardTitle || 'Phần thưởng OCOP',
      badge: item.rewardTitle || '',
      description: '',
      value,
      points: isPoint ? value : undefined,
      voucherCode: item.voucherCode || undefined,
      minOrderValue: item.minOrderValue ? Number(item.minOrderValue) : undefined,
      iconName: isPoint
        ? 'coins'
        : item.rewardType === 'FREESHIP'
          ? 'truck'
          : item.rewardType === 'VOUCHER'
            ? 'ticket'
            : 'sparkles',
      themeColor: '#D97706',
      weight: 1,
    },
    wonAt: item.wonAt || new Date().toISOString(),
  };
}

function toHistoryResponse(entry: MinigameHistoryEntry): MinigameHistoryResponse {
  return {
    id: entry.id,
    gameType: entry.gameType,
    rewardType: entry.reward.type === 'POINTS' ? 'POINT' : entry.reward.type,
    rewardTitle: entry.reward.name,
    rewardValue: entry.reward.value,
    voucherCode: entry.reward.voucherCode,
    minOrderValue: entry.reward.minOrderValue,
    wonAt: entry.wonAt,
  };
}

export function useEventMinigame({
  eventId,
  eventSlug,
  eventType,
  theme,
  minigameConfig,
}: UseEventMinigameOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { subject: userSubject, isAuthenticated } = useAppSelector((state) => state.auth);
  const decorationsJson = theme?.decorationsJson;
  const themeCode = theme?.code;
  const decorationConceptId = useMemo(() => {
    if (!decorationsJson) return null;
    try {
      const parsed = JSON.parse(decorationsJson);
      return parsed.conceptId || null;
    } catch {
      return null;
    }
  }, [decorationsJson]);

  const mysteryPickConceptConfig = useMemo<MysteryPickConceptConfig>(() => {
    if (minigameConfig?.conceptConfig) {
      const backendConcept = minigameConfig.conceptConfig;
      let items = backendConcept.defaultItems;
      if (Array.isArray(minigameConfig.pickItems) && minigameConfig.pickItems.length === 6) {
        items = minigameConfig.pickItems;
      } else if (minigameConfig.customPickItemsJson) {
        try {
          const parsed = JSON.parse(minigameConfig.customPickItemsJson);
          if (Array.isArray(parsed) && parsed.length === 6) {
            items = parsed;
          }
        } catch {}
      }

      return {
        ...backendConcept,
        gameTitle: minigameConfig.customPickTitle?.trim() || backendConcept.gameTitle,
        gameSubtitle: minigameConfig.customPickSubtitle?.trim() || backendConcept.gameSubtitle,
        defaultItems: items,
      };
    }

    const baseConfig = resolveMysteryPickConcept({
      minigameConcept: minigameConfig?.mysteryPickConcept,
      conceptId: decorationConceptId,
      themeCode,
      eventType,
      slug: eventSlug,
    });

    let items = baseConfig.defaultItems;
    if (minigameConfig?.customPickItemsJson) {
      try {
        const parsedItems = JSON.parse(minigameConfig.customPickItemsJson);
        if (Array.isArray(parsedItems) && parsedItems.length === 6) {
          items = parsedItems;
        }
      } catch {}
    }

    return {
      ...baseConfig,
      gameTitle: minigameConfig?.customPickTitle?.trim() || baseConfig.gameTitle,
      gameSubtitle: minigameConfig?.customPickSubtitle?.trim() || baseConfig.gameSubtitle,
      defaultItems: items,
    };
  }, [minigameConfig, decorationConceptId, themeCode, eventType, eventSlug]);

  const defaultGameType: MinigameType =
    minigameConfig?.gameType ??
    (eventType === 'COMMERCE' || eventType === 'REGIONAL' ? 'WHEEL_SPIN' : 'LUCKY_ENVELOPE');

  const rewardsJson = minigameConfig?.rewardsJson;
  const configuredWheelRewards = useMemo<MinigameReward[]>(() => {
    if (rewardsJson) {
      try {
        const parsed = JSON.parse(rewardsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeReward);
        }
      } catch {}
    }
    return LUCKY_WHEEL_REWARDS;
  }, [rewardsJson]);

  const [activeGameType, setActiveGameType] = useState<MinigameType>(defaultGameType);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentReward, setCurrentReward] = useState<MinigameReward | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [selectedEnvelopeIndex, setSelectedEnvelopeIndex] = useState<number | null>(null);

  const storageKey = userSubject ? `${STORAGE_KEY_PREFIX}${userSubject}_${eventId}` : null;
  const statusQueryKey = useMemo(
    () => ['event-minigame-user-status', userSubject, eventSlug] as const,
    [userSubject, eventSlug],
  );
  const todayStr = getTodayString();

  const rawStorage = useSyncExternalStore(
    subscribeMinigameStorage,
    () => (typeof window !== 'undefined' && storageKey ? localStorage.getItem(storageKey) : null),
    () => null,
  );

  const userState = useMemo<MinigameUserState>(() => {
    if (!rawStorage) {
      return {
        spinsLeft: 0,
        lastDailyClaim: null,
        history: [],
      };
    }
    try {
      const parsed: MinigameUserState = JSON.parse(rawStorage);
      const safeHistory = Array.isArray(parsed.history)
        ? parsed.history.filter((item): item is MinigameHistoryEntry =>
            Boolean(item && item.reward),
          )
        : [];
      return {
        spinsLeft: typeof parsed.spinsLeft === 'number' ? Math.max(0, parsed.spinsLeft) : 0,
        lastDailyClaim: parsed.lastDailyClaim || null,
        history: safeHistory,
      };
    } catch {
      return {
        spinsLeft: 0,
        lastDailyClaim: null,
        history: [],
      };
    }
  }, [rawStorage]);

  const persistState = useCallback(
    (newSpins: number, newClaim: string | null, newHistory: MinigameHistoryEntry[]) => {
      if (typeof window === 'undefined' || !storageKey) return;
      try {
        const safeHistory = Array.isArray(newHistory)
          ? newHistory.filter((item): item is MinigameHistoryEntry => Boolean(item && item.reward))
          : [];
        const data: MinigameUserState = {
          spinsLeft: Math.max(0, newSpins),
          lastDailyClaim: newClaim,
          history: safeHistory,
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        notifyMinigameUpdate();
      } catch {}
    },
    [storageKey],
  );

  const { data: remoteStatus } = useQuery({
    queryKey: statusQueryKey,
    queryFn: () => (eventSlug ? eventMinigameApi.getUserStatus(eventSlug) : Promise.reject()),
    enabled: Boolean(eventSlug && isAuthenticated),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (remoteStatus) {
      const mappedHistory = (remoteStatus.recentHistory || []).map(mapHistoryEntry);

      persistState(remoteStatus.spinsLeft, remoteStatus.lastDailyClaimDate, mappedHistory);
    }
  }, [remoteStatus, persistState]);

  const spinsLeft =
    remoteStatus?.spinsLeft !== undefined
      ? Math.max(0, remoteStatus.spinsLeft)
      : userState.spinsLeft;

  const lastDailyClaim = remoteStatus?.lastDailyClaimDate ?? userState.lastDailyClaim;
  const history = userState.history;

  const canClaimDailyFreeSpin = useMemo(() => {
    if (typeof remoteStatus?.canClaimDaily === 'boolean') {
      return remoteStatus.canClaimDaily;
    }
    return lastDailyClaim !== todayStr;
  }, [remoteStatus?.canClaimDaily, lastDailyClaim, todayStr]);

  const handleClaimDailyFreeSpin = useCallback(async () => {
    if (!canClaimDailyFreeSpin) {
      toast.error('Bạn đã nhận lượt miễn phí hôm nay rồi. Hãy quay lại vào ngày mai nhé!');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để nhận lượt chơi miễn phí mỗi ngày!');
      router.push('/dang-nhap');
      return;
    }

    if (!eventSlug) {
      toast.error('Không tìm thấy sự kiện hợp lệ.');
      return;
    }

    try {
      const res = await eventMinigameApi.claimDailySpin(eventSlug);
      persistState(
        res.spinsLeft,
        res.lastDailyClaimDate,
        (res.recentHistory || []).map(mapHistoryEntry),
      );
      queryClient.setQueryData(statusQueryKey, res);
      toast.success('Nhận thành công +1 lượt chơi miễn phí hôm nay!');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj?.response?.data?.message || 'Bạn đã nhận lượt miễn phí hôm nay rồi.';
      toast.error(msg);
    }
  }, [
    canClaimDailyFreeSpin,
    isAuthenticated,
    eventSlug,
    router,
    persistState,
    queryClient,
    statusQueryKey,
  ]);

  const playEnvelope = useCallback(
    async (envelopeIndex: number) => {
      if (isSpinning) return;

      if (!isAuthenticated) {
        toast.error('Vui lòng đăng nhập để tham gia bốc quà và nhận voucher!');
        router.push('/dang-nhap');
        return;
      }

      if (spinsLeft <= 0) {
        toast.error('Bạn đã hết lượt bốc lì xì! Mua sắm đơn từ 300K để nhận thêm lượt nhé.');
        return;
      }

      if (!eventSlug) {
        toast.error('Sự kiện không hợp lệ hoặc đã kết thúc.');
        return;
      }

      try {
        setIsSpinning(true);
        setSelectedEnvelopeIndex(envelopeIndex);

        const serverRes = await eventMinigameApi.play(eventSlug, 'LUCKY_ENVELOPE');
        const normalizedReward = normalizeReward(serverRes.reward);

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const newEntry: MinigameHistoryEntry = {
          id: `won_${Date.now()}`,
          gameType: 'LUCKY_ENVELOPE',
          reward: normalizedReward,
          wonAt: serverRes.wonAt,
        };
        const nextHistory = [newEntry, ...history];
        persistState(serverRes.spinsLeft, lastDailyClaim, nextHistory);
        queryClient.setQueryData(statusQueryKey, (old?: UserMinigameStatusResponse) => {
          if (!old) return old;
          return {
            ...old,
            spinsLeft: serverRes.spinsLeft,
            totalSpinsUsed: (old.totalSpinsUsed ?? 0) + 1,
            recentHistory: [toHistoryResponse(newEntry), ...(old.recentHistory || [])].slice(0, 5),
          };
        });

        if (
          normalizedReward.voucherCode ||
          normalizedReward.type === 'VOUCHER' ||
          normalizedReward.type === 'FREESHIP'
        ) {
          queryClient.invalidateQueries({ queryKey: ['vouchers', 'saved'] });
          queryClient.invalidateQueries({ queryKey: ['saved-vouchers'] });
        }

        setCurrentReward(normalizedReward);
        setIsSpinning(false);
        setIsRewardModalOpen(true);
      } catch (err: unknown) {
        setIsSpinning(false);
        setSelectedEnvelopeIndex(null);
        const errorObj = err as {
          response?: { data?: { code?: number; message?: string } };
        };
        const errCode = errorObj?.response?.data?.code;
        const msg = errorObj?.response?.data?.message || 'Không thể tham gia minigame lúc này';
        if (errCode === 8028 || msg?.includes('hết lượt')) {
          persistState(0, lastDailyClaim, history);
          queryClient.setQueryData(statusQueryKey, (old?: UserMinigameStatusResponse) =>
            old ? { ...old, spinsLeft: 0 } : old,
          );
        }
        toast.error(msg);
      }
    },
    [
      isSpinning,
      isAuthenticated,
      spinsLeft,
      eventSlug,
      router,
      history,
      lastDailyClaim,
      persistState,
      queryClient,
      statusQueryKey,
    ],
  );

  const playWheel = useCallback(async () => {
    if (isSpinning) return;

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để tham gia vòng quay và nhận voucher!');
      router.push('/dang-nhap');
      return;
    }

    if (spinsLeft <= 0) {
      toast.error('Bạn đã hết lượt quay! Mua sắm đơn từ 300K để nhận thêm lượt nhé.');
      return;
    }

    if (!eventSlug) {
      toast.error('Sự kiện không hợp lệ hoặc đã kết thúc.');
      return;
    }

    try {
      setIsSpinning(true);

      const serverRes = await eventMinigameApi.play(eventSlug, 'WHEEL_SPIN');
      const normalizedReward = normalizeReward(serverRes.reward);

      const rewards = configuredWheelRewards;
      const sliceAngle = 360 / rewards.length;
      const sliceIdx =
        serverRes.sliceIndex >= 0
          ? serverRes.sliceIndex
          : Math.floor(Math.random() * configuredWheelRewards.length);
      const targetSliceCenter = sliceIdx * sliceAngle + sliceAngle / 2;
      const randomExtraRounds = 5 + Math.floor(Math.random() * 3);
      const targetRotation =
        wheelRotation + randomExtraRounds * 360 + (360 - (targetSliceCenter % 360));

      setWheelRotation(targetRotation);

      await new Promise((resolve) => setTimeout(resolve, 4500));

      const newEntry: MinigameHistoryEntry = {
        id: `won_${Date.now()}`,
        gameType: 'WHEEL_SPIN',
        reward: normalizedReward,
        wonAt: serverRes.wonAt,
      };
      const nextHistory = [newEntry, ...history];
      persistState(serverRes.spinsLeft, lastDailyClaim, nextHistory);
      queryClient.setQueryData(statusQueryKey, (old?: UserMinigameStatusResponse) => {
        if (!old) return old;
        return {
          ...old,
          spinsLeft: serverRes.spinsLeft,
          totalSpinsUsed: (old.totalSpinsUsed ?? 0) + 1,
          recentHistory: [toHistoryResponse(newEntry), ...(old.recentHistory || [])].slice(0, 5),
        };
      });

      if (
        normalizedReward.voucherCode ||
        normalizedReward.type === 'VOUCHER' ||
        normalizedReward.type === 'FREESHIP'
      ) {
        queryClient.invalidateQueries({ queryKey: ['vouchers', 'saved'] });
        queryClient.invalidateQueries({ queryKey: ['saved-vouchers'] });
      }

      setCurrentReward(normalizedReward);
      setIsSpinning(false);
      setIsRewardModalOpen(true);
    } catch (err: unknown) {
      setIsSpinning(false);
      const errorObj = err as {
        response?: { data?: { code?: number; message?: string } };
      };
      const errCode = errorObj?.response?.data?.code;
      const msg = errorObj?.response?.data?.message || 'Không thể quay vòng quay lúc này';
      if (errCode === 8028 || msg?.includes('hết lượt')) {
        persistState(0, lastDailyClaim, history);
        queryClient.setQueryData(statusQueryKey, (old?: UserMinigameStatusResponse) =>
          old ? { ...old, spinsLeft: 0 } : old,
        );
      }
      toast.error(msg);
    }
  }, [
    isSpinning,
    isAuthenticated,
    spinsLeft,
    eventSlug,
    router,
    wheelRotation,
    history,
    lastDailyClaim,
    persistState,
    queryClient,
    configuredWheelRewards,
    statusQueryKey,
  ]);

  const handleCopyCode = useCallback((code: string) => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(code);
      toast.success(`Đã sao chép mã "${code}" vào bộ nhớ tạm!`);
    } else {
      toast.success(`Mã voucher: ${code}`);
    }
  }, []);

  const closeRewardModal = useCallback(() => {
    setIsRewardModalOpen(false);
    setSelectedEnvelopeIndex(null);
  }, []);

  const openGameModal = useCallback((type?: MinigameType) => {
    if (type) setActiveGameType(type);
    setIsGameModalOpen(true);
  }, []);

  const closeGameModal = useCallback(() => {
    if (isSpinning) return;
    setIsGameModalOpen(false);
    setSelectedEnvelopeIndex(null);
  }, [isSpinning]);

  return {
    activeGameType,
    setActiveGameType,
    spinsLeft,
    canClaimDailyFreeSpin,
    isSpinning,
    history,
    currentReward,
    isRewardModalOpen,
    isGameModalOpen,
    wheelRotation,
    selectedEnvelopeIndex,
    selectedPickIndex: selectedEnvelopeIndex,
    mysteryPickConceptConfig,
    pickItems: mysteryPickConceptConfig.defaultItems,
    envelopeRewards: mysteryPickConceptConfig.defaultRewards || LUCKY_ENVELOPE_REWARDS,
    wheelRewards: configuredWheelRewards,
    dailyFreeSpins: minigameConfig?.freeSpinsPerDay ?? 1,
    minOrderValueForBonusSpin: minigameConfig?.minOrderValueForBonusSpin ?? 300000,
    spinsPerOrder: minigameConfig?.spinsPerOrder ?? 1,
    handleClaimDailyFreeSpin,
    playEnvelope,
    playPick: playEnvelope,
    playWheel,
    handleCopyCode,
    openGameModal,
    closeGameModal,
    closeRewardModal,
  };
}
