import React from 'react';
import {
  IDistributionStepReq,
  IProcessingStepReq,
  IProductionStepReq,
  IStorageStepReq,
  ISupplyChainStep,
  ITransportStepReq,
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
} from 'react-icons/fi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SupplyChainTimelineProps {
  steps: ISupplyChainStep[];
  className?: string;
}

const stepConfig: Record<TStepType, { label: string; icon: React.ElementType; color: string }> = {
  PRODUCTION: { label: 'Sản xuất', icon: FiPackage, color: 'text-blue-600 bg-blue-100' },
  PROCESSING: { label: 'Chế biến', icon: FiDatabase, color: 'text-orange-600 bg-orange-100' },
  STORAGE: { label: 'Lưu kho', icon: FiClock, color: 'text-purple-600 bg-purple-100' },
  TRANSPORT: { label: 'Vận chuyển', icon: FiTruck, color: 'text-amber-600 bg-amber-100' },
  DISTRIBUTION: {
    label: 'Phân phối',
    icon: FiShoppingBag,
    color: 'text-emerald-600 bg-emerald-100',
  },
};

export const SupplyChainTimeline = ({ steps, className }: SupplyChainTimelineProps) => {
  // Sort steps by recordedAt locally to be safe, though API should handle it
  const sortedSteps = [...steps].sort(
    (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime(),
  );

  return (
    <div className={cn('relative flex flex-col gap-8', className)}>
      {/* Decorative vertical line */}
      <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-stone-100 hidden sm:block" />

      {sortedSteps.map((step, index) => {
        const config = stepConfig[step.stepType] || stepConfig.PRODUCTION;
        const Icon = config.icon;

        return (
          <div key={index} className="flex flex-col sm:flex-row gap-4 sm:gap-8 relative group">
            {/* Step Icon & Indicator */}
            <div className="flex items-center sm:items-start shrink-0 z-10">
              <div
                className={cn(
                  'w-10 h-10 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-300',
                  config.color,
                )}
              >
                <Icon size={20} />
              </div>
              <div className="ml-4 sm:hidden">
                <h4 className="font-bold text-stone-900">{config.label}</h4>
                <p className="text-xs text-stone-400">
                  {format(new Date(step.recordedAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white rounded-3xl p-5 border border-stone-100 shadow-xl shadow-stone-200/40 group-hover:border-emerald-200/50 transition-colors duration-300">
              <div className="hidden sm:flex justify-between items-center mb-4">
                <h4 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                  {config.label}
                </h4>
                <span className="text-xs font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">
                  {format(new Date(step.recordedAt), 'HH:mm - dd/MM/yyyy', { locale: vi })}
                </span>
              </div>

              {/* Step Specific Data Rendering */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
        <div className="text-center py-12 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
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
    default:
      return null;
  }
};
