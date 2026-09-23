'use client';

import { useState, useCallback, useMemo, useSyncExternalStore, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
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
import { eventMinigameApi } from '../api/eventMinigameApi';
import toast from 'react-hot-toast';

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

export function useEventMinigame({
  eventId,
  eventSlug,
  eventType,
  theme,
  minigameConfig,
}: UseEventMinigameOptions) {
  const router = useRouter();
  const decorationConceptId = useMemo(() => {
    if (!theme?.decorationsJson) return null;
    try {
      const parsed = JSON.parse(theme.decorationsJson);
      return parsed.conceptId || null;
    } catch {
      return null;
    }
  }, [theme?.decorationsJson]);

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
      themeCode: theme?.code,
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
  }, [minigameConfig, decorationConceptId, theme?.code, eventType, eventSlug]);

  const defaultGameType: MinigameType = useMemo(() => {
    if (minigameConfig?.gameType) {
      return minigameConfig.gameType;
    }
    if (eventType === 'COMMERCE' || eventType === 'REGIONAL') {
      return 'WHEEL_SPIN';
    }
    return 'LUCKY_ENVELOPE';
  }, [minigameConfig?.gameType, eventType]);

  const [activeGameType, setActiveGameType] = useState<MinigameType>(defaultGameType);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentReward, setCurrentReward] = useState<MinigameReward | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState<boolean>(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [selectedEnvelopeIndex, setSelectedEnvelopeIndex] = useState<number | null>(null);

  const storageKey = `${STORAGE_KEY_PREFIX}${eventId}`;
  const todayStr = getTodayString();

  const rawStorage = useSyncExternalStore(
    subscribeMinigameStorage,
    () => (typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null),
    () => null,
  );

  const userState = useMemo<MinigameUserState>(() => {
    if (!rawStorage) {
      return {
        spinsLeft: 1,
        lastDailyClaim: null,
        history: [],
      };
    }
    try {
      const parsed: MinigameUserState = JSON.parse(rawStorage);
      const hasClaimedToday = parsed.lastDailyClaim === todayStr;
      const spins = !hasClaimedToday && (parsed.spinsLeft ?? 0) <= 0 ? 1 : (parsed.spinsLeft ?? 1);
      const safeHistory = Array.isArray(parsed.history)
        ? parsed.history.filter((item): item is MinigameHistoryEntry =>
            Boolean(item && item.reward),
          )
        : [];
      return {
        spinsLeft: spins,
        lastDailyClaim: parsed.lastDailyClaim || null,
        history: safeHistory,
      };
    } catch {
      return {
        spinsLeft: 1,
        lastDailyClaim: null,
        history: [],
      };
    }
  }, [rawStorage, todayStr]);

  const spinsLeft = userState.spinsLeft;
  const lastDailyClaim = userState.lastDailyClaim;
  const history = userState.history;

  const persistState = useCallback(
    (newSpins: number, newClaim: string | null, newHistory: MinigameHistoryEntry[]) => {
      if (typeof window === 'undefined') return;
      try {
        const safeHistory = Array.isArray(newHistory)
          ? newHistory.filter((item): item is MinigameHistoryEntry => Boolean(item && item.reward))
          : [];
        const data: MinigameUserState = {
          spinsLeft: newSpins,
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
    queryKey: ['event-minigame-user-status', eventSlug],
    queryFn: () => (eventSlug ? eventMinigameApi.getUserStatus(eventSlug) : Promise.reject()),
    enabled: Boolean(
      eventSlug && typeof window !== 'undefined' && Boolean(localStorage.getItem('access_token')),
    ),
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    if (remoteStatus) {
      persistState(
        remoteStatus.spinsLeft,
        remoteStatus.lastDailyClaimDate,
        remoteStatus.recentHistory,
      );
    }
  }, [remoteStatus, persistState]);

  const canClaimDailyFreeSpin = useMemo(() => {
    return lastDailyClaim !== todayStr;
  }, [lastDailyClaim, todayStr]);

  const handleClaimDailyFreeSpin = useCallback(async () => {
    if (!canClaimDailyFreeSpin) {
      toast.error('Bạn đã nhận lượt miễn phí hôm nay rồi. Hãy quay lại vào ngày mai nhé!');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
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
      persistState(res.spinsLeft, res.lastDailyClaimDate, res.recentHistory);
      toast.success('Nhận thành công +1 lượt chơi miễn phí hôm nay!');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj?.response?.data?.message || 'Bạn đã nhận lượt miễn phí hôm nay rồi.';
      toast.error(msg);
    }
  }, [canClaimDailyFreeSpin, eventSlug, router, persistState]);

  const playEnvelope = useCallback(
    async (envelopeIndex: number) => {
      if (isSpinning) return;
      if (spinsLeft <= 0) {
        toast.error('Bạn đã hết lượt bốc lì xì! Mua sắm đơn từ 300K để nhận thêm lượt nhé.');
        return;
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) {
        toast.error('Vui lòng đăng nhập để tham gia bốc quà và nhận voucher!');
        router.push('/dang-nhap');
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

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const newEntry: MinigameHistoryEntry = {
          id: `won_${Date.now()}`,
          gameType: 'LUCKY_ENVELOPE',
          reward: serverRes.reward,
          wonAt: serverRes.wonAt,
        };
        const nextHistory = [newEntry, ...history];
        persistState(serverRes.spinsLeft, lastDailyClaim, nextHistory);

        setCurrentReward(serverRes.reward);
        setIsSpinning(false);
        setIsRewardModalOpen(true);
      } catch (err: unknown) {
        setIsSpinning(false);
        setSelectedEnvelopeIndex(null);
        const errorObj = err as { response?: { data?: { message?: string } } };
        const msg = errorObj?.response?.data?.message || 'Không thể tham gia minigame lúc này';
        toast.error(msg);
      }
    },
    [isSpinning, spinsLeft, eventSlug, router, history, lastDailyClaim, persistState],
  );

  const playWheel = useCallback(async () => {
    if (isSpinning) return;
    if (spinsLeft <= 0) {
      toast.error('Bạn đã hết lượt quay! Mua sắm đơn từ 300K để nhận thêm lượt nhé.');
      return;
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      toast.error('Vui lòng đăng nhập để tham gia vòng quay và nhận voucher!');
      router.push('/dang-nhap');
      return;
    }

    if (!eventSlug) {
      toast.error('Sự kiện không hợp lệ hoặc đã kết thúc.');
      return;
    }

    try {
      setIsSpinning(true);

      const serverRes = await eventMinigameApi.play(eventSlug, 'WHEEL_SPIN');

      const rewards = LUCKY_WHEEL_REWARDS;
      const sliceAngle = 360 / rewards.length;
      const sliceIdx = serverRes.sliceIndex ?? 0;
      const targetSliceCenter = sliceIdx * sliceAngle + sliceAngle / 2;
      const randomExtraRounds = 5 + Math.floor(Math.random() * 3);
      const targetRotation =
        wheelRotation + randomExtraRounds * 360 + (360 - (targetSliceCenter % 360));

      setWheelRotation(targetRotation);

      await new Promise((resolve) => setTimeout(resolve, 4500));

      const newEntry: MinigameHistoryEntry = {
        id: `won_${Date.now()}`,
        gameType: 'WHEEL_SPIN',
        reward: serverRes.reward,
        wonAt: serverRes.wonAt,
      };
      const nextHistory = [newEntry, ...history];
      persistState(serverRes.spinsLeft, lastDailyClaim, nextHistory);

      setCurrentReward(serverRes.reward);
      setIsSpinning(false);
      setIsRewardModalOpen(true);
    } catch (err: unknown) {
      setIsSpinning(false);
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj?.response?.data?.message || 'Không thể quay vòng quay lúc này';
      toast.error(msg);
    }
  }, [
    isSpinning,
    spinsLeft,
    eventSlug,
    router,
    wheelRotation,
    history,
    lastDailyClaim,
    persistState,
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
    wheelRewards: LUCKY_WHEEL_REWARDS,
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
