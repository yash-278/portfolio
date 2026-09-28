// Server Component — no 'use client'
// Tillwise's product page is its own world: the app's dark tokens (scoped by
// data-site in globals.css), its own header and footer, and a Scotch serif standing
// in for New York, which the app uses for root titles and which has no web release.
// Navbar and Footer opt out of this route so there is only one navigation.
import Image from 'next/image'
import Link from 'next/link'
import { Newsreader } from 'next/font/google'
import BetaCta from '@/components/tillwise/BetaCta'

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-tl-display',
  display: 'swap',
})

function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-[var(--tl-line)] bg-[var(--tl-canvas)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/tillwise"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
        >
          <Image
            src="/tillwise/icon.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-[0.5rem]"
          />
          <span className="font-semibold tracking-tight text-[var(--tl-ink)]">Tillwise</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-[0.95rem] text-[var(--tl-muted)] transition-colors duration-150 hover:text-[var(--tl-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
          >
            Yash Kadam
          </Link>
          <BetaCta className="hidden sm:flex" />
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--tl-line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md leading-relaxed text-[var(--tl-muted)]">
          Tillwise is built by{' '}
          <Link
            href="/"
            className="text-[var(--tl-ink)] underline underline-offset-[5px] transition-colors duration-150 hover:text-[var(--tl-iris)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
          >
            Yash Kadam
          </Link>
          , a technical lead and fullstack developer.
        </p>
        <div className="flex items-center gap-6 text-[0.95rem]">
          <Link
            href="/tillwise/privacy"
            className="text-[var(--tl-muted)] transition-colors duration-150 hover:text-[var(--tl-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
          >
            Privacy
          </Link>
          <Link
            href="/#projects"
            className="text-[var(--tl-muted)] transition-colors duration-150 hover:text-[var(--tl-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
          >
            Other projects
          </Link>
          <Link
            href="/blog"
            className="text-[var(--tl-muted)] transition-colors duration-150 hover:text-[var(--tl-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tl-iris)]"
          >
            Writing
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default function TillwiseLayout({ children }: { children: React.ReactNode }) {
  return (
    // -mt-14 cancels the pt-14 the root layout reserves for the site Navbar, which
    // does not render here. Without it the page opens on 56px of dead canvas.
    <div
      data-site="tillwise"
      className={`${newsreader.variable} -mt-14 bg-[var(--tl-canvas)] text-[var(--tl-ink)]`}
    >
      <Header />
      {children}
      <SiteFooter />
    </div>
  )
}
