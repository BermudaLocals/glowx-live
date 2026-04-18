import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Providers } from '@/components/glowx/Providers'
import { GlowxNav } from '@/components/glowx/GlowxNav'
import { GlowxCursor } from '@/components/glowx/GlowxCursor'
import { Toaster } from '@/components/glowx/Toaster'

export const metadata: Metadata = {
  title: 'GLOWX — The Platform OnlyFans Wishes It Was',
  description: 'Same 80% payout. Ten times the platform. Multi-platform scheduling, 3D mesh studio, AI tools, and real-time engagement.',
  manifest: '/manifest.json',
  icons: { apple: '/icons/icon-192.png' },
  openGraph: {
    title: 'GLOWX',
    description: 'The premium creator monetization platform.',
    url: 'https://glowx.live',
    siteName: 'GLOWX',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <GlowxCursor />
          <GlowxNav />
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
