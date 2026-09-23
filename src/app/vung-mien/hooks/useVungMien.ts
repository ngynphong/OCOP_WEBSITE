'use client';

import { useState, useMemo, useCallback, useSyncExternalStore } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  usePublicProvincesQuery,
  usePublicProductsInfiniteQuery,
} from '@/features/products/hooks/usePublicProducts';
import { locationApi } from '@/features/admin/api/locationApi';
import { District, Ward } from '@/features/admin/types/locationTypes';
import {
  ProvinceMode,
  MacroRegionKey,
  MacroRegion,
  RegionId,
  AdministrativeRegion,
  ProvinceInfo,
  findProvince,
  getConstituentProvinces,
  MACRO_REGIONS,
  ADMINISTRATIVE_REGIONS,
  PROVINCES_63_MAP,
} from '@/constants/regions-map';
import {
  getProvinceGeo,
  normalizeSearchStr,
  VIETNAM_CENTER,
} from '@/constants/province-coordinates';

export interface WardWithMeta extends Ward {
  districtName?: string;
  constituentProvinceName?: string;
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useVungMien() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const [mode, setMode] = useState<ProvinceMode>('63');
  const isTwoTierMode = mode === '34';

  const [macroRegion, setMacroRegion] = useState<MacroRegionKey>('all');

  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | 'all'>('all');

  const [activeMapView, setActiveMapView] = useState<'overview' | 'satellite'>('overview');

  const rawProvinceQuery = searchParams.get('province');
  const selectedProvince = useMemo(() => {
    if (!rawProvinceQuery || rawProvinceQuery === 'undefined' || rawProvinceQuery === 'null') {
      return null;
    }
    return rawProvinceQuery;
  }, [rawProvinceQuery]);

  const selectedProvinceInfo = useMemo(() => {
    if (!selectedProvince) return undefined;
    return findProvince(selectedProvince, mode);
  }, [selectedProvince, mode]);

  const { data: provincesRes } = usePublicProvincesQuery();
  const backendProvinces = useMemo(() => provincesRes?.data || [], [provincesRes]);

  const provinceId = useMemo(() => {
    if (!selectedProvince || backendProvinces.length === 0) return undefined;

    const directMatch = backendProvinces.find(
      (p) =>
        p.name.toLowerCase().includes(selectedProvince.toLowerCase()) ||
        selectedProvince.toLowerCase().includes(p.name.toLowerCase()),
    );
    if (directMatch) return directMatch.id;

    if (mode === '34') {
      const constituents = getConstituentProvinces(selectedProvince);
      for (const name of constituents) {
        const match = backendProvinces.find(
          (p) =>
            p.name.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(p.name.toLowerCase()),
        );
        if (match) return match.id;
      }
    }

    return undefined;
  }, [selectedProvince, backendProvinces, mode]);

  const constituentProvinces = useMemo(() => {
    if (mode !== '34' || !selectedProvinceInfo?.constituentCodes) return [];
    return selectedProvinceInfo.constituentCodes.map((code) => {
      const p63 = PROVINCES_63_MAP[code];
      const pName = p63?.name || '';
      const bProv = backendProvinces.find(
        (bp) =>
          bp.name.toLowerCase().includes(pName.toLowerCase()) ||
          pName.toLowerCase().includes(bp.name.toLowerCase()),
      );
      return {
        code,
        name: pName || code,
        backendId: bProv?.id,
      };
    });
  }, [mode, selectedProvinceInfo, backendProvinces]);

  const [selectedConstituentCode, setSelectedConstituentCode] = useState<string | null>(null);

  const effectiveProvinceIds = useMemo(() => {
    if (mode === '63') {
      return provinceId ? [provinceId] : [];
    }
    if (selectedConstituentCode) {
      const found = constituentProvinces.find((c) => c.code === selectedConstituentCode);
      return found?.backendId ? [found.backendId] : [];
    }
    const ids = constituentProvinces.map((c) => c.backendId).filter(Boolean) as number[];
    if (ids.length > 0) return ids;
    return provinceId ? [provinceId] : [];
  }, [mode, provinceId, selectedConstituentCode, constituentProvinces]);

  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [selectedWardCode, setSelectedWardCode] = useState<string | null>(null);

  const { data: districtsRes, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['vung-mien-districts', provinceId],
    queryFn: () => locationApi.getDistricts(provinceId!),
    enabled: mode === '63' && !!provinceId,
    staleTime: 15 * 60 * 1000,
  });
  const districts: District[] = useMemo(() => {
    if (mode === '34') return [];
    return districtsRes?.data || [];
  }, [districtsRes, mode]);

  const { data: wards63Res, isLoading: isLoadingWards63 } = useQuery({
    queryKey: ['vung-mien-wards-63', selectedDistrictId],
    queryFn: () => locationApi.getWards(selectedDistrictId!),
    enabled: mode === '63' && !!selectedDistrictId,
    staleTime: 15 * 60 * 1000,
  });

  const { data: wards34Res, isLoading: isLoadingWards34 } = useQuery({
    queryKey: ['vung-mien-wards-34', effectiveProvinceIds],
    queryFn: async () => {
      if (!effectiveProvinceIds.length) return [];
      try {
        const distResponses = await Promise.all(
          effectiveProvinceIds.map((pid) =>
            locationApi.getDistricts(pid).catch(() => ({ data: [] })),
          ),
        );
        const allDistricts = distResponses.flatMap((r) => r.data || []);

        const wardPromises = allDistricts.map((d) =>
          locationApi
            .getWards(d.id)
            .then((res) =>
              (res.data || []).map((w) => ({
                ...w,
                districtName: d.name,
              })),
            )
            .catch(() => []),
        );
        const allWardsArrays = await Promise.all(wardPromises);
        return allWardsArrays.flat();
      } catch (err) {
        console.error('Lỗi khi tải danh sách xã trực thuộc tỉnh 34:', err);
        return [];
      }
    },
    enabled: mode === '34' && effectiveProvinceIds.length > 0,
    staleTime: 30 * 60 * 1000,
  });

  const wards: WardWithMeta[] = useMemo(() => {
    if (mode === '34') {
      return (wards34Res || []).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    return wards63Res?.data || [];
  }, [mode, wards34Res, wards63Res]);

  const isLoadingWards = mode === '34' ? isLoadingWards34 : isLoadingWards63;

  const selectedDistrict = useMemo(
    () => (mode === '63' ? districts.find((d) => d.id === selectedDistrictId) || null : null),
    [districts, selectedDistrictId, mode],
  );

  const selectedWard = useMemo(
    () =>
      wards.find((w) => w.code === selectedWardCode || String(w.id) === selectedWardCode) || null,
    [wards, selectedWardCode],
  );

  const [prevProvince, setPrevProvince] = useState(selectedProvince);
  const [prevMode, setPrevMode] = useState(mode);

  if (selectedProvince !== prevProvince || mode !== prevMode) {
    setPrevProvince(selectedProvince);
    setPrevMode(mode);
    setSelectedDistrictId(null);
    setSelectedWardCode(null);
    setSelectedConstituentCode(null);
  }

  const defaultProvinceCoords = useMemo(() => {
    if (!selectedProvince) return null;
    return getProvinceGeo(selectedProvince, mode)?.center ?? null;
  }, [selectedProvince, mode]);

  const geocodingQuery = useMemo(() => {
    if (!selectedProvince) return null;
    if (selectedWard) {
      const queryParts = [
        selectedWard.name,
        mode === '63' && selectedDistrict ? selectedDistrict.name : selectedWard.districtName,
        selectedProvince,
      ].filter(Boolean);
      return queryParts.join(', ');
    }
    if (mode === '63' && selectedDistrict) {
      return `${selectedDistrict.name}, ${selectedProvince}`;
    }
    return null;
  }, [selectedProvince, selectedWard, selectedDistrict, mode]);

  const { data: geocodedCoords, isFetching: isResolvingCoords } = useQuery({
    queryKey: ['vung-mien-geocoding', geocodingQuery],
    queryFn: async () => {
      if (!geocodingQuery) return null;
      const res = await fetch(`/api/geocoding/search?q=${encodeURIComponent(geocodingQuery)}`);
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          return [lat, lon] as [number, number];
        }
      }
      return null;
    },
    enabled: !!geocodingQuery,
    staleTime: 60 * 60 * 1000,
  });

  const communeCoords = geocodedCoords ?? defaultProvinceCoords;

  const [selectedStar, setSelectedStar] = useState<number | null>(null);

  const {
    data: productsInfiniteRes,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePublicProductsInfiniteQuery(
    {
      provinceId: mode === '63' ? provinceId : undefined,
      province34Code: mode === '34' ? selectedProvinceInfo?.code : undefined,
      ocopStar: selectedStar || undefined,
      pageSize: 16,
    },
    {
      enabled: isClient && (!selectedProvince || mode === '34' || backendProvinces.length > 0),
    },
  );

  const rawProducts = useMemo(
    () => productsInfiniteRes?.pages.flatMap((page) => page.data.items) || [],
    [productsInfiniteRes],
  );

  const { filteredProducts, isFilteredByCommune, isFilteredByDistrict } = useMemo(() => {
    if (!rawProducts || rawProducts.length === 0) {
      return { filteredProducts: [], isFilteredByCommune: false, isFilteredByDistrict: false };
    }

    if (selectedWard) {
      const wardNorm = normalizeSearchStr(selectedWard.name);
      const matched = rawProducts.filter((p) => {
        const areaNorm = normalizeSearchStr(p.productionArea || '');
        const descNorm = normalizeSearchStr(p.description || '');
        const titleNorm = normalizeSearchStr(p.name || '');
        return (
          areaNorm.includes(wardNorm) || descNorm.includes(wardNorm) || titleNorm.includes(wardNorm)
        );
      });

      if (matched.length > 0) {
        return { filteredProducts: matched, isFilteredByCommune: true, isFilteredByDistrict: true };
      }
      return {
        filteredProducts: rawProducts,
        isFilteredByCommune: false,
        isFilteredByDistrict: mode === '63' ? !!selectedDistrict : true,
      };
    }

    if (mode === '63' && selectedDistrict) {
      const distNorm = normalizeSearchStr(selectedDistrict.name);
      const matched = rawProducts.filter((p) => {
        const areaNorm = normalizeSearchStr(p.productionArea || '');
        const descNorm = normalizeSearchStr(p.description || '');
        return areaNorm.includes(distNorm) || descNorm.includes(distNorm);
      });

      if (matched.length > 0) {
        return {
          filteredProducts: matched,
          isFilteredByCommune: false,
          isFilteredByDistrict: true,
        };
      }
      return {
        filteredProducts: rawProducts,
        isFilteredByCommune: false,
        isFilteredByDistrict: false,
      };
    }

    return {
      filteredProducts: rawProducts,
      isFilteredByCommune: false,
      isFilteredByDistrict: false,
    };
  }, [rawProducts, selectedWard, selectedDistrict, mode]);

  const handleSelectMode = useCallback(
    (newMode: ProvinceMode) => {
      setMode(newMode);
      setSelectedDistrictId(null);
      setSelectedWardCode(null);
      setSelectedConstituentCode(null);
      if (selectedProvince) {
        const foundInNewMode = findProvince(selectedProvince, newMode);
        if (!foundInNewMode) {
          router.push('/vung-mien', { scroll: false });
        }
      }
    },
    [selectedProvince, router],
  );

  const handleSelectMacroRegion = useCallback((key: MacroRegionKey) => {
    setMacroRegion(key);
    setSelectedRegionId('all');
  }, []);

  const handleSelectRegion = useCallback((regionId: RegionId | 'all') => {
    setSelectedRegionId(regionId);
    if (regionId !== 'all') {
      const regionInfo = ADMINISTRATIVE_REGIONS[regionId];
      if (regionInfo) {
        setMacroRegion(regionInfo.macroRegion);
      }
    }
  }, []);

  const handleSelectProvince = useCallback(
    (provinceName: string, info?: ProvinceInfo) => {
      const targetName = info?.name || provinceName;
      router.push(`/vung-mien?province=${encodeURIComponent(targetName)}`, { scroll: false });
      setSelectedDistrictId(null);
      setSelectedWardCode(null);
      setSelectedConstituentCode(null);

      if (info) {
        setMacroRegion(info.macroRegion);
        setSelectedRegionId(info.regionId);
      } else {
        const found = findProvince(targetName, mode);
        if (found) {
          setMacroRegion(found.macroRegion);
          setSelectedRegionId(found.regionId);
        }
      }
    },
    [router, mode],
  );

  const handleClearProvince = useCallback(() => {
    router.push('/vung-mien', { scroll: false });
    setSelectedDistrictId(null);
    setSelectedWardCode(null);
    setSelectedConstituentCode(null);
    setActiveMapView('overview');
  }, [router]);

  const handleSelectDistrict = useCallback((districtId: number | null) => {
    setSelectedDistrictId(districtId);
    setSelectedWardCode(null);
    if (districtId) {
      setActiveMapView('satellite');
    }
  }, []);

  const handleSelectWard = useCallback((wardCode: string | null) => {
    setSelectedWardCode(wardCode);
    if (wardCode) {
      setActiveMapView('satellite');
    }
  }, []);

  const handleSelectConstituent = useCallback((constituentCode: string | null) => {
    setSelectedConstituentCode(constituentCode);
    setSelectedWardCode(null);
  }, []);

  const handleSelectStar = useCallback((star: number | null) => {
    setSelectedStar(star);
  }, []);

  const handleResetHierarchy = useCallback(() => {
    setSelectedDistrictId(null);
    setSelectedWardCode(null);
    setSelectedConstituentCode(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const availableRegions: AdministrativeRegion[] = useMemo(() => {
    const all: AdministrativeRegion[] = Object.values(ADMINISTRATIVE_REGIONS);
    if (macroRegion === 'all') return all;
    return all.filter((r) => r.macroRegion === macroRegion);
  }, [macroRegion]);

  const macroRegionsList: MacroRegion[] = useMemo(() => {
    return Object.values(MACRO_REGIONS);
  }, []);

  return {
    isClient,
    mode,
    isTwoTierMode,
    macroRegion,
    selectedRegionId,
    selectedProvince,
    selectedProvinceInfo,
    macroRegionsList,
    availableRegions,
    products: filteredProducts,
    totalRawProductsCount: rawProducts.length,
    selectedStar,
    handleSelectStar,
    isFilteredByCommune,
    isFilteredByDistrict,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    constituentProvinces,
    selectedConstituentCode,
    handleSelectConstituent,
    selectedDistrictId,
    selectedDistrict,
    districts,
    isLoadingDistricts,
    selectedWardCode,
    selectedWard,
    wards,
    isLoadingWards,
    communeCoords:
      communeCoords ||
      (selectedProvinceInfo
        ? getProvinceGeo(selectedProvinceInfo.name, mode)?.center || VIETNAM_CENTER
        : VIETNAM_CENTER),
    isResolvingCoords,
    activeMapView,
    setActiveMapView,
    handleSelectMode,
    handleSelectMacroRegion,
    handleSelectRegion,
    handleSelectProvince,
    handleClearProvince,
    handleSelectDistrict,
    handleSelectWard,
    handleResetHierarchy,
    handleLoadMore,
  };
}
