'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Zap, Loader2 } from 'lucide-react';
import { AddressSelector } from '@/features/checkout/components/AddressSelector';
import { ShippingSelector } from '@/features/checkout/components/ShippingSelector';
import { PaymentMethodSelector } from '@/features/checkout/components/PaymentMethodSelector';
import { Address, ShippingProvider, PaymentMethod } from '@/features/checkout/types/checkoutTypes';
import { FlashSaleItem } from '../types';
import { useBuyFlashSaleItem } from '../hooks/useFlashSales';
import { usePaymentMethods } from '@/features/payment/hooks/usePaymentMethods';
import { useUserAddresses } from '@/features/address/hooks/useAddress';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface FlashSaleQuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FlashSaleItem;
}

export function FlashSaleQuickBuyModal({ isOpen, onClose, item }: FlashSaleQuickBuyModalProps) {
  const [mounted, setMounted] = useState(false);
  const { data: addresses } = useUserAddresses();
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedShipping, setSelectedShipping] = useState<ShippingProvider | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const { mutate: buyFlashSaleItem, isPending: isSubmitting } = useBuyFlashSaleItem();
  const { data: paymentMethods } = usePaymentMethods();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Derive defaults instead of using useEffect to set state
  const defaultAddress = addresses?.find((a) => a.isDefault) || addresses?.[0];
  const activeAddress = selectedAddress || defaultAddress;

  const defaultPayment = paymentMethods?.[0]?.code;
  const activePayment = selectedPayment || defaultPayment;

  const subtotal = item.salePrice * qty;
  const shippingFee = selectedShipping?.baseFee || 0;
  const total = subtotal + shippingFee;

  const handleBuy = () => {
    if (!activeAddress) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    if (!selectedShipping) {
      toast.error('Vui lòng chọn đơn vị nhận hàng');
      return;
    }

    buyFlashSaleItem(
      {
        flashSaleItemId: item.id,
        data: {
          addressId: activeAddress.id,
          shippingProviderId: selectedShipping.id,
          paymentMethod: activePayment!,
          qty,
        },
      },
      {
        onSuccess: () => {
          toast.success('Đặt hàng Flash Sale thành công!');
          onClose();
        },
        onError: () => {
          toast.error('Đặt hàng thất bại, vui lòng thử lại');
        },
      },
    );
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Left Side: Summary & Product */}
        <div className="w-full md:w-1/3 bg-stone-50 p-8 border-r border-stone-100 overflow-y-auto">
          <div className="flex items-center gap-2 mb-8 bg-red-600 text-white px-4 py-2 rounded-2xl w-fit">
            <Zap className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Flash Sale Mua Ngay
            </span>
          </div>

          <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-stone-200 shadow-sm mb-6">
            <Image src={item.thumbnailUrl} alt={item.productName} fill className="object-cover" />
          </div>

          <h3 className="text-lg font-black text-stone-900 leading-tight mb-2">
            {item.productName}
          </h3>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-black text-red-600">
              {item.salePrice.toLocaleString('vi-VN')}₫
            </span>
            <span className="text-sm text-stone-400 line-through">
              {item.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          </div>

          <div className="space-y-4 pt-6 border-t border-stone-200">
            <div className="flex justify-between items-center text-stone-500 text-sm">
              <span>Số lượng</span>
              <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-lg text-lg font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-stone-900">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-lg text-lg font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-stone-500 text-sm">
              <span>Phí vận chuyển</span>
              <span className="font-bold text-stone-700">
                {shippingFee === 0 ? 'Chưa chọn' : `${shippingFee.toLocaleString('vi-VN')}₫`}
              </span>
            </div>
            <div className="pt-4 border-t border-dashed border-stone-200">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                  Tổng cộng
                </span>
                <span className="text-2xl font-black text-red-600">
                  {total.toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Selectors */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-0">
            <AddressSelector selectedId={activeAddress?.id} onSelect={setSelectedAddress} />
            <ShippingSelector selectedId={selectedShipping?.id} onSelect={setSelectedShipping} />
            <PaymentMethodSelector selectedId={activePayment} onSelect={setSelectedPayment} />
          </div>

          <div className="mt-8">
            <button
              onClick={handleBuy}
              disabled={isSubmitting}
              className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-2xl font-black text-md transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  ĐANG XỬ LÝ...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  XÁC NHẬN MUA NGAY
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-4 font-bold uppercase tracking-widest">
              Đơn hàng Flash Sale sẽ được xử lý ưu tiên
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
