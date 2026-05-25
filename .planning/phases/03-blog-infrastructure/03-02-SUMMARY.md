---
phase: 03-blog-infrastructure
plan: "02"
subsystem: blog-infrastructure
tags: [blog, mdx, server-component, static-generation, typescript]
dependency_graph:
  requires:
    - lib/posts.ts (Plan 01 — PostMeta interface + getAllPosts())
    - app/blog/layout.tsx (Plan 01 — max-w-3xl container)
    - next.config.mjs (Plan 01 — rehype-pretty-code wired)
    - tailwind.config.ts (Plan 01 — @tailwindcss/typography registered)
  provides:
    - app/blog/page.tsx (real blog index with getAllPosts(), formatted dates, tag pills)
    - app/blog/[slug]/page.tsx (dynamic MDX renderer, async params, notFound guard)
    - content/blog/building-nekomori.mdx (Nekomori seed post, published: true)
  affects:
    - /blog route (now renders real post list from published MDX files)
    - /blog/building-nekomori route (now renders Nekomori technical post)
tech_stack:
  added: []
  patterns:
    - Server Component blog index reads getAllPosts() synchronously; no data fetching hooks
    - async params pattern: params typed as Promise<{ slug: string }>, awaited at top of component
    - dynamicParams = false + try/catch notFound() — secure dynamic import guard
    - Intl.DateTimeFormat for date formatting — no extra date library
    - prose dark:prose-invert max-w-none on article wrapper for MDX typography
    - Tag pills follow ProjectsSection.tsx pattern: rounded-md bg-surface px-2.5 py-1
key_files:
  created:
    - content/blog/building-nekomori.mdx
  modified:
    - app/blog/page.tsx
    - app/blog/[slug]/page.tsx
decisions:
  - "async params (Promise<{ slug: string }>) used for Next.js 15 App Router compatibility"
  - "dynamicParams = false prevents arbitrary module resolution for unknown slugs"
  - "try/catch around dynamic import calls notFound() to avoid error detail leakage (T-03-04)"
  - "Intl.DateTimeFormat with en-US locale formats dates as 'May 20, 2026' — no extra dep"
  - "Nekomori post covers local-first sync architecture: the most technically interesting angle from the project description"
metrics:
  duration: "4m 20s"
  completed: "2026-05-25T06:00:00Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 1
  files_modified: 2
---

# Phase 3 Plan 02: Blog Pages and Seed Post Summary

**One-liner:** Real blog index and dynamic MDX post renderer implemented — async params, dynamicParams=false notFound guard, prose typography, Nekomori seed post with TypeScript code blocks; next build confirms /blog and /blog/[slug] as SSG routes.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace app/blog/page.tsx with real blog index | 463c0b1 | app/blog/page.tsx |
| 2 | Replace app/blog/[slug]/page.tsx with dynamic MDX renderer | 46d6818 | app/blog/[slug]/page.tsx |
| 3 | Write the Nekomori seed post | 731ec4e | content/blog/building-nekomori.mdx |

## What Was Built

**`app/blog/page.tsx`:** Full Server Component blog index. Exports `metadata` with `title: 'Blog — Yash Kadam'`. Defines `formatDate()` using `Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' })`. Calls `getAllPosts()` synchronously (no await needed). Renders a `<ul className="mt-10 divide-y divide-border">` with per-post items showing: linked title (text-text hover:text-accent), date · reading time in font-mono text-xs, description in text-text-muted, tag pills following the ProjectsSection pattern (rounded-md bg-surface px-2.5 py-1 font-mono text-xs). Empty state shows "No posts yet." fallback.

**`app/blog/[slug]/page.tsx`:** Dynamic post renderer with async params typed as `Promise<{ slug: string }>`. Exports `generateStaticParams()` mapping `getAllPosts()` to slug objects. Exports `dynamicParams = false` — unknown slugs return 404 rather than attempting arbitrary module resolution. Exports `generateMetadata` for per-post title/description. Default export awaits params, dynamically imports `@/content/blog/${slug}.mdx` with explicit `.mdx` extension, calls `notFound()` in the catch block. JSX returns: back link (`← All posts` to `/blog`) above an `<article className="prose dark:prose-invert max-w-none">` wrapping the MDX component.

**`content/blog/building-nekomori.mdx`:** 916-word technical post on Nekomori's local-first sync architecture. Full frontmatter: title "Building Nekomori: Sync Without the Pain", date 2026-05-20, description, tags [nextjs, typescript, architecture, react], published: true. Contains two TypeScript code blocks: `syncStalePosts()` batch worker with Drizzle ORM and `markEpisodeWatched()` with SWR optimistic mutation. Prose covers the problem (rate limit exhaustion), architecture decision (local-first state), implementation (sync worker + optimistic updates), and lessons learned.

## Deviations from Plan

None — plan executed exactly as written.

## Verification Evidence

All success criteria verified:

1. `npx tsc --noEmit` — exits 0, no TypeScript errors
2. `next build` — exits 0; `/blog` shown as `○ (Static)`, `/blog/[slug]` as `● (SSG)` with `/blog/building-nekomori` pre-rendered
3. `grep -c 'getAllPosts' app/blog/page.tsx` — returns 2 (import + call)
4. `grep -c 'Promise.*slug' "app/blog/[slug]/page.tsx"` — returns 2 (generateMetadata + BlogPost)
5. `grep -c 'dynamicParams = false' "app/blog/[slug]/page.tsx"` — returns 1
6. `grep -c 'prose dark:prose-invert' "app/blog/[slug]/page.tsx"` — returns 1
7. `grep -c 'published: true' content/blog/building-nekomori.mdx` — returns 1
8. `grep -c '```typescript' content/blog/building-nekomori.mdx` — returns 2

Phase 3 Success Criteria:
- SC1: /blog lists building-nekomori with title, formatted date (May 20, 2026), description, reading time — verified via build output showing SSG generation
- SC2: /blog/building-nekomori renders MDX with prose dark:prose-invert typography — verified via article wrapper in [slug]/page.tsx; rehype-pretty-code github-dark wired in Plan 01
- SC3: getAllPosts() returns array with all six required PostMeta fields — verified in Plan 01, unchanged

## Known Stubs

None. All three files are fully implemented with real data sources. test-post.mdx remains published: false (set in Plan 01) and does not appear on the blog index.

## Threat Flags

No new security surface beyond what the plan's threat model covers.

- T-03-03 (Tampering — dynamic import path): Mitigated by `dynamicParams = false` + `generateStaticParams()` constraining valid slugs to published posts only. Unknown slugs hit `notFound()` via the try/catch.
- T-03-04 (Information Disclosure — import error): Mitigated by `catch { notFound() }` — no error details in the response.

## Self-Check: PASSED

- app/blog/page.tsx: FOUND
- app/blog/[slug]/page.tsx: FOUND
- content/blog/building-nekomori.mdx: FOUND
- Commit 463c0b1 (Task 1): present in git log
- Commit 46d6818 (Task 2): present in git log
- Commit 731ec4e (Task 3): present in git log
- next build: exit 0, /blog and /blog/building-nekomori as SSG routes confirmed
