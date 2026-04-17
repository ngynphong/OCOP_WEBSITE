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
    ],
  },
};

export default nextConfig;
