---
phase: 04-seo-deployment
reviewed: 2026-05-25T00:00:00Z
depth: standard
files_reviewed: 7
files_reviewed_list:
  - app/blog/[slug]/opengraph-image.tsx
  - app/blog/[slug]/page.tsx
  - app/feed.xml/route.ts
  - app/layout.tsx
  - app/robots.ts
  - app/sitemap.ts
  - proxy.ts
findings:
  critical: 1
  warning: 4
  info: 3
  total: 8
status: issues_found
---

# Phase 04: Code Review Report

**Reviewed:** 2026-05-25T00:00:00Z
**Depth:** standard
**Files Reviewed:** 7
**Status:** issues_found

## Summary

Seven files implementing SEO, RSS feed, OG images, robots/sitemap generation, and a subdomain redirect were reviewed. The implementation is largely sound — XML escaping is present in the RSS feed, environment-based robots gating is thoughtful, and the OG image generation is clean. However, one critical defect will silently prevent the subdomain redirect from ever executing in production. Additionally, there are RSS spec compliance gaps, an unescaped URL in the feed, and a fragile platform-assumption in robots.txt generation.

---

## Critical Issues

### CR-01: `proxy.ts` is never executed — subdomain redirect is dead code

**File:** `proxy.ts:1-27`

**Issue:** Next.js Edge Middleware must live in a file named exactly `middleware.ts` (or `middleware.js`) at the project root. The file is named `proxy.ts` and is never imported by any other module. The `config` matcher export on lines 21-26 is also only meaningful inside the recognized middleware file. As a result, requests to `blog.yashkadam.com` will never be redirected — they will resolve to a 404 or the default Next.js error page in production. The feature is entirely non-functional.

**Fix:** Rename `proxy.ts` to `middleware.ts` at the project root. Next.js will then automatically pick up the exported `middleware` function. Rename the exported function from `proxy` to `middleware` to match the required export name:

```typescript
// middleware.ts  (renamed from proxy.ts)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {  // must be named 'middleware'
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

---

## Warnings

### WR-01: RSS feed `<link>` elements are not XML-escaped

**File:** `app/feed.xml/route.ts:22` and `33`

**Issue:** The per-item `<link>` (line 22) and channel-level `<link>` (line 33) insert the URL string directly into XML without escaping. The `escapeXml` helper is only applied to `title` and `description`. If `siteUrl` ever contains an ampersand (e.g., a staging URL with query parameters) or if `post.slug` contains `&` or `<`, the resulting XML will be malformed and feed readers will reject or silently break the feed. The slug comes from a filesystem filename, which is attacker-controlled on any system where file creation is possible.

**Fix:** Apply `escapeXml` to every URL inserted into the XML body:

```typescript
const items = posts
  .map(
    (post) => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${escapeXml(`${siteUrl}/blog/${post.slug}`)}</link>
    <guid isPermaLink="true">${escapeXml(`${siteUrl}/blog/${post.slug}`)}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.description)}</description>
  </item>`,
  )
  .join('')

const xml = `...
  <channel>
    <title>Yash Kadam</title>
    <link>${escapeXml(`${siteUrl}/blog`)}</link>
    ...`
```

### WR-02: RSS feed items are missing `<guid>` — feed readers cannot deduplicate

**File:** `app/feed.xml/route.ts:19-26`

**Issue:** The RSS 2.0 spec requires a `<guid>` element per item. Without it, feed readers (Feedly, NetNewsWire, etc.) cannot tell whether a re-fetched item has already been read. Any edit to a post title or description causes the item to appear as a new unread entry in every subscriber's feed reader.

**Fix:** Add a `<guid isPermaLink="true">` to each item (see WR-01 fix above for combined snippet).

### WR-03: `robots.ts` uses `VERCEL_ENV` to gate crawlers — breaks non-Vercel production deployments

**File:** `app/robots.ts:5`

**Issue:** `isProd` is derived exclusively from `VERCEL_ENV === 'production'`. This environment variable is only injected by the Vercel platform. If the site is ever built and deployed outside of Vercel (CI/CD preview runners, Docker-based production hosting, self-hosted), `VERCEL_ENV` will be undefined, `isProd` will be `false`, and `robots.txt` will disallow all crawlers — silently de-indexing the live site from search engines with no error or warning.

**Fix:** Use `NODE_ENV` as the primary signal, or introduce an explicit `ROBOTS_ALLOW` env var, and fall back to allow rather than block:

```typescript
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'
  // Allow crawling unless explicitly running in a non-production Vercel environment
  const isVercelPreview = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development'

  return {
    rules: {
      userAgent: '*',
      allow: isVercelPreview ? undefined : '/',
      disallow: isVercelPreview ? '/' : undefined,
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

### WR-04: `app/blog/[slug]/page.tsx` — `Post` variable is potentially uninitialized at the call site

**File:** `app/blog/[slug]/page.tsx:52-73`

**Issue:** `Post` is declared with `let` on line 52 and assigned only inside the `try` block (line 56). The `catch` calls `notFound()`, which returns the `never` type in Next.js 13+, so TypeScript's control flow analysis should narrow correctly. However, the type annotation `React.ComponentType<any>` is given without `| undefined`, and the `// eslint-disable-next-line @typescript-eslint/no-explicit-any` suppression on line 51 masks this. If a future version of Next.js changes `notFound()`'s return type signature, or if the TypeScript config changes, `Post` could be used uninitalized and render as `undefined`, producing a cryptic runtime error. The `any` suppression also bypasses type-checking for the component props.

**Fix:** Use a definite assignment or a narrowing pattern that does not rely on `notFound()` being typed as `never`:

```typescript
const module = await import(`@/content/blog/${slug}.mdx`).catch(() => {
  notFound()
})
// At this point module could technically be undefined if notFound() return type changes,
// but the explicit cast makes intent clear:
const Post = (module as { default: React.ComponentType }).default
```

Or more robustly:

```typescript
let PostModule: { default: React.ComponentType }
try {
  PostModule = await import(`@/content/blog/${slug}.mdx`)
} catch {
  notFound()
}
// TypeScript understands Post is assigned here because notFound() is `never`
return (
  <>
    ...
    <PostModule.default />
  </>
)
```

---

## Info

### IN-01: `getAllPosts()` is called multiple times per build — no memoization

**File:** `app/blog/[slug]/opengraph-image.tsx:8-18` and `app/blog/[slug]/page.tsx:7-18`

**Issue:** `getAllPosts()` performs synchronous filesystem I/O (`readdirSync` + `readFileSync` per post) every time it is called. In both the OG image file and the page file, `generateStaticParams` calls it once and the render function calls it again. At build time with N posts, this multiplies the disk reads. There is no module-level cache.

**Fix:** Memoize with a module-level variable in `lib/posts.ts`:

```typescript
let _cachedPosts: PostMeta[] | null = null

export function getAllPosts(): PostMeta[] {
  if (_cachedPosts) return _cachedPosts
  // ... existing logic ...
  _cachedPosts = result
  return _cachedPosts
}
```

### IN-02: `app/page.tsx` uses `NEXT_PUBLIC_SITE_URL` without a fallback for OG image URLs

**File:** `app/page.tsx:20,32` (out of direct review scope, but directly related to the SEO phase)

**Issue:** `app/page.tsx` constructs OG and Twitter image URLs as `` `${process.env.NEXT_PUBLIC_SITE_URL}/og.png` `` without a `?? 'https://yashkadam.com'` fallback. If `NEXT_PUBLIC_SITE_URL` is undefined at build time, the metadata will contain the literal string `undefined/og.png`, which is an invalid URL that will cause broken OG previews silently.

**Fix:** Apply the same fallback pattern used in the other SEO files:

```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'
// then use `${siteUrl}/og.png`
```

### IN-03: `app/layout.tsx` uses `dangerouslySetInnerHTML` for FOUC prevention script

**File:** `app/layout.tsx:44-47`

**Issue:** The use of `dangerouslySetInnerHTML` is documented with a comment explaining there is no XSS risk because the content is a static string constant. This is accurate for the current value `"document.documentElement.classList.add('dark')"`. However, the pattern is fragile — a future maintainer who changes the string to include a dynamic value (e.g., from a theme config or user preference cookie) could introduce an XSS vulnerability without realizing the danger flag is already in place and was previously considered safe. This is a maintainability risk.

**Fix:** The comment is good, but consider converting to a `<Script>` component with `strategy="beforeInteractive"` from `next/script` for consistency. Alternatively, the comment warning should be kept and ideally a `// DO NOT make this value dynamic` note added for future maintainers.

---

_Reviewed: 2026-05-25T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
