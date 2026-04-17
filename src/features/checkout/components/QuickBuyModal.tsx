'use client';

import React, { useState } from 'react';
import { X, Zap, Loader2 } from 'lucide-react';
import { AddressSelector } from '@/features/checkout/components/AddressSelector';
import { ShippingSelector } from '@/features/checkout/components/ShippingSelector';
import { PaymentMethodSelector } from '@/features/checkout/components/PaymentMethodSelector';
import { Address, ShippingProvider, PaymentMethod } from '@/features/checkout/types/checkoutTypes';
import { Product, ProductVariant } from '@/features/products/types/productTypes';
import { useBuyNow } from '@/features/orders/hooks/useOrders';
import { usePaymentMethods } from '@/features/payment/hooks/usePaymentMethods';
import { useUserAddresses } from '@/features/address/hooks/useAddress';
import { useEstimateShippingFee } from '@/features/shipping/hooks/useShipping';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LoyaltyCheckoutRedeem } from '@/features/loyalty/components/LoyaltyCheckoutRedeem';
import { VoucherCheckoutInput } from '@/features/vouchers/components/VoucherCheckoutInput';
import type { VoucherValidateResponse } from '@/features/vouchers/types';
import { Button } from '@/components/ui/AppButton';

interface QuickBuyModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: ProductVariant;
}

export function QuickBuyModal({ isOpen, onClose, product, selectedVariant }: QuickBuyModalProps) {
  const { data: addresses } = useUserAddresses();
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedShipping, setSelectedShipping] = useState<ShippingProvider | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const { mutate: buyNow, isPending: isSubmitting } = useBuyNow();
  const { data: paymentMethods } = usePaymentMethods();
  const { mutateAsync: estimateFee } = useEstimateShippingFee();

  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [note, setNote] = useState('');
  const [isUsePoints, setIsUsePoints] = useState(false);
  const [redeemInfo, setRedeemInfo] = useState({ points: 0, discount: 0 });
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidateResponse | null>(null);

  // Set default address when addresses are loaded
  React.useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr);
    }
  }, [addresses, selectedAddress]);

  // Set default payment method when methods are loaded
  React.useEffect(() => {
    if (paymentMethods && paymentMethods.length > 0 && !selectedPayment) {
      setSelectedPayment(paymentMethods[0].code);
    }
  }, [paymentMethods, selectedPayment]);

  // Calculate shipping fee exactly like in CheckoutPage
  React.useEffect(() => {
    const calculateFee = async () => {
      if (!selectedAddress || !selectedShipping || !product.shop.id) {
        setShippingFee(0);
        return;
      }
      setIsCalculating(true);
      try {
        const weight = (selectedVariant.weightGram || product.weightGram || 500) * qty;
        const res = await estimateFee({
          providerId: selectedShipping.id,
          shopId: product.shop.id,
          toDistrictId: selectedAddress.districtId,
          toWardCode: selectedAddress.wardId.toString(),
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
    selectedAddress,
    selectedShipping,
    product.shop.id,
    product.weightGram,
    selectedVariant.weightGram,
    qty,
    estimateFee,
  ]);

  const price = selectedVariant.price || product.minPrice;
  const oldPrice = selectedVariant.comparePrice || product.maxPrice;
  const subtotal = price * qty;

  const voucherDiscount = React.useMemo(() => {
    if (!appliedVoucher || !appliedVoucher.valid) return 0;
    let disc = 0;
    if (appliedVoucher.type === 'PERCENT') {
      disc = (subtotal * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscount > 0) {
        disc = Math.min(disc, appliedVoucher.maxDiscount);
      }
    } else {
      disc = appliedVoucher.discountValue;
    }
    return Math.min(disc, subtotal);
  }, [appliedVoucher, subtotal]);

  const totalDiscount = (isUsePoints ? redeemInfo.discount : 0) + voucherDiscount;
  const total = Math.max(0, subtotal + shippingFee - totalDiscount);

  const handleBuy = () => {
    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    if (!selectedShipping) {
      toast.error('Vui lòng chọn đơn vị nhận hàng');
      return;
    }
    if (!selectedPayment) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    buyNow(
      {
        variantId: selectedVariant.id,
        qty: qty,
        addressId: selectedAddress.id,
        shippingProviderId: selectedShipping.id,
        paymentMethod: selectedPayment,
        shippingFee: shippingFee,
        usePoints: isUsePoints ? redeemInfo.points : undefined,
        note: note.trim() || undefined,
        voucherCode: appliedVoucher && appliedVoucher.valid ? appliedVoucher.code : undefined,
      },
      {
        onSuccess: (res) => {
          const { paymentUrl } = res.data;
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            toast.success('Đặt hàng thành công!');
            window.location.href = '/dashboard/don-hang';
          }
        },
        onError: (error: unknown) => {
          const err = error as { response?: { data?: { message?: string } } };
          const resData = err?.response?.data;
          toast.error(resData?.message || 'Đặt hàng thất bại, vui lòng thử lại');
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
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
            className="absolute top-6 right-6 z-20 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 transition-colors"
          >
            <X size={20} />
          </button>

          {/* Left Side: Summary & Product */}
          <div className="w-full md:w-1/3 bg-stone-50 p-8 border-r border-stone-100 overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-8 bg-green-700 text-white px-4 py-2 rounded-2xl w-fit shadow-md shadow-green-700/20">
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-black uppercase tracking-widest">Mua Ngay</span>
            </div>

            <div className="relative aspect-square w-full rounded-3xl overflow-hidden border border-stone-200 shadow-sm mb-6 bg-white">
              <Image
                src={
                  product.thumbnailUrl ||
                  product.images?.find((img) => img.isPrimary)?.url ||
                  product.images?.[0]?.url ||
                  '/images/placeholder.jpg'
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <h3 className="text-lg font-black text-stone-900 leading-tight mb-2 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-stone-500 text-xs font-bold mb-4">
              Phân loại: <span className="text-stone-800">{selectedVariant.variantName}</span>
            </p>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-black text-green-700">
                {price.toLocaleString('vi-VN')}₫
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-sm text-stone-400 line-through">
                  {oldPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-stone-200">
              <div className="flex justify-between items-center text-stone-500 text-sm">
                <span>Số lượng</span>
                <div className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl p-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-lg text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-bold text-stone-900">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-lg text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center text-stone-500 text-sm">
                <span>Phí vận chuyển</span>
                <span className="font-bold text-stone-700">
                  {shippingFee === 0 ? 'Chưa chọn' : `+${shippingFee.toLocaleString('vi-VN')}₫`}
                </span>
              </div>
              {voucherDiscount > 0 && (
                <div className="flex justify-between items-center text-emerald-600 text-sm font-bold bg-emerald-50/50 p-2 rounded-xl animate-in fade-in slide-in-from-right-2">
                  <span>Giảm giá voucher</span>
                  <span>-{voucherDiscount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              {isUsePoints && redeemInfo.discount > 0 && (
                <div className="flex justify-between items-center text-green-700 text-sm font-bold bg-green-50/50 p-2 rounded-xl">
                  <span>Dùng điểm OCOP</span>
                  <span>-{redeemInfo.discount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="pt-4 border-t border-dashed border-stone-200">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-black text-green-700">
                    {total.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Selectors */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <AddressSelector selectedId={selectedAddress?.id} onSelect={setSelectedAddress} />

              <div className="relative">
                {isCalculating && (
                  <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                    <div className="flex items-center gap-2 text-green-700 font-bold bg-white px-4 py-2 rounded-full shadow-md">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang tính phí...</span>
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

              <PaymentMethodSelector selectedId={selectedPayment} onSelect={setSelectedPayment} />

              <div className="pt-4 border-t border-stone-100">
                <VoucherCheckoutInput appliedVoucher={appliedVoucher} onApply={setAppliedVoucher} />
              </div>

              <div className="pt-2">
                <LoyaltyCheckoutRedeem
                  orderAmount={subtotal}
                  isUsed={isUsePoints}
                  onToggle={setIsUsePoints}
                  onUpdateRedeemInfo={(p, d) => setRedeemInfo({ points: p, discount: d })}
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-stone-800 mb-2">
                  Ghi chú đơn hàng
                </label>
                <textarea
                  placeholder="Thêm hướng dẫn giao hàng hoặc ghi chú cho cửa hàng..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-2xl p-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all font-medium placeholder:text-stone-400 placeholder:font-normal resize-none"
                  rows={2}
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={handleBuy}
                disabled={isSubmitting || isCalculating}
                className="w-full py-4 bg-green-700 hover:bg-green-800 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-green-700/20 active:scale-[0.98] flex items-center justify-center gap-3"
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
              </Button>
              <p className="text-center text-[10px] text-stone-400 mt-4 font-bold uppercase tracking-widest">
                Thông tin thanh toán được bảo mật an toàn
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
