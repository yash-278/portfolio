# Phase 4: SEO & Deployment - Context

**Gathered:** 2026-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Add everything required for discoverability and shareability: dynamic OG images per blog post via `next/og`, sitemap at `/sitemap.xml`, `robots.txt` with prod/staging awareness, RSS feed at `/feed.xml`, and `middleware.ts` redirecting `blog.yashkadam.com` → `yashkadam.com/blog` with a 308 permanent redirect. Phase 3 infrastructure (`lib/posts.ts`, MDX pipeline, blog pages) is already in place — this phase layers discovery and social-sharing on top without touching the content pipeline.

</domain>

<decisions>
## Implementation Decisions

### OG Image (BLOG-04)
- **D-01:** Background style: **dark card with subtle gradient** — deep background (`#0a0a0a` / `#111`), faint violet gradient wash or glowing edge. Matches the site's dark polished aesthetic.
- **D-02:** Image content: **post title + site name (`yashkadam.com`) only**. Large post title as the main hook; site name as a subdued footer or subtitle. No avatar, no tags.
- **D-03:** Fallback OG: **a static default OG image in `/public/`** for all non-post pages (home, `/blog` index). The Phase 2 home OG image already exists — reuse it or create one generic `og-default.jpg` as the fallback.
- **D-04:** Implementation: `app/blog/[slug]/opengraph-image.tsx` using `next/og` (ImageResponse). Calls `getPostBySlug()` or `getAllPosts()` to get the post title. Route is statically generated per slug via `generateStaticParams`.

### RSS Feed (BLOG-03)
- **D-05:** RSS item content: **description-only** — each `<item>` contains `<title>`, `<link>`, `<pubDate>`, and the frontmatter `description`. No full HTML body.
- **D-06:** Implementation: `app/feed.xml/route.ts` as a Next.js Route Handler. Calls `getAllPosts()`, builds RSS 2.0 XML string, returns with `Content-Type: application/rss+xml`.
- **D-07:** No extra RSS library (e.g., `feed` package) — plain string template is sufficient for the simple structure needed.

### Sitemap (SEO-02)
- **D-08:** **Next.js built-in `app/sitemap.ts`** — zero extra dependencies. Export a default function that calls `getAllPosts()` and returns a `MetadataRoute.Sitemap` array. Includes `/`, `/blog`, and one entry per published post slug with absolute `https://yashkadam.com/...` URLs.

### robots.txt (SEO-03)
- **D-09:** `app/robots.ts` — Next.js built-in. Returns `Allow: /` when `VERCEL_ENV === 'production'`; returns `Disallow: /` otherwise. No external package.

### Subdomain Redirect (SEO-04)
- **D-10:** **Always redirect to `yashkadam.com/blog`** regardless of path. Any request to `blog.yashkadam.com` (or `blog.yashkadam.com/anything`) → 308 permanent redirect to `https://yashkadam.com/blog`.
- **D-11:** Guard behind `VERCEL_ENV === 'production'` — do NOT match on Vercel preview URLs (noted in STATE.md as a known constraint). The middleware hostname check should be `blog.yashkadam.com` only.
- **D-12:** Implementation: `middleware.ts` at project root. Detect hostname from `request.headers.get('host')`, redirect on match.

### Metadata (SEO-01 — carried from Phase 2)
- **D-13:** Blog post pages (`/blog/[slug]`) need individual `metadata` exports with `title`, `description`, and OG fields using absolute URLs. The home page already has metadata from Phase 2. The `/blog` index page needs a generic metadata export if not already present.

### Claude's Discretion
- Exact gradient/glow styling in the OG image (violet accent recommended to match site, but exact values Claude's call)
- Whether `og-default.jpg` already exists from Phase 2 or needs to be generated anew
- Font used inside the OG `ImageResponse` (Geist or system-ui — whichever works with `next/og`'s font loading)
- Exact `changefreq` and `priority` values in the sitemap (standard defaults are fine)
- Whether to consolidate metadata generation into a helper in `lib/` or keep it inline per page

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §SEO & Deployment — SEO-01, SEO-02, SEO-03, SEO-04, BLOG-03, BLOG-04
- `.planning/ROADMAP.md` §Phase 4 — Goal + 5 Success Criteria that gate Phase 4 completion
- `.planning/PROJECT.md` §Constraints — `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` (absolute URL base for all OG/sitemap/RSS hrefs)

### Phase 1–3 Foundation (build on top of, do not break)
- `.planning/phases/01-foundation/01-CONTEXT.md` — dark-only mode, LazyMotion pattern
- `.planning/phases/02-portfolio-page/02-CONTEXT.md` — design direction, Geist fonts, accent color (#818cf8)
- `.planning/phases/03-blog-infrastructure/03-CONTEXT.md` — frontmatter schema (D-01 through D-12), `getAllPosts()` API, blog sub-layout
- `app/layout.tsx` — Root layout (FOUC script, LazyMotion, Navbar, Footer) — do NOT break
- `next.config.mjs` — MDX config with `mdxRs: false` — do not touch unless required

### Existing Blog Infrastructure (read before implementing)
- `lib/posts.ts` — `getAllPosts()` returns `PostMeta[]` (slug, title, date, description, tags, readingTime) — Phase 4 consumes this directly
- `app/blog/page.tsx` — Blog index (Phase 3 output) — may need metadata export added
- `app/blog/[slug]/page.tsx` — Post detail page (Phase 3 output) — needs individual metadata + OG wiring

### Technical Constraints (from STATE.md)
- `middleware.ts` subdomain redirect MUST guard behind `VERCEL_ENV === 'production'` — prevents matching Vercel preview URLs
- `NEXT_PUBLIC_SITE_URL` env var is the source of truth for the site's base URL — use it everywhere absolute URLs appear (sitemap, RSS, OG)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/posts.ts` — `getAllPosts()` is the only data source needed; all Phase 4 features call it for post slugs, titles, dates, and descriptions
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge) — available if needed for OG component styling
- `app/blog/[slug]/page.tsx` — already has `generateStaticParams()` from Phase 3 — OG image route handler can mirror the same pattern

### Established Patterns
- All new files are Server Components / Route Handlers — no `'use client'` needed for any Phase 4 output
- `NEXT_PUBLIC_SITE_URL` is available in all server code and route handlers
- Dark-only: OG image should match dark aesthetic (`#0a0a0a`/`#111` background with Geist or similar sans-serif)
- `next/og` (`ImageResponse`) is the chosen OG image generation approach — no external image service

### Integration Points
- `app/blog/[slug]/opengraph-image.tsx` — new file; Next.js file-based OG image for post pages
- `app/sitemap.ts` — new file; Next.js built-in sitemap generation
- `app/robots.ts` — new file; Next.js built-in robots.txt generation
- `app/feed.xml/route.ts` — new Route Handler; returns RSS 2.0 XML
- `middleware.ts` — new file at project root; handles subdomain redirect

</code_context>

<specifics>
## Specific Ideas

- **OG image route:** `app/blog/[slug]/opengraph-image.tsx` — Next.js picks this up automatically as the OG image for `/blog/[slug]` pages. Export `generateImageMetadata` + default function returning `ImageResponse`.
- **RSS XML structure:** RSS 2.0 with channel-level `<title>Yash Kadam</title>`, `<link>https://yashkadam.com/blog</link>`, `<description>`, and one `<item>` per post with `<title>`, `<link>`, `<pubDate>`, `<description>` (frontmatter description). Serve at `/feed.xml`.
- **Middleware hostname detection:** `request.headers.get('host')` or `request.nextUrl.hostname` — check for `blog.yashkadam.com`, redirect to `https://yashkadam.com/blog` with status 308.
- **Sitemap absolute URLs:** Build from `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}` for post entries.
- **robots.ts prod check:** `process.env.VERCEL_ENV === 'production'` → `Allow: /`; else → `Disallow: /`.

</specifics>

<deferred>
## Deferred Ideas

- JSON-LD `WebSite` + `Person` schema — v2 requirement SEO-05, future milestone
- JSON-LD `Article` schema on post pages — v2 requirement BLOG-06
- Table of contents for long posts — v2 requirement BLOG-05
- Dark mode toggle — Phase 5 (PLSH-01)
- Vercel Analytics — Phase 5 (ANLYT-01)

</deferred>

---

*Phase: 4-SEO & Deployment*
*Context gathered: 2026-05-25*
