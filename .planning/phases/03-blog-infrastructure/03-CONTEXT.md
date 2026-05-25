# Phase 3: Blog Infrastructure - Context

**Gathered:** 2026-05-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the blog data layer and MDX content pipeline: `lib/posts.ts` discovers and parses all frontmatter from `content/blog/*.mdx`, at least one real seed post (about Nekomori) renders with correct prose typography and syntax-highlighted code blocks, and a minimal blog sub-layout is wired — so Phase 4 can assemble SEO pages without touching infrastructure.

No RSS feed, no OG images, no sitemap — those are Phase 4.

</domain>

<decisions>
## Implementation Decisions

### Frontmatter Schema
- **D-01:** Frontmatter fields: `title` (string), `date` (ISO string), `description` (string), `tags` (string array), `published` (boolean). `readingTime` is **auto-computed** by `lib/posts.ts` — NOT in frontmatter.
- **D-02:** `published: false` posts are filtered out by `getAllPosts()` — safe to commit WIP posts without them appearing on the blog index.
- **D-03:** No cover image field, no canonical URL field in Phase 3. Frontmatter stays minimal.

### Blog Index Layout (`/blog`)
- **D-04:** Minimal **list** layout — title + date + description + reading time, stacked vertically. No card grid. Clean and fast to scan; consistent with the dark polished aesthetic.
- **D-05:** Posts sorted newest first.

### Blog Post Page Layout (`/blog/[slug]`)
- **D-06:** `← All posts` link at the top of every post page (above the post title). Standard navigation affordance.
- **D-07:** `app/blog/layout.tsx` exists as a **minimal sub-layout**: sets max-width container and prose padding, shared by both `/blog` index and `/blog/[slug]` pages. No distinct header beyond the root Navbar.

### Syntax Highlighting
- **D-08:** Use `rehype-pretty-code` with Shiki theme **`github-dark`**. Wire into `next.config.mjs` using string theme name (not imported object) — required by the `mdxRs: false` + Turbopack constraint noted in STATE.md.

### Seed Post
- **D-09:** One real seed post about **Nekomori** — angle at Claude's discretion (Claude picks the most interesting technical angle based on the project description). Post must use the full frontmatter schema (title, date, description, tags, published: true). Claude writes the content.
- **D-10:** The existing `test-post.mdx` is a smoke test and should NOT appear on the blog index — set `published: false` (or add frontmatter that marks it as unpublished). The seed post is a new file.

### Parsing Library
- **D-11:** Use **`gray-matter`** for frontmatter parsing in `lib/posts.ts`. It is the standard for MDX/markdown frontmatter in Next.js — battle-tested, no surprises. Install as a dependency.
- **D-12:** Use **`reading-time`** for auto-computing reading time from MDX body content. Install as a dependency.

### Claude's Discretion
- Exact prose typography styles in the blog sub-layout (Tailwind `prose` class from `@tailwindcss/typography` plugin, or custom CSS — whichever is cleaner given existing Tailwind config)
- Nekomori post angle and content (instructed to pick the most interesting technical angle)
- Exact reading time rounding (e.g. "3 min read")
- Date display format on the blog index and post pages (e.g. "May 24, 2026")

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/REQUIREMENTS.md` §Blog — BLOG-01, BLOG-02 (this phase's requirements)
- `.planning/ROADMAP.md` §Phase 3 — Goal + Success Criteria (3 items that gate Phase 3 completion)
- `.planning/PROJECT.md` §Constraints — MDX in-repo constraint, no CMS

### Phase 1 & 2 Foundation (build on top of)
- `.planning/phases/01-foundation/01-CONTEXT.md` — dark-only mode, LazyMotion pattern, Navbar/Footer spec
- `.planning/phases/02-portfolio-page/02-CONTEXT.md` — design direction (dark polished), Geist fonts, accent color, established patterns
- `app/layout.tsx` — Root layout (FOUC script, LazyMotion, Navbar, Footer) — do NOT break
- `next.config.mjs` — MDX config with `mdxRs: false` — Phase 3 adds rehype-pretty-code here
- `mdx-components.tsx` — MDX component map at project root — may need prose component overrides

### Existing Blog Stubs (replace/evolve, don't start from scratch)
- `app/blog/page.tsx` — Current stub ("coming soon") — replace with real index
- `app/blog/[slug]/page.tsx` — Current stub (imports MDX directly, hardcoded params) — replace with dynamic `lib/posts.ts` lookup
- `content/blog/test-post.mdx` — Smoke-test post, no frontmatter — add `published: false` frontmatter or keep as-is; do NOT show on blog index

### Technical Constraints (from STATE.md)
- `rehype-pretty-code` 0.14.3 + `mdxRs: false`: Shiki themes MUST be passed as string names, not imported objects. Verified constraint from Phase 1 research.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/utils.ts` — `cn()` utility (clsx + tailwind-merge) — use for all conditional class merging in blog components
- `components/Navbar.tsx` — Server Component pattern to follow
- `components/Footer.tsx` — Already present; blog pages inherit it via root layout

### Established Patterns
- All page-level components are Server Components — `lib/posts.ts` and blog pages are server-only (no `'use client'`)
- Framer Motion: use `m.*` inside `'use client'` leaf components only; LazyMotion already in root layout
- Dark-only: all styling uses `dark:` utilities (always active); no light-mode variants needed
- `next/font/google` Geist + Geist Mono already set up in root layout — use `font-mono` class for code prose

### Integration Points
- `next.config.mjs` — add `rehype-pretty-code` to the `withMDX` options.rehypePlugins array
- `app/blog/layout.tsx` — new file; wraps both `/blog` and `/blog/[slug]` with max-width container
- `lib/posts.ts` — new file; `getAllPosts()` reads `content/blog/*.mdx`, parses with gray-matter, computes reading time, filters `published: false`, sorts newest first
- `app/blog/[slug]/page.tsx` — replace hardcoded import with `generateStaticParams()` from `getAllPosts()` and dynamic MDX rendering

</code_context>

<specifics>
## Specific Ideas

- **gray-matter** is the parsing library — `import matter from 'gray-matter'`
- **reading-time** package: `import readingTime from 'reading-time'` — pass the raw MDX string (after stripping frontmatter) to get `{ text: "3 min read", minutes: 3, ... }`
- **Blog index date format:** Display as "May 24, 2026" using `Intl.DateTimeFormat` or `date-fns` — no extra dep needed if using `Intl`
- **`@tailwindcss/typography` plugin** — if not already in `tailwind.config.ts`, install it and use `prose dark:prose-invert` on the post article wrapper. This is the standard approach for MDX prose styling in Next.js + Tailwind.
- **Nekomori post slug:** `content/blog/building-nekomori.mdx` (or similar) — Claude decides final name
- **`getAllPosts()` return type:** `{ slug: string; title: string; date: string; description: string; tags: string[]; readingTime: string; }[]` — matches ROADMAP.md success criterion 3

</specifics>

<deferred>
## Deferred Ideas

- RSS feed (`/feed.xml`) — Phase 4, BLOG-03
- Dynamic OG image per post — Phase 4, BLOG-04
- Sitemap including blog posts — Phase 4, SEO-02
- Table of contents for long posts — v2 requirement BLOG-05
- JSON-LD Article schema — v2 requirement BLOG-06
- Cover image field in frontmatter — revisit in Phase 4 if needed for OG images

</deferred>

---

*Phase: 3-Blog Infrastructure*
*Context gathered: 2026-05-24*
