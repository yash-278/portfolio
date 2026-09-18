'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const links = [
  { href: '/#projects', label: 'Projects' },
  { href: '/#about', label: 'About' },
  { href: '/blog', label: 'Writing' },
  { href: '/#contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed left-0 right-0 top-0 z-40 h-14 bg-bg/85 backdrop-blur-md">
      <nav
        className="mx-auto flex h-full max-w-6xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="flex items-center gap-3 font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Image
            src="/yash.jpg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover object-[55%_30%]"
          />
          Yash Kadam
        </Link>
        <div className="flex items-center gap-5 text-[0.95rem] sm:gap-7">
          {links.map((link) => {
            const current = link.href === '/blog' && pathname.startsWith('/blog')
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={cn(
                  'transition-colors duration-150 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
                  current ? 'text-text' : 'text-text-muted',
                  // Section anchors are reachable by scrolling; on small screens keep only the routes that aren't.
                  link.href.startsWith('/#') && link.label !== 'Contact' && 'hidden sm:inline'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
