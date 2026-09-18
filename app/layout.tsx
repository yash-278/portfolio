// Source: Next.js 16.2.6 docs + motion.dev + UI-SPEC (2026-05-24)
// Root layout: fonts, FOUC script, LazyMotion wrapper, Navbar, Footer
// NOTE: Do NOT add 'use client' here — root layout must remain a Server Component.
import type { Metadata } from 'next'
import { Albert_Sans, Geist_Mono } from 'next/font/google'
import { LazyMotion, domAnimation } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const albertSans = Albert_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'),
  title: 'Yash Kadam — Technical Lead',
  description:
    'Technical lead and fullstack developer. I build web products end to end, and lead the team that ships them.',
  openGraph: {
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${albertSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        {/* FOUC prevention: must be first child of <head>, before any stylesheet — no defer/async */}
        {/* Content is a static string constant — no user input, no XSS risk */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('dark')",
          }}
        />
      </head>
      <body className="bg-bg text-text font-sans antialiased">
        {/* Skip to main content link for keyboard/screen reader accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:text-accent"
        >
          Skip to main content
        </a>
        <Navbar />
        {/* LazyMotion: reduces animation bundle from ~34kb to ~4.6kb */}
        {/* strict prop enforces m.* usage in leaf Client Components; motion.* will throw at runtime */}
        <LazyMotion features={domAnimation} strict>
          <main id="main-content" className="pt-14">
            {children}
          </main>
        </LazyMotion>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
