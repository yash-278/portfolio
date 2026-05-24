import TestPost from '@/content/blog/test-post.mdx'

export function generateStaticParams() {
  return [{ slug: 'test-post' }]
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <TestPost />
    </article>
  )
}
