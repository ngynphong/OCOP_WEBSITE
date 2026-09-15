'use client';

import React, { useEffect, useState } from 'react';

interface EventStickyNavProps {
  hasFlashSale?: boolean;
  hasCollections?: boolean;
  hasVouchers?: boolean;
  hasActivities?: boolean;
}

export function EventStickyNav({
  hasFlashSale = true,
  hasCollections = true,
  hasVouchers = true,
  hasActivities = true,
}: EventStickyNavProps) {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);

      const sections = ['flash-sale', 'collections', 'vouchers', 'activities'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const topOffset = 100;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  const navItems = [
    { id: 'flash-sale', label: 'Flash Sale Giờ Vàng', icon: '⚡', show: hasFlashSale },
    { id: 'collections', label: 'Bộ Sưu Tập OCOP', icon: '📦', show: hasCollections },
    { id: 'vouchers', label: 'Mã Giảm Giá Sàn', icon: '🎟️', show: hasVouchers },
    { id: 'activities', label: 'Lì Xì & Minigame', icon: '🎁', show: hasActivities },
  ].filter((item) => item.show);

  if (navItems.length === 0) return null;

  return (
    <nav
      aria-label="Điều hướng nhanh sự kiện"
      className={`sticky top-[64px] z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md py-2 border-b border-black/5 dark:border-white/10'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-3 border-y border-black/5 dark:border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-sm ${
                  isActive
                    ? 'text-white shadow-md scale-105 ring-2 ring-white/50'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                }`}
                style={isActive ? { backgroundColor: 'var(--event-primary, #DC2626)' } : undefined}
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
