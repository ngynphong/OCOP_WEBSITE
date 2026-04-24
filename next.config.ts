import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.ap-learning.site',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ap-learning.site',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.ghn.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.ocop.iesconnect.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ghtk.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.ghtk.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.ghtk.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'minio.ocop.iesconnect.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bvtb.org.vn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.dienthoaivui.com.vn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
