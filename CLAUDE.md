## Project

**Yash Kadam — Personal Portfolio**

A personal portfolio and content hub for Yash Kadam, Technical Lead and fullstack developer, deployed at yashkadam.com. The site establishes an online presence, showcases selected projects, and serves as the foundation for future income streams including content creation, 1-on-1 developer mentoring, and consulting.

**Core Value:** A first-time visitor (developer, potential client, or collaborator) should leave knowing exactly who Yash is, what he's built, and how to reach him — in under 60 seconds.

Background docs live in `docs/` — `PROJECT.md` (requirements, key decisions, out-of-scope list), `ROADMAP.md`, `MILESTONES.md`, `RETROSPECTIVE.md`, and `research/` (pre-build research on the stack, architecture, and pitfalls).

### Constraints

- **Tech stack**: Next.js 16 App Router with TypeScript, Tailwind CSS v3, Framer Motion
- **Deployment**: Vercel, `www.yashkadam.com` canonical
- **Blog**: MDX files in-repo under `content/blog` — no external CMS
- **Content**: Projects shown must be ones Yash is actively proud of; no placeholder/demo projects
- **Performance**: Static generation everywhere; Core Web Vitals matter for credibility

## Technology Stack

- **Framework**: Next.js `^16.2.6` (App Router), React `19.2.4`
- **Language**: TypeScript `^5` in `strict` mode; path alias `@/*` → project root
- **Styling**: Tailwind CSS `^3.4` (`@tailwind` directives + PostCSS/autoprefixer), `@tailwindcss/typography` for prose. `clsx` + `tailwind-merge` via the `cn()` helper in `lib/utils.ts`
- **Animation**: `framer-motion` `^12.40`
- **MDX**: `@next/mdx` + `@mdx-js/loader`/`react`, `remark-frontmatter`, `rehype-pretty-code` (Shiki, `github-dark` theme)
- **Post metadata**: `gray-matter` (frontmatter) + `reading-time`
- **Fonts**: Albert Sans (UI and prose) and Geist Mono (code blocks) via `next/font/google`
- **Icons**: `lucide-react`
- **Analytics**: `@vercel/analytics` + `@vercel/speed-insights`
- **Tooling**: ESLint `^9` via `eslint-config-next` flat config; Prettier `^3` with `prettier-plugin-tailwindcss` (no config file — defaults)
- **No test framework** is installed.

### Commands

```bash
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint
```

### Environment

Only one variable: `NEXT_PUBLIC_SITE_URL` (see `.env.local.example`). Set to `https://www.yashkadam.com` in Vercel — the `www` matters, because OG image URLs are built from it and the bare domain 404s. Every consumer falls back to `https://yashkadam.com` when it's unset.

`VERCEL_ENV` is read (not set by us) to gate production-only behaviour in `proxy.ts` and `app/robots.ts`.

## Architecture

Single Next.js App Router codebase, fully statically generated. The portfolio is one scrolling page; the blog is a separate route tree. Both share the root layout.

### Routes

| Route | File | Notes |
|-------|------|-------|
| `/` | `app/page.tsx` | Portfolio one-pager: hero, projects, an about/writing pair, contact |
| `/blog` | `app/blog/page.tsx` | Post index, newest first |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | `generateStaticParams` + `dynamicParams = false`; dynamic-imports the MDX file, `notFound()` on miss |
| `/blog/[slug]/opengraph-image` | `app/blog/[slug]/opengraph-image.tsx` | Per-post OG image via `next/og` `ImageResponse` |
| `/feed.xml` | `app/feed.xml/route.ts` | Hand-rolled RSS 2.0 with XML escaping |
| `/sitemap.xml` | `app/sitemap.ts` | Static pages + every post |
| `/robots.txt` | `app/robots.ts` | Allows crawling only when `VERCEL_ENV === 'production'` |
| `/steadyfolio` | `app/steadyfolio/page.tsx` | Product landing page with its own layout, header and footer; `Navbar`/`Footer` opt out of this route. The beta button reads `TESTFLIGHT_URL` in `components/steadyfolio/beta.ts` |

`proxy.ts` redirects `blog.yashkadam.com` → `https://www.yashkadam.com/blog` with a 308, production-gated.

### Layers

- **`app/layout.tsx`** — root layout. Loads fonts, the dark-mode FOUC script, `Navbar`, `Footer`, and analytics; wraps `children` in `LazyMotion`.
- **`components/`** — `HeroSection`, `ProjectsSection`, `AboutSection`, `WritingSection`, `ContactSection`, plus shared `Navbar`, `Footer`, and the `SectionReveal` animation primitive.
- **`lib/posts.ts`** — the only content-reading module. `getAllPosts()` reads `content/blog/*.mdx`, parses frontmatter, filters to `published: true`, warns-and-skips posts missing `title`/`date`/`description`, computes reading time from the body, and sorts newest first. Everything (index, post metadata, sitemap, RSS, OG images) goes through it.
- **`content/blog/*.mdx`** — the posts themselves.
- **`lib/utils.ts`** — `cn()` class merge helper.

### Design tokens

Colors and fonts are CSS custom properties declared in `app/globals.css` and exposed to Tailwind as semantic names in `tailwind.config.ts`: `bg`, `surface` / `surface-raised`, `text` / `text-muted`, `border`, `accent` / `accent-hover`, `destructive`, plus `font-sans` / `font-mono`. **Use the semantic names** (`bg-surface`, `text-text-muted`, `text-accent`) rather than raw palette values like `bg-zinc-900` — that indirection is what makes the light-mode toggle possible later. The palette is a dark teal-ink with a sand accent. The one sanctioned exception is the `/steadyfolio` product page, which runs on the iOS app's own dark tokens (`--sf-*`, scoped under `[data-site='steadyfolio']` in `globals.css`) and must not follow the site theme.

The site is currently **dark-only**. `darkMode: ['class']` is configured, but `dark` is force-added to `<html>` by an inline script and there is no toggle yet (deferred to v1.1).

## Conventions

### Blog post frontmatter

```yaml
---
title: "Post Title"
date: "2026-05-20"        # ISO date-only; rendered in UTC
description: "One-line summary used in the index, RSS, and OG tags."
tags: ["nextjs", "typescript"]
published: true           # omit or set false and the post is invisible everywhere
---
```

### Code style

- Prettier defaults with the Tailwind class-sorting plugin. Style is not fully uniform across the codebase — some files use single quotes and no semicolons, others double quotes with semicolons. Match the file you're editing.
- Components are `PascalCase.tsx` with a default export; `lib/` modules are lowercase with named exports.
- Comments are used sparingly, and mostly to record *why* a non-obvious constraint exists (see the load-bearing ones below). Keep that habit: explain constraints, not mechanics.
- Section IDs on the portfolio page are lowercase anchors (`#projects`, `#about`, `#writing`, `#contact`).

### Load-bearing constraints

These are deliberate and easy to break by "cleaning up". Each is annotated in-place:

- **`experimental.mdxRs: false`** in `next.config.mjs` — required, or the rehype plugins (syntax highlighting) silently stop running.
- **`rehype-pretty-code` theme is a string name**, not an imported Shiki object — Turbopack can't handle the imported object form.
- **The root layout must stay a Server Component.** Do not add `'use client'` to `app/layout.tsx`.
- **`LazyMotion features={domAnimation} strict`** — leaf Client Components must use `m.*`, not `motion.*`; `motion.*` throws at runtime under `strict`. This keeps the animation bundle at ~4.6kb instead of ~34kb.
- **`<Analytics />` and `<SpeedInsights />` sit outside the `LazyMotion` boundary** — both packages carry their own `'use client'` directive.
- **The FOUC script must be the first child of `<head>`**, before any stylesheet, with no `defer`/`async`.
- **`mdx-components.tsx` must stay at the project root**, alongside `app/` — `@next/mdx` requires it there.
- **Animations go through `SectionReveal`** rather than being written ad hoc, so timing stays consistent and auditable in one place.

### Error handling

No error boundaries or `error.tsx` yet. The patterns in use are fail-soft at the content layer: `getAllPosts()` returns `[]` if the blog directory is missing and skips malformed posts with a `console.warn`; a missing MDX file triggers `notFound()`.

## Legacy files — do not edit

The repo still contains the 2021 vanilla-HTML portfolio that this app replaced: `index.html`, `src/`, `dist/`, `sample.txt`, `meta.png`, `.stylelintrc`, and the stale `README.md`. None of it is served by the Next.js app or referenced by any live code. Don't edit these to change the site, and don't treat them as describing current conventions.
