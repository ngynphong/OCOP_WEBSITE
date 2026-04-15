'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AddressSelector } from '@/features/checkout/components/AddressSelector';
import { ShippingSelector } from '@/features/checkout/components/ShippingSelector';
import { PaymentMethodSelector } from '@/features/checkout/components/PaymentMethodSelector';
import { CheckoutSummary } from '@/features/checkout/components/CheckoutSummary';
import { Address, ShippingProvider, PaymentMethod } from '@/features/checkout/types/checkoutTypes';
import { ChevronLeft, ShoppingBag, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useUserAddresses } from '@/features/address/hooks/useAddress';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItem } from '@/features/cart/types/cartTypes';
import { useEstimateShippingFee } from '@/features/shipping/hooks/useShipping';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

interface CheckoutCartItem extends CartItem {
  weightGram?: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: addresses, isLoading: isAddressLoading } = useUserAddresses();
  const { data: cartResponse, isLoading: isCartLoading } = useCart();
  const { mutateAsync: estimateFee } = useEstimateShippingFee();

  const [userSelectedAddress, setUserSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedShipping, setSelectedShipping] = useState<ShippingProvider | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [providerFees, setProviderFees] = useState<Record<string, number>>({});

  const effectiveAddress = useMemo(() => {
    if (userSelectedAddress) return userSelectedAddress;
    if (addresses && addresses.length > 0) {
      return addresses.find((a) => a.isDefault) || addresses[0];
    }
    return undefined;
  }, [userSelectedAddress, addresses]);

  const cartData = cartResponse?.data;
  const checkoutItems = useMemo(() => cartData?.items || [], [cartData?.items]);

  const shopsInCart = useMemo(() => {
    const shops: Record<number, { weight: number }> = {};
    checkoutItems.forEach((item) => {
      if (!shops[item.shopId]) {
        shops[item.shopId] = { weight: 0 };
      }
      shops[item.shopId].weight += (item as CheckoutCartItem).weightGram || 500 * item.qty;
    });
    return shops;
  }, [checkoutItems]);

  React.useEffect(() => {
    const calculateFees = async () => {
      if (!effectiveAddress || Object.keys(shopsInCart).length === 0) return;

      setIsCalculating(true);
      try {
        if (selectedShipping) {
          let totalFee = 0;
          for (const shopId of Object.keys(shopsInCart)) {
            const res = await estimateFee({
              providerId: selectedShipping.id,
              shopId: parseInt(shopId),
              toDistrictId: effectiveAddress.districtId,
              toWardCode: effectiveAddress.wardId.toString(),
              weightGram: shopsInCart[parseInt(shopId)].weight,
              insuranceValue: 0,
              height: 0,
              length: 0,
              width: 0,
            });

            if (res.data.services && res.data.services.length > 0) {
              totalFee += res.data.services[0].fee;
            }
          }
          setProviderFees((prev) => ({ ...prev, [selectedShipping.id]: totalFee }));

          setSelectedShipping((prev) => (prev ? { ...prev, baseFee: totalFee } : undefined));
        }
      } catch (error) {
        console.error('Failed to estimate shipping fee:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateFees();
  }, [effectiveAddress, selectedShipping?.id, shopsInCart, estimateFee, selectedShipping]);

  const subtotal = useMemo(() => cartData?.totalAmount || 0, [cartData?.totalAmount]);
  const shippingFee = useMemo(() => selectedShipping?.baseFee || 0, [selectedShipping?.baseFee]);
  const discount = 0; // Giả sử chưa có voucher

  const handlePlaceOrder = useCallback(() => {
    if (!effectiveAddress) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    if (!selectedShipping) {
      toast.error('Vui lòng chọn đơn vị vận chuyển');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đặt hàng thành công!');
      router.push('/dashboard/don-hang');
    }, 2000);
  }, [effectiveAddress, selectedShipping, router]);

  const handleSelectAddress = useCallback((address: Address) => {
    setUserSelectedAddress(address);
  }, []);

  const handleSelectShipping = useCallback((provider: ShippingProvider) => {
    setSelectedShipping(provider);
  }, []);

  const handleSelectPayment = useCallback((method: PaymentMethod) => {
    setSelectedPayment(method);
  }, []);

  const canConfirm = useMemo(
    () => !!effectiveAddress && !!selectedShipping && !!selectedPayment && checkoutItems.length > 0,
    [effectiveAddress, selectedShipping, selectedPayment, checkoutItems.length],
  );

  if (isCartLoading || isAddressLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
        <div className="flex flex-col gap-8">
          {/* Breadcrumb / Back Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/gio-hang"
              className="p-3 bg-white rounded-2xl border border-stone-200 text-stone-600 hover:text-green-700 hover:border-green-200 transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tight">Thanh toán</h1>
              <p className="text-stone-500 text-sm font-medium mt-1">
                Vui lòng kiểm tra lại thông tin đơn hàng của bạn
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms & Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Section */}
              <section className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-xl shadow-stone-200/50">
                <AddressSelector selectedId={effectiveAddress?.id} onSelect={handleSelectAddress} />

                <ShippingSelector
                  selectedId={selectedShipping?.id}
                  onSelect={handleSelectShipping}
                  providerFees={providerFees}
                  isCalculating={isCalculating}
                />

                <PaymentMethodSelector
                  selectedId={selectedPayment}
                  onSelect={handleSelectPayment}
                />
              </section>

              {/* Order Items Review */}
              <section className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-xl shadow-stone-200/50">
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  Sản phẩm trong đơn hàng
                </h3>

                <div className="space-y-4">
                  {checkoutItems.length > 0 ? (
                    checkoutItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-2xl bg-stone-50/50 border border-stone-100"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-stone-100 shrink-0">
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">
                            <Store size={10} />
                            {item.shopName}
                          </div>
                          <h4 className="text-sm font-bold text-stone-900 line-clamp-1">
                            {item.productName}
                          </h4>
                          <p className="text-xs text-stone-500 mt-0.5">{item.variantName}</p>
                          <div className="flex justify-between items-end mt-2">
                            <p className="text-xs font-medium text-stone-400">
                              Số lượng: <span className="text-stone-900 font-bold">{item.qty}</span>
                            </p>
                            <p className="text-sm font-black text-green-700">
                              {(item.currentPrice * item.qty).toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-stone-500">Giỏ hàng của bạn đang trống.</p>
                      <Link
                        href="/san-pham"
                        className="text-green-600 font-bold hover:underline mt-2 inline-block"
                      >
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Right Column - Summary Sidebar */}
            <div className="lg:col-span-1">
              <CheckoutSummary
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                isPending={isSubmitting}
                onConfirm={handlePlaceOrder}
                canConfirm={canConfirm}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      {isSubmitting && <LoadingOverlay />}
    </div>
  );
}
