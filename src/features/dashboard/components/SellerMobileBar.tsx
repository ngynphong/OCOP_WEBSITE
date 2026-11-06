'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiShoppingBag, FiMessageCircle, FiBox, FiSettings } from 'react-icons/fi';
import { useEffect, useState } from 'react';

const tabs = [
  { href: '/dashboard', label: 'Tổng thể', icon: FiHome },
  {
    href: '/dashboard/cua-hang/don-hang',
    label: 'Đơn hàng',
    icon: FiShoppingBag,
    permission: 'seller.shop.manage',
  },
  { href: '/dashboard/cua-hang/chat', label: 'Tin nhắn', icon: FiMessageCircle },
  {
    href: '/dashboard/lo-san-xuat',
    label: 'Truy xuất',
    icon: FiBox,
    permission: 'seller.shop.manage',
  },
  { href: '/dashboard/cua-hang', label: 'Cửa hàng', icon: FiSettings },
];

export function SellerMobileBar({ permissions }: { permissions: string[] }) {
  const pathname = usePathname();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  useEffect(() => {
    const viewport = window.visualViewport;
    const update = () => {
      const focused =
        document.activeElement instanceof HTMLElement &&
        document.activeElement.matches('input, textarea, [contenteditable="true"]');
      setKeyboardOpen(Boolean(focused && viewport && window.innerHeight - viewport.height > 120));
    };
    const clear = () => setKeyboardOpen(false);
    viewport?.addEventListener('resize', update);
    document.addEventListener('focusin', update);
    document.addEventListener('focusout', clear);
    return () => {
      viewport?.removeEventListener('resize', update);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', clear);
    };
  }, []);
  const visibleTabs = tabs.filter((tab) => !tab.permission || permissions.includes(tab.permission));
  const active =
    visibleTabs
      .slice(1)
      .filter(({ href }) => pathname === href || pathname.startsWith(`${href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href ??
    (pathname === '/dashboard' ? '/dashboard' : '');
  return (
    <nav
      aria-label="Điều hướng người bán"
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pointer-events-none ${keyboardOpen ? 'hidden' : ''}`}
    >
      <div className="mx-auto flex max-w-lg items-center rounded-[28px] border border-emerald-100 bg-white p-1 shadow-xl pointer-events-auto">
        {visibleTabs.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={active === href ? 'page' : undefined}
            className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center rounded-2xl gap-1 text-[10px] font-semibold ${active === href ? 'bg-emerald-100 text-emerald-700' : 'text-stone-500'}`}
          >
            <Icon size={21} aria-hidden="true" />
            <span className="truncate max-w-full">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
