import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getAllPosts().find((p) => p.slug === slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'

  return {
    title: `${post.title} — Yash Kadam`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Post: React.ComponentType<any>

  try {
    const module = await import(`@/content/blog/${slug}.mdx`)
    Post = module.default
  } catch {
    notFound()
  }

  return (
    <>
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 font-mono text-xs text-text-muted transition-colors duration-150 hover:text-accent"
      >
        ← All posts
      </Link>
      <article className="prose dark:prose-invert max-w-none">
        <Post />
      </article>
    </>
  )
}
