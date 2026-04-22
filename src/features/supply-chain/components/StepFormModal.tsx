import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import {
  TStepType,
  IProductionStepReq,
  IProcessingStepReq,
  IStorageStepReq,
  ITransportStepReq,
  IDistributionStepReq,
  TStorageType,
} from '../types/supplyChainTypes';

export type TStepFormData = Partial<
  IProductionStepReq &
    IProcessingStepReq &
    IStorageStepReq &
    ITransportStepReq &
    IDistributionStepReq
>;
import {
  FiMapPin,
  FiInfo,
  FiUser,
  FiCalendar,
  FiHash,
  FiTruck,
  FiDatabase,
  FiClock,
  FiCheckCircle,
  FiPackage,
  FiShoppingBag,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface StepFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  stepType: TStepType | null;
  onSubmit: (data: TStepFormData) => Promise<void>;
}

export const StepFormModal = ({ isOpen, onClose, stepType, onSubmit }: StepFormModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TStepFormData>({});

  // Reset form data when stepType changes or modal opens
  React.useEffect(() => {
    if (isOpen && stepType) {
      setFormData(getInitialData(stepType));
    }
  }, [isOpen, stepType]);

  const getInitialData = (type: TStepType) => {
    const common = { notes: '', imageUrls: '[]' };
    switch (type) {
      case 'PRODUCTION':
        return {
          ...common,
          farmName: '',
          farmLocation: '',
          productionMethod: '',
          plantingDate: '',
          harvestDate: '',
          responsiblePerson: '',
        };
      case 'PROCESSING':
        return {
          ...common,
          facilityName: '',
          facilityAddress: '',
          processType: '',
          processDate: '',
          outputQuantity: 0,
          unit: 'kg',
          qualityCheckResult: '',
        };
      case 'STORAGE':
        return {
          ...common,
          warehouseName: '',
          warehouseAddress: '',
          storageType: 'AMBIENT' as TStorageType,
          storageTemperature: 0,
          storageHumidity: 0,
          storedDate: '',
          expectedReleaseDate: '',
        };
      case 'TRANSPORT':
        return {
          ...common,
          carrierName: '',
          vehicleInfo: '',
          originAddress: '',
          destinationAddress: '',
          departedAt: '',
          arrivedAt: '',
          trackingNumber: '',
        };
      case 'DISTRIBUTION':
        return {
          ...common,
          distributorName: '',
          distributorAddress: '',
          distributionDate: '',
          distributedQuantity: 0,
          unit: 'kg',
          salesChannel: '',
        };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: type === 'number' ? Number(value) : value,
        }) as TStepFormData,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast.success('Ghi nhận bước thành công');
      onClose();
    } catch (error: unknown) {
      console.error('Record step error', error);
      let errorMessage = 'Có lỗi xảy ra khi ghi nhận bước';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!stepType) return null;

  const renderFields = () => {
    switch (stepType) {
      case 'PRODUCTION':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tên trang trại/Cơ sở"
              name="farmName"
              icon={FiMapPin}
              required
              value={formData.farmName}
              onChange={handleChange}
            />
            <InputField
              label="Địa chỉ"
              name="farmLocation"
              icon={FiMapPin}
              required
              value={formData.farmLocation}
              onChange={handleChange}
            />
            <InputField
              label="Phương pháp sản xuất"
              name="productionMethod"
              icon={FiInfo}
              required
              value={formData.productionMethod}
              onChange={handleChange}
            />
            <InputField
              label="Người phụ trách"
              name="responsiblePerson"
              icon={FiUser}
              required
              value={formData.responsiblePerson}
              onChange={handleChange}
            />
            <InputField
              label="Ngày gieo trồng/Bắt đầu"
              name="plantingDate"
              icon={FiCalendar}
              type="date"
              value={formData.plantingDate}
              onChange={handleChange}
            />
            <InputField
              label="Ngày thu hoạch"
              name="harvestDate"
              icon={FiCalendar}
              type="date"
              value={formData.harvestDate}
              onChange={handleChange}
            />
          </div>
        );
      case 'PROCESSING':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tên cơ sở chế biến"
              name="facilityName"
              icon={FiDatabase}
              required
              value={formData.facilityName}
              onChange={handleChange}
            />
            <InputField
              label="Địa chỉ"
              name="facilityAddress"
              icon={FiMapPin}
              required
              value={formData.facilityAddress}
              onChange={handleChange}
            />
            <InputField
              label="Quy trình chế biến"
              name="processType"
              icon={FiInfo}
              required
              value={formData.processType}
              onChange={handleChange}
            />
            <InputField
              label="Ngày chế biến"
              name="processDate"
              icon={FiCalendar}
              type="date"
              required
              value={formData.processDate}
              onChange={handleChange}
            />
            <InputField
              label="Sản lượng đầu ra"
              name="outputQuantity"
              icon={FiHash}
              type="number"
              required
              value={formData.outputQuantity}
              onChange={handleChange}
            />
            <InputField
              label="Đơn vị"
              name="unit"
              icon={FiPackage}
              required
              value={formData.unit}
              onChange={handleChange}
            />
            <div className="md:col-span-2">
              <InputField
                label="Kết quả kiểm định chất lượng"
                name="qualityCheckResult"
                icon={FiCheckCircle}
                required
                value={formData.qualityCheckResult}
                onChange={handleChange}
              />
            </div>
          </div>
        );
      case 'STORAGE':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tên kho"
              name="warehouseName"
              icon={FiClock}
              required
              value={formData.warehouseName}
              onChange={handleChange}
            />
            <InputField
              label="Địa chỉ kho"
              name="warehouseAddress"
              icon={FiMapPin}
              required
              value={formData.warehouseAddress}
              onChange={handleChange}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-500 uppercase">
                Loại hình bảo quản
              </label>
              <select
                name="storageType"
                value={formData.storageType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none"
              >
                <option value="AMBIENT">Nhiệt độ thường</option>
                <option value="REFRIGERATED">Mát (2-8°C)</option>
                <option value="FROZEN">Đông lạnh (0°C)</option>
                <option value="CONTROLLED_ATMOSPHERE">Khí quyển kiểm soát</option>
              </select>
            </div>
            <InputField
              label="Nhiệt độ (°C)"
              name="storageTemperature"
              icon={FiInfo}
              type="number"
              value={formData.storageTemperature}
              onChange={handleChange}
            />
            <InputField
              label="Ngày nhập kho"
              name="storedDate"
              icon={FiCalendar}
              type="date"
              required
              value={formData.storedDate}
              onChange={handleChange}
            />
            <InputField
              label="Dự kiến xuất kho"
              name="expectedReleaseDate"
              icon={FiCalendar}
              type="date"
              value={formData.expectedReleaseDate}
              onChange={handleChange}
            />
          </div>
        );
      case 'TRANSPORT':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Đơn vị vận chuyển"
              name="carrierName"
              icon={FiTruck}
              required
              value={formData.carrierName}
              onChange={handleChange}
            />
            <InputField
              label="Mã vận đơn"
              name="trackingNumber"
              icon={FiCheckCircle}
              required
              value={formData.trackingNumber}
              onChange={handleChange}
            />
            <InputField
              label="Thông tin phương tiện"
              name="vehicleInfo"
              icon={FiInfo}
              required
              value={formData.vehicleInfo}
              onChange={handleChange}
            />
            <InputField
              label="Điểm xuất phát"
              name="originAddress"
              icon={FiMapPin}
              required
              value={formData.originAddress}
              onChange={handleChange}
            />
            <InputField
              label="Điểm đến"
              name="destinationAddress"
              icon={FiMapPin}
              required
              value={formData.destinationAddress}
              onChange={handleChange}
            />
            <InputField
              label="Thời gian khởi hành"
              name="departedAt"
              icon={FiCalendar}
              type="datetime-local"
              required
              value={formData.departedAt}
              onChange={handleChange}
            />
            <InputField
              label="Thời gian đến dự kiến"
              name="arrivedAt"
              icon={FiCalendar}
              type="datetime-local"
              value={formData.arrivedAt}
              onChange={handleChange}
            />
          </div>
        );
      case 'DISTRIBUTION':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Tên nhà phân phối"
              name="distributorName"
              icon={FiShoppingBag}
              required
              value={formData.distributorName}
              onChange={handleChange}
            />
            <InputField
              label="Địa chỉ"
              name="distributorAddress"
              icon={FiMapPin}
              required
              value={formData.distributorAddress}
              onChange={handleChange}
            />
            <InputField
              label="Ngày phân phối"
              name="distributionDate"
              icon={FiCalendar}
              type="date"
              required
              value={formData.distributionDate}
              onChange={handleChange}
            />
            <InputField
              label="Kênh bán lẻ"
              name="salesChannel"
              icon={FiInfo}
              required
              value={formData.salesChannel}
              onChange={handleChange}
            />
            <InputField
              label="Số lượng phân phối"
              name="distributedQuantity"
              icon={FiHash}
              type="number"
              required
              value={formData.distributedQuantity}
              onChange={handleChange}
            />
            <InputField
              label="Đơn vị"
              name="unit"
              icon={FiPackage}
              required
              value={formData.unit}
              onChange={handleChange}
            />
          </div>
        );
    }
  };

  const getTitle = () => {
    switch (stepType) {
      case 'PRODUCTION':
        return 'Ghi nhận Sản xuất';
      case 'PROCESSING':
        return 'Ghi nhận Chế biến';
      case 'STORAGE':
        return 'Ghi nhận Lưu kho';
      case 'TRANSPORT':
        return 'Ghi nhận Vận chuyển';
      case 'DISTRIBUTION':
        return 'Ghi nhận Phân phối';
      default:
        return 'Ghi nhận bước mới';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderFields()}

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase">Ghi chú thêm</label>
          <textarea
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Thêm mô tả chi tiết nếu có..."
            className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-stone-50">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Lưu ghi nhận
          </Button>
        </div>
      </form>
    </Modal>
  );
};

interface InputFieldProps {
  label: string;
  name: string;
  icon: React.ElementType;
  required?: boolean;
  type?: string;
  value: string | number | null | undefined;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => void;
}

const InputField = ({
  label,
  name,
  icon: Icon,
  required,
  type = 'text',
  value,
  onChange,
}: InputFieldProps) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
      <Icon size={12} className="text-emerald-500" />
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      required={required}
      value={value || ''}
      onChange={onChange}
      className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold"
    />
  </div>
);
