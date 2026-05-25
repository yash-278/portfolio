# Yash Kadam — Personal Portfolio

## What This Is

A personal portfolio and content hub for Yash Kadam, Technical Lead and fullstack developer, deployed at yashkadam.com. The site establishes an online presence, showcases selected projects, and serves as the foundation for future income streams including content creation, 1-on-1 developer mentoring, and consulting. Built with Next.js 16 and deployed on Vercel.

## Core Value

A first-time visitor (developer, potential client, or collaborator) should leave knowing exactly who Yash is, what he's built, and how to reach him — in under 60 seconds.

## Requirements

### Validated — v1.0

- ✓ Next.js 16.2.6 + TypeScript + Tailwind v3 scaffold on Vercel (FOUND-01) — v1.0
- ✓ Dark mode FOUC prevented via inline blocking script in root layout (FOUND-02) — v1.0
- ✓ Framer Motion LazyMotion + domAnimation pattern from project start (FOUND-03) — v1.0
- ✓ MDX pipeline configured via @next/mdx + rehype-pretty-code syntax highlighting (FOUND-04) — v1.0
- ✓ Shared Navbar and Footer visible on all pages (FOUND-05) — v1.0
- ✓ NEXT_PUBLIC_SITE_URL=https://www.yashkadam.com set in Vercel env vars (FOUND-06) — v1.0
- ✓ Hero section with name, title (Technical Lead), and one-line pitch — no typewriter animation (PORT-01) — v1.0
- ✓ About section with current role at KingsleyGate and brief background (PORT-02) — v1.0
- ✓ Work History timeline with companies, titles, and dates (PORT-03) — v1.0
- ✓ Projects section: Nekomori with GitHub link; Brew Index without GitHub (dead link removed) (PORT-04) — v1.0
- ✓ Contact section with GitHub, LinkedIn, Twitter/X links — no contact form (PORT-05) — v1.0
- ✓ Blog post list at /blog — title, date, description, reading time, newest first (BLOG-01) — v1.0
- ✓ Individual post pages at /blog/[slug] with MDX, typography, syntax highlighting (BLOG-02) — v1.0
- ✓ RSS feed at /feed.xml (BLOG-03) — v1.0
- ✓ Dynamic OG image per blog post via next/og (BLOG-04) — v1.0
- ✓ metadata with title, description, OG image on every page (SEO-01) — v1.0
- ✓ Sitemap at /sitemap.xml including all pages and blog posts (SEO-02) — v1.0
- ✓ robots.txt — allow on prod, disallow on staging (SEO-03) — v1.0
- ✓ middleware.ts redirecting blog.yashkadam.com → yashkadam.com/blog (308) (SEO-04) — v1.0
- ✓ Vercel Analytics enabled in root layout — cookieless, no consent banner (ANLYT-01) — v1.0

### Active — v1.1

- [ ] Project case study pages at `/projects/[slug]` (PROJ-01)
- [ ] JSON-LD `WebSite` + `Person` schema in root layout (SEO-05)
- [ ] JSON-LD Article schema on blog post pages (BLOG-06)
- [ ] Dark mode toggle via next-themes (PLSH-01)

### Out of Scope

| Feature | Reason |
|---------|--------|
| Animated skill progress bars | Credibility anti-pattern — replaced by tech tags on project cards |
| Typewriter / typing animation in hero | Cliché; slows first impression; static confident text is stronger |
| Contact form with server handling | Requires backend; spam-prone; direct email link converts better |
| CMS / visual editor (Sanity, etc.) | MDX in-repo is sufficient for infrequent, thoughtful posts |
| Preloader / loading screen | Adds perceived latency on a statically generated site |
| Particle.js / tsparticles background | Heavy client JS, destroys Core Web Vitals |
| Custom cursor | Breaks accessibility |
| Skills grid with 20+ logos sans project context | Reads as junior; skills shown through project tech tags |
| YouTube / video content integration | Not committing to video yet; written presence first |
| Twitter clone, Crown Clothing (Heroku), India Travel Agency, Jadoo | Older demo work; Heroku links dead; not representative of current level |
| Google Analytics with consent banner | Vercel Analytics is the correct choice — cookieless, no banner |
| Table of contents for long-form posts | Deferred to v1.1 if posts grow long enough to need it |

## Context

- **Codebase**: Next.js 16.2.6 + TypeScript + Tailwind v3 + Framer Motion; ~1,200 lines TypeScript/TSX/MDX
- **Deployment**: Vercel, yashkadam.com custom domain (www canonical)
- **Blog**: MDX files in `/content/blog` — git-native, no CMS
- **Role**: Technical Lead at KingsleyGate
- **Active projects**: Nekomori (TypeScript, anime schedules); Brew Index (Homebrew frontend, in progress — GitHub link dead)
- **Stack preference**: JavaScript + TypeScript; shifting toward backend/Go
- **GitHub**: github.com/yash-278 | **Twitter**: @yashkadam278
- **Performance**: LCP 2509ms, CLS 0, TBT 0ms — Lighthouse score 97/100 (as of 2026-05-25)

## Constraints

- **Tech stack**: Next.js 16+ with TypeScript, Tailwind CSS, Framer Motion
- **Deployment**: Vercel with yashkadam.com custom domain
- **Blog**: MDX files in-repo under `/content/blog` — no external CMS
- **Content**: Projects shown must be ones Yash is actively proud of; no placeholder/demo projects
- **Performance**: Static generation where possible; Core Web Vitals matter for credibility

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js over vanilla HTML | Component-based, Vercel-native, extends to blog/pages naturally | ✓ Good — statically generated, 97/100 Lighthouse |
| MDX in-repo for blog | Zero external dependency, git-native workflow suits infrequent thoughtful posts | ✓ Good — simple to maintain |
| blog.yashkadam.com → yashkadam.com/blog | Single destination, single codebase, no subdomain split | ✓ Good — proxy.ts 308 redirect works on Vercel |
| @next/mdx over next-mdx-remote / contentlayer | next-mdx-remote archived Feb 2026; contentlayer abandoned Jun 2023 | ✓ Good — @next/mdx is the maintained path |
| LazyMotion + domAnimation from Phase 1 | FOUC-safe and cannot be retrofitted without layout risk | ✓ Good — SectionReveal audit passed clean |
| rehype-pretty-code theme as string name (not import) | Turbopack ESM incompatibility with imported Shiki objects | ✓ Good — github-dark theme works cleanly |
| NEXT_PUBLIC_SITE_URL as www.yashkadam.com | Vercel canonical URL includes www; bare domain OG images would 404 | ✓ Good — OG images resolve correctly |
| Vercel Analytics outside LazyMotion boundary | Both analytics packages carry their own 'use client' directive | ✓ Good — root layout stays Server Component |
| github field typed as `https://${string}` | Compile-time URL safety; prevents non-URL strings at type level | ✓ Good — catches bad values before runtime |
| Brew Index GitHub link removed | Confirmed 404 at close; project card shown without GitHub link | ✓ Good — no dead links in production |
| Dark mode toggle deferred to v1.1 | Establishing presence first; toggle is enhancement not foundation | — Pending — active in v1.1 |
| Design direction: clean-professional with indigo-400 accent | Clean-professional won; indigo-400 (#818cf8) as primary accent | ✓ Good — consistent visual language |

## Current State

**Milestone v1.0 complete** — shipped 2026-05-25.

yashkadam.com is live: statically generated Next.js 16 portfolio + MDX blog with full SEO, analytics, and Core Web Vitals passing. Site is production-ready.

**Next Milestone Goals (v1.1):**
- Project case study pages at /projects/[slug]
- JSON-LD schema (WebSite, Person, Article)
- Dark mode toggle
- Additional blog content

---

## Evolution

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-25 after v1.0 milestone complete*
