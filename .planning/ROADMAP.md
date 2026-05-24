# Roadmap: Yash Kadam — Personal Portfolio + MDX Blog

## Overview

Five dependency-ordered phases deliver a statically generated Next.js 16 portfolio and MDX blog at yashkadam.com. Phase 1 lays infrastructure that every later phase depends on. Phase 2 ships the portfolio home so it can receive real feedback before the blog exists. Phases 3-4 build and fully surface the blog with SEO and social sharing. Phase 5 adds analytics and confirms quality on the live site.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Next.js 16 upgrade, MDX pipeline, dark mode FOUC fix, LazyMotion pattern, and shared layout shell
- [ ] **Phase 2: Portfolio Page** - Complete single-page portfolio live at yashkadam.com with full SEO metadata
- [ ] **Phase 3: Blog Infrastructure** - Data layer, MDX content model, blog sub-layout, and seed posts
- [ ] **Phase 4: SEO & Deployment** - Blog pages, OG images, sitemap, robots.txt, RSS feed, and subdomain redirect
- [ ] **Phase 5: Polish & Analytics** - Vercel Analytics, animation audit, link audit, and Core Web Vitals pass

## Phase Details

### Phase 1: Foundation
**Goal**: A running Next.js 16 app with the full MDX pipeline wired, dark mode FOUC prevented, Framer Motion correctly scoped, and the shared layout shell in place — every subsequent phase builds on top of this without rework.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Running `next build` produces zero TypeScript errors and the local dev server starts cleanly on Next.js 16.
  2. Loading any page in a browser that has a dark-mode preference shows no white flash before the theme applies (FOUC is absent).
  3. `mdx-components.tsx` exists at the project root and a test `.mdx` file renders as HTML — not raw markdown text.
  4. Framer Motion is imported only via `LazyMotion` + `domAnimation`; no `motion.*` import appears outside a leaf Client Component file.
  5. The Navbar and Footer are visible and structurally correct on every page route, and `NEXT_PUBLIC_SITE_URL` is set in Vercel env vars.
**Plans**: TBD
**UI hint**: yes

### Phase 2: Portfolio Page
**Goal**: The complete single-page portfolio — Hero, About, Work History, Projects, Contact — is statically generated, SEO-tagged with absolute OG URLs, and live at yashkadam.com so it can receive real traffic and feedback before the blog exists.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: PORT-01, PORT-02, PORT-03, PORT-04, PORT-05, SEO-01
**Success Criteria** (what must be TRUE):
  1. Visiting yashkadam.com shows all five sections (Hero, About, Work History, Projects, Contact) without a page reload or scroll hint being required to discover them.
  2. Nekomori and Brew Index project cards each display tech stack tags, a live link, and a GitHub link — all links resolve to the correct destinations.
  3. Sharing yashkadam.com on LinkedIn or Twitter/X renders a correctly sized OG image with a title and description (not a blank or broken card).
  4. The page has no typewriter animation, no animated skill progress bars, and no older demo projects (Twitter clone, Crown Clothing, etc.).
  5. `next build` shows the `/` route as statically generated (SSG) with no client-side data fetching warnings.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Blog Infrastructure
**Goal**: The blog data layer and MDX content pipeline are in place: `lib/posts.ts` discovers and parses all frontmatter, at least one real seed post renders with correct typography and syntax highlighting, and the blog sub-layout is wired — so Phase 4 can assemble pages without touching infrastructure.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: BLOG-01, BLOG-02
**Success Criteria** (what must be TRUE):
  1. The blog index at `/blog` lists at least one real post with title, date, description, and reading time, sorted newest first.
  2. Navigating to a post page (`/blog/[slug]`) renders the MDX content with readable prose typography and syntax-highlighted code blocks — YAML frontmatter is not visible as raw text in the output.
  3. `getAllPosts()` called from a Node script returns a correctly typed array with `slug`, `title`, `date`, `description`, `tags`, and `readingTime` fields for every `.mdx` file in `content/blog/`.
**Plans**: TBD
**UI hint**: yes

### Phase 4: SEO & Deployment
**Goal**: Every blog post is shareable on social with a unique branded OG image; the site is fully indexed via sitemap and robots.txt; an RSS feed is live at `/feed.xml`; and `blog.yashkadam.com` permanently redirects to `yashkadam.com/blog`.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: BLOG-03, BLOG-04, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. Sharing a specific blog post URL on Twitter/X or LinkedIn renders that post's title in the OG preview image — not a generic site-wide image.
  2. Fetching `/sitemap.xml` returns valid XML that includes `/`, `/blog`, and a URL entry for every published post slug with absolute `https://yashkadam.com/...` URLs.
  3. Fetching `/robots.txt` on the production domain returns `Allow: /`; on a Vercel preview URL it returns `Disallow: /`.
  4. Fetching `/feed.xml` returns valid RSS 2.0 XML with at least one `<item>` containing title, link, pubDate, and description.
  5. Navigating a browser to `blog.yashkadam.com` (or any path under it) issues a 308 permanent redirect and lands at `yashkadam.com/blog`.
**Plans**: TBD

### Phase 5: Polish & Analytics
**Goal**: Vercel Analytics is capturing real pageview data; scroll animations are tuned to be subtle and non-distracting; all project links are verified live; and a Lighthouse run on the deployed site confirms Core Web Vitals pass.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: ANLYT-01
**Success Criteria** (what must be TRUE):
  1. The Vercel Analytics dashboard shows pageview events for `yashkadam.com` without a cookie consent banner appearing anywhere on the site.
  2. A Lighthouse audit run against the deployed production URL scores LCP under 2.5s, CLS under 0.1, and INP under 200ms.
  3. Every project live demo link and GitHub link in the Projects section resolves with a 200 response (no dead links).
  4. All Framer Motion scroll entrance animations use opacity + small Y translate only; no `layout` prop appears on scroll-heavy components; and no section triggers more than one animation per viewport entry.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/? | Not started | - |
| 2. Portfolio Page | 0/? | Not started | - |
| 3. Blog Infrastructure | 0/? | Not started | - |
| 4. SEO & Deployment | 0/? | Not started | - |
| 5. Polish & Analytics | 0/? | Not started | - |
