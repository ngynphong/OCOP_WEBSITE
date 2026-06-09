'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCustomCheckoutInfo } from '@/features/checkout/hooks/useCustomCheckout';
import { useCreateB2BOrder } from '@/features/orders/hooks/useOrders';
import { AddressSelector } from '@/features/checkout/components/AddressSelector';
import { PaymentMethodSelector } from '@/features/checkout/components/PaymentMethodSelector';
import { Button } from '@/components/ui/AppButton';
import { Loader2, Package, ShieldCheck, Truck, FileText, ChevronLeft } from 'lucide-react';
import { Address, PaymentMethod } from '@/features/checkout/types/checkoutTypes';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function B2BCheckoutPage() {
  const { token } = useParams() as { token: string };
  const router = useRouter();
  const { data: res, isLoading: isFetchingInfo, error } = useCustomCheckoutInfo(token);
  const info = res?.data;

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [note, setNote] = useState('');

  // VAT Invoice Info
  const [showVAT, setShowVAT] = useState(false);
  const [vatInfo, setVatInfo] = useState({
    taxCode: '',
    companyName: '',
    companyAddress: '',
  });

  const { mutateAsync: createB2BOrder, isPending: isCreating } = useCreateB2BOrder();

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Vui lòng chọn địa chỉ nhận hàng');
      return;
    }
    if (!paymentMethod) {
      toast.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    try {
      const orderRes = await createB2BOrder({
        checkoutToken: token,
        addressId: selectedAddress.id,
        paymentMethod,
        note,
        invoiceInfo: showVAT ? vatInfo : undefined,
      });

      if (orderRes.data.paymentUrl) {
        window.location.href = orderRes.data.paymentUrl;
      } else {
        const id = orderRes.data.id || orderRes.data.orderId;
        router.push(`/dashboard/don-hang/${id}?b2b=true`);
        toast.success('Đặt đơn hàng sỉ thành công');
      }
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi xảy ra khi đặt hàng',
      );
    }
  };

  if (isFetchingInfo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-stone-50">
        <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
        <p className="text-stone-500 font-bold">Đang tải thông tin báo giá...</p>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 text-center">
        <div className="bg-white p-10 rounded-xl shadow-xl shadow-stone-200/50 border border-stone-100 max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-2xl font-black text-stone-900 mb-2">Báo giá không hợp lệ</h2>
          <p className="text-stone-500 font-medium mb-8">
            Liên kết thanh toán này không tồn tại, đã hết hạn hoặc đã được sử dụng.
          </p>
          <Button onClick={() => router.push('/')} className="w-full rounded-xl h-14">
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-stone-900 font-bold transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-stone-900 transition-all">
            <ChevronLeft size={18} />
          </div>
          Quay lại
        </button>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="bg-white rounded-xl p-8 md:p-10 shadow-xl shadow-stone-200/50 border border-stone-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-green-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-green-700/20">
                  <Package size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-stone-900 tracking-tight">
                    Thanh toán đơn sỉ B2B
                  </h1>
                  <p className="text-stone-500 font-medium italic">Báo giá từ: {info.shopName}</p>
                </div>
              </div>

              <div className="space-y-10">
                <AddressSelector
                  selectedId={selectedAddress?.id}
                  onSelect={(addr) => setSelectedAddress(addr)}
                />

                <PaymentMethodSelector
                  selectedId={paymentMethod}
                  onSelect={(m) => setPaymentMethod(m)}
                />

                {/* VAT Section */}
                <div className="pt-8 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      Yêu cầu xuất hóa đơn VAT
                    </h3>
                    <button
                      onClick={() => setShowVAT(!showVAT)}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        showVAT ? 'bg-green-600' : 'bg-stone-200',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          showVAT ? 'translate-x-6' : 'translate-x-1',
                        )}
                      />
                    </button>
                  </div>

                  {showVAT && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          Mã số thuế
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập mã số thuế..."
                          className="w-full px-4 py-3 outline-none text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 border rounded-xl border-stone-200 font-bold"
                          value={vatInfo.taxCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVatInfo({ ...vatInfo, taxCode: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-stone-400  uppercase tracking-widest">
                          Tên công ty
                        </label>
                        <input
                          type="text"
                          placeholder="Nhập tên đầy đủ..."
                          className="w-full px-4 py-3 outline-none text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 border rounded-xl border-stone-200 font-bold"
                          value={vatInfo.companyName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVatInfo({ ...vatInfo, companyName: e.target.value })
                          }
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                          Địa chỉ đăng ký
                        </label>
                        <input
                          type="text"
                          placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành..."
                          className="w-full px-4 py-3 outline-none text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 border rounded-xl border-stone-200 font-bold"
                          value={vatInfo.companyAddress}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setVatInfo({ ...vatInfo, companyAddress: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-8 border-t border-stone-100">
                  <h3 className="text-sm font-bold text-stone-800 mb-4">Ghi chú cho đơn hàng</h3>
                  <textarea
                    className="w-full rounded-xl border-stone-100 text-gray-700 bg-stone-50 p-4 min-h-[100px] text-sm font-medium focus:border-green-500 focus:ring-0 outline-none transition-all"
                    placeholder="Lưu ý về thời gian giao hàng, đóng gói..."
                    value={note}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNote(e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -mr-16 -mt-16 z-0" />

                <div className="relative z-10 space-y-6">
                  <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                    Tóm tắt đơn sỉ
                  </h2>

                  <div className="flex gap-4 p-4 bg-stone-50 rounded-xl border border-stone-100">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-stone-200/50">
                      <Image
                        src={info.productImage || '/images/placeholder.png'}
                        alt={info.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-stone-900 text-sm truncate leading-tight">
                        {info.productName}
                      </h4>
                      <p className="text-xs text-stone-500 font-bold mt-0.5">
                        {info.variantName || 'Mặc định'}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-stone-900">
                          {info.unitPrice.toLocaleString('vi-VN')}₫
                        </span>
                        <span className="text-stone-300 text-xs font-medium">x</span>
                        <span className="text-xs font-black text-stone-900">{info.quantity}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 py-6 border-y border-stone-100">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-stone-500 font-medium">Tạm tính</span>
                      <span className="text-stone-900 font-black">
                        {(info.unitPrice * info.quantity).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-1.5">
                        <span className="text-stone-500 font-medium">Phí vận chuyển</span>
                        <Truck size={14} className="text-stone-400" />
                      </div>
                      <span className="text-green-600 font-black">
                        {info.shippingFee === 0
                          ? 'Miễn phí'
                          : `+${info.shippingFee.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-stone-900 font-black text-lg">Tổng thanh toán</span>
                    <span className="text-green-700 font-black text-2xl tracking-tighter">
                      {info.totalAmount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>

                  {info.validUntil && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                      <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-none">
                        Ưu đãi hết hạn vào
                      </p>
                      <p className="text-xs font-bold text-amber-900 mt-1">
                        {format(new Date(info.validUntil), 'dd MMMM, yyyy', { locale: vi })}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    className="w-full h-14 rounded-xl font-black text-base shadow-xl shadow-green-700/20"
                    onClick={handleCheckout}
                    isLoading={isCreating}
                  >
                    Xác nhận đặt đơn sỉ
                  </Button>
                </div>
              </div>

              <div className="bg-green-900 rounded-xl p-6 text-white flex items-center gap-4 shadow-lg shadow-stone-900/10">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldCheck className="text-green-400" size={24} />
                </div>
                <p className="text-[11px] font-bold text-stone-300 leading-relaxed">
                  Giao dịch của bạn được bảo vệ bởi chương trình{' '}
                  <span className="text-green-400">OCOP Assurance</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
