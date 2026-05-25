---
phase: 04-seo-deployment
plan: 01
subsystem: seo
tags: [next.js, opengraph, twitter-cards, metadata, og-image, seo, static-generation]

# Dependency graph
requires:
  - phase: 03-blog-infrastructure
    provides: getAllPosts() from lib/posts.ts, PostMeta interface, app/blog/[slug]/page.tsx with generateStaticParams
provides:
  - metadataBase in root layout enabling relative OG URL resolution for all pages
  - Per-post openGraph metadata (title, description, url, type: article, publishedTime) in generateMetadata
  - twitter: { card: summary_large_image } on blog post pages
  - Dynamic branded OG image PNG (1200x630) per blog post slug via Next.js file convention
  - Static generation of /blog/[slug]/opengraph-image at build time
affects: [04-02-PLAN.md, 04-03-PLAN.md, social-sharing, vercel-deployment]

# Tech tracking
tech-stack:
  added: [next/og ImageResponse]
  patterns:
    - Next.js file-based OG image convention (opengraph-image.tsx co-located in route segment)
    - params as Promise<{ slug: string }> with const { slug } = await params (Next.js 16 breaking change)
    - metadataBase with NEXT_PUBLIC_SITE_URL ?? fallback for all OG URL resolution
    - No openGraph.images in generateMetadata when opengraph-image.tsx co-exists (avoids duplicate og:image)
    - system-ui font in ImageResponse (avoids Vercel build-time Google Fonts network restriction)

key-files:
  created:
    - app/blog/[slug]/opengraph-image.tsx
  modified:
    - app/layout.tsx
    - app/blog/[slug]/page.tsx

key-decisions:
  - "Omit openGraph.images from generateMetadata — co-located opengraph-image.tsx auto-injects og:image tag, adding both produces duplicate og:image tags"
  - "Use system-ui font in ImageResponse instead of Google Fonts CDN — Vercel build-time network restriction blocks CDN fetches inside ImageResponse"
  - "metadataBase uses NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com' fallback — env var confirmed set in Vercel (FOUND-06) but absent locally without .env.local"
  - "No runtime = edge on any file — throws error in Next.js 16"

patterns-established:
  - "Pattern: opengraph-image.tsx uses same params: Promise<{ slug: string }> + await params pattern as page.tsx"
  - "Pattern: generateStaticParams in opengraph-image.tsx mirrors page.tsx exactly — same function, same return shape"
  - "Pattern: siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com' for all absolute URL construction"

requirements-completed: [BLOG-04, SEO-01]

# Metrics
duration: 12min
completed: 2026-05-25
---

# Phase 4 Plan 01: Blog OG Image & Metadata Summary

**Dynamic branded OG image per blog post via next/og ImageResponse with dark gradient design, plus per-post openGraph/twitter metadata and root layout metadataBase for correct relative URL resolution**

## Performance

- **Duration:** 12 min
- **Started:** 2026-05-25T08:35:00Z
- **Completed:** 2026-05-25T08:47:00Z
- **Tasks:** 2
- **Files modified:** 3 (2 modified, 1 created)

## Accomplishments
- Root layout now has `metadataBase` so relative `/og.png` resolves to `https://yashkadam.com/og.png` on all non-post pages
- Blog post pages emit full social sharing metadata: `og:title`, `og:description`, `og:url`, `og:type=article`, `og:article:published_time`, `twitter:card=summary_large_image`
- `opengraph-image.tsx` generates a unique branded PNG (1200x630) per post slug at build time — confirmed in build output as SSG route `/blog/building-nekomori/opengraph-image`
- TypeScript type check passes with zero errors; `npm run build` exits 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Add metadataBase to root layout and OG fields to blog post metadata** - `95804c0` (feat)
2. **Task 2: Create opengraph-image.tsx — dynamic branded OG image per blog post** - `e6570e6` (feat)

**Plan metadata:** (see final commit)

## Files Created/Modified
- `app/layout.tsx` - Added metadataBase pointing to NEXT_PUBLIC_SITE_URL with yashkadam.com fallback, added openGraph.images fallback to /og.png for non-post pages
- `app/blog/[slug]/page.tsx` - Expanded generateMetadata to return full openGraph (type: article, publishedTime) and twitter (card: summary_large_image) metadata
- `app/blog/[slug]/opengraph-image.tsx` - New file: Next.js file-based OG image with generateStaticParams, alt, size (1200x630), contentType (image/png), default Image function with dark gradient design

## Decisions Made
- **No openGraph.images in generateMetadata:** Co-located `opengraph-image.tsx` auto-injects `og:image` via Next.js file convention — adding it in both places produces duplicate `og:image` tags
- **system-ui font only:** Vercel's build-time network restriction blocks Google Fonts CDN fetches inside ImageResponse; system-ui has zero loading overhead
- **No runtime = 'edge':** Removed from consideration — Next.js 16 throws errors on edge runtime in OG image files
- **Await params pattern:** Next.js 16 changed params to a Promise; `const { slug } = await params` pattern mirrors what page.tsx already does

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. NEXT_PUBLIC_SITE_URL is already set in Vercel (FOUND-06 from Phase 1).

## Known Stubs
None.

## Threat Flags
None. Threat mitigations applied as specified:
- T-04-02 (metadataBase URL): `process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'` fallback applied in both app/layout.tsx and app/blog/[slug]/page.tsx — `undefined` metadataBase prevented.

## Next Phase Readiness
- Plan 01 complete: OG image generation and blog post social metadata are wired
- Plan 02 (sitemap + robots + RSS) can proceed — depends on getAllPosts() which is stable
- Plan 03 (subdomain redirect via proxy.ts) can proceed — independent of Plans 01 and 02
- Build passes: all static generation routes confirmed in output

---
*Phase: 04-seo-deployment*
*Completed: 2026-05-25*
