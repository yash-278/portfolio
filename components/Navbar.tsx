import Link from 'next/link'

// TODO Phase 2: add usePathname() for active link accent + border-b-2 border-accent
export default function Navbar() {
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
            className="text-sm font-semibold text-text transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Home
          </Link>
          <Link
            href="/blog"
            className="text-sm font-semibold text-text transition-colors duration-150 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Blog
          </Link>
        </div>
      </nav>
    </header>
  )
}
