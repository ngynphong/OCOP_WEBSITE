import type { Metadata } from 'next';
import { Roboto, Open_Sans } from 'next/font/google';
import './globals.css';
import AppProvider from '../providers/AppProvider';

const roboto = Roboto({
  variable: '--font-roboto',
  weight: ['300', '400', '500', '700', '900'],
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
});

const openSans = Open_Sans({
  variable: '--font-open-sans',
  subsets: ['vietnamese', 'latin'],
  display: 'swap',
});

import { defaultMetadata, siteConfig } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  ...defaultMetadata,
  icons: {
    icon: '/images/logo.png',
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
      className={`${roboto.variable} ${openSans.variable} h-full antialiased`}
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
