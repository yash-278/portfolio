# Phase 3: Blog Infrastructure - Research

**Researched:** 2026-05-24
**Domain:** Next.js 16 MDX pipeline, gray-matter, reading-time, rehype-pretty-code, @tailwindcss/typography
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Frontmatter fields: `title` (string), `date` (ISO string), `description` (string), `tags` (string array), `published` (boolean). `readingTime` is auto-computed by `lib/posts.ts` — NOT in frontmatter.
- **D-02:** `published: false` posts are filtered out by `getAllPosts()` — safe to commit WIP posts.
- **D-03:** No cover image field, no canonical URL field in Phase 3.
- **D-04:** Minimal list layout — title + date + description + reading time, stacked vertically. No card grid.
- **D-05:** Posts sorted newest first.
- **D-06:** `← All posts` link at the top of every post page (above the post title).
- **D-07:** `app/blog/layout.tsx` is a minimal sub-layout with max-width container and prose padding; shared by both index and post pages.
- **D-08:** Use `rehype-pretty-code` with Shiki theme `github-dark`. Wire into `next.config.mjs` using string theme name (not imported object).
- **D-09:** One real seed post about Nekomori. Claude picks technical angle and writes content. Full frontmatter schema.
- **D-10:** `test-post.mdx` gets `published: false` frontmatter. Seed post is a new file.
- **D-11:** Use `gray-matter` for frontmatter parsing in `lib/posts.ts`.
- **D-12:** Use `reading-time` for auto-computing reading time from MDX body content.

### Claude's Discretion
- Exact prose typography styles in the blog sub-layout (prose class from @tailwindcss/typography, or custom CSS)
- Nekomori post angle and content
- Exact reading time rounding (e.g. "3 min read")
- Date display format (e.g. "May 24, 2026")

### Deferred Ideas (OUT OF SCOPE)
- RSS feed (`/feed.xml`) — Phase 4
- Dynamic OG image per post — Phase 4
- Sitemap including blog posts — Phase 4
- Table of contents for long posts — v2
- JSON-LD Article schema — v2
- Cover image field in frontmatter
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BLOG-01 | Blog post list at `/blog` — title, date, description, reading time, newest first | `getAllPosts()` from `lib/posts.ts` feeds the server-rendered index page |
| BLOG-02 | Individual post pages at `/blog/[slug]` with MDX, typography styles, and syntax highlighting | Dynamic MDX import pattern + rehype-pretty-code config + @tailwindcss/typography prose class |
</phase_requirements>

---

## Summary

Phase 3 builds on an already-functional MDX pipeline (Phase 1). The core work is: (1) write `lib/posts.ts` using `gray-matter` + `reading-time` to enumerate and parse `content/blog/*.mdx`, (2) wire `rehype-pretty-code` into `next.config.mjs`, (3) replace the two blog stubs with a real list page and a dynamic post page, (4) add `app/blog/layout.tsx`, and (5) write the Nekomori seed post.

The key technical findings that constrain implementation: the existing stub at `app/blog/[slug]/page.tsx` uses the old synchronous `params` destructuring — Next.js 16 requires `params` to be awaited as a Promise. The dynamic MDX import must use a template literal with `.mdx` extension (`await import(`@/content/blog/${slug}.mdx`)`). The `reading-time` library processes raw strings and will count MDX JSX tags as words — pass `matter(source).content` (frontmatter-stripped body), not the raw file string, for accurate counts. Turbopack is the default bundler in Next.js 16, but `@next/mdx` explicitly handles this: with `mdxRs: false`, it registers `mdx-js-loader` as a Turbopack webpack loader rule, and `mdx-js-loader` accepts function-reference rehype plugins — `[rehypePrettyCode, options]` works correctly.

**Primary recommendation:** Follow the exact patterns documented below. The biggest pitfall is the Next.js 16 async params type — fix the existing stub's synchronous destructure to `const { slug } = await params`. All three new packages (`gray-matter`, `reading-time`, `@tailwindcss/typography`) passed slopcheck and are already installed in node_modules.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Post discovery & frontmatter parsing | API / Backend (Server Component) | — | File system access; runs at build time or server-side only |
| Reading time computation | API / Backend (Server Component) | — | Runs inside `lib/posts.ts` during post parse; no client involvement |
| Blog index list render | Frontend Server (SSR/SSG) | — | `app/blog/page.tsx` is a Server Component; static at build time |
| Dynamic MDX post render | Frontend Server (SSR/SSG) | — | `app/blog/[slug]/page.tsx` + `generateStaticParams` = fully SSG |
| Syntax highlighting | CDN / Static (build artifact) | — | rehype-pretty-code runs at build time; emits HTML + CSS, no client JS |
| Prose typography (CSS) | CDN / Static | — | @tailwindcss/typography generates CSS classes at build time |
| Blog sub-layout (max-width, padding) | Frontend Server (SSR/SSG) | — | `app/blog/layout.tsx` is a Server Component |

---

## Standard Stack

### Core (all already installed in node_modules)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@next/mdx` | 16.2.6 | MDX compiler + webpack/turbopack loader | Official Next.js MDX integration; already wired in Phase 1 |
| `rehype-pretty-code` | 0.14.3 | Syntax highlighting via Shiki | Already installed in Phase 1; standard for MDX blogs |
| `shiki` | 4.1.0 | Syntax highlighting engine (peer dep) | Already installed; rehype-pretty-code 0.14.3 supports `^4.0.0` |
| `gray-matter` | 4.0.3 | Frontmatter YAML parsing | Standard for Next.js MDX frontmatter; battle-tested since 2014 |
| `reading-time` | 1.5.0 | Word count → reading time estimate | Lightweight, no dependencies; standard approach for blog time estimates |
| `@tailwindcss/typography` | 0.5.19 | Prose typographic styles via CSS | Official Tailwind plugin; `prose dark:prose-invert` is the standard pattern |

[VERIFIED: npm registry] — all six packages confirmed via `npm list --depth=0` in project node_modules.

### Installation

All packages are **already installed** as of the slopcheck run during research:

```bash
# Already present — no install needed at plan time:
# rehype-pretty-code@0.14.3, shiki@4.1.0 (installed in Phase 1)
# gray-matter@4.0.3, reading-time@1.5.0, @tailwindcss/typography@0.5.19 (installed during research)

# If starting fresh:
npm install gray-matter reading-time
npm install -D @tailwindcss/typography
```

**Version verification:** All versions confirmed against npm registry 2026-05-24. [VERIFIED: npm registry]

---

## Package Legitimacy Audit

> slopcheck was run on 2026-05-24.

| Package | Registry | Age | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-------------|-----------|-------------|
| `gray-matter` | npm | 12 yrs (2014) | github.com/jonschlinkert/gray-matter | [OK] | Approved |
| `reading-time` | npm | 12 yrs (2014) | github.com/ngryman/reading-time | [OK] | Approved |
| `@tailwindcss/typography` | npm | 6 yrs (2020) | github.com/tailwindlabs/tailwindcss-typography | [OK] | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

No postinstall scripts detected on any package. [VERIFIED: npm registry]

---

## Architecture Patterns

### System Architecture Diagram

```
content/blog/*.mdx
        │
        ▼ (Node fs.readdirSync at build time)
lib/posts.ts::getAllPosts()
  ├── gray-matter → { data: { title, date, description, tags, published }, content }
  ├── reading-time(content) → { text: "3 min read" }
  └── filter published:false, sort by date desc
        │
        ├──▶ app/blog/page.tsx (Server Component, SSG)
        │     └── renders blog index list
        │
        └──▶ app/blog/[slug]/page.tsx (Server Component, SSG)
              ├── generateStaticParams() → slugs from getAllPosts()
              ├── await import(`@/content/blog/${slug}.mdx`)
              └── renders <Post /> wrapped in prose container
                          │
                          ▼ (rehype-pretty-code in next.config.mjs)
                    syntax-highlighted HTML (github-dark theme)
```

### Recommended Project Structure

```
app/
├── blog/
│   ├── layout.tsx          # NEW: sub-layout with prose padding + max-width
│   ├── page.tsx            # REPLACE: blog index list
│   └── [slug]/
│       └── page.tsx        # REPLACE: dynamic MDX post page
content/
└── blog/
    ├── test-post.mdx        # MODIFY: add published: false frontmatter
    └── building-nekomori.mdx  # NEW: seed post
lib/
└── posts.ts                 # NEW: getAllPosts() utility
```

### Pattern 1: Registering rehype-pretty-code in next.config.mjs

**What:** Add `rehypePrettyCode` to the `options.rehypePlugins` array inside `createMDX`. Pass theme as a string name (not an imported object).

**Why string theme works:** With `mdxRs: false`, `@next/mdx` uses `mdx-js-loader.js` (a JS webpack loader). This loader accepts function references and array plugin tuples directly — it does NOT require string names. The string-name requirement in Next.js docs applies only to the Rust MDX compiler (`mdxRs: true`). Passing `[rehypePrettyCode, { theme: 'github-dark' }]` is the correct and verified approach.

**Turbopack context:** Next.js 16 uses Turbopack as the default bundler (`next dev`). `@next/mdx` handles this automatically — it detects `process.env.TURBOPACK` and registers `mdx-js-loader` as a Turbopack webpack loader rule. The function reference passes correctly through this path.

```js
// next.config.mjs — Source: rehype-pretty.pages.dev + VERIFIED via @next/mdx source
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, // REQUIRED: disable Rust MDX compiler so rehype plugins work
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [rehypePrettyCode, { theme: 'github-dark' }],
    ],
  },
})

export default withMDX(nextConfig)
```

[CITED: rehype-pretty.pages.dev — Next.js section] [VERIFIED: @next/mdx/index.js source in node_modules]

### Pattern 2: lib/posts.ts — getAllPosts()

**What:** Reads all `.mdx` files from `content/blog/`, parses frontmatter with gray-matter, computes reading time from the body content (NOT the raw file string), filters unpublished posts, sorts newest first.

**gray-matter API:** `matter(source)` returns `{ data: { title, date, ... }, content: string }`. The `content` property is the file body with frontmatter stripped — pass this to `reading-time`, NOT the raw file string.

**reading-time gotcha:** `reading-time` processes raw text character by character. MDX files may contain JSX/React component tags (e.g., `<MyComponent />`) and `import` statements. These ARE counted as words. Passing `matter(source).content` reduces (but does not eliminate) this inflation — the frontmatter YAML is excluded, but any JSX in the body still contributes. For a blog with mostly prose + code blocks, this is acceptable (code comments and identifiers inflate counts slightly). No workaround is needed for typical blog posts.

```typescript
// lib/posts.ts
// Source: gray-matter README (confirmed in node_modules), reading-time README, Next.js docs
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  readingTime: string
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8')
      const { data, content } = matter(raw)

      // Only include published posts
      if (!data.published) return null

      const { text } = readingTime(content)

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        description: data.description as string,
        tags: (data.tags as string[]) ?? [],
        readingTime: text,
      }
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
```

[CITED: gray-matter README — node_modules/gray-matter/README.md] [CITED: reading-time source — node_modules/reading-time/lib/reading-time.js]

### Pattern 3: Dynamic MDX post page (app/blog/[slug]/page.tsx)

**Critical finding:** The existing stub uses the old synchronous `params` destructuring pattern. In Next.js 16, `params` is typed as `Promise<{ slug: string }>` and MUST be awaited. [VERIFIED: nextjs.org/docs/app/api-reference/functions/generate-static-params, 2026-05-19]

**Dynamic import pattern:** Use `await import(`@/content/blog/${slug}.mdx`)` with a template literal. The `.mdx` extension must be included explicitly. `@next/mdx` with `pageExtensions` handles `.mdx` imports — no special processing needed beyond what's already configured.

**`dynamicParams = false`:** Set this to return 404 for any slug not in `generateStaticParams()`. Correct for a fully static blog.

```typescript
// app/blog/[slug]/page.tsx
// Source: nextjs.org/docs/app/guides/mdx#using-dynamic-imports (2026-05-19)
import { getAllPosts } from '@/lib/posts'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>  // Next.js 16: params is a Promise
}) {
  const { slug } = await params

  let Post: React.ComponentType
  try {
    const module = await import(`@/content/blog/${slug}.mdx`)
    Post = module.default
  } catch {
    notFound()
  }

  return (
    <article className="prose dark:prose-invert max-w-none">
      <Post />
    </article>
  )
}
```

[CITED: nextjs.org/docs/app/api-reference/functions/generate-static-params — versioned 16.2.6]

### Pattern 4: Blog sub-layout (app/blog/layout.tsx)

**What:** Minimal sub-layout providing max-width container and prose padding. Shared by both `/blog` index and `/blog/[slug]` post pages. Server Component (no `'use client'`).

**@tailwindcss/typography configuration:** Add the plugin to `tailwind.config.ts`. Since the project uses TypeScript config, use the import pattern (not `require`). The plugin's `src/index.js` uses CommonJS exports but is compatible with TypeScript's `import` via interop.

**`prose-invert` and dark-only mode:** The project is dark-only with `darkMode: ['class']` and `.dark` always active (FOUC script adds `'dark'` to html). Use `dark:prose-invert` — it will always apply. This sets `--tw-prose-invert-*` CSS variables as the active typography colors.

**Prose color override:** The default `prose-invert` colors (white/gray) may clash with the project's custom CSS variables (`--color-text: #e4e4e7`, `--color-text-muted: #71717a`). The planner should decide whether to override `--tw-prose-invert-body` to use the project's tokens, or accept the defaults. Both approaches are valid.

```typescript
// tailwind.config.ts — add to plugins array
// Source: github.com/tailwindlabs/tailwindcss-typography README
import typography from '@tailwindcss/typography'

const config: Config = {
  // ... existing config ...
  plugins: [typography],
}
```

```typescript
// app/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {children}
    </div>
  )
}
```

Note: The `prose dark:prose-invert` classes go on the `<article>` wrapper inside the post page, NOT on the layout div (so the index page doesn't get prose styles applied to the list items). [CITED: nextjs.org/docs/app/guides/mdx#using-tailwind-typography-plugin]

### Pattern 5: Frontmatter schema for seed post

```yaml
---
title: "Building Nekomori: A Real-Time Pet Health Tracker with Next.js and AI"
date: "2026-05-24"
description: "How I built Nekomori — the technical decisions behind the AI-powered health tracking pipeline, the real-time sync layer, and the trade-offs that shaped the architecture."
tags: ["nextjs", "ai", "typescript", "realtime"]
published: true
---
```

For `test-post.mdx` (smoke test, must NOT appear on blog index):

```yaml
---
title: "Test Post"
date: "2026-01-01"
description: "Smoke test for MDX pipeline."
tags: []
published: false
---
```

### Anti-Patterns to Avoid

- **Synchronous params destructuring:** `{ params }: { params: { slug: string } }` — WRONG in Next.js 16. Always use `Promise<{ slug: string }>` and `await params`.
- **Passing raw file string to reading-time:** `readingTime(rawFileContent)` counts YAML frontmatter words. Always pass `matter(raw).content`.
- **Importing Shiki theme object:** `import { githubDark } from 'shiki'` then passing the object — not needed when using string theme names. String `'github-dark'` is correct and simpler.
- **Putting prose classes on the layout:** `app/blog/layout.tsx` wraps both index and post pages. Prose classes on the layout would apply to the index list too. Prose belongs on the post's `<article>` element only.
- **Missing `dynamicParams = false`:** Without this, Next.js will try to render unknown slugs at runtime and may produce confusing errors instead of clean 404s.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Custom regex/split parser | `gray-matter` | Handles edge cases: fenced code blocks containing YAML, empty frontmatter, various delimiters |
| Reading time estimation | Count words manually | `reading-time` | Handles CJK characters, word boundaries, punctuation edge cases |
| Syntax highlighting | Custom `<pre>` styling | `rehype-pretty-code` + Shiki | Line highlighting, diff support, multiple languages, theme system — thousands of lines of grammar files |
| Prose typography | Custom CSS for `h1-h6`, `p`, `ul`, `code`, `blockquote` | `@tailwindcss/typography` | ~400 lines of carefully tuned type scale, spacing, and dark mode variants |

**Key insight:** The blog infrastructure problem looks simple (read files, render markdown) but every component has hidden complexity — YAML edge cases, Unicode word boundaries, dozens of language grammars, accessible typography scales. Use libraries.

---

## Common Pitfalls

### Pitfall 1: Next.js 16 Async Params — Breaking TypeScript and Runtime

**What goes wrong:** The existing `app/blog/[slug]/page.tsx` stub uses `params: { slug: string }` (synchronous, non-Promise). In Next.js 16, this type is wrong — params is `Promise<{ slug: string }>`. TypeScript won't catch this at compile time (it's a type annotation issue), but accessing `params.slug` synchronously will return undefined or throw at runtime in certain rendering modes.

**Why it happens:** Next.js changed params to return a Promise as part of the shift to async Server Components. The old synchronous pattern still "works" in some cases but is incorrect and will break with future Next.js updates.

**How to avoid:** Always use `async function Page({ params }: { params: Promise<{ slug: string }> })` and `const { slug } = await params`. [VERIFIED: nextjs.org/docs/app/api-reference/functions/generate-static-params — 2026-05-19]

**Warning signs:** TypeScript error `Type 'Promise<{ slug: string }>' has no property 'slug'`; or blog post pages silently 404 despite slug being correct.

### Pitfall 2: Dynamic Import Path — Module Not Found at Build Time

**What goes wrong:** `await import(`@/content/blog/${slug}`)` (without `.mdx` extension) fails with Webpack/Turbopack because the module resolver needs the explicit extension to identify MDX files.

**Why it happens:** While `pageExtensions` makes `.mdx` files importable, dynamic imports with template literals require explicit file extensions for the bundler to correctly resolve and bundle the MDX modules at build time.

**How to avoid:** Always include `.mdx`: `await import(`@/content/blog/${slug}.mdx`)`.

**Warning signs:** `Module not found: Can't resolve '@/content/blog/my-post'` at build time or dev server start.

### Pitfall 3: Reading Time Inflation from JSX in MDX

**What goes wrong:** Passing the raw `.mdx` file string to `reading-time` (instead of `matter(raw).content`) inflates the estimate because the YAML frontmatter block is treated as prose words.

**Why it happens:** `reading-time` does simple character-by-character word counting — it has no concept of YAML, JSX, or code blocks. `title:`, `date:`, and `"2026-05-24"` all get counted.

**How to avoid:** Always pass `matter(raw).content` to `readingTime()`. The `matter()` call strips frontmatter and returns only the markdown/MDX body.

**Warning signs:** Posts with long frontmatter (many tags, long description) show inflated reading times like "5 min read" for a 300-word post.

### Pitfall 4: Blog Layout Applying Prose to the Index Page

**What goes wrong:** Adding `prose dark:prose-invert` to `app/blog/layout.tsx` wrapper div — this applies prose typography to BOTH the post page AND the blog index list, making the index list look like body text instead of a UI list.

**Why it happens:** `app/blog/layout.tsx` wraps all routes under `/blog`. The prose plugin applies `line-height`, font sizes, and spacing to everything inside.

**How to avoid:** Put `prose dark:prose-invert` ONLY on the `<article>` element inside `app/blog/[slug]/page.tsx`. The `app/blog/layout.tsx` should only provide max-width container and padding.

### Pitfall 5: gray-matter CommonJS Import in ESM Context

**What goes wrong:** `import matter from 'gray-matter'` may raise a TypeScript error because gray-matter ships with a CommonJS `.d.ts` that declares `export = matter` (not `export default`).

**Why it happens:** gray-matter is a CommonJS package; its TypeScript types use `export =` syntax. ESM default imports require interop handling.

**How to avoid:** Use `import matter from 'gray-matter'` — TypeScript's `esModuleInterop: true` (enabled by default in Next.js tsconfig) handles this transparently. If TypeScript complains, use `import * as matter from 'gray-matter'` as a fallback.

**Warning signs:** `Module '"gray-matter"' has no default export` TypeScript error.

---

## Code Examples

### Complete next.config.mjs

```js
// Source: rehype-pretty.pages.dev#next-js + verified via @next/mdx/index.js source
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false,
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [rehypePrettyCode, { theme: 'github-dark' }],
    ],
  },
})

export default withMDX(nextConfig)
```

### gray-matter + reading-time together

```typescript
// Source: gray-matter README (gray-matter.d.ts), reading-time README (index.d.ts)
import matter from 'gray-matter'
import readingTime from 'reading-time'
import fs from 'fs'
import path from 'path'

const raw = fs.readFileSync(path.join(process.cwd(), 'content/blog/my-post.mdx'), 'utf-8')
const { data, content } = matter(raw)
//=> data: { title: '...', date: '...', published: true, tags: [...] }
//=> content: markdown body WITHOUT the YAML frontmatter block

const { text } = readingTime(content)
//=> text: "3 min read"
```

### @tailwindcss/typography in tailwind.config.ts

```typescript
// Source: github.com/tailwindlabs/tailwindcss-typography
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{js,ts,jsx,tsx,mdx}',
    './mdx-components.tsx',
  ],
  theme: {
    extend: {
      // ... existing theme extensions ...
    },
  },
  plugins: [typography],
} satisfies Config

export default config
```

### Date formatting without extra dependency

```typescript
// Source: CONTEXT.md specifics section — Intl.DateTimeFormat
function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(isoDate))
  // => "May 24, 2026"
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-mdx-remote` | `@next/mdx` (already in project) | `next-mdx-remote` archived Feb 2026 | Project already uses correct approach |
| `contentlayer` | `@next/mdx` + custom `lib/posts.ts` | `contentlayer` abandoned Jun 2023 | Project already uses correct approach |
| Synchronous `params` in page components | `params: Promise<{ slug: string }>` (awaited) | Next.js 15+ | Existing stub at `app/blog/[slug]/page.tsx` MUST be updated |
| `next dev --webpack` (explicit) | `next dev` (Turbopack default) | Next.js v16.0.0 | Turbopack is now default; `@next/mdx` handles this transparently |

**Deprecated/outdated:**
- `import { githubDark } from 'shiki'` then passing the object to rehype-pretty-code: Not needed. String `'github-dark'` is simpler and works identically.
- `contentlayer`: Abandoned. Already excluded from project.
- `next-mdx-remote`: Archived Feb 2026. Already excluded from project.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@tailwindcss/typography` `prose-invert` default colors are acceptable without custom override | Code Examples | Index and post page typography may clash with project's `--color-text` tokens; low risk — planner can add `prose-zinc` or `prose-neutral` modifier |
| A2 | Nekomori is the name of Yash's project (referenced in REQUIREMENTS.md PORT-04) | Code Examples | If project is named differently, seed post file/frontmatter needs adjustment |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

---

## Open Questions

1. **prose-invert color matching**
   - What we know: `prose-invert` sets white headings and light-gray body text; project uses `--color-text: #e4e4e7` and `--color-text-muted: #71717a`
   - What's unclear: Whether the default `prose-invert` colors (white headings, `zinc-300` body) match the design intent closely enough, or if they need to be overridden with `theme.extend.typography` in tailwind.config.ts
   - Recommendation: Start with defaults; adjust in Phase 2 polish if needed. The difference is subtle.

2. **test-post.mdx frontmatter strategy**
   - What we know: It currently has NO frontmatter at all
   - What's unclear: Adding frontmatter may change how `@next/mdx` renders it (it currently renders fine without it)
   - Recommendation: Add minimal `published: false` frontmatter. `gray-matter` handles "no frontmatter" gracefully (returns empty `data` object), but the `getAllPosts()` filter checks `data.published` — without frontmatter the post would still appear (falsy check). Safest to add `published: false` explicitly.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js `fs` / `path` modules | `lib/posts.ts` | ✓ | Built-in (Node 24.11.0) | — |
| gray-matter | Frontmatter parsing | ✓ | 4.0.3 (installed) | — |
| reading-time | Reading time computation | ✓ | 1.5.0 (installed) | — |
| @tailwindcss/typography | Prose typography | ✓ | 0.5.19 (installed) | Custom CSS prose styles |
| rehype-pretty-code | Syntax highlighting | ✓ | 0.14.3 (already in package.json) | — |
| shiki | rehype-pretty-code peer dep | ✓ | 4.1.0 (already in package.json) | — |

**Missing dependencies with no fallback:** None.

---

## Sources

### Primary (HIGH confidence)
- `node_modules/@next/mdx/index.js` — Verified Turbopack handling: detects `TURBOPACK` env and registers webpack loader rule with function references
- `node_modules/@next/mdx/mdx-js-loader.js` — Verified: accepts both string plugin names and function references; imports string names dynamically
- `node_modules/reading-time/lib/reading-time.js` — Verified: raw character-by-character word counting; no MDX awareness
- `node_modules/gray-matter/gray-matter.d.ts` — Verified: `matter(input).content` is frontmatter-stripped body
- `node_modules/reading-time/index.d.ts` — Verified TypeScript type: `readingTime(text).text` returns `string`
- `nextjs.org/docs/app/guides/mdx` — Official Next.js 16.2.6 MDX docs (fetched 2026-05-24)
- `nextjs.org/docs/app/api-reference/functions/generate-static-params` — Confirmed async params pattern (fetched 2026-05-24)
- `nextjs.org/docs/app/api-reference/turbopack` — Confirmed Turbopack is default in v16 (fetched 2026-05-24)
- `rehype-pretty.pages.dev` — Official rehype-pretty-code docs, Next.js section (fetched 2026-05-24)

### Secondary (MEDIUM confidence)
- `github.com/tailwindlabs/tailwindcss-typography` — Typography plugin README; `prose dark:prose-invert` pattern and tailwind.config.ts plugin registration

### Tertiary (LOW confidence)
- None

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in node_modules and against npm registry
- Architecture: HIGH — patterns verified against Next.js 16.2.6 official docs and @next/mdx source
- Pitfalls: HIGH for P1/P2/P3 (verified from source code); MEDIUM for P4/P5 (derived from patterns)

**Research date:** 2026-05-24
**Valid until:** 2026-06-24 (30 days — stable ecosystem)
