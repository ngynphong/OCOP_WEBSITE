import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { ICreateLotReq } from '../types/supplyChainTypes';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import { Product } from '@/features/products/types/productTypes';
import { FiPackage, FiCalendar, FiHash, FiFileText } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

interface CreateLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: ICreateLotReq) => Promise<void>;
}

export const CreateLotModal = ({ isOpen, onClose, onSuccess, onSubmit }: CreateLotModalProps) => {
  const [formData, setFormData] = useState<ICreateLotReq>({
    lotCode: '',
    productId: 0,
    productionDate: '',
    expiryDate: '',
    quantity: 1,
    unit: 'kg',
    notes: '',
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
  }, [isOpen]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const resp = await sellerProductApi.getProducts({ pageNo: 1, pageSize: 100 });
      setProducts(resp.data.items || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'productId' || name === 'quantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId) {
      toast.error('Vui lòng chọn sản phẩm');
      return;
    }
    if (!formData.lotCode) {
      toast.error('Vui lòng nhập mã lô hàng');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      toast.success('Tạo lô hàng thành công');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Create lot error', error);
      let errorMessage = 'Có lỗi xảy ra khi tạo lô hàng';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Lô Hàng Mới" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lot Code */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <FiHash className="text-emerald-600" />
              Mã lô hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lotCode"
              required
              placeholder="Ví dụ: LOT-2026-001"
              value={formData.lotCode}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-stone-50 text-gray-700 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>

          {/* Product Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <FiPackage className="text-emerald-600" />
              Sản phẩm <span className="text-red-500">*</span>
            </label>
            <select
              name="productId"
              required
              value={formData.productId}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-4 py-2.5 bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none appearance-none"
            >
              <option value={0}>Chọn sản phẩm...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <FiHash className="text-emerald-600" />
              Số lượng <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                name="quantity"
                min={1}
                required
                value={formData.quantity}
                onChange={handleChange}
                className="flex-1 px-4 py-2.5 bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              />
              <input
                type="text"
                name="unit"
                placeholder="Đơn vị (kg, hộp...)"
                value={formData.unit}
                onChange={handleChange}
                className="w-24 px-4 py-2.5 bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <FiCalendar className="text-emerald-600" />
              Ngày sản xuất
            </label>
            <input
              type="date"
              name="productionDate"
              value={formData.productionDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <FiCalendar className="text-emerald-600" />
              Hạn sử dụng
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
            <FiFileText className="text-emerald-600" />
            Ghi chú
          </label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Mô tả thêm về lô hàng này..."
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Tạo lô hàng
          </Button>
        </div>
      </form>
    </Modal>
  );
};
