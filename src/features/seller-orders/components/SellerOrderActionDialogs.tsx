import React, { useState } from 'react';
import { Button } from '@/components/ui/AppButton';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

// Reject Modal
interface RejectOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading: boolean;
}

export const RejectOrderModal: React.FC<RejectOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
        <h3 className="text-xl font-bold text-stone-900 mb-2 mt-2">Từ chối đơn hàng</h3>
        <p className="text-sm text-stone-500 mb-6">
          Xin hãy nhập lý do từ chối để được ghi nhận vào hệ thống gửi tới khách hàng.
        </p>

        <textarea
          className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-4 min-h-[120px] focus:outline-none focus:border-green-600 transition-colors"
          placeholder="Lý do từ chối... (VD: Hết hàng, Sai thông tin...)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <div className="flex gap-3 justify-end mt-6">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => onConfirm(reason)}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? 'Đang gửi...' : 'Từ chối đơn'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Confirm Order Modal (merged with Shipping Info)
interface ConfirmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    note: string,
    shippingProviderId: number,
    trackingNumber: string | null,
    shippingFee: number,
    estimatedDelivery: string,
  ) => void;
  isLoading: boolean;
  defaultShippingFee?: number;
}

export const ConfirmOrderModal: React.FC<ConfirmOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  defaultShippingFee = 0,
}) => {
  const [note, setNote] = useState('Đã chuẩn bị hàng');
  const [providerId, setProviderId] = useState(0); // 0 = Shop tự giao
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shippingFee, setShippingFee] = useState<number | ''>(defaultShippingFee || '');
  const [estimatedDelivery, setEstimatedDelivery] = useState('');

  // Update effect to populate default shipping fee or pre-computations
  React.useEffect(() => {
    if (isOpen) {
      setShippingFee(defaultShippingFee || '');
      // Mặc định ngày giao là hôm nay + 3 ngày
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 3);
      setEstimatedDelivery(defaultDate.toISOString().split('T')[0]);
    }
  }, [isOpen, defaultShippingFee]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-stone-900 mb-2 mt-2">
          Duyệt Đơn & Xác nhận Giao Hàng
        </h3>
        <p className="text-sm text-stone-500 mb-6">
          Vui lòng điền thông tin lô vận chuyển để tiến hành duyệt đơn hàng.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Ghi chú duyệt đơn</label>
            <input
              type="text"
              className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-green-600 font-medium"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Nhà cung cấp vận chuyển
            </label>
            <select
              className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-green-600 font-medium"
              value={providerId}
              onChange={(e) => setProviderId(Number(e.target.value))}
            >
              <option value={0}>Shop tự vận chuyển (Theo thỏa thuận)</option>
              <option value={1}>Giao Hàng Nhanh (GHN)</option>
              <option value={2}>Giao Hàng Tiết Kiệm (GHTK)</option>
              <option value={3}>Viettel Post</option>
              <option value={4}>VNPost</option>
              <option value={5}>J&T Express</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">
                Mã vận đơn (Tùy chọn)
              </label>
              <input
                type="text"
                className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-green-600 font-medium"
                placeholder="Nếu có mã từ hãng..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Cước phí (VNĐ)</label>
              <input
                type="text"
                className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-green-600 font-medium"
                placeholder="VD: 35.000"
                value={formatVNDInput(shippingFee)}
                onChange={(e) => setShippingFee(parseVNDInput(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">Dự kiến giao ngày</label>
            <input
              type="date"
              className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-green-600 font-medium"
              value={estimatedDelivery}
              onChange={(e) => setEstimatedDelivery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={() =>
              onConfirm(
                note,
                providerId,
                trackingNumber.trim() ? trackingNumber.trim() : null,
                Number(shippingFee) || 0,
                estimatedDelivery,
              )
            }
            disabled={isLoading || !estimatedDelivery}
          >
            {isLoading ? 'Đang duyệt...' : 'Xác nhận tạo tuyến'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Update Tracking Modal
interface UpdateTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: string, location: string, description: string) => void;
  isLoading: boolean;
}

export const UpdateTrackingModal: React.FC<UpdateTrackingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [status, setStatus] = useState('IN_TRANSIT');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl relative">
        <h3 className="text-xl font-bold text-stone-900 mb-2 mt-2">Cập nhật Lộ trình Vận đơn</h3>

        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Tình trạng bưu kiện
            </label>
            <select
              className="w-full border-2 border-stone-200 text-gray-700 rounded-xl p-3 focus:outline-none focus:border-green-600 font-medium"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="AWAITING_PICKUP">Chờ lấy hàng (AWAITING PICKUP)</option>
              <option value="PICKED_UP">Đã lấy hàng (PICKED UP)</option>
              <option value="IN_TRANSIT">Đang luân chuyển (IN TRANSIT)</option>
              <option value="OUT_FOR_DELIVERY">Đang đi phát (OUT FOR DELIVERY)</option>
              <option value="DELIVERED">Đã giao thành công (DELIVERED)</option>
              <option value="FAILED">Giao thất bại (FAILED)</option>
              <option value="RETURNED">Hoàn trả về shop (RETURNED)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Vị trí hiện tại (Kho bãi, trạm cục)
            </label>
            <input
              type="text"
              className="w-full border-2 border-stone-200 text-gray-700  rounded-xl p-3 focus:outline-none focus:border-green-600"
              placeholder="VD: Trạm kho trung chuyển HN..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Chi tiết xử lý / Ghi chú
            </label>
            <textarea
              className="w-full border-2 border-stone-200 text-gray-700  rounded-xl p-3 focus:outline-none focus:border-green-600 min-h-[80px]"
              placeholder="VD: Hàng đã lên xe tải..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-8">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button
            onClick={() => onConfirm(status, location, description)}
            disabled={isLoading || !location.trim()}
          >
            {isLoading ? 'Đang lưu...' : 'Thêm mốc theo dõi'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Create Tracking Number Modal (When missing)
interface CreateTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (trackingNumber: string) => void;
  isLoading: boolean;
}

export const CreateTrackingModal: React.FC<CreateTrackingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [tracking, setTracking] = useState('');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl relative">
        <h3 className="text-xl font-bold text-stone-900 mb-2 mt-2">Thêm mã vận đơn</h3>
        <p className="text-sm text-stone-500 mb-6">Mã vận đơn dùng để kết nối lộ trình</p>
        <input
          type="text"
          className="w-full border-2 border-stone-200 rounded-xl p-3 focus:outline-none focus:border-green-600 mb-6"
          placeholder="Nhập mã vận đơn..."
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
        />
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Hủy
          </Button>
          <Button onClick={() => onConfirm(tracking)} disabled={isLoading || !tracking.trim()}>
            {isLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </div>
      </div>
    </div>
  );
};
