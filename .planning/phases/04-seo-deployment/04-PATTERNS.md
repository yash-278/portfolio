# Phase 4: SEO & Deployment - Pattern Map

**Mapped:** 2026-05-25
**Files analyzed:** 7 (5 new, 2 modified)
**Analogs found:** 7 / 7

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `app/blog/[slug]/opengraph-image.tsx` | route/SSG | request-response | `app/blog/[slug]/page.tsx` | role-match (same segment, same params shape, same data source) |
| `app/sitemap.ts` | route/SSG | batch | `app/blog/page.tsx` | partial (same data source, different output format) |
| `app/robots.ts` | route/SSG | request-response | `app/layout.tsx` | partial (same metadata export pattern) |
| `app/feed.xml/route.ts` | route handler | batch | `app/blog/page.tsx` | partial (same data source, different output format) |
| `proxy.ts` | middleware | request-response | `app/layout.tsx` (env check pattern) | partial (no existing proxy in codebase) |
| `app/blog/[slug]/page.tsx` (modify) | page | request-response | `app/page.tsx` | exact (same openGraph/twitter metadata shape) |
| `app/blog/page.tsx` (no change needed) | page | batch | itself | — already has `metadata` export at lines 5–9 |

---

## Pattern Assignments

### `app/blog/[slug]/opengraph-image.tsx` (new — route/SSG, request-response)

**Analog:** `app/blog/[slug]/page.tsx`

**Imports pattern** (`app/blog/[slug]/page.tsx` lines 1–4):
```typescript
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
```

New file imports to use instead:
```typescript
import { ImageResponse } from 'next/og'
import { getAllPosts } from '@/lib/posts'
```

**generateStaticParams pattern** (`app/blog/[slug]/page.tsx` lines 6–8):
```typescript
export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}
```
Copy verbatim into `opengraph-image.tsx` — same function, same return shape.

**Async params (Promise) pattern** (`app/blog/[slug]/page.tsx` lines 12–18):
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getAllPosts().find((p) => p.slug === slug)
```
The default export in `opengraph-image.tsx` must follow the same `params: Promise<{ slug: string }>` + `await params` pattern. This is the critical Next.js 16 breaking change.

**Core OG image pattern** (from RESEARCH.md Pattern 1):
```typescript
export const alt = 'Blog post OG image'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

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
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111 60%, #1a1020 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <p style={{ color: '#818cf8', fontSize: 24, margin: '0 0 24px', fontFamily: 'system-ui' }}>
          yashkadam.com
        </p>
        <h1 style={{ color: '#f8fafc', fontSize: 64, lineHeight: 1.1, margin: 0, fontFamily: 'system-ui' }}>
          {title}
        </h1>
      </div>
    ),
    { ...size }
  )
}
```

**Design tokens to match:**
- Background: `#0a0a0a` / `#111` (matches site dark theme from `globals.css`)
- Accent color: `#818cf8` (Phase 2 canonical accent — confirmed in Phase 2 CONTEXT)
- Text: `#f8fafc` (near-white, matches `--color-text` CSS variable)
- Font: `system-ui` (zero loading overhead; avoids Vercel build-time network restriction)
- Size: 1200x630 (matches existing `public/og.png` dimensions)

---

### `app/sitemap.ts` (new — route/SSG, batch)

**Analog:** `app/blog/page.tsx` (same `getAllPosts()` call + map pattern)

**Data source pattern** (`app/blog/page.tsx` lines 20–22):
```typescript
export default function BlogPage() {
  const posts = getAllPosts()
```

**Core sitemap pattern** (from RESEARCH.md Pattern 3):
```typescript
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'
  const posts = getAllPosts()

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...postPages]
}
```

**NEXT_PUBLIC_SITE_URL pattern** (`app/page.tsx` lines 18–20):
```typescript
images: [
  {
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/og.png`,
```
All absolute URLs must use `process.env.NEXT_PUBLIC_SITE_URL` as the base, with `?? 'https://yashkadam.com'` fallback.

---

### `app/robots.ts` (new — route/SSG, request-response)

**Analog:** `app/layout.tsx` (env-conditional behavior pattern)

**Environment check pattern** (RESEARCH.md Pattern 2 — no existing analog in codebase):
```typescript
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'
  const isProd = process.env.VERCEL_ENV === 'production'

  return {
    rules: {
      userAgent: '*',
      allow: isProd ? '/' : undefined,
      disallow: isProd ? undefined : '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

**Note:** `VERCEL_ENV` is `undefined` locally — `undefined !== 'production'` correctly defaults to non-prod (disallow). No explicit fallback needed beyond the boolean check.

---

### `app/feed.xml/route.ts` (new — route handler, batch)

**Analog:** `app/blog/page.tsx` (same `getAllPosts()` + map pattern; closest existing analog for iterating posts)

**Data source pattern** (`app/blog/page.tsx` lines 20–22):
```typescript
export default function BlogPage() {
  const posts = getAllPosts()
```

**Core RSS Route Handler pattern** (from RESEARCH.md Pattern 4):
```typescript
import { getAllPosts } from '@/lib/posts'
import { NextResponse } from 'next/server'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'
  const posts = getAllPosts()

  const items = posts.map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Yash Kadam</title>
    <link>${siteUrl}/blog</link>
    <description>Technical writing on fullstack development, TypeScript, and building products at scale.</description>
    <language>en-us</language>${items}
  </channel>
</rss>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
```

**Critical:** `escapeXml` is mandatory. A post title like "React & TypeScript" produces invalid XML without it. The `<description>` channel text matches exactly what `app/blog/page.tsx` line 7–8 uses as the blog's description metadata.

---

### `proxy.ts` (new — middleware, request-response)

**Analog:** No existing middleware/proxy in codebase. Pattern sourced entirely from RESEARCH.md Pattern 5.

**Core proxy pattern** (from RESEARCH.md Pattern 5):
```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  // Guard: only redirect on production to avoid matching Vercel preview URLs
  if (process.env.VERCEL_ENV !== 'production') {
    return NextResponse.next()
  }

  const host = request.headers.get('host') ?? ''
  if (host === 'blog.yashkadam.com') {
    return NextResponse.redirect('https://yashkadam.com/blog', { status: 308 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

**File placement:** `proxy.ts` at project root (same level as `app/`, `lib/`, `components/`).

**Critical notes from RESEARCH.md:**
- Export name must be `proxy` (not `middleware`) — Next.js 16 breaking change
- Use `request.headers.get('host')` NOT `request.nextUrl.hostname` — the latter returns the deployment URL, not the browser's Host header
- Do NOT set `runtime = 'edge'` — throws error in Next.js 16 proxy files
- 308 status code is correct for permanent method-preserving redirect

---

### `app/blog/[slug]/page.tsx` (modify — add OG fields to `generateMetadata`)

**Analog:** `app/page.tsx` — the exact existing file with full openGraph + twitter metadata

**Current state** (`app/blog/[slug]/page.tsx` lines 12–28): `generateMetadata` returns only `title` and `description`. Needs OG fields added.

**Target openGraph pattern to copy from** (`app/page.tsx` lines 8–34):
```typescript
export const metadata: Metadata = {
  title: 'Yash Kadam — Technical Lead',
  description: '...',
  openGraph: {
    title: 'Yash Kadam — Technical Lead',
    description: '...',
    url: 'https://yashkadam.com',
    siteName: 'Yash Kadam',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/og.png`,
        width: 1200,
        height: 630,
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yash Kadam — Technical Lead',
    description: '...',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL}/og.png`],
  },
}
```

**Adapted pattern for `generateMetadata` in `app/blog/[slug]/page.tsx`** (from RESEARCH.md Pattern 6):
```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getAllPosts().find((p) => p.slug === slug)

  if (!post) return { title: 'Post Not Found' }

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
```

**Note:** Do NOT add `openGraph.images` here. The co-located `opengraph-image.tsx` file-based convention auto-injects `og:image`. Adding it in `generateMetadata` would produce duplicate `og:image` tags.

**Note on `publishedTime`:** This is a valid OpenGraph `article` property. TypeScript's `Metadata` type from Next.js accepts it under `openGraph` when `type: 'article'`.

---

### `app/blog/page.tsx` (no modification needed)

**Current state** (`app/blog/page.tsx` lines 1–9): Already has a `metadata` export with `title` and `description`. No OG fields are present, but the static fallback `public/og.png` will be inherited from the root layout's `metadataBase` once that is added (see Shared Patterns below).

**Verdict:** This file requires no direct changes in Phase 4. The root layout `metadataBase` update provides OG image inheritance for this page.

---

## Shared Patterns

### NEXT_PUBLIC_SITE_URL Base URL
**Source:** `app/page.tsx` lines 18–20
**Apply to:** `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`, `app/blog/[slug]/page.tsx`
```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'
```
Always include the `?? 'https://yashkadam.com'` fallback. The env var is confirmed set in Vercel (Phase 1 FOUND-06) but is not present locally without `.env.local`.

### getAllPosts() Import
**Source:** `app/blog/page.tsx` line 3, `app/blog/[slug]/page.tsx` line 4
**Apply to:** `app/blog/[slug]/opengraph-image.tsx`, `app/sitemap.ts`, `app/feed.xml/route.ts`
```typescript
import { getAllPosts } from '@/lib/posts'
```
The `@/` alias resolves to the project root (confirmed in tsconfig path aliases). Do not use relative paths.

### Async params Pattern (Next.js 16)
**Source:** `app/blog/[slug]/page.tsx` lines 12–18
**Apply to:** `app/blog/[slug]/opengraph-image.tsx`
```typescript
// params is a Promise in Next.js 16 — MUST await before use
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
```
This pattern is already established in the codebase. `opengraph-image.tsx` must mirror it exactly.

### metadataBase Addition (root layout)
**Source:** `app/layout.tsx` lines 24–27 (current — no metadataBase)
**Apply to:** `app/layout.tsx` (minor addition alongside existing metadata)

The root layout currently lacks `metadataBase`. Adding it enables relative URL resolution for OG images on all pages (including `/blog` which has no explicit OG image). Planner should add this to the existing `metadata` export in `app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'),
  title: 'Yash Kadam — Technical Lead',
  description: 'Technical Lead and fullstack developer. I write code, lead teams, and ship things.',
  openGraph: {
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
}
```
This is the minimum addition — it does not change any existing values and does not break the FOUC script or LazyMotion pattern.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `proxy.ts` | middleware | request-response | No existing middleware or proxy in codebase; only pattern source is RESEARCH.md Pattern 5 |

---

## Key Anti-Patterns (from RESEARCH.md — enforce in planning)

| Anti-Pattern | File | Correct Approach |
|-------------|------|-----------------|
| `export function middleware(...)` in `middleware.ts` | `proxy.ts` | Use `export function proxy(...)` in `proxy.ts` |
| `params.slug` without await | `opengraph-image.tsx` | Always `const { slug } = await params` |
| `request.nextUrl.hostname` | `proxy.ts` | Use `request.headers.get('host')` |
| `openGraph.images` in `generateMetadata` when `opengraph-image.tsx` exists | `app/blog/[slug]/page.tsx` | Omit — file convention auto-injects `og:image` |
| Unescaped `&`, `<`, `>` in RSS XML | `app/feed.xml/route.ts` | Run all user strings through `escapeXml()` before injection |
| `runtime = 'edge'` in `proxy.ts` | `proxy.ts` | Remove — throws error in Next.js 16 proxy files |

---

## Metadata

**Analog search scope:** `app/`, `lib/`, `components/` (project root TypeScript files)
**Files scanned:** 10 TypeScript/TSX files
**Pattern extraction date:** 2026-05-25
