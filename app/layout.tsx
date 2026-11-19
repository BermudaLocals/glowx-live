import './globals.css'

export const metadata = {
  metadataBase: new URL('https://app-production-109a.up.railway.app'),
  title: 'GlowX — Illuminate Your Content. Ignite Your Empire.',
  description: 'GlowX is the creator-first monetisation platform: subscriptions, pay-per-view, AI personas and direct fan connection — built so creators keep more of what they earn.',
  icons: { icon: '/favicon.svg' },
  openGraph: {
    title: 'GlowX — Illuminate Your Content. Ignite Your Empire.',
    description: 'The creator-first monetisation platform. Subscriptions, PPV, AI personas and direct fan connection.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0A0A0F] text-white antialiased">{children}</body>
    </html>
  )
}
