import type { Metadata } from 'next';
import { DM_Sans, Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import AppProvider from '../providers/AppProvider';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  weight: ['400', '500', '700'],
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
});

import { defaultMetadata, siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...defaultMetadata,
  icons: {
    icon: '/images/icon.png',
  },
};

import { ForcedLogoutModal } from '@/components/layout/ForcedLogoutModal';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${dmSans.variable} ${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <AppProvider>
          {children}
          <ForcedLogoutModal />
        </AppProvider>
      </body>
    </html>
  );
}
