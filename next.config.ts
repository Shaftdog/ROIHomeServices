
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
      // Redirect old /locations to new /florida-appraisals hub
      {
        source: '/locations',
        destination: '/florida-appraisals',
        permanent: true,
      },
      // Redirect old city pages to new nested structure
      {
        source: '/locations/orlando',
        destination: '/florida-appraisals/central-florida/orlando',
        permanent: true,
      },
      {
        source: '/locations/winter-park',
        destination: '/florida-appraisals/central-florida/winter-park',
        permanent: true,
      },
      {
        source: '/locations/kissimmee',
        destination: '/florida-appraisals/central-florida/kissimmee',
        permanent: true,
      },
      {
        source: '/locations/lakeland',
        destination: '/florida-appraisals/central-florida/lakeland',
        permanent: true,
      },
      {
        source: '/locations/daytona-beach',
        destination: '/florida-appraisals/central-florida/daytona-beach',
        permanent: true,
      },
      {
        source: '/locations/tampa',
        destination: '/florida-appraisals/tampa-bay/tampa',
        permanent: true,
      },
      {
        source: '/locations/st-petersburg',
        destination: '/florida-appraisals/tampa-bay/st-petersburg',
        permanent: true,
      },
      {
        source: '/locations/jacksonville',
        destination: '/florida-appraisals/first-coast/jacksonville',
        permanent: true,
      },
      {
        source: '/locations/miami',
        destination: '/florida-appraisals/south-florida/miami',
        permanent: true,
      },
      {
        source: '/locations/fort-lauderdale',
        destination: '/florida-appraisals/south-florida/fort-lauderdale',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
