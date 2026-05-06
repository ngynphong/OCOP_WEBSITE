export const siteConfig = {
  name: 'OCOP',
  description: 'Sàn thương mại điện tử OCOP - Tinh hoa hàng Việt, Đặc sản vùng miền.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocop.iesconnect.vn',
  ogImage: '/images/dNUEl-removebg-preview.png',
  links: {
    facebook: 'https://www.facebook.com/ies.focus.lms',
  },
};

export const defaultMetadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'OCOP',
    'đặc sản',
    'nông sản',
    'thương mại điện tử',
    'tinh hoa vùng miền',
    'ies',
    'connect',
  ],
  authors: [
    {
      name: 'OCOP IES Connect',
    },
  ],
  creator: 'OCOP',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@ocop',
  },
};
