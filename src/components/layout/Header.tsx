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
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const pathname = usePathname();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { logout, isLoggingOut, handleClientLogout } = useAuth();

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
    <header className="w-full flex flex-col justify-start items-center sticky top-0 z-50">
      <div className="w-full py-2 bg-yellow-100 flex flex-col justify-start items-center">
        <div className="text-center justify-center text-stone-900 text-xs font-medium font-sans leading-4 tracking-tight">
          Freeship toàn quốc đơn từ 200k • Đồng hành cùng nông sản Việt
        </div>
      </div>
      <div className="w-full relative bg-green-700 flex flex-col justify-start items-center shadow-md">
        <div className="w-full max-w-7xl px-4 lg:px-6 py-3 md:py-4 flex justify-between items-center">
          <div className="flex justify-start items-center gap-4 lg:gap-8 lg:pl-4">
            <button
              suppressHydrationWarning
              className="lg:hidden text-white p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link
              href="/"
              suppressHydrationWarning
              className="inline-flex flex-row justify-start items-center"
            >
              <Image src="/images/logo-ocop-rm.jpg" alt="Logo" width={50} height={50} />
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
                suppressHydrationWarning
                className={
                  pathname === '/san-pham'
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span
                  className={
                    pathname === '/san-pham'
                      ? 'text-white text-sm font-semibold font-sans leading-5'
                      : 'text-emerald-100 text-sm font-semibold font-sans leading-5'
                  }
                >
                  Sản Phẩm
                </span>
              </Link>
              <Link
                href="/regions"
                suppressHydrationWarning
                className={
                  pathname === '/regions'
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span
                  className={
                    pathname === '/regions'
                      ? 'text-white text-sm font-semibold font-sans leading-5'
                      : 'text-emerald-100 text-sm font-semibold font-sans leading-5'
                  }
                >
                  Vùng Miền
                </span>
              </Link>
              <Link
                href="/stories"
                suppressHydrationWarning
                className={
                  pathname === '/stories'
                    ? 'py-[5px] border-b-2 border-white inline-flex flex-col justify-start items-start'
                    : "inline-flex flex-col justify-start items-start relative hover:after:content-[''] hover:after:absolute hover:after:bg-white hover:after:w-full hover:after:h-[2px] hover:after:bottom-[-5px]"
                }
              >
                <span
                  className={
                    pathname === '/stories'
                      ? 'text-white text-sm font-semibold font-sans leading-5'
                      : 'text-emerald-100 text-sm font-semibold font-sans leading-5'
                  }
                >
                  Câu Chuyện
                </span>
              </Link>
            </nav>
          </div>
          <div className="hidden lg:flex flex-1 max-w-[512px] px-8 flex-col justify-start items-start">
            <div className="w-full inline-flex justify-center items-center">
              <div className="w-full relative inline-flex flex-col justify-start items-start">
                <div className="w-full px-4 py-2.5 bg-white/10 rounded-full inline-flex items-center gap-2 overflow-hidden border border-transparent focus-within:border-emerald-300 transition-colors">
                  <Search className="w-4 h-4 text-white/70" />
                  <input
                    type="text"
                    suppressHydrationWarning
                    placeholder="Tìm kiếm tinh hoa đất Việt..."
                    className="flex-1 bg-transparent text-emerald-100 text-sm font-normal font-sans focus:outline-none placeholder:text-emerald-100/70"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="px-px flex justify-start items-center gap-1 md:gap-2.5">
            <button
              suppressHydrationWarning
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="w-5 h-5" />
            </button>
            {isAuthenticated ? (
              <div
                className="relative hidden md:block"
                onMouseEnter={() => setIsUserDropdownOpen(true)}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
              >
                <button
                  suppressHydrationWarning
                  className="inline-flex items-center gap-1 h-10 px-3 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center border border-white/20">
                    <User className="w-5 h-5 text-white" />
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
                          href="/dashboard"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-stone-400 group-hover:text-emerald-600" />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogoutClick}
                          disabled={isLoggingOut}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors group disabled:opacity-50"
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
              <Link
                href="/dang-nhap"
                suppressHydrationWarning
                className="hidden md:inline-flex h-10 px-4 py-px flex-col justify-center items-center text-green-700 bg-white hover:bg-stone-100 rounded-full transition-colors cursor-pointer text-sm font-semibold whitespace-nowrap"
              >
                Đăng nhập
              </Link>
            )}
            <button
              suppressHydrationWarning
              className="h-10 py-px inline-flex flex-col justify-center items-start text-white hover:bg-white/10 rounded-full transition-colors p-2 relative cursor-pointer group"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-green-700 shadow-sm animate-in fade-in zoom-in duration-300">
                3
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        <div
          className={`w-full bg-green-800 transition-all duration-300 overflow-hidden lg:hidden ${isSearchOpen ? 'max-h-16 py-3 px-4' : 'max-h-0'}`}
        >
          <div className="w-full px-4 py-2 bg-white/10 rounded-full inline-flex items-center gap-2 border border-emerald-300/30">
            <Search className="w-4 h-4 text-white/70" />
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Tìm kiếm sản phẩm OCOP..."
              className="flex-1 bg-transparent text-emerald-100 text-sm focus:outline-none placeholder:text-emerald-100/50"
              autoFocus={isSearchOpen}
            />
          </div>
        </div>

        {/* Mobile Menu Expansion */}
        <div
          className={`w-full bg-green-800 transition-all duration-300 overflow-hidden lg:hidden ${isMenuOpen ? 'max-h-64 py-4 px-6' : 'max-h-0'}`}
        >
          <nav className="flex flex-col gap-4">
            <Link
              suppressHydrationWarning
              href="/"
              className={
                pathname === '/'
                  ? 'text-white text-base font-semibold'
                  : 'text-emerald-100 text-base font-semibold'
              }
            >
              Trang Chủ
            </Link>
            <Link
              suppressHydrationWarning
              href="/san-pham"
              className={
                pathname === '/san-pham'
                  ? 'text-white text-base font-semibold'
                  : 'text-emerald-100 text-base font-semibold'
              }
            >
              Sản Phẩm
            </Link>
            <Link
              suppressHydrationWarning
              href="/regions"
              className={
                pathname === '/regions'
                  ? 'text-white text-base font-semibold'
                  : 'text-emerald-100 text-base font-semibold'
              }
            >
              Vùng Miền
            </Link>
            <Link
              suppressHydrationWarning
              href="/stories"
              className={
                pathname === '/stories'
                  ? 'text-white text-base font-semibold'
                  : 'text-emerald-100 text-base font-semibold'
              }
            >
              Câu Chuyện
            </Link>
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
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
    </header>
  );
}
