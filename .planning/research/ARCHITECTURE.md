# Architecture Patterns

**Project:** yashkadam.com — Next.js Portfolio + MDX Blog
**Researched:** 2026-05-24
**Confidence:** HIGH (verified against Next.js 16.2.6 official docs, May 2026)

---

## Recommended Architecture

A hybrid single-page/multi-page application. The portfolio itself is one scrolling page (`/`). The blog is a separate route tree (`/blog`, `/blog/[slug]`). Both live in one Next.js App Router codebase and share the root layout.

```
yashkadam.com/           ← Single scrolling page (Hero, About, Work, Projects, Skills, Contact)
yashkadam.com/blog       ← Blog index (SSG, list of all posts)
yashkadam.com/blog/[slug] ← Individual post (SSG, MDX rendered)
```

---

## Directory Structure

```
portfolio/
├── app/
│   ├── layout.tsx                  ← Root layout: fonts, global nav, footer
│   ├── page.tsx                    ← Portfolio home (imports all sections)
│   ├── globals.css
│   ├── blog/
│   │   ├── layout.tsx              ← Blog sub-layout: prose wrapper, back link
│   │   ├── page.tsx                ← Blog index: reads all MDX frontmatter, renders list
│   │   └── [slug]/
│   │       ├── page.tsx            ← Post page: dynamic import of MDX, SSG
│   │       └── opengraph-image.tsx ← Dynamic OG image via ImageResponse
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx              ← Top nav (name/logo + section links)
│   │   └── Footer.tsx              ← Social links, copyright
│   ├── sections/                   ← One file per portfolio section
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── WorkHistory.tsx
│   │   ├── Projects.tsx
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   ├── blog/
│   │   ├── PostCard.tsx            ← Card in blog index list
│   │   └── PostHeader.tsx          ← Title, date, reading time inside a post
│   └── ui/                         ← Primitives reused across sections
│       ├── Button.tsx
│       ├── Badge.tsx
│       └── SectionWrapper.tsx      ← Consistent section padding/max-width
│
├── content/
│   └── blog/
│       ├── first-post.mdx
│       └── second-post.mdx
│
├── lib/
│   ├── posts.ts                    ← getAllPosts(), getPostBySlug() — server-only
│   └── utils.ts                    ← cn(), formatDate(), readingTime()
│
├── public/
│   ├── images/
│   │   ├── projects/               ← Project screenshots (used with next/image)
│   │   └── og/                     ← Static OG fallback image
│   └── fonts/                      ← Self-hosted fonts if needed
│
├── mdx-components.tsx              ← REQUIRED by @next/mdx for App Router
├── next.config.mjs                 ← MDX config, pageExtensions, redirects
├── tailwind.config.ts
└── tsconfig.json
```

---

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `app/layout.tsx` | Root HTML shell, fonts, global metadata | Navbar, Footer — renders all pages as `children` |
| `app/page.tsx` | Portfolio page assembly | All `components/sections/*` — purely compositional |
| `components/sections/*` | Visual content for each portfolio section | `components/ui/*` for primitives; Framer Motion for animation |
| `app/blog/page.tsx` | Blog index | `lib/posts.ts` (reads frontmatter), `components/blog/PostCard.tsx` |
| `app/blog/[slug]/page.tsx` | Individual post render | Dynamic MDX import, `lib/posts.ts` for `generateStaticParams`, `components/blog/PostHeader.tsx` |
| `lib/posts.ts` | Data access layer — reads `content/blog/*.mdx` frontmatter | `fs`, `gray-matter`; called only from Server Components |
| `mdx-components.tsx` | Global MDX element overrides | Maps `h1`, `img`, `pre`, etc. to styled React components; `next/image` for inline images |
| `app/blog/[slug]/opengraph-image.tsx` | Per-post OG image | `lib/posts.ts` for post title; `next/og` ImageResponse |

---

## Data Flow

### Portfolio page (static)

```
app/page.tsx
  └── imports components/sections/Hero.tsx, About.tsx, etc.
      └── data is hardcoded (name, role, projects list, skills)
         No file I/O, no async fetch — pure component tree
```

### Blog index page

```
app/blog/page.tsx  (Server Component, SSG at build time)
  └── calls lib/posts.ts → getAllPosts()
      └── fs.readdirSync('content/blog/')
          └── for each .mdx file: fs.readFileSync → gray-matter(source)
              └── returns { slug, title, date, description, tags }[]
  └── sorts by date desc
  └── renders <PostCard /> for each post
```

### Blog post page

```
app/blog/[slug]/page.tsx  (Server Component, SSG at build time)
  └── generateStaticParams() → lib/posts.ts → getAllPosts() → slug[]
  └── Page({ params: { slug } })
      └── dynamic import(`@/content/blog/${slug}.mdx`)
          └── @next/mdx compiles .mdx → React Server Component at build time
      └── renders <PostHeader /> with frontmatter
      └── renders <Post /> (the MDX default export)
          └── mdx-components.tsx provides element overrides (h1, img → next/image, pre → syntax highlight)
```

### OG image

```
app/blog/[slug]/opengraph-image.tsx
  └── Image({ params: { slug } })
      └── lib/posts.ts → getPostBySlug(slug) → title
      └── returns ImageResponse (JSX → PNG via next/og)
```

---

## MDX Pipeline Detail

The pipeline uses `@next/mdx` (native Next.js approach) rather than `next-mdx-remote`. Rationale: content is in-repo, not remote; native approach has zero client-side JS overhead since MDX compiles to RSC at build time.

```
content/blog/my-post.mdx
  │
  │  (build time)
  ▼
@next/mdx webpack loader
  ├── remark plugins: remark-gfm (tables, strikethrough), remark-frontmatter
  ├── rehype plugins: rehype-slug, rehype-pretty-code (syntax highlight)
  └── outputs: React Server Component module
  │
  ▼
app/blog/[slug]/page.tsx dynamic import
  │
  ▼
mdx-components.tsx element map
  │  h1 → <h1 className="...">, img → <Image />, pre → <CodeBlock />
  ▼
app/blog/layout.tsx prose wrapper (Tailwind @tailwindcss/typography)
  │  className="prose prose-invert max-w-3xl mx-auto"
  ▼
Rendered HTML (static, no client JS for content)
```

Frontmatter approach: use `export const metadata = { ... }` inside .mdx files (native @next/mdx pattern) OR keep YAML frontmatter and parse with `gray-matter` in `lib/posts.ts` for the index page. Use both: YAML for gray-matter parsing (index), named export for individual post metadata (Next.js Metadata API).

Recommended frontmatter schema per post:

```mdx
---
title: "Post Title"
date: "2026-05-01"
description: "One sentence summary for index and meta description."
tags: ["typescript", "architecture"]
published: true
---
```

---

## Routing

### Portfolio home: single scrolling page

`app/page.tsx` renders all sections in order. No separate routes for Hero/About/etc. Smooth-scroll navigation via anchor links (`#about`, `#projects`). Framer Motion `useInView` handles scroll-triggered animations.

### Blog: separate route tree

```
/blog          → app/blog/page.tsx       (post list, SSG)
/blog/[slug]   → app/blog/[slug]/page.tsx (post content, SSG)
```

Subdomain redirect (`blog.yashkadam.com → yashkadam.com/blog`) handled in `next.config.mjs` via `redirects()`:

```js
async redirects() {
  return [
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'blog.yashkadam.com' }],
      destination: 'https://yashkadam.com/blog/:path*',
      permanent: true,
    },
  ]
}
```

---

## Static Generation Strategy

| Page | Strategy | Rationale |
|------|----------|-----------|
| `/` (portfolio) | SSG (default, no dynamic data) | Content never changes at runtime; maximum performance |
| `/blog` | SSG (reads files at build time) | Post list built from filesystem at build time |
| `/blog/[slug]` | SSG via `generateStaticParams` | All slugs known at build time; `dynamicParams = false` returns 404 for unknown slugs |
| OG images | SSG via `opengraph-image.tsx` | Generated once per post at build time |
| API routes | None needed | No server-side data mutations required |

On Vercel, any new blog post committed to `content/blog/` triggers a new deployment (git push → Vercel auto-deploy → rebuild all SSG pages). This is the intended workflow for an in-repo MDX blog.

---

## Image Handling

### Project screenshots

Store in `public/images/projects/`. Use `next/image` with explicit `width` and `height` for layout stability.

```tsx
<Image
  src="/images/projects/nekomori.png"
  alt="Nekomori — anime schedule tracker"
  width={1200}
  height={630}
  className="rounded-lg"
  priority={false}   // lazy load; set priority={true} only for above-fold images
/>
```

### Hero/avatar image

Above the fold — use `priority={true}` to prevent LCP penalty.

### Inline blog images

Override `img` in `mdx-components.tsx` to route through `next/image`:

```tsx
img: (props) => (
  <Image
    sizes="(max-width: 768px) 100vw, 720px"
    style={{ width: '100%', height: 'auto' }}
    {...(props as ImageProps)}
  />
),
```

### OG images

Use `app/blog/[slug]/opengraph-image.tsx` with `ImageResponse` from `next/og`. Size: 1200x630. Renders post title text in brand font. No external image dependency.

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Client-side MDX rendering
**What:** Using `next-mdx-remote` with client components to render MDX.
**Why bad:** Bundles MDX runtime into client JS, increases bundle size, loses RSC benefits.
**Instead:** Use `@next/mdx` with dynamic imports in Server Components — MDX compiles to RSC at build time, zero client JS for content.

### Anti-Pattern 2: Reading MDX files in Client Components
**What:** Importing `fs` or calling `gray-matter` from a component with `'use client'`.
**Why bad:** `fs` is not available in the browser; will break.
**Instead:** All file system access in `lib/posts.ts` called only from Server Components or `generateStaticParams`.

### Anti-Pattern 3: Unoptimized images with raw `<img>` tags
**What:** Using `<img src="/images/project.png">` directly.
**Why bad:** No lazy loading, no format optimization (WebP/AVIF), no size hints — hurts CWV.
**Instead:** Always use `next/image`; override `img` in `mdx-components.tsx` for blog content.

### Anti-Pattern 4: Flat component directory
**What:** All components in one `components/` directory.
**Why bad:** Hard to distinguish layout, sections, blog, and UI primitives as the codebase grows.
**Instead:** Group by concern: `components/layout/`, `components/sections/`, `components/blog/`, `components/ui/`.

### Anti-Pattern 5: Inline section data
**What:** Project/work data defined inside JSX in section components.
**Why bad:** Component becomes hard to read; data and presentation mixed; hard to extend.
**Instead:** Export data objects from a co-located `data.ts` in the section folder or from `lib/data.ts`, then import into the section component.

---

## Scalability Considerations

| Concern | At launch (~5 posts) | At 50 posts | At 500 posts |
|---------|---------------------|-------------|--------------|
| Build time | Negligible | ~30s | May need ISR or pagination |
| Post listing | In-memory sort, instant | In-memory sort, instant | Consider paginated API route |
| Search | Not needed | Not needed | Add pagefind (static search) |
| MDX compilation | Fast | Fast | Still fast (parallel per-file) |

For this portfolio, 50 posts is a realistic ceiling for years. The current SSG architecture will not require reconsideration until well beyond that.

---

## Suggested Build Order

Dependencies flow upward: infrastructure before data layer before components before pages.

```
Phase 1: Foundation
  1. next.config.mjs — MDX config, pageExtensions, redirects
  2. mdx-components.tsx — global element overrides (h1, img, pre)
  3. app/layout.tsx — root layout, fonts
  4. components/ui/* — Button, Badge, SectionWrapper (used by everything above)
  5. components/layout/Navbar.tsx + Footer.tsx

Phase 2: Portfolio page
  6. lib/data.ts — projects[], workHistory[], skills[] as typed constants
  7. components/sections/Hero.tsx (uses data.ts)
  8. components/sections/About.tsx
  9. components/sections/WorkHistory.tsx
  10. components/sections/Projects.tsx
  11. components/sections/Skills.tsx
  12. components/sections/Contact.tsx
  13. app/page.tsx — assembles sections

Phase 3: Blog infrastructure
  14. lib/posts.ts — getAllPosts(), getPostBySlug()
  15. content/blog/ — 1-2 real seed posts
  16. components/blog/PostCard.tsx
  17. components/blog/PostHeader.tsx
  18. app/blog/layout.tsx — prose wrapper

Phase 4: Blog pages
  19. app/blog/page.tsx — index
  20. app/blog/[slug]/page.tsx — post with generateStaticParams
  21. app/blog/[slug]/opengraph-image.tsx

Phase 5: Polish
  22. Framer Motion scroll animations on sections
  23. Syntax highlighting (rehype-pretty-code)
  24. Reading time in PostHeader
  25. SEO: generateMetadata for blog posts
```

Key dependency rules:
- `lib/posts.ts` must exist before any blog page
- `mdx-components.tsx` must exist before MDX can render (App Router requires it)
- `components/ui/*` should be built first — sections depend on them
- `next.config.mjs` MDX setup must be in place before any `.mdx` import works

---

## Sources

- Next.js App Router MDX guide: https://nextjs.org/docs/app/guides/mdx (verified v16.2.6, 2026-05-19)
- Next.js generateStaticParams: https://nextjs.org/docs/app/api-reference/functions/generate-static-params (HIGH confidence, Context7 verified)
- Next.js metadata + OG images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images (HIGH confidence, Context7 verified)
- Next.js Image component: https://nextjs.org/docs/app/api-reference/components/image (HIGH confidence, Context7 verified)
- gray-matter: https://github.com/jonschlinkert/gray-matter (HIGH confidence, Context7 verified)
- Vercel Portfolio Starter Kit (official reference): https://vercel.com/templates/next.js/portfolio-starter-kit
