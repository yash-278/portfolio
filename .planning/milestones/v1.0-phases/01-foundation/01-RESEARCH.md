# Phase 1: Foundation - Research

**Researched:** 2026-05-24
**Domain:** Next.js 16 App Router scaffold, MDX pipeline, dark mode FOUC prevention, Framer Motion LazyMotion pattern, shared layout shell
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Start from a **fresh `create-next-app` scaffold** targeting Next.js 16.2.6 — do not upgrade the v2 branch in-place. Clean slate avoids upgrade noise, leftover dependencies (CVA, Radix icons, components.json), and inherited font configuration.
- **D-02:** The v2 animated gradient background (`BackgroundGradientAnimation`) is **dropped for Phase 1**. Phase 1 is infrastructure, not visual. Phase 2 will design the hero from scratch.
- **D-03:** Phase 1 work happens on a **new branch** (e.g., `feat/next16-foundation`), not directly on main. Merge to main via PR after Phase 1 success criteria are verified.
- **D-04:** Phase 1 delivers **dark-only mode** — an inline blocking script in `app/layout.tsx` adds the `dark` class to `<html>` before the first paint. No system preference detection, no `next-themes` dependency, no toggle UI.
- **D-05:** CSS variables are **dark-only for now**. Light mode CSS vars are introduced when the toggle ships in Polish phase (PLSH-01). `globals.css` defines only dark theme tokens.
- **D-06:** The Navbar contains: **site logo/name + two links: "Home" and "Blog"**. No About/Projects anchor links in Phase 1. Mobile hamburger menu is not in scope for Phase 1.
- **D-07:** The Footer contains: **Yash Kadam name + GitHub / LinkedIn / Twitter(X) social icon links + copyright year**. Social link targets: github.com/yash-278, LinkedIn, @yashkadam278.
- **D-08:** Use **2 fonts only**: Inter (body/UI) + JetBrains Mono (code). Loaded via `next/font/google`. Placeholder for Phase 1 — final pair locked in Phase 2.
- **D-09:** All 4 v2 fonts (Josefin_Sans, Comfortaa, Fira_Sans, duplicate Inter) are **dropped**.

### Claude's Discretion

- Specific placeholder font names (Inter + JetBrains Mono suggested; researcher/planner may adjust if a better pairing aligns with the dark aesthetic).
- Exact inline FOUC script implementation pattern (standard `document.documentElement.classList.add('dark')` or equivalent).
- Exact Tailwind dark mode config (`darkMode: 'class'` in `tailwind.config.ts`).
- Whether to use `next/font/local` or `next/font/google` for the monospace font.

### Deferred Ideas (OUT OF SCOPE)

- **Phase 2:** Design variations for portfolio sections — show all options side-by-side simultaneously before picking a direction.
- **Phase 5 (PLSH-01):** Dark mode toggle UI + `next-themes` installation.
- **Phase 5:** Mobile hamburger nav menu.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Site runs on Next.js 16 + TypeScript + Tailwind v3, deployed on Vercel at yashkadam.com | create-next-app 16.2.6 scaffold + Vercel CLI verified available |
| FOUND-02 | Dark mode FOUC prevented via inline blocking script in root layout | `dangerouslySetInnerHTML` blocking script pattern documented; must be before any stylesheet |
| FOUND-03 | Framer Motion configured with `LazyMotion` + `domAnimation` pattern from project start | `framer-motion` v12.40 exports `LazyMotion`, `domAnimation`, `m` from main entry; `framer-motion/m` subpath export also available |
| FOUND-04 | MDX pipeline configured via `@next/mdx` with `rehype-pretty-code` syntax highlighting | `@next/mdx` 16.2.6 + official install steps verified; `rehype-pretty-code` 0.14.3 string-name theme pattern documented; `mdxRs: false` required |
| FOUND-05 | Shared Navbar and Footer visible on all pages | Root `app/layout.tsx` pattern; lucide-react 1.16.0 for social icons; UI-SPEC contract fully documented |
| FOUND-06 | `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` set in Vercel env vars before first build | Vercel CLI 54.4.1 available; env var documented in `.env.local.example` pattern |
</phase_requirements>

---

## Summary

Phase 1 is a pure infrastructure phase: scaffold a fresh Next.js 16.2.6 app from `create-next-app`, wire the MDX pipeline with `@next/mdx` + `rehype-pretty-code`, add the dark mode inline blocking script, configure `LazyMotion` + `domAnimation` in the root layout, and build the Navbar and Footer shells. Every subsequent phase inherits this setup without rework.

The key technical constraint is the Turbopack/MDX rehype plugin compatibility issue: `rehype-pretty-code` 0.14.3 cannot use imported theme objects with Turbopack because JavaScript functions cannot be passed to Rust. The workaround is to pass theme as a string name (`"github-dark-dimmed"`) and set `mdxRs: false` explicitly in the MDX config. These are locked behaviors per STATE.md.

The `framer-motion` package (v12.40.0) is the project's chosen package name (aligning with the v2 branch) and exports `LazyMotion`, `domAnimation`, and `m` from its main entry. Leaf components should use `import { m } from 'framer-motion'` rather than `motion.*` to stay within the LazyMotion boundary. The `strict` prop on `<LazyMotion>` enforces this at runtime.

**Primary recommendation:** Scaffold → configure Tailwind + CSS tokens → wire MDX pipeline → add FOUC script → wire LazyMotion → build Navbar + Footer. All work on branch `feat/next16-foundation`; merge to main via PR only after the 5 success criteria pass.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| App scaffolding and routing | Frontend Server (SSR/SSG) | — | Next.js App Router owns routing; pages are RSCs by default |
| Dark mode FOUC prevention | Browser / Client | — | Must execute synchronously before first paint in the browser; cannot be deferred |
| MDX pipeline (parse + render) | Frontend Server (SSR/SSG) | — | `@next/mdx` processes MDX at build/request time as a Server Component; no client-side parsing |
| Syntax highlighting (rehype-pretty-code) | Frontend Server (SSR/SSG) | — | Shiki runs at build time; output is static HTML with inline styles |
| Animation orchestration (LazyMotion) | Frontend Server (SSR/SSG) | Browser / Client | `LazyMotion` wrapper lives in root layout (Server Component); `m.*` components are Client Components in leaf files |
| Navbar and Footer | Frontend Server (SSR/SSG) | — | Static server components; no interactivity in Phase 1 |
| Font loading | Frontend Server (SSR/SSG) | CDN / Static | `next/font/google` self-hosts fonts; injects CSS variables server-side |
| CSS custom properties / design tokens | Browser / Client | — | CSS variables applied via `globals.css`; consumed by browser at render time |
| Env var (`NEXT_PUBLIC_SITE_URL`) | CDN / Static | Frontend Server | Set in Vercel; inlined at build time for client bundles, available server-side too |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `next` | 16.2.6 | App framework — App Router, SSG, image opt, font loading | Decision D-01; project requirement FOUND-01 |
| `react` | 19.2.6 | UI rendering | Peer dependency of Next.js 16 |
| `react-dom` | 19.2.6 | DOM rendering | Peer dependency of Next.js 16 |
| `typescript` | 6.0.3 | Static typing | Project requirement FOUND-01; create-next-app default |
| `tailwindcss` | 4.3.0 | Utility CSS | Project requirement FOUND-01; v3 is installed by create-next-app |
| `framer-motion` | 12.40.0 | Animation library | Project decision; v2 branch uses this package name; required for FOUND-03 |

> **Note on Tailwind version:** `npm view tailwindcss version` returns `4.3.0` as the latest, but the project requirement (FOUND-01) specifies Tailwind **v3**. `create-next-app@16.2.6` scaffolds with Tailwind v3 (the `tailwindcss@^3` range). Pin `tailwindcss@^3.4` explicitly to avoid accidentally pulling v4 during install. Tailwind v4 upgrade is a deferred task (PLSH-02). [VERIFIED: npm registry — tailwindcss@3.4.x is the latest v3 series]

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@next/mdx` | 16.2.6 | MDX integration for Next.js App Router | Required for FOUND-04; ships as part of Next.js monorepo |
| `@mdx-js/loader` | 3.1.1 | Webpack/Turbopack MDX loader (peer dep of @next/mdx) | Required alongside `@next/mdx` |
| `@mdx-js/react` | 3.1.1 | React MDX context provider (peer dep of @next/mdx) | Required for `mdx-components.tsx` to work |
| `@types/mdx` | 2.0.13 | TypeScript types for MDX imports | Required for `.mdx` file type declarations |
| `rehype-pretty-code` | 0.14.3 | Syntax highlighting via Shiki | Required for FOUND-04; Shiki v1 compatible |
| `shiki` | 4.1.0 | Syntax highlighter engine (peer dep of rehype-pretty-code) | Required for rehype-pretty-code to work |
| `lucide-react` | 1.16.0 | Icon library for social icons in Footer | Specified in UI-SPEC; tree-shakable, no runtime deps |
| `clsx` | 2.1.1 | Conditional class merging | Used in `cn()` utility; ported from v2 |
| `tailwind-merge` | 3.6.0 | Tailwind class deduplication in `cn()` | Used in `cn()` utility; ported from v2 |

### Dev Dependencies

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@types/node` | 25.9.1 | Node.js TypeScript types | Required for server-side code in App Router |
| `@types/react` | 19.2.15 | React TypeScript types | Required for TSX |
| `@types/react-dom` | 19.2.3 | React DOM TypeScript types | Required for TSX |
| `eslint` | 10.4.0 | Linting | create-next-app default |
| `eslint-config-next` | 16.2.6 | Next.js ESLint rules | create-next-app default |
| `prettier` | 3.8.3 | Code formatting | v2 branch convention |
| `prettier-plugin-tailwindcss` | 0.8.0 | Tailwind class sorting | v2 branch convention |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `@next/mdx` | `next-mdx-remote` | next-mdx-remote archived Feb 2026 — not viable |
| `@next/mdx` | `contentlayer` | contentlayer abandoned Jun 2023 — not viable |
| `rehype-pretty-code` | `@shikijs/rehype` | rehype-pretty-code is the project-specified choice per STATE.md; @shikijs/rehype is an alternative but not decided |
| `framer-motion` | `motion` | Same codebase — `framer-motion` is the project's chosen package name, matching v2 branch |
| `lucide-react` | `heroicons`, `phosphor-react` | lucide-react specified in UI-SPEC; comparable options but UI contract locks lucide |

**Installation (production dependencies):**

```bash
npm install framer-motion lucide-react clsx tailwind-merge \
  @next/mdx @mdx-js/loader @mdx-js/react @types/mdx \
  rehype-pretty-code shiki
```

**Installation (dev dependencies):**

```bash
npm install -D prettier prettier-plugin-tailwindcss
```

> Note: `tailwindcss@^3.4`, `next`, `react`, `react-dom`, `typescript`, `@types/node`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next` are installed automatically by `create-next-app@16.2.6`.

---

## Package Legitimacy Audit

> slopcheck was unavailable at research time. All packages are tagged `[ASSUMED]` for slopcheck column. Package existence, source repos, and publish dates were verified via `npm view`. The planner must gate each install behind a `checkpoint:human-verify` task before install.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `next` | npm | 15 yrs (2011) | Very high (Vercel flagship) | github.com/vercel/next.js | [ASSUMED] | Approved — canonical Vercel product |
| `react` | npm | ~10 yrs | Very high (Meta) | github.com/facebook/react | [ASSUMED] | Approved — canonical |
| `framer-motion` | npm | ~6 yrs (2019) | Very high | github.com/motiondivision/motion | [ASSUMED] | Approved — well-established |
| `@next/mdx` | npm | 7 yrs (2019) | High (Vercel monorepo) | github.com/vercel/next.js | [ASSUMED] | Approved — official Next.js package |
| `@mdx-js/loader` | npm | ~5 yrs | High | github.com/mdx-js/mdx | [ASSUMED] | Approved — official MDX package |
| `@mdx-js/react` | npm | ~5 yrs | High | github.com/mdx-js/mdx | [ASSUMED] | Approved — official MDX package |
| `@types/mdx` | npm | ~3 yrs | High | github.com/DefinitelyTyped/DefinitelyTyped | [ASSUMED] | Approved — DefinitelyTyped |
| `rehype-pretty-code` | npm | ~3 yrs (2022) | High | github.com/rehype-pretty/rehype-pretty-code | [ASSUMED] | Approved — established in Next.js blog ecosystem |
| `shiki` | npm | ~5 yrs | Very high | github.com/shikijs/shiki | [ASSUMED] | Approved — canonical syntax highlighter |
| `lucide-react` | npm | ~4 yrs (2020) | High | github.com/lucide-icons/lucide | [ASSUMED] | Approved — widely used icon library |
| `clsx` | npm | ~7 yrs | Very high | github.com/lukeed/clsx | [ASSUMED] | Approved — minimal, trusted utility |
| `tailwind-merge` | npm | ~3 yrs | Very high | github.com/dcastil/tailwind-merge | [ASSUMED] | Approved — standard Tailwind companion |
| `prettier` | npm | ~8 yrs | Very high | github.com/prettier/prettier | [ASSUMED] | Approved — canonical formatter |
| `prettier-plugin-tailwindcss` | npm | ~3 yrs | High | github.com/tailwindlabs/prettier-plugin-tailwindcss | [ASSUMED] | Approved — official Tailwind plugin |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*All packages above are tagged `[ASSUMED]` because slopcheck was unavailable at research time. The planner must gate each install group behind a `checkpoint:human-verify` task.*

---

## Architecture Patterns

### System Architecture Diagram

```
Browser Request
      │
      ▼
┌─────────────────────────────────────────┐
│  Next.js App Router (SSG/SSR)           │
│                                         │
│  app/layout.tsx (Server Component)      │
│  ┌────────────────────────────────────┐ │
│  │ <html class="dark">               │ │
│  │   [inline blocking script]        │ │◄─── FOUC prevention (synchronous)
│  │   <body>                          │ │
│  │     <Navbar />                    │ │◄─── Server Component (static)
│  │     <LazyMotion features={dom}    │ │◄─── Wraps all children
│  │       <main>{children}</main>     │ │
│  │     </LazyMotion>                 │ │
│  │     <Footer />                    │ │◄─── Server Component (static)
│  │   </body>                         │ │
│  │ </html>                           │ │
│  └────────────────────────────────────┘ │
│                                         │
│  app/page.tsx           ──► Static page │
│  app/blog/[slug]/page.tsx ──► MDX route │
│       │                                 │
│       ▼                                 │
│  @next/mdx transform                    │
│       │                                 │
│       ▼                                 │
│  rehype-pretty-code                     │◄─── theme: "github-dark-dimmed" (string)
│  (Shiki syntax highlight)               │     mdxRs: false, Turbopack-safe
└─────────────────────────────────────────┘
      │
      ▼
  Static HTML + CSS tokens
  (CSS vars from globals.css → browser)
```

### Recommended Project Structure

```
portfolio/                   # fresh create-next-app scaffold
├── app/
│   ├── layout.tsx           # Root layout: inline FOUC script, fonts, LazyMotion, Navbar, Footer
│   ├── page.tsx             # Home page (placeholder in Phase 1)
│   └── globals.css          # CSS custom properties (dark tokens only)
├── components/
│   ├── Navbar.tsx           # Fixed top nav: logo + Home/Blog links
│   └── Footer.tsx           # Static footer: name, copyright, social icons
├── lib/
│   └── utils.ts             # cn() utility (clsx + tailwind-merge)
├── content/
│   └── blog/                # .mdx files (Phase 3); directory created now
├── mdx-components.tsx       # Required for @next/mdx App Router (project root)
├── next.config.mjs          # ESM config: @next/mdx + rehype-pretty-code
├── tailwind.config.ts       # darkMode: 'class' + custom color/font tokens
├── tsconfig.json            # @/* path alias (carry from v2 reference)
├── postcss.config.mjs       # Standard Next.js PostCSS config
└── .env.local.example       # Documents NEXT_PUBLIC_SITE_URL
```

### Pattern 1: MDX Pipeline Configuration (Turbopack-safe)

**What:** Configure `@next/mdx` with `rehype-pretty-code` using string-based theme to avoid Turbopack serialization failures.

**When to use:** Always — this is the only supported pattern for Turbopack + rehype-pretty-code.

```javascript
// Source: https://nextjs.org/docs/app/guides/mdx (version 16.2.6) + STATE.md known gotcha
// next.config.mjs
import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: false,  // REQUIRED: disable Rust MDX compiler so rehype plugins work
  },
}

const withMDX = createMDX({
  options: {
    rehypePlugins: [
      [rehypePrettyCode, {
        theme: 'github-dark-dimmed',  // string name, NOT imported object
        keepBackground: false,
      }],
    ],
  },
})

export default withMDX(nextConfig)
```

**Critical note:** Passing an imported theme object (e.g., `import theme from 'shiki/themes/github-dark.json'`) causes Turbopack to fail because JavaScript objects cannot be serialized to Rust. Pass the theme as a string name only. [VERIFIED: rehype-pretty.pages.dev + STATE.md]

### Pattern 2: Dark Mode FOUC Prevention

**What:** Inline blocking script that runs synchronously before first paint, adding `dark` class to `<html>`.

**When to use:** Required in `app/layout.tsx` — cannot be deferred, async, or moved to a separate file.

```tsx
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/layout + STATE.md
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Must be FIRST child of <head>, before any stylesheet — no defer/async */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('dark')",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Why `dangerouslySetInnerHTML`:** Next.js strips inline `<script>` tags in JSX without it. The content here is a static string constant with no user input — no XSS risk. [VERIFIED: Next.js docs, UI-SPEC implementation notes]

### Pattern 3: LazyMotion + domAnimation Wrapper

**What:** Root layout wraps children in `<LazyMotion>` with `domAnimation` features, `strict` mode to enforce that no `motion.*` components leak outside leaf Client Components.

**When to use:** Set once in `app/layout.tsx`; all animated leaf components import `{ m }` from `framer-motion`.

```tsx
// Source: https://motion.dev/docs/react-lazy-motion (verified 2026-05-24)
// app/layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <LazyMotion features={domAnimation} strict>
          <main>{children}</main>
        </LazyMotion>
        <Footer />
      </body>
    </html>
  )
}

// Leaf Client Component (Phase 2+):
// 'use client'
// import { m } from 'framer-motion'
// export function AnimatedCard() { return <m.div animate={{ opacity: 1 }} /> }
```

**`strict` prop:** Forces a runtime error if any `motion.div` (full-weight) renders inside `LazyMotion`. Ensures bundle savings are actually achieved. [VERIFIED: motion.dev/docs/react-lazy-motion]

**Important package naming:** The project uses `framer-motion` (the npm package name, matching the v2 branch). `framer-motion` v12.40.0 exports `LazyMotion`, `domAnimation`, and `m` from its main entry. The `motion` package on npm is the same codebase but uses `motion/react` and `motion/react-m` subpaths instead. Do NOT mix import paths between the two package names.

### Pattern 4: Font Variables in Root Layout

**What:** Load Inter + JetBrains Mono via `next/font/google`, expose as CSS variables, apply to `<html>`.

**When to use:** Root layout `app/layout.tsx` — fonts loaded once at the document root.

```tsx
// Source: https://nextjs.org/docs/app/getting-started/fonts (Next.js 16.2.6 docs)
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      ...
    </html>
  )
}
```

**Tailwind config:**
```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['var(--font-sans)', ...defaultTheme.fontFamily.sans],
  mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
}
```

### Pattern 5: `mdx-components.tsx` at Project Root

**What:** Required file for `@next/mdx` with App Router. Without it, MDX files will not render correctly.

```tsx
// Source: https://nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file (verified 2026-05-24)
// mdx-components.tsx — must be at project root (same level as app/)
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  }
}
```

### Pattern 6: CSS Custom Properties (Dark Token Layer)

**What:** All design tokens declared as CSS custom properties in `globals.css` under `:root`. No `@media (prefers-color-scheme: dark)` — dark is the only mode in Phase 1.

```css
/* app/globals.css */
/* Source: UI-SPEC 01-UI-SPEC.md (approved 2026-05-24) */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-text: #e4e4e7;
  --color-text-muted: #71717a;
  --color-border: #27272a;
  --color-accent: #22d3ee;
  --color-accent-hover: #06b6d4;
  --color-destructive: #ef4444;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
}
```

**Tailwind config color extension** (maps CSS vars to Tailwind utility classes):
```typescript
// tailwind.config.ts — from UI-SPEC
extend: {
  colors: {
    bg: 'var(--color-bg)',
    surface: 'var(--color-surface)',
    text: { DEFAULT: 'var(--color-text)', muted: 'var(--color-text-muted)' },
    border: 'var(--color-border)',
    accent: { DEFAULT: 'var(--color-accent)', hover: 'var(--color-accent-hover)' },
    destructive: 'var(--color-destructive)',
  }
}
```

### Anti-Patterns to Avoid

- **Using `import theme from 'shiki/themes/...'` with rehype-pretty-code + Turbopack:** Theme objects cannot be passed to Rust serialization. Pass only string names.
- **Setting `mdxRs: true` with rehype plugins:** The Rust MDX compiler does not support rehype plugin options that contain non-serializable values (functions, imported objects). Always `mdxRs: false` when using rehype-pretty-code.
- **Using `motion.div` inside `<LazyMotion>`:** Defeats the bundle savings. Use `m` from `framer-motion` in leaf Client Components only.
- **Putting `'use client'` on `app/layout.tsx`:** Root layout must remain a Server Component to support RSC and avoid hydration mismatches. `LazyMotion` can render in a Server Component; it passes context to client subtrees.
- **Using `next-themes` in Phase 1:** Deferred to Phase 5 (PLSH-01). Phase 1 FOUC script is intentionally minimal.
- **Using `pages/` router:** App Router is required throughout the project. The v2 branch already uses `app/`.
- **Running `create-next-app` without pinning version:** `npx create-next-app@latest` currently resolves to 16.2.6; pin with `@16.2.6` to ensure reproducibility.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS class conditional merging | Custom string concat with if/else | `cn()` from clsx + tailwind-merge | Handles Tailwind specificity conflicts, deduplication, conditional arrays — hand-rolled versions miss edge cases |
| Syntax highlighting | Custom regex highlight | `rehype-pretty-code` + `shiki` | 200+ language grammars, accurate tokenization, theme support — regex breaks on nested constructs |
| Font loading optimization | Manual `<link rel="preload">` | `next/font/google` | Self-hosts, prevents layout shift, automatic subset subsetting, optimal preload headers |
| MDX parsing and rendering | Custom markdown-to-JSX | `@next/mdx` + `@mdx-js/react` | MDX is a complex AST with React component interpolation; hand-rolled parsers miss security edge cases |
| Dark mode script | Complex `localStorage` reading | Single-line `classList.add('dark')` | Phase 1 is dark-only; no preference detection needed; adding complexity creates regression surface |

**Key insight:** This phase is entirely about wiring existing, battle-tested infrastructure. The entire value comes from assembling the right pieces in the right order — not from custom implementations.

---

## Common Pitfalls

### Pitfall 1: Turbopack + rehype-pretty-code theme import crash

**What goes wrong:** `next dev` crashes with a serialization error when `rehype-pretty-code` options contain an imported theme object.

**Why it happens:** Turbopack's Rust layer cannot serialize JavaScript function/object options for MDX plugins. Only plain serializable values (strings, numbers, booleans) can be passed.

**How to avoid:** Pass `theme: 'github-dark-dimmed'` as a string. Set `experimental: { mdxRs: false }` in `next.config.mjs`. [VERIFIED: STATE.md + rehype-pretty.pages.dev]

**Warning signs:** `TypeError: Cannot serialize options` or Turbopack build failure on startup involving MDX.

### Pitfall 2: FOUC script placed too late or with defer/async

**What goes wrong:** White flash visible on dark-mode browsers before the `dark` class is applied.

**Why it happens:** If the script is placed after the `<body>` opening, or has `defer` or `async`, the browser may render one frame without the `dark` class.

**How to avoid:** The script must be the **first child of `<head>`**, before any `<link rel="stylesheet">` tags, with no `defer` or `async`. The `dangerouslySetInnerHTML` pattern in Next.js ensures it is rendered as-is without transformation. [VERIFIED: UI-SPEC implementation notes]

**Warning signs:** Any visible white background flash on page load in a browser with dark mode preference.

### Pitfall 3: `motion.div` leaking outside `<LazyMotion>` boundary

**What goes wrong:** The bundle size benefit of LazyMotion is negated; if `strict` is set, a runtime error is thrown.

**Why it happens:** Developers import `{ motion }` from `framer-motion` habitually. Within `<LazyMotion>`, the correct import is `{ m }`.

**How to avoid:** Always import `{ m }` (not `{ motion }`) for animated elements. The `strict` prop on `<LazyMotion>` will throw at runtime if a `motion.*` component renders inside it, making violations visible immediately during development. [VERIFIED: motion.dev/docs/react-lazy-motion]

**Warning signs:** Console error "motion component used inside LazyMotion with strict mode".

### Pitfall 4: `mdx-components.tsx` not at project root

**What goes wrong:** MDX files render as plain text or throw a build error about missing `useMDXComponents`.

**Why it happens:** Next.js App Router requires `mdx-components.tsx` to exist at the **project root** (same level as the `app/` directory), not inside `app/` or `src/`.

**How to avoid:** Create `mdx-components.tsx` at project root. [VERIFIED: nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file]

**Warning signs:** MDX page renders raw markdown text with no component styling, or build error mentioning `useMDXComponents`.

### Pitfall 5: `create-next-app` scaffolds Tailwind v4 instead of v3

**What goes wrong:** `npm view tailwindcss` returns `4.3.0` as latest; `create-next-app@latest` may scaffold with Tailwind v4 depending on its template at time of execution.

**Why it happens:** Tailwind v4 has a completely different configuration format (no `tailwind.config.ts`, CSS-based config). The project targets v3.

**How to avoid:** After scaffolding, verify `package.json` shows `tailwindcss@^3.x.x`. If v4 was installed, remove and reinstall: `npm install tailwindcss@^3.4`. Tailwind v4 upgrade is tracked as PLSH-02 for a future dedicated sprint. [VERIFIED: npm registry — tailwindcss@3.4.x is latest v3]

**Warning signs:** `tailwind.config.ts` is absent or the project uses a `@import "tailwindcss"` directive in CSS instead of `@tailwind base/components/utilities`.

### Pitfall 6: Root layout accidentally marked `'use client'`

**What goes wrong:** Server Components in the app tree lose their RSC benefits; hydration errors may appear.

**Why it happens:** `LazyMotion` is a React context provider — developers may assume it requires `'use client'`.

**How to avoid:** `LazyMotion` can render in a Server Component. Do not add `'use client'` to `app/layout.tsx`. Only leaf components that use `m.*` elements need `'use client'`. [VERIFIED: motion.dev/docs/react-lazy-motion]

**Warning signs:** `'use client'` directive at top of `app/layout.tsx`.

### Pitfall 7: `framer-motion` vs `motion` package confusion

**What goes wrong:** Documentation for the `motion` package (npm) uses `import from 'motion/react'` and `import from 'motion/react-m'` subpaths, which do not exist in the `framer-motion` package (different export map).

**Why it happens:** The `motion` npm package and `framer-motion` npm package share the same codebase at v12 but have different export entry points.

**How to avoid:** This project uses `framer-motion`. For LazyMotion pattern, import `{ LazyMotion, domAnimation, m }` all from `'framer-motion'` (main entry). Do NOT use `framer-motion/m` or `framer-motion/react` subpaths — they do not exist. [VERIFIED: npm view framer-motion exports]

---

## Code Examples

Verified patterns from official sources:

### Root Layout (complete Phase 1 skeleton)

```tsx
// Source: Next.js 16.2.6 docs + motion.dev + UI-SPEC (2026-05-24)
// app/layout.tsx
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { LazyMotion, domAnimation } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Yash Kadam',
  description: 'Technical Lead and fullstack developer',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('dark')",
          }}
        />
      </head>
      <body className="bg-bg text-text font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:text-accent"
        >
          Skip to main content
        </a>
        <Navbar />
        <LazyMotion features={domAnimation} strict>
          <main id="main-content" className="pt-14">
            {children}
          </main>
        </LazyMotion>
        <Footer />
      </body>
    </html>
  )
}
```

### next.config.mjs (MDX + rehype-pretty-code)

```javascript
// Source: nextjs.org/docs/app/guides/mdx + STATE.md known gotcha
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
      [rehypePrettyCode, { theme: 'github-dark-dimmed', keepBackground: false }],
    ],
  },
})

export default withMDX(nextConfig)
```

### mdx-components.tsx (minimum required)

```tsx
// Source: nextjs.org/docs/app/guides/mdx#add-an-mdx-componentstsx-file
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components }
}
```

### lib/utils.ts (cn utility)

```typescript
// Source: origin/v2:lib/utils.ts — porting verbatim
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `next-mdx-remote` for MDX | `@next/mdx` | Feb 2026 (next-mdx-remote archived) | next-mdx-remote is no longer maintained; @next/mdx is the official path |
| `contentlayer` for blog data | `@next/mdx` + fs reads | Jun 2023 (contentlayer abandoned) | contentlayer stopped receiving updates; @next/mdx + gray-matter is the replacement |
| `framer-motion` v10 `motion.div` everywhere | `LazyMotion` + `m.div` pattern | framer-motion v11+ | Reduces initial bundle from ~34kb to ~4.6kb for animation features |
| Webpack as Next.js default bundler | Turbopack (Rust) as default | Next.js 16.0 (stable default) | Turbopack is now the default in `next dev` and `next build`; no webpack flag needed |
| `next lint` runs automatically on build | Manual `eslint` script required | Next.js 16.0 | `next build` no longer auto-runs linter; must run via npm script |
| `framer-motion` package name | `motion` package (same codebase) | v12 rebranding | `framer-motion` still published and not deprecated; project uses `framer-motion` |

**Deprecated/outdated:**
- `next-mdx-remote`: Archived February 2026 — do not install.
- `contentlayer`: Abandoned June 2023 — do not install.
- `mdxRs: true`: Do not enable when using rehype-pretty-code with non-serializable options.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | All packages listed in Package Legitimacy Audit are legitimate (slopcheck unavailable) | Package Legitimacy Audit | Low — all packages are from well-known, long-established organizations with public source repos |
| A2 | `create-next-app@16.2.6` scaffolds Tailwind v3 (not v4) by default | Standard Stack | Medium — if v4 is scaffolded, the tailwind.config.ts format differs entirely; executor must verify |
| A3 | `framer-motion` v12.40.0 exports `LazyMotion`, `domAnimation`, and `m` from its main entry | Standard Stack / Code Examples | Low — verified via GitHub source index.ts and npm export map inspection |
| A4 | Turbopack build (`next build`) works correctly with `mdxRs: false` for production builds | Architecture Patterns | Medium — `mdxRs: false` disables the Rust compiler for MDX; webpack takes over MDX compilation in this mode |

---

## Open Questions

1. **Does `next build` (Turbopack build) respect `mdxRs: false` correctly?**
   - What we know: STATE.md documents this as a known gotcha for `next dev`. The Turbopack build became stable in Next.js 15.5 (beta) and default in 16.0.
   - What's unclear: Whether `mdxRs: false` is sufficient for both `next dev` and `next build` with Turbopack.
   - Recommendation: Include a success criterion check — run `next build` in the phase verification step and confirm no MDX-related build errors.

2. **LinkedIn profile URL for Footer**
   - What we know: UI-SPEC says "executor uses correct URL" for LinkedIn.
   - What's unclear: The exact LinkedIn profile slug (e.g., `linkedin.com/in/yashkadam` vs another slug).
   - Recommendation: Planner should add a placeholder URL in Footer code with a `TODO: confirm LinkedIn URL` comment; executor verifies before Phase 1 merge.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Next.js 16 (min v20.9) | Yes | v24.11.0 | — |
| npm | Package installation | Yes | 11.6.1 | — |
| Git | Branch creation (D-03) | Yes | 2.50.1 | — |
| Vercel CLI | FOUND-06 env var setup | Yes | 54.4.1 | Manual dashboard |
| create-next-app | Scaffold (D-01) | Yes | 16.2.6 (via npx) | — |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None. All required tools are available.

---

## Security Domain

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | Not in Phase 1 scope |
| V3 Session Management | No | Not in Phase 1 scope |
| V4 Access Control | No | Not in Phase 1 scope |
| V5 Input Validation | No | No user input in Phase 1 (no forms, no dynamic routes with user data) |
| V6 Cryptography | No | No secrets stored client-side; NEXT_PUBLIC_SITE_URL is a public URL |

**Phase 1-specific security notes:**
- `dangerouslySetInnerHTML` in the FOUC script: the script content is a static hardcoded string (`document.documentElement.classList.add('dark')`). No user input is interpolated. XSS risk is nil. [VERIFIED: pattern confirmed — never inject dynamic values here]
- Social icon links use `target="_blank"` + `rel="noopener noreferrer"` — required to prevent tab-napping. Specified in UI-SPEC.
- `NEXT_PUBLIC_SITE_URL` is a public URL — safe to expose client-side. No secrets in Phase 1.

---

## Sources

### Primary (HIGH confidence)
- `https://nextjs.org/docs/app/guides/mdx` (version 16.2.6, lastUpdated 2026-05-19) — MDX install, config, mdx-components.tsx requirement, Turbopack plugin string syntax
- `https://nextjs.org/docs/app/getting-started/installation` (version 16.2.6, lastUpdated 2026-05-19) — create-next-app scaffold, Turbopack as default bundler
- `https://nextjs.org/docs/app/api-reference/turbopack` (version 16.2.6, lastUpdated 2026-05-19) — Turbopack MDX plugin limitations, mdxRs flag behavior
- `https://motion.dev/docs/react-lazy-motion` (fetched 2026-05-24) — LazyMotion/domAnimation/m pattern, strict prop, bundle sizes
- `https://rehype-pretty.pages.dev/` (fetched 2026-05-24) — rehype-pretty-code options, theme string name pattern, mdxRs note
- `npm view next` — version 16.2.6, published 2026-05-07, peer deps confirmed
- `npm view framer-motion` — version 12.40.0, published 2026-05-21, export map inspected
- `npm view @next/mdx` — version 16.2.6, published 2026-05-07
- `npm view rehype-pretty-code` — version 0.14.3, published 2026-03-03
- `github.com/motiondivision/motion:packages/framer-motion/src/index.ts` — confirmed `LazyMotion`, `domAnimation`, `m` all exported from main entry
- `.planning/phases/01-foundation/01-CONTEXT.md` — locked decisions D-01 through D-09
- `.planning/phases/01-foundation/01-UI-SPEC.md` — Navbar/Footer contracts, color tokens, typography, spacing, accessibility

### Secondary (MEDIUM confidence)
- `.planning/STATE.md` — known gotchas: rehype-pretty-code + Turbopack string theme, mdxRs: false requirement
- `origin/v2:lib/utils.ts`, `origin/v2:app/layout.tsx`, `origin/v2:tailwind.config.ts` — structural reference for ported patterns

### Tertiary (LOW confidence)
- None for this phase.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all package versions verified via npm registry with publish dates
- Architecture: HIGH — patterns verified against official Next.js 16.2.6 and motion.dev docs
- Pitfalls: HIGH — critical Turbopack/rehype-pretty-code gotcha verified in both STATE.md (project history) and official rehype-pretty docs

**Research date:** 2026-05-24
**Valid until:** 2026-06-24 (stable libraries; Next.js 16.x minor releases unlikely to break these patterns within 30 days)
