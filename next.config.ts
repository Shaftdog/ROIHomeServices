
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added for placeholder images
        port: '',
        pathname: '/**',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/services',
        destination: '/offerings',
        permanent: false, // Results in a 307 for client-side, 302 for server. Satisfies "temporary".
      },
      {
        source: '/products/:path*',
        destination: '/solutions/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
