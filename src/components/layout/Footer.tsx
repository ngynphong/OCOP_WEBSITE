import Link from 'next/link';
import { MapPin, Phone, Mail, Camera, Globe, Tv } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full px-8 py-12 bg-emerald-50 border-t z-50 border-emerald-100 flex flex-col justify-start items-center">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="inline-flex flex-col justify-start items-start gap-3.5 flex-1">
          <div className="flex flex-col justify-start items-start">
            <span className="text-emerald-800 text-xl font-bold font-sans leading-7">
              IES Connect OCOP
            </span>
          </div>
          <div className="flex flex-col justify-start items-start">
            <span className="text-emerald-900 text-sm font-normal font-sans leading-6">
              Kết nối tinh hoa nông sản Việt từ khắp mọi
              <br />
              miền đất nước đến bàn ăn của mỗi gia
              <br />
              đình.
            </span>
          </div>
          <div className="pt-[1.20px] inline-flex justify-start items-start gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-green-900 rounded-full flex justify-center items-center hover:bg-green-800 transition-colors"
            >
              <Globe className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-green-900 rounded-full flex justify-center items-center hover:bg-green-800 transition-colors"
            >
              <Tv className="w-4 h-4 text-white" />
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-green-900 rounded-full flex justify-center items-center hover:bg-green-800 transition-colors"
            >
              <Camera className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>
        <div className="w-72 pb-3.5 inline-flex flex-col justify-start items-start gap-3.5">
          <div className="pb-[0.75px] flex flex-col justify-start items-start">
            <span className="text-emerald-900 text-sm font-bold font-sans leading-6">Sản phẩm</span>
          </div>
          <div className="flex flex-col justify-start items-start gap-1.5">
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Thực phẩm sạch
            </Link>
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Gia vị
            </Link>
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Đồ thủ công
            </Link>
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Trà thảo mộc
            </Link>
          </div>
        </div>
        <div className="w-72 pb-3.5 inline-flex flex-col justify-start items-start gap-3.5">
          <div className="pb-[0.75px] flex flex-col justify-start items-start">
            <span className="text-emerald-900 text-sm font-bold font-sans leading-6">Hỗ trợ</span>
          </div>
          <div className="flex flex-col justify-start items-start gap-1.5">
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Liên hệ chúng tôi
            </Link>
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Chính sách đặt hàng
            </Link>
            <Link
              href="#"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900"
            >
              Điều khoản dịch vụ
            </Link>
          </div>
        </div>
        <div className="w-72 pb-11 inline-flex flex-col justify-start items-start gap-4">
          <div className="pb-[0.75px] flex flex-col justify-start items-start">
            <h3 className="text-emerald-900 text-sm font-bold font-sans leading-6">Liên hệ</h3>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-emerald-900" />
              <span className="text-emerald-900 text-sm font-normal font-sans leading-6">
                Số 3 Công Trường Quốc Tế , Phường Xuân Hoà, Thành phố Hồ Chí Minh.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-emerald-900" />
              <span className="text-emerald-900 text-sm font-normal font-sans leading-6">
                +84 96 524 8115
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-emerald-900" />
              <span className="text-emerald-900 text-sm font-normal font-sans leading-6">
                infovienies@gmail.com
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-7xl pt-8 mt-12 border-t border-emerald-100 flex flex-col justify-start items-center">
        <div className="w-full text-center text-emerald-600/60 text-base font-normal font-sans leading-6">
          © {new Date().getFullYear()} IES Connect OCOP
        </div>
      </div>
    </footer>
  );
}
