'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  ScanLine,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCart } from '@/features/cart/hooks/useCart';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { SearchBox } from '@/features/products/components/SearchBox';
import dynamic from 'next/dynamic';

import { cn } from '@/lib/utils';
const QRScannerModal = dynamic(() => import('@/components/ui/QRScannerModal'), { ssr: false });

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { logout, isLoggingOut, handleClientLogout, profile } = useAuth();
  const role = useAppSelector((state) => state.auth.roles);

  const { data: cartResp } = useCart();
  const cartCount = cartResp?.data?.totalItems ?? 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsUserDropdownOpen(false);
  };

  const handleConfirmLogout = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      logout({ refreshToken });
    } else {
      handleClientLogout();
    }
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="w-full flex flex-col justify-start items-center sticky top-0 z-[100]">
      <div className="w-full py-2 bg-yellow-100 flex flex-col justify-start items-center relative z-[101]">
        <div className="text-center justify-center text-stone-900 text-xs font-medium font-sans leading-4 tracking-tight">
          Kết nối tinh hoa nông sản Việt | OCOP chính hãng – Giao hàng toàn quốc
        </div>
      </div>
      <div
        className={cn(
          'w-full relative z-[102] flex flex-col justify-start items-center transition-all duration-300',
          isScrolled
            ? 'bg-emerald-800/85 backdrop-blur-xl border-b border-emerald-700/50 shadow-md'
            : 'bg-emerald-700',
        )}
      >
        <div className="w-full max-w-7xl px-4 lg:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex justify-start items-center gap-4 lg:gap-8 lg:pl-4 relative z-[103]">
            <button
              suppressHydrationWarning
              className="lg:hidden text-white p-1 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link
              href="/"
              suppressHydrationWarning
              className="inline-flex flex-row justify-start items-center"
            >
              <Image
                src="/images/logo.png"
                alt="OCOP IES CONNECT"
                width={140}
                height={140}
                className="scale-155"
                priority
                sizes="(max-width: 768px) 100vw, 100vw"
              />
            </Link>
            <nav className="hidden lg:flex justify-start items-center gap-6">
              <Link
                href="/"
                suppressHydrationWarning
                className={
                  pathname === '/'
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span
                  className={
                    pathname === '/'
                      ? 'text-white text-sm font-semibold font-sans leading-5'
                      : 'text-emerald-100 text-sm font-semibold font-sans leading-5'
                  }
                >
                  Trang Chủ
                </span>
              </Link>
              <Link
                href="/san-pham"
                className={
                  isHydrated && pathname.startsWith('/san-pham')
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span
                  className={
                    isHydrated && pathname.startsWith('/san-pham')
                      ? 'text-white text-sm font-semibold font-sans leading-5'
                      : 'text-emerald-100 text-sm font-semibold font-sans leading-5'
                  }
                >
                  Sản Phẩm
                </span>
              </Link>
              <Link
                href="/vung-mien"
                className={
                  isHydrated && pathname.startsWith('/vung-mien')
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span
                  className={
                    isHydrated && pathname.startsWith('/vung-mien')
                      ? 'text-white text-sm font-semibold font-sans leading-5'
                      : 'text-emerald-100 text-sm font-semibold font-sans leading-5'
                  }
                >
                  Vùng Miền
                </span>
              </Link>
              <Link
                href="/cau-chuyen"
                className={
                  isHydrated && pathname.startsWith('/cau-chuyen')
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span className="text-emerald-100 text-sm font-semibold font-sans leading-5">
                  Câu Chuyện
                </span>
              </Link>
              <Link
                href="/bai-viet"
                className={
                  isHydrated && pathname.startsWith('/bai-viet')
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span className="text-emerald-100 text-sm font-semibold font-sans leading-5">
                  Bài Viết
                </span>
              </Link>
            </nav>
          </div>
          <div className="hidden lg:flex flex-1 max-w-[512px] px-8 flex-col justify-start items-start">
            <SearchBox variant="header" />
          </div>
          <div className="px-2 flex justify-start items-center gap-1 md:gap-2.5 relative z-[103]">
            <button
              suppressHydrationWarning
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>
            {!isHydrated ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            ) : isAuthenticated ? (
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button
                  suppressHydrationWarning
                  className="inline-flex items-center gap-1 h-10 px-3 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center border border-white/20 shrink-0 overflow-hidden">
                    {profile?.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-stone-100 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        <Link
                          href={
                            role.includes('ADMIN') || role.includes('SUPER_ADMIN')
                              ? '/admin'
                              : '/dashboard/ho-so'
                          }
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                        >
                          <User className="w-4 h-4 text-stone-400 group-hover:text-emerald-600" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                        <Link
                          href={
                            role.includes('ADMIN') || role.includes('SUPER_ADMIN')
                              ? '/admin'
                              : '/dashboard'
                          }
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-stone-400 group-hover:text-emerald-600" />
                          <span>Tổng quan</span>
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50 cursor-pointer"
                        >
                          <LogOut
                            className={`w-4 h-4 text-red-400 group-hover:text-red-600 ${isLoggingOut ? 'animate-spin' : ''}`}
                          />
                          <span>{isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/dang-nhap"
                  suppressHydrationWarning
                  className="md:hidden h-10 w-10 inline-flex flex-col justify-center items-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
                  aria-label="Đăng nhập"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <Link
                  href="/dang-nhap"
                  suppressHydrationWarning
                  className="hidden md:inline-flex h-10 px-4 py-px flex-col justify-center items-center text-green-700 bg-white hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-sm font-semibold whitespace-nowrap"
                >
                  Đăng nhập
                </Link>
              </>
            )}
            <button
              onClick={() => setIsQRModalOpen(true)}
              suppressHydrationWarning
              aria-label="Quét mã QR"
              className="h-10 w-10 inline-flex flex-col justify-center items-center text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer group"
            >
              <ScanLine className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            {isAuthenticated && <NotificationBell />}
            <Link
              href="/gio-hang"
              suppressHydrationWarning
              aria-label={`Giỏ hàng${cartCount > 0 ? ` (${cartCount} sản phẩm)` : ''}`}
              className="h-10 py-px inline-flex flex-col justify-center items-start text-white hover:bg-white/10 rounded-full transition-colors p-2 relative cursor-pointer group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-green-700 shadow-sm px-1 animate-in fade-in zoom-in duration-300">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full bg-green-800 lg:hidden relative z-50"
            >
              <div className="py-3 px-4">
                <SearchBox variant="header" onClose={() => setIsSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Expansion */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-full bg-green-800 overflow-hidden lg:hidden"
            >
              <nav className="flex flex-col gap-4 py-4 px-6">
                <Link
                  suppressHydrationWarning
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    pathname === '/'
                      ? 'text-white text-base font-semibold'
                      : 'text-emerald-100 text-base font-semibold'
                  }
                >
                  Trang Chủ
                </Link>
                <Link
                  href="/san-pham"
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    isHydrated && pathname === '/san-pham'
                      ? 'text-white text-base font-semibold'
                      : 'text-emerald-100 text-base font-semibold'
                  }
                >
                  Sản Phẩm
                </Link>
                <Link
                  href="/vung-mien"
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    isHydrated && pathname.startsWith('/vung-mien')
                      ? 'text-white text-base font-semibold'
                      : 'text-emerald-100 text-base font-semibold'
                  }
                >
                  Vùng Miền
                </Link>
                <Link
                  href="/cau-chuyen"
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    isHydrated && pathname.startsWith('/cau-chuyen')
                      ? 'text-white text-base font-semibold'
                      : 'text-emerald-100 text-base font-semibold'
                  }
                >
                  Câu Chuyện
                </Link>

                <div className="h-px bg-emerald-700/50 my-2" />

                {isHydrated && isAuthenticated ? (
                  <>
                    <Link
                      href={
                        role.includes('ADMIN') || role.includes('SUPER_ADMIN')
                          ? '/admin'
                          : '/dashboard'
                      }
                      onClick={() => setIsMenuOpen(false)}
                      className="text-emerald-100 hover:text-white text-base font-semibold flex items-center gap-3 py-1"
                    >
                      <User className="w-5 h-5" />
                      Hồ sơ cá nhân
                    </Link>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogoutClick();
                      }}
                      className="text-red-300 hover:text-red-200 text-base font-semibold flex items-center gap-3 py-1 text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <Link
                    href="/dang-nhap"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-emerald-900 bg-white hover:bg-stone-100 rounded-xl py-3 px-4 text-center text-base font-bold shadow-sm mt-2"
                  >
                    Đăng nhập / Đăng ký
                  </Link>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLogoutModalOpen && (
        <ConfirmModal
          isOpen={isLogoutModalOpen}
          title="Đăng xuất tài khoản"
          message="Bạn có chắc chắn muốn đăng xuất khỏi hệ thống OCOP không?"
          confirmText="Đăng xuất ngay"
          cancelText="Để sau"
          type="danger"
          onConfirm={handleConfirmLogout}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}

      {isQRModalOpen && (
        <QRScannerModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      )}
    </header>
  );
}
