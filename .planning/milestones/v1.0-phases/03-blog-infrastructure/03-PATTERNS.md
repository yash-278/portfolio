# Phase 3: Blog Infrastructure - Pattern Map

**Mapped:** 2026-05-24
**Files analyzed:** 8
**Analogs found:** 7 / 8

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `lib/posts.ts` | utility/data-layer | file-I/O + transform | `lib/utils.ts` | role-partial (same lib/ layer, different I/O) |
| `app/blog/page.tsx` | page (Server Component) | request-response + CRUD | `app/page.tsx` + `components/ProjectsSection.tsx` | role-match |
| `app/blog/[slug]/page.tsx` | page (Server Component, dynamic) | request-response + file-I/O | `app/blog/[slug]/page.tsx` (existing stub) | exact (replace) |
| `app/blog/layout.tsx` | layout (Server Component) | request-response | `app/layout.tsx` | role-match |
| `next.config.mjs` | config | — | `next.config.mjs` (existing) | exact (modify) |
| `tailwind.config.ts` | config | — | `tailwind.config.ts` (existing) | exact (modify) |
| `content/blog/building-nekomori.mdx` | content/MDX | — | `content/blog/test-post.mdx` | role-match |
| `content/blog/test-post.mdx` | content/MDX | — | `content/blog/test-post.mdx` (existing) | exact (modify) |

---

## Pattern Assignments

### `lib/posts.ts` (utility, file-I/O + transform)

**Analog:** `lib/utils.ts` (same layer, named export functions, no default export, TypeScript)

**Imports pattern** (`lib/utils.ts` lines 2-3):
```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
```
Follow the same module style: named imports, no barrel re-exports, no `'use client'` directive. This is a server-only module — add no directives at all (server-only by default in App Router).

**Core pattern** — new file combining `fs`, `gray-matter`, `reading-time`:
```typescript
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

      if (!data.published) return null

      const { text } = readingTime(content) // Pass matter(raw).content — NOT raw

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

**Export pattern:** Named exports only (`export interface`, `export function`). No default export. Matches `lib/utils.ts`.

---

### `app/blog/page.tsx` (Server Component, request-response + CRUD)

**Analog:** `app/page.tsx` (lines 1-46) for the Server Component + metadata pattern; `components/ProjectsSection.tsx` (lines 20-73) for the list-with-items rendering pattern.

**Metadata pattern** (from `app/page.tsx` lines 8-34):
```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Yash Kadam',
  description: 'Technical writing on fullstack development, TypeScript, and building products.',
}
```
No `'use client'` — Server Component by default.

**Container pattern** (from `app/blog/page.tsx` lines 3-4 — existing stub):
```typescript
// Existing stub uses max-w-5xl + px-6 + py-24
<div className="mx-auto max-w-5xl px-6 py-24">
```
The blog sub-layout (`app/blog/layout.tsx`) will provide `max-w-3xl px-6 py-16` — the page itself only renders the list.

**List-of-items pattern** (from `components/ProjectsSection.tsx` lines 35-69):
```typescript
// Vertical stacked list with space-y-*
<div className="mt-10 space-y-10">
  {items.map((item) => (
    <article key={item.slug} className="group">
      <h2 className="text-lg font-semibold text-text ...">
        {item.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        {item.description}
      </p>
    </article>
  ))}
</div>
```
Apply same spacing and typography token conventions (`text-text`, `text-text-muted`, `font-semibold`, `font-mono`, `text-xs`).

**Tag pill pattern** (from `components/ProjectsSection.tsx` lines 57-63):
```typescript
<span className="rounded-md bg-surface px-2.5 py-1 font-mono text-xs text-text-muted">
  {tag}
</span>
```
Reuse this exact pattern for blog post tags on the index page.

---

### `app/blog/[slug]/page.tsx` (Server Component, dynamic, file-I/O)

**Analog:** `app/blog/[slug]/page.tsx` (existing stub, lines 1-13) — replace entirely; also `app/page.tsx` for metadata export pattern.

**Critical fix — existing stub has wrong params type** (stub line 7):
```typescript
// WRONG (existing stub):
export default function BlogPost({ params }: { params: { slug: string } }) {

// CORRECT (Next.js 16):
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
```

**generateStaticParams pattern** (from RESEARCH.md Pattern 3):
```typescript
export function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export const dynamicParams = false
```

**Dynamic MDX import pattern** (from RESEARCH.md Pattern 3):
```typescript
let Post: React.ComponentType
try {
  const module = await import(`@/content/blog/${slug}.mdx`)
  Post = module.default
} catch {
  notFound()
}
```
Note: `.mdx` extension in the template literal is REQUIRED. Without it, Turbopack/Webpack cannot resolve the module.

**Prose wrapper** — `prose dark:prose-invert` goes on the `<article>` element HERE, NOT in the layout:
```typescript
return (
  <article className="prose dark:prose-invert max-w-none">
    <Post />
  </article>
)
```

**Back-link pattern** (D-06 — `← All posts` above the article, derived from Navbar.tsx `Link` usage):
```typescript
import Link from 'next/link'

// Above the <article>:
<Link
  href="/blog"
  className="mb-8 inline-flex items-center gap-1 font-mono text-xs text-text-muted transition-colors duration-150 hover:text-accent"
>
  ← All posts
</Link>
```

---

### `app/blog/layout.tsx` (Server Component layout)

**Analog:** `app/layout.tsx` (lines 29-65) for layout component structure; existing `app/blog/page.tsx` stub (line 3) for the container class values in use.

**Layout component pattern** (from `app/layout.tsx` lines 29-35):
```typescript
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ...body
}
```
No `'use client'`. No metadata export (metadata lives in individual pages). Children prop typed as `React.ReactNode`.

**Container pattern** (from `app/layout.tsx` line 57 and blog stub line 3):
```typescript
// Root layout uses max-w-5xl px-6 for wide sections
// Blog sub-layout uses narrower max-w-3xl for readable prose
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {children}
    </div>
  )
}
```
No `prose` classes on this wrapper — prose belongs only on the post `<article>`.

---

### `next.config.mjs` (config, modify)

**Analog:** `next.config.mjs` (existing, lines 1-17) — modify in place.

**Existing file structure** (lines 1-17):
```javascript
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false, // REQUIRED: disable Rust MDX compiler so rehype plugins work
  },
}

// Comment mentions Phase 3 will add rehype-pretty-code here
const withMDX = createMDX({
  options: {},
})

export default withMDX(nextConfig)
```

**Add pattern** — insert import at top, populate `options.rehypePlugins`:
```javascript
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'  // ADD

// ...nextConfig unchanged...

const withMDX = createMDX({
  options: {
    rehypePlugins: [                                 // ADD
      [rehypePrettyCode, { theme: 'github-dark' }], // ADD — string theme name, NOT imported object
    ],                                               // ADD
  },
})
```

---

### `tailwind.config.ts` (config, modify)

**Analog:** `tailwind.config.ts` (existing, lines 1-37) — modify in place.

**Existing file structure** (lines 1-37):
```typescript
import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: ['class'],
  content: [...],       // keep unchanged
  theme: { extend: { fontFamily: {...}, colors: {...} } },  // keep unchanged
  plugins: [],          // MODIFY: add typography
} satisfies Config

export default config
```

**Add pattern** — insert import, add to plugins array:
```typescript
import typography from '@tailwindcss/typography'  // ADD at top with other imports

// plugins array:
plugins: [typography],  // REPLACE empty array
```

---

### `content/blog/building-nekomori.mdx` (content, new)

**Analog:** `content/blog/test-post.mdx` (lines 1-12) for MDX file structure (heading + prose + fenced code blocks).

**Frontmatter schema** (D-01, D-09 — from RESEARCH.md Pattern 5):
```yaml
---
title: "Building Nekomori: ..."
date: "2026-05-24"
description: "..."
tags: ["nextjs", "typescript", "react"]
published: true
---
```
All five required fields must be present. `published: true` ensures it appears on the blog index.

**Content structure pattern** (from `content/blog/test-post.mdx`):
```markdown
# Heading (h1 from prose)

Prose paragraph...

## Sub-heading (h2)

More prose...

```typescript
// Fenced code blocks with language specifier — processed by rehype-pretty-code
```
```

Nekomori is described in `components/ProjectsSection.tsx` (line 3) as an anime schedule tracker and personal watchlist manager. The seed post should focus on its most technically interesting aspect — the architecture decision that shaped the project.

---

### `content/blog/test-post.mdx` (content, modify)

**Analog:** Itself (lines 1-12) — add frontmatter only.

**Modification** — prepend frontmatter block (D-10):
```yaml
---
title: "Test Post"
date: "2026-01-01"
description: "Smoke test for MDX pipeline."
tags: []
published: false
---
```
Existing body content (lines 1-12) stays unchanged below the frontmatter delimiter. `gray-matter` will parse and strip the YAML; `getAllPosts()` will skip it because `published: false`.

---

## Shared Patterns

### Server Component Convention
**Source:** `app/layout.tsx` (line 1 — no `'use client'`), `app/page.tsx` (line 1 — no directive)
**Apply to:** `lib/posts.ts`, `app/blog/page.tsx`, `app/blog/layout.tsx`, `app/blog/[slug]/page.tsx`

All new files are Server Components (or server-only utilities). Do NOT add `'use client'`. The only client component in the project is `components/Navbar.tsx` (line 1) which needs `usePathname`. Blog files need no client-side interactivity.

### Typography Token Conventions
**Source:** `components/ProjectsSection.tsx` (lines 29-65), `components/Navbar.tsx` (lines 18, 27-30)
**Apply to:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`

Use these token classes consistently:
```
text-text          — primary text (headings, labels)
text-text-muted    — secondary text (dates, descriptions, meta)
text-accent        — interactive/accent color (hover states, active nav)
bg-surface         — card/pill backgrounds
font-mono          — monospace for code, tags, timestamps, reading time
font-semibold      — heading weight
text-xs / text-sm  — small UI text (tags, dates, reading time)
text-sm leading-relaxed  — body prose within non-MDX UI
transition-colors duration-150  — all hover transitions
```

### Path Alias Convention
**Source:** `app/layout.tsx` (lines 7-9), `components/Navbar.tsx` (line 5), `components/ProjectsSection.tsx` (line 1)
**Apply to:** All new TypeScript files

Use `@/` alias for all project-root imports:
```typescript
import { getAllPosts } from '@/lib/posts'
import { cn } from '@/lib/utils'
import Link from 'next/link'  // Next.js builtins use bare specifiers
```

### Link and Navigation Pattern
**Source:** `components/Navbar.tsx` (lines 4, 16-30)
**Apply to:** `app/blog/page.tsx` (post list links), `app/blog/[slug]/page.tsx` (back link)
```typescript
import Link from 'next/link'

// Internal links always use next/link, not <a>:
<Link href="/blog/my-post" className="...text-text hover:text-accent...">
  Post Title
</Link>
```

### Date Formatting (no extra dependency)
**Source:** RESEARCH.md Code Examples section; `Intl.DateTimeFormat` is a browser/Node built-in
**Apply to:** `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`
```typescript
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

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `app/blog/layout.tsx` | layout | request-response | No sub-layout exists in the project yet; only the root `app/layout.tsx` exists. Pattern is straightforward — children wrapper with container classes. |

(Listed as "no analog" in the strict sense; the root layout provides structural guidance even though it is not a close functional match.)

---

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `content/blog/`, `next.config.mjs`, `tailwind.config.ts`, `mdx-components.tsx`
**Files scanned:** 14
**Pattern extraction date:** 2026-05-24
