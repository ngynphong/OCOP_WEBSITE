'use client';

import React, { useEffect, useState } from 'react';
import { Zap, Package, Ticket, Gift } from 'lucide-react';

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
    { id: 'flash-sale', label: 'Flash Sale Giờ Vàng', icon: Zap, show: hasFlashSale },
    { id: 'collections', label: 'Bộ Sưu Tập OCOP', icon: Package, show: hasCollections },
    { id: 'vouchers', label: 'Mã Giảm Giá Sàn', icon: Ticket, show: hasVouchers },
    { id: 'activities', label: 'Lì Xì & Minigame', icon: Gift, show: hasActivities },
  ].filter((item) => item.show);

  if (navItems.length === 0) return null;

  return (
    <nav
      aria-label="Điều hướng nhanh sự kiện"
      className={`sticky top-14 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200/80'
          : 'bg-white/85 backdrop-blur-sm py-3 border-y border-slate-200/60'
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer shadow-xs ${
                  isActive
                    ? 'text-white shadow-md scale-105 ring-2 ring-white/50'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
                }`}
                style={isActive ? { backgroundColor: 'var(--event-primary, #DC2626)' } : undefined}
              >
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
