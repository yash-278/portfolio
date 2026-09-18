import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
      <h1 className="text-4xl font-semibold tracking-tight text-text md:text-6xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-5 max-w-xl text-xl text-text-muted">
        The link may be old, or the address may have a typo.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-accent px-5 py-2.5 font-semibold text-bg transition-colors duration-150 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Go to the homepage
      </Link>
    </div>
  )
}
