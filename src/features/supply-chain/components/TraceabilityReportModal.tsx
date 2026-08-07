import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { FiAlertTriangle, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface TraceabilityReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotCode: string;
}

export const TraceabilityReportModal = ({
  isOpen,
  onClose,
  lotCode,
}: TraceabilityReportModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterPhone: '',
    reporterEmail: '',
    reportType: 'QUALITY_ISSUE',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // Giả lập call API báo cáo
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Đã gửi báo cáo thành công. Ban quản trị sẽ liên hệ sớm nhất.');
      onClose();
    } catch {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Báo cáo Vấn đề Truy xuất" maxWidth="max-w-xl">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6 flex gap-3 text-sm font-medium">
        <FiAlertTriangle className="shrink-0 mt-0.5" size={18} />
        <p>
          Báo cáo của bạn giúp bảo vệ cộng đồng và ngăn chặn hàng giả, hàng kém chất lượng trên hệ
          thống OCOP.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5 mb-1">
            Mã lô hàng
          </label>
          <input
            type="text"
            disabled
            value={lotCode}
            className="w-full px-4 py-2 bg-stone-100 text-stone-500 border border-stone-200 rounded-xl outline-none font-black tracking-widest uppercase cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
              Họ tên người báo cáo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="reporterName"
              required
              value={formData.reporterName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold"
              placeholder="Nhập họ tên"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
              <FiPhone size={12} className="text-emerald-500" />
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="reporterPhone"
              required
              value={formData.reporterPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold"
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
              <FiMail size={12} className="text-emerald-500" />
              Email (tùy chọn)
            </label>
            <input
              type="email"
              name="reporterEmail"
              value={formData.reporterEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold"
              placeholder="Nhập email"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
            Loại báo cáo <span className="text-red-500">*</span>
          </label>
          <select
            name="reportType"
            required
            value={formData.reportType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm font-semibold"
          >
            <option value="QUALITY_ISSUE">Sản phẩm kém chất lượng/hỏng</option>
            <option value="FAKE_PRODUCT">Nghi ngờ hàng giả</option>
            <option value="INFO_MISMATCH">Thông tin truy xuất không khớp thực tế</option>
            <option value="OTHER">Lý do khác</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1.5">
            <FiMessageSquare size={12} className="text-emerald-500" />
            Chi tiết vấn đề <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Mô tả chi tiết vấn đề bạn gặp phải để chúng tôi có thể hỗ trợ tốt nhất..."
            className="w-full px-4 py-2 bg-stone-50 text-gray-700 border border-stone-200 rounded-xl outline-none resize-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-stone-50">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            className="bg-amber-600 border-amber-600 hover:bg-amber-700 hover:border-amber-700 text-white"
          >
            Gửi Báo Cáo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
