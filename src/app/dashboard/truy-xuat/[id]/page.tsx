'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import {
  ISupplyChainLot,
  TStepType,
  IProductionStepReq,
  IProcessingStepReq,
  IStorageStepReq,
  ITransportStepReq,
  IDistributionStepReq,
  ITestingStepReq,
  ILotQrCode,
  TLotStatus,
} from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { SupplyChainTimeline } from '@/features/supply-chain/components/SupplyChainTimeline';
import { StepFormModal, TStepFormData } from '@/features/supply-chain/components/StepFormModal';
import { PrintQrModal } from '@/features/supply-chain/components/PrintQrModal';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';
import {
  FiArrowLeft,
  FiPlus,
  FiPackage,
  FiCalendar,
  FiHash,
  FiXCircle,
  FiPrinter,
  FiExternalLink,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import QRCode from 'react-qr-code';

const LotDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<ISupplyChainLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStepModalOpen, setIsStepModalOpen] = useState(false);
  const [selectedStepType, setSelectedStepType] = useState<TStepType | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const [qrCodes, setQrCodes] = useState<ILotQrCode[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchLotDetail = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await supplyChainApi.getSellerLotDetail(Number(id));
      setLot(resp.data);
    } catch (error) {
      console.error('Fetch lot detail error', error);
      toast.error('Không thể tải thông tin lô hàng');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLotDetail();
  }, [id, fetchLotDetail]);

  const handleRecordStep = async (data: TStepFormData) => {
    if (!selectedStepType || !lot) return;

    try {
      switch (selectedStepType) {
        case 'PRODUCTION':
          await supplyChainApi.recordProduction(lot.id, data as IProductionStepReq);
          break;
        case 'PROCESSING':
          await supplyChainApi.recordProcessing(lot.id, data as IProcessingStepReq);
          break;
        case 'STORAGE':
          await supplyChainApi.recordStorage(lot.id, data as IStorageStepReq);
          break;
        case 'TRANSPORT':
          await supplyChainApi.recordTransport(lot.id, data as ITransportStepReq);
          break;
        case 'DISTRIBUTION':
          await supplyChainApi.recordDistribution(lot.id, data as IDistributionStepReq);
          break;
        case 'TESTING':
          await supplyChainApi.recordTestingLog(lot.id, data as ITestingStepReq);
          break;
      }
      await fetchLotDetail();
    } catch (error) {
      console.error('Update step error', error);
    }
  };

  const handleCancelLot = async () => {
    if (!lot) return;
    try {
      await supplyChainApi.updateLotStatus(lot.id, 'CANCELLED');
      toast.success('Đã hủy lô hàng');
      await fetchLotDetail();
      setIsCancelModalOpen(false);
    } catch (error) {
      console.error('Cancel lot error', error);
      toast.error('Có lỗi xảy ra');
    }
  };

  const handleSubmitVerification = async () => {
    if (!lot) return;
    try {
      await supplyChainApi.submitLotForVerification(lot.id);
      toast.success('Đã gửi yêu cầu duyệt lô hàng');
      await fetchLotDetail();
      setIsSubmitModalOpen(false);
    } catch (error: unknown) {
      console.error('Submit verification error', error);
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Có lỗi xảy ra khi gửi duyệt');
    }
  };

  const handleGenerateQRs = async () => {
    if (!lot) return;
    const countStr = prompt(
      `Nhập số lượng tem muốn sinh (Tối đa ${lot.quantity}):`,
      lot.quantity.toString(),
    );
    if (!countStr) return;
    const count = parseInt(countStr);
    if (isNaN(count) || count <= 0 || count > lot.quantity) {
      toast.error(`Số lượng không hợp lệ. Phải từ 1 đến ${lot.quantity}`);
      return;
    }

    try {
      setGenerating(true);
      await supplyChainApi.generateItemQrCodes(lot.id, count);
      toast.success(`Đã sinh thành công ${count} tem`);
    } catch (error: unknown) {
      console.error('Generate QRs error', error);
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e?.response?.data?.message || 'Có lỗi xảy ra khi sinh tem');
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenPrintModal = async () => {
    if (!lot) return;
    try {
      const res = await supplyChainApi.getLotQrCodes(lot.id);
      if (!res.data || res.data.length === 0) {
        toast.error('Lô này chưa được sinh tem độc bản. Hãy sinh tem trước.');
        return;
      }
      setQrCodes(res.data);
      setIsPrintModalOpen(true);
    } catch (error) {
      console.error('Fetch QRs error', error);
      toast.error('Không thể lấy danh sách tem');
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải...</div>;
  if (!lot) return <div className="p-8 text-center text-gray-700">Không tìm thấy lô hàng</div>;

  const publicUrl = `${window.location.origin}/truy-xuat/${lot.lotCode}`;

  return (
    <div className="space-y-8">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2 text-stone-600 font-medium"
        >
          <FiArrowLeft /> Quay lại
        </button>
        <div className="flex gap-2">
          {lot.verificationStatus === 'DRAFT' || lot.verificationStatus === 'REJECTED' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsSubmitModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Gửi duyệt lô hàng
            </Button>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => setShowQR(!showQR)}>
            {showQR ? (
              'Ẩn QR Code'
            ) : (
              <>
                <FiPrinter className="mr-2" /> Hiện mã QR
              </>
            )}
          </Button>
          {lot.status !== 'CANCELLED' && (
            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-100 hover:bg-red-50"
              onClick={() => setIsCancelModalOpen(true)}
            >
              <FiXCircle className="mr-2" /> Hủy lô hàng
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-xl shadow-stone-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-8 -mt-8 flex items-center justify-center p-4">
              <FiPackage className="text-emerald-200 text-3xl ml-4 mt-4" />
            </div>

            <div className="relative z-10 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">
                    {lot.lotCode}
                  </span>
                  <LotStatusBadge status={lot.status as TLotStatus} />
                </div>
                <h2 className="text-xl font-bold text-stone-900 leading-tight">
                  {lot.productName}
                </h2>
                <p className="text-stone-400 text-sm mt-1">{lot.shopName}</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-stone-50">
                <InfoItem icon={FiHash} label="Số lượng" value={`${lot.quantity} ${lot.unit}`} />
                <InfoItem
                  icon={FiCalendar}
                  label="Ngày sản xuất"
                  value={
                    lot.productionDate ? format(new Date(lot.productionDate), 'dd/MM/yyyy') : '---'
                  }
                />
                <InfoItem
                  icon={FiCalendar}
                  label="Hạn sử dụng"
                  value={lot.expiryDate ? format(new Date(lot.expiryDate), 'dd/MM/yyyy') : '---'}
                />
                <InfoItem
                  icon={FiCalendar}
                  label="Ngày tạo lô"
                  value={format(new Date(lot.createdAt), 'dd/MM/yyyy HH:mm')}
                />
              </div>

              {lot.inputMaterials && (
                <div className="bg-stone-50 p-4 rounded-xl mt-4">
                  <p className="text-xs font-bold text-stone-400 uppercase mb-2">
                    Nguyên liệu đầu vào
                  </p>
                  <p className="text-sm text-stone-600">{lot.inputMaterials}</p>
                </div>
              )}

              {lot.notes && (
                <div className="bg-stone-50 p-4 rounded-xl mt-4">
                  <p className="text-xs font-bold text-stone-400 uppercase mb-2">Ghi chú</p>
                  <p className="text-sm text-stone-600 italic">{lot.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          {showQR && (
            <div className="bg-white rounded-xl p-6 border border-emerald-100 shadow-xl shadow-emerald-500/10 text-center animate-in fade-in zoom-in duration-300">
              <h3 className="font-bold text-stone-900 mb-4">Mã QR Truy xuất (Master)</h3>
              <div className="bg-white p-4 rounded-xl border-2 border-stone-50 inline-block shadow-inner">
                <QRCode value={publicUrl} size={180} />
              </div>
              <p className="text-xs text-stone-400 mt-4 px-4 leading-relaxed">
                Khách hàng có thể quét mã này để truy xuất nguồn gốc sản phẩm nhanh chóng.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(publicUrl, '_blank')}
                >
                  <FiExternalLink className="mr-2" /> Xem trang Public
                </Button>

                <hr className="my-2 border-stone-100" />
                <h4 className="font-bold text-sm text-stone-700 text-left">Quản lý Tem Độc Bản</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateQRs}
                    disabled={generating}
                  >
                    {generating ? 'Đang xử lý...' : 'Sinh Tem Loạt'}
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleOpenPrintModal}>
                    <FiPrinter className="mr-2" /> In Tem
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Timeline & Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900">Timeline chuỗi cung ứng</h3>

            {lot.status !== 'CANCELLED' && (
              <div className="relative group">
                <Button variant="primary" size="sm" className="rounded-xl">
                  <FiPlus className="mr-2" /> Ghi nhận bước tiếp theo
                </Button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-stone-100 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 py-2">
                  {!lot.steps?.some((step) => step.stepType === 'PRODUCTION') && (
                    <StepOption
                      label="Sản xuất"
                      onClick={() => {
                        setSelectedStepType('PRODUCTION');
                        setIsStepModalOpen(true);
                      }}
                    />
                  )}
                  <StepOption
                    label="Chế biến"
                    onClick={() => {
                      setSelectedStepType('PROCESSING');
                      setIsStepModalOpen(true);
                    }}
                  />
                  <StepOption
                    label="Lưu kho"
                    onClick={() => {
                      setSelectedStepType('STORAGE');
                      setIsStepModalOpen(true);
                    }}
                  />
                  <StepOption
                    label="Vận chuyển"
                    onClick={() => {
                      setSelectedStepType('TRANSPORT');
                      setIsStepModalOpen(true);
                    }}
                  />
                  <StepOption
                    label="Xuất bán / Phân phối"
                    onClick={() => {
                      setSelectedStepType('DISTRIBUTION');
                      setIsStepModalOpen(true);
                    }}
                  />
                  <StepOption
                    label="Kiểm định"
                    onClick={() => {
                      setSelectedStepType('TESTING');
                      setIsStepModalOpen(true);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <SupplyChainTimeline steps={lot.steps || []} />
        </div>
      </div>

      <StepFormModal
        isOpen={isStepModalOpen}
        onClose={() => setIsStepModalOpen(false)}
        stepType={selectedStepType}
        onSubmit={handleRecordStep}
      />

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Hủy lô hàng"
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Bạn có chắc chắn muốn hủy lô hàng này không? Hành động này không thể hoàn tác và lô hàng
            sẽ không thể sử dụng để xuất kho hay sinh tem QR được nữa.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              Đóng
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleCancelLot}
            >
              Xác nhận Hủy
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Submit */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Gửi duyệt lô hàng"
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Bạn có chắc chắn muốn gửi yêu cầu duyệt lô hàng này?
            <br />
            <br />
            <strong>Lưu ý:</strong> Sau khi gửi duyệt, lô hàng sẽ chuyển sang trạng thái{' '}
            <strong>Chờ duyệt</strong> và bạn sẽ không thể chỉnh sửa các thông tin cơ bản cho đến
            khi có kết quả từ Admin.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" onClick={handleSubmitVerification}>
              Xác nhận Gửi
            </Button>
          </div>
        </div>
      </Modal>

      {lot && (
        <PrintQrModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          lot={lot}
          qrCodes={qrCodes}
        />
      )}
    </div>
  );
};

interface InfoItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest leading-none mb-1">
        {label}
      </p>
      <p className="font-semibold text-stone-700 leading-none">{value}</p>
    </div>
  </div>
);

interface StepOptionProps {
  label: string;
  onClick: () => void;
}

const StepOption = ({ label, onClick }: StepOptionProps) => {
  // Logic suggest step could go here
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
    >
      {label}
    </button>
  );
};

export default LotDetailPage;
