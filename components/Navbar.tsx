'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-14 border-b border-border bg-surface backdrop-blur-sm">
      <nav
        className="mx-auto flex h-full max-w-5xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-sm font-semibold text-text transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Yash Kadam
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-current={pathname === '/' ? 'page' : undefined}
            className={cn(
              'text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              pathname === '/'
                ? 'border-b-2 border-accent pb-0.5 text-accent'
                : 'text-text hover:text-accent'
            )}
          >
            Home
          </Link>
          <Link
            href="/blog"
            aria-current={pathname === '/blog' ? 'page' : undefined}
            className={cn(
              'text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
              pathname === '/blog'
                ? 'border-b-2 border-accent pb-0.5 text-accent'
                : 'text-text hover:text-accent'
            )}
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  )
}
