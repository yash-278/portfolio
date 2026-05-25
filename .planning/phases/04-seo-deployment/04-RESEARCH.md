# Phase 4: SEO & Deployment - Research

**Researched:** 2026-05-25
**Domain:** Next.js 16 App Router — OG image generation, sitemap, robots.txt, RSS Route Handler, subdomain redirect (Proxy)
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** OG image background: dark card with subtle gradient — deep background (`#0a0a0a` / `#111`), faint violet gradient wash or glowing edge. Matches site's dark polished aesthetic.
- **D-02:** OG image content: post title + site name (`yashkadam.com`) only. Large post title as main hook; site name as subdued footer. No avatar, no tags.
- **D-03:** Fallback OG: static default OG image in `/public/` for non-post pages. Existing `public/og.png` (1200x630) is the candidate; reuse or create one generic `og-default.jpg`.
- **D-04:** OG image implementation: `app/blog/[slug]/opengraph-image.tsx` using `next/og` (ImageResponse). Calls `getPostBySlug()` or `getAllPosts()` to get post title. Statically generated per slug via `generateStaticParams`.
- **D-05:** RSS items: description-only — `<title>`, `<link>`, `<pubDate>`, frontmatter `description`. No full HTML body.
- **D-06:** RSS implementation: `app/feed.xml/route.ts` as a Next.js Route Handler. Calls `getAllPosts()`, builds RSS 2.0 XML string, returns `Content-Type: application/rss+xml`.
- **D-07:** No RSS library — plain string template is sufficient.
- **D-08:** Sitemap: Next.js built-in `app/sitemap.ts`. Export default function calling `getAllPosts()`, returns `MetadataRoute.Sitemap`. Includes `/`, `/blog`, and one entry per published post slug.
- **D-09:** `app/robots.ts` — Next.js built-in. `Allow: /` when `VERCEL_ENV === 'production'`; `Disallow: /` otherwise.
- **D-10:** Subdomain redirect: ANY request to `blog.yashkadam.com` → 308 permanent redirect to `https://yashkadam.com/blog`.
- **D-11:** Guard behind `VERCEL_ENV === 'production'` — do NOT match on Vercel preview URLs.
- **D-12:** Implementation: `proxy.ts` at project root (formerly `middleware.ts` — see Critical Finding below). Detect hostname from `request.headers.get('host')`, redirect on match.
- **D-13:** Blog post pages (`/blog/[slug]`) need individual `metadata` exports with `title`, `description`, OG fields using absolute URLs.

### Claude's Discretion

- Exact gradient/glow styling in the OG image (violet accent `#818cf8` recommended to match site)
- Whether `og-default.jpg` reuses existing `public/og.png` or needs a new file
- Font inside the OG `ImageResponse` (Geist or system-ui — whichever works with `next/og` font loading)
- Exact `changefreq` and `priority` values in the sitemap
- Whether to consolidate metadata generation into a helper in `lib/` or keep inline per page

### Deferred Ideas (OUT OF SCOPE)

- JSON-LD `WebSite` + `Person` schema — v2 requirement SEO-05
- JSON-LD `Article` schema on post pages — v2 requirement BLOG-06
- Table of contents for long posts — v2 requirement BLOG-05
- Dark mode toggle — Phase 5 (PLSH-01)
- Vercel Analytics — Phase 5 (ANLYT-01)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOG-03 | RSS feed at `/feed.xml` | Route Handler pattern, XML escaping rules, Content-Type header — all documented below |
| BLOG-04 | Dynamic OG image per blog post via `next/og` | `opengraph-image.tsx` file convention, ImageResponse API, font loading — all documented below |
| SEO-02 | Sitemap at `/sitemap.xml` including all pages and blog posts | `app/sitemap.ts` built-in, MetadataRoute.Sitemap API shape — documented below |
| SEO-03 | `robots.txt` — allow on prod, disallow on staging | `app/robots.ts` built-in, VERCEL_ENV conditional — documented below |
| SEO-04 | `middleware.ts` redirecting `blog.yashkadam.com → yashkadam.com/blog` (308) | Next.js 16 renamed `middleware.ts` to `proxy.ts` — critical finding documented below |
</phase_requirements>

---

## Summary

Phase 4 layers discoverability and social sharing on top of the Phase 3 blog infrastructure. All five deliverables (OG image, RSS feed, sitemap, robots.txt, subdomain redirect) use Next.js built-in file conventions or Route Handlers — zero additional packages are needed.

The most important finding is a **breaking change in Next.js 16**: `middleware.ts` has been deprecated and renamed to `proxy.ts`. The exported function must also be renamed from `middleware` to `proxy`. The old filename still works at runtime (both `MIDDLEWARE_FILENAME` and `PROXY_FILENAME` constants exist in 16.2.6 internals) but the convention is deprecated. Given this project is on Next.js 16.2.6, the new `proxy.ts` convention should be used to avoid future breakage.

The OG image route (`opengraph-image.tsx`) uses Next.js's file-based metadata convention: placing `opengraph-image.tsx` inside `app/blog/[slug]/` causes Next.js to auto-inject the correct `<meta property="og:image">` tags without any explicit metadata configuration in the page. The route receives `params` as a `Promise<{ slug: string }>` (Next.js 16 change), calls `getAllPosts()` to look up the post title, and returns an `ImageResponse`. Static generation is the default behavior — `generateStaticParams` should be exported from the `opengraph-image.tsx` file (or it inherits from the parent `page.tsx`'s `generateStaticParams`).

The `getAllPosts()` function from `lib/posts.ts` returns `PostMeta[]` with `slug`, `title`, `date`, `description`, `tags`, and `readingTime`. All fields needed for OG images, sitemap, and RSS are present. The function filters out unpublished posts (`published` frontmatter flag must be truthy) and returns them sorted newest-first.

**Primary recommendation:** Use `proxy.ts` (not `middleware.ts`), use `next/og`'s `ImageResponse` with a local font file or system-ui fallback, and use `NEXT_PUBLIC_SITE_URL` as the base URL everywhere.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| OG image generation | API / Backend (build-time SSG) | — | `ImageResponse` runs server-side at build; result is a static PNG per slug |
| RSS feed | API / Backend (Route Handler) | — | XML is generated server-side on request; no client involvement |
| Sitemap | API / Backend (build-time SSG) | — | `sitemap.ts` is a cached Route Handler, generated at build |
| robots.txt | API / Backend (build-time SSG) | — | `robots.ts` is a cached Route Handler; VERCEL_ENV read at build |
| Subdomain redirect | CDN / Proxy layer | — | `proxy.ts` runs at the network edge before any route renders |
| Blog post metadata | API / Backend (Server Component) | — | `generateMetadata()` runs server-side; result embedded in initial HTML |

---

## Standard Stack

No additional packages are required for this phase. All functionality uses Next.js 16 built-ins.

### Core (all built-in to Next.js 16)

| Feature | File Convention | API | Notes |
|---------|----------------|-----|-------|
| Dynamic OG image | `app/blog/[slug]/opengraph-image.tsx` | `ImageResponse` from `next/og` | File-based; auto-injects `<meta og:image>` |
| RSS feed | `app/feed.xml/route.ts` | Route Handler | Returns XML with `Content-Type: application/rss+xml` |
| Sitemap | `app/sitemap.ts` | `MetadataRoute.Sitemap` | Generates `/sitemap.xml` at build |
| robots.txt | `app/robots.ts` | `MetadataRoute.Robots` | Generates `/robots.txt` at build |
| Subdomain redirect | `proxy.ts` (project root) | `NextResponse.redirect`, `NextProxy` | Next.js 16 renamed from `middleware.ts` |

**Version verification:**
```bash
# next@16.2.6 installed — confirmed via node_modules
npm view next version  # => 16.2.6
```
[VERIFIED: npm registry] — next 16.2.6 installed in project

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Built-in `app/sitemap.ts` | `next-sitemap` package | No reason to add a package; built-in is simpler and zero-dependency |
| Built-in `app/robots.ts` | Static `public/robots.txt` file | Static file cannot be environment-aware (prod vs staging); built-in allows conditional logic |
| `next/og` ImageResponse | Vercel OG service / Cloudinary | External service creates network dependency; `next/og` is zero-dependency and statically generates at build |
| Plain string RSS template | `feed` npm package | Package adds weight; RSS 2.0 structure for this simple use case is ~25 lines of template string |

**Installation:** No new packages needed.

---

## Package Legitimacy Audit

No external packages are being installed in this phase. All five deliverables use Next.js built-ins (`next/og`, file conventions, Route Handlers).

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

---

## Architecture Patterns

### System Architecture Diagram

```
Browser / Social Bot
       |
       | GET /blog/[slug]  (or HEAD for OG scrape)
       v
  Next.js 16 (Vercel edge)
       |
       +-- proxy.ts ---------> hostname check
       |     |                 blog.yashkadam.com?
       |     |                 YES → 308 redirect to yashkadam.com/blog
       |     |                 NO  → pass through
       |
       +-- /sitemap.xml -----> app/sitemap.ts (cached Route Handler)
       |                       getAllPosts() → MetadataRoute.Sitemap array → XML
       |
       +-- /robots.txt ------> app/robots.ts (cached Route Handler)
       |                       VERCEL_ENV === 'production'? Allow : Disallow
       |
       +-- /feed.xml --------> app/feed.xml/route.ts (Route Handler)
       |                       getAllPosts() → RSS 2.0 XML string
       |
       +-- /blog/[slug] -----> page.tsx + opengraph-image.tsx
             |                 page.tsx: generateMetadata() adds og:title, og:description
             |                 opengraph-image.tsx: ImageResponse PNG (statically generated)
             |
             v
          getAllPosts() from lib/posts.ts
          (reads content/blog/*.mdx frontmatter)
```

### Recommended Project Structure (new files only)

```
app/
├── blog/
│   └── [slug]/
│       ├── page.tsx          # EXISTING — add generateMetadata() OG fields
│       └── opengraph-image.tsx  # NEW — ImageResponse for post OG
├── feed.xml/
│   └── route.ts              # NEW — RSS 2.0 Route Handler
├── sitemap.ts                # NEW — MetadataRoute.Sitemap
└── robots.ts                 # NEW — MetadataRoute.Robots
proxy.ts                      # NEW — subdomain redirect (project root)
```

### Pattern 1: File-Based OG Image with ImageResponse

**What:** Placing `opengraph-image.tsx` in a route segment makes Next.js auto-serve it as the OG image and inject `<meta property="og:image">` tags without any additional metadata config in the page.

**When to use:** Any route segment that needs a dynamic OG image.

**Key behavior:** `params` is a `Promise` in Next.js 16 (breaking change from v15). Must `await params` before using the slug.

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
// app/blog/[slug]/opengraph-image.tsx

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

**Note:** `system-ui` works without any font file loading. To use Geist, fetch the font file with `readFile` from `node:fs/promises` at `process.cwd() + '/node_modules/@vercel/fonts/...'` or bundle a `.ttf` in the `public/` folder. See Font Loading Pattern below.

### Pattern 2: robots.ts with Environment Awareness

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
// app/robots.ts

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

### Pattern 3: sitemap.ts with getAllPosts()

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
// app/sitemap.ts

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

### Pattern 4: RSS 2.0 Route Handler

```typescript
// Source: [ASSUMED — RSS 2.0 spec + Next.js Route Handler docs]
// app/feed.xml/route.ts

import { getAllPosts } from '@/lib/posts'
import { NextResponse } from 'next/server'

// XML-escape function — prevents malformed XML from titles/descriptions
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

### Pattern 5: proxy.ts Subdomain Redirect (Next.js 16)

**Critical:** In Next.js 16, the file is `proxy.ts` (not `middleware.ts`). The exported function is `proxy` (not `middleware`). Both filenames are recognized at runtime in 16.2.6, but `middleware.ts` is deprecated. [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/proxy]

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
// proxy.ts (project root — same level as app/)

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
    // Exclude static files and Next.js internals to avoid unnecessary processing
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
```

### Pattern 6: generateMetadata for Blog Post Pages

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/blog/[slug]/page.tsx — update existing generateMetadata

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

**Note:** Since `opengraph-image.tsx` is a file-based metadata convention, Next.js auto-injects `og:image` from it. The `generateMetadata` function does NOT need to include `openGraph.images` — the file convention takes precedence over and is merged with the function's return value. [VERIFIED: nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image]

### Anti-Patterns to Avoid

- **Using `middleware.ts` / exporting `middleware` function:** Deprecated in Next.js 16. Use `proxy.ts` and export `proxy`. Build warnings will appear with the old convention.
- **Omitting XML escaping in RSS feed:** A post title containing `&` or `<` will produce malformed XML that feed readers reject. Always run titles and descriptions through an escape function.
- **Absolute URL without NEXT_PUBLIC_SITE_URL:** Hard-coding `https://yashkadam.com` in multiple files creates divergence. Always read from `process.env.NEXT_PUBLIC_SITE_URL`.
- **Checking hostname with `request.nextUrl.hostname`:** This returns the Next.js app hostname (e.g. on Vercel it will be the deployment URL), NOT the original `Host` header. Use `request.headers.get('host')` to get what the browser sent.
- **Setting `runtime = 'edge'` in proxy.ts:** As of Next.js 16, Proxy defaults to Node.js runtime. Setting `runtime` config in a proxy file throws an error.
- **Duplicating `openGraph.images` in `generateMetadata` when `opengraph-image.tsx` exists:** The file-based convention auto-injects the image URL. Adding it again in `generateMetadata` creates duplicate `og:image` tags.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG image PNG generation | Canvas/sharp/Puppeteer render pipeline | `next/og` ImageResponse | Battle-tested, statically generated at build, zero runtime cost, already bundled in Next.js |
| Sitemap XML generation | Manual XML string with all required namespace declarations | `app/sitemap.ts` + MetadataRoute.Sitemap | Built-in handles XML namespaces, encoding, and `<lastmod>` formatting correctly |
| robots.txt serving | Static file or custom Route Handler | `app/robots.ts` | Built-in ensures correct Content-Type and cache headers |
| Hostname detection in proxy | Parse `request.url` directly | `request.headers.get('host')` | `request.url` in Next.js proxy is always the app's URL, not the original host |

**Key insight:** For a personal portfolio/blog with a small number of posts, all SEO deliverables are achievable with zero additional npm packages and minimal code — the hard work is already done by Next.js.

---

## Common Pitfalls

### Pitfall 1: `middleware.ts` deprecation in Next.js 16

**What goes wrong:** Creating `middleware.ts` with `export function middleware(...)` compiles and runs but generates deprecation warnings. Future Next.js upgrades will break it.
**Why it happens:** Next.js 16 renamed the file convention from `middleware` to `proxy` as part of a semantic rename to better describe its role.
**How to avoid:** Use `proxy.ts` at the project root; export a named function `proxy` (not `middleware`).
**Warning signs:** Build output shows `DeprecationWarning: middleware.ts is deprecated`; `next lint` may flag it.

### Pitfall 2: `params` is a Promise in Next.js 16

**What goes wrong:** Accessing `params.slug` directly (without `await`) returns `undefined` in Next.js 16.
**Why it happens:** Next.js 16 changed `params` to be an async-unwrapped Promise for all dynamic routes including `opengraph-image.tsx`.
**How to avoid:** Always `const { slug } = await params` — exactly as done in the existing `app/blog/[slug]/page.tsx`.
**Warning signs:** Post title renders as `undefined` in the OG image; no TypeScript error (the type is `Promise<{ slug: string }>`).

### Pitfall 3: Unescaped XML in RSS feed

**What goes wrong:** A post title like "React & TypeScript" produces `<title>React & TypeScript</title>` which is invalid XML. Feed validators reject the whole feed; RSS readers may silently skip items or crash.
**Why it happens:** XML requires `&` to be written as `&amp;`, `<` as `&lt;`, etc.
**How to avoid:** Run every user-provided string (title, description) through an `escapeXml()` helper before injecting into the template string. See Pattern 4 above.
**Warning signs:** W3C Feed Validator reports "not well-formed XML"; some RSS readers show no items.

### Pitfall 4: `request.nextUrl.hostname` vs `request.headers.get('host')` in proxy

**What goes wrong:** `request.nextUrl.hostname` returns the deployment URL (e.g. `your-app.vercel.app`), not `blog.yashkadam.com`. The hostname check never matches; the redirect never fires.
**Why it happens:** Next.js normalizes `request.nextUrl` to the internal deployment URL. The original `Host` header is preserved in `request.headers`.
**How to avoid:** Use `request.headers.get('host')` to read the original hostname.
**Warning signs:** Redirect works in local testing (where you control the Host header) but never fires on Vercel.

### Pitfall 5: OG image font loading failure in production

**What goes wrong:** Fetching a Google Fonts URL at build time fails in certain Vercel build environments due to network restrictions, causing the OG image to render with a fallback or throw.
**Why it happens:** Build-time image generation (`ImageResponse`) runs in a restricted Node.js environment on Vercel that may not have outbound network access.
**How to avoid:** Use `system-ui` font family (no loading required) OR bundle a `.ttf` font file locally and load it with `readFile(join(process.cwd(), 'public/fonts/Geist-Regular.ttf'))`. Do NOT fetch from Google Fonts CDN inside `ImageResponse`.
**Warning signs:** OG images render with wrong font or build fails with `ECONNREFUSED` on font fetch.

### Pitfall 6: Static asset double-processing in proxy

**What goes wrong:** Without a matcher, `proxy.ts` runs on every request including `/_next/static/...` CSS/JS files. On each asset request, the hostname check runs and returns `NextResponse.next()` — minor overhead but unnecessary.
**Why it happens:** Default matcher matches everything when no `config.matcher` is set.
**How to avoid:** Export `config.matcher` with a negative lookahead excluding `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt`. See Pattern 5 above.

### Pitfall 7: Missing `NEXT_PUBLIC_SITE_URL` produces wrong sitemap/RSS URLs

**What goes wrong:** Sitemap and RSS contain `undefined/blog/my-post` URLs.
**Why it happens:** `process.env.NEXT_PUBLIC_SITE_URL` is not set in local `.env.local` or is undefined in some environments.
**How to avoid:** Always provide a fallback: `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'`. Verify the env var is set in Vercel project settings (already done in Phase 1 per FOUND-06).

---

## Runtime State Inventory

Step 2.5: SKIPPED — this is a greenfield addition phase, not a rename/refactor/migration phase. No runtime state changes.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|---------|
| Node.js | All build-time generation | ✓ | v24.11.0 | — |
| next@16.2.6 | All five deliverables | ✓ | 16.2.6 | — |
| `NEXT_PUBLIC_SITE_URL` | sitemap, RSS, OG, metadata absolute URLs | ✓ (Phase 1 FOUND-06) | set to `https://yashkadam.com` | Hardcode fallback as safety net |
| `VERCEL_ENV` | robots.ts, proxy.ts | ✓ (Vercel auto-injects) | `production`/`preview`/`development` | Defaults to `undefined` locally — treated as non-prod |
| `content/blog/` directory | getAllPosts() (sitemap, RSS, OG) | ✓ (Phase 3 output) | — | existsSync guard already in getAllPosts() |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** `VERCEL_ENV` is undefined locally — both `robots.ts` and `proxy.ts` already handle this correctly (undefined !== 'production' → non-prod behavior).

---

## Code Examples

### OG Image — Reading a local font file (Geist alternative to system-ui)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image#using-nodejs-runtime-with-local-assets
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// In the Image() function body, before ImageResponse:
const geistData = await readFile(join(process.cwd(), 'public/fonts/Geist-Regular.ttf'))

return new ImageResponse(
  (<div>...</div>),
  {
    ...size,
    fonts: [{ name: 'Geist', data: geistData, style: 'normal', weight: 400 }],
  }
)
```

If Geist `.ttf` is not available locally, `system-ui` is the zero-effort default. The Geist npm package ships `.ttf` files but they are inside `node_modules/@vercel/fonts` (path varies) — confirm before using. [ASSUMED — exact path to Geist TTF inside node_modules not verified]

### MetadataRoute.Sitemap type (exact shape)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
  alternates?: { languages?: Record<string, string> }
}>
```

### MetadataRoute.Robots type (exact shape)

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
type Robots = {
  rules:
    | { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }
    | Array<{ userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }>
  sitemap?: string | string[]
  host?: string
}
```

### Feed validation — test locally

```bash
# After next build && next start:
curl -s http://localhost:3000/feed.xml | head -20
curl -s http://localhost:3000/sitemap.xml | head -20
curl -s http://localhost:3000/robots.txt
# OG image: open http://localhost:3000/blog/<slug>/opengraph-image in browser
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|-----------------|--------------|--------|
| `middleware.ts` / `export function middleware()` | `proxy.ts` / `export function proxy()` | Next.js 16.0.0 | **Must use new convention**; old file is deprecated |
| `params.slug` (direct access) | `const { slug } = await params` | Next.js 16.0.0 | params is now a Promise; old code throws |
| `import { ImageResponse } from 'next/og'` (separate package) | Same import, but bundled in Next.js | ~Next.js 13.3 | No separate install needed |
| Edge runtime for middleware | Node.js runtime for proxy | Next.js 16.0.0 | Proxy now defaults to Node.js; no `runtime = 'edge'` needed |
| `twitter:card` uses `twitter` field | Same — `metadata.twitter.card = 'summary_large_image'` | — | No change |

**Deprecated/outdated:**
- `middleware.ts` filename: deprecated since Next.js 16.0.0 — use `proxy.ts`
- `export function middleware()`: deprecated — use `export function proxy()`
- `runtime = 'edge'` in middleware/proxy files: throws error in Next.js 16

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `system-ui` font family renders acceptably in ImageResponse without any font loading | OG Image patterns | OG image may render with a fallback or different font on some platforms; fix by bundling a .ttf |
| A2 | Exact path to Geist `.ttf` inside `node_modules/@vercel/fonts` | Code Examples (Geist font alternative) | Font loading would fail at build; fallback to system-ui or copy .ttf to public/fonts/ |
| A3 | `VERCEL_ENV` is auto-injected by Vercel without manual configuration | Environment Availability | robots.ts and proxy.ts would incorrectly use non-prod rules on production; fix by setting VERCEL_ENV manually |

**Notes:**
- A3 is LOW risk: Vercel auto-injects `VERCEL_ENV` on all deployments — this is documented Vercel platform behavior. [CITED: vercel.com/docs/projects/environment-variables/system-environment-variables]
- A1 is LOW risk: `system-ui` is the explicit fallback built into satori (the rendering engine behind `next/og`).

---

## Open Questions

1. **Should `proxy.ts` use `middleware.ts` for backward compatibility?**
   - What we know: Next.js 16.2.6 recognizes both `MIDDLEWARE_FILENAME = 'middleware'` and `PROXY_FILENAME = 'proxy'` in its internal constants. The `middleware.ts` convention is marked as deprecated in the official docs.
   - What's unclear: Whether Vercel's build pipeline fully supports `proxy.ts` or whether there are edge cases in deployment.
   - Recommendation: Use `proxy.ts` with the `proxy` export to stay aligned with the current convention and avoid future breakage. The deprecation message confirms `middleware.ts` still works — so both are safe but `proxy.ts` is forward-compatible.

2. **Does `opengraph-image.tsx` inherit `generateStaticParams` from the parent `page.tsx`?**
   - What we know: The official docs show `opengraph-image.tsx` receiving `params` from the route. The parent `page.tsx` already exports `generateStaticParams()`.
   - What's unclear: Whether `opengraph-image.tsx` needs its own `generateStaticParams` or whether it inherits from the co-located `page.tsx`.
   - Recommendation: Export `generateStaticParams` from `opengraph-image.tsx` explicitly (mirrors what `page.tsx` does) to guarantee build-time generation. The overhead is one extra function call to `getAllPosts()`.

3. **Does the existing `public/og.png` (1200x630, 3.6KB) serve as the default fallback OG for non-post pages?**
   - What we know: The file exists at the correct dimensions. The root `app/layout.tsx` does not currently set a default `openGraph.images` — it only has `title` and `description`.
   - What's unclear: Whether the root layout's `metadata` needs to be updated with an absolute URL pointing to `og.png`.
   - Recommendation: Update `app/layout.tsx` metadata to add `openGraph: { images: [{ url: '/og.png', width: 1200, height: 630 }] }` with `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL)`. This is the cleanest approach per Next.js docs on `metadataBase`. [ASSUMED — not verified against current root layout metadata behavior]

---

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image` — ImageResponse file convention, exports (alt, size, contentType), params as Promise, static generation behavior [VERIFIED: official Next.js docs, version 16.2.6]
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap` — MetadataRoute.Sitemap exact type shape, `app/sitemap.ts` generates `/sitemap.xml` [VERIFIED: official Next.js docs, version 16.2.6]
- `https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots` — MetadataRoute.Robots type shape, conditional rules [VERIFIED: official Next.js docs, version 16.2.6]
- `https://nextjs.org/docs/app/api-reference/file-conventions/proxy` — proxy.ts file convention, Next.js 16 rename from middleware.ts, matcher config, NextResponse.redirect, hostname detection via request.headers [VERIFIED: official Next.js docs, version 16.2.6]
- `https://nextjs.org/docs/app/api-reference/functions/generate-metadata` — generateMetadata API, openGraph fields, twitter card fields, metadataBase, metadata merging behavior [VERIFIED: official Next.js docs, version 16.2.6]
- `/Users/yash/Personal/Portfolio/node_modules/next/dist/lib/constants.js` — confirmed both `MIDDLEWARE_FILENAME = 'middleware'` and `PROXY_FILENAME = 'proxy'` exist in 16.2.6 [VERIFIED: codebase grep]
- `lib/posts.ts` — confirmed PostMeta interface (slug, title, date, description, tags, readingTime), getAllPosts() API [VERIFIED: codebase]
- `public/og.png` — confirmed exists, 1200x630, 3.6KB [VERIFIED: codebase]

### Secondary (MEDIUM confidence)
- Version history tables in proxy.ts docs: `v16.0.0 — Middleware is deprecated and renamed to Proxy` [CITED: nextjs.org/docs/app/api-reference/file-conventions/proxy#version-history]

### Tertiary (LOW confidence)
- Geist `.ttf` path inside `node_modules/@vercel/fonts` — not verified in this session [ASSUMED]

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; all built-in Next.js 16 APIs verified against official docs
- Architecture: HIGH — file conventions and Route Handler patterns verified against official docs at version 16.2.6
- Pitfalls: HIGH — Next.js 16 breaking changes (params as Promise, middleware→proxy rename) verified via official docs and codebase inspection
- OG font loading: MEDIUM — system-ui is safe; Geist TTF path is assumed

**Research date:** 2026-05-25
**Valid until:** 2026-08-25 (stable Next.js APIs, 90-day estimate)
