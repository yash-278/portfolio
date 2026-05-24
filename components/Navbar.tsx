import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-14 border-b border-border bg-bg/80 backdrop-blur-sm">
      <nav
        className="mx-auto flex h-full max-w-5xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-text transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          Yash Kadam
        </Link>
        <ul className="flex items-center gap-6" role="list">
          <li>
            <Link
              href="/"
              className="text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/blog"
              className="text-sm text-text-muted transition-colors hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Blog
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
