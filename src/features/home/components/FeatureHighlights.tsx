'use client';

import React, { useState } from 'react';
import { Award, RefreshCw, Truck, ShieldCheck, Info } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/lib/utils';

interface HighlightItem {
  icon: React.ReactNode;
  title: string;
  desc: string;
  clickable?: boolean;
  onClick?: () => void;
  info?: string;
}

export function FeatureHighlights() {
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);

  const highlights: HighlightItem[] = [
    {
      icon: <Award className="w-5 h-5 text-emerald-700" />,
      title: 'Chuẩn OCOP 3-5 Sao',
      desc: 'Chủ thể & sản phẩm chọn lọc',
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-emerald-700" />,
      title: '7 ngày đổi trả',
      desc: 'Khi sản phẩm có lỗi',
      clickable: true,
      onClick: () => setIsPolicyModalOpen(true),
      info: 'Không áp dụng cho hàng tươi sống ngắn ngày',
    },
    {
      icon: <Truck className="w-5 h-5 text-emerald-700" />,
      title: 'Giao hàng toàn quốc',
      desc: 'Đồng kiểm tra khi nhận hàng',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      title: 'Thanh toán an toàn',
      desc: 'Hỗ trợ COD & thanh toán online',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 my-3 md:my-4">
      <div className="w-full px-4 md:px-8 py-3.5 md:py-4 bg-white/90 backdrop-blur-sm border border-stone-200/80 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 shadow-xs">
        {highlights.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex items-center gap-3 transition-colors',
              item.clickable &&
                'cursor-pointer hover:bg-emerald-50/60 p-2 -m-2 rounded-xl group select-none',
            )}
            onClick={item.onClick}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/60">
              {item.icon}
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-stone-900 text-xs md:text-sm font-bold font-sans truncate">
                  {item.title}
                </h3>
                {item.info && (
                  <div className="group/tooltip relative inline-block">
                    <Info className="w-3.5 h-3.5 text-stone-400 hover:text-emerald-700 cursor-help transition-colors" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-800 text-white text-[11px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl scale-95 group-hover/tooltip:scale-100">
                      {item.info}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
                    </div>
                  </div>
                )}
              </div>
              <p
                className={cn(
                  'text-stone-500 text-[11px] md:text-xs font-normal truncate',
                  item.clickable &&
                    'group-hover:text-emerald-700 underline decoration-dotted underline-offset-2',
                )}
              >
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isPolicyModalOpen}
        onClose={() => setIsPolicyModalOpen(false)}
        title="Chính sách đổi trả hàng"
      >
        <div className="space-y-5 text-stone-600">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-xs md:text-sm text-emerald-900 flex items-start gap-2 font-medium">
              <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Lưu ý:</strong> Chính sách đổi trả 7 ngày áp dụng đối với hàng đóng gói, đồ
                khô, đặc sản chế biến. Không áp dụng với nông sản tươi sống ngắn ngày (rau củ quả
                tươi, thịt cá tươi).
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-stone-900 text-sm">1. Điều kiện đổi trả:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm leading-relaxed text-stone-600">
              <li>Sản phẩm còn nguyên tem niêm phong, nhãn mác của nhà sản xuất.</li>
              <li>Sản phẩm bị lỗi kỹ thuật, sai quy cách hoặc bể vỡ trong quá trình vận chuyển.</li>
              <li>Giao không đúng loại sản phẩm khách hàng đã đặt.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-stone-900 text-sm">2. Hướng dẫn hỗ trợ:</p>
            <p className="text-xs md:text-sm leading-relaxed text-stone-600">
              Quý khách vui lòng chụp ảnh hoặc quay video khi mở gói hàng và liên hệ bộ phận hỗ trợ
              trong vòng 24h kể từ khi nhận hàng để được giải quyết nhanh nhất.
            </p>
          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs text-stone-500">
              Hotline hỗ trợ: <span className="font-bold text-emerald-700">096 524 8115</span>
            </p>
            <Button onClick={() => setIsPolicyModalOpen(false)} size="sm">
              Đã hiểu
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
}
