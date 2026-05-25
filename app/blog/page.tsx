import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Blog — Yash Kadam',
  description:
    'Technical writing on fullstack development, TypeScript, and building products at scale.',
}

function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoDate))
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <h1 className="text-4xl font-semibold text-text">Writing</h1>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-text-muted">No posts yet.</p>
      ) : (
        <ul className="mt-10 divide-y divide-border">
          {posts.map((post) => (
            <li key={post.slug} className="py-8">
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-semibold text-text transition-colors duration-150 hover:text-accent"
              >
                {post.title}
              </Link>
              <p className="mt-1 font-mono text-xs text-text-muted">
                {formatDate(post.date)} · {post.readingTime}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {post.description}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
