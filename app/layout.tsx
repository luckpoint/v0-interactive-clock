import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Intractive Clock / インタラクティブ時計',
  description: 'Simple clock application / シンプルな時計アプリ',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
