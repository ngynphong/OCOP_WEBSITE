'use client';

import React, { useState } from 'react';
import { IProcessTemplateStep, IEventInfo } from '../types/supplyChainTypes';
import {
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Sprout,
  Droplets,
  Wheat,
  Layers,
  Boxes,
  Award,
  ShieldCheck,
  Calendar,
  Image as ImageIcon,
  Camera,
  MapPin,
  Video,
  ListChecks,
  FileCheck2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface StandardProcessWorkflowProps {
  processTemplateName?: string;
  templateSteps: IProcessTemplateStep[];
  events?: IEventInfo[];
}

interface IEvidenceRuleObj {
  photo?: 'REQUIRED' | 'OPTIONAL' | 'DISABLED';
  gps?: 'REQUIRED' | 'OPTIONAL' | 'DISABLED';
  video?: 'REQUIRED' | 'OPTIONAL' | 'DISABLED';
}

interface IDynamicFieldSchemaItem {
  key?: string;
  name?: string;
  type?: string;
  label?: string;
  required?: boolean;
  unit?: string;
}

const getStepTypeConfig = (stepType: string) => {
  const upper = stepType?.toUpperCase() || '';
  switch (upper) {
    case 'PLANTING':
    case 'FARMING':
      return {
        label: 'Gieo trồng & Làm đất',
        icon: <Sprout className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
    case 'CARE':
      return {
        label: 'Chăm sóc & Dinh dưỡng',
        icon: <Droplets className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
    case 'HARVESTING':
    case 'HARVEST':
      return {
        label: 'Thu hoạch',
        icon: <Wheat className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
    case 'PROCESSING':
      return {
        label: 'Sơ chế & Chế biến',
        icon: <Layers className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
    case 'PACKAGING':
      return {
        label: 'Đóng gói & Dán nhãn',
        icon: <Boxes className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
    case 'CERTIFICATION':
    case 'TESTING':
      return {
        label: 'Kiểm định & Chứng nhận OCOP',
        icon: <Award className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
    default:
      return {
        label: 'Công đoạn chuẩn',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />,
        color: 'text-stone-700 bg-stone-100/90 border-stone-200',
      };
  }
};

const parseEvidenceRule = (ruleString?: string): IEvidenceRuleObj | null => {
  if (!ruleString) return null;
  try {
    return JSON.parse(ruleString);
  } catch {
    return null;
  }
};

const parseDynamicFields = (schemaString?: string): IDynamicFieldSchemaItem[] => {
  if (!schemaString) return [];
  try {
    const parsed = JSON.parse(schemaString);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
};

export const StandardProcessWorkflow = ({
  processTemplateName,
  templateSteps = [],
  events = [],
}: StandardProcessWorkflowProps) => {
  const [expandedStepIds, setExpandedStepIds] = useState<Record<number, boolean>>({});

  if (!templateSteps || templateSteps.length === 0) {
    return null;
  }

  const sortedSteps = [...templateSteps].sort((a, b) => a.stepOrder - b.stepOrder);

  // Tính số bước đã hoàn thành dựa vào events khớp templateStepId
  const completedStepCount = sortedSteps.filter((step) =>
    events.some((e) => e.templateStepId === step.id),
  ).length;

  const totalSteps = sortedSteps.length;
  const progressPercent = Math.round((completedStepCount / totalSteps) * 100);

  const toggleStep = (stepId: number) => {
    setExpandedStepIds((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      {/* Header quy trình chuẩn */}
      <div className="p-4 border-b border-stone-100 bg-stone-50/40">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
            </div>
            <div>
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Quy trình sản xuất chuẩn OCOP
              </h3>
              {processTemplateName && (
                <p className="text-xs text-stone-500 font-medium mt-0.5">
                  Quy chuẩn áp dụng:{' '}
                  <span className="font-bold text-stone-800">{processTemplateName}</span>
                </p>
              )}
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {completedStepCount}/{totalSteps} công đoạn hoàn tất
          </span>
        </div>

        {/* Thanh tiến độ hoàn thành các công đoạn */}
        <div className="mt-3.5 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px] font-semibold text-stone-500">
            <span>Tiến độ thực hiện quy chuẩn</span>
            <span className="font-bold text-emerald-800">{progressPercent}%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Danh sách các công đoạn chuẩn */}
      <div className="p-4 flex flex-col gap-3">
        {sortedSteps.map((step, idx) => {
          const stepConfig = getStepTypeConfig(step.stepType);
          const matchingEvents = events.filter((e) => e.templateStepId === step.id);
          const isCompleted = matchingEvents.length > 0;
          const isExpanded = !!expandedStepIds[step.id];

          // Phân tích quy định bằng chứng & chỉ tiêu đo đạc từ backend
          const evidenceRule = parseEvidenceRule(step.evidenceRule);
          const dynamicFields = parseDynamicFields(step.dynamicFieldsSchema);

          // Lấy ngày thực hiện mới nhất của công đoạn này
          const latestEvent = isCompleted ? matchingEvents[matchingEvents.length - 1] : null;
          const latestDate = latestEvent?.eventAt || latestEvent?.recordedAt;

          // Đếm số ảnh / tài liệu đính kèm
          const evidenceCount = matchingEvents.reduce(
            (sum, ev) => sum + (ev.evidenceDocuments?.length || 0),
            0,
          );

          return (
            <div
              key={step.id}
              className={cn(
                'rounded-xl border transition-all duration-200 overflow-hidden',
                isCompleted
                  ? 'bg-white border-stone-200/90 hover:border-emerald-300'
                  : 'bg-stone-50/40 border-stone-200/80 hover:border-stone-300',
              )}
            >
              {/* Thanh tiêu đề của từng bước */}
              <button
                type="button"
                onClick={() => toggleStep(step.id)}
                className="w-full p-3 flex items-start justify-between gap-3 text-left cursor-pointer hover:bg-black/2 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Số thứ tự hoặc Icon check */}
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 border shadow-2xs',
                      isCompleted
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-white text-stone-500 border-stone-300',
                    )}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>

                  {/* Thông tin chính */}
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          'text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1',
                          stepConfig.color,
                        )}
                      >
                        {stepConfig.icon}
                        <span>{stepConfig.label}</span>
                      </span>

                      {/* Trạng thái hoàn thành */}
                      {isCompleted ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Đã thực hiện
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          Chờ thực hiện
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 leading-snug">{step.title}</h4>

                    {/* Metadata nếu đã có sự kiện thực tế */}
                    <div className="flex items-center gap-3 text-[11px] text-stone-500 flex-wrap">
                      {latestDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-stone-400" />
                          Thực hiện: {format(new Date(latestDate), 'dd/MM/yyyy')}
                        </span>
                      )}
                      {evidenceCount > 0 && (
                        <span className="flex items-center gap-1 text-emerald-800 font-medium">
                          <ImageIcon className="w-3 h-3 text-emerald-600" />
                          {evidenceCount} ảnh thực địa
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nút mở rộng xem chi tiết mô tả */}
                <div className="shrink-0 text-stone-400 p-1">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Nội dung chi tiết mở rộng: Hướng dẫn kỹ thuật chuẩn & Quy định bằng chứng */}
              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-stone-100/80 flex flex-col gap-2.5">
                  {/* Hộp 1: Hướng dẫn kỹ thuật chuẩn */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200/80 flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                      Tiêu chuẩn & Hướng dẫn kỹ thuật:
                    </span>
                    <p className="text-xs text-stone-700 leading-relaxed font-normal whitespace-pre-line">
                      {step.description || 'Tiêu chuẩn kỹ thuật áp dụng theo hồ sơ OCOP công bố.'}
                    </p>

                    {step.estimatedDays && (
                      <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 pt-2 border-t border-stone-100">
                        <Clock className="w-3 h-3 text-stone-400" />
                        Thời gian dự kiến thực hiện:{' '}
                        <strong className="text-stone-700">{step.estimatedDays} ngày</strong>
                      </div>
                    )}
                  </div>

                  {/* Hộp 2: Quy định bằng chứng minh bạch (nếu có) */}
                  {evidenceRule && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                        Quy định bằng chứng:
                      </span>
                      {evidenceRule.photo === 'REQUIRED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-700 border border-stone-200">
                          <Camera className="w-3 h-3 text-stone-500" />
                          Bắt buộc ảnh chụp
                        </span>
                      )}
                      {evidenceRule.gps === 'REQUIRED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-700 border border-stone-200">
                          <MapPin className="w-3 h-3 text-stone-500" />
                          Bắt buộc định vị GPS
                        </span>
                      )}
                      {evidenceRule.video === 'REQUIRED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-700 border border-stone-200">
                          <Video className="w-3 h-3 text-stone-500" />
                          Bắt buộc video
                        </span>
                      )}
                    </div>
                  )}

                  {/* Hộp 3: Chỉ tiêu kỹ thuật chuẩn cần đo đạc (dynamicFieldsSchema) */}
                  {dynamicFields.length > 0 && (
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/60 flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider flex items-center gap-1">
                        <ListChecks className="w-3 h-3 text-stone-500" />
                        Chỉ tiêu kỹ thuật chuẩn cần theo dõi:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dynamicFields.map((df, dfIdx) => (
                          <span
                            key={df.key ? `${df.key}-${dfIdx}` : dfIdx}
                            className="text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-700 flex items-center gap-1"
                          >
                            <FileCheck2 className="w-3 h-3 text-emerald-600" />
                            {df.label || df.name}
                            {df.required && <span className="text-red-500 font-bold">*</span>}
                            {df.unit && (
                              <span className="text-[10px] text-stone-400">({df.unit})</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hộp 4: Đối chiếu nhật ký thực tế đã ghi nhận (nếu có) */}
                  {matchingEvents.length > 0 && (
                    <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-200 flex flex-col gap-1.5">
                      <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Đã ghi nhận {matchingEvents.length} nhật ký thực tế tại hiện trường
                      </span>
                      <div className="flex flex-col gap-1">
                        {matchingEvents.map((ev, evIdx) => (
                          <div
                            key={`${ev.sourceType || 'ev'}-${ev.stepType || 'step'}-${ev.id ?? 'noId'}-${evIdx}`}
                            className="bg-white p-2 rounded-lg border border-emerald-100 flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900">{ev.stepTitle}</span>
                              {ev.eventAt && (
                                <span className="text-stone-400 text-[11px]">
                                  {format(new Date(ev.eventAt), 'dd/MM/yyyy HH:mm')}
                                </span>
                              )}
                            </div>
                            {ev.dataHash && (
                              <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                SHA-256 ✓
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
