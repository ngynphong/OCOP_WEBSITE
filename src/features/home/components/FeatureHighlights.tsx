'use client';

import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Lock, Info } from 'lucide-react';
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
      icon: <ShieldCheck className="w-6 h-6 text-green-900" />,
      title: '100% Chính hãng',
      desc: 'Kiểm định OCOP 3-5 sao',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-green-900" />,
      title: '7 ngày đổi trả',
      desc: 'Theo chính sách đổi trả',
      clickable: true,
      onClick: () => setIsPolicyModalOpen(true),
      info: 'Không áp dụng cho hàng tươi sống',
    },
    {
      icon: <Lock className="w-6 h-6 text-green-900" />,
      title: 'Thanh toán an toàn',
      desc: 'Đa dạng phương thức thanh toán',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 mt-4 mb-4">
      <div className="w-full px-6 md:px-12 py-8 bg-orange-100/80 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 shadow-sm">
        {highlights.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex justify-start items-center gap-4 transition-all duration-300',
              item.clickable && 'cursor-pointer hover:bg-white/40 p-2 -m-2 rounded-xl group',
            )}
            onClick={item.onClick}
          >
            <div className="w-12 h-12 bg-green-900/10 rounded-full flex justify-center items-center shrink-0">
              {item.icon}
            </div>
            <div className="flex flex-col justify-start items-start relative">
              <div className="flex items-center gap-1.5">
                <h3 className="text-stone-900 text-base font-bold font-sans leading-6 mb-0.5">
                  {item.title}
                </h3>
                {item.info && (
                  <div className="group/tooltip relative inline-block">
                    <Info className="w-3.5 h-3.5 text-stone-400 hover:text-green-700 cursor-help transition-colors" />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-stone-800 text-white text-[11px] rounded-lg opacity-0 group-hover/tooltip:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl scale-95 group-hover/tooltip:scale-100">
                      {item.info}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-stone-800" />
                    </div>
                  </div>
                )}
              </div>
              <p
                className={cn(
                  'text-neutral-500 text-sm font-normal font-sans leading-5 transition-colors',
                  item.clickable &&
                    'group-hover:text-green-800 underline decoration-dotted underline-offset-4',
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
        title="Chính sách đổi trả"
      >
        <div className="space-y-6 text-stone-600">
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-sm text-orange-800 flex gap-2 font-medium">
              <Info className="w-5 h-5 shrink-0" />
              Lưu ý: Chính sách này không áp dụng đối với các mặt hàng tươi sống (thịt, cá, rau củ
              quả tươi) và thực phẩm có hạn sử dụng dưới 7 ngày.
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-stone-900">1. Điều kiện đổi trả:</p>
            <ul className="list-disc pl-5 space-y-2 text-sm leading-relaxed">
              <li>Sản phẩm còn nguyên tem mác, bao bì, nhãn hiệu ban đầu.</li>
              <li>Sản phẩm bị lỗi từ nhà sản xuất hoặc hư hỏng nặng trong quá trình vận chuyển.</li>
              <li>Sản phẩm không đúng với mô tả hoặc giao sai loại khách hàng đã đặt.</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-bold text-stone-900">2. Quy trình xử lý:</p>
            <p className="text-sm leading-relaxed">
              Quý khách vui lòng chụp ảnh/quay video sản phẩm lỗi và gửi về bộ phận chăm sóc khách
              hàng trong vòng 24h kể từ khi nhận hàng để được hỗ trợ đổi trả nhanh nhất.
            </p>
          </div>

          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-stone-400">
              Hotline hỗ trợ: <span className="font-bold text-green-700">096 524 8115</span>
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
