'use client';

import React, { useState, useEffect } from 'react';
import { IEventInfo, IEvidenceDocument, IProcessTemplateStep } from '../types/supplyChainTypes';
import { format } from 'date-fns';
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  ShieldCheck,
  FileText,
  MapPin,
  Sprout,
  Droplets,
  Wheat,
  Layers,
  Boxes,
  Award,
  Thermometer,
  Wind,
  Sun,
  Scale,
  Cpu,
  User,
  Smartphone,
  ExternalLink,
  Link as LinkIcon,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BatchEventTimelineProps {
  events: IEventInfo[] | null;
  templateSteps?: IProcessTemplateStep[];
}

const getEventIcon = (stepType: string) => {
  const upper = stepType?.toUpperCase() || '';
  switch (upper) {
    case 'PLANTING':
    case 'FARMING':
      return <Sprout className="w-5 h-5" />;
    case 'CARE':
      return <Droplets className="w-5 h-5" />;
    case 'HARVESTING':
    case 'HARVEST':
      return <Wheat className="w-5 h-5" />;
    case 'PROCESSING':
      return <Layers className="w-5 h-5" />;
    case 'PACKAGING':
      return <Boxes className="w-5 h-5" />;
    case 'TESTING':
    case 'CERTIFICATION':
      return <Award className="w-5 h-5" />;
    case 'PRODUCTION':
      return <Package className="w-5 h-5" />;
    case 'TRANSPORT':
    case 'DISTRIBUTION':
      return <Truck className="w-5 h-5" />;
    default:
      return <CheckCircle className="w-5 h-5" />;
  }
};

const getEventColor = (_stepType: string) => {
  // Chuẩn hóa màu sắc thống nhất thương hiệu OCOP Emerald & Stone
  return 'bg-emerald-50 text-emerald-800 ring-4 ring-emerald-50/70 border border-emerald-200/80';
};

const getSourceTypeBadge = (sourceType?: string) => {
  const upper = sourceType?.toUpperCase() || '';
  switch (upper) {
    case 'IOT_SENSOR':
      return {
        label: 'Cảm biến IoT',
        color: 'bg-stone-100 text-stone-700 border-stone-200',
        icon: <Cpu className="w-3 h-3 text-stone-500" />,
      };
    case 'SELLER_DECLARED':
      return {
        label: 'Chủ hộ kê khai',
        color: 'bg-stone-100 text-stone-700 border-stone-200',
        icon: <User className="w-3 h-3 text-stone-500" />,
      };
    case 'ADMIN_VERIFIED':
      return {
        label: 'Kiểm định viên',
        color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        icon: <ShieldCheck className="w-3 h-3 text-emerald-600" />,
      };
    case 'USER_INPUT':
    default:
      return {
        label: 'Ghi nhận thực địa',
        color: 'bg-stone-100 text-stone-600 border-stone-200',
        icon: <CheckCircle className="w-3 h-3 text-stone-400" />,
      };
  }
};

const getMetricIcon = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('nhiệt độ') || lower.includes('temp')) {
    return <Thermometer className="w-3.5 h-3.5 text-stone-500" />;
  }
  if (lower.includes('độ ẩm') || lower.includes('humid') || lower.includes('nước')) {
    return <Droplets className="w-3.5 h-3.5 text-stone-500" />;
  }
  if (lower.includes('gió') || lower.includes('wind')) {
    return <Wind className="w-3.5 h-3.5 text-stone-500" />;
  }
  if (lower.includes('thời tiết') || lower.includes('nắng')) {
    return <Sun className="w-3.5 h-3.5 text-stone-500" />;
  }
  if (
    lower.includes('sản lượng') ||
    lower.includes('khối lượng') ||
    lower.includes('trọng lượng')
  ) {
    return <Scale className="w-3.5 h-3.5 text-stone-500" />;
  }
  return <Clock className="w-3.5 h-3.5 text-stone-400" />;
};

const AddressDisplay = ({ lat, lng }: { lat: number; lng: number }) => {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    const fetchAddress = async () => {
      try {
        const res = await fetch(`/api/geocoding/reverse?lat=${lat}&lon=${lng}`);
        const data = await res.json();
        if (!isCancelled && data && data.display_name) {
          const parts = data.display_name.split(',').map((s: string) => s.trim());
          const cleanParts = parts.filter(
            (p: string) => !/^\d{5,6}$/.test(p) && p !== 'Việt Nam' && p !== 'Vietnam',
          );
          setAddress(cleanParts.join(', '));
        } else if (!isCancelled) {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      } catch (_error) {
        if (!isCancelled) {
          setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        }
      }
    };
    fetchAddress();
    return () => {
      isCancelled = true;
    };
  }, [lat, lng]);

  return (
    <span className="leading-tight truncate max-w-[200px]" title={address || 'Đang tải vị trí...'}>
      {address || 'Đang tải vị trí...'}
    </span>
  );
};

export const BatchEventTimeline = ({ events, templateSteps }: BatchEventTimelineProps) => {
  const getFieldLabel = (templateStepId: number, key: string): string => {
    if (!templateSteps || !templateStepId) return key;
    const step = templateSteps.find((s) => s.id === templateStepId);
    if (!step?.dynamicFieldsSchema) return key;
    try {
      const parsed: unknown = JSON.parse(step.dynamicFieldsSchema);
      if (Array.isArray(parsed)) {
        const found = (parsed as Array<{ key?: string; name?: string; label?: string }>).find(
          (f) => f.key === key || f.name === key,
        );
        if (found?.label) return found.label;
      }
    } catch {}
    return key;
  };

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        Chưa có nhật ký nào được ghi nhận cho lô sản xuất này.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => {
          const sourceBadge = getSourceTypeBadge(event.sourceType);

          // Xử lý eventData
          let parsedData: Record<string, unknown> | null = null;
          let isPlainText = false;

          if (event.eventData) {
            if (typeof event.eventData === 'string') {
              try {
                const parsed = JSON.parse(event.eventData);
                if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
                  parsedData = parsed as Record<string, unknown>;
                } else {
                  isPlainText = true;
                }
              } catch {
                isPlainText = true;
              }
            } else if (typeof event.eventData === 'object' && !Array.isArray(event.eventData)) {
              parsedData = event.eventData as Record<string, unknown>;
            }
          }

          // Kiểm tra xem parsedData có key nào hiển thị không
          const validDataEntries = parsedData
            ? Object.entries(parsedData).filter(
                ([key, value]) =>
                  key.toLowerCase() !== 'id' &&
                  key !== 'addToStory' &&
                  value !== null &&
                  value !== undefined &&
                  value !== '',
              )
            : [];

          return (
            <li key={event.id || eventIdx}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span
                    className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-stone-200"
                    aria-hidden="true"
                  />
                ) : null}

                <div className="relative flex items-start space-x-3">
                  {/* Icon loại công đoạn */}
                  <div className="relative">
                    <span
                      className={`h-10 w-10 rounded-full flex items-center justify-center ring-4 shadow-xs ${getEventColor(
                        event.stepType,
                      )}`}
                    >
                      {getEventIcon(event.stepType)}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1 py-0.5">
                    {/* Header sự kiện */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-stone-900 text-sm">{event.stepTitle}</h4>

                        {/* Nguồn ghi nhận */}
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border',
                            sourceBadge.color,
                          )}
                        >
                          {sourceBadge.icon}
                          <span>{sourceBadge.label}</span>
                        </span>

                        {/* Chứng thực Blockchain SHA-256 */}
                        {event.dataHash && (
                          <div className="group relative inline-flex items-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-help">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Khối SHA-256
                            </span>
                            {/* Tooltip Blockchain */}
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-72 p-3 bg-stone-900 text-white text-xs rounded-xl shadow-2xl z-30 border border-stone-700">
                              <p className="font-bold mb-1 text-emerald-400 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Toàn vẹn Blockchain
                              </p>
                              <p className="text-stone-300 text-[11px] mb-2 leading-relaxed">
                                Dữ liệu sự kiện được ký băm mật mã học SHA-256 bất biến.
                              </p>
                              <div className="space-y-1 font-mono text-[10px] bg-black/50 p-2 rounded border border-stone-800">
                                <p className="text-stone-400 break-all">Hash: {event.dataHash}</p>
                                <p className="text-stone-500 break-all">
                                  Prev:{' '}
                                  {event.previousHash === 'GENESIS'
                                    ? 'Khối khởi tạo (GENESIS)'
                                    : event.previousHash || '---'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Cờ khối khởi tạo nếu có */}
                        {event.previousHash === 'GENESIS' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                            <LinkIcon className="w-2.5 h-2.5 text-stone-500" />
                            Genesis
                          </span>
                        )}
                      </div>

                      {/* Thời gian & Người ghi nhận */}
                      <div className="text-xs text-stone-500 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          Thời điểm:{' '}
                          {event.eventAt
                            ? format(new Date(event.eventAt), 'dd/MM/yyyy HH:mm')
                            : '---'}
                        </span>
                        {event.recordedBy && (
                          <span className="text-[11px] text-stone-400">
                            Ghi bởi: <strong className="text-stone-600">{event.recordedBy}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Khối Thông số đo lường sinh thái & kỹ thuật (eventData) */}
                    {validDataEntries.length > 0 && (
                      <div className="mt-2.5 grid grid-cols-2 sm:grid-cols-3 gap-2 bg-stone-50/70 p-2.5 rounded-xl border border-stone-200/70">
                        {validDataEntries.map(([key, value]) => {
                          const fieldLabel = getFieldLabel(event.templateStepId, key);
                          const icon = getMetricIcon(fieldLabel);
                          const displayValue =
                            typeof value === 'object' &&
                            value !== null &&
                            'value' in (value as Record<string, unknown>)
                              ? `${(value as Record<string, unknown>).value} ${(value as Record<string, unknown>).unit || ''}`.trim()
                              : String(value);

                          return (
                            <div
                              key={key}
                              className="bg-white p-2 rounded-lg border border-stone-100 flex flex-col gap-0.5 shadow-2xs"
                            >
                              <span className="text-[10px] font-semibold text-stone-500 flex items-center gap-1 truncate">
                                {icon}
                                {fieldLabel}
                              </span>
                              <span className="text-xs font-bold text-stone-900 truncate">
                                {displayValue}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Trường hợp eventData là chuỗi text tự do */}
                    {isPlainText &&
                      event.eventData &&
                      typeof event.eventData === 'string' &&
                      event.eventData.trim() !== '' &&
                      event.eventData.trim() !== '{}' && (
                        <div className="mt-2 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200 font-medium">
                          {event.eventData}
                        </div>
                      )}

                    {/* Cảnh báo AI hoặc kết quả phân tích AI */}
                    {event.isFlaggedByAi && (
                      <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-bold text-red-800">
                            Cảnh báo AI: Phát hiện nghi vấn bất thường
                          </h5>
                          {event.aiAnalysisResult && (
                            <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">
                              {event.aiAnalysisResult}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Danh sách Bằng chứng thực địa / Ảnh chụp */}
                    {event.evidenceDocuments && event.evidenceDocuments.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                          Bằng chứng hình ảnh & dữ liệu hiện trường:
                        </span>

                        <div className="flex flex-wrap gap-2.5">
                          {event.evidenceDocuments.map((doc: IEvidenceDocument) => {
                            const rawUrl = doc.fileUrl ? doc.fileUrl.trim() : '';
                            const isValidUrl =
                              rawUrl !== '' &&
                              rawUrl !== 'null' &&
                              rawUrl !== 'undefined' &&
                              (rawUrl.startsWith('http://') ||
                                rawUrl.startsWith('https://') ||
                                rawUrl.startsWith('/'));

                            const isImage =
                              isValidUrl &&
                              (Boolean(doc.mimeType?.startsWith('image/')) ||
                                Boolean(rawUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i)));

                            return (
                              <div
                                key={doc.id}
                                className="flex items-center gap-2.5 p-2 bg-white border border-stone-200 rounded-xl hover:border-emerald-300 hover:shadow-xs transition-all max-w-full"
                              >
                                {isImage ? (
                                  <a
                                    href={rawUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden border border-stone-100 group"
                                  >
                                    <Image
                                      src={rawUrl}
                                      alt={doc.fileName || 'Ảnh thực địa'}
                                      fill
                                      className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                  </a>
                                ) : (
                                  <div className="w-14 h-14 shrink-0 rounded-lg bg-stone-50 border border-stone-200 flex flex-col items-center justify-center text-stone-400">
                                    <FileText className="w-5 h-5 mb-0.5" />
                                    <span className="text-[9px] font-bold">DOC</span>
                                  </div>
                                )}

                                <div className="flex flex-col gap-0.5 min-w-0 pr-1">
                                  {isValidUrl ? (
                                    <a
                                      href={rawUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-xs font-bold text-stone-800 hover:text-emerald-700 truncate flex items-center gap-1 max-w-[170px]"
                                      title={doc.fileName || 'Xem tài liệu'}
                                    >
                                      {doc.fileName || 'Tài liệu hiện trường'}
                                      <ExternalLink className="w-3 h-3 shrink-0 text-stone-400" />
                                    </a>
                                  ) : (
                                    <span
                                      className="text-xs font-bold text-stone-800 truncate max-w-[170px]"
                                      title={doc.fileName || 'Tài liệu hiện trường'}
                                    >
                                      {doc.fileName || 'Tài liệu hiện trường'}
                                    </span>
                                  )}

                                  {/* Thông tin thiết bị chụp */}
                                  {doc.deviceInfo && (
                                    <span className="text-[10px] text-stone-500 flex items-center gap-1">
                                      <Smartphone className="w-3 h-3 text-stone-400" />
                                      {doc.deviceInfo}
                                    </span>
                                  )}

                                  {/* Tọa độ GPS & Link bản đồ */}
                                  {doc.latitude && doc.longitude && (
                                    <a
                                      href={`https://www.google.com/maps?q=${doc.latitude},${doc.longitude}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] text-emerald-700 hover:underline flex items-center gap-1"
                                      title="Xem vị trí định vị trên bản đồ"
                                    >
                                      <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                                      <AddressDisplay lat={doc.latitude} lng={doc.longitude} />
                                    </a>
                                  )}

                                  {/* Trạng thái xác minh tài liệu */}
                                  {doc.verificationStatus && (
                                    <span
                                      className={cn(
                                        'text-[9px] font-bold px-1.5 py-0.2 rounded w-fit mt-0.5',
                                        doc.verificationStatus === 'VERIFIED'
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : 'bg-stone-100 text-stone-600',
                                      )}
                                    >
                                      {doc.verificationStatus === 'VERIFIED'
                                        ? 'Đã đối soát'
                                        : 'Bản lưu trữ'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
