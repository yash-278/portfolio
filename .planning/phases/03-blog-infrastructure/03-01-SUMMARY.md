---
phase: 03-blog-infrastructure
plan: "01"
subsystem: blog-infrastructure
tags: [blog, mdx, typography, syntax-highlighting, data-layer]
dependency_graph:
  requires: []
  provides:
    - lib/posts.ts (PostMeta interface + getAllPosts() utility)
    - app/blog/layout.tsx (blog sub-layout with max-w-3xl container)
    - next.config.mjs (rehype-pretty-code plugin registration)
    - tailwind.config.ts (@tailwindcss/typography plugin registration)
  affects:
    - app/blog/page.tsx (Plan 02 — blog index will call getAllPosts())
    - app/blog/[slug]/page.tsx (Plan 02 — post page uses generateStaticParams from getAllPosts())
tech_stack:
  added:
    - rehype-pretty-code@0.14.3 (now wired into MDX pipeline via next.config.mjs)
    - "@tailwindcss/typography@0.5.19 (prose classes enabled in Tailwind build)"
    - gray-matter@4.0.3 (frontmatter parsing in lib/posts.ts)
    - reading-time@1.5.0 (reading time computation in lib/posts.ts)
  patterns:
    - getAllPosts() reads fs.readdirSync + gray-matter + reading-time; filters published:false; sorts newest-first
    - Blog sub-layout pattern: max-width container only, no prose classes (prose belongs on post article)
    - String theme name ('github-dark') passed to rehype-pretty-code, not imported Shiki object
key_files:
  created:
    - lib/posts.ts
    - app/blog/layout.tsx
  modified:
    - next.config.mjs
    - tailwind.config.ts
    - content/blog/test-post.mdx
decisions:
  - "Use string theme name 'github-dark' for rehype-pretty-code — required by mdxRs:false + Turbopack constraint"
  - "Blog layout (app/blog/layout.tsx) gets max-width container only; prose classes go on post article in Plan 02"
  - "matter(raw).content passed to reading-time to exclude YAML frontmatter words from word count"
  - "test-post.mdx gets published:false frontmatter — getAllPosts() filter excludes it from blog index"
metrics:
  duration: "3m 46s"
  completed: "2026-05-25T05:37:56Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 2
  files_modified: 3
---

# Phase 3 Plan 01: Blog Infrastructure Layer Summary

**One-liner:** MDX blog infrastructure layer wired — rehype-pretty-code with github-dark theme, @tailwindcss/typography, getAllPosts() data utility with gray-matter + reading-time, blog sub-layout, and test-post marked unpublished.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Wire rehype-pretty-code and @tailwindcss/typography | 4e259d6 | next.config.mjs, tailwind.config.ts |
| 2 | Implement lib/posts.ts — getAllPosts() data layer | 9ac5595 | lib/posts.ts |
| 3 | Create app/blog/layout.tsx and update test-post.mdx | c1fca8c | app/blog/layout.tsx, content/blog/test-post.mdx |

## What Was Built

**`next.config.mjs`:** Added `import rehypePrettyCode from 'rehype-pretty-code'` and wired it into `createMDX({ options: { rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]] } })`. The `mdxRs: false` flag remains unchanged (required for Turbopack + rehype plugin interop). The placeholder comment for Phase 3 was removed.

**`tailwind.config.ts`:** Added `import typography from '@tailwindcss/typography'` and registered it in the `plugins` array. All existing theme extensions (fontFamily, colors) remain unchanged. This enables `prose` and `prose-invert` utility classes across the project.

**`lib/posts.ts`:** New server-only module (no `'use client'`). Exports `PostMeta` interface (slug, title, date, description, tags, readingTime) and `getAllPosts(): PostMeta[]`. Implementation uses `fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))`, parses with `matter(raw)`, computes reading time as `readingTime(matter(raw).content).text` (frontmatter-stripped body to avoid YAML word inflation), filters `!data.published` entries, and sorts by date descending.

**`app/blog/layout.tsx`:** New Server Component. Wraps `/blog` and `/blog/[slug]` routes with `<div className="mx-auto max-w-3xl px-6 py-16">`. No prose classes on this wrapper — prose belongs on the post `<article>` element in Plan 02 Task 2 to avoid applying typography styles to the blog index list.

**`content/blog/test-post.mdx`:** Prepended YAML frontmatter with `published: false` so `getAllPosts()` excludes it from the blog index. Existing body content (heading, prose, code block) unchanged.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Evidence

All success criteria verified:

1. `npx tsc --noEmit` — exits 0, no errors
2. `grep -c "rehypePrettyCode" next.config.mjs` — returns 2 (import + rehypePlugins usage)
3. `grep -c "typography" tailwind.config.ts` — returns 2 (import + plugins array)
4. `grep -c "export function getAllPosts" lib/posts.ts` — returns 1
5. `grep -c "published: false" content/blog/test-post.mdx` — returns 1
6. `ls app/blog/layout.tsx` — file exists

## Known Stubs

None. All files are fully implemented. Plan 02 will consume `getAllPosts()` and `app/blog/layout.tsx` to build the blog index and post pages.

## Threat Flags

No new security-relevant surface introduced beyond what the plan's threat model covers. All file system access is read-only from `content/blog/` at build time only. No new network endpoints, auth paths, or runtime file access introduced.

## Self-Check: PASSED

- lib/posts.ts: FOUND at app/blog/../lib/posts.ts
- app/blog/layout.tsx: FOUND
- next.config.mjs contains rehypePrettyCode: VERIFIED (grep count 2)
- tailwind.config.ts contains typography: VERIFIED (grep count 2)
- content/blog/test-post.mdx contains published: false: VERIFIED
- Commits 4e259d6, 9ac5595, c1fca8c: all present in git log
