import { ImageResponse } from 'next/og'
import { getAllPosts } from '@/lib/posts'

export const alt = 'Blog post OG image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getAllPosts().find((p) => p.slug === slug)
  const title = post?.title ?? 'Blog'

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0d1b1b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <p style={{ color: '#ecbb73', fontSize: 24, margin: '0 0 24px', fontFamily: 'system-ui' }}>
          yashkadam.com
        </p>
        <h1
          style={{ color: '#e9efe9', fontSize: 64, lineHeight: 1.1, margin: 0, fontFamily: 'system-ui' }}
        >
          {title}
        </h1>
      </div>
    ),
    { ...size }
  )
}
