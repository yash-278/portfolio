# Domain Pitfalls

**Domain:** Next.js 15 App Router + MDX blog + personal portfolio on Vercel
**Researched:** 2026-05-24
**Confidence:** HIGH — all critical claims verified against official Next.js docs (v16.2.6, last updated 2026-05-19) and Context7

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deployments, or invisible production failures.

---

### Pitfall 1: Wrong MDX import path for App Router — importing from the Pages Router API

**What goes wrong:** `next-mdx-remote` has two separate entry points: the legacy `next-mdx-remote` (Pages Router, requires `serialize` + `<MDXRemote serializedOutput />`) and `next-mdx-remote/rsc` (App Router, async Server Component). Importing from the wrong one causes either a runtime error ("component must be a Server Component") or silent hydration failure where MDX renders as raw text.

**Why it happens:** Documentation for `next-mdx-remote` historically showed the Pages Router pattern. Community blog posts and AI code generation frequently reproduce the old pattern.

**Consequences:** MDX content either fails to render or causes a build error. The `serialize()` function does not exist in the RSC import path, and `<MDXRemote>` in the RSC path does not accept a `serializedOutput` prop — it accepts `source` directly.

**Prevention:**
- In App Router, import exclusively from `next-mdx-remote/rsc`
- `<MDXRemote source={rawMdxString} />` is an async Server Component; do not wrap it in `'use client'`
- Never call `serialize()` — it is not exported from `/rsc`
- `MDXProvider` context does not work in RSC mode; pass `components` directly as a prop to `<MDXRemote>`

**Detection:** Build error mentioning `serialize is not a function`, or MDX renders as raw text with JSX visible in the browser.

**Phase:** Foundation / blog setup phase

---

### Pitfall 2: Missing `mdx-components.tsx` file when using `@next/mdx`

**What goes wrong:** `@next/mdx` with App Router requires a `mdx-components.tsx` file at the project root (same level as `app/`). Without it, the build fails silently or MDX files are treated as plain text. This file is not optional — it is a required file convention.

**Why it happens:** Developers follow tutorials that omit this step, or copy configuration from Pages Router examples.

**Consequences:** MDX pages either 404, render unstyled, or fail to compile. Custom component mapping (e.g., replacing `<img>` with `next/image`) does not take effect.

**Prevention:**
```tsx
// mdx-components.tsx — must exist at project root
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(): MDXComponents {
  return {}
}
```
The file can start empty but must exist. Add custom component mappings here (e.g., `img` → `next/image`, `pre` → syntax-highlighted code block).

**Detection:** MDX pages return 404 or render raw markdown syntax in the browser.

**Phase:** Foundation / blog setup phase

---

### Pitfall 3: `@next/mdx` does not support frontmatter by default

**What goes wrong:** Writing `---\ntitle: My Post\n---` YAML frontmatter at the top of MDX files and expecting `@next/mdx` to parse it results in the frontmatter being treated as literal text and rendered visibly on the page.

**Why it happens:** Frontmatter is standard in markdown ecosystems (Jekyll, Hugo, Gatsby). Developers assume it works out of the box.

**Consequences:** Blog posts render with `---` and YAML key-value pairs visible at the top. Post titles and dates cannot be extracted for the blog index.

**Prevention:** Two options:
1. **Export a named constant from MDX** (no plugin needed): `export const metadata = { title: 'My Post', date: '2026-05-24' }` — importable in the page file
2. **Add `remark-frontmatter` + `remark-mdx-frontmatter` plugins** to `next.config.mjs` to parse YAML frontmatter conventionally

Do not use `gray-matter` directly against MDX files processed by `@next/mdx` — `gray-matter` is for file-system reads before compilation, not for compiled MDX. It is valid when building a custom pipeline with `next-mdx-remote/rsc` and reading files with `fs.readFileSync`.

**Detection:** Blog post content begins with `---` visible in the rendered HTML.

**Phase:** Blog content model phase

---

### Pitfall 4: Dark mode FOUC (flash of unstyled content) from `localStorage` read after hydration

**What goes wrong:** Reading `localStorage` to determine dark/light mode inside a React component causes the page to render in the default (light) theme on the server, then flash to dark after hydration. This is visible as a white flash on load for users with dark mode preference saved.

**Why it happens:** `localStorage` is not available during SSR. Reading it in `useEffect` means the theme applies after first paint.

**Consequences:** Visible white flash on every page load for dark-mode users. This is a well-known UX defect that makes a site feel unpolished.

**Prevention (verified from official Next.js docs):** Inject an inline blocking script in `RootLayout` that runs before React hydrates:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

`suppressHydrationWarning` on `<html>` is required — the inline script changes the `data-theme` attribute before React hydrates, creating a mismatch that would otherwise throw a warning.

**Detection:** White flash visible when loading the page with browser DevTools → throttle to Slow 3G. Or check the network waterfall: if theme class appears after the JS execution marker, FOUC is happening.

**Phase:** Design / theming phase (Phase 1 or whenever dark mode is added)

---

### Pitfall 5: Framer Motion forcing entire component trees into client bundles

**What goes wrong:** Importing `motion` from `framer-motion` in any component automatically adds the full Framer Motion bundle (~33KB gzipped for `domMax`) to the client bundle. Using `motion` in a layout component infects every page that uses that layout.

**Why it happens:** `framer-motion` requires browser APIs and cannot run as a Server Component. Any file that imports `motion` automatically becomes a Client Component boundary, even if the animation is simple.

**Consequences:**
1. Every page that shares the animated layout downloads Framer Motion even if it has no animations
2. Syntax highlighting, chart libraries, and other heavy libraries in the same component tree also get pulled client-side

**Prevention:**
- Use `LazyMotion` with `domAnimation` (not `domMax`) — reduces animation features to ~17KB
- Isolate animated components into dedicated small Client Components; never put `motion` directly in layouts or page files that also contain heavy data-fetching logic
- Use `<m.div>` (from `LazyMotion`) instead of `<motion.div>` to enable proper tree-shaking
- Apply `'use client'` at the leaf level, not on parent containers

```tsx
// Correct: isolated client component
'use client'
import { m, LazyMotion, domAnimation } from 'framer-motion'

export function AnimatedCard({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {children}
      </m.div>
    </LazyMotion>
  )
}
```

**Detection:** Run `ANALYZE=true npm run build` with `@next/bundle-analyzer`; look for `framer-motion` in the client bundle of pages that should have minimal JS (e.g., a static blog post page).

**Phase:** Component architecture phase — must be addressed before adding animations

---

### Pitfall 6: Subdomain redirect (`blog.yashkadam.com` → `yashkadam.com/blog`) requires both DNS configuration AND Vercel middleware

**What goes wrong:** Adding `blog.yashkadam.com` as a domain in Vercel project settings alone does not redirect it to `/blog`. Vercel's domain redirect UI (Project Settings → Domains) only redirects one domain to another domain root — it cannot redirect to a path. A Proxy/middleware file is required to inspect the `Host` header and redirect.

**Why it happens:** The Vercel dashboard UI makes it appear that adding the subdomain to the project "handles" it. The redirect-to option in the UI only goes to the root of another domain.

**Consequences:** `blog.yashkadam.com` either 404s or shows the homepage instead of `/blog`.

**Prevention:** Three-step process:
1. Add `blog.yashkadam.com` to the Vercel project (creates a CNAME target)
2. Add the CNAME at the DNS registrar pointing `blog` to `cname.vercel-dns.com`
3. Add a `middleware.ts` (or `proxy.ts` in newer Next.js versions) to handle the redirect:

```ts
// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  if (hostname.startsWith('blog.')) {
    const url = request.nextUrl.clone()
    url.hostname = 'yashkadam.com'
    url.pathname = url.pathname === '/' ? '/blog' : `/blog${url.pathname}`
    return NextResponse.redirect(url, 308)
  }
  return NextResponse.next()
}
```

Use `308` (permanent redirect) so search engines consolidate link equity to the main domain.

**Detection:** Visiting `blog.yashkadam.com` returns the homepage or a 404 after DNS propagates.

**Phase:** Deployment / domain configuration phase

---

## Moderate Pitfalls

Mistakes that cause degraded UX or SEO damage without breaking the build.

---

### Pitfall 7: `metadata` export in Client Components is silently ignored

**What goes wrong:** Exporting `metadata` or `generateMetadata` from a file marked `'use client'` does not throw an error — it simply does nothing. The page gets no `<title>`, no description, and no OG tags.

**Why it happens:** The rule "metadata exports only work in Server Components" is documented but easy to miss. Adding `'use client'` to a page file (e.g., because it needs a scroll listener) silently breaks all SEO metadata.

**Prevention:**
- Never add `'use client'` to `page.tsx` files that export metadata
- Extract interactive parts into child Client Components; keep the page shell as a Server Component
- Verify metadata with `curl -s https://yoursite.com | grep '<title>'` after every deployment

**Detection:** Browser tab shows no title, or `<meta name="description">` is absent from page source. LinkedIn/Twitter post preview shows generic fallback.

**Phase:** Every phase that touches page files

---

### Pitfall 8: OG image absolute URL is not set correctly — relative URLs silently fail

**What goes wrong:** OG image URLs in `metadata.openGraph.images` must be absolute URLs (including protocol and domain). Using `/og.png` or a relative path results in the image array being set but social media crawlers receiving a broken or missing image.

**Why it happens:** Next.js accepts relative paths in the `images` array without throwing an error. The error only surfaces when the URL is inspected by a social media crawler.

**Consequences:** LinkedIn, Twitter/X, and Slack show no image preview when the blog post or portfolio is shared. This is a direct credibility hit for a developer portfolio.

**Prevention:**
```ts
export const metadata = {
  openGraph: {
    images: [
      {
        url: 'https://yashkadam.com/og/post-title.png', // must be absolute
        width: 1200,
        height: 630,
      },
    ],
  },
}
```
Set a `NEXT_PUBLIC_SITE_URL` env var and construct the base URL from it for consistency.

**Detection:** Paste the URL into https://opengraph.xyz or the LinkedIn post inspector. Missing image preview = broken OG URL.

**Phase:** SEO phase / when adding blog post metadata

---

### Pitfall 9: Code syntax highlighting library placed in a Client Component bloats every blog post

**What goes wrong:** Using `prism-react-renderer`, `react-syntax-highlighter`, or similar client-side highlighting libraries in a `'use client'` component adds 100–300KB of tokenization logic to every blog post's JS bundle, even though the output is pure static HTML.

**Why it happens:** These libraries are designed for client-side use and documentation examples show them without Server Component context.

**Consequences:** Blog post pages have 3-10x larger JS bundles than necessary, slowing Time to Interactive and failing Core Web Vitals checks.

**Prevention:** Use server-side highlighting:
- **`rehype-pretty-code`** (uses Shiki under the hood) as a rehype plugin in `next.config.mjs` — zero client JS, runs at build time
- **Shiki** directly in a Server Component via `codeToHtml()` — renders to HTML on the server

```ts
// next.config.mjs — preferred approach
import rehypePrettyCode from 'rehype-pretty-code'

const withMDX = createMDX({
  options: {
    rehypePlugins: [[rehypePrettyCode, { theme: 'github-dark' }]],
  },
})
```

Note: `rehype-pretty-code` requires Shiki themes by string name (e.g., `'github-dark'`), not imported theme objects. Using an imported object causes a build error with Turbopack.

**Detection:** `ANALYZE=true npm run build` shows `shiki` or `prism` in the client bundle for blog post pages.

**Phase:** Blog content rendering phase

---

### Pitfall 10: `next/image` missing `width` and `height` causes Cumulative Layout Shift (CLS)

**What goes wrong:** Using `<Image src="..." alt="..." />` without explicit `width` and `height` (and without `fill`) causes a build error in App Router. If developers use `fill` without the parent having `position: relative`, images either do not render or overflow their container.

**Why it happens:** Developers copy-paste from HTML `<img>` patterns and omit dimensions.

**Consequences:** Layout shift during image load (CLS score degradation), which directly impacts Core Web Vitals — a credibility concern for a developer portfolio.

**Prevention:**
- Always provide `width` and `height` for images with known dimensions
- For the hero profile photo (the main portfolio image), use static import: `import profilePic from './profile.jpg'` — Next.js infers dimensions automatically and generates blur placeholder
- For responsive full-width images: use `fill` with `sizes="100vw"` and `style={{ objectFit: 'cover' }}` on parent with `position: relative`

**Detection:** Chrome DevTools → Performance tab → CLS highlighted in orange during image loads.

**Phase:** Portfolio hero / about section implementation

---

### Pitfall 11: Title metadata `template` set in root layout breaks per-page titles on static export

**What goes wrong:** Using `title: { template: '%s | Yash Kadam', default: 'Yash Kadam' }` in `app/layout.tsx` works correctly for dynamic pages. However, if `output: 'export'` is set in `next.config.js` (for pure static export), dynamic metadata via `generateMetadata` is not supported — only static `metadata` exports work.

**Why it happens:** The v2 branch starts with Next.js 14 which supports both static and dynamic rendering. Using `output: 'export'` is tempting for a portfolio ("it's static content anyway"), but it breaks `generateMetadata` for blog post pages.

**Consequences:** Blog post pages either fail to build with `output: 'export'` or show the default title instead of the post-specific title.

**Prevention:** Do not set `output: 'export'`. Use standard Next.js builds on Vercel (the default). Vercel handles static generation via ISR and `generateStaticParams` without needing `output: 'export'`. The portfolio content is statically generated at build time without this flag.

**Detection:** Blog post page title shows "Yash Kadam" instead of "Post Title | Yash Kadam". Build log shows warnings about dynamic features with static export.

**Phase:** Deployment configuration phase

---

### Pitfall 12: Slug generation from MDX filenames — spaces, uppercase, and special characters

**What goes wrong:** Creating files like `My-First-Post.mdx` or `intro-to-TypeScript.mdx` and using the filename directly as the URL slug results in case-sensitive URLs that may conflict on case-insensitive file systems (macOS dev, Linux prod discrepancy) or include uppercase letters that break canonical URLs.

**Why it happens:** Developers name files naturally; the slug conversion is not made explicit in planning.

**Consequences:**
- `My-First-Post` and `my-first-post` are two different URLs; only one renders correctly on Linux (Vercel)
- Sharing a link with mixed case causes 404 on production even though it works in local dev

**Prevention:**
- Enforce a filename convention: all lowercase, hyphens only, no spaces, no special characters: `my-first-post.mdx`
- In the slug reader, always `.toLowerCase()` the slug before passing to `generateStaticParams`
- Document the convention clearly in a `content/blog/README.md`

**Detection:** Post works in local dev (macOS) but 404s in production (Linux). Check file system case sensitivity with `ls -la content/blog/`.

**Phase:** Blog file structure phase

---

### Pitfall 13: Sitemap uses relative URLs or is missing dynamic blog posts

**What goes wrong:** Generating `app/sitemap.ts` with hardcoded paths like `url: '/blog'` (relative) or forgetting to enumerate MDX files means blog posts are not indexed by Google.

**Why it happens:** The sitemap is often an afterthought. Relative URLs do not cause errors but are silently ignored by search engine crawlers.

**Prevention:**
```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const base = 'https://yashkadam.com'
  return [
    { url: base, lastModified: new Date(), priority: 1 },
    { url: `${base}/blog`, lastModified: new Date(), priority: 0.8 },
    ...posts.map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.date ? new Date(p.date) : new Date(),
      priority: 0.6,
    })),
  ]
}
```

All `url` values must be absolute (include `https://yashkadam.com`).

**Detection:** Visit `yashkadam.com/sitemap.xml` in production; verify each `<loc>` is a full URL. Submit to Google Search Console and check for validation errors.

**Phase:** SEO / launch preparation phase

---

## Minor Pitfalls

Mistakes that degrade quality but are straightforward to fix.

---

### Pitfall 14: RSS feed not generated — readers cannot subscribe to the blog

**What goes wrong:** RSS feed is omitted entirely. Developers who find the blog via RSS-based discovery tools (Feedly, Reeder) cannot subscribe. It is also a signal that the blog was assembled quickly without full attention.

**Prevention:** Create `app/feed.xml/route.ts` as a Route Handler that reads MDX files and returns RSS 2.0 XML. Libraries: `feed` (npm) or hand-rolled XML string. Include all posts, full or summarised.

**Phase:** Blog launch phase

---

### Pitfall 15: Framer Motion `layout` prop on high-frequency update components causes layout thrash

**What goes wrong:** Adding `layout` to a `motion` component that updates frequently (e.g., a list that re-renders on scroll) forces the browser to measure and recalculate layout on every frame, causing jank.

**Prevention:** Reserve the `layout` prop for deliberate, user-triggered transitions (accordion open/close, item reorder). Do not use it on components in scroll handlers or infinite lists.

**Phase:** Any phase adding list or scroll animations

---

### Pitfall 16: Portfolio skills section reads as a junior developer anti-pattern

**What goes wrong:** A long grid of technology logos/tags without context (e.g., "JavaScript, TypeScript, React, Node, Express, MongoDB, Docker, AWS...") signals that the developer is listing rather than demonstrating. Recruiters and technical hiring managers interpret this as filler.

**Why it matters for this project:** Yash's PROJECT.md already identifies the out-of-scope older projects. The same editorial judgment should apply to the skills section.

**Prevention:**
- Anchor every technology to a concrete artifact: "TypeScript — primary language for Nekomori and all current work"
- Group by role relevance, not alphabetical or by logo size
- Prefer a two-tier structure: "actively use daily" vs "have shipped with professionally" — do not list things you watched a tutorial on
- Do not list more than 8-10 items; curate aggressively

**Phase:** Portfolio content phase

---

### Pitfall 17: Dead project links on the projects section permanently damage credibility

**What goes wrong:** A "View Project" or "Live Demo" link that 404s or shows a broken/empty app is worse than no link. It signals negligence.

**Prevention:**
- PROJECT.md already calls out the older demo projects (Twitter clone, Crown Clothing, etc.) as out of scope — this is correct
- For Nekomori and Brew Index: verify live demo URLs exist and load correctly before launch
- If a project has no stable live URL, link only to GitHub; add a badge noting "In active development"
- Automate a link-check CI step that catches 404s before merge

**Phase:** Projects section implementation and every deployment thereafter

---

### Pitfall 18: `robots.txt` disallows all crawlers on staging — deployed to production accidentally

**What goes wrong:** A common pattern is `robots.txt` with `Disallow: /` for preview/staging deployments, configured via environment variable. If the production environment variable is not set correctly on Vercel, the production site blocks all crawlers.

**Prevention:**
```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.NEXT_PUBLIC_SITE_URL === 'https://yashkadam.com'
  return {
    rules: {
      userAgent: '*',
      allow: isProduction ? '/' : undefined,
      disallow: isProduction ? undefined : '/',
    },
    sitemap: 'https://yashkadam.com/sitemap.xml',
  }
}
```

Verify at launch: `curl https://yashkadam.com/robots.txt` must show `Allow: /`.

**Phase:** Deployment / launch phase

---

### Pitfall 19: `NEXT_PUBLIC_` variables are baked in at build time — changing them on Vercel requires a redeploy

**What goes wrong:** A developer adds `NEXT_PUBLIC_SITE_URL` to Vercel environment variables after the first deployment, expects it to take effect immediately, but it does not — `NEXT_PUBLIC_` variables are inlined at build time. Runtime changes require a new `next build`.

**Why it happens:** The distinction between build-time (client-exposed) and runtime (server-only) env vars is not obvious.

**Consequences:** OG image URLs, canonical URLs, or analytics IDs that use `NEXT_PUBLIC_` remain at the stale value until a redeploy is triggered.

**Prevention:**
- Set all `NEXT_PUBLIC_` variables in Vercel before the first production build
- Document which env vars require a redeploy vs which are runtime-safe
- For server-only vars (API keys used in Route Handlers), do not prefix with `NEXT_PUBLIC_` — they evaluate at runtime safely

**Phase:** Deployment / environment setup phase

---

### Pitfall 20: Overused scroll-triggered animations make the portfolio feel slow rather than polished

**What goes wrong:** Every section, card, and heading fades/slides in on scroll. The cumulative effect is that the visitor cannot skim content quickly — they must sit through each reveal. This is the portfolio animation anti-pattern: animations that serve the developer's ego, not the visitor's experience.

**Prevention:**
- Use entrance animations for the hero only (once per session, high impact)
- For subsequent sections, use subtle opacity transitions with very short durations (150-200ms) or no animation at all
- Never animate content that is below the fold — it adds delay to the information the visitor is actively scrolling to find
- Test with a non-developer: if they express frustration or reach for the scroll bar repeatedly, reduce animations

**Phase:** Design/animation phase

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| MDX setup | Wrong import path (`next-mdx-remote` vs `/rsc`) | Use `next-mdx-remote/rsc`; never call `serialize()` in App Router |
| MDX setup | Missing `mdx-components.tsx` | Required file — create before first MDX page |
| MDX frontmatter | `@next/mdx` ignores YAML by default | Export `metadata` const from MDX or add `remark-mdx-frontmatter` plugin |
| Dark mode | FOUC on page load | Inline blocking script in `RootLayout` + `suppressHydrationWarning` |
| Framer Motion | Full bundle in every page | `LazyMotion` + `domAnimation` + isolated leaf Client Components |
| Blog rendering | Code highlighting in client bundle | `rehype-pretty-code` as rehype plugin (build-time, zero client JS) |
| SEO / metadata | OG images using relative URLs | All OG image URLs must be absolute with full domain |
| SEO / metadata | `metadata` silently ignored in `'use client'` files | Keep `page.tsx` as Server Components; extract interactivity |
| SEO / sitemap | Sitemap missing blog posts | Programmatic `app/sitemap.ts` that reads MDX files |
| Deployment | `output: 'export'` breaks `generateMetadata` | Do not use `output: 'export'`; use Vercel's default build |
| Deployment | `NEXT_PUBLIC_` vars need redeploy | Set all build-time vars before first production build |
| Deployment | `robots.txt` Disallow on production | Guard robots.txt generation behind `NEXT_PUBLIC_SITE_URL` check |
| Domain routing | Subdomain redirect requires middleware | Vercel dashboard UI cannot redirect subdomain to a path; use middleware |
| Blog slugs | Case mismatch between macOS and Linux | Enforce lowercase-hyphen filename convention; apply `.toLowerCase()` in slug reader |
| Projects section | Dead or broken demo links | Verify all URLs before launch; link to GitHub only if no live demo exists |
| Skills section | Long logo grid reads as junior | Anchor each technology to a shipped project; cap at 8-10 items |
| Animations | Scroll-reveal on every element | Reserve animations for hero; use subtle or no animation below fold |

---

## Sources

- Next.js official documentation v16.2.6 (last updated 2026-05-19): https://nextjs.org/docs
- `next-mdx-remote` README (hashicorp/next-mdx-remote): https://github.com/hashicorp/next-mdx-remote
- Next.js preventing flash before hydration guide: https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
- Next.js metadata and OG images guide: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js MDX guide: https://nextjs.org/docs/app/guides/mdx
- Next.js redirecting guide: https://nextjs.org/docs/app/guides/redirecting
- Next.js environment variables guide: https://nextjs.org/docs/app/guides/environment-variables
- Next.js package bundling guide: https://nextjs.org/docs/app/guides/package-bundling
- Next.js sitemap file convention: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Vercel domains deploying and redirecting: https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- Framer Motion LazyMotion documentation (Context7): context7.com/grx7/framer-motion
