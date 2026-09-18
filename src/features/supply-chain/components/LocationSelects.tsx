import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/features/admin/api/locationApi';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import { PROVINCES_34_MAP, PROVINCES_63_MAP, ProvinceMode } from '@/constants/regions-map';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LocationSelects({ form }: { form: UseFormReturn<any> }) {
  const provinceCode = form.watch('provinceCode');
  const districtCode = form.watch('districtCode');
  const wardCode = form.watch('wardCode');

  const [mode, setMode] = useState<ProvinceMode>('63');
  const [selectedProv34Code, setSelectedProv34Code] = useState<string>('');
  const [selectedProvId, setSelectedProvId] = useState<number>();
  const [selectedDistId, setSelectedDistId] = useState<number>();

  const { provinces, districts, wards } = useLocationQuery(selectedProvId, selectedDistId);

  // Danh mục Xã trực thuộc cho mô hình 2 cấp (34 tỉnh không qua cấp huyện)
  const { data: wards34Data, isLoading: isLoadingWards34 } = useQuery({
    queryKey: ['location-all-wards-34', selectedProvId],
    queryFn: async () => {
      if (!selectedProvId || !districts.data?.data?.length) return [];
      const promises = districts.data.data.map((d) =>
        locationApi
          .getWards(d.id)
          .then((res) =>
            (res.data || []).map((w) => ({
              ...w,
              districtCode: d.code,
              districtName: d.name,
            })),
          )
          .catch(() => []),
      );
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: mode === '34' && !!selectedProvId && !!districts.data?.data?.length,
    staleTime: 30 * 60 * 1000,
  });

  // Sync initial codes to IDs & 34-code
  useEffect(() => {
    if (provinces.data?.data && provinceCode) {
      const p = provinces.data.data.find((x) => x.code === provinceCode);
      if (p && p.id !== selectedProvId) setSelectedProvId(p.id);

      // Map to 34 province if available
      const p63 = PROVINCES_63_MAP[provinceCode];
      if (p63?.parent34Code) {
        setSelectedProv34Code(p63.parent34Code);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinces.data, provinceCode]);

  useEffect(() => {
    if (districts.data?.data && districtCode) {
      const d = districts.data.data.find((x) => x.code === districtCode);
      if (d && d.id !== selectedDistId) setSelectedDistId(d.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts.data, districtCode]);

  const selectCls =
    'w-full border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white';

  const selectedProv34 = selectedProv34Code ? PROVINCES_34_MAP[selectedProv34Code] : undefined;

  return (
    <div className="space-y-3 mb-4">
      {/* Mode Switcher */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-stone-700">Địa chỉ hành chính</span>
        <div className="inline-flex rounded-md border border-stone-200 bg-stone-50 p-0.5">
          <button
            type="button"
            onClick={() => setMode('63')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              mode === '63'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            63 Tỉnh (Hiện hành)
          </button>
          <button
            type="button"
            onClick={() => setMode('34')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
              mode === '34'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            34 Tỉnh (Quy hoạch)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {mode === '63' ? (
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Tỉnh/Thành (63)
            </label>
            <select
              value={provinceCode || ''}
              onChange={(e) => {
                const code = e.target.value;
                form.setValue('provinceCode', code, { shouldDirty: true });
                form.setValue('districtCode', null);
                form.setValue('wardCode', null);
                const p = provinces.data?.data.find((x) => x.code === code);
                setSelectedProvId(p?.id);
                setSelectedDistId(undefined);
              }}
              className={selectCls}
              disabled={provinces.isPending}
            >
              <option value="">-- Chọn Tỉnh/Thành --</option>
              {provinces.data?.data?.map((p) => (
                <option key={p.id} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tỉnh/Thành (34 Quy hoạch)
              </label>
              <select
                value={selectedProv34Code || ''}
                onChange={(e) => {
                  const p34Code = e.target.value;
                  setSelectedProv34Code(p34Code);
                  form.setValue('districtCode', null);
                  form.setValue('wardCode', null);
                  setSelectedDistId(undefined);

                  const p34 = PROVINCES_34_MAP[p34Code];
                  if (p34 && p34.constituentCodes && p34.constituentCodes.length === 1) {
                    const code = p34.constituentCodes[0];
                    form.setValue('provinceCode', code, { shouldDirty: true });
                    const p = provinces.data?.data.find((x) => x.code === code);
                    setSelectedProvId(p?.id);
                  } else {
                    form.setValue('provinceCode', null, { shouldDirty: true });
                    setSelectedProvId(undefined);
                  }
                }}
                className={selectCls}
              >
                <option value="">-- Chọn 34 Tỉnh/Thành --</option>
                {Object.values(PROVINCES_34_MAP).map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProv34 &&
              selectedProv34.constituentCodes &&
              selectedProv34.constituentCodes.length > 1 && (
                <div>
                  <label className="block text-[11px] font-medium text-emerald-700 mb-1">
                    Khu vực trực thuộc {selectedProv34.name}:
                  </label>
                  <select
                    value={provinceCode || ''}
                    onChange={(e) => {
                      const code = e.target.value;
                      form.setValue('provinceCode', code, { shouldDirty: true });
                      form.setValue('districtCode', null);
                      form.setValue('wardCode', null);
                      const p = provinces.data?.data.find((x) => x.code === code);
                      setSelectedProvId(p?.id);
                      setSelectedDistId(undefined);
                    }}
                    className={`${selectCls} border-emerald-300 bg-emerald-50/40`}
                  >
                    <option value="">-- Chọn khu vực cụ thể --</option>
                    {selectedProv34.constituentCodes.map((code) => {
                      const p63 =
                        provinces.data?.data?.find((x) => x.code === code) ||
                        PROVINCES_63_MAP[code];
                      return (
                        <option key={code} value={code}>
                          {p63?.name || code}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
          </div>
        )}

        {mode === '63' ? (
          <>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Quận/Huyện</label>
              <select
                value={districtCode || ''}
                onChange={(e) => {
                  const code = e.target.value;
                  form.setValue('districtCode', code, { shouldDirty: true });
                  form.setValue('wardCode', null);
                  const d = districts.data?.data.find((x) => x.code === code);
                  setSelectedDistId(d?.id);
                }}
                className={selectCls}
                disabled={!selectedProvId || districts.isPending}
              >
                <option value="">-- Chọn --</option>
                {districts.data?.data?.map((d) => (
                  <option key={d.id} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Phường/Xã</label>
              <select
                value={wardCode || ''}
                onChange={(e) => {
                  form.setValue('wardCode', e.target.value, { shouldDirty: true });
                }}
                className={selectCls}
                disabled={!selectedDistId || wards.isPending}
              >
                <option value="">-- Chọn --</option>
                {wards.data?.data?.map((w) => (
                  <option key={w.id} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        ) : (
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center justify-between">
              <span>Phường/Xã trực thuộc Tỉnh (34 mới)</span>
              <span className="text-[10px] text-amber-700 font-normal">
                Chính quyền 2 cấp (Đã bãi bỏ cấp Huyện)
              </span>
            </label>
            <select
              value={wardCode || ''}
              onChange={(e) => {
                const code = e.target.value;
                form.setValue('wardCode', code, { shouldDirty: true });
                const foundWard = wards34Data?.find((w) => w.code === code);
                if (foundWard?.districtCode) {
                  form.setValue('districtCode', foundWard.districtCode, { shouldDirty: true });
                }
              }}
              className={selectCls}
              disabled={!selectedProvId || isLoadingWards34}
            >
              <option value="">
                {!selectedProvId
                  ? '-- Chọn Tỉnh trước --'
                  : isLoadingWards34
                    ? '-- Đang tải danh sách xã trực thuộc... --'
                    : '-- Chọn Phường / Xã trực thuộc Tỉnh --'}
              </option>
              {wards34Data?.map((w) => (
                <option key={w.id} value={w.code}>
                  {w.name} {w.districtName ? `(${w.districtName})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
