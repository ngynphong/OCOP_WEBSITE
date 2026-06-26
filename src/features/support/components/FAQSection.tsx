'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FAQItem } from '../types';

const FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'Thời gian giao hàng mất bao lâu?',
    answer:
      'Thông thường, thời gian giao hàng mất từ 2-4 ngày làm việc đối với khu vực nội thành và 4-7 ngày làm việc đối với các tỉnh/thành phố khác. Các sản phẩm tươi sống (như trái cây, nông sản) sẽ được ưu tiên giao nhanh qua dịch vụ hỏa tốc.',
  },
  {
    id: '2',
    question: 'Tôi có thể kiểm tra hàng trước khi thanh toán không?',
    answer:
      'Hoàn toàn được. OCOP luôn khuyến khích khách hàng đồng kiểm cùng bưu tá khi nhận hàng. Nếu sản phẩm bị móp méo, bể vỡ hoặc sai mẫu mã, bạn có quyền từ chối nhận hàng mà không phải chịu bất kỳ chi phí nào.',
  },
  {
    id: '3',
    question: 'Làm thế nào để đổi trả sản phẩm bị lỗi?',
    answer:
      'Nếu sản phẩm bị lỗi từ nhà sản xuất, bạn vui lòng chụp ảnh/quay video bằng chứng và yêu cầu Hoàn tiền/Đổi hàng trong vòng 3 ngày kể từ khi nhận hàng. Hệ thống sẽ tiếp nhận và xử lý nhanh chóng trong 24-48 giờ.',
  },
  {
    id: '4',
    question: 'Tôi có thể thanh toán bằng những hình thức nào?',
    answer:
      'Chúng tôi hỗ trợ đa dạng phương thức thanh toán: Thanh toán khi nhận hàng (COD), Thanh toán trực tuyến qua thẻ ATM/Visa/Mastercard, Thanh toán qua ví điện tử VNPay.',
  },
  {
    id: '5',
    question: 'Sản phẩm trên OCOP có đảm bảo chất lượng không?',
    answer:
      '100% sản phẩm trên hệ thống đều phải đạt chứng nhận OCOP (từ 3 sao trở lên) do cơ quan Nhà nước cấp, đảm bảo nguồn gốc xuất xứ rõ ràng, vệ sinh an toàn thực phẩm và chất lượng cao nhất.',
  },
];

interface FAQSectionProps {
  searchQuery?: string;
}

export const FAQSection = ({ searchQuery = '' }: FAQSectionProps) => {
  const [openId, setOpenId] = useState<string | null>('1');

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const normalizedQuery = searchQuery.toLowerCase().trim();
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(normalizedQuery) ||
        faq.answer.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div id="faq" className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Câu hỏi thường gặp</h2>
          <p className="mt-2 text-stone-500">Các vấn đề khách hàng thường xuyên quan tâm nhất</p>
        </div>

        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <SearchX className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500 text-lg font-medium">
              Không tìm thấy kết quả cho &quot;{searchQuery}&quot;
            </p>
            <p className="text-stone-400 text-sm mt-1">
              Hãy thử tìm kiếm với từ khóa khác hoặc gửi yêu cầu hỗ trợ bên dưới.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={cn(
                    'border rounded-xl transition-colors duration-300',
                    isOpen
                      ? 'border-green-500 bg-green-50/30'
                      : 'border-stone-200 bg-white hover:border-green-300',
                  )}
                >
                  <button
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        'font-semibold text-lg',
                        isOpen ? 'text-green-800' : 'text-stone-900',
                      )}
                    >
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        'ml-6 flex-shrink-0 transition-transform duration-300',
                        isOpen && 'transform rotate-180',
                      )}
                    >
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-green-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-stone-400" />
                      )}
                    </span>
                  </button>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                    )}
                  >
                    <div className="p-5 pt-0 text-stone-600 leading-relaxed">{faq.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
