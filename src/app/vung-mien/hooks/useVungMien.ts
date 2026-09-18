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

  // Chế độ xem: '63' (hiện hành - 3 cấp) hoặc '34' (quy hoạch mới - 2 cấp, bãi bỏ cấp huyện)
  const [mode, setMode] = useState<ProvinceMode>('63');
  const isTwoTierMode = mode === '34';

  // Lọc theo Miền lớn ('all' | 'bac' | 'trung' | 'nam')
  const [macroRegion, setMacroRegion] = useState<MacroRegionKey>('all');

  // Lọc theo 8 Vùng sinh thái ('all' | 1..8)
  const [selectedRegionId, setSelectedRegionId] = useState<RegionId | 'all'>('all');

  // Chế độ xem bản đồ: 'overview' (SVG toàn quốc) hoặc 'satellite' (Leaflet vệ tinh chi tiết Xã / Vùng trồng)
  const [activeMapView, setActiveMapView] = useState<'overview' | 'satellite'>('overview');

  // Tỉnh/thành đang chọn từ URL query param
  const rawProvinceQuery = searchParams.get('province');
  const selectedProvince = useMemo(() => {
    if (!rawProvinceQuery || rawProvinceQuery === 'undefined' || rawProvinceQuery === 'null') {
      return null;
    }
    return rawProvinceQuery;
  }, [rawProvinceQuery]);

  // Thông tin chi tiết của tỉnh đang chọn
  const selectedProvinceInfo = useMemo(() => {
    if (!selectedProvince) return undefined;
    return findProvince(selectedProvince, mode);
  }, [selectedProvince, mode]);

  // Danh mục tỉnh thành từ backend
  const { data: provincesRes } = usePublicProvincesQuery();
  const backendProvinces = useMemo(() => provincesRes?.data || [], [provincesRes]);

  // Tìm ID tỉnh để query sản phẩm từ backend
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

  // ─── CHẾ ĐỘ 34 TỈNH: KHÔNG CÒN CẤP HUYỆN (CHÍNH QUYỀN 2 CẤP) ─────────────────
  // Danh sách các khu vực/tỉnh hợp nhất nếu là tỉnh 34 sáp nhập
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

  // Danh sách provinceId thực tế để truy xuất Xã
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

  // ─── CHẾ ĐỘ 63 TỈNH: 3 CẤP (TỈNH ➔ HUYỆN ➔ XÃ) ──────────────────────────────
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(null);
  const [selectedWardCode, setSelectedWardCode] = useState<string | null>(null);

  // 1. Danh sách Quận / Huyện (Chỉ sử dụng khi ở mode 63)
  const { data: districtsRes, isLoading: isLoadingDistricts } = useQuery({
    queryKey: ['vung-mien-districts', provinceId],
    queryFn: () => locationApi.getDistricts(provinceId!),
    enabled: mode === '63' && !!provinceId,
    staleTime: 15 * 60 * 1000,
  });
  const districts: District[] = useMemo(() => {
    if (mode === '34') return []; // 34 Tỉnh mới bãi bỏ hoàn toàn cấp huyện!
    return districtsRes?.data || [];
  }, [districtsRes, mode]);

  // 2. Danh sách Phường / Xã cho mode 63 (theo cấp Huyện)
  const { data: wards63Res, isLoading: isLoadingWards63 } = useQuery({
    queryKey: ['vung-mien-wards-63', selectedDistrictId],
    queryFn: () => locationApi.getWards(selectedDistrictId!),
    enabled: mode === '63' && !!selectedDistrictId,
    staleTime: 15 * 60 * 1000,
  });

  // 3. Danh sách Phường / Xã trực thuộc Tỉnh cho mode 34 (Chính quyền 2 cấp: Tỉnh ➔ Xã trực thuộc)
  const { data: wards34Res, isLoading: isLoadingWards34 } = useQuery({
    queryKey: ['vung-mien-wards-34', effectiveProvinceIds],
    queryFn: async () => {
      if (!effectiveProvinceIds.length) return [];
      try {
        // Lấy toàn bộ các huyện ngầm bên dưới
        const distResponses = await Promise.all(
          effectiveProvinceIds.map((pid) =>
            locationApi.getDistricts(pid).catch(() => ({ data: [] })),
          ),
        );
        const allDistricts = distResponses.flatMap((r) => r.data || []);

        // Gom tất cả các xã vào danh mục Phường / Xã trực thuộc Tỉnh
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

  // Tổng hợp danh sách Wards tương ứng theo chế độ
  const wards: WardWithMeta[] = useMemo(() => {
    if (mode === '34') {
      return (wards34Res || []).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
    }
    return wards63Res?.data || [];
  }, [mode, wards34Res, wards63Res]);

  const isLoadingWards = mode === '34' ? isLoadingWards34 : isLoadingWards63;

  // Thực thể Huyện và Xã đang chọn
  const selectedDistrict = useMemo(
    () => (mode === '63' ? districts.find((d) => d.id === selectedDistrictId) || null : null),
    [districts, selectedDistrictId, mode],
  );

  const selectedWard = useMemo(
    () =>
      wards.find((w) => w.code === selectedWardCode || String(w.id) === selectedWardCode) || null,
    [wards, selectedWardCode],
  );

  // ─── ĐIỀU CHỈNH STATE KHI ĐỔI TỈNH HOẶC CHẾ ĐỘ ─────────────────────────────
  const [prevProvince, setPrevProvince] = useState(selectedProvince);
  const [prevMode, setPrevMode] = useState(mode);

  if (selectedProvince !== prevProvince || mode !== prevMode) {
    setPrevProvince(selectedProvince);
    setPrevMode(mode);
    setSelectedDistrictId(null);
    setSelectedWardCode(null);
    setSelectedConstituentCode(null);
  }

  // ─── ĐỊNH VỊ TOẠ ĐỘ XÃ / HUYỆN CHO BẢN ĐỒ VỆ TINH ─────────────────────────────
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

  // ─── QUERY SẢN PHẨM OCOP VÙNG MIỀN ───────────────────────────────────────────
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

  // Lọc sản phẩm chi tiết theo Xã / Huyện đã chọn
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

  // ─── CALLBACKS ───────────────────────────────────────────────────────────────
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

  // Danh mục danh sách miền & vùng
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
    // Phân cấp hành chính
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
    // Bản đồ
    activeMapView,
    setActiveMapView,
    // Handlers
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
