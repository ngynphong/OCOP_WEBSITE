import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocop.iesconnect.vn';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/dang-nhap',
        '/xac-thuc-otp',
        '/quen-mat-khau',
        '/dat-lai-mat-khau',
        '/checkout',
        '/payment',
        '/trace/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
