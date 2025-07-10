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
  // Use NEXT_PUBLIC_BASE_PATH to optionally set a sub-directory deploy path (e.g. GitHub Pages).
  // When the variable is undefined or an empty string, the app will be served from the root path.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // distDir: 'out',
  // GitHub Pagesで必要な追加設定
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH || '',
  },
}

module.exports = nextConfig
