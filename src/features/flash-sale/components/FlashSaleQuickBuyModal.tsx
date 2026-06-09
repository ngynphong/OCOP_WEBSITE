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
import { useEstimateShippingFee } from '@/features/shipping/hooks/useShipping';
import { usePublicProductDetailQuery } from '@/features/products/hooks/usePublicProducts';
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

  const { data: productDetail } = usePublicProductDetailQuery(item.productSlug);
  const product = productDetail?.data;
  const { mutateAsync: estimateFee } = useEstimateShippingFee();

  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);

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

  useEffect(() => {
    const calculateFee = async () => {
      if (!activeAddress || !selectedShipping || !product?.shop?.id) {
        setShippingFee(0);
        return;
      }
      setIsCalculating(true);
      try {
        const selectedVariant = product?.variants?.find((v) => v.id === item.variantId);
        const weight = (selectedVariant?.weightGram || product?.weightGram || 500) * qty;
        const res = await estimateFee({
          providerId: selectedShipping.id,
          shopId: product.shop.id,
          toDistrictId: activeAddress.districtId,
          toWardCode: activeAddress.wardId.toString(),
          weightGram: weight,
          insuranceValue: 0,
          height: 0,
          length: 0,
          width: 0,
        });

        if (res.data.services && res.data.services.length > 0) {
          setShippingFee(res.data.services[0].fee);
        } else {
          setShippingFee(0);
        }
      } catch (error) {
        console.error('Failed to estimate shipping fee:', error);
        setShippingFee(0);
      } finally {
        setIsCalculating(false);
      }
    };
    calculateFee();
  }, [
    activeAddress,
    selectedShipping,
    product?.shop?.id,
    product?.weightGram,
    product?.variants,
    item.variantId,
    qty,
    estimateFee,
  ]);

  const subtotal = item.salePrice * qty;
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
          shippingFee,
          voucherCode: '',
          usePoints: 0,
          note: '',
          affiliateCode: '',
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
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-white/80 backdrop-blur hover:bg-stone-100 shadow-sm md:shadow-none rounded-full text-stone-500 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden">
          {/* Left Side: Summary & Product */}
          <div className="w-full md:w-1/3 bg-stone-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-stone-100 md:overflow-y-auto shrink-0">
            <div className="flex items-center gap-2 mb-8 bg-red-600 text-white px-4 py-2 rounded-xl w-fit">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Flash Sale Mua Ngay
              </span>
            </div>

            <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-stone-200 shadow-sm mb-6">
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
                  {shippingFee === 0 ? '0đ' : `${shippingFee.toLocaleString('vi-VN')}₫`}
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
          <div className="flex-1 p-6 md:p-8 md:overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <AddressSelector selectedId={activeAddress?.id} onSelect={setSelectedAddress} />
              <div className="relative">
                {isCalculating && (
                  <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-xl flex items-center justify-center">
                    <div className="flex items-center gap-2 text-red-600 font-bold bg-white px-4 py-2 rounded-full shadow-md shadow-red-600/5">
                      <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      <span className="text-stone-700 text-xs">Đang tính phí...</span>
                    </div>
                  </div>
                )}
                <ShippingSelector
                  selectedId={selectedShipping?.id}
                  onSelect={setSelectedShipping}
                  providerFees={selectedShipping ? { [selectedShipping.id]: shippingFee } : {}}
                  isCalculating={isCalculating}
                />
              </div>
              <PaymentMethodSelector selectedId={activePayment} onSelect={setSelectedPayment} />
            </div>

            <div className="mt-8">
              <button
                onClick={handleBuy}
                disabled={isSubmitting || isCalculating}
                className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-xl font-black text-md transition-all shadow-xl shadow-red-600/20 active:scale-[0.98] flex items-center justify-center gap-3 cursor-pointer"
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
        </div>
      </motion.div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
