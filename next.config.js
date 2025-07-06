/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/v0-interactive-clock' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/v0-interactive-clock' : '',
  // distDir: 'out',
  // GitHub Pagesで必要な追加設定
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/v0-interactive-clock' : '',
  },
}

module.exports = nextConfig
