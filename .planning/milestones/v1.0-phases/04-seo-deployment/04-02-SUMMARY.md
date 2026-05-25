---
phase: 04-seo-deployment
plan: 02
subsystem: infra
tags: [seo, sitemap, robots, rss, next.js, xml, route-handler]

# Dependency graph
requires:
  - phase: 03-blog-infrastructure
    provides: getAllPosts() from lib/posts.ts returning PostMeta[] with slug, title, date, description fields

provides:
  - app/sitemap.ts generating /sitemap.xml with absolute URLs for /, /blog, and all published post slugs
  - app/robots.ts generating /robots.txt with allow on production (VERCEL_ENV=production) and disallow elsewhere
  - app/feed.xml/route.ts serving RSS 2.0 feed with XML-escaped post items

affects: [04-seo-deployment, vercel-deployment, search-engine-indexing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "MetadataRoute.Sitemap — Next.js built-in sitemap export pattern with static + dynamic pages"
    - "MetadataRoute.Robots — Next.js built-in robots.txt with environment-aware allow/disallow via VERCEL_ENV"
    - "RSS Route Handler — plain GET() using NextResponse with application/rss+xml Content-Type"
    - "escapeXml helper — mandatory for all user-controlled strings before XML injection"

key-files:
  created:
    - app/sitemap.ts
    - app/robots.ts
    - app/feed.xml/route.ts
  modified: []

key-decisions:
  - "Used Next.js built-in MetadataRoute for sitemap and robots.txt — zero extra dependencies, native SSG output"
  - "VERCEL_ENV=production is the production gate for robots.ts — undefined locally correctly defaults to disallow"
  - "RSS feed uses plain Route Handler (GET export) not a library — full control of XML output, no npm dependency"
  - "escapeXml applied to both post.title and post.description — both are frontmatter strings that can contain &, <, >"
  - "NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com' fallback on all three files — works locally without .env.local"

patterns-established:
  - "Pattern: All absolute URLs use process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yashkadam.com'"
  - "Pattern: XML Route Handlers must escape all user-controlled string fields via escapeXml before injection"
  - "Pattern: Environment-aware server behavior uses process.env.VERCEL_ENV === 'production' check"

requirements-completed: [BLOG-03, SEO-02, SEO-03]

# Metrics
duration: 8min
completed: 2026-05-25
---

# Phase 04 Plan 02: Sitemap, Robots, and RSS Feed Summary

**Next.js built-in sitemap.ts and robots.ts plus a custom RSS 2.0 Route Handler at /feed.xml with XML-escaping for all post fields**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-05-25T09:39:00Z
- **Completed:** 2026-05-25T09:47:22Z
- **Tasks:** 2
- **Files modified:** 3 created

## Accomplishments
- Created `app/sitemap.ts` returning MetadataRoute.Sitemap with `/`, `/blog`, and one entry per published post slug from `getAllPosts()`
- Created `app/robots.ts` with environment-aware allow/disallow — production gets `Allow: /`, all other environments get `Disallow: /`
- Created `app/feed.xml/route.ts` with GET export, `escapeXml()` helper covering `&`, `<`, `>`, `"`, `'`, and RSS 2.0 channel with `application/rss+xml` Content-Type
- `npm run build` succeeds — `/feed.xml`, `/robots.txt`, and `/sitemap.xml` all appear in the build output

## Task Commits

Each task was committed atomically:

1. **Task 1: Create app/sitemap.ts and app/robots.ts** - `3a2e357` (feat)
2. **Task 2: Create app/feed.xml/route.ts — RSS 2.0 Route Handler** - `a883144` (feat)

## Files Created/Modified
- `app/sitemap.ts` — MetadataRoute.Sitemap with static pages and post slug entries via getAllPosts()
- `app/robots.ts` — Environment-aware robots.txt using VERCEL_ENV for production gate
- `app/feed.xml/route.ts` — RSS 2.0 GET Route Handler with escapeXml helper and application/rss+xml Content-Type

## Decisions Made
- Used Next.js built-in `MetadataRoute` types for sitemap and robots — no additional npm packages needed
- Chose a plain Route Handler for the RSS feed rather than a library (feed, rss, etc.) for zero runtime dependency and full XML control
- `escapeXml` is a private helper in `route.ts` — not exported, not shared — keeps the file self-contained
- `VERCEL_ENV === 'production'` is the correct gate for robots.ts; `undefined !== 'production'` safely defaults to disallow in local/staging environments

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build produced a warning about `metadataBase` not being set in the root layout — this is a pre-existing issue outside the scope of this plan (addressed in Plan 01 which handles metadata and OG tag updates).

## User Setup Required

None - no external service configuration required. All three routes are generated from code with no environment variables required locally (NEXT_PUBLIC_SITE_URL and VERCEL_ENV are only needed at Vercel deployment time).

## Threat Surface Scan

No new trust boundaries introduced beyond those documented in the plan's threat model:
- T-04-03 (Tampering via RSS XML output): Mitigated — escapeXml applied to both `post.title` and `post.description`
- T-04-04 (Information Disclosure on staging): Mitigated — VERCEL_ENV check confirmed present in `app/robots.ts`

## Known Stubs

None - all three files are fully wired to live data via `getAllPosts()`.

## Next Phase Readiness
- `/sitemap.xml`, `/robots.txt`, and `/feed.xml` are production-ready and will work immediately on Vercel deployment
- Plan 01 (OG images and metadata) and Plan 03 (proxy/subdomain redirect) can proceed independently — no shared file ownership
- All three new files are zero-dependency additions that do not affect any existing component or page

---
*Phase: 04-seo-deployment*
*Completed: 2026-05-25*
