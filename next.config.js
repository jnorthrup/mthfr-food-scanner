const isExport = process.env.NEXT_EXPORT === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development' || isExport,
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isExport ? 'export' : 'standalone',
  ...(isExport && basePath && { basePath }),
  ...(isExport && { trailingSlash: true }),
  distDir: process.env.NODE_ENV === 'production' 
    ? (process.env.BUILD_DIR || '.next-build')
    : '.next',  
  images: {
    unoptimized: true,
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
      "world.openfoodfacts.org",
      "images.openfoodfacts.org",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(!isExport && {
    async headers() {
      if (process.env.NODE_ENV !== 'development') {
        return [];
      }
      return [
        {
          source: '/:path*',
          headers: [
            { key: 'Access-Control-Allow-Origin', value: '*' },
            { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
            { key: 'Access-Control-Allow-Headers', value: '*' },
          ],
        },
      ];
    },
  }),
};

module.exports = withPWA(nextConfig);
