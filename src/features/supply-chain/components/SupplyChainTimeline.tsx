import React from 'react';
import {
  IDistributionStepReq,
  IProcessingStepReq,
  IProductionStepReq,
  IStorageStepReq,
  ISupplyChainStep,
  ITransportStepReq,
  ITestingStepReq,
  TStepType,
} from '../types/supplyChainTypes';
import {
  FiPackage,
  FiTruck,
  FiDatabase,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiUser,
  FiInfo,
  FiShield,
  FiFileText,
  FiCalendar,
} from 'react-icons/fi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SupplyChainTimelineProps {
  steps: ISupplyChainStep[];
  className?: string;
  compact?: boolean;
}

const stepConfig: Record<TStepType, { label: string; icon: React.ElementType; color: string }> = {
  PRODUCTION: { label: 'Sản xuất', icon: FiPackage, color: 'text-blue-600 bg-blue-100' },
  PROCESSING: { label: 'Chế biến', icon: FiDatabase, color: 'text-orange-600 bg-orange-100' },
  STORAGE: { label: 'Lưu kho', icon: FiClock, color: 'text-purple-600 bg-purple-100' },
  TRANSPORT: { label: 'Vận chuyển', icon: FiTruck, color: 'text-amber-600 bg-amber-100' },
  DISTRIBUTION: {
    icon: FiShoppingBag,
    color: 'bg-emerald-100 text-emerald-600',
    label: 'Xuất bán / Phân phối',
  },
  TESTING: { label: 'Kiểm định', icon: FiShield, color: 'text-indigo-600 bg-indigo-100' },
};

export const SupplyChainTimeline = ({ steps, className, compact }: SupplyChainTimelineProps) => {
  // Sort steps by recordedAt locally to be safe, though API should handle it
  const sortedSteps = [...steps].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );

  return (
    <div
      className={cn(
        'relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-200 before:to-transparent',
        className,
      )}
    >
      {sortedSteps.map((step, index) => {
        const config = stepConfig[step.stepType] || {
          label: step.stepType,
          icon: FiInfo,
          color: 'bg-stone-100 text-stone-600',
        };

        return (
          <div key={index} className="relative flex items-start group gap-4">
            {/* Timeline dot */}
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shrink-0 shadow-sm z-10 bg-white">
              <div
                className={`flex items-center justify-center w-full h-full rounded-full ${config.color}`}
              >
                <config.icon size={16} />
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white rounded-xl p-5 border border-stone-100 shadow-xl shadow-stone-200/40 group-hover:border-emerald-200/50 transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  {config.label}
                </h4>
                <span className="text-xs font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
                  {format(new Date(step.recordedAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                </span>
              </div>

              {/* Step Specific Data Rendering */}
              <div
                className={cn(
                  'grid gap-4 text-sm',
                  compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2',
                )}
              >
                {renderStepDetails(step)}
              </div>

              {/* Note if exists */}
              {step.data.notes && (
                <div className="mt-4 pt-4 border-t border-stone-50 flex gap-2 italic text-stone-500">
                  <FiInfo className="shrink-0 mt-1" size={14} />
                  <p className="text-sm">{step.data.notes}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {sortedSteps.length === 0 && (
        <div className="text-center py-12 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <FiClock className="mx-auto text-stone-300 mb-3" size={32} />
          <p className="text-stone-500 font-medium">
            Chưa có thông tin chuỗi cung ứng được ghi nhận.
          </p>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
}) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
        <Icon size={14} />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
          {label}
        </span>
        <span className="font-semibold text-stone-700 leading-tight">{value}</span>
      </div>
    </div>
  );
};

const renderStepDetails = (step: ISupplyChainStep) => {
  switch (step.stepType) {
    case 'PRODUCTION': {
      const data = step.data as IProductionStepReq;
      return (
        <>
          <DetailItem icon={FiMapPin} label="Cơ sở/Trang trại" value={data.farmName} />
          <DetailItem icon={FiMapPin} label="Địa điểm" value={data.farmLocation} />
          <DetailItem icon={FiInfo} label="Phương pháp" value={data.productionMethod} />
          <DetailItem icon={FiUser} label="Người phụ trách" value={data.responsiblePerson} />
          {data.plantingDate && (
            <DetailItem
              icon={FiCalendar}
              label="Bắt đầu (Sản xuất/Gieo trồng)"
              value={format(new Date(data.plantingDate), 'dd/MM/yyyy')}
            />
          )}
          {data.harvestDate && (
            <DetailItem
              icon={FiCalendar}
              label="Hoàn thành (Thu hoạch)"
              value={format(new Date(data.harvestDate), 'dd/MM/yyyy')}
            />
          )}
        </>
      );
    }
    case 'PROCESSING': {
      const data = step.data as IProcessingStepReq;
      return (
        <>
          <DetailItem icon={FiMapPin} label="Cơ sở chế biến" value={data.facilityName} />
          <DetailItem icon={FiInfo} label="Quy trình" value={data.processType} />
          <DetailItem icon={FiCheckCircle} label="Kiểm định" value={data.qualityCheckResult} />
          <DetailItem
            icon={FiPackage}
            label="Sản lượng"
            value={`${data.outputQuantity} ${data.unit}`}
          />
          {data.qualityDocumentUrl && (
            <div className="flex items-start gap-3 col-span-1 md:col-span-2">
              <div className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-400 shrink-0">
                <FiFileText size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider font-bold text-stone-400">
                  Tài liệu kiểm định
                </span>
                <a
                  href={data.qualityDocumentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-emerald-600 leading-tight hover:underline"
                >
                  Xem tài liệu đính kèm
                </a>
              </div>
            </div>
          )}
        </>
      );
    }
    case 'STORAGE': {
      const data = step.data as IStorageStepReq;
      return (
        <>
          <DetailItem icon={FiMapPin} label="Kho bãi" value={data.warehouseName} />
          <DetailItem icon={FiInfo} label="Hình thức" value={data.storageType} />
          <DetailItem
            icon={FiInfo}
            label="Điều kiện"
            value={data.storageTemperature ? `${data.storageTemperature}°C` : null}
          />
          <DetailItem icon={FiClock} label="Ngày xuất dự kiến" value={data.expectedReleaseDate} />
        </>
      );
    }
    case 'TRANSPORT': {
      const data = step.data as ITransportStepReq;
      return (
        <>
          <DetailItem icon={FiTruck} label="Đơn vị vận chuyển" value={data.carrierName} />
          <DetailItem icon={FiCheckCircle} label="Mã vận đơn" value={data.trackingNumber} />
          <DetailItem icon={FiMapPin} label="Điểm xuất phát" value={data.originAddress} />
          <DetailItem icon={FiMapPin} label="Điểm đến" value={data.destinationAddress} />
        </>
      );
    }
    case 'DISTRIBUTION': {
      const data = step.data as IDistributionStepReq;
      return (
        <>
          <DetailItem icon={FiShoppingBag} label="Nhà phân phối" value={data.distributorName} />
          <DetailItem icon={FiMapPin} label="Địa chỉ" value={data.distributorAddress} />
          <DetailItem icon={FiCheckCircle} label="Kênh bán lẻ" value={data.salesChannel} />
          <DetailItem
            icon={FiPackage}
            label="Số lượng"
            value={`${data.distributedQuantity} ${data.unit}`}
          />
        </>
      );
    }
    case 'TESTING': {
      const data = step.data as ITestingStepReq;
      return (
        <>
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem icon={FiShield} label="Loại kiểm định" value={data.testType} />
            <DetailItem icon={FiCheckCircle} label="Kết quả" value={data.result} />
            <DetailItem icon={FiMapPin} label="Cơ sở kiểm định" value={data.testingCenterName} />
            <DetailItem icon={FiInfo} label="Tiêu chuẩn" value={data.standardsMet} />
            <DetailItem
              icon={FiClock}
              label="Ngày cấp"
              value={data.issuedDate ? format(new Date(data.issuedDate), 'dd/MM/yyyy') : null}
            />
            <DetailItem icon={FiInfo} label="Mã chứng nhận" value={data.certificateNumber} />
          </div>
          {(() => {
            let docs: string[] = [];
            if (data.documentUrls) {
              try {
                docs = JSON.parse(data.documentUrls);
              } catch {}
            }
            if (docs.length === 0) return null;
            return (
              <div className="col-span-1 md:col-span-2 mt-2 p-3 bg-stone-50 rounded-lg border border-stone-100">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">
                  Tài liệu đính kèm
                </span>
                <div className="flex flex-wrap gap-2">
                  {docs.map((docUrl, idx) => (
                    <a
                      key={idx}
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded text-sm text-indigo-700 hover:bg-indigo-50 transition-colors"
                    >
                      <FiFileText size={14} />
                      <span className="font-medium truncate max-w-[150px]">Tài liệu {idx + 1}</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      );
    }
    default:
      return null;
  }
};
