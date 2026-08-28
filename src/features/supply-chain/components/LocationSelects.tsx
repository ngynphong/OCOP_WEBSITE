import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LocationSelects({ form }: { form: UseFormReturn<any> }) {
  const provinceCode = form.watch('provinceCode');
  const districtCode = form.watch('districtCode');
  const wardCode = form.watch('wardCode');

  const [selectedProvId, setSelectedProvId] = useState<number>();
  const [selectedDistId, setSelectedDistId] = useState<number>();

  const { provinces, districts, wards } = useLocationQuery(selectedProvId, selectedDistId);

  // Sync initial codes to IDs
  useEffect(() => {
    if (provinces.data?.data && provinceCode) {
      const p = provinces.data.data.find((x) => x.code === provinceCode);
      if (p && p.id !== selectedProvId) setSelectedProvId(p.id);
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-xs font-semibold text-stone-700 mb-1">Tỉnh/Thành</label>
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
          <option value="">-- Chọn --</option>
          {provinces.data?.data?.map((p) => (
            <option key={p.id} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

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
    </div>
  );
}
