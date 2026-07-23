import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ocop.iesconnect.vn').replace(
    /\/$/,
    '',
  );

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/dashboard/',
        '/dang-nhap',
        '/xac-thuc-otp',
        '/xac-thuc-email',
        '/quen-mat-khau',
        '/dat-lai-mat-khau',
        '/checkout',
        '/payment',
        '/gio-hang',
        '/trace/',
        '/auth/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
