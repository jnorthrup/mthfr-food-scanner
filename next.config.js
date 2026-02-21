const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.GITHUB_PAGES === 'true' ? 'export' : 'standalone',
  // Make sure asset paths are correct for GitHub pages 
  basePath: process.env.GITHUB_PAGES === 'true' ? '/mthfr-food-scanner' : '',
  assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/mthfr-food-scanner/' : '',
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
};

module.exports = withPWA(nextConfig);
