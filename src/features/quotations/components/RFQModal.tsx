'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { Product, ProductVariant } from '@/features/products/types/productTypes';
import { useCreateQuotation } from '../hooks/useQuotations';
import Image from 'next/image';
import { formatVNDInput, parseVNDInput } from '@/utils/format';

interface RFQModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: ProductVariant | null;
}

export function RFQModal({ isOpen, onClose, product, selectedVariant }: RFQModalProps) {
  const [quantity, setQuantity] = useState(selectedVariant?.minQuantity || 1);
  const [expectedPrice, setExpectedPrice] = useState<number | undefined>(undefined);
  const [note, setNote] = useState('');

  const { mutate: createQuotation, isPending } = useCreateQuotation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createQuotation(
      {
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
        expectedPrice,
        note,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yêu cầu báo giá sỉ">
      <div className="space-y-2 mb-6">
        <p className="text-stone-500 font-medium">
          Gửi yêu cầu số lượng lớn để nhận báo giá tốt nhất từ chủ thể.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
        {/* Product Summary */}
        <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0">
            <Image
              src={product?.images?.[0]?.url || '/images/placeholder-product.jpg'}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-stone-900 truncate">{product.name}</h4>
            <p className="text-xs text-stone-500 font-medium">
              {selectedVariant?.variantName || 'Mặc định'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-stone-500 uppercase tracking-widest block mb-2">
              Số lượng mua sỉ
            </label>
            <input
              type="number"
              min={selectedVariant?.minQuantity || 1}
              value={quantity}
              onChange={(e) =>
                setQuantity(parseInt(e.target.value) || selectedVariant?.minQuantity || 1)
              }
              className="w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-bold"
              required
            />
            <p className="text-[10px] text-stone-400 font-medium italic mt-1">
              * Tối thiểu: {selectedVariant?.minQuantity || 1} {product.unit}
            </p>
          </div>
          <div>
            <label className="text-xs font-black text-stone-500 uppercase tracking-widest block mb-2">
              Giá mong muốn (₫)
            </label>
            <input
              type="text"
              placeholder="Ví dụ: 120.000"
              value={formatVNDInput(expectedPrice)}
              onChange={(e) => {
                const num = parseVNDInput(e.target.value);
                setExpectedPrice(num > 0 ? num : undefined);
              }}
              className="w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none font-bold"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-black text-stone-500 uppercase tracking-widest block mb-2">
            Ghi chú thêm
          </label>
          <textarea
            placeholder="VD: Tôi cần giao hàng gấp tại Hà Nội, yêu cầu đóng gói kĩ..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border text-gray-700 border-stone-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none min-h-[100px] resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-12"
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isPending}
            isLoading={isPending}
            className="flex-1 rounded-xl h-12 font-black shadow-lg shadow-green-700/20"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
