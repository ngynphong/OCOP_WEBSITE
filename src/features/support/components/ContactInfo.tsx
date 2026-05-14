import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export const ContactInfo = () => {
  return (
    <div className="bg-green-900 text-white p-8 rounded-2xl shadow-xl h-full flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold mb-2">Thông tin liên hệ</h3>
        <p className="text-green-100 mb-8 opacity-90">
          Đội ngũ chăm sóc khách hàng của OCOP luôn sẵn sàng lắng nghe và hỗ trợ bạn trong suốt quá
          trình trải nghiệm mua sắm.
        </p>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Phone className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <p className="text-sm text-green-200 mb-1">Hotline Hỗ Trợ (Miễn phí)</p>
              <p className="text-lg font-semibold">+84 96 524 8115</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Mail className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <p className="text-sm text-green-200 mb-1">Email Hỗ Trợ</p>
              <p className="text-lg font-semibold">infovienies@gmail.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <MapPin className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <p className="text-sm text-green-200 mb-1">Trụ sở chính</p>
              <p className="text-base font-medium leading-relaxed">
                Số 3 Công Trường Quốc Tế, Phường Xuân Hoà, Thành phố Hồ Chí Minh.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 group">
            <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
              <Clock className="w-6 h-6 text-green-300" />
            </div>
            <div>
              <p className="text-sm text-green-200 mb-1">Thời gian làm việc</p>
              <p className="text-base font-medium">
                Thứ 2 - Thứ 6: 08:30 - 17:00
                <br />
                Thứ 7, CN: 08:30 - 11:30
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-white/20">
        <p className="text-sm text-green-200 italic">
          * Trong trường hợp khẩn cấp ngoài giờ hành chính, vui lòng gửi email, chúng tôi sẽ xử lý
          vào đầu ngày làm việc tiếp theo.
        </p>
      </div>
    </div>
  );
};
