'use client';

import React, { useState, useMemo, useCallback, Suspense } from 'react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserAddresses } from '@/features/address/hooks/useAddress';
import { useCart } from '@/features/cart/hooks/useCart';
import { CartItem } from '@/features/cart/types/cartTypes';
import { useEstimateShippingFee } from '@/features/shipping/hooks/useShipping';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { useCreateBatchOrders } from '@/features/orders/hooks/useOrders';
import { useQueryClient } from '@tanstack/react-query';
import { VoucherValidateResponse } from '@/features/vouchers/types';
import { LoyaltyCheckoutRedeem } from '@/features/loyalty/components/LoyaltyCheckoutRedeem';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearSelection } from '@/store/features/cartSlice';

interface CheckoutCartItem extends CartItem {
  weightGram?: number;
}

function CheckoutContent() {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  const { selectedItemIds } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { data: addresses, isLoading: isAddressLoading } = useUserAddresses();
  const { data: cartResponse, isLoading: isCartLoading } = useCart();
  const { mutateAsync: estimateFee } = useEstimateShippingFee();
  const { mutateAsync: createBatchOrders } = useCreateBatchOrders();
  const queryClient = useQueryClient();

  const [userSelectedAddress, setUserSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedShipping, setSelectedShipping] = useState<ShippingProvider | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [providerFees, setProviderFees] = useState<Record<string, number>>({});
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidateResponse | null>(null);
  const [isUsePoints, setIsUsePoints] = useState(false);
  const [redeemInfo, setRedeemInfo] = useState({ points: 0, discount: 0 });
  const [note, setNote] = useState('');
  const [affiliateCode, setAffiliateCode] = useState('');

  const searchParams = useSearchParams();

  // Protect route & check selection
  React.useEffect(() => {
    if (isInitialized && !isSuccess) {
      if (!isAuthenticated) {
        toast.error('Vui lòng đăng nhập để tiếp tục thanh toán');
        router.push(`/dang-nhap?redirect=/checkout`);
        return;
      }
      if (selectedItemIds.length === 0) {
        toast.error('Vui lòng chọn sản phẩm trong giỏ hàng trước khi thanh toán');
        router.push('/gio-hang');
      }
    }
  }, [isInitialized, isAuthenticated, selectedItemIds, router, isSuccess]);

  // Capture affiliate code from URL
  React.useEffect(() => {
    const ref = searchParams.get('ref') || searchParams.get('affiliateCode');
    if (ref) {
      setAffiliateCode(ref);
    }
  }, [searchParams]);

  const effectiveAddress = useMemo(() => {
    if (userSelectedAddress) return userSelectedAddress;
    if (addresses && addresses.length > 0) {
      return addresses.find((a) => a.isDefault) || addresses[0];
    }
    return undefined;
  }, [userSelectedAddress, addresses]);

  const cartData = cartResponse?.data;

  // Filter items based on Redux selection
  const checkoutItems = useMemo(() => {
    const allItems = cartData?.items || [];
    return allItems.filter((item) => selectedItemIds.includes(item.id));
  }, [cartData?.items, selectedItemIds]);

  // Recalculate subtotal for selected items only
  const subtotal = useMemo(() => {
    return checkoutItems.reduce((acc, item) => acc + item.currentPrice * item.qty, 0);
  }, [checkoutItems]);

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
        }
      } catch (error) {
        console.error('Failed to estimate shipping fee:', error);
      } finally {
        setIsCalculating(false);
      }
    };

    calculateFees();
  }, [effectiveAddress, selectedShipping, shopsInCart, estimateFee]);

  const shippingFee = useMemo(
    () => (selectedShipping?.id ? providerFees[selectedShipping.id] || 0 : 0),
    [selectedShipping?.id, providerFees],
  );

  const handlePlaceOrder = useCallback(async () => {
    if (!effectiveAddress) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    if (!selectedShipping) {
      toast.error('Vui lòng chọn đơn vị vận chuyển');
      return;
    }

    setIsSubmitting(true);
    try {
      const shopsPayload = Object.keys(shopsInCart).map((shopIdStr) => {
        const shopId = parseInt(shopIdStr);
        const itemIds = checkoutItems.filter((i) => i.shopId === shopId).map((i) => i.id);
        return {
          shopId,
          itemIds,
          voucherCode: appliedVoucher && appliedVoucher.valid ? appliedVoucher.code : undefined,
          note: note.trim() || undefined,
        };
      });

      const res = await createBatchOrders({
        shops: shopsPayload,
        addressId: effectiveAddress.id,
        shippingProviderId: selectedShipping.id,
        paymentMethod: selectedPayment || 'COD',
        shippingFee: shippingFee,
        usePoints: isUsePoints ? redeemInfo.points : undefined,
        affiliateCode: affiliateCode.trim() || undefined,
      });

      queryClient.invalidateQueries({ queryKey: ['cart'] });

      // Mark as success to prevent redirect to cart by useEffect
      setIsSuccess(true);

      // Clear Redux selection after success
      dispatch(clearSelection());

      const { paymentUrl } = res.data;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.success('Đặt hàng thành công!');
        router.push('/dashboard/don-hang');
      }
    } catch (error: unknown) {
      console.error('Lỗi khi đặt hàng:', error);
      const resData = (error as { response?: { data?: { message?: string } } })?.response?.data;
      toast.error(resData?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    effectiveAddress,
    selectedShipping,
    selectedPayment,
    shopsInCart,
    checkoutItems,
    router,
    appliedVoucher,
    isUsePoints,
    redeemInfo.points,
    shippingFee,
    createBatchOrders,
    queryClient,
    note,
    affiliateCode,
    dispatch,
  ]);

  const handleSelectAddress = useCallback((address: Address) => {
    setUserSelectedAddress(address);
  }, []);

  const handleSelectShipping = useCallback((provider: ShippingProvider) => {
    setSelectedShipping(provider);
  }, []);

  const handleSelectPayment = useCallback((method: PaymentMethod) => {
    setSelectedPayment(method);
  }, []);

  const handleUpdateRedeemInfo = useCallback((points: number, discount: number) => {
    setRedeemInfo({ points, discount });
  }, []);

  const canConfirm = useMemo(
    () =>
      isAuthenticated &&
      !!effectiveAddress &&
      !!selectedShipping &&
      !!selectedPayment &&
      checkoutItems.length > 0,
    [isAuthenticated, effectiveAddress, selectedShipping, selectedPayment, checkoutItems.length],
  );

  if (!isInitialized || isCartLoading || isAddressLoading) {
    return <LoadingOverlay />;
  }

  // Double check auth & selection to prevent flash of content
  if (!isAuthenticated || (selectedItemIds.length === 0 && !isSuccess)) {
    return null;
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
              className="p-3 bg-white rounded-xl border border-stone-200 text-stone-600 hover:text-green-700 hover:border-green-200 transition-all shadow-sm"
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
              <section className="bg-white rounded-xl p-8 border border-stone-100 shadow-xl shadow-stone-200/50">
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

                <div className="mt-8 pt-8 border-t border-stone-100">
                  <LoyaltyCheckoutRedeem
                    orderAmount={subtotal}
                    isUsed={isUsePoints}
                    onToggle={setIsUsePoints}
                    onUpdateRedeemInfo={handleUpdateRedeemInfo}
                  />
                </div>

                <div className="mt-6 pt-6 border-t border-stone-100">
                  <label className="block text-sm font-bold text-stone-800 mb-2">
                    Ghi chú đơn hàng (tuỳ chọn)
                  </label>
                  <textarea
                    placeholder="Nhập thông tin ghi chú đặt hàng..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl p-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium placeholder:text-stone-400 placeholder:font-normal resize-none"
                    rows={2}
                  />
                </div>
              </section>

              {/* Order Items Review */}
              <section className="bg-white rounded-xl p-8 border border-stone-100 shadow-xl shadow-stone-200/50">
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  Sản phẩm trong đơn hàng
                </h3>

                <div className="space-y-4">
                  {checkoutItems.length > 0 ? (
                    checkoutItems.map((item: CartItem) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 rounded-xl bg-stone-50/50 border border-stone-100"
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
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                      <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-stone-300" />
                      </div>
                      <h3 className="text-lg font-bold text-stone-800 mb-2">
                        Chưa có sản phẩm nào
                      </h3>
                      <p className="text-stone-500 text-sm max-w-sm mb-6">
                        Vui lòng thêm sản phẩm vào giỏ hàng và chọn thanh toán để tiếp tục.
                      </p>
                      <Link
                        href="/san-pham"
                        className="inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                      >
                        Khám phá sản phẩm
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
                appliedVoucher={appliedVoucher}
                onApplyVoucher={setAppliedVoucher}
                redeemDiscount={redeemInfo.discount}
                isPending={isSubmitting}
                onConfirm={handlePlaceOrder}
                canConfirm={canConfirm}
                affiliateCode={affiliateCode}
                onAffiliateCodeChange={setAffiliateCode}
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<LoadingOverlay />}>
      <CheckoutContent />
    </Suspense>
  );
}
