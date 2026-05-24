---
phase: 01-foundation
created: 2026-05-24
status: active
---

# Walking Skeleton — Phase 1: Foundation

> This document records the architectural decisions made in Phase 1 that every subsequent phase inherits without renegotiation. Executors and planners in Phases 2–5 MUST read this file before adding new routes, components, or infrastructure.

---

## What the Skeleton Delivers

At Phase 1 completion, the following must be verifiably true:

1. `next build` exits 0 on Next.js 16.2.6 with TypeScript strict mode — no type errors.
2. `next dev` starts cleanly; visiting `http://localhost:3000` shows Navbar + Footer on a dark background with zero white flash.
3. A `.mdx` file at `content/blog/test-post.mdx` renders as HTML at a route — raw markdown text is NOT visible.
4. No `motion.div` import exists anywhere in the codebase — only `m.*` via `LazyMotion`.
5. `NEXT_PUBLIC_SITE_URL=https://yashkadam.com` is set in Vercel project env vars.
6. All work lives on branch `feat/next16-foundation`; `main` is untouched until PR merge.

---

## Architectural Decisions

### Framework & Bundler

| Decision | Value | Rationale |
|----------|-------|-----------|
| Framework | Next.js 16.2.6 | D-01 — fresh scaffold; Turbopack is the default bundler in Next.js 16 |
| Router | App Router (`app/`) | Continues v2 branch pattern; required for RSC and MDX pipeline |
| Bundler | Turbopack (default) | No `--turbopack` flag needed in Next.js 16 — it is the default for `next dev` and `next build` |
| TypeScript | 6.0.3, `strict: true` | create-next-app default; v2 branch carried `strict: true` forward |
| Module system | ESM (`.mjs` config files) | v2 branch pattern; `next.config.mjs` and `postcss.config.mjs` use ESM |

### Styling

| Decision | Value | Rationale |
|----------|-------|-----------|
| CSS framework | Tailwind CSS v3 (^3.4) | FOUND-01; pinned to v3 — v4 upgrade is deferred to PLSH-02 |
| Config format | `tailwind.config.ts` with `satisfies Config` | v2 branch TypeScript config pattern |
| `darkMode` | `["class"]` (array form) | Enables class-based dark mode toggling; `dark` class injected by inline script |
| Color system | CSS custom properties in `:root` via `globals.css` | Flat hex tokens — NOT Shadcn HSL vars; D-05 dark-only in Phase 1 |
| Color tokens | `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-accent`, `--color-accent-hover`, `--color-destructive` | UI-SPEC hex values |
| Component library | None in Phase 1 | shadcn/ui may be evaluated in Phase 2 |

### Typography

| Decision | Value | Rationale |
|----------|-------|-----------|
| Body/UI font | Inter — `next/font/google`, CSS var `--font-sans` | D-08 placeholder; final pair locked in Phase 2 |
| Code font | JetBrains Mono — `next/font/google`, weight 400+600, CSS var `--font-mono` | D-08 placeholder |
| Font loading | `next/font/google` with `variable` option | Self-hosted by Next.js; eliminates external CDN request |
| Token stability | `--font-sans` and `--font-mono` are stable | Only font-family values change in Phase 2, not the token names |

### Dark Mode

| Decision | Value | Rationale |
|----------|-------|-----------|
| Strategy | Inline blocking script — `document.documentElement.classList.add('dark')` | D-04; prevents FOUC without `next-themes` dependency |
| Script placement | First child of `<head>`, before any `<link rel="stylesheet">`, no `defer`/`async` | Must execute synchronously before first paint |
| Light mode | Not defined in Phase 1 | D-05; light mode CSS vars ship with toggle in Phase 5 (PLSH-01) |
| `next-themes` | Not installed | Deferred to PLSH-01 |

### MDX Pipeline

| Decision | Value | Rationale |
|----------|-------|-----------|
| MDX library | `@next/mdx` 16.2.6 + `@mdx-js/loader` + `@mdx-js/react` | FOUND-04; `next-mdx-remote` archived Feb 2026; `contentlayer` abandoned Jun 2023 |
| `mdxRs` | `false` in `next.config.mjs` | REQUIRED — Turbopack cannot serialize `rehype-pretty-code` options containing functions/objects |
| Syntax highlighter | `rehype-pretty-code` 0.14.3 + `shiki` 4.1.0 | FOUND-04; theme passed as string name only |
| Shiki theme | `"github-dark-dimmed"` (string, NOT imported object) | Critical Turbopack constraint — importing theme object crashes Turbopack build |
| `mdx-components.tsx` | Project root (same level as `app/`) | Required by Next.js App Router for `@next/mdx` to work |
| Content directory | `content/blog/` | MDX files stored here; populated from Phase 3 onwards |

### Animation

| Decision | Value | Rationale |
|----------|-------|-----------|
| Library | `framer-motion` 12.40.0 | Project decision; matches v2 branch package name |
| Pattern | `<LazyMotion features={domAnimation} strict>` in root layout | FOUND-03; reduces animation bundle from ~34kb to ~4.6kb |
| Import rule | `import { m } from 'framer-motion'` in leaf Client Components ONLY | `motion.*` is forbidden inside `<LazyMotion>`; `strict` prop enforces this at runtime |
| Phase 1 animations | None — Navbar and Footer render statically | First scroll animations ship in Phase 2 |
| Package naming | Use `framer-motion` (not `motion`) | Project locked to `framer-motion` package; `motion` package has different export paths |

### Layout Shell

| Decision | Value | Rationale |
|----------|-------|-----------|
| Navbar content | Site name "Yash Kadam" + links "Home" (`/`) + "Blog" (`/blog`) | D-06; no mobile hamburger menu in Phase 1 |
| Footer content | Name + copyright + GitHub/LinkedIn/Twitter(X) icons | D-07; targets: `github.com/yash-278`, `linkedin.com/in/yashkadam`, `twitter.com/yashkadam278` |
| Max content width | `max-w-5xl mx-auto px-6` | UI-SPEC container contract; applies to Navbar, Footer, and all future page sections |
| Navbar height | `h-14` (56px) | UI-SPEC; `<main>` gets `pt-14` to clear fixed nav |
| Icon library | `lucide-react` 1.16.0 | UI-SPEC; `Github`, `Linkedin`, `Twitter` icons in Footer |
| Accessibility | Skip link, `aria-label` on icon links, `aria-hidden` on SVG icons, `focus-visible` rings | UI-SPEC accessibility contract |

### Environment

| Decision | Value | Rationale |
|----------|-------|-----------|
| `NEXT_PUBLIC_SITE_URL` | `https://yashkadam.com` | FOUND-06; set in Vercel before first build; used for absolute OG URLs in later phases |
| `.env.local.example` | Documents `NEXT_PUBLIC_SITE_URL` | Developer documentation; not committed with real value |
| Branch strategy | `feat/next16-foundation` | D-03; merge to `main` via PR after Phase 1 criteria verified |

---

## Project Directory Layout

```
portfolio/                       # Fresh create-next-app scaffold (D-01)
├── app/
│   ├── layout.tsx               # Root layout: fonts, FOUC script, LazyMotion, Navbar, Footer
│   ├── page.tsx                 # Home placeholder (min-h-screen div)
│   └── globals.css              # CSS tokens (dark-only): --color-*, --font-*
├── components/
│   ├── Navbar.tsx               # Fixed top nav: logo + Home/Blog links
│   └── Footer.tsx               # Static footer: name, copyright, social icons
├── content/
│   └── blog/                    # .mdx files (populated from Phase 3; directory exists now)
│       └── test-post.mdx        # Smoke-test only; removed or kept as seed
├── lib/
│   └── utils.ts                 # cn() utility (clsx + tailwind-merge, ported from v2)
├── mdx-components.tsx           # Required by @next/mdx App Router — project root
├── next.config.mjs              # ESM: @next/mdx + rehype-pretty-code (mdxRs: false)
├── tailwind.config.ts           # darkMode: ["class"], custom color/font tokens
├── tsconfig.json                # @/* path alias, strict: true, bundler moduleResolution
├── postcss.config.mjs           # Standard Next.js PostCSS config (unchanged from scaffold)
└── .env.local.example           # Documents NEXT_PUBLIC_SITE_URL=https://yashkadam.com
```

---

## What Subsequent Phases Inherit (Do Not Re-decide)

| Phase | Inherits |
|-------|---------|
| Phase 2 (Portfolio) | `tailwind.config.ts` tokens, `cn()` utility, root layout shell (add sections to `app/page.tsx`), LazyMotion for section entrance animations, Navbar active state (add `usePathname` if needed) |
| Phase 3 (Blog) | `@next/mdx` pipeline, `mdx-components.tsx` (expand with prose components), `content/blog/` directory, `rehype-pretty-code` code highlighting |
| Phase 4 (SEO) | `NEXT_PUBLIC_SITE_URL` env var for absolute OG URLs, `middleware.ts` (new file, guard with `VERCEL_ENV === 'production'`) |
| Phase 5 (Polish) | `LazyMotion` + `domAnimation` pattern for all animations, dark mode toggle (`next-themes` + light mode CSS vars added to `globals.css`) |

---

## Constraints for All Future Phases

1. **Never add `'use client'` to `app/layout.tsx`** — root layout must remain a Server Component.
2. **Never import `motion.*` inside `<LazyMotion>`** — always use `m.*` from `framer-motion`.
3. **Never set `mdxRs: true`** — Turbopack cannot serialize `rehype-pretty-code` options.
4. **Never pass an imported theme object to `rehype-pretty-code`** — pass `"github-dark-dimmed"` string only.
5. **Tailwind v4 is out of scope** until PLSH-02 sprint — do not upgrade tailwindcss beyond v3.
6. **Light mode CSS vars are out of scope** until PLSH-01 — do not add `@media (prefers-color-scheme: dark)` or `.dark {}` blocks.
7. **`NEXT_PUBLIC_SITE_URL`** must be set in Vercel before any build that generates OG image URLs.
