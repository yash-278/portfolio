# Project Research Summary

**Project:** Yash Kadam — Personal Portfolio + MDX Blog
**Domain:** Personal developer portfolio with in-repo MDX blog
**Researched:** 2026-05-24
**Confidence:** HIGH

---

## Executive Summary

This is a developer credibility site, not a product app. The architectural pattern is well-established: a hybrid single-page portfolio (`/`) plus a separate blog route tree (`/blog`, `/blog/[slug]`), both in one Next.js App Router codebase, fully statically generated and deployed to Vercel. The entire content model lives in-repo as MDX files — no CMS, no external API, no server-side state. This is the correct scope for the stated goal: a visitor should leave knowing who Yash is, what he has built, and how to reach him in under 60 seconds.

The recommended approach is Next.js 16.2.6 (upgrade from the v2 branch's 14.2.4), App Router, `@next/mdx` for the MDX pipeline, `rehype-pretty-code` for build-time syntax highlighting, and `framer-motion` (already installed) with the `LazyMotion` pattern. All content is statically generated — no ISR, no API routes, no client-side fetching. The v2 branch is the correct starting point; migration cost from Next.js 14 is near zero given the limited existing code. The most important early decision is picking `@next/mdx` specifically: both primary alternatives are dead (`next-mdx-remote` was archived by Hashicorp in February 2026; `contentlayer` was abandoned in June 2023).

The key risks are infrastructure risks, not product risks. Dark mode FOUC must be solved in Phase 1 with an inline blocking script — doing it later causes visible rework. Framer Motion must be wrapped in `LazyMotion` with isolated Client Component leaves from the start, or the animation bundle infects every page. OG image URLs must be absolute from day one (Next.js accepts relative URLs silently, social crawlers reject them silently). The subdomain redirect (`blog.yashkadam.com`) requires Next.js middleware, not the Vercel dashboard. None of these risks are blocking — all have clear, well-documented solutions.

---

## Key Findings

### Recommended Stack

The stack is largely determined by the v2 branch's starting point. The meaningful decisions are the upgrade to Next.js 16 and the MDX pipeline choice. Next.js 16.2.6 is the current stable release (Oct 2025), brings Turbopack as the default bundler (2-5x faster builds), React 19.2 built-in, and an improved caching model. The version bump from 14 to 16 is low-risk because the v2 branch only has a hero component.

`@next/mdx` is the only viable MDX choice for a new project in May 2026. It runs at build time, produces React Server Components (zero client JS), and integrates natively with App Router file-system routing. The frontmatter trade-off (no native YAML parsing) is solved by using `gray-matter` in `lib/posts.ts` for the blog index and exporting a named `metadata` constant from individual MDX files for post-level Next.js metadata.

**Core technologies:**

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | Framework — App Router, SSG, image optimization, OG, metadata API |
| `react` / `react-dom` | 19.2.x | Ships with Next.js 16; no separate version decision |
| `typescript` | 5.x (>=5.1) | Required by Next.js 16; already in v2 |
| `@next/mdx` | Matches Next.js | MDX compilation to RSC at build time; only viable MDX option |
| `@mdx-js/loader` + `@mdx-js/react` | latest | Required peer deps for `@next/mdx` |
| `remark-gfm` | 4.0.1 | GFM syntax (tables, task lists, strikethrough) in MDX |
| `gray-matter` | 4.0.3 | Frontmatter parsing for blog index page (file-system reads) |
| `rehype-pretty-code` | 0.14.3 | Build-time syntax highlighting via Shiki — zero client JS |
| `shiki` | 4.1.0 | TextMate grammar engine; peer dep of rehype-pretty-code |
| `@tailwindcss/typography` | 0.5.19 | Prose styles for MDX-rendered HTML (`prose` class) |
| `framer-motion` | 12.40.0 | Animations; already installed; use `LazyMotion` + `domAnimation` |
| `tailwindcss` | 3.4.1 (defer v4) | Already in v2; defer Tailwind v4 upgrade to avoid config migration friction |
| `shadcn/ui` CLI 2.9.0 | source-only | Accessible component primitives; not a runtime dep |
| `next/font/google` | built-in | Self-hosted fonts, zero CLS, no external DNS lookup |
| `next/og` (`ImageResponse`) | built-in | Dynamic OG images per blog post; static PNG for homepage |

**Do not use:**
- `next-mdx-remote` — archived February 2026
- `contentlayer` / `contentlayer2` — abandoned June 2023
- `highlight.js` / `Prism.js` — client-side syntax highlighting; use `rehype-pretty-code` instead
- `output: 'export'` — breaks `generateMetadata` for blog posts; use Vercel's default build
- MDX Rust compiler (`mdxRs: true`) — does not support rehype plugins with function options

### Expected Features

**Must have (table stakes):**
- Hero with name, title, one-line pitch
- About section with current role (Technical Lead, KingsleyGate) and career arc
- Work history with current role prominent
- Projects section — Nekomori and Brew Index with tech stack tags, live link, source link
- Contact section — email, LinkedIn, GitHub, Twitter
- Blog post list at `/blog` (date, title, description; newest first)
- Blog individual posts with readable typography (`@tailwindcss/typography` prose)
- Syntax highlighting on code blocks (rehype-pretty-code)
- SEO fundamentals: `metadata` on all pages, OG images, favicon, canonical URLs
- Fast initial load (all pages SSG; no heavy client bundles)
- Clean URLs (`/blog/post-slug` not `/blog?id=123`)

**Should have (differentiators):**
- Reading time estimate on blog posts — `reading-time` npm package at build time
- Dynamic OG image per blog post — each shared link looks unique and branded
- RSS feed at `/feed.xml` — discovery mechanism for developer audiences
- Subtle scroll-driven entrance animations (Framer Motion `whileInView`) — opacity + Y translate only
- Sitemap at `/sitemap.xml` via `app/sitemap.ts` — programmatic, includes all blog posts
- robots.txt via `app/robots.ts` — environment-guarded (disallow on staging, allow on prod)
- "Built with" footer line — technical transparency for dev audience
- Skills shown as tech stack tags on project cards — not a separate skills section with bars or grids

**Defer to v2+:**
- Table of contents (only valuable with 3+ long-form posts)
- JSON-LD schema (add after blog has posts and indexing matters)
- Project case study write-ups `/projects/[slug]` (add after projects are more mature)
- Tailwind v4 upgrade (focused one-sprint effort; not during greenfield build)
- Dark mode toggle — implement system preference detection when design is locked; the FOUC prevention infrastructure (inline blocking script) must be in Phase 1 regardless

**Eliminate permanently (anti-features):**
- Animated skill progress bars — meaningless numbers; signals junior thinking; replace with tech tags on project cards
- Typing/typewriter animation in hero — cliche; slows the 3-second read window; use static confident text
- Preloader/loading screen — adds perceived latency on a statically generated site
- Contact form with server handling — requires backend; spam-prone; use direct email link
- Full-screen particle.js or tsparticles background — heavy JS, degrades Core Web Vitals
- Custom cursor — breaks accessibility; invests time in wrong place
- Skills grid of 20+ technology logos without project context

### Architecture Approach

The architecture is a hybrid: one scrolling page for the portfolio, a separate route tree for the blog, unified under one Next.js App Router codebase with a shared root layout. Portfolio content (projects, work history) lives in `lib/data.ts` as typed TypeScript constants. Blog content lives in `content/blog/*.mdx` files parsed at build time by `lib/posts.ts` using `gray-matter`. No API routes are needed. All pages use SSG. `generateStaticParams` in `app/blog/[slug]/page.tsx` enumerates all slugs from the filesystem at build time. Adding a new blog post means committing a new MDX file and pushing — Vercel auto-deploys and rebuilds.

**Key directory decisions:**
```
app/
  layout.tsx              — root layout, fonts, dark mode script
  page.tsx                — portfolio home (imports all sections)
  blog/
    layout.tsx            — prose wrapper (@tailwindcss/typography)
    page.tsx              — blog index (reads frontmatter via lib/posts.ts)
    [slug]/
      page.tsx            — SSG post (dynamic MDX import + generateStaticParams)
      opengraph-image.tsx — dynamic OG image via next/og ImageResponse

components/
  layout/                 — Navbar, Footer
  sections/               — Hero, About, WorkHistory, Projects, Contact
  blog/                   — PostCard, PostHeader
  ui/                     — Button, Badge, SectionWrapper (shadcn/ui primitives)

content/blog/*.mdx        — blog posts (git workflow)
lib/
  posts.ts                — getAllPosts(), getPostBySlug() — server-only
  data.ts                 — projects[], workHistory[] typed constants
  utils.ts                — cn(), formatDate(), readingTime()

mdx-components.tsx        — REQUIRED by @next/mdx; maps h1, img to next/image, pre
next.config.mjs           — MDX config, rehype plugins, subdomain redirects
```

**MDX pipeline:**
```
content/blog/post.mdx
  → @next/mdx webpack loader (build time)
      remark plugins: remark-gfm
      rehype plugins: rehype-slug, rehype-pretty-code (Shiki; build-time highlighting)
  → React Server Component module
  → app/blog/[slug]/page.tsx dynamic import
  → mdx-components.tsx element map (img → next/image)
  → app/blog/layout.tsx prose wrapper
  → Static HTML (zero client JS for content)
```

**Major components:**
1. `mdx-components.tsx` — Required file; maps `img` to `next/image`, wires syntax highlighting output. Must exist before any MDX import compiles.
2. `lib/posts.ts` — Server-only data access layer; reads `content/blog/*.mdx` via `fs`, parses frontmatter with `gray-matter`. Called only from Server Components and `generateStaticParams`.
3. `app/blog/[slug]/page.tsx` — SSG blog post renderer; dynamic-imports the MDX file as an RSC module; `mdx-components.tsx` provides element map.
4. `app/blog/[slug]/opengraph-image.tsx` — Per-post dynamic OG image; reads post title; renders title text into 1200x630 PNG via `ImageResponse` at build time.
5. `components/sections/*` — One file per portfolio section; purely presentational; data from `lib/data.ts`; animated with Framer Motion `LazyMotion`.

### Critical Pitfalls

1. **`mdx-components.tsx` is required — not optional.** `@next/mdx` with App Router will fail to compile MDX without this file at the project root. Create it first, even if empty. MDX pages 404 or render raw markdown without it. Phase: Foundation.

2. **Dark mode FOUC must be solved in Phase 1.** Reading `localStorage` for theme preference in a React component causes a white flash on every page load for dark-mode users. Fix: inline blocking `<script>` in `app/layout.tsx` that runs before React hydrates, plus `suppressHydrationWarning` on `<html>`. Retrofitting later requires touching the root layout and re-testing all pages. Phase: Foundation.

3. **Framer Motion: use `LazyMotion` with isolated leaf Client Components from day one.** Importing `motion` in any layout or page component forces the full Framer Motion bundle (~33KB gzipped) into every page that uses that layout. Use `LazyMotion` + `domAnimation` (~17KB), `<m.div>` instead of `<motion.div>`, and apply `'use client'` only at the leaf animated component. Phase: Component architecture.

4. **OG image URLs must be absolute.** Next.js accepts relative paths in `openGraph.images` without an error; social crawlers (LinkedIn, Twitter/X, Slack) silently fail to load them. Set `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` as a Vercel env var before the first build and construct all OG URLs from it. Phase: SEO setup.

5. **Subdomain redirect requires Next.js middleware, not the Vercel dashboard.** Vercel's domain redirect UI can only redirect one domain to another domain root — it cannot redirect to a path. `blog.yashkadam.com → yashkadam.com/blog` requires `middleware.ts` that inspects the `Host` header. Use 308 permanent redirect to consolidate link equity. Phase: Deployment.

6. **`@next/mdx` silently renders YAML frontmatter as visible text.** `---\ntitle: My Post\n---` at the top of an MDX file appears literally in the rendered HTML. Use YAML frontmatter for `gray-matter` parsing in `lib/posts.ts` (blog index), and export a named `metadata` const from MDX files for the Next.js Metadata API (individual post pages). Phase: Blog content model.

7. **`metadata` exports are silently ignored in Client Components.** Adding `'use client'` to a `page.tsx` that exports `metadata` or `generateMetadata` does not throw — it produces a page with no `<title>`, no description, and no OG tags. Keep all `page.tsx` files as Server Components; extract interactivity into child Client Components. Phase: Every page.

---

## Implications for Roadmap

Research reveals a clear dependency graph. Infrastructure decisions have downstream effects on every phase that follows. The MDX pipeline configuration, `mdx-components.tsx`, dark mode FOUC fix, and `LazyMotion` pattern must be in place before content components are built. The blog route tree depends on the `lib/posts.ts` data layer, which depends on the MDX config. SEO tooling (OG images, sitemap, metadata) can only be wired after the pages exist. This maps naturally to five phases.

### Phase 1: Foundation

**Rationale:** Every subsequent phase depends on this infrastructure. MDX will not compile without `next.config.mjs` + `mdx-components.tsx`. Dark mode FOUC becomes a retrofit problem if deferred. Framer Motion bundle bloat is architectural — you cannot easily reverse a pattern where `motion` was used in layouts. Fonts, global CSS, Navbar, Footer, and root layout are depended upon by every page. This phase has no visible product output to ship, but without it nothing else works correctly.

**Delivers:** A running Next.js 16 app with the full MDX pipeline wired, dark mode FOUC prevented, Framer Motion correctly scoped, and the shared layout shell (Navbar, Footer, root layout, UI primitives) in place.

**Covers:**
- Upgrade Next.js 14 to 16.2.6 from v2 branch starting point
- `next.config.mjs`: MDX config, `pageExtensions`, rehype-pretty-code plugin, subdomain redirects
- `mdx-components.tsx`: required file; stub `img` to `next/image`, stub `pre` for syntax highlighting
- `app/layout.tsx`: root layout, `next/font` self-hosted fonts, dark mode FOUC inline script, `suppressHydrationWarning`
- `components/ui/*`: Button, Badge, SectionWrapper
- `components/layout/Navbar.tsx` + `Footer.tsx`
- `tailwind.config.ts`: add `@tailwindcss/typography`
- Vercel project setup: `NEXT_PUBLIC_SITE_URL` env var set before first build

**Pitfalls to avoid:** Missing `mdx-components.tsx`, dark mode FOUC, Framer Motion bundle infection, `NEXT_PUBLIC_` vars need redeploy.

**Research flag:** Standard, well-documented patterns. No additional research needed.

---

### Phase 2: Portfolio Page

**Rationale:** The portfolio home is the primary credibility artifact and has no blog dependency. It can be deployed and receive real feedback before the blog exists. Getting it live early means a real URL to share before Phase 3 begins.

**Delivers:** The complete single-page portfolio at `/` — Hero, About, Work History, Projects, Contact — statically generated, SEO-tagged, and deployed at `yashkadam.com`.

**Covers:**
- `lib/data.ts`: typed `projects[]`, `workHistory[]` constants
- `components/sections/Hero.tsx` — static confident text (no typewriter animation)
- `components/sections/About.tsx`
- `components/sections/WorkHistory.tsx`
- `components/sections/Projects.tsx` — cards with tech stack tags (these are the skills section; no separate skills bar or grid)
- `components/sections/Contact.tsx` — email + social icon links
- `app/page.tsx` — assembles sections
- Static OG image (`public/og/og-image.png` 1200x630), title template, description
- Framer Motion `whileInView` scroll entrance — `LazyMotion` + `domAnimation` + isolated `'use client'` leaf components, subtle opacity + Y translate only

**Anti-features to eliminate:** animated skill progress bars, typewriter animation in hero, skills grid without project context, older demo projects (Twitter clone, Crown Clothing).

**Pitfalls to avoid:** `metadata` in Client Components silently does nothing, OG URLs must be absolute, `next/image` missing dimensions causes CLS, skills section reads as junior, dead project links, overused scroll animations.

**Research flag:** Standard patterns. No additional research needed.

---

### Phase 3: Blog Infrastructure

**Rationale:** The data layer and MDX rendering pipeline must exist before any blog page is built. `lib/posts.ts` is the single point where all MDX files are discovered and their frontmatter parsed. `app/blog/layout.tsx` with the `prose` wrapper is needed by both the index and post pages. One or two real seed posts should be written during this phase so Phase 4 can be tested with real content.

**Delivers:** The `lib/posts.ts` data layer, `content/blog/` directory with 1-2 real seed posts, PostCard and PostHeader components, and the blog sub-layout with typography styles.

**Covers:**
- `lib/posts.ts`: `getAllPosts()` returns sorted `{ slug, title, date, description, tags, readingTime }[]`; `getPostBySlug(slug)`; server-only; all slugs `.toLowerCase()`
- `content/blog/` file convention: lowercase-hyphen filenames only (e.g., `my-first-post.mdx`)
- Frontmatter schema: `title`, `date`, `description`, `tags`, `published`
- `components/blog/PostCard.tsx`, `PostHeader.tsx`
- `app/blog/layout.tsx`: `prose prose-invert max-w-3xl mx-auto` wrapper
- 1-2 real seed posts with code blocks to verify `rehype-pretty-code` output

**Pitfalls to avoid:** YAML frontmatter silently visible (use `gray-matter` for index, named export for Metadata API), case mismatch between macOS dev and Linux prod (enforce lowercase filename convention), subdomain `middleware.ts` should be wired in this phase.

**Research flag:** `rehype-pretty-code` 0.14.3 with Turbopack has a known gotcha — Shiki themes must be passed as string names, not imported objects. Verify the ESM `next.config.mjs` pattern against current docs before implementing. `mdxRs: true` must be disabled.

---

### Phase 4: Blog Pages and SEO

**Rationale:** With the data layer from Phase 3 in place, blog index and post pages are straightforward assembly. SEO tooling (per-post OG images, `generateMetadata`, sitemap, RSS) is grouped here because it depends on the blog pages existing and on the `NEXT_PUBLIC_SITE_URL` absolute URL convention from Phase 1.

**Delivers:** The complete blog at `/blog` and `/blog/[slug]`, with dynamic OG images per post, per-post metadata, a sitemap that includes all posts, robots.txt, and an RSS feed. Blog posts are shareable on social with correct previews.

**Covers:**
- `app/blog/page.tsx`: blog index, `getAllPosts()`, `<PostCard />` list sorted newest-first
- `app/blog/[slug]/page.tsx`: `generateStaticParams()`, `dynamicParams = false`, dynamic MDX import, `generateMetadata()` with absolute OG URL
- `app/blog/[slug]/opengraph-image.tsx`: `ImageResponse` 1200x630, post title, author name
- `app/sitemap.ts`: programmatic, includes `/`, `/blog`, all post slugs with absolute URLs
- `app/robots.ts`: `Allow: /` on production, `Disallow: /` on staging, guarded by `NEXT_PUBLIC_SITE_URL`
- `app/feed.xml/route.ts`: RSS 2.0 feed from `getAllPosts()`
- `middleware.ts`: 308 permanent redirect for `blog.yashkadam.com → yashkadam.com/blog`
- Vercel: add `blog.yashkadam.com` to project domains + CNAME at registrar

**Pitfalls to avoid:** OG URLs must be absolute, do not use `output: 'export'`, sitemap URLs must be absolute and must include all posts, robots.txt must allow on production, `NEXT_PUBLIC_` vars need redeploy if changed.

**Research flag:** `middleware.ts` for subdomain redirect needs testing in Vercel preview environment. Guard redirect behind `VERCEL_ENV === 'production'` to avoid matching preview URLs.

---

### Phase 5: Polish and Analytics

**Rationale:** Polish requires the full site to exist. Analytics should be added after deployment to avoid dev traffic skew. Scroll animations may need tuning against real content.

**Delivers:** Vercel Analytics enabled, Framer Motion animations refined, reading time visible on cards and post headers, JSON-LD schema, and a verified link audit pass.

**Covers:**
- Vercel Analytics: `@vercel/analytics` + `<Analytics />` in root layout (cookieless, no consent banner needed)
- Reading time display confirmed in `PostCard` and `PostHeader`
- Framer Motion animation audit: hero entrance (high impact, keep); section scroll reveals (subtle; 150-200ms; opacity + small Y translate); no `layout` prop on scroll-heavy components
- JSON-LD: `WebSite` + `Person` schema in root layout; `Article` schema on post pages
- Link audit: verify all project live demo links load; remove any dead links
- Core Web Vitals check: Lighthouse on deployed site; verify LCP, CLS, INP pass

**Pitfalls to avoid:** Framer Motion `layout` prop on high-frequency components, skills section credibility (anchor each technology to a shipped project), dead project links, every-element scroll animations.

**Research flag:** Standard patterns. No additional research needed.

---

### Phase Ordering Rationale

- Phase 1 before everything: `mdx-components.tsx`, dark mode FOUC fix, and `LazyMotion` pattern are architectural decisions that cannot be retrofitted without touching every component built after them.
- Phase 2 before Phase 3: The portfolio page has no blog dependency and can go live and receive feedback before the blog exists.
- Phase 3 before Phase 4: `lib/posts.ts` and `app/blog/layout.tsx` are required by the blog pages; you cannot build pages without the data layer.
- Phase 4 groups all SEO tooling: sitemap, robots.txt, RSS, and OG images all share the `NEXT_PUBLIC_SITE_URL` absolute URL base from Phase 1. Grouping reduces round-trips to deployment config.
- Phase 5 last: polish and analytics only make sense with a complete site to polish.

---

### Research Flags

**Phases with well-documented patterns (skip additional research-phase):**
- Phase 1: Next.js 16 upgrade, `@next/mdx` setup, dark mode FOUC fix — all have official docs with code examples.
- Phase 2: Static sections, Framer Motion `whileInView`, `next/image` — established patterns.
- Phase 5: Vercel Analytics, JSON-LD, link auditing — standard patterns.

**Phases that benefit from targeted verification during planning:**
- Phase 3: `rehype-pretty-code` 0.14.3 + Turbopack — Shiki theme string requirement and `mdxRs: true` disabling. Verify ESM `next.config.mjs` pattern before implementing.
- Phase 4: `middleware.ts` subdomain redirect behavior on Vercel preview deployments — add `VERCEL_ENV` guard to prevent preview URLs from triggering the redirect.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All versions verified against npm registry and official Next.js docs (v16.2.6, 2026-05-19). `next-mdx-remote` archive and `contentlayer` abandonment verified from primary sources. |
| Features | HIGH | Cross-validated against 6 live developer portfolios and official Next.js docs. |
| Architecture | HIGH | Verified against Next.js 16.2.6 official docs. Patterns confirmed against Vercel Portfolio Starter Kit. |
| Pitfalls | HIGH | All critical pitfalls verified against official Next.js docs with code examples. |

**Overall confidence: HIGH**

### Gaps to Address

- **Dark mode toggle timing:** FOUC prevention inline script must be in Phase 1. The user-facing toggle should be deferred until the design direction is locked (per PROJECT.md, 2-3 design variations should be evaluated first). When ready, use `next-themes`.
- **Tailwind v4 upgrade:** Deferred. v4 has a redesigned config format that differs from v3. Treat as a focused standalone sprint, not a Phase 5 subtask. Research at that point.
- **`middleware.ts` on preview deployments:** The subdomain redirect will match `blog.*` on Vercel preview URLs unless guarded by `VERCEL_ENV === 'production'`. Address during Phase 4.
- **Design direction not locked:** PROJECT.md requests 2-3 design variations before committing. Phase 1 can proceed with a neutral baseline (Geist or Inter font, clean background), but design direction should be resolved before Phase 2 content sections are styled.

---

## Sources

### Primary (HIGH confidence)
- `/vercel/next.js` (Context7) — App Router MDX guide, metadata API, OG images, redirects, environment variables, sitemap/robots.txt file conventions, preventing flash before hydration. Verified against v16.2.6, last updated 2026-05-19.
- `/hashicorp/next-mdx-remote` (Context7) — archive confirmation, RSC import path, absence of `serialize()` in `/rsc`. Archived February 2026.
- https://rehype-pretty.pages.dev/ — rehype-pretty-code 0.14.3 configuration, Shiki theme string requirement, Turbopack note.
- `/grx7/framer-motion` (Context7) — LazyMotion, domAnimation, `<m.div>` tree-shaking, `'use client'` isolation pattern.
- `/websites/ui_shadcn` (Context7) — shadcn/ui CLI 2.9.0, component copy pattern, Radix UI basis.
- https://vercel.com/docs/analytics — Vercel Web Analytics, cookieless, no consent required.
- https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting — Vercel domain redirect UI limitations (dashboard cannot redirect to a path).

### Secondary (MEDIUM confidence)
- brittanychiang.com, leerob.com, delba.dev, joshwcomeau.com, kentcdodds.com, taniarascia.com — live portfolios verified 2026-05-24; feature set and anti-feature observations.
- Vercel Portfolio Starter Kit (vercel/examples) — directory structure reference, RSS feed pattern, sitemap pattern.
- motion.dev/blog — `framer-motion` / `motion` rebranding explanation; same codebase confirmed.

### Tertiary (LOW confidence — needs validation when needed)
- Tailwind v4 breaking changes from v3 config format — observed from Next.js 16 scaffolding defaults; not deeply researched. Defer upgrade and research when ready.

---
*Research completed: 2026-05-24*
*Ready for roadmap: yes*
