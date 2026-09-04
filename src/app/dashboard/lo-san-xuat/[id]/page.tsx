'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiPlus, FiZap } from 'react-icons/fi';
import {
  Sprout,
  MapPin,
  Calendar,
  User,
  Package,
  Printer,
  QrCode,
  CheckCircle,
  AlertOctagon,
  Ban,
  Maximize2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';
import { AddBatchEventForm } from '@/features/supply-chain/components/AddBatchEventForm';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { LotAssignmentsTab } from '@/features/supply-chain/components/LotAssignmentsTab';
import { PrintQrModal } from '@/features/supply-chain/components/PrintQrModal';
import {
  ILotQrCode,
  ILotAuditLog,
  TLotStatus,
  TQrStatus,
} from '@/features/supply-chain/types/supplyChainTypes';

const AuditDataRenderer = ({ data }: { data: unknown }) => {
  if (!data) return <span className="text-stone-500 italic">Trống</span>;

  let parsedData = data;
  if (typeof data === 'string') {
    try {
      parsedData = JSON.parse(data);
    } catch (_e) {
      return <span className="text-stone-600">{data}</span>;
    }
  }

  if (typeof parsedData !== 'object' || parsedData === null) {
    return <span className="text-stone-600">{String(parsedData)}</span>;
  }

  const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
      stepTitle: 'Công đoạn',
      eventData: 'Dữ liệu',
      timestamp: 'Thời điểm',
      actorEmail: 'Người thực hiện',
      actorName: 'Tên người thực hiện',
      notes: 'Ghi chú',
      quantity: 'Số lượng',
      unit: 'Đơn vị',
      lotCode: 'Mã lô',
      status: 'Trạng thái',
      productionDate: 'Ngày sản xuất',
      expiryDate: 'Hạn sử dụng',
      remainingQuantity: 'Tồn kho',
      reason: 'Lý do',
    };
    return keyMap[key] || key;
  };

  const renderValue = (value: unknown): React.ReactNode => {
    if (value === null || value === undefined)
      return <span className="text-stone-400 italic">Trống</span>;
    if (typeof value === 'boolean')
      return <span className="text-stone-600">{value ? 'Có' : 'Không'}</span>;

    if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
      try {
        const innerParsed = JSON.parse(value);
        if (
          typeof innerParsed === 'object' &&
          innerParsed !== null &&
          !Array.isArray(innerParsed)
        ) {
          return (
            <div className="pl-3 mt-1 space-y-1 border-l-2 border-stone-200">
              {Object.entries(innerParsed).map(([k, v]) => (
                <div key={k} className="text-[11px] flex gap-2">
                  <span className="font-medium text-stone-700 min-w-[80px]">{k}:</span>
                  <span className="text-stone-600">{String(v)}</span>
                </div>
              ))}
            </div>
          );
        }
      } catch (_e) {
        return <span className="text-stone-600">{value}</span>;
      }
    }

    if (Array.isArray(value) && value.length >= 3 && typeof value[0] === 'number') {
      const [y, m, d, h, mn] = value;
      if (y > 2000 && y < 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31) {
        let dateStr = `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
        if (h !== undefined && mn !== undefined) {
          dateStr += ` ${h.toString().padStart(2, '0')}:${mn.toString().padStart(2, '0')}`;
        }
        return <span className="text-stone-600">{dateStr}</span>;
      }
    }

    if (typeof value === 'object') {
      return (
        <pre className="text-[10px] text-stone-600 whitespace-pre-wrap">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return <span className="text-stone-600">{String(value)}</span>;
  };

  return (
    <div className="space-y-2 mt-1 bg-white p-2 rounded border border-stone-100">
      {Object.entries(parsedData as Record<string, unknown>).map(([key, value], idx) => (
        <div key={idx} className="text-xs">
          <span className="font-medium text-stone-800 capitalize">{formatKey(key)}:</span>{' '}
          {renderValue(value)}
        </div>
      ))}
    </div>
  );
};

export default function ProductionBatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lotId = Number(params.id);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedQrIds, setSelectedQrIds] = useState<number[]>([]);
  const [qrCount, setQrCount] = useState<number>(0);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [previewQr, setPreviewQr] = useState<ILotQrCode | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'INFO' | 'ASSIGNMENTS' | 'TIMELINE' | 'PACKAGING' | 'AUDIT'
  >('INFO');

  useEffect(() => {
    if (searchParams.get('action') === 'log') {
      setIsAddEventModalOpen(true);
    }
  }, [searchParams]);

  const {
    useGetProductionBatchDetail,
    useGenerateQrCodes,
    useGetLotQrCodes,
    useUpdateLotQrStatus,
    useGetLotAuditLogs,
  } = useProductionBatch();
  const { data: lotRes, isLoading } = useGetProductionBatchDetail(lotId);
  const lot = lotRes?.data;

  const { data: qrsRes } = useGetLotQrCodes(lotId);
  const qrs = qrsRes?.data || [];
  const generateQrMutation = useGenerateQrCodes();
  const updateQrStatusMutation = useUpdateLotQrStatus();

  const { data: auditLogsRes } = useGetLotAuditLogs(lotId, 1, 50);
  const auditLogs = auditLogsRes?.content || [];

  const templateSteps = lot?.templateSteps || [];

  const handleOpenQrModal = () => {
    setQrCount(lot?.quantity || 10);
    setIsQrModalOpen(true);
  };

  const handleConfirmGenerateQrs = () => {
    if (qrCount > 0) {
      generateQrMutation.mutate(
        { lotId, count: qrCount },
        {
          onSuccess: () => setIsQrModalOpen(false),
        },
      );
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedQrIds.length === qrs.length) {
      setSelectedQrIds([]);
    } else {
      setSelectedQrIds(qrs.map((q: ILotQrCode) => q.id));
    }
  };

  const handleToggleSelectQr = (id: number) => {
    setSelectedQrIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleBatchStatusUpdate = (status: TQrStatus) => {
    if (selectedQrIds.length === 0) return;
    updateQrStatusMutation.mutate(
      { lotId, data: { qrIds: selectedQrIds, status } },
      {
        onSuccess: () => {
          setSelectedQrIds([]);
        },
      },
    );
  };

  const qrsToPrint =
    selectedQrIds.length > 0 ? qrs.filter((q: ILotQrCode) => selectedQrIds.includes(q.id)) : qrs;

  const renderQrStatusBadge = (status: string) => {
    switch (status) {
      case 'RESERVED':
        return (
          <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            Chưa in
          </span>
        );
      case 'PRINTED':
        return (
          <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            Đã in tem
          </span>
        );
      case 'ACTIVATED':
        return (
          <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Đang lưu hành
          </span>
        );
      case 'RECALLED':
        return (
          <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-red-100 text-red-800 border border-red-200">
            Thu hồi
          </span>
        );
      case 'DESTROYED':
        return (
          <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-stone-200 text-stone-700 border border-stone-300">
            Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 inline-flex text-xs font-semibold rounded-full bg-stone-100 text-stone-800 border border-stone-200">
            {status}
          </span>
        );
    }
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu...</div>;
  if (!lot) return <div className="p-8 text-center text-red-500">Không tìm thấy lô sản xuất</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2 text-stone-600 font-medium"
        >
          <FiArrowLeft /> Quay lại
        </button>

        {lot?.status !== 'ACTIVE' && lot?.status !== 'SOLD_OUT' && (
          <Button
            id="tour-journal-add"
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setIsAddEventModalOpen(true)}
          >
            <FiPlus className="mr-2" /> Ghi nhận công đoạn
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-1">Lô SX: {lot.lotCode}</h1>
              <p className="text-stone-500 text-sm">
                Sản phẩm: <span className="font-medium text-stone-900">{lot.productName}</span>
              </p>
            </div>
            <div className="mt-1">
              <LotStatusBadge status={lot.status as TLotStatus} />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-stone-200">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'INFO'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('INFO')}
          >
            Thông tin chung
          </button>
          <button
            id="tour-assignments-tab"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'ASSIGNMENTS'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('ASSIGNMENTS')}
          >
            Phân công nhân sự
          </button>
          <button
            id="tour-journal"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'TIMELINE'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('TIMELINE')}
          >
            Nhật ký truy xuất
          </button>
          <button
            id="tour-qr-tab"
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'PACKAGING'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('PACKAGING')}
          >
            Đóng gói & Mã QR
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'AUDIT'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('AUDIT')}
          >
            Lịch sử thay đổi
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'INFO' && (
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-100 flex flex-col gap-5">
              {/* Thông tin nhận diện thực địa */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
                <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  <span>Thông tin nhận diện thực địa</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      Vùng trồng / Cơ sở:
                    </span>
                    <span className="font-bold text-stone-800">
                      {lot.farmName || lot.shopName || 'Cơ sở OCOP'}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      Vụ canh tác:
                    </span>
                    <span className="font-bold text-stone-800">
                      {lot.sourceCycleName || 'Đông Xuân 2026'}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      Người phụ trách:
                    </span>
                    <span className="font-bold text-stone-800">
                      {lot.responsiblePerson || 'Chủ hộ tự đảm nhiệm'}
                    </span>
                  </div>
                  <div className="bg-stone-50 p-3 rounded-lg border border-stone-100">
                    <span className="text-xs text-stone-500 flex items-center gap-1.5 mb-1">
                      <Package className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      Quy mô sản lượng:
                    </span>
                    <span className="font-bold text-stone-800">
                      {lot.quantity} {lot.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Sản phẩm
                  </h3>
                  <p className="font-semibold text-stone-900">{lot.productName}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{lot.variantName}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Quy trình áp dụng
                  </h3>
                  <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="font-semibold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100 hover:bg-emerald-100 transition-colors text-left cursor-pointer"
                  >
                    {lot.processTemplateName || 'Không xác định'}
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Cơ sở sản xuất
                  </h3>
                  <p className="font-semibold text-stone-900">{lot.shopName}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Trạng thái
                  </h3>
                  <div>
                    <LotStatusBadge status={lot.status as TLotStatus} />
                  </div>
                </div>
              </div>

              <hr className="border-stone-200" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Sản lượng
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-stone-900">{lot.quantity}</p>
                    <p className="text-sm font-medium text-stone-500">{lot.unit || 'sản phẩm'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Tồn kho hiện tại
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-stone-900">{lot.remainingQuantity}</p>
                    <p className="text-sm font-medium text-stone-500">{lot.unit || 'sản phẩm'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Ngày sản xuất
                  </h3>
                  <p className="font-semibold text-stone-900">
                    {lot.productionDate
                      ? new Date(lot.productionDate).toLocaleDateString('vi-VN')
                      : 'Chưa có'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Hạn sử dụng
                  </h3>
                  <p className="font-semibold text-stone-900">
                    {lot.expiryDate
                      ? new Date(lot.expiryDate).toLocaleDateString('vi-VN')
                      : 'Chưa xác định'}
                  </p>
                </div>
              </div>

              {lot.materialsUsed && lot.materialsUsed.length > 0 && (
                <>
                  <hr className="border-stone-200" />
                  <div>
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                      Nguyên liệu sử dụng
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {lot.materialsUsed.map((m, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold text-stone-800">{m.materialName}</span>
                            <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              {m.quantityUsed} {m.unit}
                            </span>
                          </div>
                          <div className="text-xs text-stone-500 space-y-1">
                            <p>
                              Mã lô nguyên liệu:{' '}
                              <span className="font-medium text-stone-700">
                                {m.materialLotCode}
                              </span>
                            </p>
                            {m.supplierName && (
                              <p>
                                Nhà cung cấp:{' '}
                                <span className="text-stone-700">{m.supplierName}</span>
                              </p>
                            )}
                            {m.facilityName && (
                              <p>
                                Cơ sở/Vùng trồng:{' '}
                                <span className="text-stone-700">{m.facilityName}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {lot.notes && (
                <>
                  <hr className="border-stone-200" />
                  <div>
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Ghi chú
                    </h3>
                    <p className="text-sm text-stone-700 whitespace-pre-wrap">{lot.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'ASSIGNMENTS' && lot && <LotAssignmentsTab lot={lot} />}

          {activeTab === 'TIMELINE' && (
            <div className="mt-4">
              <BatchEventTimeline
                events={lot.events || []}
                templateSteps={lot.templateSteps || []}
              />
            </div>
          )}

          {activeTab === 'PACKAGING' && (
            <div className="space-y-6">
              {lot.status !== 'ACTIVE' && lot.status !== 'SOLD_OUT' ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  Vui lòng thêm sự kiện &quot;Đóng gói&quot; vào Nhật ký truy xuất để Lô sản xuất
                  được kích hoạt. Sau khi kích hoạt, bạn mới có thể sinh mã QR và tự động cộng Tồn
                  kho.
                </div>
              ) : (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-emerald-600" />
                        <span>Danh sách Mã QR (GS1 Digital Link)</span>
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Tổng {qrs.length} tem •{' '}
                        <span className="text-blue-600 font-medium">
                          {qrs.filter((q) => q.status === 'PRINTED').length} đã in
                        </span>{' '}
                        •{' '}
                        <span className="text-emerald-600 font-medium">
                          {qrs.filter((q) => q.status === 'ACTIVATED').length} đang lưu hành
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        id="tour-generate-qr"
                        variant="outline"
                        onClick={handleOpenQrModal}
                        isLoading={generateQrMutation.isPending}
                      >
                        <FiPlus className="mr-1" /> Sinh thêm mã QR
                      </Button>
                      {qrs.length > 0 && (
                        <Button
                          id="tour-print-qr"
                          variant="primary"
                          onClick={() => setIsPrintModalOpen(true)}
                        >
                          <Printer className="w-4 h-4 mr-1.5" />
                          {selectedQrIds.length > 0
                            ? `In ${selectedQrIds.length} tem đã chọn`
                            : 'In tem nhãn (A4)'}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Batch Action Toolbar when items selected */}
                  {selectedQrIds.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
                      <div className="text-xs font-semibold text-emerald-900 flex items-center gap-2">
                        <span className="bg-emerald-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                          {selectedQrIds.length}
                        </span>
                        <span>tem được chọn. Thao tác hàng loạt:</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => handleBatchStatusUpdate('PRINTED')}
                          disabled={updateQrStatusMutation.isPending}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Đánh dấu Đã in
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBatchStatusUpdate('ACTIVATED')}
                          disabled={updateQrStatusMutation.isPending}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Kích hoạt lưu hành
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBatchStatusUpdate('RECALLED')}
                          disabled={updateQrStatusMutation.isPending}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <AlertOctagon className="w-3.5 h-3.5" /> Thu hồi tem
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBatchStatusUpdate('DESTROYED')}
                          disabled={updateQrStatusMutation.isPending}
                          className="px-2.5 py-1 text-xs font-medium rounded-md bg-stone-600 text-white hover:bg-stone-700 transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Ban className="w-3.5 h-3.5" /> Hủy tem
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedQrIds([])}
                          className="px-2 py-1 text-xs text-stone-500 hover:text-stone-700 cursor-pointer"
                        >
                          Bỏ chọn
                        </button>
                      </div>
                    </div>
                  )}

                  {qrs.length === 0 ? (
                    <div className="text-center text-stone-500 py-12 border-2 border-dashed border-stone-200 rounded-lg">
                      <QrCode className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                      <p className="font-medium text-stone-600">
                        Chưa có mã QR nào được sinh cho lô này.
                      </p>
                      <p className="text-xs text-stone-400 mt-1">
                        Bấm nút &quot;Sinh thêm mã QR&quot; để tạo dải mã truy xuất nguồn gốc GS1.
                      </p>
                    </div>
                  ) : (
                    <div className="border border-stone-200 rounded-lg overflow-hidden bg-white shadow-xs">
                      <table className="min-w-full divide-y divide-stone-200 text-sm">
                        <thead className="bg-stone-50">
                          <tr>
                            <th className="w-10 px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedQrIds.length === qrs.length && qrs.length > 0}
                                onChange={handleToggleSelectAll}
                                className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                              />
                            </th>
                            <th className="w-20 px-3 py-3 text-center font-semibold text-stone-600">
                              Mã QR (Quét)
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-stone-600">
                              Serial
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-stone-600">
                              Link GS1 Digital Link
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-stone-600">
                              Trạng thái
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-stone-600">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white">
                          {qrs.map((qr: ILotQrCode) => {
                            const isSelected = selectedQrIds.includes(qr.id);
                            return (
                              <tr
                                key={qr.id}
                                className={`transition-colors ${
                                  isSelected ? 'bg-emerald-50/50' : 'hover:bg-stone-50/70'
                                }`}
                              >
                                <td className="px-4 py-3.5 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelectQr(qr.id)}
                                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                                  />
                                </td>
                                <td className="px-3 py-2 text-center">
                                  <div
                                    onClick={() => setPreviewQr(qr)}
                                    className="group/qr relative p-1 bg-white border border-stone-200 rounded-lg hover:border-emerald-500 hover:shadow-md cursor-pointer transition-all inline-flex items-center justify-center w-12 h-12"
                                    title="Nhấp để phóng to quét thử hoặc xem chi tiết"
                                  >
                                    <QRCode
                                      value={qr.qrUrl}
                                      size={40}
                                      level="M"
                                      className="w-full h-full"
                                    />
                                    <div className="absolute inset-0 bg-stone-900/70 rounded-lg opacity-0 group-hover/qr:opacity-100 flex items-center justify-center transition-opacity text-white flex-col gap-0.5">
                                      <Maximize2 className="w-3.5 h-3.5" />
                                      <span className="text-[8px] font-bold">Quét</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap font-mono font-medium text-stone-800">
                                  {qr.serialNumber || 'MASTER'}
                                </td>
                                <td className="px-4 py-3.5 truncate max-w-xs text-emerald-600 hover:underline">
                                  <a
                                    href={qr.qrUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={qr.qrUrl}
                                    className="text-xs font-mono"
                                  >
                                    {qr.qrUrl}
                                  </a>
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap">
                                  {renderQrStatusBadge(qr.status)}
                                </td>
                                <td className="px-4 py-3.5 whitespace-nowrap text-right text-xs">
                                  <div className="inline-flex items-center gap-1.5 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewQr(qr)}
                                      className="p-1.5 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 rounded border border-stone-200 hover:border-emerald-300 transition-colors inline-flex items-center gap-1"
                                      title="Xem & Quét thử tem này"
                                    >
                                      <QrCode className="w-3.5 h-3.5" />
                                      <span className="text-[11px] font-medium hidden sm:inline">
                                        Quét thử
                                      </span>
                                    </button>
                                    <select
                                      value={qr.status || 'RESERVED'}
                                      disabled={updateQrStatusMutation.isPending}
                                      onChange={(e) =>
                                        updateQrStatusMutation.mutate({
                                          lotId,
                                          data: {
                                            qrIds: [qr.id],
                                            status: e.target.value as TQrStatus,
                                          },
                                        })
                                      }
                                      className="border border-stone-200 rounded px-2 py-1 text-xs text-stone-700 bg-white hover:border-stone-400 focus:ring-1 focus:ring-emerald-500"
                                    >
                                      <option value="RESERVED">Chưa in</option>
                                      <option value="PRINTED">Đã in tem</option>
                                      <option value="ACTIVATED">Lưu hành</option>
                                      <option value="RECALLED">Thu hồi</option>
                                      <option value="DESTROYED">Hủy tem</option>
                                    </select>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <h3 className="text-lg text-stone-800 font-semibold mb-4">
                Lịch sử thay đổi (Audit Log)
              </h3>
              {auditLogs.length === 0 ? (
                <div className="text-center text-stone-500 py-8 border-2 border-dashed border-stone-200 rounded-lg">
                  Chưa có lịch sử thay đổi nào.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-stone-200 text-sm">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">
                          Người thực hiện
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">
                          Hành động
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">Dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {auditLogs.map((log: ILotAuditLog) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 font-medium text-stone-900">{log.actorEmail}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-stone-100 text-stone-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-stone-600">
                            <details className="cursor-pointer">
                              <summary className="font-medium text-emerald-600 hover:text-emerald-700">
                                Xem chi tiết
                              </summary>
                              <div className="mt-2 p-3 bg-stone-50 rounded border border-stone-200 max-w-sm max-h-60 overflow-y-auto">
                                {log.beforeValue && (
                                  <div className="mb-3">
                                    <p className="font-semibold text-stone-700 text-xs mb-1">
                                      Dữ liệu trước (Before):
                                    </p>
                                    <AuditDataRenderer data={log.beforeValue} />
                                  </div>
                                )}
                                {log.afterValue && (
                                  <div>
                                    <p className="font-semibold text-stone-700 text-xs mb-1">
                                      Dữ liệu sau (After):
                                    </p>
                                    <AuditDataRenderer data={log.afterValue} />
                                  </div>
                                )}
                              </div>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {lot?.status !== 'ACTIVE' && lot?.status !== 'SOLD_OUT' && (
        <AddBatchEventForm
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          lotId={lotId}
          productId={lot.productId || 0}
          templateSteps={templateSteps}
          sourceCycleId={lot.sourceCycleId}
          sourceCycleStatus={lot.sourceCycleStatus}
          completedProcessingStepIds={
            lot.events?.map((e) => e.templateStepId).filter((id): id is number => id != null) || []
          }
        />
      )}

      <Modal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        title={`Quy trình: ${lot.processTemplateName || 'Không xác định'}`}
        maxWidth="max-w-2xl"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-stone-500">
            Dưới đây là danh sách các bước chuẩn để thực hiện cho lô sản xuất này.
          </p>
          {templateSteps.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-500 text-sm">
              Không có chi tiết quy trình.
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
              {templateSteps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 bg-stone-50 border border-stone-100 rounded-xl flex gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1 flex flex-col gap-1.5">
                    <h4 className="font-bold text-stone-800 text-sm">{step.title}</h4>
                    {step.description && (
                      <p className="text-xs text-stone-600 leading-relaxed bg-white p-2 rounded border border-stone-100">
                        {step.description}
                      </p>
                    )}
                    {step.estimatedDays !== undefined && step.estimatedDays !== null && (
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 bg-emerald-50/50 w-fit px-2 py-0.5 rounded">
                        <FiZap size={10} />
                        {idx === 0
                          ? `Sau khi tạo lô: ${step.estimatedDays} ngày`
                          : `Sau bước "${templateSteps[idx - 1]?.title || 'trước'}": ${step.estimatedDays} ngày`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end pt-2 border-t border-stone-100 mt-2">
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Sinh mã QR */}
      <Modal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        title="Sinh mã QR (GS1 Digital Link)"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Lô sản xuất này có số lượng sản phẩm dự kiến là{' '}
            <strong className="text-emerald-700">
              {lot?.quantity} {lot?.unit}
            </strong>
            . Bạn có thể sinh số lượng mã QR tương ứng với số lượng đóng gói thực tế.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng mã QR cần sinh
            </label>
            <input
              type="number"
              min="1"
              max="100000"
              value={qrCount}
              onChange={(e) => setQrCount(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsQrModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmGenerateQrs}
              isLoading={generateQrMutation.isPending}
            >
              Xác nhận sinh mã
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal In Tem Decal Tomy A4 */}
      {lot && (
        <PrintQrModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          lot={lot}
          qrCodes={qrsToPrint}
        />
      )}

      {/* Modal Xem Chi Tiết & Quét Thử Mã QR */}
      {previewQr && (
        <Modal
          isOpen={!!previewQr}
          onClose={() => setPreviewQr(null)}
          title={`Chi tiết Tem QR - Serial #${previewQr.serialNumber || 'MASTER'}`}
          maxWidth="max-w-md"
        >
          <div className="flex flex-col items-center p-2 text-center space-y-4">
            {/* Khung ảnh Mã QR to, sắc nét để quét trực tiếp */}
            <div className="p-4 bg-white border-2 border-emerald-500/30 rounded-2xl shadow-md flex flex-col items-center relative">
              <div className="bg-white p-2 rounded-xl">
                <QRCode value={previewQr.qrUrl} size={200} level="Q" className="rounded" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                  Serial: #{previewQr.serialNumber || 'MASTER'}
                </span>
                {renderQrStatusBadge(previewQr.status)}
              </div>
              <p className="text-[11px] text-stone-500 mt-2">
                Dùng camera điện thoại hoặc app Zalo / Barcode để quét trực tiếp mã trên màn hình
              </p>
            </div>

            {/* Thông tin Tem & Lô */}
            <div className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-left text-xs space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                <span className="text-stone-500">Sản phẩm:</span>
                <span
                  className="font-bold text-stone-800 truncate max-w-[220px]"
                  title={lot?.productName}
                >
                  {lot?.productName}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                <span className="text-stone-500">Mã Lô (Lot):</span>
                <span className="font-mono font-bold text-emerald-700">{lot?.lotCode}</span>
              </div>
              {lot?.variantName && (
                <div className="flex justify-between items-center pb-2 border-b border-stone-200/80">
                  <span className="text-stone-500">Quy cách:</span>
                  <span className="font-medium text-stone-700">{lot.variantName}</span>
                </div>
              )}
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-stone-500 font-medium">Link GS1 Digital Link:</span>
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded px-2.5 py-1.5">
                  <span
                    className="font-mono text-[11px] text-stone-600 truncate flex-1 select-all"
                    title={previewQr.qrUrl}
                  >
                    {previewQr.qrUrl}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(previewQr.qrUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="text-stone-500 hover:text-emerald-700 shrink-0 p-1 rounded hover:bg-stone-100 transition-colors"
                    title="Sao chép liên kết"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Các nút hành động */}
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full pt-1">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs order-2 sm:order-1"
                onClick={() => setPreviewQr(null)}
              >
                Đóng
              </Button>
              {typeof window !== 'undefined' &&
                window.location.hostname === 'localhost' &&
                previewQr.qrUrl.includes('/01/') && (
                  <a
                    href={`${window.location.origin}${previewQr.qrUrl.substring(previewQr.qrUrl.indexOf('/01/'))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-semibold text-xs transition-colors border border-stone-300 order-1 sm:order-2"
                    title="Mở trực tiếp trên localhost:3000 để kiểm tra kết quả truy xuất"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-stone-600" />
                    <span>Mở trên Localhost</span>
                  </a>
                )}
              <a
                href={previewQr.qrUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs order-1 sm:order-3"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Mở link gốc</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
