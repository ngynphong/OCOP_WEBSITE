'use client';

import React, { useState } from 'react';
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

// Mock Items - Thường sẽ lấy từ Cart State hoặc API
const MOCK_CHECKOUT_ITEMS = [
  {
    id: 101,
    productName: 'Mật ong rừng Tây Bắc nguyên chất',
    variantName: 'Chai 500ml',
    price: 125000,
    qty: 2,
    thumbnailUrl:
      'https://s3.ap-learning.site/ocop-bucket/products/5/0cbab053-a1ee-4216-b1bd-b25178e4eb7a.jpeg',
    shopName: 'Honey Farm Tây Bắc',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<Address | undefined>(undefined);
  const [selectedShipping, setSelectedShipping] = useState<ShippingProvider | undefined>(undefined);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | undefined>('COD');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = MOCK_CHECKOUT_ITEMS.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingFee = selectedShipping?.baseFee || 0;
  const discount = 0; // Giả sử chưa có voucher

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    if (!selectedShipping) {
      toast.error('Vui lòng chọn đơn vị vận chuyển');
      return;
    }

    setIsSubmitting(true);
    // Giả lập gọi API tạo đơn
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Đặt hàng thành công!');
      router.push('/dashboard/don-hang'); // Chuyển về trang quản lý đơn hàng
    }, 2000);
  };

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
                <AddressSelector selectedId={selectedAddress?.id} onSelect={setSelectedAddress} />

                <ShippingSelector
                  selectedId={selectedShipping?.id}
                  onSelect={setSelectedShipping}
                />

                <PaymentMethodSelector selectedId={selectedPayment} onSelect={setSelectedPayment} />
              </section>

              {/* Order Items Review */}
              <section className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-xl shadow-stone-200/50">
                <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-4 h-4 text-green-600" />
                  Sản phẩm trong đơn hàng
                </h3>

                <div className="space-y-4">
                  {MOCK_CHECKOUT_ITEMS.map((item) => (
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
                            {(item.price * item.qty).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
                canConfirm={!!selectedAddress && !!selectedShipping && !!selectedPayment}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
