'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import Script from 'next/script';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import Image from 'next/image';

export function Footer() {
  const { data: categoriesResp, isLoading } = usePublicCategoriesQuery();
  const categories = categoriesResp?.data?.slice(0, 4) || [];

  return (
    <footer className="w-full px-8 py-12 bg-emerald-50 border-t z-50 border-emerald-100 flex flex-col justify-start items-center">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="inline-flex flex-col justify-start items-start gap-3.5 flex-1">
          <div className="flex flex-col justify-start items-start">
            <span className="text-emerald-800 text-xl font-bold font-sans leading-7">
              OCOP IES Connect
            </span>
          </div>
          <div className="flex flex-col justify-start items-start">
            <span className="text-emerald-900 text-sm font-normal font-sans leading-6">
              Kết nối tinh hoa nông sản Việt từ khắp mọi miền đất nước đến bàn ăn của mỗi gia đình.
            </span>
          </div>
          <div className="pt-[1.20px] inline-flex justify-start items-start gap-4">
            <Link
              href="https://ies-edu.vn"
              aria-label="Trang chủ IES"
              className="w-10 h-10 bg-green-900 rounded-full flex justify-center items-center hover:bg-green-800 transition-colors"
            >
              <Globe className="w-4 h-4 text-white" />
            </Link>
            <Link
              href="https://www.facebook.com/ies.focus.lms"
              aria-label="Facebook IES"
              className="w-10 h-10 bg-green-900 rounded-full flex justify-center items-center hover:bg-green-800 transition-colors"
            >
              <FaFacebook className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
        <div className="w-72 pb-3.5 inline-flex flex-col justify-start items-start gap-3.5">
          <div className="pb-[0.75px] flex flex-col justify-start items-start">
            <span className="text-emerald-900 text-sm font-bold font-sans leading-6">Sản phẩm</span>
          </div>
          <div className="flex flex-col justify-start items-start gap-1.5 min-h-[144px]">
            {isLoading
              ? // Loading state
                [...Array(4)].map((_, i) => (
                  <div key={i} className="w-32 h-6 bg-emerald-100 animate-pulse rounded" />
                ))
              : categories.length > 0
                ? categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/danh-muc/${category.slug}`}
                      className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 transition-colors py-2 md:py-0 block w-full"
                    >
                      {category.name}
                    </Link>
                  ))
                : // Fallback if no categories
                  ['Thực phẩm sạch', 'Gia vị', 'Đồ thủ công', 'Trà thảo mộc'].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 py-2 md:py-0 block w-full"
                    >
                      {item}
                    </Link>
                  ))}
          </div>
        </div>
        <div className="w-72 pb-3.5 inline-flex flex-col justify-start items-start gap-3.5">
          <div className="pb-[0.75px] flex flex-col justify-start items-start">
            <span className="text-emerald-900 text-sm font-bold font-sans leading-6">Hỗ trợ</span>
          </div>
          <div className="flex flex-col justify-start items-start gap-1.5">
            <Link
              href="/ho-tro#contact"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 py-2 md:py-0 block w-full"
            >
              Liên hệ chúng tôi
            </Link>
            <Link
              href="/chinh-sach-bao-mat"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 py-2 md:py-0 block w-full"
            >
              Chính sách bảo mật
            </Link>
            <Link
              href="/chinh-sach-dat-hang"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 py-2 md:py-0 block w-full"
            >
              Chính sách đặt hàng
            </Link>
            <Link
              href="/dieu-khoan-dich-vu"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 py-2 md:py-0 block w-full"
            >
              Điều khoản dịch vụ
            </Link>
            <Link
              href="/ho-tro"
              className="text-emerald-600/80 text-sm font-normal font-sans leading-6 hover:text-emerald-900 py-2 md:py-0 block w-full"
            >
              Trung tâm trợ giúp
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
      <div className="w-full max-w-7xl flex items-center justify-start mt-6">
        <a
          href="https://www.dmca.com/r/9e5z4w8"
          title="DMCA.com Protection Status"
          className="dmca-badge"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src="https://images.dmca.com/Badges/dmca_protected_sml_120m.png?ID=9083b6eb-63b9-43d0-8700-3a01749c1279"
            alt="DMCA.com Protection Status"
            width={120}
            height={40}
            sizes="(max-width: 768px) 100vw, 100vw"
          />
        </a>
        <Script src="https://images.dmca.com/Badges/DMCABadgeHelper.min.js" strategy="lazyOnload" />
      </div>
      <div className="w-full max-w-7xl pt-8 mt-12 border-t border-emerald-100 flex flex-col md:flex-row justify-center items-center gap-4">
        <div className="text-center md:text-left text-emerald-600/60 text-base font-normal font-sans leading-6">
          © {new Date().getFullYear()} OCOP IES Connect
        </div>
      </div>
    </footer>
  );
}
