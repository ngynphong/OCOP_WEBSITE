import React, { useState, useEffect } from 'react';
import { IEventInfo, IEvidenceDocument, IProcessTemplateStep } from '../types/supplyChainTypes';
import { format } from 'date-fns';
import {
  Clock,
  CheckCircle,
  Package,
  Truck,
  TestTube,
  Factory,
  ShieldCheck,
  FileText,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

interface BatchEventTimelineProps {
  events: IEventInfo[] | null;
  templateSteps?: IProcessTemplateStep[];
}

const getEventIcon = (stepType: string) => {
  switch (stepType) {
    case 'PRODUCTION':
      return <Factory className="w-5 h-5" />;
    case 'PROCESSING':
      return <Package className="w-5 h-5" />;
    case 'TESTING':
      return <TestTube className="w-5 h-5" />;
    case 'TRANSPORT':
    case 'DISTRIBUTION':
      return <Truck className="w-5 h-5" />;
    default:
      return <CheckCircle className="w-5 h-5" />;
  }
};

const getEventColor = (stepType: string) => {
  switch (stepType) {
    case 'PRODUCTION':
      return 'bg-blue-100 text-blue-600';
    case 'PROCESSING':
      return 'bg-indigo-100 text-indigo-600';
    case 'TESTING':
      return 'bg-amber-100 text-amber-600';
    case 'TRANSPORT':
      return 'bg-green-100 text-green-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
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
    <span className="leading-tight" title={address || 'Đang tải vị trí...'}>
      {address || 'Đang tải...'}
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
      <div className="text-center py-8 text-gray-500">
        Chưa có nhật ký nào được ghi nhận cho lô sản xuất này.
      </div>
    );
  }

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {events.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== events.length - 1 ? (
                <span
                  className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <span
                    className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${getEventColor(
                      event.stepType,
                    )}`}
                  >
                    {getEventIcon(event.stepType)}
                  </span>
                </div>
                <div className="min-w-0 flex-1 py-0.5">
                  <div className="text-sm leading-8 text-gray-500 flex items-center gap-2 flex-wrap">
                    <span>
                      <span className="mr-0.5 font-medium text-gray-900">{event.stepTitle}</span>{' '}
                      vào ngày{' '}
                      <span className="font-medium text-gray-900">
                        {format(new Date(event.eventAt), 'dd/MM/yyyy HH:mm')}
                      </span>
                    </span>
                    {event.dataHash && (
                      <div className="group relative flex items-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 cursor-help border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          Nguyên bản
                        </span>
                        <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-72 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-20 border border-slate-700">
                          <p className="font-semibold mb-1 text-emerald-400">
                            🛡️ Đã xác thực toàn vẹn dữ liệu
                          </p>
                          <p className="text-slate-300 mb-2">
                            Hệ thống đã đối chiếu mã băm khớp với dữ liệu gốc. Dữ liệu chưa từng bị
                            chỉnh sửa.
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono break-all bg-slate-900 p-1.5 rounded border border-slate-700">
                            {event.dataHash}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-md p-4 border border-gray-100">
                    <div className="mb-2 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Ghi nhận lúc: {format(new Date(event.recordedAt), 'dd/MM/yyyy HH:mm')}
                      <span className="ml-2">Bởi: {event.recordedBy}</span>
                    </div>
                    {event.eventData &&
                      (() => {
                        let parsedData = null;
                        try {
                          parsedData =
                            typeof event.eventData === 'string'
                              ? JSON.parse(event.eventData)
                              : event.eventData;
                        } catch {
                          // Not valid JSON string
                        }

                        if (
                          parsedData &&
                          typeof parsedData === 'object' &&
                          !Array.isArray(parsedData)
                        ) {
                          return (
                            <div className="bg-white rounded border border-gray-200 mt-2 overflow-hidden">
                              <ul className="divide-y divide-gray-100">
                                {Object.entries(parsedData).map(([key, value]) => {
                                  if (key.toLowerCase() === 'id' || key === 'addToStory')
                                    return null;
                                  const fieldLabel = getFieldLabel(event.templateStepId, key);
                                  return (
                                    <li key={key} className="flex px-3 py-2 text-sm sm:text-xs">
                                      <span className="font-semibold text-stone-700 w-2/5">
                                        {fieldLabel}
                                      </span>
                                      <span className="text-stone-900 font-medium w-3/5 break-words">
                                        {typeof value === 'object' &&
                                        value !== null &&
                                        'value' in (value as Record<string, unknown>)
                                          ? `${(value as Record<string, unknown>).value} ${(value as Record<string, unknown>).unit || ''}`.trim()
                                          : String(value)}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          );
                        }

                        return (
                          <pre className="text-xs bg-white p-2 mt-2 rounded border border-gray-200 overflow-x-auto">
                            {typeof event.eventData === 'string'
                              ? event.eventData
                              : JSON.stringify(event.eventData, null, 2)}
                          </pre>
                        );
                      })()}

                    {/* Hiển thị cảnh báo AI chạy ngầm nếu có */}
                    {event.aiAnalysisResult &&
                      (() => {
                        try {
                          const aiData = JSON.parse(event.aiAnalysisResult);
                          if (aiData.hasViolation) {
                            return (
                              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                                <span className="text-red-500 text-lg flex-shrink-0 mt-0.5">
                                  ⚠️
                                </span>
                                <div>
                                  <h4 className="text-sm font-semibold text-red-800">
                                    Hệ thống phát hiện vi phạm
                                  </h4>
                                  <p className="text-xs text-red-700 mt-1">
                                    {aiData.violationMessage}
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        } catch {
                          return null;
                        }
                      })()}

                    {/* Hiển thị evidenceDocuments nếu có */}
                    {event.evidenceDocuments && event.evidenceDocuments.length > 0 && (
                      <div className="mt-4 border-t border-gray-100 pt-3">
                        <p className="text-xs font-semibold text-gray-500 mb-2">
                          Ảnh / Tài liệu đính kèm:
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {event.evidenceDocuments.map((doc: IEvidenceDocument) => (
                            <div
                              key={doc.id}
                              className="flex items-center gap-3 p-2.5 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-sm transition-all w-fit max-w-full"
                            >
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex-shrink-0"
                              >
                                {doc.mimeType?.startsWith('image/') ? (
                                  <Image
                                    src={doc.fileUrl}
                                    alt={doc.fileName || 'Ảnh đính kèm'}
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-100 shadow-sm"
                                    width={64}
                                    height={64}
                                  />
                                ) : (
                                  <div className="w-16 h-16 flex flex-col items-center justify-center bg-gray-50 text-gray-400 rounded-lg border border-gray-100 shadow-sm">
                                    <FileText className="w-6 h-6 mb-1" />
                                    <span className="text-[8px] truncate w-full px-1 text-center font-medium">
                                      FILE
                                    </span>
                                  </div>
                                )}
                              </a>

                              <div className="flex flex-col min-w-0 justify-center">
                                <a
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs font-semibold text-gray-700 hover:text-emerald-600 truncate mb-1"
                                  title="Xem tài liệu"
                                >
                                  {doc.mimeType?.startsWith('image/')
                                    ? 'Hình ảnh đính kèm'
                                    : 'Tài liệu đính kèm'}
                                </a>

                                {doc.latitude && doc.longitude && (
                                  <a
                                    href={`https://www.google.com/maps?q=${doc.latitude},${doc.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-start gap-1 group"
                                    title="Xem vị trí trên bản đồ"
                                  >
                                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] text-gray-500 group-hover:text-blue-600 transition-colors leading-tight">
                                      <AddressDisplay lat={doc.latitude} lng={doc.longitude} />
                                    </span>
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
