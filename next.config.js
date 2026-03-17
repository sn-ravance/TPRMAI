/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Turbopack config (Next.js 16+ uses Turbopack by default)
  turbopack: {},
  // Webpack fallback for packages that need it
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'canvas', 'jsdom'];
    return config;
  },
}

module.exports = nextConfig
