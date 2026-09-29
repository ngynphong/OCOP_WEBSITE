'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Package,
  Store,
  AlertTriangle,
  ShieldAlert,
  PauseCircle,
  PlayCircle,
  Clock,
  FileText,
  ExternalLink,
  Copy,
  Check,
  MapPin,
  User,
  QrCode,
  Bot,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useAdminLotDetailQuery,
  useSuspendLotMutation,
  useReactivateLotMutation,
  useRecallLotMutation,
  useExpireLotMutation,
} from '@/features/admin/hooks/useAdminSupplyChain';
import { TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';

export default function AdminLotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lotId = Number(params.id);

  // Modals state
  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');

  const [isReactivateModalOpen, setIsReactivateModalOpen] = useState(false);

  const [isRecallModalOpen, setIsRecallModalOpen] = useState(false);
  const [recallReason, setRecallReason] = useState('');
  const [recallSeverity, setRecallSeverity] = useState<'MINOR' | 'MAJOR' | 'CRITICAL'>('MAJOR');
  const [recallInstructions, setRecallInstructions] = useState('');
  const [recallNotice, setRecallNotice] = useState('');

  const [isExpireModalOpen, setIsExpireModalOpen] = useState(false);
  const [expireReason, setExpireReason] = useState('');

  const [copiedLink, setCopiedLink] = useState(false);

  // Queries & Mutations
  const { data: lotRes, isLoading, refetch } = useAdminLotDetailQuery(lotId);
  const lot = lotRes?.data;

  const suspendMutation = useSuspendLotMutation();
  const reactivateMutation = useReactivateLotMutation();
  const recallMutation = useRecallLotMutation();
  const expireMutation = useExpireLotMutation();

  // Handlers
  const handleSuspend = async () => {
    try {
      await suspendMutation.mutateAsync({
        id: lotId,
        reason: suspendReason.trim() || undefined,
      });
      setIsSuspendModalOpen(false);
      setSuspendReason('');
      refetch();
    } catch {
      // Toast already handled in hook
    }
  };

  const handleReactivate = async () => {
    try {
      await reactivateMutation.mutateAsync(lotId);
      setIsReactivateModalOpen(false);
      refetch();
    } catch {
      // Toast already handled in hook
    }
  };

  const handleRecall = async () => {
    if (!recallReason.trim()) {
      toast.error('Vui lòng cung cấp lý do ban hành lệnh thu hồi');
      return;
    }
    try {
      await recallMutation.mutateAsync({
        id: lotId,
        payload: {
          reason: recallReason.trim(),
          severity: recallSeverity,
          instructions: recallInstructions.trim() || undefined,
          publicNotice: recallNotice.trim() || undefined,
        },
      });
      setIsRecallModalOpen(false);
      setRecallReason('');
      setRecallInstructions('');
      setRecallNotice('');
      refetch();
    } catch {
      // Toast already handled in hook
    }
  };

  const handleExpire = async () => {
    try {
      await expireMutation.mutateAsync({
        id: lotId,
        reason: expireReason.trim() || undefined,
      });
      setIsExpireModalOpen(false);
      setExpireReason('');
      refetch();
    } catch {
      // Toast already handled in hook
    }
  };

  const handleCopyDigitalLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Đã sao chép liên kết GS1 Digital Link');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm font-medium text-stone-500">Đang tải dữ liệu hồ sơ lô hàng...</p>
      </div>
    );
  }

  if (!lot) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto text-rose-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-base font-bold text-stone-800">Không tìm thấy thông tin lô hàng</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const isSuspended = lot.status === 'SUSPENDED';
  const isRecalled = lot.status === 'RECALLED';
  const isExpired = lot.status === 'EXPIRED';
  const trustScore = lot.trustScore ?? 0;

  // Flatten evidence documents from events
  const allDocs = (lot.events || []).flatMap((e) =>
    (e.evidenceDocuments || []).map((doc) => ({
      ...doc,
      stepTitle: e.stepTitle,
      stepType: e.stepType,
      eventAt: e.eventAt,
    })),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* ── Top Navigation & Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/supply-chain/lots')}
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-600 transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <span>Chuỗi cung ứng</span>
              <span>/</span>
              <span>Lô hàng #{lot.id}</span>
            </div>
            <div className="flex items-center gap-2.5 mt-0.5">
              <h1 className="text-2xl font-black text-emerald-950 font-mono tracking-tight">
                {lot.lotCode}
              </h1>
              <LotStatusBadge status={(lot.status as TLotStatus) || 'CREATED'} />
              {lot.isFlaggedByAi && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3" /> AI Cảnh báo
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Admin Action Buttons ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tạm dừng (nếu chưa tạm dừng / thu hồi) */}
          {!isSuspended && !isRecalled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSuspendReason('');
                setIsSuspendModalOpen(true);
              }}
              className="text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 font-semibold"
            >
              <PauseCircle className="w-4 h-4 mr-1.5" /> Tạm dừng lưu hành
            </Button>
          )}

          {/* Kích hoạt lại (nếu đang tạm dừng) */}
          {isSuspended && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsReactivateModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <PlayCircle className="w-4 h-4 mr-1.5" /> Kích hoạt lại
            </Button>
          )}

          {/* Lệnh thu hồi khẩn cấp */}
          {!isRecalled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRecallReason('');
                setRecallSeverity('MAJOR');
                setRecallInstructions('');
                setRecallNotice('');
                setIsRecallModalOpen(true);
              }}
              className="text-rose-700 border-rose-200 bg-rose-50 hover:bg-rose-100 font-semibold"
            >
              <ShieldAlert className="w-4 h-4 mr-1.5" /> Thu hồi khẩn cấp
            </Button>
          )}

          {/* Đánh dấu hết hạn */}
          {!isExpired && !isRecalled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setExpireReason('');
                setIsExpireModalOpen(true);
              }}
              className="text-stone-600 border-stone-200 hover:bg-stone-100 font-medium"
            >
              <Clock className="w-4 h-4 mr-1.5" /> Hết hạn
            </Button>
          )}
        </div>
      </div>

      {/* ── Alert Banner for Suspended or Recalled ── */}
      {isRecalled && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 text-rose-900 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-base">Lô hàng này đã bị THU HỒI KHẨN CẤP</p>
            <p className="text-xs text-rose-800">
              Lệnh thu hồi được ban hành nhằm ngăn ngừa rủi ro an toàn thực phẩm. Toàn bộ tem QR và
              sản phẩm trên sàn bị khóa lưu thông.
            </p>
            {lot.recallInfo && (
              <div className="mt-2 text-xs bg-white/70 p-2.5 rounded-lg border border-rose-200 space-y-0.5">
                <p>
                  <strong>Lý do:</strong> {lot.recallInfo.reason}
                </p>
                {lot.recallInfo.notes && (
                  <p>
                    <strong>Chỉ dẫn:</strong> {lot.recallInfo.notes}
                  </p>
                )}
                {lot.recallInfo.recalledAt && (
                  <p className="text-stone-500">
                    Thời điểm: {format(new Date(lot.recallInfo.recalledAt), 'dd/MM/yyyy HH:mm')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {isSuspended && !isRecalled && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-base">Lô hàng đang bị TẠM DỪNG LƯU HÀNH</p>
            <p className="text-xs text-amber-800">
              Cơ quan quản trị OCOP đã tạm dừng hiệu lực của mã QR và trạng thái bán hàng để thẩm
              định lại bằng chứng quy trình hoặc giải trình từ Seller.
            </p>
          </div>
        </div>
      )}

      {/* ── Main 2-Column Grid Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column (2 Cols) ── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Tổng quan Sản phẩm & Lô hàng */}
          <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                Thông tin Sản phẩm & Sản lượng Lô
              </h2>
              <span className="text-xs text-stone-400 font-mono">ID: #{lot.id}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-xs md:text-sm">
              <div>
                <p className="text-stone-400 text-xs font-medium">Tên sản phẩm OCOP</p>
                <p className="font-bold text-stone-900 text-base mt-0.5">
                  {lot.productName || '---'}
                </p>
                {lot.variantName && (
                  <p className="text-xs text-stone-500 mt-0.5">Phân loại: {lot.variantName}</p>
                )}
              </div>

              <div>
                <p className="text-stone-400 text-xs font-medium">Chủ hộ / Hợp tác xã (Shop)</p>
                <p className="font-semibold text-stone-900 flex items-center gap-1.5 mt-0.5">
                  <Store className="w-3.5 h-3.5 text-stone-400" />
                  {lot.shopName || '---'}
                </p>
                {lot.glnCode && (
                  <p className="text-[11px] font-mono text-stone-400 mt-0.5">GLN: {lot.glnCode}</p>
                )}
              </div>

              <div>
                <p className="text-stone-400 text-xs font-medium">Số lượng xuất xưởng</p>
                <p className="font-bold text-stone-900 mt-0.5">
                  {lot.quantity?.toLocaleString()}{' '}
                  <span className="font-normal text-stone-500">{lot.unit}</span>
                </p>
                <div className="text-xs text-stone-500 space-x-2 mt-0.5">
                  <span>Còn lại: {lot.remainingQuantity?.toLocaleString()}</span>
                  <span>•</span>
                  <span>Khả dụng: {lot.availableQuantity?.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <p className="text-stone-400 text-xs font-medium">Quy trình sản xuất mẫu</p>
                <p className="font-semibold text-stone-800 mt-0.5">
                  {lot.processTemplateName || 'Tự do / Chưa áp dụng mẫu chuẩn'}
                </p>
              </div>

              <div>
                <p className="text-stone-400 text-xs font-medium">Ngày sản xuất (NSX)</p>
                <p className="font-medium text-stone-900 mt-0.5">
                  {lot.productionDate ? format(new Date(lot.productionDate), 'dd/MM/yyyy') : '---'}
                </p>
              </div>

              <div>
                <p className="text-stone-400 text-xs font-medium">Hạn sử dụng (HSD)</p>
                <p className="font-medium text-stone-900 mt-0.5">
                  {lot.expiryDate ? format(new Date(lot.expiryDate), 'dd/MM/yyyy') : '---'}
                </p>
              </div>

              {lot.inputMaterials && (
                <div className="md:col-span-2 pt-2 border-t border-stone-100">
                  <p className="text-stone-400 text-xs font-medium">Nguyên liệu đầu vào</p>
                  <p className="text-stone-700 mt-0.5 whitespace-pre-wrap">{lot.inputMaterials}</p>
                </div>
              )}

              {lot.notes && (
                <div className="md:col-span-2 pt-2 border-t border-stone-100">
                  <p className="text-stone-400 text-xs font-medium">Ghi chú của Nhà sản xuất</p>
                  <p className="text-stone-700 mt-0.5 whitespace-pre-wrap">{lot.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Vùng trồng & Chu kỳ Nông trại (SourceCycle) */}
          {(lot.sourceCycleId || lot.farmName || lot.responsiblePerson) && (
            <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Nguồn gốc Canh tác & Nông trại
                </h2>
                {lot.sourceCycleStatus && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Vụ mùa: {lot.sourceCycleStatus}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-6 text-xs md:text-sm">
                <div>
                  <p className="text-stone-400 text-xs font-medium">Nông trại / Vùng nguyên liệu</p>
                  <p className="font-semibold text-stone-900 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {lot.farmName || '---'}
                  </p>
                </div>

                <div>
                  <p className="text-stone-400 text-xs font-medium">
                    Người chịu trách nhiệm kỹ thuật
                  </p>
                  <p className="font-semibold text-stone-900 mt-0.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    {lot.responsiblePerson || '---'}
                  </p>
                </div>

                {lot.sourceCycleName && (
                  <div>
                    <p className="text-stone-400 text-xs font-medium">Chu kỳ / Vụ mùa</p>
                    <p className="font-medium text-stone-800 mt-0.5">{lot.sourceCycleName}</p>
                  </div>
                )}

                {lot.rawYieldUsed != null && (
                  <div>
                    <p className="text-stone-400 text-xs font-medium">
                      Nguyên liệu thô đưa vào chế biến
                    </p>
                    <p className="font-semibold text-stone-900 mt-0.5">
                      {lot.rawYieldUsed} {lot.rawYieldUnit || 'kg'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Card 3: Chuẩn GS1 & Tem QR Truy xuất */}
          <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-600" />
                Định danh GS1 & Tem điện tử
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/70 space-y-1">
                <p className="text-stone-400 text-xs font-medium">
                  Mã số thương phẩm toàn cầu (GTIN)
                </p>
                <p className="font-mono font-bold text-stone-800 text-sm">
                  {lot.gtinCode || 'Chưa liên kết GTIN'}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200/70 space-y-1">
                <p className="text-stone-400 text-xs font-medium">Mã QR Master / Token</p>
                <p className="font-mono text-stone-700 text-xs truncate">
                  {lot.qrToken || 'Mã tự động sinh theo chuẩn số hóa'}
                </p>
              </div>
            </div>

            {lot.digitalLink && (
              <div className="pt-2">
                <p className="text-stone-500 text-xs font-medium mb-1">
                  Đường dẫn GS1 Digital Link công khai:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={lot.digitalLink}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs font-mono text-stone-700 select-all"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyDigitalLink(lot.digitalLink!)}
                    className="text-xs shrink-0"
                  >
                    {copiedLink ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <a
                    href={lot.digitalLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-emerald-600 transition-colors shrink-0"
                    title="Mở trang tra cứu người tiêu dùng"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Hồ sơ & Bằng chứng kiểm định */}
          <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Hồ sơ Kiểm nghiệm & Chứng từ Đính kèm
              </h2>
              <span className="text-xs text-stone-400">{allDocs.length} tài liệu</span>
            </div>

            {allDocs.length === 0 ? (
              <div className="text-center py-8 bg-stone-50/70 rounded-lg border border-dashed border-stone-200">
                <FileText className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-medium">
                  Chưa có tài liệu hoặc chứng chỉ kiểm định nào được đính kèm ở các công đoạn
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {allDocs.map((doc, idx) => (
                  <div
                    key={doc.id || idx}
                    className="p-3 bg-stone-50 rounded-lg border border-stone-200 hover:border-emerald-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <p className="font-semibold text-stone-800 text-xs md:text-sm line-clamp-1">
                        {doc.fileName || doc.documentType || 'Biên bản kiểm nghiệm'}
                      </p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Công đoạn:{' '}
                        <span className="font-medium text-stone-700">
                          {doc.stepTitle || doc.stepType}
                        </span>
                      </p>
                      {doc.issuedBy && (
                        <p className="text-[11px] text-stone-500">
                          Đơn vị cấp: <span className="text-stone-700">{doc.issuedBy}</span>
                        </p>
                      )}
                    </div>
                    {doc.fileUrl && (
                      <div className="mt-3 pt-2 border-t border-stone-200/60">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-600 hover:underline flex items-center gap-1 font-medium"
                        >
                          <FileText className="w-3.5 h-3.5" /> Xem file tài liệu
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (1 Col) ── */}
        <div className="space-y-6">
          {/* Card A: Đánh giá Rủi ro AI & Độ Tin Cậy */}
          <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-5 space-y-4">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-600" />
              Đánh giá Tin cậy & Phân tích AI
            </h3>

            {/* Trust Score Gauge */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${
                  trustScore >= 80
                    ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                    : trustScore >= 50
                      ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                      : 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                }`}
              >
                {trustScore}
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Trust Score
                </p>
                <p className="text-xs text-stone-700 font-medium">
                  {trustScore >= 80
                    ? 'Mức độ uy tín rất cao (Chuỗi sự kiện minh bạch)'
                    : trustScore >= 50
                      ? 'Mức độ tin cậy trung bình'
                      : 'Rủi ro cao (Cần thẩm định kỹ hồ sơ)'}
                </p>
              </div>
            </div>

            {/* AI Flags & Warnings */}
            {lot.isFlaggedByAi && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1.5 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  AI phát hiện dấu hiệu bất thường:
                </p>
                {lot.warnings && lot.warnings.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-amber-800/90 pl-1">
                    {lot.warnings.map((warn, wIdx) => (
                      <li key={wIdx}>{warn}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Có sự chênh lệch bất thường về thời gian hoặc địa điểm giữa các công đoạn.</p>
                )}
              </div>
            )}
          </div>

          {/* Card B: Hành trình Chuỗi cung ứng (Timeline) */}
          <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" />
                Hành trình Sự kiện Lô hàng
              </h3>
              <span className="text-xs text-stone-400">{(lot.events || []).length} sự kiện</span>
            </div>

            {lot.events && lot.events.length > 0 ? (
              <div className="pt-2">
                <BatchEventTimeline events={lot.events} templateSteps={lot.templateSteps || []} />
              </div>
            ) : (
              <div className="text-center py-8 bg-stone-50/70 rounded-lg border border-dashed border-stone-200">
                <Clock className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-medium">
                  Chưa có sự kiện nhật ký nào được ghi nhận cho lô hàng này
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modal Tạm dừng Lưu hành ── */}
      <Modal
        isOpen={isSuspendModalOpen}
        onClose={() => setIsSuspendModalOpen(false)}
        title="Tạm dừng Lưu hành Lô hàng"
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Lưu ý quan trọng:
            </p>
            <p>
              Hành động này sẽ lập tức đình chỉ quyền bán và khóa mã QR truy xuất của lô hàng{' '}
              <strong>{lot.lotCode}</strong> trên toàn hệ thống trong thời gian chờ kiểm tra.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Lý do tạm dừng lưu hành
            </label>
            <textarea
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Nhập lý do tạm dừng để lưu log kiểm toán..."
              rows={3}
              className="w-full border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSuspendModalOpen(false)}
              disabled={suspendMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSuspend}
              isLoading={suspendMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold"
            >
              Xác nhận Tạm dừng
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Kích hoạt lại ── */}
      <Modal
        isOpen={isReactivateModalOpen}
        onClose={() => setIsReactivateModalOpen(false)}
        title="Khôi phục Hoạt động Lô hàng"
      >
        <div className="space-y-4">
          <p className="text-xs md:text-sm text-stone-700">
            Bạn có chắc chắn muốn khôi phục quyền lưu hành bình thường cho lô hàng{' '}
            <strong className="font-mono text-emerald-800">{lot.lotCode}</strong>?
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
            Mã QR truy xuất sẽ hoạt động trở lại bình thường và các giỏ hàng liên kết sản phẩm này
            sẽ được phép thanh toán.
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReactivateModalOpen(false)}
              disabled={reactivateMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleReactivate}
              isLoading={reactivateMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Xác nhận Khôi phục
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Thu hồi Khẩn cấp ── */}
      <Modal
        isOpen={isRecallModalOpen}
        onClose={() => setIsRecallModalOpen(false)}
        title="Ban hành Lệnh Thu hồi Khẩn cấp"
      >
        <div className="space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 text-xs text-rose-800 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Chế tài thu hồi cấp cao:
            </p>
            <p>
              Lệnh thu hồi là chế tài nghiêm ngặt nhất. Thông báo thu hồi sẽ được hiển thị công khai
              tới người tiêu dùng khi quét tem QR.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Mức độ nghiêm trọng <span className="text-rose-500">*</span>
            </label>
            <select
              value={recallSeverity}
              onChange={(e) => setRecallSeverity(e.target.value as 'MINOR' | 'MAJOR' | 'CRITICAL')}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="MINOR">MINOR - Mức độ nhẹ (Sai sót nhãn mác, bao bì)</option>
              <option value="MAJOR">
                MAJOR - Nghiêm trọng (Nghi ngờ nhiễm khuẩn, chỉ tiêu ATTP)
              </option>
              <option value="CRITICAL">
                CRITICAL - Tối khẩn cấp (Nguy hại trực tiếp sức khỏe)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Lý do thu hồi <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={recallReason}
              onChange={(e) => setRecallReason(e.target.value)}
              placeholder="VD: Phát hiện dư lượng thuốc BVTV vượt ngưỡng cho phép..."
              rows={2}
              className="w-full border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Hướng dẫn xử lý cho người tiêu dùng / điểm bán
            </label>
            <textarea
              value={recallInstructions}
              onChange={(e) => setRecallInstructions(e.target.value)}
              placeholder="VD: Ngừng sử dụng ngay lập tức, đem sản phẩm đến điểm bán để được hoàn tiền 100%..."
              rows={2}
              className="w-full border border-stone-200 rounded-lg p-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
              Thông cáo công khai (Public Notice)
            </label>
            <input
              type="text"
              value={recallNotice}
              onChange={(e) => setRecallNotice(e.target.value)}
              placeholder="Tiêu đề thông cáo báo chí hoặc cảnh báo công khai..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRecallModalOpen(false)}
              disabled={recallMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleRecall}
              isLoading={recallMutation.isPending}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              Ban hành Lệnh Thu hồi
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Modal Đánh dấu Hết hạn ── */}
      <Modal
        isOpen={isExpireModalOpen}
        onClose={() => setIsExpireModalOpen(false)}
        title="Đánh dấu Hết hạn Lô hàng"
      >
        <div className="space-y-4">
          <p className="text-xs md:text-sm text-stone-700">
            Bạn có chắc chắn muốn chuyển trạng thái lô hàng{' '}
            <strong className="font-mono text-emerald-800">{lot.lotCode}</strong> sang{' '}
            <strong className="text-rose-700">EXPIRED (Hết hạn)</strong>?
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5">
              Ghi chú lý do (Tùy chọn)
            </label>
            <input
              type="text"
              value={expireReason}
              onChange={(e) => setExpireReason(e.target.value)}
              placeholder="VD: Quá hạn sử dụng theo tem nhãn..."
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-500"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpireModalOpen(false)}
              disabled={expireMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleExpire}
              isLoading={expireMutation.isPending}
              className="bg-stone-800 hover:bg-stone-900 text-white font-semibold"
            >
              Xác nhận Hết hạn
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
