/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Prefer modern formats for image optimization
  images: { formats: ['image/avif', 'image/webp'] },
  // Ensure SWC minification and modern externals for reduced legacy JS
  swcMinify: true,
  experimental: {
    esmExternals: true,
  },
  // Strip console statements in production to reduce JS payload
  compiler: {
    removeConsole: { production: true },
  },
  // Add strong caching for static assets
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)\.(png|jpg|jpeg|svg|webp|avif|gif|ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
