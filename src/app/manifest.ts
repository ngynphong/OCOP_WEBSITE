import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OCOP',
    short_name: 'OCOP',
    description: 'Sàn thương mại điện tử OCOP',
    start_url: '/dashboard',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    icons: [{ src: '/images/icon.png', sizes: '256x256', type: 'image/png' }],
  };
}
