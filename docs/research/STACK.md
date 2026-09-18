# Technology Stack

**Project:** Yash Kadam Personal Portfolio + MDX Blog
**Researched:** 2026-05-24
**Confidence:** HIGH — all versions verified against npm registry and official docs

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | **16.2.6** | Full framework (routing, SSG, image opt, OG) | Latest stable (Oct 2025). Turbopack is now the default bundler (2-5x faster builds). React 19.2 built-in. App Router is the correct choice — RSC-first, Vercel-native. |
| React | **19.2.x** | UI rendering | Ships with Next.js 16. No manual version choice needed. |
| TypeScript | **5.x** | Type safety | Already in v2 branch. Next.js 16 requires TS 5.1+. |

**App Router vs Pages Router:** Use App Router. Pages Router is being maintained for compatibility but receives no new features. All Next.js 16 capabilities (Cache Components, RSC, native metadata API, `next/og`) are App Router-only.

**Next.js 14 vs 16:** The v2 branch is on 14.2.4. Upgrade to 16. The codebase only has a hero component — migration cost is near zero. Staying on 14 means missing Turbopack stability, React 19.2, and the improved caching model. Node.js 20.9+ required (breaking change from 14).

### MDX Integration

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@next/mdx` | **16.2.6** (same as Next.js) | MDX compilation + remark/rehype pipeline | Official Next.js package. Works at build time (no runtime overhead), full RSC support, integrates directly with App Router file-system routing. Versions lock to Next.js. |
| `@mdx-js/loader` | latest | webpack/Turbopack MDX loader (peer dep) | Required peer dep for `@next/mdx` |
| `@mdx-js/react` | latest | React JSX runtime for MDX | Required peer dep for `@next/mdx` |
| `@types/mdx` | latest | TypeScript types for MDX imports | Enables typed `import Post from './post.mdx'` |
| `remark-gfm` | **4.0.1** | GitHub Flavored Markdown (tables, strikethrough, task lists) | Without it, markdown tables and GFM syntax don't render. Standard addition for any tech blog. |
| `gray-matter` | **4.0.3** | Frontmatter parsing (title, date, tags, slug) | `@next/mdx` does not parse frontmatter by default. `gray-matter` is the standard, battle-tested solution. Used with a build-time utility to read MDX file metadata for blog index/listing pages. |

**Why `@next/mdx` and not alternatives:**

- **contentlayer** — abandoned. Last release June 2023. No Next.js 15/16 support. Do not use.
- **contentlayer2** (community fork) — 0.5.8, not widely adopted, no long-term commitment. Skip.
- **next-mdx-remote** — archived February 2026. Final version 6.0.0. Hashicorp explicitly states it is no longer maintained. Do not use for a new project.
- **velite** — 0.3.1, interesting approach (Zod schemas for content), active development. Viable alternative but adds abstraction that is unnecessary for a personal blog with a small, stable content schema. More complexity than `@next/mdx` for no meaningful gain at this scale.

**`@next/mdx` trade-off:** It does not support frontmatter natively — you export metadata as a JS object from the MDX file (`export const metadata = { ... }`) or use `gray-matter` in a server-side utility to parse files for listing pages. This is a minor inconvenience, well-documented, and solved.

### Syntax Highlighting

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `rehype-pretty-code` | **0.14.3** | Syntax highlighting in MDX code blocks | Powered by Shiki (TextMate grammar, VS Code themes). Runs at build time — zero client-side JS. Accurate highlighting for TypeScript, Go, Bash, JSON. Dark/light theme support via CSS variables. Integrates directly as a rehype plugin in `@next/mdx`. |
| `shiki` | **4.1.0** | TextMate grammar engine (peer dep of rehype-pretty-code) | rehype-pretty-code requires shiki `^1.0.0`; current is 4.1.0. |

**Why rehype-pretty-code over alternatives:**

- **highlight.js** — client-side, requires JS bundle. Not suitable for RSC/static blog.
- **Prism.js** — same problem. Client-side. Stale ecosystem.
- **`@shikijs/rehype`** directly — works but `rehype-pretty-code` wraps it with better ergonomics (line numbers, word highlighting, copy buttons via CSS, meta string support). Use rehype-pretty-code.

Configuration goes in `next.config.mjs` as a rehype plugin (must be ESM). Disable `mdxRs: true` experimental option if using rehype plugins — the Rust MDX compiler does not yet support rehype plugins with non-serializable options.

### Animation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `framer-motion` | **12.40.0** | Scroll animations, entrance effects, hover states | Already installed in v2. The `framer-motion` package IS the `motion` package — same version (12.40.0), same codebase, same author. The rename to `motion` is a marketing/branding change. No migration required until you want vanilla JS or Vue support. |

**framer-motion vs motion:** Both packages publish the same version (12.40.0 at time of research). `framer-motion` imports from the `framer-motion` package, `motion` imports from `"motion/react"`. They are identical underneath. Since v2 already has `framer-motion` installed, keep it. If starting fresh, install `motion` instead. No functional difference for this project.

**Framer Motion vs alternatives:**

- **react-spring** (10.0.4) — physics-based, good for spring animations, but less intuitive for scroll-triggered and viewport entrance animations. Portfolio sites benefit more from Motion's `whileInView` and `useScroll` APIs.
- **GSAP** — more powerful for complex sequences, but overkill and costs money for commercial projects. The existing codebase uses GSAP on the old HTML site; the v2 branch already moved to Framer Motion correctly.
- **CSS animations** — zero JS overhead, but cannot easily do scroll-triggered entrance animations or stagger effects without JS.

Keep `framer-motion`. It is the right choice.

### UI Components

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| shadcn/ui | **shadcn@2.9.0** (CLI) | Accessible, unstyled component primitives | Not a dependency — components are copied into `components/ui/`. Built on Radix UI primitives. Tailwind-native. Copy only what you need (no bundle bloat from unused components). For a personal portfolio the likely useful components are: Button, Badge, Card, Separator, Dialog (for project modals), Sheet (for mobile nav). |
| `@radix-ui/react-icons` | **^1.3.0** | Icon set | Already in v2. 300+ icons, Radix-native. |
| `class-variance-authority` | **^0.7.0** | Variant-based component styling | Already in v2. Used by shadcn/ui components. |
| `clsx` + `tailwind-merge` | **2.1.x** / **2.3.x** | Conditional class merging | Already in v2. Standard shadcn/ui utilities. |

**Why shadcn/ui and not raw Radix UI:**

- **Radix UI directly** — lower-level, requires writing all styling yourself. shadcn/ui already does this well.
- **Headless UI** — Tailwind Labs project, good for Tailwind projects but less component variety and smaller ecosystem than Radix. Radix has better a11y primitives.
- **Full component library (MUI, Chakra)** — out of scope per PROJECT.md. Heavy, opinionated, fights custom design.

**Note:** The PROJECT.md explicitly rules out "full-blown design system or component library." shadcn/ui is not a dependency — it is source code you own and can delete. This is the right fit.

### Styling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Tailwind CSS | **4.3.0** (latest) | Utility-first styling | Already in v2 (on 3.4.1). Tailwind v4 is the current stable release with a redesigned configuration model. Consider upgrading — Next.js 16 scaffolding defaults to Tailwind v4. Breaking changes from v3 exist (config file format changed). Defer upgrade to avoid yak-shaving during initial build. |
| `@tailwindcss/typography` | **0.5.19** | Prose styles for MDX blog content | Without this plugin, MDX-rendered HTML (headings, lists, code, blockquotes) has no visual styling. The `prose` class transforms raw HTML into readable typography. Critical for blog. |
| `tailwindcss-animate` | **^1.0.7** | Animation utility classes | Already in v2. Used by shadcn/ui components for enter/exit animations. |

### Font Loading

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `next/font/google` | (built-in) | Self-hosted Google Fonts with zero layout shift | Built into Next.js. Downloads fonts at build time, self-hosts them, injects `font-display: swap`, and applies correct size adjustments to eliminate CLS. No external DNS lookup at runtime — eliminates the privacy/performance penalty of Google Fonts CDN. |

**`next/font` vs Google Fonts CDN:** Use `next/font`. The CDN approach adds a cross-origin request, is a GDPR consideration for EU visitors, and causes CLS if the font loads after paint. `next/font` solves all three at zero cost. Official Next.js docs confirm this pattern for App Router.

Recommended font stack for a developer portfolio: `Geist` (variable, zero-width optical sizing, designed by Vercel, excellent for code-adjacent UI) or `Inter` (proven, neutral, widely respected). Both are available in `next/font/google`. Avoid decorative fonts — credibility-first persona.

### OG Image Generation

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `next/og` (`ImageResponse`) | (built-in) | Dynamic OG images for blog posts | Built into Next.js App Router. Create `app/blog/[slug]/opengraph-image.tsx` — Next.js calls it at build time (static generation) or on demand and caches the result. Blog posts get per-post OG images with title and author automatically. No external service needed. |

**Dynamic vs static OG images:** For blog posts, dynamic `next/og` is the right choice because each post has a unique title. For the portfolio homepage, a single static PNG is fine. Use both: static `public/og-image.png` for homepage, dynamic `opengraph-image.tsx` under the blog route.

**`next/og` vs `@vercel/og`:** They are the same thing — Vercel's `@vercel/og` was merged into `next/og` in Next.js 14+. Use the built-in.

### Development Tooling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| ESLint | **9.x** | Linting | Next.js 16 fully supports ESLint 9 with flat config. Note: Next.js 16 removes the `next lint` CLI command — run ESLint directly (`eslint .`). |
| Prettier | **^3.3.x** | Formatting | Already in v2. |
| `prettier-plugin-tailwindcss` | **^0.6.x** | Auto-sort Tailwind classes | Already in v2. Essential for maintaining readable class attribute ordering. |

---

## What NOT to Use and Why

| Library | Reason to Avoid |
|---------|----------------|
| **contentlayer** | Abandoned since June 2023. No Next.js 15/16 support. Ecosystem moved on. |
| **contentlayer2** (fork) | Community fork, low adoption, no long-term commitment. |
| **next-mdx-remote** | Archived by Hashicorp in February 2026. Use `@next/mdx` instead. |
| **Pages Router** | No new Next.js features. RSC unavailable. `next/og` and metadata API are App Router only. |
| **Google Fonts CDN** | GDPR issue, cross-origin latency, causes CLS. `next/font` is strictly better. |
| **highlight.js / Prism.js** | Client-side JS bundle for syntax highlighting. Zero reason to use them when `rehype-pretty-code` runs at build time with zero runtime cost. |
| **MUI / Chakra / Ant Design** | Heavy, opinionated, fight custom design. PROJECT.md explicitly out-of-scopes a full component library. |
| **SWR / React Query** | No server state or API fetching needed. All content is static MDX files. RSC handles data fetching at build time. |
| **Zustand / Redux** | No global client state needed. Portfolio is stateless. Animation and UI state are local. |
| **MDX Rust compiler (`mdxRs: true`)** | Experimental, does not support rehype plugins with function options. Since rehype-pretty-code is a required plugin, keep the default JS compiler. |
| **`@next/font` (old package name)** | Removed in Next.js 15. Use `next/font` (built-in). |
| **Tailwind v4 (now)** | Latest stable but breaking config changes from v3. v2 branch is on v3. Defer upgrade to avoid friction during greenfield build; upgrade is a focused one-sprint effort later. |

---

## Installation Commands

```bash
# Upgrade Next.js (from 14 in v2 branch)
npm install next@latest react@latest react-dom@latest

# MDX pipeline
npm install @next/mdx @mdx-js/loader @mdx-js/react @types/mdx
npm install remark-gfm gray-matter

# Syntax highlighting
npm install rehype-pretty-code shiki

# Typography for blog prose
npm install @tailwindcss/typography

# shadcn/ui (run after next upgrade; copies components on demand)
npx shadcn@latest init
# Then add components as needed: npx shadcn@latest add button card badge
```

framer-motion, TypeScript, Tailwind, clsx, tailwind-merge, CVA, Radix icons are already present in v2.

---

## Version Summary

| Package | Current Stable | Notes |
|---------|---------------|-------|
| `next` | 16.2.6 | Stable, Oct 2025 |
| `react` / `react-dom` | 19.2.6 | Bundled with Next.js 16 |
| `typescript` | 5.x (>=5.1) | Next.js 16 minimum |
| `tailwindcss` | 4.3.0 (latest) | v2 branch on 3.4.1, defer upgrade |
| `framer-motion` | 12.40.0 | Same as `motion@12.40.0`, keep as-is |
| `@next/mdx` | Matches Next.js version | First-party, version-locked |
| `remark-gfm` | 4.0.1 | |
| `gray-matter` | 4.0.3 | |
| `rehype-pretty-code` | 0.14.3 | Requires shiki ^1.0.0 |
| `shiki` | 4.1.0 | |
| `@tailwindcss/typography` | 0.5.19 | |
| `shadcn` (CLI) | 2.9.0 | Copies source, not a runtime dep |

---

## Sources

- Next.js 16 release announcement: https://nextjs.org/blog/next-16 (Oct 2025)
- Next.js MDX guide (updated 2026-05-19): https://nextjs.org/docs/app/guides/mdx
- next-mdx-remote archived: https://github.com/hashicorp/next-mdx-remote (archived Feb 2026)
- contentlayer abandoned: https://github.com/contentlayerdev/contentlayer (last release June 2023)
- rehype-pretty-code: https://rehype-pretty.pages.dev/
- Motion/Framer Motion rebrand: https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion
- All package versions: npm registry (verified 2026-05-24)
- Context7: /vercel/next.js, /hashicorp/next-mdx-remote, /zce/velite, /websites/shiki_style, /websites/motion_dev, /websites/ui_shadcn
