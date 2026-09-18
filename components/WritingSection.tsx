// Server Component — no 'use client'
import Link from 'next/link'
import SectionReveal from '@/components/SectionReveal'
import { getAllPosts } from '@/lib/posts'

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // date-only strings are UTC midnight; force display in UTC
  }).format(new Date(isoDate))
}

export default function WritingSection() {
  const posts = getAllPosts().slice(0, 2)
  if (posts.length === 0) return null

  return (
    <section id="writing" aria-labelledby="writing-heading" className="scroll-mt-20">
      <SectionReveal delay={0.1}>
        <h2 id="writing-heading" className="font-semibold text-text-muted">
          Writing
        </h2>
        <ul className="mt-5 space-y-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="block rounded-2xl bg-surface p-6 transition-colors duration-150 hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <time dateTime={post.date} className="text-[0.925rem] text-text-muted">
                  {formatDate(post.date)}
                </time>
                <h3 className="mt-1.5 text-xl font-semibold leading-snug text-text">{post.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-text-muted">
                  {post.description}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/blog"
          className="mt-4 inline-block text-text-muted underline underline-offset-4 transition-colors duration-150 hover:text-text"
        >
          All posts
        </Link>
      </SectionReveal>
    </section>
  )
}
