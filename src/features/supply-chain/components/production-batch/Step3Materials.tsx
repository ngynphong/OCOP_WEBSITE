'use client';

import React from 'react';
import Link from 'next/link';
import { UseFormReturn, FieldArrayWithId } from 'react-hook-form';
import { Plus, ExternalLink, AlertCircle, ChevronRight, Droplets, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { ISourceFacility } from '@/features/supply-chain/types/materialSourceTypes';
import { BatchCreationFormData, MaterialLotOption } from './types';

interface Step3MaterialsProps {
  form: UseFormReturn<BatchCreationFormData>;
  facilities?: ISourceFacility[];
  materialLotsData?: MaterialLotOption[];
  fields: FieldArrayWithId<BatchCreationFormData, 'materialsUsed', 'id'>[];
  append: (val: { materialLotId: number; quantity: number }) => void;
  remove: (index: number) => void;
  onOpenFacilityModal: () => void;
}

export default function Step3Materials({
  form,
  facilities,
  materialLotsData,
  fields,
  append,
  remove,
  onOpenFacilityModal,
}: Step3MaterialsProps) {
  const isClosedLoop = form.watch('isClosedLoop');

  return (
    <div
      id="tour-lot-step-3"
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Nguồn nguyên liệu sử dụng</h2>
          <p className="text-slate-500 text-sm mt-1">
            Khai báo nguồn nguyên liệu sử dụng cho lô hàng này.
          </p>
        </div>
      </div>

      <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...form.register('isClosedLoop')}
            className="mt-1 w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
            onChange={(e) => {
              form.setValue('isClosedLoop', e.target.checked);
              if (e.target.checked) {
                form.setValue('materialsUsed', []);
              }
            }}
          />
          <div>
            <span className="font-semibold text-emerald-900 block mb-1">
              Lô hàng khép kín (Tự trồng trọt / chăn nuôi)
            </span>
            <span className="text-sm text-emerald-700">
              Hệ thống sẽ tự động tạo Vụ canh tác/chăn nuôi tương ứng. Lô hàng này sẽ không cần chọn
              lô nguyên liệu.
            </span>
          </div>
        </label>

        {isClosedLoop && (
          <div className="mt-4 pl-7 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-stone-700">
                Cơ sở / Vùng trồng <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenFacilityModal}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm vùng trồng mới
                </button>
                <Link
                  href="/dashboard/nguon-nguyen-lieu?tab=FACILITY&create=true"
                  className="text-xs text-stone-500 hover:text-emerald-600 font-medium flex items-center gap-1 cursor-pointer"
                  title="Chuyển đến màn hình Quản lý Vùng trồng"
                >
                  Quản lý Vùng trồng <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {!facilities || facilities.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">
                      Chưa có Cơ sở / Vùng trồng nào được khai báo
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      Để tạo lô sản xuất khép kín, bạn cần khai báo ít nhất một cơ sở hoặc vùng
                      trồng trong hệ thống.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={onOpenFacilityModal}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
                  >
                    <Plus className="mr-1 w-3.5 h-3.5" /> Khai báo ngay tại đây
                  </Button>
                  <Link
                    href="/dashboard/nguon-nguyen-lieu?tab=FACILITY&create=true"
                    className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-white hover:bg-emerald-50 rounded-lg border border-emerald-300 transition-colors shadow-xs"
                  >
                    Đi đến màn hình Tạo vùng trồng <ExternalLink className="ml-1.5 w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative">
                <select
                  {...form.register('facilityId', { valueAsNumber: true })}
                  className="w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none bg-white"
                >
                  <option value="">-- Chọn Cơ sở / Vùng trồng --</option>
                  {facilities?.map((f: ISourceFacility) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            )}

            {form.formState.errors.facilityId && (
              <p className="text-red-500 text-xs mt-1">
                {form.formState.errors.facilityId.message}
              </p>
            )}
          </div>
        )}
      </div>

      {!isClosedLoop && (
        <>
          <div className="flex justify-end mb-4 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ materialLotId: 0, quantity: 1 })}
              className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
            >
              + Thêm nguyên liệu
            </Button>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <Droplets className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <h3 className="font-semibold text-slate-700 mb-1">Chưa có nguyên liệu</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Bạn có thể tạo lô sản xuất mà không cần khai báo nguyên liệu ngay lúc này, hoặc thêm
                nguyên liệu để hệ thống trừ kho tự động.
              </p>
              <Button
                type="button"
                onClick={() => append({ materialLotId: 0, quantity: 1 })}
                variant="primary"
              >
                Thêm nguyên liệu đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-4 items-start sm:items-end p-5 bg-slate-50/50 rounded-2xl border border-slate-200 group relative"
                >
                  <div className="flex-1 w-full space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Lô nguyên liệu</label>
                    <div className="relative">
                      <select
                        {...form.register(`materialsUsed.${index}.materialLotId`, {
                          valueAsNumber: true,
                        })}
                        className="w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white"
                      >
                        <option value={0}>Chọn lô nguyên liệu</option>
                        {materialLotsData?.map((lot: MaterialLotOption) => {
                          const disabled = lot.availableQuantity <= 0;
                          return (
                            <option key={lot.id} value={lot.id} disabled={disabled}>
                              {lot.code} - {lot.materialName} (Tồn: {lot.availableQuantity}{' '}
                              {lot.unit}) {disabled ? '(Hết)' : ''}
                            </option>
                          );
                        })}
                      </select>
                      <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
                    </div>
                    {form.formState.errors.materialsUsed?.[index]?.materialLotId && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.materialsUsed[index]?.materialLotId?.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full sm:w-40 space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">SL Sử dụng</label>
                    <input
                      type="number"
                      step="0.01"
                      {...form.register(`materialsUsed.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                      className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white"
                    />
                    {form.formState.errors.materialsUsed?.[index]?.quantity && (
                      <p className="text-xs text-red-500 font-medium">
                        {form.formState.errors.materialsUsed[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    className="w-full sm:w-auto p-3 sm:mb-0.5 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors flex justify-center items-center gap-2 border border-transparent hover:border-red-100"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="sm:hidden font-medium">Xóa nguyên liệu</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
