'use client';

import React from 'react';
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { Layers, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import {
  IProcessTemplate,
  IProcessTemplateStep,
} from '@/features/supply-chain/types/supplyChainTypes';
import { BatchCreationFormData } from './types';

interface Step2ProcessTemplateProps {
  form: UseFormReturn<BatchCreationFormData>;
  templates?: IProcessTemplate[];
  isLoadingTemplates: boolean;
  productId: number;
}

export default function Step2ProcessTemplate({
  form,
  templates,
  isLoadingTemplates,
  productId,
}: Step2ProcessTemplateProps) {
  return (
    <div
      id="tour-lot-step-2"
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Quy trình sản xuất chuẩn</h2>
          <p className="text-slate-500 text-sm mt-1">
            Chọn một quy trình chuẩn đã được cấu hình cho sản phẩm này.
          </p>
        </div>
        {templates && templates.length > 0 && (
          <Link href={`/dashboard/san-pham/${productId}?tab=process_templates`}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300 shrink-0"
            >
              + Tạo quy trình mới
            </Button>
          </Link>
        )}
      </div>

      {isLoadingTemplates ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
          <p>Đang tải danh sách quy trình...</p>
        </div>
      ) : !templates || templates.length === 0 ? (
        <div
          id="tour-lot-step-2-empty"
          className="p-6 border border-amber-200 rounded-xl bg-amber-50 text-amber-800 text-sm flex gap-4 items-start"
        >
          <div className="p-2 bg-amber-100 rounded-lg shrink-0">
            <Layers className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold mb-1">Chưa có Quy trình chuẩn</p>
            <p className="text-amber-700/80 leading-relaxed mb-4">
              Sản phẩm này chưa được cấu hình Quy trình chuẩn. Vui lòng thiết lập quy trình mẫu
              trước khi tạo lô sản xuất.
            </p>
            <Link href={`/dashboard/san-pham/${productId}?tab=process_templates`}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                Thiết lập Quy trình mẫu
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {templates.map((template: IProcessTemplate) => {
            const isSelected = form.watch('processTemplateId') === template.id;
            return (
              <div
                key={template.id}
                onClick={() => form.setValue('processTemplateId', template.id)}
                className={`p-5 rounded-2xl cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 shadow-md shadow-blue-500/10 ring-4 ring-blue-500/5'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900 text-lg">{template.name}</h4>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                        v{template.versionNumber || 1.0}
                      </span>
                    </div>
                    {template.description && (
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {template.description}
                      </p>
                    )}
                  </div>
                  <div
                    className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                </div>

                {isSelected && template.steps && template.steps.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-blue-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                      Các bước trong quy trình
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {template.steps.map((s: IProcessTemplateStep) => (
                        <div
                          key={s.id}
                          className="text-xs bg-white border border-blue-100 text-blue-700 px-3 py-1.5 rounded-lg font-semibold shadow-sm"
                        >
                          {s.stepOrder}. {s.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {form.formState.errors.processTemplateId && (
        <p className="text-sm text-red-500 font-medium">
          {form.formState.errors.processTemplateId.message}
        </p>
      )}
    </div>
  );
}
