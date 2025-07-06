import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive Clock / インタラクティブ時計',
  description: 'A beautiful, interactive analog clock with mobile optimizations, themes, and gesture controls',
  generator: 'Next.js',
  keywords: ['clock', 'interactive', 'mobile', 'react', 'nextjs'],
  authors: [{ name: 'luckpoint' }],
  creator: 'luckpoint',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className="overflow-x-hidden">{children}</body>
    </html>
  )
}
