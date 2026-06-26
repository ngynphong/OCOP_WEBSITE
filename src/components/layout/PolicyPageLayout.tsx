'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AmbientBackground } from '@/features/home/components/AmbientBackground';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Shield, FileText, ShoppingBag, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PolicyPageLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated?: string;
}

const policies = [
  {
    title: 'Chính sách bảo mật',
    href: '/chinh-sach-bao-mat',
    icon: Shield,
    description: 'Cách chúng tôi bảo vệ thông tin của bạn',
  },
  {
    title: 'Điều khoản dịch vụ',
    href: '/dieu-khoan-dich-vu',
    icon: FileText,
    description: 'Quy định khi sử dụng sàn OCOP',
  },
  {
    title: 'Chính sách đặt hàng',
    href: '/chinh-sach-dat-hang',
    icon: ShoppingBag,
    description: 'Hướng dẫn mua hàng và giao nhận',
  },
];

export function PolicyPageLayout({ children, title, lastUpdated }: PolicyPageLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-emerald-50/30 relative">
      <AmbientBackground />
      <Header />

      <main className="relative z-10 flex-1 w-full flex flex-col items-center pb-20">
        {/* Hero Section */}
        <div className="w-full bg-emerald-900/10 py-12 px-6 flex justify-center">
          <div className="w-full max-w-7xl">
            <Breadcrumb
              items={[
                { label: 'Trang chủ', href: '/' },
                { label: 'Hỗ trợ', href: '#' },
                { label: title, href: pathname },
              ]}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">{title}</h1>
              {lastUpdated && (
                <div className="flex items-center gap-2 text-emerald-900/70 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Cập nhật lần cuối: {lastUpdated}</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full max-w-7xl px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white/70 backdrop-blur-md border border-emerald-100 rounded-xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-emerald-900 mb-6">Chính sách & Quy định</h2>
                <div className="space-y-3">
                  {policies.map((policy) => {
                    const isActive = pathname === policy.href;
                    const Icon = policy.icon;
                    return (
                      <Link
                        key={policy.href}
                        href={policy.href}
                        className={cn(
                          'group flex items-start gap-4 p-4 rounded-xl transition-all duration-300',
                          isActive
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                            : 'hover:bg-emerald-50 text-emerald-800',
                        )}
                      >
                        <div
                          className={cn(
                            'mt-1 p-2 rounded-xl transition-colors',
                            isActive ? 'bg-white/20' : 'bg-emerald-100 group-hover:bg-emerald-200',
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-base">{policy.title}</div>
                          <div
                            className={cn(
                              'text-xs mt-1 transition-colors',
                              isActive ? 'text-emerald-50' : 'text-emerald-600',
                            )}
                          >
                            {policy.description}
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            'w-5 h-5 mt-3 transition-transform duration-300',
                            isActive
                              ? 'translate-x-0 opacity-100'
                              : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-emerald-900 rounded-xl p-8 text-white relative overflow-hidden group">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-800 rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-500" />
                <h3 className="text-xl font-bold mb-3 relative z-10">Bạn cần hỗ trợ thêm?</h3>
                <p className="text-emerald-100/80 text-sm mb-6 relative z-10 leading-relaxed">
                  Nếu bạn có bất kỳ câu hỏi nào về các chính sách của chúng tôi, đừng ngần ngại liên
                  hệ với đội ngũ hỗ trợ.
                </p>
                <Link
                  href="/ho-tro#contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl hover:bg-emerald-50 transition-colors relative z-10 w-full"
                >
                  Liên hệ chúng tôi
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-[2.5rem] p-8 md:p-12 shadow-sm max-w-none 
                [&>section]:mb-10 
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-emerald-900 [&_h2]:mb-4 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-3
                [&_p]:text-emerald-800 [&_p]:leading-relaxed [&_p]:mb-4
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:text-emerald-800
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4 [&_ol]:text-emerald-800
                [&_li]:leading-relaxed
                [&_strong]:text-emerald-900 [&_strong]:font-semibold"
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
