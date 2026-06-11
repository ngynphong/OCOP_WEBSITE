import Link from 'next/link';
import Image from 'next/image';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle: string;
  linkText: string;
  linkHref: string;
  linkActionText: string;
  rightPanelLine1: string;
  rightPanelLine2: string;
}

export function AuthLayout({
  children,
  subtitle,
  linkHref,
  linkActionText,
  rightPanelLine1,
  rightPanelLine2,
}: AuthLayoutProps) {
  return (
    <div className="h-screen overflow-hidden w-full flex flex-col md:flex-row font-sans">
      {/* Left Section - Content & Branding */}
      <div className="w-full md:w-1/2 sm:flex hidden flex-col items-center justify-between p-6 lg:p-8 xl:p-12 relative overflow-y-auto md:overflow-hidden">
        {/* Top Header Placeholder to push content roughly to center-top */}
        <div className="hidden md:block h-8"></div>
        <button className="absolute top-6 left-6">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={150} height={150} />
          </Link>
        </button>
        {/* Main Branding Text */}
        <div className="w-full flex flex-col items-center text-center mt-8 md:mt-0 xl:mt-12 z-10 shrink-0">
          <p className="text-xs font-bold text-amber-500 tracking-widest uppercase mb-4">
            Nền tảng TMĐT OCOP
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-amber-900 leading-[1.1] md:leading-[1.15] tracking-tight max-w-[90%] lg:max-w-[80%] relative">
            KẾT NỐI NÔNG SẢN
            <br /> VÀ ĐẶC SẢN
            <br />
            VIỆT NAM.
            {/* Green overlapping circles accent (matching the image) */}
            <span className="inline-flex relative ml-2 top-2">
              <span className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-900 absolute -left-8 mix-blend-multiply opacity-90"></span>
              <span className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-green-700 absolute -left-4 mix-blend-multiply opacity-90"></span>
              <span className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-lime-400 mix-blend-multiply opacity-90 relative z-10"></span>
            </span>
          </h1>

          {/* Toggle Link (Login <-> Register) */}
          <div className="mt-8 sm:mt-12 flex flex-col items-center">
            <p className="text-stone-400 text-sm font-medium mb-2">{subtitle}</p>
            <Link
              href={linkHref}
              className="inline-flex items-center gap-1 text-stone-900 font-bold text-sm border-b-2 border-stone-900 pb-0.5 hover:text-green-700 hover:border-green-700 transition-colors"
            >
              {linkActionText}
            </Link>
          </div>
        </div>

        {/* Bottom Left Dark Card */}
        <div className="mt-8 md:mt-auto shrink-0 relative rounded-xl overflow-hidden bg-green-950 h-32 md:h-40 xl:h-48 shadow-2xl group w-full lg:max-w-xl mx-auto md:mx-0">
          <Image
            src="/images/left-side-login.jpg"
            alt="Agriculture background"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-r from-green-950/90 via-green-950/50 to-transparent p-6 lg:p-8 flex items-center">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-8 max-w-sm lg:max-w-md">
              <p className="text-white font-bold text-lg whitespace-nowrap hidden md:block">
                Về chúng tôi
              </p>
              <div className="w-12 h-px bg-white/20 hidden md:block" />
              <p className="text-stone-300 text-sm leading-relaxed font-medium">
                Hơn <strong className="text-white font-bold">12,000+ sản phẩm</strong> chất lượng
                cao từ cộng đồng người nông dân và HTX hào phóng nhất thế giới.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form & Hero Background */}
      <div className="w-full md:w-1/2 relative bg-green-950 min-h-[600px] md:min-h-0 h-full flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto overflow-x-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)]">
        {/* Background Image corresponding to the right side */}
        <Image
          src="/images/login-component.jpg"
          alt="Fresh produce background"
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover opacity-60"
          priority
        />

        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-green-950/60 via-black/20 to-green-950/80 pointer-events-none" />

        {/* Top Titles inside right panel */}
        <div className="absolute top-12 left-0 w-full text-center z-10 flex flex-col items-center">
          <p className="text-white text-sm font-bold tracking-[0.2em] uppercase">
            {rightPanelLine1}
          </p>
          <p className="text-white/60 text-xs font-medium tracking-widest mt-1">
            {rightPanelLine2}
          </p>
        </div>

        {/* The Form Component */}
        {children}
      </div>
    </div>
  );
}
