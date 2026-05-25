# Phase 4: SEO & Deployment - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-25
**Phase:** 4-SEO & Deployment
**Areas discussed:** OG Image design, RSS feed depth, Subdomain redirect paths, Sitemap approach

---

## OG Image Design

### Background style

| Option | Description | Selected |
|--------|-------------|----------|
| Dark card + subtle gradient | Matches dark polished aesthetic — deep background, faint violet gradient wash or glowing edge | ✓ |
| Solid dark with border | Plain dark background, white text, colored border/accent bar | |
| You decide | Leave exact style to Claude's discretion | |

**User's choice:** Dark card + subtle gradient
**Notes:** Consistent with the rest of the site's dark polished aesthetic.

### OG image content

| Option | Description | Selected |
|--------|-------------|----------|
| Post title + site name | Large post title, yashkadam.com as subtitle/footer | ✓ |
| Post title + tags + site name | Adds tech tags as chips below the title | |
| Post title + your name + avatar | Personal brand angle with small photo | |

**User's choice:** Post title + site name
**Notes:** Simple and shareable — the post title is the hook.

### Fallback OG image

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — static default OG image | /public fallback for non-post pages | ✓ |
| No — just post pages get dynamic OG | Skip fallback, home inherits Phase 2 OG | |

**User's choice:** Yes — static default OG image

---

## RSS Feed Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Description-only | title, link, pubDate, frontmatter description — simple, drives traffic | ✓ |
| Full HTML content | Full rendered post body — RSS-reader-friendly, but requires MDX→HTML pipeline | |

**User's choice:** Description-only
**Notes:** Matches the REQUIREMENTS.md spec for BLOG-03 exactly.

---

## Subdomain Redirect Paths

| Option | Description | Selected |
|--------|-------------|----------|
| Always to yashkadam.com/blog | Any blog.yashkadam.com request goes to /blog regardless of path | ✓ |
| Path-preserving redirect | /old-slug → /blog/old-slug — preserves old links if slugs match | |

**User's choice:** Always to yashkadam.com/blog
**Notes:** Old blog.yashkadam.com used a different CMS with different slugs; path preservation has no benefit.

---

## Sitemap Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Next.js built-in app/sitemap.ts | Zero extra deps, native App Router, calls getAllPosts() directly | ✓ |
| next-sitemap package | More config options (priority, changefreq), adds postbuild script | |

**User's choice:** Next.js built-in app/sitemap.ts
**Notes:** No reason to add a dependency when the built-in handles the use case cleanly.

---

## Claude's Discretion

- Exact gradient/glow values in the OG image (violet accent recommended, specific values open)
- Whether og-default.jpg already exists from Phase 2 or needs to be created
- Font used inside `ImageResponse` (Geist or system-ui — whichever works with next/og)
- Exact `changefreq` and `priority` sitemap values
- Whether to extract metadata generation into a `lib/` helper

## Deferred Ideas

- JSON-LD `WebSite` + `Person` schema — v2 requirement SEO-05
- JSON-LD `Article` schema on post pages — v2 requirement BLOG-06
- Table of contents for long posts — v2 requirement BLOG-05
- Dark mode toggle — Phase 5 (PLSH-01)
- Vercel Analytics — Phase 5 (ANLYT-01)
